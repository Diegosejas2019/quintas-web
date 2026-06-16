## 1. Backend — IChatHub e implementación ChatHub

- [ ] 1.1 Crear `IChatHub.cs` en `Domain/Interfaces/`: interfaz con `EmitirMensajeAsync(Guid conversacionId, object mensajeDto)` y `EmitirLeidoAsync(Guid conversacionId, string quien, DateTime timestamp)`
- [ ] 1.2 Crear `ChatHub.cs` en `Infrastructure/Services/`: Singleton con `ConcurrentDictionary<Guid, List<SseClient>>`. Implementar `Suscribir`, `Desuscribir`, `EmitirMensajeAsync` y `EmitirLeidoAsync`
- [ ] 1.3 Crear `SseClient.cs` en `Infrastructure/Services/`: clase que wrappea `HttpResponse` con método `WriteEventAsync(string tipo, string json)` que escribe `event: tipo\ndata: json\n\n` y flushea
- [ ] 1.4 Registrar `IChatHub` / `ChatHub` como Singleton en `Infrastructure/DependencyInjection.cs`

## 2. Backend — Endpoint SSE

- [ ] 2.1 Agregar en `ConversacionesController`: `[HttpGet("{id:guid}/stream")] StreamConversacion(Guid id, [FromQuery] string token, CancellationToken ct)` — sin `[Authorize]` estándar (el token viene como query param)
- [ ] 2.2 En el endpoint: validar el JWT del query param manualmente usando `JwtSecurityTokenHandler` + las mismas `TokenValidationParameters` del startup; extraer `userId` y `rol`
- [ ] 2.3 En el endpoint: cargar la conversación y verificar que el solicitante sea participante (cliente o propietario); devolver 403 si no
- [ ] 2.4 En el endpoint: setear `Content-Type: text/event-stream`, `Cache-Control: no-cache`, `X-Accel-Buffering: no`; registrar el `SseClient` en el hub; hacer `await Task.Delay(Timeout.Infinite, ct)` para mantener la conexión; desuscribir en el bloque `finally`

## 3. Backend — Notificar al hub desde los handlers

- [ ] 3.1 Inyectar `IChatHub` en `EnviarMensajeHandler`: al final del handle, llamar `await hub.EmitirMensajeAsync(conversacion.Id, mensajeDto)` dentro de try/catch swallowing
- [ ] 3.2 Inyectar `IChatHub` en `MarcarLeidaHandler`: al final del handle, llamar `await hub.EmitirLeidoAsync(conversacion.Id, quien, DateTime.UtcNow)` dentro de try/catch swallowing
- [ ] 3.3 Compilar backend (`dotnet build`) sin errores

## 4. Frontend — Hook useChatStream

- [ ] 4.1 Crear `src/hooks/useChatStream.ts` con firma: `useChatStream(conversacionId: string, handlers: { onMensaje(m: Mensaje): void, onLeido(quien: string, timestamp: string): void })`
- [ ] 4.2 En el hook: obtener el token de `useAuthStore()` (Supabase session access token); construir la URL `{API_BASE}/conversaciones/{id}/stream?token=...`
- [ ] 4.3 En el hook: abrir `EventSource`, suscribirse a `event: mensaje` y `event: leido`; retornar cleanup que cierra el EventSource al desmontar
- [ ] 4.4 En el hook: en reconexión (evento `error` de EventSource) loguear pero dejar que el browser reconecte automáticamente (EventSource hace retry por defecto)

## 5. Frontend — Integrar useChatStream en ChatWindow (cliente)

- [ ] 5.1 En `src/components/chat/ChatWindow.tsx`: quitar `refetchInterval: 5000` del useQuery de mensajes
- [ ] 5.2 Añadir `useChatStream(conversacionId, { onMensaje, onLeido })` donde `onMensaje` llama a `queryClient.setQueryData(['mensajes', conversacionId], prev => [...prev, nuevoMensaje])` y `onLeido` actualiza el timestamp de lectura local
- [ ] 5.3 Mantener estado local `leidoEn: { Propietario?: string, Cliente?: string }` inicializado desde la conversación (si existe endpoint para obtenerla); actualizarlo con eventos `onLeido`
- [ ] 5.4 En el render de cada mensaje: mostrar `✓✓` si `esMio && leidoEn[otroRol] >= m.enviadoEn`, `✓` si `esMio && leidoEn[otroRol]` es null o anterior, nada si no es propio

## 6. Frontend — Integrar useChatStream en admin chat

- [ ] 6.1 En `app/admin/mensajes/[id]/page.tsx`: quitar `refetchInterval: 5000`
- [ ] 6.2 Añadir `useChatStream` con la misma lógica de `onMensaje` y `onLeido` que en ChatWindow
- [ ] 6.3 Mostrar tildes `✓` / `✓✓` en burbujas del propietario (mensajes con `remitenteRol === 'Propietario'`)

## 7. Backend — Obtener timestamps de lectura en GetMensajes (o GetConversacion)

- [ ] 7.1 Verificar si el frontend puede obtener `UltimoLeidoPorPropietario` y `UltimoLeidoPorCliente` del endpoint existente de conversaciones; si no están en el DTO de conversación, agregarlos al `ConversacionDto`
- [ ] 7.2 Actualizar `ConversacionDto` en Application para incluir `UltimoLeidoPorPropietario?: DateTime` y `UltimoLeidoPorCliente?: DateTime` si no existen
- [ ] 7.3 Actualizar `src/types/types.ts` en quintas-web para reflejar los campos nuevos en el tipo `Conversacion`

## 8. Verificación

- [ ] 8.1 Abrir el chat como cliente y como propietario en dos pestañas; enviar mensaje; verificar que aparece en menos de 1s en la otra pestaña sin polling
- [ ] 8.2 Verificar que al abrir la pestaña del destinatario, el remitente ve cambiar `✓` a `✓✓` en tiempo real
- [ ] 8.3 Cerrar y reabrir la pestaña del cliente; verificar reconexión automática y carga correcta de mensajes
- [ ] 8.4 Compilar TypeScript del frontend sin errores (`node_modules/.bin/tsc --noEmit`)
- [ ] 8.5 Push a master (quintas-web) y verificar deploy en Vercel; probar en producción con backend corriendo
