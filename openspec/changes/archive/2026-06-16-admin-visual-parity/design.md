## Context

La app tiene dos mundos: cliente (`/`) y propietario (`/admin`). El cliente usa un design system consistente con colores custom (`#4A3020`, `#6B4C35`, `#7A6559`, `#E8DDD4`), `AppHeader` con logo, y `BottomTabBar` con 5 tabs. El admin usa un header horizontal con links de texto plano, colores Tailwind genéricos mezclados con algunos colores custom, y no tiene navegación persistente tipo tab.

El `BottomTabBar` del cliente ya se oculta en rutas `/admin` via `pathname.startsWith('/admin')`. El `AdminAwarePadding` ya distingue admin de cliente para el padding-bottom, pero actualmente el admin no tiene padding-bottom porque no tiene bottom nav.

## Goals / Non-Goals

**Goals:**
- Nuevo componente `AdminBottomTabBar` con 4 tabs, visible solo en `/admin/*`
- Header del admin con logo "QuintApp" igual al cliente, sin los links de navegación (los tabs los reemplazan)
- Unificar paleta de color del admin al sistema del cliente
- Lista de quintas admin con miniatura de imagen
- Pills de estado de reservas con el mismo sistema de colores inline de `MisReservas`
- `AdminAwarePadding` actualizado para que el admin también tenga padding-bottom

**Non-Goals:**
- Opiniones recibidas por quinta (Etapa 2A)
- Calendario de ocupación / bloqueo de fechas (Etapa 2B)
- Sidebar en desktop (decisión: bottom nav en todos los tamaños)
- Cambios en mobile o backend

## Decisions

### 1. AdminBottomTabBar como componente separado (no reutilizar BottomTabBar)

`BottomTabBar` tiene lógica de tabs del cliente (Home, Mapa, Favoritos, etc.) y ya se oculta en `/admin`. Crear un componente separado `AdminBottomTabBar` mantiene cada uno independiente y evita condicionales complejos.

Se monta en `admin/layout.tsx` directamente, no en `app/layout.tsx`, para que solo exista en el contexto admin.

**Alternativa descartada**: agregar condicional en `BottomTabBar` para mostrar tabs admin cuando `pathname.startsWith('/admin')`. Descartado porque mezcla responsabilidades y complica ambos contextos.

### 2. Header admin: logo + botón salir, sin links de navegación

Con el bottom nav cubriendo la navegación, el header solo necesita identidad de marca y acción de logout. Esto espeja el `AppHeader` del cliente (logo + íconos de acción) en lugar del patrón web clásico de nav horizontal.

### 3. Sistema de color: adoptar tokens del cliente sin crear archivo de variables

La app usa Tailwind con clases hardcodeadas. No hay un sistema de design tokens formal. La decisión es reemplazar las clases Tailwind genéricas por los valores hex del cliente directamente en los archivos admin, igual a como están en los componentes del cliente. Consistente con el patrón existente — no introducir abstracción nueva.

### 4. Miniatura de imagen en lista de quintas admin

Mostrar imagen de 48×48px (o emoji fallback igual al `QuintaCard` del cliente) como primer elemento visual de cada fila. No requiere cambio de API — `getQuintasAdmin` ya devuelve `Quinta` completa con `imagenes[]`.

### 5. AdminAwarePadding: mismo padding para admin que para cliente

Actualmente el admin tiene `undefined` (sin padding-bottom). Con el nuevo bottom nav admin, necesita el mismo `calc(72px + env(safe-area-inset-bottom))` que el cliente.

## Risks / Trade-offs

- **[Riesgo] La página de chat (`/admin/mensajes/[id]`) usa `h-[calc(100dvh-64px)]`** que asume 64px de header. Con el nuevo layout (header + bottom nav), el cálculo cambia. → Mitigation: revisar y ajustar ese cálculo a `h-[calc(100dvh-64px-56px)]` o equivalent según la altura real del bottom nav.

- **[Trade-off] Bottom nav en desktop también**: en pantallas grandes, el bottom nav puede sentirse raro. Sin embargo, la app ya está diseñada mobile-first y el admin no tiene uso desktop intensivo previsto. Decisión: bottom nav en todos los tamaños, aceptado.

- **[Riesgo] Tab activo**: el `AdminBottomTabBar` necesita detectar la ruta activa correctamente para rutas anidadas (`/admin/reservas/[id]` debe activar el tab Reservas). → Mitigation: usar `pathname.startsWith('/admin/reservas')` en lugar de igualdad exacta.
