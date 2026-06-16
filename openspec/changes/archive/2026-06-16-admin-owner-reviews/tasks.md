## 1. Agregar tabs en /admin/quintas/[id]

- [x] 1.1 Agregar `useState<'datos' | 'opiniones'>('datos')` como tab activo en `app/admin/quintas/[id]/page.tsx`
- [x] 1.2 Renderizar dos botones de tab ("Datos" / "Opiniones") entre el h1 y el contenido, con estilo activo/inactivo usando colores `#4A3020` / `#7A6559` consistentes con el admin
- [x] 1.3 Envolver el `<QuintaForm>` en un condicional `tab === 'datos'` para ocultarlo cuando no está activo

## 2. Vista de opiniones

- [x] 2.1 Agregar `useQuery` para `getOpiniones(id)` con `enabled: tab === 'opiniones'` para carga diferida
- [x] 2.2 Mientras carga: mostrar spinner `border-[#6B4C35]`
- [x] 2.3 Si `data.opiniones.length === 0`: mostrar estado vacío con emoji 💬 y texto "Todavía no hay opiniones para esta quinta"
- [x] 2.4 Si hay opiniones: mostrar card de resumen con `StarRating` (promedio), valor numérico formateado a 1 decimal, y total de opiniones
- [x] 2.5 Renderizar listado de opiniones — cada item: nombre del cliente, `StarRating` (calificación individual), comentario opcional, fecha en español (`toLocaleDateString('es-AR')`)

## 3. Verificación

- [x] 3.1 Verificar que al cargar `/admin/quintas/[id]` el tab "Datos" está activo y el form se muestra
- [x] 3.2 Verificar que al clickear "Opiniones" se hace la petición y se muestran las opiniones
- [x] 3.3 Verificar el estado vacío en una quinta sin opiniones
- [x] 3.4 Push a master y verificar en Vercel
