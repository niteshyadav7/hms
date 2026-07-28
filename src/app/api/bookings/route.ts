import { NextRequest } from "next/server";
import { CreateBookingSchema } from "@/lib/validations/booking.schema";
import { BookingService } from "@/services/booking.service";
import { getAuthUser } from "@/lib/auth/guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { AppError } from "@/lib/errors";
import { dispatchBus } from "@/lib/events/dispatch-bus";

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    const { searchParams } = new URL(req.url);

    const status = searchParams.get("status") || undefined;
    const search = searchParams.get("search") || undefined;

    let userId = searchParams.get("userId") || undefined;

    // If authenticated user is a Guest, force filtering to their own bookings
    if (authUser && authUser.role === "GUEST") {
      userId = authUser.userId;
    }

    const bookings = await BookingService.getBookings({ userId, status, search });
    return apiSuccess(bookings);
  } catch (error: any) {
    return apiError(error.message || "Internal server error", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    const body = await req.json();
    const validatedData = CreateBookingSchema.parse(body);

    const booking = await BookingService.createBooking(validatedData, authUser?.userId);

    // Emit Real-Time SSE Dispatch Event
    try {
      dispatchBus.emit("dispatch", {
        id: `evt_${Date.now()}`,
        type: "BOOKING_CREATED",
        title: "🎉 New Guest Reservation",
        description: `Booking #${booking.bookingNumber} confirmed for ${booking.guestName}.`,
        guestName: booking.guestName,
        amount: booking.totalPrice,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.warn("Dispatch bus emit error:", err);
    }

    return apiSuccess(booking, "Booking created successfully", 201);
  } catch (error: any) {
    if (error.name === "ZodError") {
      return apiError("Validation failed", 400, error.errors);
    }
    if (error instanceof AppError) {
      return apiError(error.message, error.statusCode);
    }
    return apiError(error.message || "Internal server error", 500);
  }
}
