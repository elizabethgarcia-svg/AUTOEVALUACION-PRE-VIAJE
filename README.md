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
9. **Revisión de la unidad**: llantas, frenos, luces, acoplamiento, documentos, equipo de emergencia.
10. **Confirmación**: resumen, declaración de veracidad y firma con el dedo (o firma escrita).
11. **Dictamen** con factores detectados, identificación (foto, ubicación, compromiso), folio, envío por WhatsApp y copia del resumen.

Cada sección se encabeza con una señal de carretera (preventiva amarilla, informativa azul, destino verde, restrictiva roja) y un poste kilométrico con el número de tramo.

## Reglas de fatiga (bloquean la evaluación)

Configurables en el objeto `REGLAS` al inicio del script (los umbrales de visión y reacción están en `PRUEBAS`) (referencia NOM-087-SCT-2-2017):

| Parámetro | Valor | Significado |
|---|---|---|
| `maxConduccion` | 14 h | Al llegar a este acumulado continuo corresponde descanso obligatorio |
| `descansoEfectivo` | 8 h | Descanso mínimo tras alcanzar el máximo |
| `pausaReinicio` | 6 h | Una pausa de esta duración o mayor cierra la jornada y permite continuar |
| `ventanaDescanso` | 24 h | Debe existir un descanso efectivo dentro de este periodo previo a la encuesta |
| `avisoRestante` | 2 h | Horas restantes a partir de las cuales se advierte al operador |
| `conduccionSinPausa` | 5 h | Manejo seguido tras el cual se recomienda una pausa corta |
| `pausaCorta` | 30 min | Duración de la pausa corta recomendada |
| `pausaCortaBloquea` | false | Si es `true`, la pausa corta pendiente también bloquea la evaluación (hoy solo advierte) |

Si el operador está bloqueado, la pantalla muestra "Por el momento no puede realizar la prueba", la hora a partir de la cual podrá presentarla y una cuenta regresiva que se actualiza sola.

## Dictamen

- Cualquier **factor crítico** (sueño < 5 h, cansancio ≥ 4, medicamento que da sueño, alcohol, no poder mantener la atención, falla en llantas, frenos, luces, acoplamiento o documentos) vuelve NO APTO.
- Los factores de **riesgo** suman puntos; con `puntosNoApto` (4) o más, el dictamen es NO APTO.

## Conexión con la plataforma GPS

El archivo incluye un **modo demostración** con unidades de ejemplo (`T-118`, `T-311`, `T-204`, `T-077`, `T-422`, `T-500`). Para producción, reemplace `GPS_PROVIDER.consultarActividad` por la llamada a la API de telemetría (Geotab, Samsara, Webfleet, etc.). Debe devolver:

```js
{ unidad, ubicacion: { texto }, desde: Date, segmentos: [{ inicio: Date, fin: Date }] }
```

con los periodos de conducción (motor en movimiento) desde `desde` hasta ahora. Si el GPS no responde, el operador puede declarar sus horas manualmente y la evaluación queda marcada como **pendiente de validación** por Cabina.

## Diseño

El diseño sigue el sistema documentado en `design-system/pre-viaje-operador/MASTER.md`, sintetizado con la habilidad
`ui-ux-pro-max` instalada en `.claude/skills/ui-ux-pro-max`: estilo Minimalism & Swiss + Flat, modo noche OLED,
identidad de carretera (azul marino del logo ILG, amarillo de línea central, escudo Ruta 57, señales SIGA/ALTO), tipografía Saira Extra Condensed + Barlow, targets de 48 px, estados con icono y
texto, resumen de errores enfocable y alternativa de firma escrita.

## Publicación

Suba `index.html` a cualquier hosting estático (GitHub Pages, Netlify, S3). Debe servirse por HTTPS para que el teléfono pueda compartir su ubicación.
