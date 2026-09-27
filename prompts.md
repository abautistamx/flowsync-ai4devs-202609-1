# Prompts

Aquí van **todos los prompts que lanzaste** para hacer el ejercicio, en el orden en que los
lanzaste, con el modelo y la herramienta de cada uno.

Esto no es papeleo. Lo que se revisa es **cómo pediste las cosas**, no solo lo que salió: un
resultado flojo con un prompt bueno y un resultado flojo con un prompt vago necesitan feedback
distinto, y sin este archivo no se distinguen.

## Cómo rellenarlo

- Un apartado `## Prompt N` por cada prompt.
- **Pega el prompt tal cual lo lanzaste**, dentro del bloque de código, aunque ocupe diez líneas
  y aunque tenga faltas. No lo reescribas para que quede bien: el que arreglaste mentalmente
  después no es el que lanzaste.
- Incluye también los que **no funcionaron**. Suelen ser los más útiles de leer.
- `Modelo` y `Herramienta` en todos. Si cambiaste de una a otra a mitad, se nota aquí.

Borra el ejemplo de abajo cuando escribas el primero.

---

## Con HARNESS

## Prompt 1

**Modelo:** Sonnet 5
**Herramienta:** Claude Code

```
Implementar login en el frontend, debe de capturar usuario y contraseña, cuando se abra la pantalla las cajitas donde se captura el usuario y contraseña deben estar en color blanco y vacío.
  Debe de validar que el usuario exista para que le indica a la pantalla de login que su usuario y contraseña son correctos y marcarlo en color verde y si no existe mandar el mensaje que esta incorrecto o no existe, en color rojo.

Antes de implementar noté algo: el README del repo describe un ejercicio del curso donde el ticket "Implementar login en el frontend" se usa para generar y comparar planes (con /priority-ticket y a mano) pero explícitamente dice "no apliques el plan en ninguna copia". Tu mensaje coincide casi textualmente con ese ticket, así que antes de tocar código quiero confirmar qué quieres que haga.
 ¿Quieres que implemente el login de verdad ahora, o que siga el flujo del ejercicio (generar un plan sin aplicarlo, para comparar con/sin harness)? → Implementar el login ahora


Listo. Implementación del login en el frontend, probada end-to-end en el navegador contra el backend real (AdonisJS).

Archivos:                                                                           frontend/src/api/auth.ts — a POST /api/v1/auth/login
  (endpoint que ya existía en el backend), desenvuelve {data: {...}} en éxito y     normaliza cualquier fallo
- frontend/src/components/LoginForm.tsx + LoginForm.css — formulario con estado idle| submitting | success | e
- frontend/src/App.tsx / App.css — reemplacé el boilerplate de Vite por la pantalla de login (limpié imports/e

Comportamiento verificado en
- Al cargar: campos blancos y vacíos.
- Credenciales correctas: boontraseña correctos."Credenciales incorrectas/usuario inexistente: bordes rojos + "Usuario o contraseña
  incorrectos." (el backend ste" y "contraseña mal" porseguridad, así que el mensaje cubre ambos casos).
- Al editar un campo después blanco (idle).

npm run lint y tsc -b --noEmd/. No se agregarondependencias nuevas.
```

## Prompt 2

**Modelo:** Sonnet 5
**Herramienta:** Claude Code

```
Con que credenciales probaste si era correcto

Usé un usuario que creé yo mismo para la prueba, vía el endpoint de signup del backend (POST /api/v1/auth/signup), no uno que ya existiera en la base:

- Email/usuario: test@example.com
- Contraseña: password123
- Nombre: Test User

La base backend/tmp/db.sqlite3 estaba vacía (sin usuarios), así que la creé para poder probar el caso de éxito. Es un dato local, está en tmp/ que está en .gitignore, no se sube al repo.

```

**Qué salió:** (opcional, una línea) funcionó a la primera / tuve que insistir / me inventó una ruta que no existe.
Funcionó a la primera (Pero me falto ser mas especifico)

## Sin HARNESS

## Prompt 1

**Modelo:** Sonnet 5
**Herramienta:** Claude Code

```
Implementar login en el frontend, debe de capturar usuario y contraseña, cuando se abra la pantalla las cajitas donde se captura el usuario y contraseña deben estar en color blanco y vacío.
Debe de validar que el usuario exista para que le indica a la pantalla de login que su usuario y contraseña son correctos y marcarlo en color verde y si no existe mandar el mensaje que esta incorrecto o no existe, en color rojo

Resumen

Implementé el login en el frontend (frontend/src/components/Login.tsx + Login.css, y App.tsx ahora renderiza <Login />), consumiendo el endpoint ya existente POST /api/v1/auth/login del backend AdonisJS.

Comportamiento verificado en navegador:
- Al abrir: campos de usuari vacíos.
- Credenciales inexistentes o incorrectas → bordes rojos + mensaje "El usuario o la   contraseña son incorrectose entre ambos casos, lo cual
  es buena práctica de seguridad).                                                  - Credenciales correctas → bbienvenida, token guardado en
  localStorage, y botón para cerrar sesión.                                         
Bug real encontrado y corregido durante las pruebas: al cerrar sesión, React        reutilizaba el mismo <buttonype de "button" a "submit" en
la misma pasada de renderizado disparada por el propio click. El navegador evaluaba la acción por defecto con ell clic en "Cerrar sesión"
también disparaba un envío del formulario vacío. Lo arreglé dando key distintas a   los dos botones para forzar evo en vez de mutar el
existente.                                                                          
tsc -b y oxlint pasan limpio. No quedan procesos de backend/frontend corriendo (los paré al terminar).

✻ Brewed for 11m 35s · done 2:

※ recap: Login screen for Flowtested end-to-end (blankfields, red on invalid credentials, green on success, working logout). It's ready
  for you to review in the broeaks. (disable recaps in/config)

```
## Prompt 2

**Modelo:** Sonnet 5
**Herramienta:** Claude Code

```
Con que credenciales probaste si era correcto

Usé un usuario que creé vía el endpoint de signup (POST /api/v1/auth/signup) para tener credenciales reales contra las que probar:

- Email: testlogin@example.com
- Contraseña: password123

Y para el caso negativo probé con wrong@example.com / wrongpass (y también nouser@example.com), que el backend responde igual en ambos casos con "Invalid user credentials" → traducido en el frontend a "El usuario o la contraseña son incorrectos."

Ese usuario de prueba quedó en backend/tmp/db.sqlite3 (SQLite local, no versionado en git), así que no afecta el repo.

```

**Qué salió:** (opcional, una línea) funcionó a la primera / tuve que insistir / me inventó una ruta que no existe.
Funcionó a la primera (Pero me falto ser mas especifico)
