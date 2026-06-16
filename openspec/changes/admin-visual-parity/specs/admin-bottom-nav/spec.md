## ADDED Requirements

### Requirement: Admin bottom navigation bar
El sistema SHALL mostrar una barra de navegación inferior fija en todas las rutas `/admin/*` (excepto `/admin/login`) con 4 tabs: Panel, Quintas, Reservas, Mensajes.

#### Scenario: Bottom nav visible en rutas admin
- **WHEN** el usuario propietario navega a cualquier ruta bajo `/admin` (excepto `/admin/login`)
- **THEN** el sistema muestra el `AdminBottomTabBar` en la parte inferior de la pantalla

#### Scenario: Bottom nav oculto en login
- **WHEN** el usuario está en `/admin/login`
- **THEN** el sistema NO muestra el `AdminBottomTabBar`

#### Scenario: Tab activo resaltado
- **WHEN** el usuario está en una ruta que comienza con `/admin/quintas`
- **THEN** el tab "Quintas" aparece con el color activo (`#2C1810`) y los demás en color inactivo (`#7A6559`)

#### Scenario: Tab activo en rutas anidadas
- **WHEN** el usuario está en `/admin/reservas/abc-123` (detalle de reserva)
- **THEN** el tab "Reservas" aparece como activo

### Requirement: Admin header con marca
El sistema SHALL mostrar un header en el panel admin con el logo "QuintApp" y el botón "Salir", sin links de navegación horizontal.

#### Scenario: Logo visible en admin
- **WHEN** el usuario propietario está autenticado y navega a cualquier ruta admin
- **THEN** el header muestra "QuintApp" como texto de marca en la esquina superior izquierda

#### Scenario: Links de navegación horizontal eliminados
- **WHEN** el usuario está en el panel admin
- **THEN** el header NO contiene links de texto a Quintas / Reservas / Mensajes (la navegación está en el bottom nav)

### Requirement: Miniatura de imagen en lista de quintas admin
El sistema SHALL mostrar una miniatura de 48×48px con la primera imagen de la quinta (o emoji fallback) en cada fila de `/admin/quintas`.

#### Scenario: Quinta con imágenes
- **WHEN** el propietario ve la lista de quintas y la quinta tiene al menos una imagen
- **THEN** se muestra la primera imagen como miniatura de 48×48px redondeada

#### Scenario: Quinta sin imágenes
- **WHEN** el propietario ve la lista de quintas y la quinta no tiene imágenes
- **THEN** se muestra un emoji fallback (derivado del nombre de la quinta) en un fondo `#F5EFE9`

### Requirement: Sistema de color unificado en admin
El sistema SHALL usar el mismo sistema de color del cliente en todas las páginas del panel admin.

#### Scenario: Texto secundario
- **WHEN** se muestra texto de apoyo (dirección, fechas, labels) en el admin
- **THEN** el color es `#7A6559` (no `gray-500` de Tailwind)

#### Scenario: Bordes y separadores
- **WHEN** se muestran bordes de cards o separadores en el admin
- **THEN** el color es `#E8DDD4` (no `gray-100` / `gray-200` de Tailwind)

#### Scenario: Pills de estado de reservas
- **WHEN** se muestra el estado de una reserva (Pendiente / Confirmada / Finalizada / Cancelada)
- **THEN** los colores de fondo y texto coinciden con los definidos en `MisReservas` (estilos inline, no clases Tailwind genéricas)

#### Scenario: Spinner de carga
- **WHEN** una página admin está cargando datos
- **THEN** el spinner usa `border-[#6B4C35]` (igual al cliente, no `border-[#C4633A]`)
