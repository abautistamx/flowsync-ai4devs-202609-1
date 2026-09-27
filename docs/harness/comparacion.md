# Comparación con y sin harness

## Con HARNESS

### Qué archivos tocó
5 archivos:

1. `frontend/src/api/auth.ts`
2. `frontend/src/components/LoginForm.tsx`
3. `frontend/src/components/LoginForm.css`
4. `frontend/src/App.tsx`
5. `frontend/src/App.css`

### Qué convenciones del proyecto respetó y cuáles no

**Respetó:**

- Separación de la llamada al backend en `frontend/src/api/auth.ts`.
- Utilizó el endpoint existente `POST /api/v1/auth/login`.
- Mantuvo el frontend dentro de la estructura existente de React/Vite.
- No agregó dependencias nuevas.
- Ejecutó las comprobaciones del proyecto (`npm run lint` y `tsc -b`), que pasaron correctamente.

**No respetó:**

- No detecté una convención escrita del proyecto que haya sido incumplida de forma clara.
- El hook de lint del proyecto verificó correctamente el frontend.

### Cuántas veces tuve que intervenir

2 veces:

1. La primera intervención fue para confirmar que quería implementar el login realmente y no solamente generar el plan del ejercicio, porque Claude detectó la instrucción del README.
2. La segunda fue para preguntarle con qué credenciales había probado el login.

No tuve que corregir código ni repetir el encargo.

### Qué tendría que arreglar a mano antes de enseñarlo al equipo

No detecté correcciones funcionales necesarias después de la implementación.

Sí revisaría manualmente:

- Que las credenciales de prueba no hayan quedado escritas en archivos versionados.
- Que el comportamiento visual del formulario coincida exactamente con los criterios solicitados.
- Que el manejo del token y `localStorage` sea el comportamiento esperado para este proyecto.

---

## Sin HARNESS

### Qué archivos tocó
3 archivos:

1. `frontend/src/components/Login.tsx`
2. `frontend/src/components/Login.css`
3. `frontend/src/App.tsx`

### Qué convenciones del proyecto respetó y cuáles no

**Respetó:**

- Utilizó React para implementar el formulario.
- Consumió el endpoint existente `POST /api/v1/auth/login`.
- Mantuvo la implementación dentro de `frontend/src`.
- Utilizó los estilos en un archivo CSS separado.

**No respetó:**

- No había instrucciones explícitas del harness disponibles para esta copia que indicaran convenciones adicionales.
- No se identificó una convención escrita específica incumplida a partir de la implementación realizada.

### Cuántas veces tuve que intervenir

2 veces:

1. La primera intervención fue la solicitud original de implementación.
2. La segunda fue preguntar con qué credenciales se había probado.

No tuve que corregir ni repetir el encargo.

### Qué tendría que arreglar a mano antes de enseñarlo al equipo

No detecté un error funcional que tuviera que corregir manualmente.

Revisaría manualmente:

- Que las credenciales de prueba no estén incluidas en el código.
- Que la implementación coincida con las convenciones que se hayan establecido posteriormente en el harness.
- Que el manejo de sesión/token y logout sea el esperado por el proyecto.
- Que los estados visuales del formulario correspondan exactamente a los criterios del ticket.

## Parte B: las tres líneas

1. **Qué piezas monté y cuál me costó más de lo esperado.**  
   Monté el `CLAUDE.md` de `/init`, el MCP de Atlassian, las skills `/priority-ticket` y `/commit`, el subagente `adversarial-reviewer`, el hook de Prettier para el frontend, las reglas de proceso al final del `CLAUDE.md` y `AGENTS.md` como enlace. Lo que más tiempo me tomó de lo esperado fue la configuración y comprobación del hook de lint después de editar archivos, especialmente al detectar diferencias entre el frontend y el backend.

2. **Primera diferencia que vi entre las dos salidas.**  
   La primera diferencia concreta que observé fue la estructura de los archivos modificados: con harness se propusieron `frontend/src/api/auth.ts`, `frontend/src/components/LoginForm.tsx` y `frontend/src/components/LoginForm.css`, mientras que sin harness se utilizaron `frontend/src/components/Login.tsx` y `frontend/src/components/Login.css`. Me fijé en el resumen de archivos que Claude mostró al terminar cada implementación.

3. **Algo que dejé escrito en el harness y que el agente no cumplió igualmente.**  
   No detecté un incumplimiento de una instrucción escrita específicamente en el harness. Las comprobaciones de lint del frontend pasaron correctamente y no tuve que corregir el código generado por el agente.
