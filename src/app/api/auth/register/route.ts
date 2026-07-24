import { NextRequest } from "next/server";
import { RegisterSchema } from "@/lib/validations/auth.schema";
import { AuthService } from "@/services/auth.service";
import { apiSuccess, apiError } from "@/lib/api-response";
import { AppError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validatedData = RegisterSchema.parse(body);

    const result = await AuthService.register(validatedData);

    if (result.requiresApproval) {
      return apiSuccess(
        result.user,
        "Staff account registered successfully. Pending Admin approval.",
        201
      );
    }

    const response = apiSuccess(result.user, "Registration successful", 201);
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
