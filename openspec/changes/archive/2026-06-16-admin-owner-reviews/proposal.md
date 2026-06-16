## Why

El propietario no tiene visibilidad sobre las opiniones que los clientes dejan en sus quintas. Esta información existe en el backend (`GET /opiniones/{quintaId}`) y se muestra a los clientes en la página pública de la quinta, pero el propietario no puede verla desde el panel admin. Sin esa visibilidad, el propietario no puede entender qué aspectos le valoran y cuáles mejorar.

## What Changes

- **Tabs en `/admin/quintas/[id]`**: la página de edición de quinta pasa a tener dos tabs — "Datos" (el form actual) y "Opiniones" (nueva vista)
- **Vista de opiniones**: muestra promedio de estrellas, cantidad total, y listado de opiniones con nombre del cliente, calificación, comentario y fecha
- **Estado vacío**: mensaje amigable cuando la quinta aún no tiene opiniones

## Capabilities

### New Capabilities

- `admin-quinta-reviews`: Vista de opiniones recibidas dentro del panel de edición de quinta, con promedio de rating y listado completo

### Modified Capabilities

*(ninguno — el form de edición no cambia en requisitos, solo se envuelve en un tab)*

## Impact

- **Archivos modificados**: `app/admin/quintas/[id]/page.tsx`
- **Sin archivos nuevos de componentes** — se reutiliza `src/api/opiniones.ts` (ya existe, función `getOpiniones`)
- **Sin cambios en backend**
- **Sin cambios de API** — el endpoint `GET /opiniones/{quintaId}` ya está implementado y es público
- **Sin cambios en mobile**
