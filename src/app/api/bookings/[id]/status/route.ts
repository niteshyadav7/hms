import { NextRequest } from "next/server";
import { UpdateBookingStatusSchema } from "@/lib/validations/booking.schema";
import { BookingService } from "@/services/booking.service";
import { getAuthUser } from "@/lib/auth/guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { AppError, ForbiddenError } from "@/lib/errors";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authUser = await getAuthUser(req);
    const { id } = await params;
    const body = await req.json();
    const { status } = UpdateBookingStatusSchema.parse(body);

    const booking = await BookingService.getBookingById(id);

    // Guests can only cancel their own bookings if not already checked in/out
    if (authUser && authUser.role === "GUEST") {
      if (booking.userId !== authUser.userId) {
        throw new ForbiddenError("You can only update your own bookings");
      }
      if (status !== "CANCELLED") {
        throw new ForbiddenError("Guests can only cancel bookings");
      }
    }

    const updatedBooking = await BookingService.updateStatus(id, status);
    return apiSuccess(updatedBooking, `Booking status updated to ${status}`);
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
