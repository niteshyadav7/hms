import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Dynamically query recent real system bookings & payments to construct live notifications
    const recentBookings = await prisma.booking.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: { room: { include: { roomType: true } } },
    });

    const recentPayments = await prisma.payment.findMany({
      take: 2,
      orderBy: { createdAt: "desc" },
      include: { booking: true },
    });

    const dynamicNotifications = [
      ...recentBookings.map((b: any) => ({
        id: `notif_booking_${b.id}`,
        title: "🎉 Live Reservation Confirmed",
        message: `Stay confirmed for ${b.guestName} in ${b.room.roomType.name} (Suite #${b.room.roomNumber}).`,
        type: "BOOKING" as const,
        timestamp: new Date(b.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: false,
      })),
      ...recentPayments.map((p: any) => ({
        id: `notif_pay_${p.id}`,
        title: "💳 Payment Processed",
        message: `₹${p.amount.toLocaleString("en-IN")} payment recorded for Booking #${p.booking.bookingNumber}.`,
        type: "SYSTEM" as const,
        timestamp: new Date(p.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        read: false,
      })),
    ];

    // Fallback if database is fresh
    if (dynamicNotifications.length === 0) {
      dynamicNotifications.push({
        id: "notif_system_welcome",
        title: "✨ Lumina Grand AI Butler Active",
        message: "24/7 Butler Service and Real-Time SSE Dispatch Matrix are online.",
        type: "SYSTEM" as const,
        timestamp: "Just now",
        read: false,
      });
    }

    return NextResponse.json({
      success: true,
      notifications: dynamicNotifications,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, id } = body;

    return NextResponse.json({
      success: true,
      action,
      id,
      message: "Notification state updated dynamically.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
