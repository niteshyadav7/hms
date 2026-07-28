import { NextRequest } from "next/server";
import { dispatchBus, DispatchEventPayload } from "@/lib/events/dispatch-bus";

export const dynamic = "force-dynamic";

/**
 * GET /api/dispatch/sse - Live Server-Sent Events (SSE) Stream for Admin Console
 */
export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      // 1. Send initial connection heartbeat ping
      const initialMessage = `event: connected\ndata: ${JSON.stringify({
        status: "LIVE_CONNECTED",
        timestamp: new Date().toISOString(),
      })}\n\n`;
      controller.enqueue(encoder.encode(initialMessage));

      // 2. Event Listener callback
      const onDispatchEvent = (payload: DispatchEventPayload) => {
        try {
          const sseData = `event: dispatch\ndata: ${JSON.stringify(payload)}\n\n`;
          controller.enqueue(encoder.encode(sseData));
        } catch (err) {
          console.error("SSE enqueue error:", err);
        }
      };

      dispatchBus.on("dispatch", onDispatchEvent);

      // 3. Heartbeat interval every 15s to keep connection alive
      const heartbeatTimer = setInterval(() => {
        try {
          const heartbeat = `: heartbeat ${new Date().toISOString()}\n\n`;
          controller.enqueue(encoder.encode(heartbeat));
        } catch (err) {
          clearInterval(heartbeatTimer);
        }
      }, 15000);

      // 4. Cleanup when client disconnects
      req.signal.addEventListener("abort", () => {
        clearInterval(heartbeatTimer);
        dispatchBus.off("dispatch", onDispatchEvent);
        try {
          controller.close();
        } catch (e) {}
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "Content-Encoding": "none",
    },
  });
}
