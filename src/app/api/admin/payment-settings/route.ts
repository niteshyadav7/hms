import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

// In-memory fallback configuration when Prisma model is caching
const DEFAULT_PAYMENT_CONFIG = {
  card_enabled: true,
  upi_enabled: true,
  netbanking_enabled: true,
  pay_at_hotel_enabled: true,
  gst_rate: 18,
  resort_fee: 180,
};

let inMemoryConfig = { ...DEFAULT_PAYMENT_CONFIG };

/**
 * GET /api/admin/payment-settings - Fetch live dynamic payment settings & tax rules
 */
export async function GET() {
  try {
    if ((prisma as any).systemSetting?.findMany) {
      try {
        const settings = await (prisma as any).systemSetting.findMany();
        if (Array.isArray(settings) && settings.length > 0) {
          const configFromDb: any = { ...inMemoryConfig };
          settings.forEach((s: any) => {
            if (s.key === "card_enabled") configFromDb.card_enabled = s.value === "true";
            if (s.key === "upi_enabled") configFromDb.upi_enabled = s.value === "true";
            if (s.key === "netbanking_enabled") configFromDb.netbanking_enabled = s.value === "true";
            if (s.key === "pay_at_hotel_enabled") configFromDb.pay_at_hotel_enabled = s.value === "true";
            if (s.key === "gst_rate") configFromDb.gst_rate = Number(s.value) || 18;
            if (s.key === "resort_fee") configFromDb.resort_fee = Number(s.value) || 180;
          });
          inMemoryConfig = configFromDb;
        }
      } catch (err) {
        console.warn("Prisma systemSetting findMany fallback:", err);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: inMemoryConfig,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

/**
 * POST /api/admin/payment-settings - Update dynamic payment settings (Admin)
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { card_enabled, upi_enabled, netbanking_enabled, pay_at_hotel_enabled, gst_rate, resort_fee } = body;

    inMemoryConfig = {
      card_enabled: Boolean(card_enabled),
      upi_enabled: Boolean(upi_enabled),
      netbanking_enabled: Boolean(netbanking_enabled),
      pay_at_hotel_enabled: Boolean(pay_at_hotel_enabled),
      gst_rate: Number(gst_rate) || 18,
      resort_fee: Number(resort_fee) || 180,
    };

    if ((prisma as any).systemSetting?.upsert) {
      try {
        const settingsToSave = [
          { key: "card_enabled", value: String(inMemoryConfig.card_enabled) },
          { key: "upi_enabled", value: String(inMemoryConfig.upi_enabled) },
          { key: "netbanking_enabled", value: String(inMemoryConfig.netbanking_enabled) },
          { key: "pay_at_hotel_enabled", value: String(inMemoryConfig.pay_at_hotel_enabled) },
          { key: "gst_rate", value: String(inMemoryConfig.gst_rate) },
          { key: "resort_fee", value: String(inMemoryConfig.resort_fee) },
        ];

        for (const item of settingsToSave) {
          await (prisma as any).systemSetting.upsert({
            where: { key: item.key },
            update: { value: item.value },
            create: { key: item.key, value: item.value },
          });
        }
      } catch (err) {
        console.warn("Prisma systemSetting upsert fallback:", err);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "⚡ Dynamic Payment Gateway Settings Updated!",
        data: inMemoryConfig,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
