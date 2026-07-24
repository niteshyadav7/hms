import { NextRequest } from "next/server";
import { GuestService } from "@/services/guest.service";
import { requireAdmin } from "@/lib/auth/guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { AppError } from "@/lib/errors";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    const body = await req.json();

    const isApproved = body.isApproved !== undefined ? Boolean(body.isApproved) : true;
    const updated = await GuestService.approveUser(id, isApproved);

    return apiSuccess(updated, `User status updated to ${isApproved ? "Approved" : "Pending"}`);
  } catch (error: any) {
    if (error instanceof AppError) {
      return apiError(error.message, error.statusCode);
    }
    return apiError(error.message || "Internal server error", 500);
  }
}
