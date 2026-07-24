import { z } from "zod";

export const CreateBookingSchema = z.object({
  roomId: z.string().min(1, "Room is required"),
  checkIn: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid check-in date"),
  checkOut: z.string().refine((val) => !isNaN(Date.parse(val)), "Invalid check-out date"),
  guestsCount: z.number().int().positive("Guests count must be at least 1"),
  guestName: z.string().min(2, "Guest name is required"),
  guestEmail: z.string().email("Valid guest email is required"),
  guestPhone: z.string().min(5, "Valid phone number is required"),
  paymentMethod: z.enum(["PAY_AT_HOTEL", "ONLINE"]).default("PAY_AT_HOTEL"),
  specialRequests: z.string().optional(),
}).refine(
  (data) => new Date(data.checkOut) > new Date(data.checkIn),
  {
    message: "Check-out date must be strictly after check-in date",
    path: ["checkOut"],
  }
);

export const UpdateBookingStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "CANCELLED"]),
});

export type CreateBookingInput = z.infer<typeof CreateBookingSchema>;
export type UpdateBookingStatusInput = z.infer<typeof UpdateBookingStatusSchema>;
