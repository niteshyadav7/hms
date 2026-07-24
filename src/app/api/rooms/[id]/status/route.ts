import { NextRequest } from "next/server";
import { RoomService } from "@/services/room.service";
import { requireAdmin } from "@/lib/auth/guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { AppError } from "@/lib/errors";
import { z } from "zod";

const StatusSchema = z.object({
  status: z.enum(["AVAILABLE", "OCCUPIED", "MAINTENANCE"]),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    const body = await req.json();
    const { status } = StatusSchema.parse(body);

    const updatedRoom = await RoomService.updateRoomStatus(id, status);
    return apiSuccess(updatedRoom, "Room status updated");
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
