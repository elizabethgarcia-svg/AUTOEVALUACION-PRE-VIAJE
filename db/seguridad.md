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

## Si se exige bloqueo por origen de todos modos

La única forma es poner un intermediario propio delante de Supabase (una Edge Function de Supabase o un
Cloudflare Worker) que:

- acepte únicamente `Origin: https://elizabethgarcia-svg.github.io` y responda los encabezados CORS solo para ese origen;
- guarde la clave en el servidor y la app llame al intermediario en lugar de a Supabase.

Es trabajo adicional de medio día y conviene solo si una auditoría lo pide expresamente, porque la protección
real sigue siendo RLS. Si se decide, el intermediario se agrega sin cambiar las tablas ni las políticas.

## Lista de verificación antes de salir a producción

- [ ] RLS activo en las cinco tablas (`schema.sql`).
- [ ] Bucket `evaluaciones` privado con políticas por carpeta de usuario.
- [ ] Site URL y Redirect URLs apuntando solo a la app publicada.
- [ ] Registro de usuarios desactivado; altas solo por administración.
- [ ] Clave `service_role` fuera del repositorio y de la app.
- [ ] Contraseñas de operadores de al menos 8 caracteres (Authentication → Policies).
