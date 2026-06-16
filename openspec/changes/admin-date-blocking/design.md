## Context

**Backend**: `Quinta` (Domain) no tiene campo para fechas bloqueadas. La disponibilidad se consulta vía `ReservaRepository.GetFechasOcupadasAsync` que lee de la colección `fechas_ocupadas` (documentos `FechaOcupada` con `reservaId`, `quintaId`, `fecha`). `QuintaDocument` usa `[BsonIgnoreExtraElements]` por lo que agregar campos nuevos no rompe documentos existentes. El `QuintaRepository` mapea entidad↔documento manualmente via reflection.

**Frontend**: `AvailabilityCalendar` (cliente) es read-only y consume `getDisponibilidad`. En la Etapa 1 se agregaron tabs "Datos" / "Opiniones" en `/admin/quintas/[id]` — este cambio agrega un tercer tab "Disponibilidad".

## Goals / Non-Goals

**Goals:**
- Propietario puede bloquear/desbloquear fechas individuales desde un calendario en el panel admin
- Fechas bloqueadas aparecen como ocupadas en la vista pública del cliente (no puede reservarlas)
- Sin migración de datos — documentos existentes sin el campo se tratan como lista vacía
- El calendario admin muestra tres estados: disponible, bloqueado-por-propietario, reservado-por-cliente

**Non-Goals:**
- Bloqueo de rangos de fechas en una sola acción (solo fechas individuales por click)
- Notificaciones al propietario de cambios de disponibilidad
- Bloqueos recurrentes (ej: "todos los lunes")
- Editar reservas existentes desde este calendario

## Decisions

### 1. Almacenar fechas bloqueadas en la entidad Quinta, no como documentos separados

**Opción A (elegida)**: `Quinta.FechasBloqueadas: List<DateOnly>` → se persiste en `QuintaDocument.FechasBloqueadas`. Consulta simple: leer la quinta, devolver el campo.

**Opción B descartada**: colección separada `fechas_bloqueadas` similar a `fechas_ocupadas`. Overhead de índices, queries adicionales y join lógico sin beneficio claro para el volumen esperado (propietarios con docenas de fechas bloqueadas, no miles).

### 2. Endpoint PATCH /quintas/{id}/bloqueos reemplaza la lista completa

El frontend envía el array completo de fechas bloqueadas actualizado. Más simple que endpoints separados de add/remove. El handler reemplaza `FechasBloqueadas` completo via `Quinta.SetFechasBloqueadas()`.

**Alternativa descartada**: endpoints `POST /bloqueos` y `DELETE /bloqueos/{fecha}`. Requiere más endpoints, más handlers, más código de cliente, sin ventaja real.

### 3. GetFechasOcupadasAsync combina reservas + fechas bloqueadas

El handler `GetDisponibilidadHandler` ya llama a `repo.GetFechasOcupadasAsync(quintaId, mes, anio)`. Se modifica ese método para también leer las fechas bloqueadas de la quinta y unirlas al resultado. El contrato del endpoint no cambia — sigue devolviendo `List<string>` de fechas ocupadas.

Requiere que `ReservaRepository` tenga acceso a la `IQuintaRepository` para obtener `FechasBloqueadas`. Se inyecta via constructor.

**Alternativa**: mover la lógica al handler `GetDisponibilidadHandler` inyectando ambos repos. Preferida opción de modificar `ReservaRepository` ya que la pregunta "¿está ocupada esta fecha?" es responsabilidad del repositorio.

**Revisión**: en realidad es más limpio que el **handler** combine las dos fuentes, así cada repo mantiene su responsabilidad simple. El handler llama a ambos repos y une los resultados.

### 4. Nuevo tab "Disponibilidad" en /admin/quintas/[id] — calendario interactivo

Se extiende el sistema de tabs de Etapa 2A (que ya tiene 'datos' | 'opiniones') a `'datos' | 'opiniones' | 'disponibilidad'`.

El calendario admin es un nuevo componente `AdminCalendar` en `src/components/admin/AdminCalendar.tsx`:
- Reutiliza la UI de `AvailabilityCalendar` (navegación mes/año, grilla de días)
- Agrega estado local de fechas bloqueadas pendientes de guardar
- Click en día disponible → lo marca como bloqueado (optimistic local)
- Click en día bloqueado → lo desmarca
- Botón "Guardar cambios" → llama a `bloquearFechas(id, fechasBloqueadasActualizadas)`
- Días con reserva (de clientes) no son clicables

### 5. Nuevo método en Quinta en lugar de BloquearFecha/DesbloquearFecha individuales

`Quinta.SetFechasBloqueadas(List<DateOnly> fechas)` — reemplaza la lista completa. Más simple que métodos add/remove dado que el endpoint ya recibe la lista completa.

## Risks / Trade-offs

- **[Riesgo] Concurrencia**: si dos sesiones del propietario modifican fechas simultáneamente, la última escritura gana (last-write-wins). Aceptable — un solo propietario por quinta.
- **[Riesgo] Disponibilidad ya filtrada**: `GetDisponiblesEstefindeAsync` en `QuintaRepository` no considera fechas bloqueadas (filtra por reservas en `fechas_ocupadas`). Una quinta con fechas bloqueadas en el finde podría seguir apareciendo en la búsqueda pública. → Mitigación: también actualizar `GetDisponiblesEstefindeAsync` para excluir quintas con fechas bloqueadas que superpongan el rango buscado. Si el finde tiene algún día bloqueado, la quinta no aparece.
- **[Trade-off] Lista completa en PATCH**: si el propietario tiene 30 fechas bloqueadas y quita 1, envía 29 fechas. Payload pequeño, aceptable.
