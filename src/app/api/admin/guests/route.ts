import { NextRequest } from "next/server";
import { GuestService } from "@/services/guest.service";
import { requireAdmin } from "@/lib/auth/guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { AppError } from "@/lib/errors";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;

    const guests = await GuestService.getAllGuests(search);
    return apiSuccess(guests);
  } catch (error: any) {
    if (error instanceof AppError) {
      return apiError(error.message, error.statusCode);
    }
    return apiError(error.message || "Internal server error", 500);
  }
}
