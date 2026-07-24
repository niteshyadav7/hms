import { describe, it, expect, beforeAll } from "vitest";
import { BookingService } from "../src/services/booking.service";
import { RoomService } from "../src/services/room.service";
import { AuthService } from "../src/services/auth.service";
import { BadRequestError, ConflictError } from "../src/lib/errors";

describe("Senior Engineer Edge-Case Verification - Booking & Availability Engine", () => {
  let testRoomId: string;

  beforeAll(async () => {
    // Fetch an available room from seed data
    const rooms = await RoomService.getAllRooms();
    if (rooms.length > 0) {
      testRoomId = rooms[0].id;
    }
  });

  it("Edge Case 1: Prevents Check-Out date before or equal to Check-In date", async () => {
    await expect(
      BookingService.createBooking({
        roomId: testRoomId,
        checkIn: "2026-08-10",
        checkOut: "2026-08-10", // 0 nights
        guestsCount: 1,
        guestName: "Test Guest",
        guestEmail: "test@example.com",
        guestPhone: "1234567890",
        paymentMethod: "PAY_AT_HOTEL",
      })
    ).rejects.toThrow(BadRequestError);
  });

  it("Edge Case 2: Prevents booking guest count exceeding room capacity", async () => {
    await expect(
      BookingService.createBooking({
        roomId: testRoomId,
        checkIn: "2026-08-10",
        checkOut: "2026-08-12",
        guestsCount: 99, // Exceeds capacity
        guestName: "Test Guest",
        guestEmail: "test@example.com",
        guestPhone: "1234567890",
        paymentMethod: "PAY_AT_HOTEL",
      })
    ).rejects.toThrow(BadRequestError);
  });

  it("Edge Case 3: Prevents Double-Booking for overlapping date ranges", async () => {
    const yr = 2040 + Math.floor(Math.random() * 50);
    // 1. First valid booking
    const booking1 = await BookingService.createBooking({
      roomId: testRoomId,
      checkIn: `${yr}-08-15`,
      checkOut: `${yr}-08-20`,
      guestsCount: 1,
      guestName: "Alice Smith",
      guestEmail: "alice@example.com",
      guestPhone: "1234567890",
      paymentMethod: "PAY_AT_HOTEL",
    });

    expect(booking1.bookingNumber).toBeDefined();

    // 2. Attempt overlapping booking -> Should be rejected with ConflictError
    await expect(
      BookingService.createBooking({
        roomId: testRoomId,
        checkIn: `${yr}-08-18`,
        checkOut: `${yr}-08-22`,
        guestsCount: 1,
        guestName: "Bob Johnson",
        guestEmail: "bob@example.com",
        guestPhone: "0987654321",
        paymentMethod: "PAY_AT_HOTEL",
      })
    ).rejects.toThrow(ConflictError);

    // Clean up test booking
    await BookingService.updateStatus(booking1.id, "CANCELLED");
  });

  it("Edge Case 4: Prevents booking a room currently set to MAINTENANCE", async () => {
    // Set room to maintenance
    await RoomService.updateRoomStatus(testRoomId, "MAINTENANCE");

    await expect(
      BookingService.createBooking({
        roomId: testRoomId,
        checkIn: "2026-09-01",
        checkOut: "2026-09-03",
        guestsCount: 1,
        guestName: "Charlie",
        guestEmail: "charlie@example.com",
        guestPhone: "1112223333",
        paymentMethod: "PAY_AT_HOTEL",
      })
    ).rejects.toThrow(ConflictError);

    // Reset back to available
    await RoomService.updateRoomStatus(testRoomId, "AVAILABLE");
  });

  it("Edge Case 5: Auto-syncs Room status on Check-In and Check-Out", async () => {
    const randomYear = 2030 + Math.floor(Math.random() * 100);
    const booking = await BookingService.createBooking({
      roomId: testRoomId,
      checkIn: `${randomYear}-01-01`,
      checkOut: `${randomYear}-01-05`,
      guestsCount: 1,
      guestName: "David",
      guestEmail: "david@example.com",
      guestPhone: "5554443333",
      paymentMethod: "PAY_AT_HOTEL",
    });

    // Check In -> Room becomes OCCUPIED
    const checkedIn = await BookingService.updateStatus(booking.id, "CHECKED_IN");
    expect(checkedIn.room.status).toBe("OCCUPIED");

    // Check Out -> Room becomes AVAILABLE & payment is marked PAID
    const checkedOut = await BookingService.updateStatus(booking.id, "CHECKED_OUT");
    expect(checkedOut.room.status).toBe("AVAILABLE");
    expect(checkedOut.payments[0].status).toBe("PAID");

    // Clean up
    await BookingService.updateStatus(booking.id, "CANCELLED");
  });
});
