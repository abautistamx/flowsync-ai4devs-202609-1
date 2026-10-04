# PRD — FlowSync MVP

> Fuente: [`alcance-mvp-ab.md`](./alcance-mvp-ab.md). Este documento no añade capacidades a ese alcance: lo concreta en requisitos testables. Las reglas, cifras y umbrales que no salen de la fuente van marcados como **[SUPUESTO]**.

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
| JTBD-1 | empiezo el día o vuelvo de una reunión | ver qué tareas están en curso y quién es su responsable, sin preguntar | no interrumpir a nadie ni esperar a la daily |
| JTBD-2 | voy a empezar algo nuevo | saber qué tareas están libres y cuáles ya tiene alguien | no pisar el trabajo de otro |
| JTBD-3 | cambio lo que estoy haciendo | dejarlo reflejado en dos clics desde mi propia cola (RNF-2) | que nadie tenga que preguntarme "¿cómo vas?" |
| JTBD-4 | aparece trabajo nuevo | apuntarlo escribiendo solo el título | que no se quede en un mensaje de chat |

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
| Resumen de "qué se ha movido desde mi última visita" | Necesidad adicional; ya se ven responsable y estado actual. Puede entrar si la prueba demuestra que hace falta. |
| Acción aparte de "me la quedo yo" | Duplica la edición del responsable. |
| Edición colaborativa simultánea | "Tiempo real" es ver cambios, no escribir a la vez. |
| App móvil o modo offline | La lista se consulta donde se trabaja. |

> Nota sobre la fuente: en la línea de "Historial de actividad", `alcance-mvp-ab.md` dice "basta con saber qué cambió desde la última visita", y más abajo excluye ese mismo resumen. Este PRD sigue la exclusión explícita: el resumen queda fuera.

## 5. Épicas del MVP

- **E1 «Cuentas y acceso»**: las cuentas existentes, más la pertenencia de cada usuario al espacio único.
- **E2 «Gestión de tareas»**: crear, editar, borrar y cambiar de estado una tarea.
- **E3 «Actividad del equipo»**: la lista compartida, el filtro por estado y los cambios ajenos sin refrescar.

## 6. Requisitos funcionales

"Usuario" significa siempre un usuario con sesión iniciada, salvo que se diga lo contrario.

### E1 — Cuentas y acceso

- **RF-1.** Registro, inicio de sesión, perfil y cierre de sesión siguen funcionando como hoy; el MVP no los cambia.
- **RF-2.** Sin sesión iniciada no se puede ver ni modificar ninguna tarea, y tampoco tras cerrar sesión.
- **RF-3.** Todo usuario registrado pertenece automáticamente al único espacio del equipo y ve las mismas tareas que el resto, sin invitación ni aprobación. **[SUPUESTO]**: válido para el caso de estudio, no para producción.

### E2 — Gestión de tareas

- **RF-4.** El usuario puede crear una tarea escribiendo solo el título. Responsable y vencimiento son opcionales y la tarea nace en estado **Pendiente**. **[SUPUESTO]** (el estado inicial).
- **RF-5.** El sistema no permite guardar una tarea con el título vacío o formado solo por espacios, y explica por qué. **[SUPUESTO]**
- **RF-6.** Al crear o editar una tarea, el responsable se elige entre todos los usuarios registrados en ese momento, incluidos los recién registrados, o se deja vacío.
- **RF-7.** El vencimiento es una fecha de calendario, sin hora, y se puede fijar, cambiar o quitar. **[SUPUESTO]** (sin hora)
- **RF-8.** Hay exactamente tres estados, fijos y no configurables: **Pendiente**, **En curso** y **Hecha**.
- **RF-9.** Desde la propia lista, sin abrir otra pantalla, el usuario puede pasar una tarea a cualquiera de los otros dos estados con **un máximo de dos clics**.
- **RF-10.** Cualquier usuario puede editar el título, el responsable y el vencimiento de cualquier tarea, y cambiar su estado, sea o no su responsable (roles planos).
- **RF-11.** Cualquier usuario puede borrar cualquier tarea. Antes de borrar, el sistema pide confirmación; ese paso no cuenta para el límite de dos clics de RF-9, que solo aplica al cambio de estado. Una vez confirmado, la tarea desaparece de la lista de todos. **[SUPUESTO]** (la confirmación)
- **RF-12.** Si dos usuarios cambian **campos distintos** de la misma tarea, se conservan los dos cambios. Si cambian **el mismo campo**, prevalece el último que se guarda, y los dos usuarios terminan viendo ese valor. Caso de aceptación: A pone "En curso" y B, después, "Hecha": los dos ven "Hecha". **[SUPUESTO]**
- **RF-13.** Una tarea no tiene más campos que título, responsable, estado y vencimiento.

### E3 — Actividad del equipo

- **RF-14.** Hay una única lista compartida con todas las tareas del espacio, incluidas las **Hecha**. Cada fila muestra título, estado, responsable o "Sin responsable", y vencimiento si lo hay. Por defecto se ordena por fecha de creación, de la más reciente a la más antigua. **[SUPUESTO]** (orden y visibilidad de las Hecha)
- **RF-15.** Una tarea sin responsable lleva la etiqueta visible **"Libre"**.
- **RF-16.** Una tarea que no está **Hecha** y cuyo vencimiento es anterior a la fecha de hoy lleva la etiqueta visible **"Vencida"**. Una tarea **Hecha** nunca lleva esa etiqueta. "Hoy" es la fecha local de quien mira la lista, así que durante unas horas una tarea puede salir vencida para un huso y no para otro. **[SUPUESTO]**
- **RF-17.** El usuario puede filtrar la lista por uno de los tres estados o ver todas las tareas. Por defecto se muestran todas. **[SUPUESTO]** (el valor por defecto)
- **RF-18.** Cuando otro usuario crea, edita, cambia de estado o borra una tarea, el cambio aparece sin refrescar en la lista de los demás usuarios con sesión abierta. Esto incluye la creación, la edición y el borrado, no solo el cambio de estado, porque la lista solo es fiable si refleja todo. **[SUPUESTO]** (la extensión a todos los cambios)
- **RF-19.** El filtro activo se aplica igual a los cambios propios y a los ajenos: una tarea que deja de cumplirlo sale de la vista y una que pasa a cumplirlo entra. **[SUPUESTO]**
- **RF-20.** Si la conexión se corta y se recupera mientras la lista está abierta, la lista vuelve a mostrar el estado actual dentro del plazo de RNF-1, contado desde que vuelve la conexión, sin que el usuario refresque. Sin conexión no se pueden hacer cambios: no hay modo offline. **[SUPUESTO]**
- **RF-21.** La lista no muestra quién está conectado, ni cuándo fue la última actividad de nadie, ni otros indicadores de actividad de las personas. El responsable de una tarea es un dato de la tarea, no un indicador de actividad.

## 7. Requisitos no funcionales

- **RNF-1 Frescura.** Un cambio de un usuario es visible para los demás con sesión abierta en **≤ 5 s** en el 95 % de los casos. **[SUPUESTO]**
- **RNF-2 Coste de actualizar.** Cambiar el estado de una tarea cuesta ≤ 2 clics desde la lista (fuente). Crear una tarea solo con título consiste en escribir el título y confirmar con un clic o con Enter. **[SUPUESTO]** (la confirmación de la creación)
- **RNF-3 Respuesta.** Una lista de hasta **500 tareas** carga en **≤ 2 s**, y las acciones propias se reflejan en pantalla en **≤ 1 s**. **[SUPUESTO]**
- **RNF-4 Capacidad.** Funciona con hasta **10 usuarios** con sesión abierta a la vez, que es el límite superior del equipo objetivo (3–10).
- **RNF-5 Privacidad.** Ninguna tarea ni dato de usuario es visible sin sesión válida, y la contraseña nunca es visible para nadie.
- **RNF-6 Consistencia.** Pase lo que pase con los cambios concurrentes, todos los usuarios con sesión abierta terminan viendo el mismo conjunto de tareas con los mismos valores. Lo único que cambia entre unos y otros es el filtro que cada uno tiene puesto.
- **RNF-7 Idioma.** La interfaz y los mensajes de error están en castellano. **[SUPUESTO]**
- **RNF-8 Plataforma.** Navegadores de escritorio actuales: Chrome, Firefox, Safari y Edge en sus dos últimas versiones. **[SUPUESTO]** Sin app móvil ni modo offline.
- **RNF-9 Fechas.** La fecha de vencimiento es la misma para todos los usuarios, sea cual sea su huso horario: quien pone el día 12 ve el 12 y quien la consulta también ve el 12. **[SUPUESTO]**

## 8. Restricciones

- **Stack actual:** AdonisJS 7 en el backend y React 19 en el frontend, en el repo existente.
- **La auth ya existe:** registro, login, perfil y logout están implementados y no se rehacen. El MVP se construye sobre esas cuentas.
- **Un único espacio compartido**, sin equipos múltiples ni invitaciones.
- **Sin servicios de terceros** para notificaciones, integraciones o importación (consecuencia del fuera de alcance).

## 9. Métricas de éxito

**Métrica norte (de la fuente).** A una semana de uso real, el equipo cancela la ronda de "¿en qué estás?" y nadie pide que vuelva. Cómo medirlo: al cumplirse la semana se pregunta al equipo si la ronda se ha cancelado y si alguien ha pedido recuperarla. **[SUPUESTO]** (el método)

**Métricas de soporte.** Todos los umbrales y métodos son **[SUPUESTO]** y se fijan con el equipo piloto.

| Métrica | Cómo se mide | Objetivo |
|---|---|---|
| Duración de la daily | Minutos de la daily, la semana anterior frente a la semana con FlowSync | Baja de ~15 a ≤ 8 min |
| "¿Cómo vas?" por chat | Recuento manual en el canal del equipo, semana anterior frente a semana con FlowSync | −50 % o más |
| Frescura del estado | Dos comprobaciones por sorpresa durante la semana, fuera de la daily: cada responsable confirma si sus tareas **En curso** son lo que de verdad está haciendo | ≥ 90 % coinciden |
| Adopción | Miembros que cambian al menos un estado durante la semana | ≥ 80 % del equipo |
| Solapes | Casos de dos personas trabajando en lo mismo sin saberlo, declarados por el equipo en la retro de la semana | 0 |
| Coste de actualizar | Comprobar RF-9 y RNF-2 en la propia app | ≤ 2 clics, siempre |

**Alerta [SUPUESTO].** Si la frescura del estado sale por debajo del 90 %, la métrica norte se lee con cautela: a lo mejor la ronda se ha cancelado sin que la lista refleje la realidad. Eso se investiga antes de dar la hipótesis por validada.
