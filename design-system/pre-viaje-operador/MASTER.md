# Pre-Viaje Operador · Sistema de diseño (MASTER)

Fuente de verdad global para la app de autoevaluación pre-viaje. Sintetizado con la habilidad
`ui-ux-pro-max` a partir de coincidencias verificadas por dominio (la salida automática de
`--design-system` devolvió "HUD / Sci-Fi FUI", descartada por no ajustarse al producto).

## Marca e identidad visual (actualización: lenguaje de carretera)

- **Logo:** monograma ILG en círculo blanco sobre azul marino (`assets/logo-ilg.png`, embebido a 160 px en `index.html`).
- **Azul de marca:** `#021C4F` (borde) a `#062661` (centro), tomado del propio logo; brillo `#1E4DB7` para el degradado radial de la cabecera.
- **Acento:** amarillo de línea central `#FFC72C` (texto encima `#0B1B3F`). No hubo paleta azul marino + amarillo en la base de la habilidad; se adoptó como color de marca derivado del logo y de la señalización vial.
- **Motivos de carretera:** línea central amarilla discontinua (cabecera y pie), barra de progreso tipo asfalto con camión que avanza, escudo de la Ruta federal 57 (estilo SCT), señal verde SIGA para APTO, señal roja ALTO para NO APTO, franja rojo/blanco en bloqueos.
- **Tipografía de impacto:** Saira Extra Condensed 800 (coincidencia verificada en el dominio `google-fonts`) para títulos, cifras del tablero y dictamen; Barlow Condensed para botones y subtítulos; Barlow para cuerpo.
- **Modo noche:** fondo azul marino profundo `#040B1C`, tarjetas `#0B172F`, con el mismo amarillo de acento.

## Producto y audiencia

- **Tipo:** herramienta de cumplimiento en campo (checklist de seguridad) para operadores de tractocamión.
- **Contexto de uso:** celular, patio o parador, a pleno sol o en cabina de noche, con prisa y a veces con guantes.
- **Trabajo de la página:** decidir en menos de 3 minutos si el operador sale o no.

## Estilo (dominio `style` / `product`)

| Decisión | Coincidencia verificada | Aplicación |
|---|---|---|
| Estilo primario | **Minimalism & Swiss Style + Flat Design** (perfil de producto *Logistics/Delivery*) | Sin sombras ni degradados, bordes de 1 px, radios 4–8 px, jerarquía por tipografía y espacio. |
| Estilo secundario | **Dark Mode (OLED)** | Modo noche con negro profundo `#000000` y superficies `#121212`, baja emisión de luz en cabina. |
| Estilo transversal | **Inclusive Design** | Contraste ≥ 4.5:1 (texto normal), indicadores con símbolo + texto, foco de 3 px, targets ≥ 48 px. |
| Patrón | Formulario por pasos con indicador de progreso (`multi-step-progress`) | Barra + "Paso N de 5", botón Atrás siempre visible. |

## Color (dominio `color`: *Construction/Architecture* "Industrial grey + safety orange" e *Inventory* "Industrial slate")

| Token | Claro | Noche (OLED) | Uso |
|---|---|---|---|
| `--bg` | `#F8FAFC` | `#000000` | Fondo de página |
| `--card` | `#FFFFFF` | `#121212` | Tarjetas y pie fijo |
| `--card-2` | `#F1F5F9` | `#1C1C1E` | Opciones sin seleccionar, indicadores |
| `--fg` | `#0F172A` | `#F1F5F9` | Texto principal |
| `--fg-2` | `#475569` | `#A1A1AA` | Texto secundario (≥ 7:1 sobre card) |
| `--border` | `#E2E8F0` | `#2A2A2E` | Bordes y divisores |
| `--border-2` | `#CBD5E1` | `#3F3F46` | Bordes de controles |
| `--primary` | `#334155` | `#E2E8F0` | Opción seleccionada, botón secundario |
| `--accent` | `#EA580C` | `#FB923C` | CTA principal (texto `--on-accent` `#0F172A` / `#000`) |
| `--ok` | `#047857` relleno · `#059669` texto | `#047857` relleno · `#34D399` texto | APTO, horas en regla |
| `--warn` | `#B45309` texto · `#FEF3C7` fondo | `#FCD34D` texto · `#2A1F05` fondo | Advertencias, pendiente de validación |
| `--danger` | `#B91C1C` relleno · `#DC2626` texto | `#B91C1C` relleno · `#F87171` texto | NO APTO, bloqueo, errores |
| `--info` | `#2563EB` | `#60A5FA` | GPS, mensajes informativos |

Reglas: `color-semantic` (sin hex en componentes), `color-dark-mode` (variantes más claras y desaturadas, no invertidas),
`color-not-only` (todo estado lleva icono y texto además del color).

## Tipografía (dominio `typography`: pareja *Barlow Condensed + Barlow*)

- **Display / títulos:** Barlow Condensed 700, mayúsculas, tracking 0.02em. Escala 44 / 32 / 24.
- **Cuerpo:** Barlow 400–600, base 17 px, line-height 1.5, medida ≤ 65 caracteres.
- **Etiquetas:** 12–13 px, mayúsculas, tracking 0.08em, peso 600.
- **Cifras:** `font-variant-numeric: tabular-nums` en temporizadores y tableros (`number-tabular`).
- Escala: 12 · 14 · 16 · 17 · 20 · 24 · 32 · 44 · 64 (dictamen).

## Espaciado y layout

- Ritmo 4/8 px. Tiers: 8 (dentro de control) · 16 (entre campos) · 24 (entre bloques) · 32 (entre secciones).
- Ancho máximo de contenido 560 px, gutter 16 px (20 px ≥ 600 px).
- Pie fijo con `env(safe-area-inset-bottom)`; `main` reserva 128 px abajo para no tapar contenido.
- Sin scroll horizontal; `min-width: 0` en hijos flex con texto.

## Interacción (dominios `ux`, `web`)

- Targets ≥ 48 px de alto, separación ≥ 8 px (`touch-target-size`, `touch-spacing`).
- Feedback al presionar por cambio de color, sin transformaciones que muevan el layout (`press-feedback`).
- Transiciones 150–200 ms; sin animación con `prefers-reduced-motion`.
- Botones durante operaciones asíncronas: `aria-busy`, spinner y texto de estado (`loading-buttons`, `submit-feedback`).
- Botón "Continuar" nunca deshabilitado: al tocarlo con faltantes se muestra resumen de errores enfocable con enlaces
  a cada pregunta y error en línea bajo cada una (`error-summary`, `error-placement`, `focus-management`).
- Validación de texto al salir del campo, no por tecla (`inline-validation`).
- Háptica solo en acciones importantes: enviar evaluación y bloqueo por fatiga (`haptic-feedback`).
- La firma con el dedo tiene alternativa de un solo puntero: firma escrita (`dragging-alternative`).
- Foco visible de 3 px con contraste ≥ 3:1 (`focus-appearance`).
- Iconos SVG de trazo 2 px, tamaños 20 / 24; decorativos con `aria-hidden`; controles solo-icono con `aria-label`.

## Evitar

Emojis como iconos · estados solo por color · botones deshabilitados sin explicación · sombras y degradados ·
texto < 12 px · gris sobre gris · bloquear el zoom · ocultar contenido detrás del pie fijo.
