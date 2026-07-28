"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export interface SSEEvent {
  id: string;
  type: "BOOKING_CREATED" | "HOUSEKEEPING_REQUEST" | "ROOM_SERVICE_ORDER" | "PAYMENT_SETTLED";
  title: string;
  description: string;
  guestName?: string;
  amount?: number;
  timestamp: string;
}

export default function LiveDispatchMatrix() {
  const [connected, setConnected] = useState(false);
  const [liveEvents, setLiveEvents] = useState<SSEEvent[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource("/api/dispatch/sse");

      eventSource.onopen = () => {
        setConnected(true);
      };

      eventSource.onerror = () => {
        setConnected(false);
      };

      eventSource.addEventListener("dispatch", (event: MessageEvent) => {
        try {
          const payload: SSEEvent = JSON.parse(event.data);
          setLiveEvents((prev) => [payload, ...prev.slice(0, 9)]);

          // Show floating audio/visual alert
          toast.custom(
            (t) => (
              <div
                className={`${
                  t.visible ? "animate-enter" : "animate-leave"
                } max-w-md w-full bg-[#22005d] text-white shadow-2xl rounded-2xl p-4 border border-amber-400/40 flex items-start gap-3`}
              >
                <span className="material-symbols-outlined text-amber-300 text-2xl">
                  notifications_active
                </span>
                <div className="flex-1">
                  <h4 className="font-extrabold text-xs text-amber-300">{payload.title}</h4>
                  <p className="text-[11px] opacity-90 font-medium mt-0.5">{payload.description}</p>
                </div>
              </div>
            ),
            { duration: 4000 }
          );
        } catch (err) {
          console.error("SSE parse error:", err);
        }
      });
    } catch (err) {
      console.error("EventSource creation failed:", err);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, []);

  return (
    <div className="bg-[#232029] p-5 rounded-3xl border border-white/10 text-white shadow-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                connected ? "bg-emerald-400" : "bg-red-400"
              }`}
            ></span>
            <span
              className={`relative inline-flex rounded-full h-3 w-3 ${
                connected ? "bg-emerald-500" : "bg-red-500"
              }`}
            ></span>
          </span>
          <span className="text-xs font-black tracking-wide uppercase">
            {connected ? "LIVE SSE DISPATCH MATRIX CONNECTED" : "RECONNECTING SSE STREAM..."}
          </span>
        </div>

        <span className="text-[10px] bg-[#4f378a] px-3 py-1 rounded-full font-extrabold text-amber-300">
          EVENT-DRIVEN BROADCASTER
        </span>
      </div>

      {liveEvents.length === 0 ? (
        <div className="text-center py-4 text-xs text-gray-400 font-medium border border-dashed border-white/10 rounded-2xl">
          Listening for live guest bookings, room service, & payment events...
        </div>
      ) : (
        <div className="space-y-2">
          {liveEvents.map((evt) => (
            <div
              key={evt.id}
              className="bg-[#18161c] p-3 rounded-xl border border-white/10 flex items-center justify-between text-xs animate-in fade-in slide-in-from-top-2"
            >
              <div className="space-y-0.5">
                <span className="font-extrabold text-amber-300 block">{evt.title}</span>
                <span className="text-gray-300 text-[11px]">{evt.description}</span>
              </div>
              <span className="text-[9px] text-gray-500 font-mono">
                {new Date(evt.timestamp).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
