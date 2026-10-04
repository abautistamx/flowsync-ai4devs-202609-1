# PRD — FlowSync MVP

> Fuente: [`alcance-mvp-ab.md`](./alcance-mvp-ab.md). Este documento no amplía ese alcance: lo concreta en requisitos testables. Todo lo que no sale de la ficha del ejercicio va marcado como **[SUPUESTO]**.

## 1. Problema y contexto

En un equipo remoto pequeño nadie ve el estado del equipo sin interrumpir a alguien.

- La daily dura 15 minutos y la mitad se va en la ronda de "¿en qué estás?".
- Entre dailies, el estado se averigua con un "¿cómo vas?" por chat, que interrumpe a quien lo recibe.
- Aun así se cuelan solapes: dos personas tocaron el mismo módulo la misma semana sin saberlo y se perdieron dos días.

Hoy FlowSync solo tiene cuentas (registro, login, perfil y logout). No existen tareas, estados ni nada que se actualice en vivo.

El riesgo principal del producto es que **la información se quede vieja**: si actualizar cuesta, nadie lo hace y la lista deja de reflejar la realidad.

## 2. Usuarios y jobs-to-be-done

**Usuario.** Miembro de un equipo remoto de 3–10 personas, repartido en varios husos horarios, con roles planos y sin reporte hacia arriba. Caso de estudio: equipo de producto SaaS de 6 personas en 3 husos horarios.

No hay un comprador distinto del usuario: el valor lo cobran los pares, no un lead.

| # | Cuando… | quiero… | para… |
|---|---|---|---|
| JTBD-1 | empiezo el día o vuelvo de una reunión | ver en qué está cada uno sin preguntar | no interrumpir a nadie ni esperar a la daily |
| JTBD-2 | voy a empezar algo nuevo | saber qué tareas están libres y cuáles ya tiene alguien | no pisar el trabajo de otro |
| JTBD-3 | cambio lo que estoy haciendo | dejarlo reflejado en segundos, desde mi propia cola | que nadie tenga que preguntarme "¿cómo vas?" |
| JTBD-4 | aparece trabajo nuevo | apuntarlo sin rellenar un formulario | que no se quede en un mensaje de chat |

## 3. Propuesta de valor

Una lista de tareas compartida que es a la vez **tu cola de trabajo y el estado del equipo**. Actualizarla cuesta dos clics y, a cambio, dejas de recibir el "¿cómo vas?" y ves qué está libre antes de empezar algo.

Frente a un gestor tipo Jira: una tarea es solo título, responsable, estado y vencimiento. Sin sprints, estimaciones, informes ni campos obligatorios de más. FlowSync **sustituye** al gestor de tareas, no convive con él.

## 4. Alcance / Fuera de alcance

### Dentro

1. Crear una tarea escribiendo solo el título; responsable y vencimiento son opcionales.
2. Cambiar el estado (Pendiente · En curso · Hecha) en dos clics desde la propia lista.
3. Una única lista compartida que muestra estado, responsable y vencimiento, con las tareas vencidas resaltadas.
4. Filtrar la lista por estado.
5. Ver los cambios de los demás sin refrescar.

Editar título, responsable o vencimiento y borrar una tarea se consideran incluidos en 1–3. Las cuentas (registro, login, perfil, logout) ya existen y se mantienen.

### Fuera (con la hipótesis que no ayudaría a validar)

| Exclusión | Por qué queda fuera |
|---|---|
| Notificaciones push o e-mail; recordatorios de vencimiento | Un aviso que interrumpe contradice la hipótesis de "un resumen que espera". |
| Integración con Slack | Valida distribución, no frescura del estado; añade un segundo sitio donde mirar. |
| Presencia (quién está conectado, indicadores de actividad) | El estado es de la tarea, no de la persona. Se rechaza a propósito. |
| Estado derivado de Git/PRs, CI o calendario | Es otro producto; la hipótesis es que teclearlo en dos clics es sostenible. |
| Importar o sincronizar con Jira u otro gestor | Convivir obliga a actualizar dos veces. |
| Varios equipos o espacios; invitaciones, onboarding, gestión de miembros | Un espacio basta para 3–10 personas. |
| Roles y permisos | Los roles son planos. |
| Sprints, estimaciones, épicas de producto, backlog priorizado | Es lo que hace pesado a Jira. |
| Analítica, informes, dashboards | Nadie cobra valor hacia arriba. |
| Comentarios en tareas | Convierte la lista en un canal de conversación. |
| Gestión de bloqueos | La parte de bloqueos de la daily sigue; el MVP no la resuelve. |
| Estados configurables, prioridad, etiquetas, campos personalizados | Cada campo de más sube el coste de actualizar (riesgo #1). |
| Subtareas y dependencias | No hacen falta para saber quién está en qué. |
| Historial completo o auditoría | El histórico es un informe. |
| Resumen de "qué se ha movido desde mi última visita" | Necesidad adicional; ya se ve responsable y estado actual. Candidata a entrar si la prueba demuestra que hace falta. |
| Acción aparte de "me la quedo yo" | Duplica la edición del responsable. |
| Edición colaborativa simultánea | "Tiempo real" es ver cambios, no escribir a la vez. |
| App móvil o modo offline | La lista se consulta donde se trabaja. |

## 5. Épicas del MVP

- **E1 «Cuentas y acceso»** — registro, inicio y cierre de sesión, perfil y pertenencia automática al espacio único del equipo (ya existente salvo la pertenencia).
- **E2 «Gestión de tareas»** — crear, editar, borrar y cambiar de estado una tarea con los cuatro campos del producto.
- **E3 «Actividad del equipo»** — la lista compartida como vista del estado del equipo: responsable, vencidas resaltadas, filtro por estado y cambios de los demás visibles sin refrescar.

## 6. Requisitos funcionales

Cada requisito indica su épica. "Usuario" significa siempre un usuario con sesión iniciada salvo que se diga lo contrario.

### E1 — Cuentas y acceso

- **RF-1.** Una persona sin cuenta puede registrarse con nombre, email y contraseña; si el email ya está registrado, el sistema lo rechaza con un mensaje que lo indica.
- **RF-2.** Una persona registrada puede iniciar sesión con email y contraseña; con credenciales incorrectas el sistema muestra un error y no da acceso.
- **RF-3.** El usuario puede cerrar sesión; después no puede ver ni modificar tareas hasta volver a iniciarla.
- **RF-4.** Sin sesión iniciada no se puede ver ni modificar ninguna tarea; el sistema lleva a la persona al inicio de sesión.
- **RF-5.** Todo usuario registrado pertenece automáticamente al único espacio del equipo y ve las mismas tareas que el resto, sin invitación ni aprobación. **[SUPUESTO]** — válido para el caso de estudio, no para producción.

### E2 — Gestión de tareas

- **RF-6.** El usuario puede crear una tarea escribiendo solo el título. Responsable y vencimiento son opcionales y la tarea nace en estado **Pendiente**.
- **RF-7.** El sistema rechaza crear o guardar una tarea con el título vacío o formado solo por espacios, y lo indica junto al campo.
- **RF-8.** Al crear o editar una tarea, el responsable se elige entre los usuarios registrados, o se deja sin responsable.
- **RF-9.** El vencimiento es una fecha de calendario (sin hora); se puede fijar, cambiar o quitar.
- **RF-10.** Los estados posibles son exactamente tres, fijos y no configurables: **Pendiente**, **En curso** y **Hecha**.
- **RF-11.** Desde la propia lista, sin abrir otra pantalla, el usuario puede pasar una tarea a cualquiera de los otros dos estados con **un máximo de dos clics**.
- **RF-12.** Cualquier usuario puede editar el título, el responsable y el vencimiento de cualquier tarea, y cambiar su estado, sea o no el responsable (roles planos).
- **RF-13.** Cualquier usuario puede borrar cualquier tarea; el sistema pide confirmación antes y, tras confirmar, la tarea desaparece de la lista de todos.
- **RF-14.** Si dos usuarios cambian la misma tarea casi a la vez, prevalece el último cambio guardado y ambos acaban viendo ese mismo valor. **[SUPUESTO]**
- **RF-15.** Una tarea no tiene más campos que título, responsable, estado y vencimiento.

### E3 — Actividad del equipo

- **RF-16.** Existe una única lista compartida con todas las tareas del espacio; cada fila muestra título, estado, responsable (o "Sin responsable") y vencimiento (si lo tiene).
- **RF-17.** Una tarea sin responsable se distingue visualmente como **libre**.
- **RF-18.** Una tarea cuyo vencimiento es anterior a hoy y que no está **Hecha** aparece resaltada como vencida. Una tarea **Hecha** nunca aparece como vencida. "Hoy" se calcula en la zona horaria del usuario que mira. **[SUPUESTO]**
- **RF-19.** El usuario puede filtrar la lista por uno de los tres estados o verlos todos; por defecto se muestran todos. **[SUPUESTO]**
- **RF-20.** Cuando otro usuario crea, edita, cambia de estado o borra una tarea, el cambio aparece en la lista de los demás usuarios con sesión abierta sin que tengan que refrescar ni hacer nada.
- **RF-21.** Los cambios que llegan de otros usuarios respetan el filtro activo: una tarea que deja de cumplirlo desaparece de la vista y una que pasa a cumplirlo aparece.
- **RF-22.** Si la conexión se pierde y se recupera, la lista vuelve a mostrar el estado actual de todas las tareas sin que el usuario tenga que refrescar.
- **RF-23.** La lista no muestra quién está conectado ni ningún indicador de actividad de personas.

## 7. Requisitos no funcionales

- **RNF-1 Frescura.** Un cambio hecho por un usuario es visible para los demás con sesión abierta en **≤ 5 s** en el 95 % de los casos. **[SUPUESTO]**
- **RNF-2 Coste de actualizar.** Cambiar el estado de una tarea cuesta ≤ 2 clics desde la lista y crear una tarea solo con título cuesta escribir el título y confirmar (≤ 1 clic o Enter).
- **RNF-3 Respuesta.** La lista con hasta **500 tareas** carga en **≤ 2 s** y las acciones propias se reflejan en la pantalla de quien las hace en **≤ 1 s**. **[SUPUESTO]**
- **RNF-4 Capacidad.** Funciona con hasta **10 usuarios** con sesión abierta a la vez en el mismo espacio.
- **RNF-5 Seguridad.** Ninguna tarea ni dato de usuario es accesible sin sesión válida; la contraseña nunca se muestra ni se devuelve.
- **RNF-6 Consistencia.** Tras cualquier secuencia de cambios concurrentes, todos los usuarios con sesión abierta acaban viendo la misma lista.
- **RNF-7 Idioma.** Interfaz y mensajes de error en castellano.
- **RNF-8 Plataforma.** Navegadores de escritorio actuales (Chrome, Firefox, Safari, Edge en sus dos últimas versiones). **[SUPUESTO]** Sin app móvil ni modo offline.
- **RNF-9 Fechas.** Las fechas de vencimiento se muestran igual para todos los usuarios con independencia de su huso horario.

## 8. Restricciones

- **Stack actual, sin cambiarlo:** backend AdonisJS 7 (con SQLite) y frontend React 19 + Vite 8, en el repo existente.
- **Auth ya existe:** registro, login, perfil y logout están implementados y no se vuelven a especificar ni a rehacer; el MVP se construye sobre esas cuentas.
- **Un único espacio**, sin modelo de equipos ni invitaciones.
- **Sin servicios de terceros** para notificaciones, integraciones o importación (consecuencia del fuera de alcance).
- **Equipo y plazo:** proyecto de práctica del curso; el MVP debe poder probarse con un equipo real durante **una semana**.

## 9. Métricas de éxito

**Métrica norte (de la ficha).** A una semana de uso real, el equipo **cancela la ronda de "¿en qué estás?"** de la daily y **nadie pide que vuelva** en la semana siguiente. Se mide preguntando al equipo al cierre de cada semana (sí/no).

**Métricas de soporte** (umbrales **[SUPUESTO]**, a fijar con el equipo piloto):

| Métrica | Cómo se mide | Objetivo |
|---|---|---|
| Duración de la daily | Minutos medidos por el equipo, antes vs. semana con FlowSync | Baja de ~15 a ≤ 8 min |
| "¿Cómo vas?" por chat | Recuento manual en el canal del equipo, semana antes vs. semana con FlowSync | −50 % o más |
| Frescura del estado | % de tareas **En curso** que, al revisarlas en la daily, reflejan lo que de verdad está haciendo su responsable | ≥ 90 % |
| Adopción | Miembros del equipo que cambian al menos un estado cada día laborable | ≥ 80 % del equipo |
| Solapes | Casos de dos personas trabajando en lo mismo sin saberlo durante la semana | 0 |
| Coste de actualizar | Comprobación de RF-11 / RNF-2 en la propia app | ≤ 2 clics, siempre |

**Señal de alarma.** Si al final de la semana la lista no refleja lo que el equipo está haciendo (frescura < 90 %), el MVP no valida la hipótesis central aunque el resto de métricas salgan bien.
