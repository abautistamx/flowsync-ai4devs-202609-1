# Matriz de trazabilidad: responsable de cada tarea

Requisito: «Lo que cada tarea muestra de su responsable» (`openspec/specs/tasks/spec.md`).

**Scenarios en el requisito: 3 · Cubiertos al empezar: 0 · Cubiertos al terminar: 2 (uno en rojo)**

| Scenario | Test que lo cubre | Estado | Qué te faltó para decidirlo |
|---|---|---|---|
| Responsable con nombre «Ada Lovelace»: la tarea trae su nombre y sus iniciales. | `Tasks \| responsable / el responsable incluye su nombre e iniciales` | Cubierto (verde) | — |
| Ninguna tarea, suelta o en la lista, incluye email ni datos de acceso del responsable. | `Tasks \| responsable / el responsable no expone el email ni las fechas de su cuenta` | Cubierto, **en rojo**: `GET /api/v1/tasks` devuelve `email`, `createdAt` y `updatedAt` en `assignee` | — |
| Responsable registrado sin nombre: nombre nulo e iniciales presentes, sin recurrir al email. | `Tasks \| responsable / un responsable sin nombre conserva sus iniciales y no expone el email` | No lo sé (verde) | El test pasa, pero las iniciales («AE») salen del email; la spec no dice si eso cuenta como «recurrir al email». |

Ejecución: `node ace test functional --files=assignee` → 2 passed, 1 failed. Suite completa: 22 passed, 1 failed. El código no se ha tocado.

Cuántos scenarios creías cubiertos antes de mirar, y cuántos lo estaban. 60, niguno
El scenario en el que no supiste si faltaba un test o faltaba la regla en la spec.  Le faltaba la egla en la spec
Algo que el scenario no determinaba y tuviste que decidir al escribir el test. No aseguraba lo del email