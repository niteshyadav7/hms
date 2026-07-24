import { z } from "zod";

export const CreateRoomTypeSchema = z.object({
  name: z.string().min(2, "Room type name is required"),
  description: z.string().optional(),
  basePrice: z.number().positive("Price must be positive"),
  capacity: z.number().int().positive("Capacity must be at least 1"),
  amenities: z.array(z.string()).optional().default([]),
  images: z.array(z.string()).optional().default([]),
});

export const CreateRoomSchema = z.object({
  roomNumber: z.string().min(1, "Room number is required"),
  roomTypeId: z.string().min(1, "Room type selection is required"),
  floor: z.number().int().optional(),
  status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE"]).optional().default("AVAILABLE"),
});

export const RoomSearchQuerySchema = z.object({
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z.coerce.number().int().positive().optional(),
  roomTypeId: z.string().optional(),
});

export type CreateRoomTypeInput = z.infer<typeof CreateRoomTypeSchema>;
export type CreateRoomInput = z.infer<typeof CreateRoomSchema>;
export type RoomSearchQueryInput = z.infer<typeof RoomSearchQuerySchema>;
