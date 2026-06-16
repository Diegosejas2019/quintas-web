## Why

El propietario no puede bloquear fechas manualmente en sus quintas. Si una quinta no está disponible por mantenimiento, uso personal u otro motivo, hoy no hay forma de reflejarlo en el sistema sin crear una reserva falsa. Los clientes ven esas fechas como disponibles y pueden intentar reservarlas, generando fricciones y cancelaciones manuales.

## What Changes

- **Backend — Domain**: `Quinta` agrega `FechasBloqueadas: List<DateOnly>` con métodos `BloquearFecha()` y `DesbloquearFecha()`
- **Backend — Infrastructure**: `QuintaDocument` agrega campo `fechasBloqueadas`; `ToEntity`/`ToDocument` en `QuintaRepository` mapean el nuevo campo; `GetFechasOcupadasAsync` en `ReservaRepository` combina fechas de reservas + fechas bloqueadas de la quinta
- **Backend — Application**: nuevo `BloquearFechasCommand` + handler; nuevo `GetFechasBloqueadasQuery` + handler
- **Backend — API**: nuevo endpoint `PATCH /api/quintas/{id}/bloqueos` (requiere `[Authorize]`); `GetDisponibilidadHandler` se actualiza para incluir fechas bloqueadas
- **Frontend — API**: nueva función `bloquearFechas(id, fechas[])` en `src/api/admin/quintas.ts`
- **Frontend — UI**: tercer tab "Disponibilidad" en `/admin/quintas/[id]` con calendario interactivo donde el propietario puede clickear días para bloquear/desbloquear

## Capabilities

### New Capabilities

- `admin-date-blocking`: Calendario interactivo en el panel admin de quinta que permite al propietario bloquear y desbloquear fechas manualmente, con persistencia en el backend y reflejo en la disponibilidad pública

### Modified Capabilities

*(ninguno — `GetDisponibilidad` agrega fechas bloqueadas al resultado pero el contrato del endpoint no cambia)*

## Impact

- **Backend modificado** (`quintas-app/`): `Quinta.cs`, `QuintaDocument.cs`, `QuintaRepository.cs`, `ReservaRepository.cs` / `GetDisponibilidadHandler.cs`, `IQuintaRepository.cs`, `QuintasController.cs`; archivos nuevos: `BloquearFechasCommand.cs`, `BloquearFechasHandler.cs`, `GetFechasBloqueadasQuery.cs`, `GetFechasBloqueadasHandler.cs`
- **Frontend modificado** (`quintas-web/`): `src/api/admin/quintas.ts`, `app/admin/quintas/[id]/page.tsx`
- **Sin cambios en mobile**
- **Sin migraciones** — MongoDB con `[BsonIgnoreExtraElements]`, el campo nuevo se inicializa vacío en documentos existentes
- **Disponibilidad pública afectada**: los clientes ya no podrán reservar fechas bloqueadas por el propietario
