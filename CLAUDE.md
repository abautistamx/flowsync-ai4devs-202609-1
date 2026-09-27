# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

FlowSync: gestión de tareas en equipo. Monorepo sin workspaces (cada paquete tiene su propio `package.json` y `node_modules`; los comandos se ejecutan dentro de cada carpeta):

- `backend/`: API en AdonisJS 7 + TypeScript, Lucid ORM sobre SQLite (`better-sqlite3`, fichero en `backend/tmp/db.sqlite3`). Puerto 3333.
- `frontend/`: React 19 + Vite + TypeScript. Puerto 5173. Sin router ni librería de estado.

## Comandos

Backend (`cd backend`):

- Setup inicial: `npm install && cp .env.example .env && node ace generate:key && node ace migration:run`
- Dev server (HMR): `npm run dev`
- Tests (Japa): `npm run test`
  - Una suite: `node ace test unit` / `node ace test functional`
  - Un fichero: `node ace test --files=tests/functional/auth.spec.ts`
  - Un test por título: `node ace test --tests="nombre del test"`
- Lint: `npm run lint` (ESLint) · Formato: `npm run format` (Prettier) · Tipos: `npm run typecheck`
- Nueva migración: `node ace make:migration <nombre>`, luego `node ace migration:run`

Frontend (`cd frontend`):

- Dev: `npm run dev` · Build (incluye `tsc -b`): `npm run build`
- Lint: `npm run lint` (usa **oxlint**, no ESLint) · Formato: `npm run format` (Prettier, misma config que el backend en `.prettierrc.json`)

## Arquitectura del backend

- **Imports con alias** `#controllers/*`, `#models/*`, `#validators/*`, `#transformers/*`, etc. (definidos en `backend/package.json` → `imports`). Usarlos en lugar de rutas relativas.
- **Esquema generado desde migraciones**: `node ace migration:run` regenera `database/schema.ts` (clases `UserSchema`, `AuthAccessTokenSchema`…). Los modelos extienden esas clases (`User extends compose(UserSchema, withAuthFinder(hash))`) y solo añaden relaciones, getters y lógica. Las columnas se añaden vía migración, nunca en el modelo ni en `schema.ts`. Reglas de mapeo de tipos en `database/schema_rules.ts`.
- **Código generado en `.adonisjs/`** (hook `init` en `adonisrc.ts`): `#generated/controllers` indexa los controllers y las rutas los referencian como `[controllers.AccessTokens, 'store']`; también se genera el registry de Tuyau (`.adonisjs/client`) que tipa rutas para los tests. Tras crear un controller o transformer, se regenera al arrancar `npm run dev`/`node ace`.
- **Rutas** en `start/routes.ts`, todas bajo `/api/v1`. Auth: `POST auth/signup`, `POST auth/login`; protegidas con `middleware.auth()`: `GET account/profile`, `POST account/logout`.
- **Respuestas**: `providers/api_provider.ts` añade `ctx.serialize()`, que envuelve la salida en `{ data: ... }` (y metadatos de paginación de Lucid). Los controllers devuelven `serialize(XTransformer.transform(model))`. Los transformers extienden `BaseTransformer` y usan `this.pick(this.resource, [...])` en `toObject()`.
- **Validación**: validadores VineJS en `app/validators/`, creados con `vine.create({...})` y usados con `request.validateUsing(validator)`.
- **Auth**: access tokens opacos (`DbAccessTokensProvider` en el modelo `User`). El cliente envía `Authorization: Bearer <token>`. `force_json_response_middleware` fuerza respuestas JSON.
- **CORS**: en desarrollo acepta cualquier origen (`config/cors.ts`); en otros entornos está cerrado.
- **Tests**: suites `unit` (`tests/unit/**/*.spec.ts`) y `functional` (`tests/functional/**/*.spec.ts`, levantan el servidor HTTP). Plugins en `tests/bootstrap.ts`: `apiClient`, `authApiClient` (`.loginAs(user)`), `dbAssertions`. Usa `.env.test`.

## Frontend

- Cliente HTTP en `src/api/` con `fetch`; base URL `VITE_API_URL` (por defecto `http://localhost:3333`). Las respuestas del backend vienen envueltas en `{ data }`.
- Componentes en `src/components/`, cada uno con su `.css` al lado.

## Convenciones

- Los cambios de esquema de base de datos deben hacerse mediante migrations.
- Nunca editar `database/schema.ts` directamente.
- La validación de entrada debe realizarse con VineJS.
- No realizar validación manual en los controllers.
- Las respuestas de API deben pasar por un Transformer.
- No serializar directamente los modelos.
- Usar Luxon `DateTime` para fechas.
- Respetar ESLint y Prettier (backend) y oxlint y Prettier (frontend).

## Restricciones

- No introducir dependencias nuevas sin justificarlas.
- Antes de modificar código, revisar las convenciones existentes del proyecto.

## Harness

- `.claude/settings.json` define un hook `PostToolUse` (Edit/Write) que ejecuta `npm run lint` en `backend/` o `frontend/` según el fichero editado (en `frontend/` formatea antes el fichero con Prettier); si el lint falla, el hook devuelve error y hay que corregirlo.

## Comprobaciones

- Backend: `npm run test` y `npm run typecheck`
- Lint/formato: `npm run lint` en cada paquete

## Reglas de proceso
- Antes de tocar código: crear una rama nueva (`git checkout -b feat/<slug>`). Nunca commitear directo en `main`/`s1/start`.
- Al cerrar la tarea: usar la skill `/commit`, luego `gh pr create` con una descripción completa de los cambios en el cuerpo del PR.
- Después de abrir el PR: usar el subagente `adversarial-reviewer` sobre él, antes de darlo por terminado.
- No repitas ese resumen en el chat: la sesión se va a perder, el PR no. Responde solo con la URL del PR.
- Ejecuta pruebas e2e usando la extension de Chrome, y finaliza agregando un gif del recorrido en un nuevo comentario del PR github.