# Autoevaluación Pre-Viaje · Operadores de tractocamión

Encuesta de autoevaluación que realiza el operador antes de salir a ruta. Un solo archivo (`index.html`), sin dependencias de servidor, diseñado para celular. Al terminar muestra el dictamen **APTO** o **NO APTO** y permite enviarlo a Cabina de Seguridad por WhatsApp.

## Flujo

1. **Inicio y horas de servicio** (barrera obligatoria). El operador captura su nombre y número económico; la app consulta el GPS y muestra un tablero en vivo tipo horas de servicio: estado (ON/OFF con cronómetro), pausa actual, manejo acumulado, ventana de 24 h y horas restantes. Solo si cumple las reglas aparece "Continuar evaluación"; si no, se bloquea con cuenta regresiva.
2. **Compromiso del operador**: texto de compromiso (NOM-087-SCT-2-2017, paradas autorizadas, reporte a Cabina) que debe aceptarse para continuar.
3. **Foto y ubicación**: foto del operador con la cámara del teléfono (obligatoria) y ubicación del dispositivo (recomendada; si no hay permiso se usa la del GPS de la unidad).
4. **Datos** del operador y unidad (nombre, número económico, fecha y hora, ruta).
5. **Estado físico**: horas de sueño, cansancio (1–5), malestar, medicamentos, alcohol.
6. **Estado emocional**: ánimo (1–5), estrés (1–5), capacidad de atención, eventos del día.
7. **Visión (lea el letrero)**: tres letreros de carretera cada vez más chicos, con cuatro opciones parecidas (dígito cambiado, unidad cambiada, letra parecida). Las frases salen de un banco de 42 letreros y no se repiten en evaluaciones consecutivas del mismo teléfono. 3/3 en regla, 2/3 observación (+1), 1 o menos: crítico.
8. **Reacción y vigilancia (toque)**: pantalla en negro; tras 2 a 5 s aparece un cronómetro y el operador debe tocar lo antes posible. Cinco intentos; a tiempo = menos de 1 000 ms; se cuentan los toques anticipados. 4 o 5 a tiempo en regla, 3 observación (+1), 2 o menos: crítico. Se puede repetir una vez (queda registrado).
9. **Revisión de la unidad**: llantas, frenos, luces, acoplamiento, documentos, equipo de emergencia. Cualquier "No" en llantas, frenos, luces o acoplamiento genera un folio de Mantenimiento y la unidad no sale; el equipo de emergencia solo genera folio para dotarlo y no impide la salida.
10. **Reglas de la ruta**: cinco confirmaciones de restricciones (no detenerse en carretera ni lugares desolados, solo pensiones oficiales, límite de 100 km/h, no manipular cámaras, solicitar paro de motor en cada detención). Cada "No" suma 2 puntos y queda listado en el dictamen como reinstrucción que Cabina debe dar antes de salir.
11. **Confirmación**: resumen, declaración de veracidad y firma con el dedo (o firma escrita).
12. **Dictamen** con factores detectados, identificación (foto, ubicación, compromiso), folio, folio de Mantenimiento cuando aplica, envío por WhatsApp a Cabina de Seguridad (444 149 2690) como **imagen del dictamen** (generada en el teléfono: letrero, identidad con foto, horas de servicio, factores, folios y firma) o como texto, y copia del resumen. El envío de imagen usa el menú de compartir del teléfono; si el navegador no lo permite, la imagen se guarda y se abre el chat de Cabina para adjuntarla. Si el NO APTO se debe a horas de sueño o cansancio alto, indica en cuántas horas y a qué hora volver a hacer la evaluación (3 h si durmió menos de 5 h, 2 h si durmió entre 5 y 6 h o se declara con cansancio alto).

12. **Paradas y reglas** (tras el dictamen APTO y su envío), con el mismo lenguaje de carretera del resto de la app (señal restrictiva roja para las restricciones activas, señales azules de servicios por tipo de parada, poste de kilometraje para la distancia, escudos de carretera para región y número de ruta, mapa vertical de tramos para las zonas de riesgo, letreros blancos para las reglas permanentes, señal de ALTO para los lugares prohibidos, señal verde de destino para las reglas por cliente y letrero SOS de auxilio en carretera para el escalamiento). Información tomada de la Consola del Centinela de Cabina: 105 paradas autorizadas en toda la república (49 paradores, 36 pensiones, 18 gasolineras, 1 patio propio y 1 punto de entrega de cliente; con estado, región, instrucciones de uso, distancia y "Cómo llegar"), 23 zonas con restricción de horario (prohibido circular, no iniciar viaje, resguardo obligatorio, prohibido detenerse) con indicador de cuáles están **activas ahora**, lugares prohibidos, reglas permanentes, reglas por cliente y los 4 niveles de escalamiento con botón de llamada. Un **asistente** responde preguntas de ruta ("pensión para pernoctar cerca de Saltillo", "¿puedo circular por la 57 de noche?", "¿a quién llamo si me detiene la autoridad?", "reglas de Bafar", "¿puedo parar en El Mixteco?"). Funciona sin internet; opcionalmente se conecta un asistente con IA (Claude) en el servidor.

Cada sección se encabeza con una señal de carretera (preventiva amarilla, informativa azul, destino verde, restrictiva roja) y un poste kilométrico con el número de tramo.

## Reglas de fatiga (bloquean la evaluación)

Configurables en el objeto `REGLAS` al inicio del script (los umbrales de visión y reacción están en `PRUEBAS`) (referencia NOM-087-SCT-2-2017):

| Parámetro | Valor | Significado |
|---|---|---|
| `maxConduccion` | 14 h | Al llegar a este acumulado continuo corresponde descanso obligatorio |
| `descansoEfectivo` | 8 h | Descanso mínimo tras alcanzar el máximo |
| `pausaReinicio` | 6 h | Una pausa de esta duración o mayor cierra la jornada y permite continuar |
| `ventanaDescanso` | 24 h | Debe existir un descanso efectivo dentro de este periodo previo a la encuesta |
| `minimoParaViaje` | 4 h | Horas de conducción disponibles que se exigen para tomar un viaje. Con menos, se bloquea hasta completar 8 h de descanso efectivo aunque no haya llegado a 14 h (candado anti-viaje) |
| `avisoRestante` | 6 h | Horas restantes a partir de las cuales se advierte al operador |
| `conduccionSinPausa` | 5 h | Manejo seguido tras el cual se recomienda una pausa corta |
| `pausaCorta` | 30 min | Duración de la pausa corta recomendada |
| `pausaCortaBloquea` | false | Si es `true`, la pausa corta pendiente también bloquea la evaluación (hoy solo advierte) |

Si el operador está bloqueado, la pantalla muestra "Por el momento no puede realizar la prueba", la hora a partir de la cual podrá presentarla y una cuenta regresiva que se actualiza sola.

## Dictamen

- Cualquier **factor crítico** (sueño < 5 h, cansancio ≥ 4, medicamento que da sueño, alcohol, no poder mantener la atención, falla en llantas, frenos, luces, acoplamiento o documentos) vuelve NO APTO.
- Los factores de **riesgo** suman puntos; con `puntosNoApto` (4) o más, el dictamen es NO APTO.

## Conexión con la plataforma GPS

El archivo incluye un **modo demostración** con unidades de ejemplo (`T-118`, `T-311`, `T-204`, `T-077`, `T-422`, `T-330`, `T-500`). Para producción, reemplace `GPS_PROVIDER.consultarActividad` por la llamada a la API de telemetría (Geotab, Samsara, Webfleet, etc.). Debe devolver:

```js
{ unidad, ubicacion: { texto }, desde: Date, segmentos: [{ inicio: Date, fin: Date }] }
```

con los periodos de conducción (motor en movimiento) desde `desde` hasta ahora. Si el GPS no responde, el operador puede declarar sus horas manualmente y la evaluación queda marcada como **pendiente de validación** por Cabina.

## Diseño

El diseño sigue el sistema documentado en `design-system/pre-viaje-operador/MASTER.md`, sintetizado con la habilidad
`ui-ux-pro-max` instalada en `.claude/skills/ui-ux-pro-max`: estilo Minimalism & Swiss + Flat, modo noche OLED,
identidad de carretera (azul marino del logo ILG, amarillo de línea central, escudo de carretera federal, señales SIGA/ALTO), tipografía Saira Extra Condensed + Barlow, targets de 48 px, estados con icono y
texto, resumen de errores enfocable y alternativa de firma escrita.

## Conexión a la base de datos (Supabase, opcional)

1. Cree el proyecto en Supabase y pegue `db/schema.sql` en el SQL Editor (crea tablas, RLS y políticas).
2. En `index.html`, busque `const SUPABASE = { url: '', anonKey: '' }` y pegue la URL del proyecto y la clave *anon public* (Settings → API).
3. Dé de alta a los operadores en Authentication → Users con `{"rol": "operador"}` en los metadatos, y un renglón en la tabla `operadores` con su nombre; a Cabina y Mantenimiento con su rol correspondiente.

Con eso la app pide inicio de sesión al operador, guarda cada dictamen (horas GPS, pruebas, factores, respuestas, foto, firma e imagen del dictamen en el bucket privado `evaluaciones`), crea el folio de Mantenimiento y registra la alerta de resguardo en cuanto hay un bloqueo por fatiga. Sin señal, lo pendiente se guarda en el teléfono y se envía solo al recuperar conexión. Con los dos campos vacíos, la app trabaja solo en el teléfono como hasta ahora.

## Datos de Cabina (consola del Centinela)

Los datos de paradas, zonas, prohibidos, puntos clave, reglas, escalamiento, clientes y el índice de lugares se extraen del HTML de la consola y quedan embebidos en `index.html` (bloque `CABINA`) para que la app funcione sin señal. Para actualizar cuando Cabina cambie la consola:

```bash
node scripts/extraer-consola.js "ruta/Consola_del_Centinela.html"
```

El script regenera `datos/cabina.json`, los CSV de revisión en `datos/` y el bloque embebido. Si la app está conectada a Supabase, además lee la tabla `paradas` al iniciar sesión.

## Asistente de paradas con IA (opcional)

Para que el asistente entienda preguntas libres con Claude (recibe paradas, zonas, prohibidos, puntos clave, reglas, escalamiento y clientes como contexto, y la hora actual para saber qué restricciones están activas):

```bash
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
supabase secrets set ALLOWED_ORIGINS=https://elizabethgarcia-svg.github.io
supabase functions deploy asistente-paradas --no-verify-jwt
```

y en `index.html`: `const ASISTENTE = { endpoint: 'https://<ref>.supabase.co/functions/v1/asistente-paradas' }`. La función solo acepta el origen de la app, responde únicamente con paradas del catálogo y, si no hay señal o falla, la app vuelve al asistente local.

## Instalar como app en el teléfono (PWA)

La página incluye `manifest.webmanifest`, íconos en `assets/icons/` y `sw.js` (funciona sin señal una vez abierta). Publicada por HTTPS (GitHub Pages):

- **iPhone (Safari):** botón Compartir → **Agregar a pantalla de inicio**. La propia app muestra esta guía al abrirse en iPhone.
- **Android (Chrome):** aparece el botón **Instalar Pre-Viaje en este teléfono** en la pantalla de inicio, o en el menú ⋮ → **Instalar app**.

Queda con el ícono ILG, a pantalla completa y con la última versión descargada.

## Publicación

Suba `index.html` a cualquier hosting estático (GitHub Pages, Netlify, S3). Debe servirse por HTTPS para que el teléfono pueda compartir su ubicación.
