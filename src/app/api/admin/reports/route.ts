import { NextRequest } from "next/server";
import { ReportService } from "@/services/report.service";
import { requireAdmin } from "@/lib/auth/guard";
import { apiSuccess, apiError } from "@/lib/api-response";
import { AppError } from "@/lib/errors";

export async function GET(req: NextRequest) {
  try {
    await requireAdmin(req);
    const kpis = await ReportService.getDashboardKPIs();
    return apiSuccess(kpis);
  } catch (error: any) {
    if (error instanceof AppError) {
      return apiError(error.message, error.statusCode);
    }
    return apiError(error.message || "Internal server error", 500);
  }
}
