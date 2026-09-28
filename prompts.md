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

---

## Prompt 1

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (plan mode)

```
Quiero que FlowSync sea una herramienta para que los equipos remotos sepan en qué está trabajando cada uno sin tener que hacer reuniones de sincronización. Algo tipo tareas compartidas pero más en tiempo real y menos rollo que Jira.
```

**Qué salió:** leyó el README del ejercicio por su cuenta, resumió el terreno existente y planteó las cinco preguntas en una sola ronda, sin bajar a datos ni endpoints.

## Prompt 2

**Modelo:** Opus 5.5
**Herramienta:** Claude Code (plan mode)

```
Pego la ficha de hechos
```

**Qué salió:** elegí la opción en el selector pero no llegué a pegar la ficha; la IA usó la del README (es la misma). Propuso 7 cosas en el alcance y 18 exclusiones justificadas, más 4 supuestos propios.

## Prompt 3

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Quita el punto 7 y el 3 del alcance
```

**Qué salió:** los quitó y renumeró (7 → 5).

## Prompt 4

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
7: Este punto sí aporta, sin embargo, resuelve una necesidad adicional a las que cubren los puntos anteriores, ya que sin este punto se puede saber quién es el responsable, el estado actual y qué se está realizando.

3:  Este punto no aporta nada, ya que el punto 1 ya solicita al responsable desde un inicio y así ya no habría una duplicidad de esfuerzos y así es más eficiente saber quien tiene la tarea asignada..
```

**Qué salió:** añadió los motivos al NO-alcance y señaló una incoherencia: en el punto 1 el responsable era opcional y no se podía editar, así que una tarea sin responsable nunca podría tenerlo.

## Prompt 5

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Añade el responsable a lo editable, aunque se llega al punto de quién esta en que, pero respeto el de que la tarea es libre para elegir
```

**Qué salió:** el responsable pasó a ser editable, y una tarea sin responsable queda libre para cogerla.

## Prompt 6

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
No considero que deba eliminar un tercer punto solo para cumplir con el número solicitado. Después de revisar los cinco puntos restantes, considero que cada uno es necesario para validar la hipótesis del MVP. Los puntos 3 y 7 fueron excluidos por las razones anteriores, mientras que eliminar cualquiera de los cinco restantes implicaría dejar de validar una parte explícita de la propuesta de valor. ¿Cómo documentarías esta situación en la Parte B sin inventar una exclusión que no considero justificada?
```

**Qué salió:** propuso documentar dos exclusiones y declarar explícitamente que no hay tercera, con el porqué.

## Prompt 7

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Escribe la línea 2 así y la 3 la redacto yo
```

**Qué salió:** escribió la línea 2 tal cual.

## Prompt 8

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Sí, añade los prompts a prompts.md
```

## Prompt 9

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Esta es mi línea 3 3. Exclusión de la que menos seguro estoy: punto 7. La incluiría si en la prueba se observa que el equipo necesita distinguir qué se movió desde la última visita para conocer el avance sin preguntar, investigar o interrumpir. El valor que daría este punto es identificar los cambios ocurridos desde la última visita
```

## Prompt 10

**Modelo:** Opus 5.5
**Herramienta:** Claude Code

```
Sí, reescribe la línea 3 manteniendo mi decisión de excluirla. Quiero que quede explícita la tensión entre lo que pide la ficha —“llego por la mañana o vuelvo de una reunión y veo qué se ha movido”— y mi criterio de mantener el alcance mínimo, ya que los puntos que permanecen permiten conocer el responsable, el estado y los cambios sin refrescar.
También cambia la referencia “punto 7” por el nombre de la capacidad: “Distinguir qué se ha movido desde la última visita”.

No cambies el resto del criterio ni añadas una tercera exclusión.
```

**Qué salió:** tras la revisión adversarial, reescribió la línea 3 con los dos polos en tensión y el nombre de la capacidad en vez de "punto 7".
