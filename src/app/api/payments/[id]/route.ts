import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { AppError, NotFoundError } from "@/lib/errors";
import { z } from "zod";

const PaymentStatusSchema = z.object({
  status: z.enum(["PENDING", "PAID", "REFUNDED"]),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin(req);
    const { id } = await params;
    const body = await req.json();
    const { status } = PaymentStatusSchema.parse(body);

    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundError("Payment record not found");

    const updatedPayment = await prisma.payment.update({
      where: { id },
      data: { status },
    });

    return apiSuccess(updatedPayment, `Payment status updated to ${status}`);
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
