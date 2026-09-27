# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Proyecto

FlowSync: práctica de curso de gestión de tareas en equipo. Monorepo sin workspaces con dos paquetes independientes (cada uno con su `package.json` y `node_modules`):

- `backend/`: API REST en AdonisJS 7 (TypeScript, ESM), Lucid ORM sobre SQLite (`backend/tmp/db.sqlite3`), VineJS para validación, Japa para tests. Puerto 3333.
- `frontend/`: React 19 + Vite 8 + TypeScript, lint con oxlint. Puerto 5173. Ahora mismo es la plantilla de Vite sin tocar: no hay router, cliente HTTP ni gestión de estado todavía.

Todo el texto del repo (docs, skills, commits) está en español.

## Comandos

Backend (desde `backend/`):

```bash
npm install && cp .env.example .env && node ace generate:key   # primera vez
node ace migration:run      # aplica migraciones y regenera database/schema.ts
npm run dev                 # node ace serve --hmr
npm test                    # node ace test (todas las suites)
node ace test unit          # una suite (unit | functional)
node ace test --files tests/functional/auth.spec.ts   # un archivo
node ace test --tests "nombre del test"               # un test por título
npm run lint                # eslint
npm run typecheck           # tsc --noEmit
npm run format              # prettier (config @adonisjs/prettier-config)
```

Frontend (desde `frontend/`, en otra terminal con el backend corriendo):

```bash
npm install
npm run dev
npm run build               # tsc -b && vite build
npm run lint                # oxlint
```

El frontend no tiene script de tests ni configuración de Prettier propia.

## Arquitectura del backend

- **Imports con alias** vía `imports` de `package.json`: `#controllers/*`, `#models/*`, `#validators/*`, `#transformers/*`, `#middleware/*`, `#database/*`, `#start/*`, `#config/*`, etc. Se importan con extensión `.js` resuelta a `.ts`. Úsalos en lugar de rutas relativas.
- **Rutas** en `start/routes.ts`, todas bajo `/api/v1`. Los controladores se referencian como `controllers.NewAccount` desde `#generated/controllers`, un índice que genera AdonisJS en `.adonisjs/server/` (hook `indexEntities` de `adonisrc.ts`). No edites `.adonisjs/` a mano: se regenera al arrancar/compilar.
  - `POST /api/v1/auth/signup`, `POST /api/v1/auth/login` (públicas)
  - `GET /api/v1/account/profile`, `POST /api/v1/account/logout` (con `middleware.auth()`)
- **Autenticación**: guard por defecto `api` = access tokens opacos en BD (`User.accessTokens`, `DbAccessTokensProvider`), enviados como `Authorization: Bearer <token>`. Signup y login devuelven `{ data: { user, token } }`. Existe también un guard `web` de sesión, pero la API usa tokens.
- **Modelos y esquema**: `database/schema.ts` se **autogenera** desde las migraciones (`node ace migration:run`); no se edita a mano. Los modelos extienden la clase generada, p. ej. `User extends compose(UserSchema, withAuthFinder(hash))`. Personalizaciones de tipos de columnas van en `database/schema_rules.ts`.
- **Respuestas**: `providers/api_provider.ts` añade `ctx.serialize()`, que envuelve todo en `{ data: ... }` (y metadatos de paginación de Lucid). Los controladores devuelven `serialize(XTransformer.transform(model))`; los transformers (`app/transformers/`, `BaseTransformer` con `this.pick(...)`) definen qué campos se exponen. No devuelvas modelos crudos.
- **Validación**: validadores VineJS en `app/validators/` (`vine.create({...})`), usados con `request.validateUsing(...)` en el controlador.
- **Middleware global** (`start/kernel.ts`): `force_json_response` fuerza `Accept: application/json` (errores siempre en JSON), CORS, bodyparser, session, shield, `silent_auth` (hace `auth.check()` en cada request).
- **CORS**: en desarrollo acepta cualquier origen; en producción la allowlist está vacía (`config/cors.ts`).
- **Cliente tipado**: `generateRegistry()` de Tuyau genera `.adonisjs/client/registry` con los tipos de rutas; el backend lo exporta como `backend/registry` y `backend/data`, y los tests lo usan para tipar el `apiClient`.

## Tests del backend

Japa con suites definidas en `adonisrc.ts`: `unit` (`tests/unit/**/*.spec.ts`, timeout 2 s) y `functional` (`tests/functional/**/*.spec.ts`, timeout 30 s; arranca el servidor HTTP). Plugins en `tests/bootstrap.ts`: `assert`, `apiClient`, `dbAssertions`, `sessionApiClient`, `authApiClient` (permite `.loginAs(user)`). `.env.test` usa `SESSION_DRIVER=memory`. Todavía no hay ningún test escrito.

## Harness de Claude Code

- `.mcp.json`: servidor MCP de Atlassian (Jira), usado por la skill `/priority-ticket`.
- Skills en `.claude/skills/`: `/priority-ticket` (toma el ticket «Por hacer» de mayor prioridad, planifica y lo mueve por el tablero) y `/commit` (commit convencional `tipo(scope): descripción` a partir de lo staged).
- Subagente `.claude/agents/adversarial-reviewer.md`: revisor read-only que intenta refutar un PR.
