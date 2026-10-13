# Matriz de trazabilidad: responsable de cada tarea

Requisito: «Lo que cada tarea muestra de su responsable» (`openspec/specs/tasks/spec.md`).

**Scenarios en el requisito: 3 · Cubiertos al empezar: 0 · Cubiertos al terminar: 2 (uno en rojo) + 1 «no lo sé»**

Cada test comprueba las tres respuestas que devuelven una tarea: `POST /api/v1/tasks`, `GET /api/v1/tasks/:id` y `GET /api/v1/tasks`.

| Scenario | Test que lo cubre | Estado | Qué te faltó para decidirlo |
|---|---|---|---|
| Responsable con nombre «Ada Lovelace»: la tarea trae su nombre y sus iniciales. | `Tasks \| responsable / el responsable incluye su nombre e iniciales` | Cubierto (verde en las tres) | — |
| Ninguna tarea, suelta o en la lista, incluye email ni datos de acceso del responsable. | `Tasks \| responsable / el responsable solo trae id, nombre e iniciales` | Cubierto, **en rojo**: la creación y la lista traen además `email`, `createdAt` y `updatedAt`; la tarea suelta, no | — |
| Responsable registrado sin nombre: nombre nulo e iniciales presentes, sin recurrir al email. | `Tasks \| responsable / un responsable sin nombre llega con nombre nulo y con iniciales` | No lo sé (**en rojo**: la creación y la lista traen el `email`) | Las iniciales («AE») salen del email y la spec no fija su valor ni dice si eso es «recurrir al email»; el test solo exige que no estén vacías. |

Ejecución: `node ace test functional --files=assignee` → 1 passed, 2 failed. Suite completa: 21 passed, 2 failed. El código no se ha tocado.

Cuántos scenarios creías cubiertos antes de mirar, y cuántos lo estaban. 60, niguno
El scenario en el que no supiste si faltaba un test o faltaba la regla en la spec.  Le faltaba la egla en la spec
Algo que el scenario no determinaba y tuviste que decidir al escribir el test. No aseguraba lo del email.