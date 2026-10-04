# Base de datos Pre-Viaje (opcional)

La app funciona sin base de datos: guarda en el teléfono y envía el dictamen por WhatsApp.
Este esquema es para la siguiente etapa, cuando los dictámenes deban llegar solos a Cabina y
quedar en un registro central con Row Level Security.

## Tablas

| Tabla | Para qué | Quién la ve | Quién la escribe |
|---|---|---|---|
| `operadores` | catálogo de operadores ligado a su cuenta | el propio operador, Cabina, admin | admin |
| `unidades` | tractocamiones por número económico | todos | admin |
| `evaluaciones` | un renglón por dictamen (horas GPS, pruebas, factores, foto, firma, ubicación) | el operador solo las suyas; Cabina y admin todas | el operador crea; nadie edita ni borra (admin corrige) |
| `folios_mtto` | folios de Mantenimiento de la revisión de la unidad | operador (los suyos), Mantenimiento, Cabina, admin | el operador crea; Mantenimiento marca atendido |
| `alertas_resguardo` | bloqueos por fatiga que recibe Cabina (Centinelas) | Cabina y admin | la app crea; Cabina cierra |

## Roles

Cada cuenta lleva su puesto en los metadatos del usuario de Supabase: `{"rol": "operador"}`,
`cabina`, `mantenimiento` o `admin`. Las políticas leen ese valor con la función `rol_actual()`.

## Cómo aplicarlo

1. Crear un proyecto en Supabase.
2. SQL Editor → pegar `schema.sql` completo → Run.
3. Crear el bucket privado `evaluaciones` en Storage y aplicar las políticas comentadas al final del archivo.
4. Dar de alta a los usuarios con su `rol` en los metadatos.
