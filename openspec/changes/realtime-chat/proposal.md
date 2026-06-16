## Why

El chat entre cliente y propietario usa polling cada 5 segundos, lo que introduce hasta 5s de latencia en mensajes y no indica si el destinatario leyó la conversación. Para un canal de negociación de fechas y precios, la demora es perceptible y la falta de confirmación de lectura genera incertidumbre en ambas partes.

## What Changes

- **Backend (.NET)**: nuevo endpoint SSE `GET /api/conversaciones/{id}/stream` que mantiene una conexión HTTP persistente y empuja eventos `mensaje` y `leido` en tiempo real. Un Singleton `ChatHub` mantiene en memoria las conexiones activas por conversación.
- **Backend**: `EnviarMensajeHandler` notifica al hub tras guardar en MongoDB, para que el hub empuje el evento a los suscriptores activos de esa conversación.
- **Backend**: `MarcarLeidaHandler` notifica al hub para que el remitente reciba confirmación de lectura sin polling.
- **Frontend (quintas-web)**: `ChatWindow` y la página de admin reemplazan `refetchInterval: 5000` por una conexión `EventSource` al endpoint SSE. Los mensajes nuevos y eventos de lectura se aplican directamente al cache de React Query.
- **Frontend**: los mensajes propios muestran `✓` (enviado) o `✓✓` (leído) comparando `mensaje.enviadoEn` con `conversacion.UltimoLeidoPor*`.

## Capabilities

### New Capabilities

- `chat-realtime`: Entrega de mensajes en tiempo real vía SSE y confirmación de lectura por mensaje (tildes ✓ / ✓✓)

### Modified Capabilities

*(ninguna — el contrato REST existente no cambia)*

## Impact

- **Backend modificado** (`quintas-app/`): nuevo endpoint SSE en `ConversacionesController`, nuevo servicio `ChatHub` (Singleton), modificaciones en `EnviarMensajeHandler` y `MarcarLeidaHandler`
- **Frontend modificado** (`quintas-web/`): `src/components/chat/ChatWindow.tsx`, `app/admin/mensajes/[id]/page.tsx`, posiblemente un hook `useChatStream` compartido
- **Sin cambios en mobile** — Expo recibe mensajes por push (ya implementado); SSE es solo para web
- **Sin cambios de esquema MongoDB** — el modelo de dominio ya tiene `UltimoLeidoPorPropietario` / `UltimoLeidoPorCliente`
- **Sin dependencias nuevas** — SSE es nativo en .NET (`HttpResponse.Body` streaming) y en browser (`EventSource` API)
- **Restricción de deploy**: SSE requiere una sola instancia del proceso (o sticky sessions). Con el docker-compose actual (un contenedor) no hay problema. Documentar como constraint.
