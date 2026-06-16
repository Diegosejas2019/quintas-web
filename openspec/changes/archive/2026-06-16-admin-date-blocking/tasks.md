## 1. Backend — Domain

- [x] 1.1 En `Quinta.cs`: agregar propiedad `FechasBloqueadas: List<DateOnly>` (init `[]`) con setter privado
- [x] 1.2 En `Quinta.cs`: agregar método `SetFechasBloqueadas(List<DateOnly> fechas)` que reemplaza la lista y actualiza `UpdatedAt`

## 2. Backend — Infrastructure (QuintaDocument y QuintaRepository)

- [x] 2.1 En `QuintaDocument.cs`: agregar `[BsonElement("fechasBloqueadas")] public List<string> FechasBloqueadas { get; set; } = [];` (serializar como strings `"yyyy-MM-dd"`)
- [x] 2.2 En `QuintaRepository.cs` — `ToEntity`: agregar `Set(q, "FechasBloqueadas", d.FechasBloqueadas.Select(s => DateOnly.Parse(s)).ToList())`
- [x] 2.3 En `QuintaRepository.cs` — `ToDocument`: agregar `FechasBloqueadas = q.FechasBloqueadas.Select(f => f.ToString("yyyy-MM-dd")).ToList()`

## 3. Backend — Infrastructure (GetFechasOcupadas con bloqueos)

- [x] 3.1 En `ReservaRepository.cs`, inyectar `IQuintaRepository` en el constructor para acceder a `FechasBloqueadas`
- [x] 3.2 En `GetFechasOcupadasAsync`: tras obtener fechas de reservas, leer `quinta.FechasBloqueadas`, filtrar las del mes/año solicitado, unirlas al resultado y devolver lista unificada ordenada sin duplicados

## 4. Backend — Infrastructure (GetDisponiblesEsteFinde con bloqueos)

- [x] 4.1 En `QuintaRepository.GetDisponiblesEstefindeAsync`: tras filtrar quintas por reservas (`ocupadasSet`), obtener las quintas candidatas y excluir aquellas cuyas `FechasBloqueadas` incluyan algún día del rango viernes–domingo

## 5. Backend — Application y API

- [x] 5.1 Crear `BloquearFechasCommand.cs` en `Application/Features/Quintas/Commands/BloquearFechas/`: record con `(Guid QuintaId, List<DateOnly> Fechas, string PropietarioId)`
- [x] 5.2 Crear `BloquearFechasHandler.cs`: obtiene la quinta, valida que `PropietarioId` coincida, llama a `quinta.SetFechasBloqueadas(cmd.Fechas)`, guarda con `UnitOfWork`
- [x] 5.3 En `IQuintaRepository.cs`: no se requieren métodos nuevos (se reutiliza `GetByIdAsync` + `SaveChangesAsync`)
- [x] 5.4 En `QuintasController.cs`: agregar endpoint `[Authorize] [HttpPatch("{id:guid}/bloqueos")] BloquearFechas(Guid id, [FromBody] BloquearFechasRequest req)` que despacha `BloquearFechasCommand`; agregar record `BloquearFechasRequest(List<string> Fechas)` con parsing a `DateOnly`

## 6. Frontend — API

- [x] 6.1 En `src/api/admin/quintas.ts`: agregar `bloquearFechas(id: string, fechas: string[]): Promise<void>` que hace `PATCH /quintas/{id}/bloqueos` con `{ fechas }`
- [x] 6.2 En `src/api/admin/quintas.ts`: agregar `getFechasBloqueadas(id: string): Promise<string[]>` que hace `GET /quintas/{id}` y extrae `fechasBloqueadas` del objeto quinta (reutiliza el endpoint existente)

## 7. Frontend — Componente AdminCalendar

- [x] 7.1 Crear `src/components/admin/AdminCalendar.tsx` con props: `quintaId: string`
- [x] 7.2 Estado interno: `mes`, `anio`, `fechasBloqueadas: Set<string>` (inicializado desde la quinta), `pendingChanges: boolean`
- [x] 7.3 Cargar fechas ocupadas con `useQuery(['disponibilidad', quintaId, mes, anio], () => getDisponibilidad(quintaId, mes, anio))`
- [x] 7.4 Cargar fechas bloqueadas actuales con `useQuery(['admin-quintas'])` (ya cargadas por el layout) — extraer `quinta.fechasBloqueadas`
- [x] 7.5 Renderizar grilla de días igual a `AvailabilityCalendar` con tres estados visuales:
  - Disponible: fondo blanco, texto `#2C1810`
  - Reservado (de cliente): `bg-red-100 text-red-600` (igual al calendario cliente)
  - Bloqueado por propietario: `bg-[#E8DDD4] text-[#6B4C35] font-semibold`
- [x] 7.6 Click en día disponible → agrega a `fechasBloqueadas` local; click en día bloqueado → quita; días reservados: no clicables (`pointer-events-none`)
- [x] 7.7 Mostrar botón "Guardar cambios" cuando `pendingChanges === true`; al clickear llama a `bloquearFechas(quintaId, [...fechasBloqueadas])` via `useMutation`; al éxito `pendingChanges = false`, invalida query `['admin-quintas']`
- [x] 7.8 Leyenda de tres colores al pie del calendario

## 8. Frontend — Integración en /admin/quintas/[id]

- [x] 8.1 En `app/admin/quintas/[id]/page.tsx`: extender tipo de tab a `'datos' | 'opiniones' | 'disponibilidad'`
- [x] 8.2 Agregar botón de tab "Disponibilidad" en la barra de tabs existente
- [x] 8.3 Renderizar `<AdminCalendar quintaId={id} />` cuando `tab === 'disponibilidad'`

## 9. Verificación

- [x] 9.1 Compilar el backend (`dotnet build`) sin errores
- [x] 9.2 Verificar en Swagger que `PATCH /api/quintas/{id}/bloqueos` devuelve 204
- [x] 9.3 Verificar que las fechas bloqueadas aparecen en rojo/marrón en el calendario admin
- [x] 9.4 Verificar que las fechas bloqueadas aparecen como ocupadas en el calendario público del cliente
- [x] 9.5 Verificar que una quinta con día bloqueado en el finde no aparece en la búsqueda pública
- [x] 9.6 Push a master (quintas-web) y `dotnet run` / docker-compose up (quintas-app) para verificar en producción/local
