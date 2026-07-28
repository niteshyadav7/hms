import { EventEmitter } from "events";

export interface DispatchEventPayload {
  id: string;
  type: "BOOKING_CREATED" | "HOUSEKEEPING_REQUEST" | "ROOM_SERVICE_ORDER" | "PAYMENT_SETTLED";
  title: string;
  description: string;
  roomNumber?: string;
  guestName?: string;
  amount?: number;
  timestamp: string;
}

class DispatchEventBus extends EventEmitter {}

// Global singleton instance for hot-reloading safe event emission
const globalForDispatch = globalThis as unknown as {
  dispatchBus: DispatchEventBus | undefined;
};

export const dispatchBus =
  globalForDispatch.dispatchBus ?? new DispatchEventBus();

if (process.env.NODE_ENV !== "production") {
  globalForDispatch.dispatchBus = dispatchBus;
}
