## ADDED Requirements

### Requirement: Tabs de navegación en detalle de quinta admin
La página `/admin/quintas/[id]` SHALL mostrar dos tabs: "Datos" y "Opiniones". El tab activo SHALL ser "Datos" por defecto al cargar la página.

#### Scenario: Tab Datos activo por defecto
- **WHEN** el propietario navega a `/admin/quintas/[id]`
- **THEN** el tab "Datos" está activo y se muestra el formulario de edición de la quinta

#### Scenario: Cambiar al tab Opiniones
- **WHEN** el propietario hace click en el tab "Opiniones"
- **THEN** el sistema oculta el formulario y muestra la vista de opiniones de esa quinta

#### Scenario: Volver al tab Datos
- **WHEN** el propietario está en el tab "Opiniones" y hace click en "Datos"
- **THEN** el sistema muestra nuevamente el formulario de edición

### Requirement: Vista de promedio de calificación
El tab "Opiniones" SHALL mostrar el promedio de calificación de la quinta y la cantidad total de opiniones.

#### Scenario: Quinta con opiniones
- **WHEN** el propietario abre el tab "Opiniones" y la quinta tiene al menos una opinión
- **THEN** el sistema muestra el promedio numérico (ej. "4.3") con estrellas visuales y el total de opiniones (ej. "12 opiniones")

#### Scenario: Quinta sin opiniones
- **WHEN** el propietario abre el tab "Opiniones" y la quinta no tiene ninguna opinión
- **THEN** el sistema muestra un mensaje de estado vacío (ej. "Todavía no hay opiniones para esta quinta")

### Requirement: Listado de opiniones recibidas
El tab "Opiniones" SHALL mostrar el listado completo de opiniones de la quinta, ordenadas de más reciente a más antigua.

#### Scenario: Opinión con comentario
- **WHEN** se muestra una opinión que incluye comentario
- **THEN** el sistema muestra: nombre del cliente, calificación en estrellas, texto del comentario y fecha formateada en español

#### Scenario: Opinión sin comentario
- **WHEN** se muestra una opinión sin texto de comentario
- **THEN** el sistema muestra: nombre del cliente, calificación en estrellas y fecha, omitiendo la sección de comentario

### Requirement: Carga diferida de opiniones
El sistema SHALL cargar las opiniones únicamente cuando el propietario activa el tab "Opiniones", no al cargar la página.

#### Scenario: Carga diferida al activar tab
- **WHEN** el propietario abre `/admin/quintas/[id]` en el tab "Datos" (default)
- **THEN** el sistema NO realiza la petición a `/opiniones/{quintaId}` hasta que el propietario haga click en "Opiniones"

#### Scenario: Spinner mientras carga
- **WHEN** el propietario hace click en "Opiniones" por primera vez
- **THEN** el sistema muestra un spinner mientras obtiene las opiniones del servidor
