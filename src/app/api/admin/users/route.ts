import { NextRequest } from "next/server";
import { GuestService } from "@/services/guest.service";
import { requireAdmin } from "@/lib/auth/guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { AppError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin(req);
    const body = await req.json();

    if (!body.name || !body.email || !body.password) {
      return apiError("Name, Email, and Password are required", 400);
    }

    const newUser = await GuestService.createUserByAdmin({
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role || "ADMIN",
      phone: body.phone,
    });

    return apiSuccess(newUser, "New user/staff created successfully", 201);
  } catch (error: any) {
    if (error instanceof AppError) {
      return apiError(error.message, error.statusCode);
    }
    return apiError(error.message || "Internal server error", 500);
  }
}
