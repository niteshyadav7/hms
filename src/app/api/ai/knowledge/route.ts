import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import knowledgeBaseStatic from "@/data/hms-knowledge-base.json";

export async function GET(req: NextRequest) {
  try {
    // 1. Query Live Database for Rooms & Types
    const dbRooms = await prisma.room.findMany({
      include: { roomType: true },
    });

    // 2. Query Live Database for Active Bookings Count & Recent Bookings
    const totalBookingsCount = await prisma.booking.count();
    const activeRoomsCount = await prisma.room.count({ where: { status: "OCCUPIED" } });

    // 3. Dynamically Serialize Live Database Rooms into RAG Knowledge Documents
    const dynamicRoomDocs = dbRooms.map((room) => ({
      id: `room_${room.id}`,
      category: "ROOM",
      title: room.roomType.name,
      content: `${room.roomType.name} (Room #${room.roomNumber}). ${room.roomType.description} Base rate ₹${room.roomType.basePrice.toLocaleString()} per night. Max capacity ${room.roomType.capacity} guests. Amenities: ${Array.isArray(room.roomType.amenities) ? room.roomType.amenities.join(", ") : String(room.roomType.amenities)}. Status: ${room.status}.`,
      metadata: {
        roomId: room.id,
        roomNumber: room.roomNumber,
        roomType: room.roomType.name,
        basePrice: room.roomType.basePrice,
        maxGuests: room.roomType.capacity,
        amenities: room.roomType.amenities,
        status: room.status,
        action: "BOOK_ROOM",
        image: room.roomType.images[0] || "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
      },
    }));

    // 4. Combine Dynamic DB Documents with Static Resort Policies & FAQs
    const combinedDocuments = [
      ...dynamicRoomDocs,
      ...knowledgeBaseStatic.documents.filter((d) => d.category !== "ROOM"),
    ];

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      singleSourceOfTruth: "DATABASE_PRISMA_LIVE",
      totalDocuments: combinedDocuments.length,
      liveMetrics: {
        totalRoomsInDB: dbRooms.length,
        occupiedRooms: activeRoomsCount,
        totalBookingsInDB: totalBookingsCount,
      },
      documents: combinedDocuments,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
