// =====================================================================
// PRE-VIAJE · Intermediario con CORS restringido (Supabase Edge Function)
//
// Solo acepta solicitudes cuyo encabezado Origin esté en ALLOWED_ORIGINS.
// Guarda las claves en el servidor (la app no necesita la clave anon) y
// reenvía a la API de Supabase: /rest, /auth y /storage.
//
// Despliegue:
//   supabase functions deploy previaje-api --no-verify-jwt
//   supabase secrets set ALLOWED_ORIGINS=https://elizabethgarcia-svg.github.io
// SUPABASE_URL y SUPABASE_ANON_KEY los inyecta Supabase automáticamente.
// =====================================================================

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const ALLOWED = (Deno.env.get("ALLOWED_ORIGINS") ?? "https://elizabethgarcia-svg.github.io")
  .split(",").map((o) => o.trim().replace(/\/$/, "")).filter(Boolean);

const PREFIJOS = ["/rest/v1/", "/auth/v1/", "/storage/v1/"];

function origenPermitido(req: Request): string | null {
  const origin = req.headers.get("origin");
  if (!origin) return null;
  return ALLOWED.includes(origin.replace(/\/$/, "")) ? origin : null;
}

function cors(origin: string): HeadersInit {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, content-type, prefer, x-upsert, range, accept",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };
}

Deno.serve(async (req) => {
  const origin = origenPermitido(req);
  if (!origin) {
    return new Response(JSON.stringify({ error: "Origen no autorizado" }), { status: 403, headers: { "Content-Type": "application/json" } });
  }
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors(origin) });

  // La ruta llega como /previaje-api/rest/v1/evaluaciones → se recorta el nombre de la función
  const url = new URL(req.url);
  const ruta = url.pathname.replace(/^.*?\/previaje-api/, "");
  if (!PREFIJOS.some((p) => ruta.startsWith(p))) {
    return new Response(JSON.stringify({ error: "Ruta no permitida" }), { status: 404, headers: { ...cors(origin), "Content-Type": "application/json" } });
  }

  const destino = SUPABASE_URL + ruta + url.search;
  const headers = new Headers();
  for (const h of ["content-type", "prefer", "x-upsert", "range", "accept"]) {
    const v = req.headers.get(h); if (v) headers.set(h, v);
  }
  headers.set("apikey", ANON_KEY);
  // Sesión del operador si la trae; si no, la clave anon (necesaria para iniciar sesión)
  headers.set("authorization", req.headers.get("authorization") ?? ("Bearer " + ANON_KEY));

  const resp = await fetch(destino, {
    method: req.method,
    headers,
    body: req.method === "GET" || req.method === "HEAD" ? undefined : req.body,
  });

  const salida = new Headers(cors(origin));
  for (const h of ["content-type", "content-range", "content-length"]) {
    const v = resp.headers.get(h); if (v) salida.set(h, v);
  }
  return new Response(resp.body, { status: resp.status, headers: salida });
});
