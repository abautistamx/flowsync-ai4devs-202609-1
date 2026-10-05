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

## Prompt 1

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code

```

Quiero documentar el comportamiento actual del vertical de cuentas y acceso de este proyecto.
Explora el repositorio y localiza todo lo necesario para entender el comportamiento observable de:

- registro
- inicio de sesión
- sesión
- perfil
- protección de acceso
Considera tanto backend como frontend.
No modifiques ningún archivo.
No implementes cambios.
No corrijas bugs.
Primero quiero que explores el código y me indiques qué partes relevantes has encontrado y qué comportamiento observable identificas.

```

**Qué salió:** Me dió bastante información para poder validar los requisitos


## Prompt 2

**Modelo:** Opus 5.5 Medium
**Herramienta:** Claude Code

```

Ahora, a partir de la exploración que acabas de hacer, escribe un primer borrador de la spec del comportamiento actual del vertical de cuentas y acceso.
El alcance es únicamente:

- registro
- inicio de sesión
- sesión
- perfil
- protección de acceso
Debe cubrir tanto el comportamiento observable de la API como el comportamiento observable en la interfaz.
No describas implementación interna. No incluyas nombres de archivos, clases, funciones, controladores, componentes ni rutas de código. Describe únicamente lo que una persona o un cliente de la API puede observar.

```

**Qué salió:** Aquí me dio información más exacta de lo que solicita el ejercicio
