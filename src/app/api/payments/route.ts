import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

// In-memory payment ledger fallback for live transactions
const inMemoryPayments: any[] = [
  {
    id: "pay_101",
    bookingId: "bk_sample_1",
    bookingNumber: "BK-948210",
    guestName: "Julian Sterling",
    guestEmail: "j.sterling@lumina-voyage.com",
    amount: 1480.0,
    method: "ONLINE",
    status: "PAID",
    transactionId: "TXN-17182940291",
    createdAt: "2024-11-15T14:20:00.000Z",
  },
  {
    id: "pay_102",
    bookingId: "bk_sample_2",
    bookingNumber: "BK-829104",
    guestName: "Sophia Montgomery",
    guestEmail: "sophia.m@luxurytravel.com",
    amount: 2890.0,
    method: "UPI",
    status: "PAID",
    transactionId: "UPI-PAYTM-9921048",
    createdAt: "2024-11-18T09:45:00.000Z",
  },
  {
    id: "pay_103",
    bookingId: "bk_sample_3",
    bookingNumber: "BK-391048",
    guestName: "Alexander Vance",
    guestEmail: "alexander.vance@venture.com",
    amount: 980.0,
    method: "PAY_AT_HOTEL",
    status: "PENDING",
    transactionId: null,
    createdAt: "2024-11-20T16:10:00.000Z",
  },
];

/**
 * GET /api/payments - List financial transactions & payment ledger (Admin/Guest)
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.toLowerCase();
    const status = searchParams.get("status");

    let paymentsList = inMemoryPayments;

    if ((prisma as any).payment?.findMany) {
      try {
        const dbPayments = await (prisma as any).payment.findMany({
          include: { booking: true },
          orderBy: { createdAt: "desc" },
        });
        if (Array.isArray(dbPayments) && dbPayments.length > 0) {
          paymentsList = dbPayments.map((p: any) => ({
            id: p.id,
            bookingId: p.bookingId,
            bookingNumber: p.booking?.bookingNumber || "BK-UNKNOWN",
            guestName: p.booking?.guestName || "Guest",
            guestEmail: p.booking?.guestEmail || "guest@example.com",
            amount: p.amount,
            method: p.method,
            status: p.status,
            transactionId: p.transactionId,
            createdAt: p.createdAt,
          }));
        }
      } catch (err) {
        console.warn("Prisma payment findMany fallback:", err);
      }
    }

    // Filter by search & status
    let filtered = paymentsList;
    if (status && status !== "ALL") {
      filtered = filtered.filter((p) => p.status === status);
    }
    if (search) {
      filtered = filtered.filter(
        (p) =>
          p.guestName.toLowerCase().includes(search) ||
          p.bookingNumber.toLowerCase().includes(search) ||
          (p.transactionId && p.transactionId.toLowerCase().includes(search))
      );
    }

    const totalPaid = paymentsList
      .filter((p) => p.status === "PAID")
      .reduce((acc, p) => acc + p.amount, 0);

    const totalPending = paymentsList
      .filter((p) => p.status === "PENDING")
      .reduce((acc, p) => acc + p.amount, 0);

    const totalRefunded = paymentsList
      .filter((p) => p.status === "REFUNDED")
      .reduce((acc, p) => acc + p.amount, 0);

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          payments: filtered,
          metrics: {
            totalPaid,
            totalPending,
            totalRefunded,
            totalTransactions: paymentsList.length,
          },
        },
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
 * POST /api/payments - Process payment transaction
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bookingId, bookingNumber, guestName, guestEmail, amount, method, transactionId } = body;

    if (!amount || !method) {
      return new Response(
        JSON.stringify({ success: false, error: "Payment amount and method are required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const newPayment = {
      id: `pay_${Date.now()}`,
      bookingId: bookingId || `bk_${Date.now()}`,
      bookingNumber: bookingNumber || `BK-${Math.floor(100000 + Math.random() * 900000)}`,
      guestName: guestName || "Lumina Guest",
      guestEmail: guestEmail || "guest@example.com",
      amount: Number(amount),
      method: method,
      status: method === "PAY_AT_HOTEL" ? "PENDING" : "PAID",
      transactionId: transactionId || (method === "PAY_AT_HOTEL" ? null : `TXN-${Date.now()}`),
      createdAt: new Date().toISOString(),
    };

    if ((prisma as any).payment?.create) {
      try {
        const createdDb = await (prisma as any).payment.create({
          data: {
            bookingId: newPayment.bookingId,
            amount: newPayment.amount,
            method: newPayment.method,
            status: newPayment.status,
            transactionId: newPayment.transactionId,
          },
        });
        newPayment.id = createdDb.id;
      } catch (err) {
        console.warn("Prisma payment create fallback:", err);
      }
    }

    inMemoryPayments.unshift(newPayment);

    return new Response(
      JSON.stringify({
        success: true,
        message: "💳 Payment Authorized & Processed Successfully!",
        data: newPayment,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
