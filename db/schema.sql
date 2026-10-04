-- =====================================================================
-- PRE-VIAJE ILG · Base de datos (Supabase / PostgreSQL)
-- Pegar completo en Supabase → SQL Editor → Run.
-- Crea las tablas, activa Row Level Security y define las políticas.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0) Roles: cada cuenta lleva su puesto en los metadatos del usuario
--    (Authentication → Users → user metadata → { "rol": "operador" })
--    Valores: operador · cabina · mantenimiento · admin
-- ---------------------------------------------------------------------
create or replace function public.rol_actual() returns text
language sql stable as $$
  select coalesce(auth.jwt() -> 'user_metadata' ->> 'rol', auth.jwt() ->> 'rol', 'operador');
$$;

-- ---------------------------------------------------------------------
-- 1) OPERADORES: catálogo de operadores ligado a su cuenta de acceso
-- ---------------------------------------------------------------------
create table if not exists public.operadores (
  id            uuid primary key references auth.users (id) on delete cascade,
  nombre        text not null,
  licencia      text,
  telefono      text,
  activo        boolean not null default true,
  creado_en     timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 2) UNIDADES: tractocamiones por número económico
-- ---------------------------------------------------------------------
create table if not exists public.unidades (
  economico     text primary key,          -- T-118
  placas        text,
  gps_id        text,                      -- id en la plataforma de telemetría
  activa        boolean not null default true
);

-- ---------------------------------------------------------------------
-- 3) EVALUACIONES: un renglón por dictamen pre-viaje
-- ---------------------------------------------------------------------
create table if not exists public.evaluaciones (
  id                  bigint generated always as identity primary key,
  folio               text not null unique,            -- PV-20261004-0830-T118
  operador_id         uuid not null references public.operadores (id),
  economico           text not null references public.unidades (economico),
  ruta                text,
  fecha               timestamptz not null default now(),
  -- Horas de servicio (GPS)
  horas_manejo        numeric(5,2),
  pausa_actual        numeric(5,2),
  horas_restantes     numeric(5,2),
  descanso_vigente    boolean,
  horas_origen        text check (horas_origen in ('gps', 'manual')),
  -- Pruebas
  vision_correctos    smallint check (vision_correctos between 0 and 3),
  reaccion_a_tiempo   smallint check (reaccion_a_tiempo between 0 and 5),
  reaccion_promedio   integer,
  reaccion_anticipados smallint,
  -- Resultado
  apto                boolean not null,
  puntos_riesgo       smallint not null default 0,
  criticos            smallint not null default 0,
  factores            jsonb not null default '[]'::jsonb,   -- [{sev:'critico', t:'...'}]
  respuestas          jsonb not null default '{}'::jsonb,   -- {sueno:'7+', cansancio:2, ...}
  reintento_horas     smallint,
  reinstruccion       jsonb not null default '[]'::jsonb,
  -- Identificación
  foto_url            text,                 -- archivo en Storage (bucket 'evaluaciones')
  firma_url           text,
  imagen_dictamen_url text,
  ubicacion_lat       double precision,
  ubicacion_lon       double precision,
  ubicacion_fuente    text check (ubicacion_fuente in ('telefono', 'gps_unidad')),
  compromiso_aceptado boolean not null default false,
  creado_en           timestamptz not null default now()
);
create index if not exists evaluaciones_operador_idx on public.evaluaciones (operador_id, fecha desc);
create index if not exists evaluaciones_unidad_idx   on public.evaluaciones (economico, fecha desc);

-- ---------------------------------------------------------------------
-- 4) FOLIOS DE MANTENIMIENTO: salen de la revisión de la unidad
-- ---------------------------------------------------------------------
create table if not exists public.folios_mtto (
  id             bigint generated always as identity primary key,
  folio          text not null unique,          -- MTTO-20261004-0830-T118
  evaluacion_id  bigint not null references public.evaluaciones (id) on delete cascade,
  operador_id    uuid not null references public.operadores (id),
  economico      text not null references public.unidades (economico),
  detalle        jsonb not null,                -- [{id:'frenos', t:'Falla en frenos', bloquea:true}]
  bloquea_salida boolean not null default false,
  estado         text not null default 'pendiente' check (estado in ('pendiente', 'en_atencion', 'atendido')),
  atendido_por   uuid references auth.users (id),
  atendido_en    timestamptz,
  creado_en      timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 5) ALERTAS DE RESGUARDO: bloqueos por fatiga que recibe Cabina
-- ---------------------------------------------------------------------
create table if not exists public.alertas_resguardo (
  id             bigint generated always as identity primary key,
  operador_id    uuid not null references public.operadores (id),
  economico      text not null references public.unidades (economico),
  codigo         text not null,                 -- MAX_CONDUCCION · SIN_HORAS_PARA_VIAJE · SIN_DESCANSO_24H · PAUSA_CORTA
  motivo         text not null,
  horas_manejo   numeric(5,2),
  pausa_actual   numeric(5,2),
  faltan_horas   numeric(5,2),
  desbloqueo_en  timestamptz,
  posicion       text,
  estado         text not null default 'abierta' check (estado in ('abierta', 'resguardada', 'cerrada')),
  cerrada_por    uuid references auth.users (id),
  cerrada_en     timestamptz,
  creado_en      timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 6) PARADAS AUTORIZADAS: catálogo que consulta la app y el asistente
-- ---------------------------------------------------------------------
create table if not exists public.paradas (
  id          text primary key,              -- slp-pension
  nombre      text not null,
  tipo        text not null check (tipo in ('pensión', 'parador', 'gasolinera', 'patio', 'cliente')),
  km          integer not null,              -- km sobre la Ruta 57 (0 = Querétaro; negativos hacia CDMX)
  localidad   text not null,
  estado      text not null,
  lat         double precision not null,
  lon         double precision not null,
  servicios   jsonb not null default '[]'::jsonb,   -- ["vigilancia 24 h","regaderas"]
  horario     text,
  tel         text,
  nota        text,
  activa      boolean not null default true,
  actualizado_en timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 7) ZONAS DE RIESGO Y RESTRICCIONES DE HORARIO (de la consola del Centinela)
-- ---------------------------------------------------------------------
create table if not exists public.zonas_riesgo (
  id          text primary key,              -- 57noche
  nombre      text not null,
  tipo        text not null check (tipo in ('total', 'circular', 'salida', 'resguardo', 'detenerse')),
  desde       smallint not null default 0,   -- hora de inicio (0-24)
  hasta       smallint not null default 24,  -- hora de fin (0-24); desde=0 y hasta=24 = todo el día
  estados     jsonb not null default '[]'::jsonb,
  regla       text not null,
  activa      boolean not null default true,
  actualizado_en timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- 8) ESCALAMIENTO: niveles y teléfonos visibles para el operador
-- ---------------------------------------------------------------------
create table if not exists public.escalamiento (
  nivel       smallint primary key,
  rol         text not null,
  tel         text not null,
  cuando      text not null,
  activo      boolean not null default true
);

-- =====================================================================
-- ROW LEVEL SECURITY
-- Regla general: lo que no tiene política está prohibido.
-- =====================================================================
alter table public.operadores        enable row level security;
alter table public.unidades          enable row level security;
alter table public.evaluaciones      enable row level security;
alter table public.folios_mtto       enable row level security;
alter table public.alertas_resguardo enable row level security;
alter table public.paradas           enable row level security;
alter table public.zonas_riesgo      enable row level security;
alter table public.escalamiento      enable row level security;

-- ---------- OPERADORES ----------
create policy "operador ve su ficha" on public.operadores
  for select to authenticated using (id = auth.uid() or public.rol_actual() in ('cabina', 'admin'));
create policy "admin administra operadores" on public.operadores
  for all to authenticated using (public.rol_actual() = 'admin') with check (public.rol_actual() = 'admin');

-- ---------- UNIDADES ----------
create policy "todos ven unidades activas" on public.unidades
  for select to authenticated using (activa or public.rol_actual() in ('cabina', 'mantenimiento', 'admin'));
create policy "admin administra unidades" on public.unidades
  for all to authenticated using (public.rol_actual() = 'admin') with check (public.rol_actual() = 'admin');

-- ---------- EVALUACIONES ----------
create policy "operador ve sus evaluaciones" on public.evaluaciones
  for select to authenticated using (operador_id = auth.uid());
create policy "operador crea sus evaluaciones" on public.evaluaciones
  for insert to authenticated with check (operador_id = auth.uid());
-- Sin políticas de update/delete para operadores: un dictamen enviado no se edita ni se borra.
create policy "cabina y admin ven todas" on public.evaluaciones
  for select to authenticated using (public.rol_actual() in ('cabina', 'admin'));
create policy "admin corrige evaluaciones" on public.evaluaciones
  for update to authenticated using (public.rol_actual() = 'admin') with check (public.rol_actual() = 'admin');

-- ---------- FOLIOS DE MANTENIMIENTO ----------
create policy "operador ve folios de sus evaluaciones" on public.folios_mtto
  for select to authenticated using (operador_id = auth.uid());
create policy "operador crea folios con su evaluacion" on public.folios_mtto
  for insert to authenticated with check (operador_id = auth.uid());
create policy "mtto cabina admin ven folios" on public.folios_mtto
  for select to authenticated using (public.rol_actual() in ('mantenimiento', 'cabina', 'admin'));
create policy "mtto atiende folios" on public.folios_mtto
  for update to authenticated
  using (public.rol_actual() in ('mantenimiento', 'admin'))
  with check (public.rol_actual() in ('mantenimiento', 'admin'));

-- ---------- PARADAS ----------
create policy "todos ven paradas activas" on public.paradas
  for select to authenticated using (activa or public.rol_actual() in ('cabina', 'admin'));
create policy "cabina y admin administran paradas" on public.paradas
  for all to authenticated using (public.rol_actual() in ('cabina', 'admin')) with check (public.rol_actual() in ('cabina', 'admin'));

-- ---------- ZONAS DE RIESGO Y ESCALAMIENTO ----------
create policy "todos ven zonas activas" on public.zonas_riesgo
  for select to authenticated using (activa or public.rol_actual() in ('cabina', 'admin'));
create policy "cabina y admin administran zonas" on public.zonas_riesgo
  for all to authenticated using (public.rol_actual() in ('cabina', 'admin')) with check (public.rol_actual() in ('cabina', 'admin'));
create policy "todos ven escalamiento" on public.escalamiento
  for select to authenticated using (activo or public.rol_actual() in ('cabina', 'admin'));
create policy "admin administra escalamiento" on public.escalamiento
  for all to authenticated using (public.rol_actual() = 'admin') with check (public.rol_actual() = 'admin');

-- ---------- ALERTAS DE RESGUARDO ----------
create policy "app del operador crea la alerta" on public.alertas_resguardo
  for insert to authenticated with check (operador_id = auth.uid());
create policy "cabina y admin ven alertas" on public.alertas_resguardo
  for select to authenticated using (public.rol_actual() in ('cabina', 'admin'));
create policy "cabina cierra alertas" on public.alertas_resguardo
  for update to authenticated
  using (public.rol_actual() in ('cabina', 'admin'))
  with check (public.rol_actual() in ('cabina', 'admin'));

-- =====================================================================
-- ARCHIVOS (fotos, firmas e imágenes del dictamen) · Supabase Storage
-- Crear el bucket 'evaluaciones' como PRIVADO y aplicar:
-- =====================================================================
-- insert into storage.buckets (id, name, public) values ('evaluaciones', 'evaluaciones', false);
-- create policy "operador sube a su carpeta" on storage.objects
--   for insert to authenticated
--   with check (bucket_id = 'evaluaciones' and (storage.foldername(name))[1] = auth.uid()::text);
-- create policy "operador lee su carpeta" on storage.objects
--   for select to authenticated
--   using (bucket_id = 'evaluaciones' and ((storage.foldername(name))[1] = auth.uid()::text or public.rol_actual() in ('cabina', 'admin')));
