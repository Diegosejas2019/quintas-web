## Context

La página `app/admin/quintas/[id]/page.tsx` actualmente renderiza directamente el `QuintaForm`. No tiene tabs ni estructura de navegación interna. El componente `OpinionesList` existe en `src/components/OpinionesList.tsx` y fue construido para la app pública — consume `getOpiniones(quintaId)` de `src/api/opiniones.ts`. El endpoint `/opiniones/{quintaId}` es público (sin `[Authorize]`), por lo que el admin puede consumirlo sin cambios en auth.

## Goals / Non-Goals

**Goals:**
- Agregar tabs "Datos" / "Opiniones" en `/admin/quintas/[id]`
- En tab Opiniones: mostrar promedio con estrellas, contador, y lista de opiniones
- Reutilizar `getOpiniones` ya existente
- Estado vacío amigable cuando no hay opiniones

**Non-Goals:**
- Permitir al propietario responder o moderar opiniones
- Paginación de opiniones (el endpoint devuelve todas)
- Cambios en el `QuintaForm`
- Notificaciones al propietario cuando llega una nueva opinión (Etapa futura)

## Decisions

### 1. Tab state con `useState` local, no URL param

Las tabs "Datos" / "Opiniones" no necesitan ser compartibles por URL ni afectar el historial de navegación. Un simple `useState<'datos' | 'opiniones'>` en el componente es suficiente y más simple que un search param.

**Alternativa descartada**: `?tab=opiniones` en la URL. Overhead innecesario para una navegación interna de página.

### 2. Reutilizar `getOpiniones` directamente, sin abstracción admin

La función ya existe en `src/api/opiniones.ts` y apunta al endpoint público. No hay razón para crear un wrapper en `src/api/admin/`. El admin la llama directamente.

### 3. Renderizar las estrellas inline, sin componente separado

`StarRating` existe en `src/components/StarRating.tsx` — reutilizarlo para mostrar la calificación de cada opinión.

### 4. No reutilizar `OpinionesList` del cliente

`OpinionesList` incluye el modal para dejar una opinión (`OpinionModal`), que no tiene sentido en el contexto admin. Es más limpio renderizar las opiniones directamente en la página admin sin ese modal.

## Risks / Trade-offs

- **[Riesgo mínimo] Carga extra**: al entrar a `/admin/quintas/[id]` se carga el form (como siempre). Las opiniones solo se cargan al hacer click en el tab "Opiniones" — `enabled: tab === 'opiniones'` en useQuery evita cargas innecesarias.
- **[Trade-off] Sin paginación**: si una quinta tiene 100+ opiniones, se cargan todas. Aceptable para el MVP — propietarios con ese volumen son los menos y el endpoint ya lo soporta.
