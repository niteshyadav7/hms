import { prisma } from "../lib/db";
import { CreateBookingInput } from "../lib/validations/booking.schema";
import { ConflictError, NotFoundError, BadRequestError } from "../lib/errors";

export class BookingService {
  static async createBooking(data: CreateBookingInput, userId?: string) {
    const checkInDate = new Date(data.checkIn);
    const checkOutDate = new Date(data.checkOut);

    const timeDiff = checkOutDate.getTime() - checkInDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (nights <= 0) {
      throw new BadRequestError("Booking must be for at least 1 night");
    }

    // Execute within transaction to guarantee zero double-booking race condition
    return prisma.$transaction(async (tx) => {
      // 1. Fetch room details
      const room = await tx.room.findUnique({
        where: { id: data.roomId },
        include: { roomType: true },
      });

      if (!room) {
        throw new NotFoundError("Selected room does not exist");
      }

      if (room.status === "MAINTENANCE") {
        throw new ConflictError("Room is currently under maintenance");
      }

      if (data.guestsCount > room.roomType.capacity) {
        throw new BadRequestError(`Guest count exceeds room capacity of ${room.roomType.capacity}`);
      }

      // 2. Check for date collision overlap
      const conflictingBooking = await tx.booking.findFirst({
        where: {
          roomId: data.roomId,
          status: { in: ["CONFIRMED", "CHECKED_IN", "PENDING"] },
          AND: [
            { checkIn: { lt: checkOutDate } },
            { checkOut: { gt: checkInDate } },
          ],
        },
      });

      if (conflictingBooking) {
        throw new ConflictError("Room is already booked for the selected dates");
      }

      const totalPrice = nights * room.roomType.basePrice;
      const bookingNumber = "BK-" + Math.floor(100000 + Math.random() * 900000);

      // 3. Create booking record
      const booking = await tx.booking.create({
        data: {
          bookingNumber,
          userId: userId || null,
          roomId: data.roomId,
          checkIn: checkInDate,
          checkOut: checkOutDate,
          guestsCount: data.guestsCount,
          totalPrice,
          guestName: data.guestName,
          guestEmail: data.guestEmail,
          guestPhone: data.guestPhone,
          specialRequests: data.specialRequests,
          status: "CONFIRMED",
          payments: {
            create: {
              amount: totalPrice,
              method: data.paymentMethod,
              status: data.paymentMethod === "ONLINE" ? "PAID" : "PENDING",
              transactionId: data.paymentMethod === "ONLINE" ? "TXN-" + Date.now() : undefined,
            },
          },
        },
        include: {
          room: { include: { roomType: true } },
          payments: true,
        },
      });

      return booking;
    });
  }

  static async getBookings(filters?: { userId?: string; status?: string; search?: string }) {
    const where: any = {};

    if (filters?.userId) {
      where.userId = filters.userId;
    }

    if (filters?.status) {
      where.status = filters.status;
    }

    if (filters?.search) {
      where.OR = [
        { bookingNumber: { contains: filters.search } },
        { guestName: { contains: filters.search } },
        { guestEmail: { contains: filters.search } },
      ];
    }

    return prisma.booking.findMany({
      where,
      include: {
        room: { include: { roomType: true } },
        payments: true,
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getBookingById(id: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        room: { include: { roomType: true } },
        payments: true,
      },
    });

    if (!booking) throw new NotFoundError("Booking not found");
    return booking;
  }

  static async updateStatus(id: string, newStatus: "PENDING" | "CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT" | "CANCELLED") {
    return prisma.$transaction(async (tx) => {
      const booking = await tx.booking.findUnique({
        where: { id },
        include: { room: true, payments: true },
      });

      if (!booking) throw new NotFoundError("Booking not found");

      // Handle Room status updates based on booking state transitions
      if (newStatus === "CHECKED_IN") {
        await tx.room.update({
          where: { id: booking.roomId },
          data: { status: "OCCUPIED" },
        });
      } else if (newStatus === "CHECKED_OUT") {
        await tx.room.update({
          where: { id: booking.roomId },
          data: { status: "AVAILABLE" },
        });
        // Auto mark pending payment as paid on checkout
        await tx.payment.updateMany({
          where: { bookingId: id, status: "PENDING" },
          data: { status: "PAID" },
        });
      } else if (newStatus === "CANCELLED" && booking.room.status === "OCCUPIED") {
        await tx.room.update({
          where: { id: booking.roomId },
          data: { status: "AVAILABLE" },
        });
      }

      return tx.booking.update({
        where: { id },
        data: { status: newStatus },
        include: { room: true, payments: true },
      });
    });
  }
}
