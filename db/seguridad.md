# Seguridad de la base de datos Pre-Viaje

## CORS: qué se puede y qué no

CORS es una regla del navegador: le dice a Chrome o Safari desde qué páginas puede llamarse a un servidor.
**La API de Supabase (REST, Auth y Storage) responde a cualquier origen y no permite acotarlo desde el panel.**
Es así por diseño, porque CORS no es un candado de seguridad: cualquier programa fuera del navegador puede
mandar el encabezado de origen que quiera. Lo que realmente protege los datos es:

1. **Row Level Security** (ya activado en `schema.sql`): sin sesión válida nadie lee ni escribe, y cada rol solo
   ve lo suyo. Aunque alguien copie la URL y la clave anon, se topa con las políticas.
2. **Clave anon pública por diseño**: solo da acceso a lo que las políticas permiten. La clave `service_role`
   NUNCA se pone en la app ni se comparte.

## Lo que sí se restringe al origen de la app

En Supabase → **Authentication → URL Configuration**:

| Campo | Valor |
|---|---|
| Site URL | `https://elizabethgarcia-svg.github.io/AUTOEVALUACION-PRE-VIAJE/` |
| Redirect URLs | `https://elizabethgarcia-svg.github.io/AUTOEVALUACION-PRE-VIAJE/**` |

Con esto, los enlaces de recuperación de contraseña y confirmación de correo solo pueden regresar a la app
publicada; cualquier otro dominio queda rechazado.

En **Authentication → Providers → Email**: dejar activo *Confirm email* y desactivar *Enable sign ups* para
que solo Cabina/administración dé de alta cuentas (los operadores no se registran solos).

## CORS restringido al origen de la app (intermediario incluido)

Para que solo se acepten llamadas desde la app publicada, el repositorio incluye la Edge Function
`supabase/functions/previaje-api/index.ts`. Hace tres cosas:

1. Rechaza con 403 cualquier solicitud cuyo `Origin` no esté en la lista permitida, incluido el preflight.
2. Guarda la clave anon en el servidor: la app ya no necesita llevarla.
3. Reenvía a `/rest`, `/auth` y `/storage` de Supabase con la sesión del operador.

### Despliegue (una vez, desde una computadora con Supabase CLI)

```bash
npm install -g supabase
supabase login
supabase link --project-ref <ref-del-proyecto>
supabase secrets set ALLOWED_ORIGINS=https://elizabethgarcia-svg.github.io
supabase functions deploy previaje-api --no-verify-jwt
```

Para permitir también pruebas locales, separe los orígenes con coma:
`ALLOWED_ORIGINS=https://elizabethgarcia-svg.github.io,http://localhost:8080`.

### Configurar la app

En `index.html`, deje `url` y `anonKey` vacíos y ponga solo el proxy:

```js
const SUPABASE = { url: '', anonKey: '', proxy: 'https://<ref-del-proyecto>.supabase.co/functions/v1/previaje-api' };
```

Con eso la app habla únicamente con el intermediario, y el intermediario únicamente con quien venga del
origen de la app. RLS sigue aplicando por debajo; las dos capas se suman.

Nota honesta: el encabezado `Origin` lo ponen los navegadores y no se puede falsificar desde una página
web ajena, pero sí desde un programa fuera del navegador. Por eso RLS sigue siendo la protección de fondo.

## Lista de verificación antes de salir a producción

- [ ] RLS activo en las cinco tablas (`schema.sql`).
- [ ] Bucket `evaluaciones` privado con políticas por carpeta de usuario.
- [ ] Site URL y Redirect URLs apuntando solo a la app publicada.
- [ ] Registro de usuarios desactivado; altas solo por administración.
- [ ] Clave `service_role` fuera del repositorio y de la app.
- [ ] Contraseñas de operadores de al menos 8 caracteres (Authentication → Policies).
