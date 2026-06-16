## 1. Nuevo componente AdminBottomTabBar

- [x] 1.1 Crear `src/components/admin/AdminBottomTabBar.tsx` con 4 tabs: Panel (`/admin`), Quintas (`/admin/quintas`), Reservas (`/admin/reservas`), Mensajes (`/admin/mensajes`)
- [x] 1.2 Usar íconos de lucide-react: `LayoutDashboard`, `Home`, `CalendarDays`, `MessageCircle`
- [x] 1.3 Detectar tab activo con `pathname.startsWith()` para cubrir rutas anidadas (ej. `/admin/reservas/[id]`)
- [x] 1.4 Aplicar color activo `#2C1810` e inactivo `#7A6559`, igual al `BottomTabBar` del cliente
- [x] 1.5 Agregar `style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}` para safe area en iOS

## 2. Refactor de admin/layout.tsx

- [x] 2.1 Reemplazar el `<header>` actual (nav horizontal con links) por un header simple: logo "QuintApp" a la izquierda + botón "Salir" a la derecha
- [x] 2.2 Montar `<AdminBottomTabBar />` dentro del layout, visible solo cuando `perfil.tipoUsuario === 'propietario'`
- [x] 2.3 Verificar que el componente no se muestra en `/admin/login` (el layout ya retorna `children` sin header cuando no hay user)

## 3. Actualizar AdminAwarePadding

- [x] 3.1 En `src/components/AdminAwarePadding.tsx`, agregar padding-bottom para admin igual al del cliente: `calc(72px + env(safe-area-inset-bottom))`
- [x] 3.2 Verificar que la página de chat `admin/mensajes/[id]` ajusta su altura `h-[calc(100dvh-64px)]` para contemplar el nuevo bottom nav (cambiar a `h-[calc(100dvh-64px-56px)]` o similar)

## 4. Unificación de colores en páginas admin

- [x] 4.1 `admin/page.tsx`: cambiar spinner de `border-[#C4633A]` a `border-[#6B4C35]`, `h1` de `text-xl` a `text-2xl`, `text-[#2C1810]` → `text-[#4A3020]` para texto principal
- [x] 4.2 `admin/reservas/page.tsx`: reemplazar `ESTADO_COLORS` con clases Tailwind genéricas por estilos inline idénticos a `MisReservas`; actualizar chips de filtro para usar `#E8DDD4` como borde inactivo
- [x] 4.3 `admin/reservas/[id]/page.tsx`: idem `ESTADO_COLORS`, spinner a `border-[#6B4C35]`
- [x] 4.4 `admin/mensajes/page.tsx`: `max-w-3xl` → `max-w-lg` para consistencia con el resto del admin
- [x] 4.5 `admin/quintas/page.tsx`: spinner a `border-[#6B4C35]`, labels de texto secundario a `#7A6559`

## 5. Miniatura de imagen en lista de quintas

- [x] 5.1 En `admin/quintas/page.tsx`, agregar a cada fila de quinta un bloque de 48×48px: si `q.imagenes[0]` existe mostrar `<img>` con `object-cover`, si no mostrar emoji fallback con `bg-[#F5EFE9]` (mismo patrón de `QuintaCard`)
- [x] 5.2 Ajustar el layout de la fila para acomodar la miniatura a la izquierda del texto

## 6. Verificación final

- [x] 6.1 Navegar por todas las páginas admin y verificar que el bottom nav es visible y el tab activo correcto
- [x] 6.2 Verificar en móvil que el safe area bottom funciona correctamente
- [x] 6.3 Verificar que `/admin/login` no muestra el bottom nav
- [x] 6.4 Verificar que el chat (`/admin/mensajes/[id]`) ocupa la altura correcta sin quedar oculto por el bottom nav
- [ ] 6.5 Push a master para deploy en Vercel y verificar en producción
