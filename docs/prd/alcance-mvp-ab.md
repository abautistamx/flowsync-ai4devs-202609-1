# Alcance MVP FlowSync

## 1. El terreno que ya existe

- Hoy FlowSync solo tiene **cuentas**: registro, login, perfil y logout (API con tokens y pantallas React).
- Modelo de datos actual: **usuario** (nombre, email, contraseña) y sus tokens de acceso. No hay tareas, estados, equipos ni nada que se actualice en vivo.
- Consecuencia: el responsable de una tarea puede ser un usuario ya registrado; la autenticación no se vuelve a especificar.

## 2. Interrogatorio

Una sola ronda, cinco preguntas. Las respuestas salen de la ficha de hechos del ejercicio.

1. **¿Qué duele hoy y qué reunión desaparece de verdad?** La ronda de "¿en qué estás?" de la daily (la mitad de sus 15 minutos) y el "¿cómo vas?" constante por chat. La parte de bloqueos sigue y este MVP no la resuelve. Episodio: dos personas tocaron el mismo módulo la misma semana sin saberlo; dos días perdidos.
2. **¿Quién cobra el valor y cómo es el equipo?** Los pares, no un lead: no hay reporte hacia arriba. Equipos remotos de 3–10 personas, roles planos, un único espacio compartido.
3. **¿Qué es "tiempo real" y qué decisión cambia?** Ver los cambios de estado de las tareas sin refrescar ni preguntar. Es frescura de la tarea, no presencia de la persona; un resumen que espera, no un aviso que interrumpe. Decisión que cambia: no empezar algo que otro ya está tocando y elegir lo siguiente sabiendo qué está libre.
4. **¿De dónde sale el estado y por qué se mantendría al día?** Lo teclea quien hace la tarea, en dos clics sobre una lista que ya tiene abierta porque es su cola de trabajo. FlowSync sustituye al gestor de tareas, no convive con él. Que la información se quede vieja es el riesgo #1.
5. **¿Qué es "menos rollo que Jira" y cómo se mide el éxito?** Una tarea es título, responsable, estado y fecha de vencimiento, sin campos obligatorios de más ni sprints, estimaciones o informes. Éxito: a una semana de uso real, el equipo cancela la ronda de "¿en qué estás?" y nadie pide que vuelva.

**Supuestos que declara la IA (la ficha no los cubre):**

- Todo usuario registrado entra en el único espacio; no hay invitaciones. Vale para el caso de estudio, no para producción.
- Si dos personas cambian la misma tarea a la vez, gana el último cambio y ambas lo ven.
- Estados fijos y pocos: Pendiente · En curso · Hecha. No configurables.
- Al crear, solo el título es obligatorio; responsable y fecha pueden quedar vacíos.

## 3. Alcance

**Problema.** En un equipo remoto pequeño nadie ve el estado del equipo sin interrumpir a alguien. La daily dedica la mitad del tiempo a "¿en qué estás?" y aun así se cuelan solapes que cuestan días.

**Usuarios.** Miembros de equipos remotos de 3–10 personas, repartidos en varios husos horarios y sin jerarquía. Caso de estudio: un equipo de producto SaaS de 6 personas en 3 husos horarios.

**Propuesta de valor.** Una lista de tareas compartida que es a la vez tu cola de trabajo y el estado del equipo. Actualizarla cuesta dos clics y, a cambio, dejas de recibir el "¿cómo vas?" y ves qué está libre antes de empezar algo.

**Alcance.**

1. Crear una tarea escribiendo solo el título; responsable y vencimiento son opcionales.
2. Cambiar el estado (Pendiente · En curso · Hecha) en dos clics desde la propia lista.
3. Una única lista compartida que muestra estado, responsable y vencimiento, con las tareas vencidas resaltadas.
4. Filtrar la lista por estado.
5. Ver los cambios de los demás sin refrescar.

Editar el título, el responsable o la fecha y borrar una tarea se dan por incluidos en los puntos 1–3. Una tarea sin responsable está libre para que alguien la coja.

**NO-alcance.** Cada exclusión lleva la hipótesis que no ayuda a validar.

- **Notificaciones push o por e-mail.** La hipótesis es que un resumen que espera basta; un aviso que interrumpe la contradice y devuelve la interrupción que queremos quitar.
- **Integración con Slack.** Valida la distribución, no si el estado se mantiene fresco, y añade un segundo sitio donde mirar.
- **Presencia ("quién está conectado", indicadores de actividad).** El estado es de la tarea, no de la persona. Es vigilancia y se rechaza a propósito.
- **Estado derivado de Git/PRs, CI o calendario.** Es otro producto, con integraciones y OAuth de terceros; la hipótesis es justo que teclearlo en dos clics es sostenible.
- **Importar o sincronizar con Jira u otro gestor.** Convivir obliga a actualizar dos veces, que es como muere esta categoría. FlowSync sustituye, no lee.
- **Varios equipos o espacios, gente en más de uno.** Para 3–10 personas un espacio basta; no cambia si se cancela la ronda.
- **Roles y permisos.** Los roles son planos; no aportan nada a ver quién está en qué.
- **Sprints, estimaciones, épicas, backlog priorizado.** Es lo que hace pesado a Jira; un equipo que lo necesite no es nuestro usuario.
- **Analítica, informes, dashboards.** Nadie cobra valor hacia arriba; no hay manager en el caso.
- **Comentarios en tareas.** Convierten la lista en un canal de conversación; la hipótesis es el estado, no la discusión.
- **Gestión de bloqueos.** La parte de bloqueos de la daily sigue; este MVP no la resuelve y no se vende como si lo hiciera.
- **Estados configurables, prioridad, etiquetas, campos personalizados.** Cada campo de más sube el coste de actualizar, que es el riesgo #1.
- **Subtareas y dependencias.** Estructura que no hace falta para saber quién está en qué.
- **Historial de actividad completo o auditoría.** Basta con saber qué cambió desde la última visita; el histórico es un informe.
- **Edición colaborativa simultánea.** "Tiempo real" es ver cambios de estado, no escribir a la vez sobre lo mismo.
- **Recordatorios de vencimiento.** Son avisos; la fecha solo sirve para ver de un vistazo qué se ha pasado de plazo.
- **Invitaciones, onboarding, gestión de miembros.** Con un espacio único y el registro que ya existe, no hacen falta para validar.
- **App móvil o modo offline.** La lista se consulta al empezar el día o al volver de una reunión, en el mismo sitio donde se trabaja.
- **Asignación de responsable como acción aparte ("me la quedo yo").** El responsable ya se indica al crear la tarea; una acción separada duplica el esfuerzo sin aportar nada a saber quién tiene cada tarea.
- **Resumen de qué se ha movido desde la última visita.** Aporta, pero cubre una necesidad adicional: sin él ya se ve quién es el responsable, el estado actual y qué se está haciendo.

## Parte B: las tres líneas

1. **Los dos números:** la IA propuso 7 cosas dentro del alcance; tras mi recorte quedan 5.
2. **Tres cosas que dejé fuera, y por qué:** solo dos.
   - **"Me la quedo yo" como acción aparte:** duplica lo que ya cubre el responsable al crear y editar la tarea; no ayuda a validar nada que el resto no valide.
   - **Resumen de qué se ha movido desde la última visita:** cubre una necesidad adicional; sin él ya se valida si el estado del equipo se ve de un vistazo (responsable, estado y en qué está cada uno).
   - **No hay tercera.** Revisé los cinco puntos restantes y cada uno valida una parte explícita de la propuesta de valor: crear sin fricción, actualizar en dos clics, ver el estado del equipo, centrarse en lo pendiente y verlo sin refrescar. Quitar cualquiera deja una parte sin validar, y no voy a inventar una exclusión para llegar al número.
3. **La exclusión de la que menos seguro estoy:** punto 7. La incluiría si en la prueba se observa que el equipo necesita distinguir qué se movió desde la última visita para conocer el avance sin preguntar, investigar o interrumpir. El valor que daría este punto es identificar los cambios ocurridos desde la última visita.
