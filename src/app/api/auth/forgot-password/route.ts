import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { apiSuccess, apiError } from "@/lib/api-response";
import { z } from "zod";

const ForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = ForgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      // Return success to prevent email enumeration attacks
      return apiSuccess(null, "If an account exists with this email, a password reset link has been sent.");
    }

    // Reset token generation simulation
    return apiSuccess(null, "If an account exists with this email, a password reset link has been sent.");
  } catch (error: any) {
    if (error.name === "ZodError") {
      return apiError("Validation failed", 400, error.errors);
    }
    return apiError(error.message || "Internal server error", 500);
  }
}
