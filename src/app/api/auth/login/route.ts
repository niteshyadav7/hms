import { NextRequest } from "next/server";
import { LoginSchema } from "@/lib/validations/auth.schema";
import { AuthService } from "@/services/auth.service";
import { apiSuccess, apiError } from "@/lib/api-response";
import { AppError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = LoginSchema.parse(body);

    const result = await AuthService.login(validatedData);

    const response = apiSuccess(
      { user: result.user, token: result.token },
      "Login successful"
    );
    response.cookies.set("hms_token", result.token, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 3600,
    });

    return response;
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

export async function DELETE(req: NextRequest) {
  const response = apiSuccess(null, "Logged out successfully");
  response.cookies.delete("hms_token");
  response.cookies.set("hms_token", "", { maxAge: 0, path: "/" });
  return response;
}
