## Why

El panel de propietarios (`/admin`) tiene una identidad visual diferente a la app cliente: usa colores Tailwind genéricos, carece de logo de marca, no tiene navegación bottom-tab, y muestra las quintas sin imágenes. Esto genera una experiencia fragmentada para el usuario que alterna entre ambas secciones.

## What Changes

- **Navegación**: Reemplazar el header horizontal con links de texto por un layout con header de marca + `AdminBottomTabBar` (4 tabs: Panel, Quintas, Reservas, Mensajes) — espejando la estructura del cliente
- **Sistema de color**: Unificar al sistema del cliente — `#7A6559` para texto secundario, `#E8DDD4` para bordes, `#6B4C35` para el spinner de carga, `#4A3020` para texto principal
- **Logo de marca**: Agregar "QuintApp" en el header del admin (igual al `AppHeader` del cliente)
- **Cards de quintas**: Mostrar miniatura de imagen (o emoji fallback) en la lista `/admin/quintas`
- **Pills de estado de reservas**: Reemplazar las clases Tailwind genéricas (`green-100`, `blue-100`) por el mismo sistema inline de colores de `MisReservas`
- **Padding del layout**: Actualizar `AdminAwarePadding` para que el admin también reciba padding-bottom por el nuevo bottom nav
- **Typography**: Estandarizar h1 del admin a `text-2xl` (igual al cliente)

## Capabilities

### New Capabilities

- `admin-bottom-nav`: Componente `AdminBottomTabBar` con 4 tabs (Panel / Quintas / Reservas / Mensajes), visible solo en rutas `/admin/*`, con indicador de tab activo consistente con el `BottomTabBar` del cliente

### Modified Capabilities

*(ningún cambio de requisitos en specs existentes — solo alineación visual)*

## Impact

- **Archivos modificados**: `admin/layout.tsx`, `AdminAwarePadding.tsx`, `admin/page.tsx`, `admin/quintas/page.tsx`, `admin/reservas/page.tsx`, `admin/reservas/[id]/page.tsx`, `admin/mensajes/page.tsx`
- **Archivo nuevo**: `src/components/admin/AdminBottomTabBar.tsx`
- **Sin cambios en backend**
- **Sin cambios de API**
- **Sin cambios en mobile**
- **Sin dependencias nuevas** (usa lucide-react ya instalado)
