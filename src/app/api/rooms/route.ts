import { NextRequest } from "next/server";
import { CreateRoomSchema, RoomSearchQuerySchema } from "@/lib/validations/room.schema";
import { RoomService } from "@/services/room.service";
import { requireAdmin } from "@/lib/auth/guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { AppError } from "@/lib/errors";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const filters = {
      checkIn: searchParams.get("checkIn") || undefined,
      checkOut: searchParams.get("checkOut") || undefined,
      guests: searchParams.get("guests") ? parseInt(searchParams.get("guests")!) : undefined,
      roomTypeId: searchParams.get("roomTypeId") || undefined,
    };

    const rooms = await RoomService.getAllRooms(filters);
    return apiSuccess(rooms);
  } catch (error: any) {
    return apiError(error.message || "Internal server error", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    const validatedData = CreateRoomSchema.parse(body);

    const room = await RoomService.createRoom(validatedData);
    return apiSuccess(room, "Room created successfully", 201);
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
