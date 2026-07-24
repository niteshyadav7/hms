import { NextRequest } from "next/server";
import { CreateRoomTypeSchema } from "@/lib/validations/room.schema";
import { RoomService } from "@/services/room.service";
import { requireAdmin } from "@/lib/auth/guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { AppError } from "@/lib/errors";

export async function GET() {
  try {
    const roomTypes = await RoomService.getAllRoomTypes();
    return apiSuccess(roomTypes);
  } catch (error: any) {
    return apiError(error.message || "Internal server error", 500);
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    const validatedData = CreateRoomTypeSchema.parse(body);

    const roomType = await RoomService.createRoomType(validatedData);
    return apiSuccess(roomType, "Room type created successfully", 201);
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
