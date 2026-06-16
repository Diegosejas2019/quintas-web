## ADDED Requirements

### Requirement: Bloqueo de fechas por propietario
El sistema SHALL permitir al propietario marcar fechas individuales como bloqueadas en sus quintas, impidiendo que los clientes las reserven.

#### Scenario: Bloquear una fecha disponible
- **WHEN** el propietario hace click en un día disponible en el calendario admin
- **THEN** el día queda marcado visualmente como bloqueado (pendiente de guardar)

#### Scenario: Desbloquear una fecha bloqueada
- **WHEN** el propietario hace click en un día bloqueado por él en el calendario admin
- **THEN** el día vuelve a marcarse como disponible (pendiente de guardar)

#### Scenario: Guardar cambios de bloqueo
- **WHEN** el propietario hace click en "Guardar cambios" con fechas pendientes
- **THEN** el sistema persiste las fechas bloqueadas en el backend y muestra confirmación de éxito

#### Scenario: Días con reservas no son clicables
- **WHEN** un día tiene una reserva activa (Pendiente o Confirmada) de un cliente
- **THEN** ese día NO es clicable — el propietario no puede bloquearlo

### Requirement: Visualización de estados en calendario admin
El calendario admin SHALL distinguir tres estados de día con colores diferenciados.

#### Scenario: Día disponible
- **WHEN** un día no tiene reserva ni bloqueo
- **THEN** se muestra con fondo blanco/neutro

#### Scenario: Día con reserva de cliente
- **WHEN** un día tiene una reserva Pendiente o Confirmada
- **THEN** se muestra con fondo rojo claro (igual al `AvailabilityCalendar` del cliente)

#### Scenario: Día bloqueado por propietario
- **WHEN** un día está en la lista de fechas bloqueadas de la quinta
- **THEN** se muestra con fondo marrón/café (`#E8DDD4` o similar) diferenciable del rojo de reservas

### Requirement: Tab Disponibilidad en panel de quinta
La página `/admin/quintas/[id]` SHALL tener un tercer tab "Disponibilidad" junto a los tabs "Datos" y "Opiniones" existentes.

#### Scenario: Acceso al tab de disponibilidad
- **WHEN** el propietario hace click en el tab "Disponibilidad"
- **THEN** el sistema muestra el `AdminCalendar` para esa quinta, con el mes actual

#### Scenario: Carga de datos al activar tab
- **WHEN** el propietario activa el tab "Disponibilidad" por primera vez
- **THEN** el sistema carga las fechas ocupadas (reservas + bloqueos) del mes actual

### Requirement: Fechas bloqueadas excluidas de disponibilidad pública
El sistema SHALL tratar las fechas bloqueadas por el propietario como no disponibles para los clientes.

#### Scenario: Cliente ve fecha bloqueada como ocupada
- **WHEN** un cliente consulta la disponibilidad de una quinta
- **THEN** las fechas bloqueadas por el propietario aparecen como ocupadas (color rojo) en el calendario público

#### Scenario: Quinta con bloqueo en finde no aparece en búsqueda
- **WHEN** un cliente busca quintas disponibles para un fin de semana
- **AND** la quinta tiene al menos un día de ese fin de semana bloqueado
- **THEN** esa quinta NO aparece en los resultados de búsqueda

### Requirement: Persistencia sin migración
El sistema SHALL almacenar las fechas bloqueadas en el documento de la quinta en MongoDB sin requerir migración de datos.

#### Scenario: Quinta existente sin fechas bloqueadas
- **WHEN** se consulta disponibilidad de una quinta creada antes de este cambio
- **THEN** el sistema trata `FechasBloqueadas` como lista vacía y no retorna fechas bloqueadas adicionales
