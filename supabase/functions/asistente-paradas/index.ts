// =====================================================================
// PRE-VIAJE · Asistente de paradas con Claude (Supabase Edge Function)
//
// Recibe { pregunta, historial, paradas, posicion, unidad, ruta } desde la
// app, responde en español citando solo paradas del catálogo recibido y
// devuelve { texto, ids } (ids = paradas mencionadas, para resaltarlas).
//
// Despliegue:
//   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
//   supabase secrets set ALLOWED_ORIGINS=https://elizabethgarcia-svg.github.io
//   supabase functions deploy asistente-paradas --no-verify-jwt
// =====================================================================
import Anthropic from "npm:@anthropic-ai/sdk";

const ALLOWED = (Deno.env.get("ALLOWED_ORIGINS") ?? "https://elizabethgarcia-svg.github.io")
  .split(",").map((o) => o.trim().replace(/\/$/, "")).filter(Boolean);
const client = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });

type Parada = { id: string; nombre: string; tipo: string; km: number; localidad: string; estado: string; lat: number; lon: number; servicios: string[]; horario?: string; tel?: string; nota?: string };

function cors(origin: string): HeadersInit {
  return { "Access-Control-Allow-Origin": origin, "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "authorization, content-type", "Vary": "Origin" };
}
const json = (body: unknown, status: number, headers: HeadersInit) => new Response(JSON.stringify(body), { status, headers: { ...headers, "Content-Type": "application/json" } });

const SISTEMA = `Eres CONVOY, el asistente de ruta de Pre-Viaje, la app de seguridad de los operadores de tractocamión de ILG en México (todo el territorio nacional). Preséntate como CONVOY cuando te saluden.
Tu tarea es ayudar al operador con: (1) paradas AUTORIZADAS para detenerse, cargar combustible, comer, bañarse o pernoctar; (2) restricciones y zonas de riesgo (prohibido circular, no iniciar viaje, resguardo obligatorio, prohibido detenerse) y si están activas a la hora actual; (3) lugares prohibidos; (4) reglas permanentes y reglas por cliente; (5) a quién llamar según el nivel de escalamiento.
Reglas:
- Responde en español de México, de tú, breve y claro (máximo 6 líneas). Si recibes el nombre del operador, úsalo de vez en cuando (solo el primer nombre). El operador lee en el celular, a veces con prisa.
- Niveles de escalamiento: el nivel 1 es el Centinela de Ruta y el nivel 2 el Centinela de Seguridad (Cabina de Seguridad = Centinelas). Usa esos nombres y los teléfonos del JSON.
- Protocolos de la empresa (respóndelos tal cual cuando apliquen):
  · Falla mecánica: paro de motor inmediato y monitoreo activo; detenerse en lugar seguro fuera del carril; llamar al Centinela de Ruta; no aceptar ayuda de particulares ni abandonar la unidad.
  · Lo siguen, intento de robo o asalto: NO detenerse; accionar el botón de pánico o la alerta de cámara; comunicarse si es posible con el Centinela de Seguridad para buscar un resguardo seguro y llevar la unidad en monitoreo activo; nunca poner en riesgo la vida, no resistirse si lo detienen por la fuerza.
  · Detención por autoridad: no resistirse y colaborar; identificar si la unidad y el oficial son verídicos; avisar al Centinela de Ruta antes de bajar o entregar documentos (y al Centinela de Seguridad por tratarse de autoridad); mostrar licencia, tarjeta de circulación y carta porte sin entregar originales ni dinero; tomar nombre, corporación y número de unidad del oficial.
  · Siniestro o accidente: si hay lesionados, 911; llamar al Centinela de Seguridad indicando qué pasó y los daños; esperar indicaciones (ellos reportan a la aseguradora) y compartir la información que soliciten.
  · Horas de servicio: máximo 14 h de conducción; si manejó más de 14 h, descanso mínimo de 8 h; si manejó menos de 8 h, descanso mínimo de 4 h antes del siguiente viaje; pausa de 30 min cada 5 h de manejo; descanso efectivo de 8 h dentro de las últimas 24 h.
  · Si en el tramo del operador no hay zona de resguardo o parada autorizada, indícale consultar con el Centinela de Seguridad.
- Solo puedes usar la información del JSON que recibes (paradas, zonas, prohibidos, puntosClave, reglas, escalamiento, clientes). Nunca inventes lugares, teléfonos, horarios ni servicios. Si nada cumple lo que pide, dilo y ofrece la parada autorizada más cercana.
- Las zonas tienen horario (desde/hasta en horas; 0 a 24 = todo el día; 'sabado' aplica solo sábados). Usa la hora actual que recibes para decir si una restricción está ACTIVA AHORA.
- Si el operador pregunta por un lugar que aparece en prohibidos o cuyo punto clave dice que NO es parada, dilo de forma inequívoca.
- Cuando menciones una parada, escribe su nombre, el tipo, el km y los servicios relevantes. Si el operador pide teléfono, inclúyelo.
- Si hay posición del teléfono, usa la distancia aproximada (lat/lon) para decir cuál queda más cerca.
- Recuerda siempre al final que solo esas paradas están autorizadas y que toda detención se avisa al Centinela (Cabina de Seguridad, 444 149 2690) con paro de motor. No detenerse en carretera, acotamiento ni lugares desolados.
- No respondas temas ajenos a paradas, ruta y seguridad del viaje; redirige amablemente.
Al final de tu respuesta agrega una línea exacta con los ids de las paradas que mencionaste, en este formato: IDS: id1, id2`;

Deno.serve(async (req) => {
  const origin = (req.headers.get("origin") ?? "").replace(/\/$/, "");
  if (!ALLOWED.includes(origin)) return json({ error: "Origen no autorizado" }, 403, {});
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });
  if (req.method !== "POST") return json({ error: "Método no permitido" }, 405, cors(origin));

  let cuerpo: { pregunta?: string; historial?: { de: string; texto: string }[]; paradas?: Parada[]; zonas?: unknown[]; prohibidos?: unknown[]; puntosClave?: unknown[]; reglas?: unknown[]; escalamiento?: unknown[]; clientes?: unknown[]; posicion?: { lat: number; lon: number } | null; unidad?: string | null; ruta?: string | null; hora?: string; nombre?: string | null };
  try { cuerpo = await req.json(); } catch { return json({ error: "JSON inválido" }, 400, cors(origin)); }
  const pregunta = (cuerpo.pregunta ?? "").toString().slice(0, 500).trim();
  const paradas = Array.isArray(cuerpo.paradas) ? cuerpo.paradas.slice(0, 200) : [];
  if (!pregunta || !paradas.length) return json({ error: "Falta la pregunta o el catálogo" }, 400, cors(origin));

  const contexto = "DATOS DE CABINA (JSON):\n" + JSON.stringify({ paradas, zonas: cuerpo.zonas ?? [], prohibidos: cuerpo.prohibidos ?? [], puntosClave: cuerpo.puntosClave ?? [], reglas: cuerpo.reglas ?? [], escalamiento: cuerpo.escalamiento ?? [], clientes: cuerpo.clientes ?? [] }) +
    "\n\nHORA ACTUAL (ISO, hora local del operador): " + (cuerpo.hora ?? new Date().toISOString()) +
    "\n\nCONTEXTO DEL OPERADOR: " + (cuerpo.nombre ? "nombre " + String(cuerpo.nombre).slice(0, 80) + " · " : "") + "unidad " + (cuerpo.unidad ?? "desconocida") + " · ruta " + (cuerpo.ruta ?? "no indicada") +
    (cuerpo.posicion ? " · posición del teléfono lat " + cuerpo.posicion.lat + ", lon " + cuerpo.posicion.lon : " · sin posición del teléfono");

  const historial = (cuerpo.historial ?? []).slice(-6).map((m) => ({ role: m.de === "yo" ? "user" as const : "assistant" as const, content: m.texto }));
  // El historial debe empezar con un turno de usuario y alternar; se limpia por seguridad
  const mensajes: { role: "user" | "assistant"; content: string }[] = [];
  for (const m of historial) { if (!mensajes.length && m.role !== "user") continue; if (mensajes.length && mensajes[mensajes.length - 1].role === m.role) continue; mensajes.push(m); }
  if (mensajes.length && mensajes[mensajes.length - 1].role === "user") mensajes.pop();
  mensajes.push({ role: "user", content: pregunta });

  try {
    const resp = await client.beta.messages.create({
      model: "claude-opus-5-5",
      max_tokens: 1024,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "low" },
      system: [{ type: "text", text: SISTEMA }, { type: "text", text: contexto, cache_control: { type: "ephemeral" } }],
      messages: mensajes,
    });
    if (resp.stop_reason === "refusal") return json({ texto: "No puedo responder eso aquí. Para paradas autorizadas pregunte por lugar, kilómetro o servicio; para cualquier otra duda llame a Cabina (444 149 2690).", ids: [] }, 200, cors(origin));
    let texto = resp.content.filter((b) => b.type === "text").map((b) => (b as { text: string }).text).join("\n").trim();
    let ids: string[] = [];
    const m = texto.match(/IDS:\s*(.*)$/m);
    if (m) { ids = m[1].split(",").map((x) => x.trim()).filter((x) => paradas.some((p) => p.id === x)); texto = texto.replace(/\n?IDS:.*$/m, "").trim(); }
    return json({ texto, ids }, 200, cors(origin));
  } catch (e) {
    if (e instanceof Anthropic.RateLimitError) return json({ error: "Muchas consultas a la vez. Intente en un momento." }, 429, cors(origin));
    if (e instanceof Anthropic.AuthenticationError) return json({ error: "Clave de IA no configurada." }, 500, cors(origin));
    if (e instanceof Anthropic.APIError) return json({ error: "Error del asistente: " + e.message }, 502, cors(origin));
    return json({ error: "Error inesperado" }, 500, cors(origin));
  }
});
