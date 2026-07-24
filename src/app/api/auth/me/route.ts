import { NextRequest } from "next/server";
import { getAuthUser } from "@/lib/auth/guard";
import { AuthService } from "@/services/auth.service";
import { apiSuccess, apiError } from "@/lib/api-response";
import { AppError } from "@/lib/errors";

export async function GET(req: NextRequest) {
  try {
    const authUser = await getAuthUser(req);
    if (!authUser) {
      return apiSuccess({ user: null });
    }

    const user = await AuthService.getCurrentUser(authUser.userId);
    return apiSuccess({ user });
  } catch (error: any) {
    if (error instanceof AppError) {
      return apiError(error.message, error.statusCode);
    }
    return apiError(error.message || "Internal server error", 500);
  }
}

export async function POST(req: NextRequest) {
  // Logout endpoint
  const response = apiSuccess(null, "Logged out successfully");
  response.cookies.delete("hms_token");
  response.cookies.set("hms_token", "", { maxAge: 0, path: "/" });
  return response;
}

export async function DELETE(req: NextRequest) {
  // Logout endpoint
  const response = apiSuccess(null, "Logged out successfully");
  response.cookies.delete("hms_token");
  response.cookies.set("hms_token", "", { maxAge: 0, path: "/" });
  return response;
}
