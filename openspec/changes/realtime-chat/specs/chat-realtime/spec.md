## ADDED Requirements

### Requirement: Entrega de mensajes en tiempo real
El sistema SHALL entregar mensajes nuevos al destinatario en menos de 200ms desde el envío, sin requerir polling del cliente.

#### Scenario: Mensaje llega en tiempo real
- **WHEN** el participante A envía un mensaje en una conversación
- **AND** el participante B tiene el chat abierto con una conexión SSE activa
- **THEN** el mensaje aparece en la pantalla de B dentro de 200ms sin ninguna acción del usuario

#### Scenario: Sin conexión SSE activa no hay pérdida de datos
- **WHEN** el participante B no tiene el chat abierto
- **AND** A envía un mensaje
- **THEN** B recibe una push notification (comportamiento existente)
- **AND** al abrir el chat, B ve el mensaje vía la carga REST normal

#### Scenario: Reconexión automática tras pérdida de conexión
- **WHEN** la conexión SSE se interrumpe (red inestable, suspensión de dispositivo)
- **THEN** el cliente reconecta automáticamente al stream
- **AND** no se pierden mensajes previos (se cargan vía REST al reconectar)

### Requirement: Endpoint SSE de stream por conversación
El sistema SHALL exponer `GET /api/conversaciones/{id}/stream` que mantiene una conexión HTTP abierta y emite eventos en formato SSE.

#### Scenario: Conexión exitosa al stream
- **WHEN** un participante autenticado solicita `GET /api/conversaciones/{id}/stream`
- **AND** es participante legítimo de esa conversación (cliente o propietario)
- **THEN** el servidor responde con `Content-Type: text/event-stream`
- **AND** la conexión permanece abierta hasta que el cliente la cierra

#### Scenario: Acceso denegado a conversación ajena
- **WHEN** un usuario solicita el stream de una conversación a la que no pertenece
- **THEN** el servidor responde con 403

#### Scenario: Evento de nuevo mensaje emitido
- **WHEN** un participante envía un mensaje en la conversación
- **THEN** el stream emite un evento de tipo `mensaje` con el payload `MensajeDto` serializado en JSON

#### Scenario: Evento de lectura emitido
- **WHEN** el destinatario marca la conversación como leída (`PATCH /leer`)
- **THEN** el stream emite un evento de tipo `leido` con `{ quien: "Propietario"|"Cliente", timestamp: "ISO8601" }`

### Requirement: Tildes de confirmación de lectura por mensaje
El sistema SHALL mostrar indicadores visuales en cada mensaje enviado que indiquen si fue entregado o leído por el destinatario.

#### Scenario: Mensaje enviado no leído muestra una tilde
- **WHEN** el remitente visualiza un mensaje que envió
- **AND** el destinatario no ha abierto el chat desde que se envió el mensaje
- **THEN** el mensaje muestra el indicador `✓` (una tilde)

#### Scenario: Mensaje leído muestra doble tilde
- **WHEN** el remitente visualiza un mensaje que envió
- **AND** el destinatario abrió el chat después de que se envió ese mensaje (es decir, `UltimoLeidoPor* >= mensaje.enviadoEn`)
- **THEN** el mensaje muestra el indicador `✓✓` (doble tilde)

#### Scenario: Tilde se actualiza en tiempo real
- **WHEN** el chat del remitente está abierto
- **AND** el destinatario abre el chat y dispara `PATCH /leer`
- **THEN** los mensajes anteriores del remitente cambian de `✓` a `✓✓` sin recargar la página

#### Scenario: Solo los mensajes propios muestran tilde
- **WHEN** el usuario visualiza mensajes del otro participante
- **THEN** esos mensajes NO muestran indicador de tilde (la tilde solo aplica a mensajes enviados por el propio usuario)

### Requirement: Hook useChatStream encapsula la lógica SSE
El sistema SHALL proveer un hook reutilizable `useChatStream` para las pantallas de chat web.

#### Scenario: Hook inicializa y limpia la conexión
- **WHEN** el componente de chat monta con un `conversacionId`
- **THEN** el hook abre una conexión `EventSource` al endpoint de stream
- **AND** al desmontar el componente, el hook cierra la conexión

#### Scenario: Evento de mensaje recibido por el hook
- **WHEN** llega un evento SSE de tipo `mensaje`
- **THEN** el hook invoca el callback `onMensaje` con el payload deserializado

#### Scenario: Evento de lectura recibido por el hook
- **WHEN** llega un evento SSE de tipo `leido`
- **THEN** el hook invoca el callback `onLeido` con `{ quien, timestamp }`
