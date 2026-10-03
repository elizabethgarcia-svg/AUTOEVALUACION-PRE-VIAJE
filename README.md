# Autoevaluación Pre-Viaje · Operadores de tractocamión

Encuesta de autoevaluación que realiza el operador antes de salir a ruta. Un solo archivo (`index.html`), sin dependencias de servidor, diseñado para celular. Al terminar muestra el dictamen **APTO** o **NO APTO** y permite enviarlo a Cabina de Seguridad por WhatsApp.

## Flujo

1. **Barrera GPS** (obligatoria). Se consulta la unidad por número económico y se analizan sus periodos de conducción de las últimas 36 h.
2. **Datos** del operador y unidad (nombre, número económico, fecha y hora, ruta).
3. **Estado físico**: horas de sueño, cansancio (1–5), malestar, medicamentos, alcohol.
4. **Estado emocional**: ánimo (1–5), estrés (1–5), capacidad de atención, eventos del día.
5. **Revisión de la unidad**: llantas, frenos, luces, acoplamiento, documentos, equipo de emergencia.
6. **Confirmación**: resumen, declaración de veracidad y firma con el dedo.
7. **Dictamen** con factores detectados, folio, envío por WhatsApp y copia del resumen.

## Reglas de fatiga (bloquean la evaluación)

Configurables en el objeto `REGLAS` al inicio del script (referencia NOM-087-SCT-2-2017):

| Parámetro | Valor | Significado |
|---|---|---|
| `maxConduccion` | 14 h | Al llegar a este acumulado continuo corresponde descanso obligatorio |
| `descansoEfectivo` | 8 h | Descanso mínimo tras alcanzar el máximo |
| `pausaReinicio` | 6 h | Una pausa de esta duración o mayor cierra la jornada y permite continuar |
| `ventanaDescanso` | 24 h | Debe existir un descanso efectivo dentro de este periodo previo a la encuesta |
| `avisoRestante` | 2 h | Horas restantes a partir de las cuales se advierte al operador |

Si el operador está bloqueado, la pantalla muestra "Por el momento no puede realizar la prueba", la hora a partir de la cual podrá presentarla y una cuenta regresiva que se actualiza sola.

## Dictamen

- Cualquier **factor crítico** (sueño < 5 h, cansancio ≥ 4, medicamento que da sueño, alcohol, no poder mantener la atención, falla en llantas, frenos, luces, acoplamiento o documentos) vuelve NO APTO.
- Los factores de **riesgo** suman puntos; con `puntosNoApto` (4) o más, el dictamen es NO APTO.

## Conexión con la plataforma GPS

El archivo incluye un **modo demostración** con unidades de ejemplo (`T-118`, `T-311`, `T-204`, `T-077`, `T-500`). Para producción, reemplace `GPS_PROVIDER.consultarActividad` por la llamada a la API de telemetría (Geotab, Samsara, Webfleet, etc.). Debe devolver:

```js
{ unidad, ubicacion: { texto }, desde: Date, segmentos: [{ inicio: Date, fin: Date }] }
```

con los periodos de conducción (motor en movimiento) desde `desde` hasta ahora. Si el GPS no responde, el operador puede declarar sus horas manualmente y la evaluación queda marcada como **pendiente de validación** por Cabina.

## Diseño

El diseño sigue el sistema documentado en `design-system/pre-viaje-operador/MASTER.md`, sintetizado con la habilidad
`ui-ux-pro-max` instalada en `.claude/skills/ui-ux-pro-max`: estilo Minimalism & Swiss + Flat, modo noche OLED,
paleta industrial slate + safety orange, tipografía Barlow Condensed + Barlow, targets de 48 px, estados con icono y
texto, resumen de errores enfocable y alternativa de firma escrita.

## Publicación

Suba `index.html` a cualquier hosting estático (GitHub Pages, Netlify, S3). Debe servirse por HTTPS para que el teléfono pueda compartir su ubicación.
