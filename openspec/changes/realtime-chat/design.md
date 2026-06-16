## Context

El chat actual usa `refetchInterval: 5000` en React Query — un loop que llama a `GET /api/conversaciones/{id}/mensajes` cada 5 segundos independientemente de si hay mensajes nuevos. El backend es puramente REST stateless; no hay ningún canal de notificación desde server hacia cliente más allá del push de FCM/Expo (que solo llega cuando la app está en background).

El modelo de dominio ya tiene `Conversacion.UltimoLeidoPorPropietario` y `UltimoLeidoPorCliente` (timestamps), que son actualizados por `MarcarLeidaHandler` cuando el usuario abre el chat. Lo que falta es: (a) que el remitente reciba ese timestamp en tiempo real sin polling, y (b) que los mensajes nuevos lleguen de forma push en lugar de pull.

**Restricción crítica**: el deploy actual es un único contenedor Docker. No hay múltiples instancias, no hay load balancer con sticky sessions. El Singleton en memoria es válido para este contexto.

## Goals / Non-Goals

**Goals:**
- Mensajes nuevos aparecen en el chat sin delay perceptible (< 200ms desde envío)
- Tildes de lectura: ✓ = entregado, ✓✓ = leído por el destinatario
- Cambio mínimo al modelo de dominio y al contrato REST existente
- Funciona con la infraestructura actual (un proceso .NET, un contenedor)

**Non-Goals:**
- Mensajería en tiempo real en mobile (Expo ya tiene push; SSE en React Native es complejo y no prioritario)
- Múltiples instancias/horizontal scaling (documentar como constraint, resolver con Redis si llega el momento)
- Indicador "está escribiendo..." (typing indicator) — fuera del scope de esta iteración
- Historial paginado de mensajes (todos los mensajes siguen en el array embebido)

## Decisions

### 1. SSE (Server-Sent Events) sobre WebSockets

SSE es unidireccional server→client, lo que es suficiente aquí: el cliente *envía* mensajes vía REST (POST), el servidor *empuja* eventos nuevos. WebSockets serían bidireccionales pero añadirían SignalR como dependencia, complejidad de handshake, y problemas con proxies/CDN que no manejan WebSocket upgrade.

SSE usa HTTP/1.1 estándar, funciona con el CORS actual, y el browser reconecta automáticamente con `EventSource`. En .NET se implementa directamente con `Response.Body` streaming, sin paquetes extra.

**Alternativa descartada**: Long polling — más complejo que SSE, bloquea threads durante el wait, no tiene reconexión automática.

**Alternativa descartada**: Polling reducido a 1s — sigue siendo pull innecesario, la UX no mejora porque el delay promedio es 500ms (no 0ms).

### 2. ChatHub como Singleton en memoria con ConcurrentDictionary

```
ChatHub (Singleton)
  _conexiones: ConcurrentDictionary<Guid, List<SseClient>>
  
  Suscribir(conversacionId, writer) → void
  Desuscribir(conversacionId, writer) → void
  EmitirMensaje(conversacionId, MensajeDto) → Task
  EmitirLeido(conversacionId, quien, timestamp) → Task
```

`SseClient` wrappea un `HttpResponse` y sabe escribir un evento SSE formateado. Cuando el cliente cierra la conexión (navegación, cierre de tab), se desuscribe del hub.

**Concurrencia**: `ConcurrentDictionary` para el diccionario; `lock` liviano al mutar la lista de clientes de una conversación. No hay state compartido entre requests más allá del hub.

### 3. EnviarMensajeHandler y MarcarLeidaHandler notifican al hub

Hoy `EnviarMensajeHandler` guarda en MongoDB y llama a `IPushNotificador`. Se añade una llamada a `IChatHub.EmitirMensajeAsync(conversacionId, mensajeDto)` al final del handler. Si el hub no tiene suscriptores activos para esa conversación, la llamada es no-op (el mensaje no se pierde — el otro participante lo verá cuando abra el chat vía REST normal).

`MarcarLeidaHandler` añade `IChatHub.EmitirLeidoAsync(conversacionId, quien, timestamp)` después de guardar.

Ambas llamadas son best-effort: si el hub falla (writer cerrado, excepción de IO), se swallow el error — no se deshace la transacción principal.

### 4. Tildes en frontend sin cambio de modelo

El `MensajeDto` ya incluye `EnviadoEn`. La conversación incluye `UltimoLeidoPorPropietario` y `UltimoLeidoPorCliente`. La lógica de tilde en el frontend:

```
si mensaje.remitenteRol === 'Cliente':
  leidoEn = conversacion.UltimoLeidoPorPropietario
si mensaje.remitenteRol === 'Propietario':
  leidoEn = conversacion.UltimoLeidoPorCliente

tilde = leidoEn != null && mensaje.enviadoEn <= leidoEn ? '✓✓' : '✓'
```

El evento SSE `leido` actualiza el timestamp local en el cliente sin refetch. La conversación se mantiene en el cache de React Query y se actualiza con `queryClient.setQueryData`.

### 5. Hook useChatStream para encapsular la conexión SSE

Tanto `ChatWindow` (cliente) como `app/admin/mensajes/[id]` (propietario) necesitan la misma lógica: abrir EventSource, manejar eventos, limpiar al desmontar. Se extrae a `src/hooks/useChatStream.ts`:

```ts
useChatStream(conversacionId: string, {
  onMensaje: (msg: Mensaje) => void,
  onLeido: (quien: string, timestamp: string) => void,
})
```

El hook gestiona la conexión, el cleanup en `useEffect` return, y el token de autenticación en el header (pasado como query param en la URL del EventSource ya que la API de EventSource no soporta headers custom).

## Risks / Trade-offs

- **[Riesgo] Conexiones activas en .NET**: cada chat abierto mantiene un thread del pool bloqueado esperando eventos. Con decenas de conversaciones simultáneas no es problema, pero con cientos podría ser. Mitigación: usar `async` streaming con `IAsyncEnumerable` para no bloquear threads.

- **[Riesgo] Single-instance constraint**: si en el futuro se añade una segunda instancia del contenedor, el ChatHub en memoria no comparte estado. Los mensajes solo llegarían al cliente conectado a la misma instancia que procesa el POST. Mitigación documentada: añadir Redis pub/sub como broker cuando se necesite escalar.

- **[Trade-off] Token en query param**: EventSource no soporta headers, así que el JWT debe ir en `?token=...` en la URL del stream. Esto expone el token en logs de acceso del servidor. Mitigación: usar tokens de corta duración o un token de stream dedicado (out of scope).

- **[Riesgo] Mensajes grandes embebidos en Conversacion**: con SSE se carga todo el documento al enviar. Si una conversación crece a 500+ mensajes, el `ToDocument(conversacion)` serializa todo el array. Para este scope es aceptable (límite de 1000 chars por mensaje, pocas conversaciones muy largas). El límite de 16MB de MongoDB es lejano.
