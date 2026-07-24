import { prisma } from "../lib/db";
import { CreateRoomInput, CreateRoomTypeInput } from "../lib/validations/room.schema";
import { ConflictError, NotFoundError } from "../lib/errors";

export class RoomService {
  // Room Type CRUD
  static async createRoomType(data: CreateRoomTypeInput) {
    const existing = await prisma.roomType.findUnique({
      where: { name: data.name },
    });

    if (existing) {
      throw new ConflictError("Room type with this name already exists");
    }

    return prisma.roomType.create({
      data: {
        name: data.name,
        description: data.description,
        basePrice: data.basePrice,
        capacity: data.capacity,
        amenities: JSON.stringify(data.amenities || []),
        images: JSON.stringify(data.images || []),
      },
    });
  }

  static async getAllRoomTypes() {
    const roomTypes = await prisma.roomType.findMany({
      include: {
        _count: {
          select: { rooms: true },
        },
      },
    });

    return roomTypes.map((type) => ({
      ...type,
      amenities: JSON.parse(type.amenities || "[]"),
      images: JSON.parse(type.images || "[]"),
    }));
  }

  // Room CRUD
  static async createRoom(data: CreateRoomInput) {
    const existing = await prisma.room.findUnique({
      where: { roomNumber: data.roomNumber },
    });

    if (existing) {
      throw new ConflictError(`Room number ${data.roomNumber} already exists`);
    }

    const roomType = await prisma.roomType.findUnique({
      where: { id: data.roomTypeId },
    });

    if (!roomType) {
      throw new NotFoundError("Selected Room Type does not exist");
    }

    return prisma.room.create({
      data: {
        roomNumber: data.roomNumber,
        roomTypeId: data.roomTypeId,
        floor: data.floor,
        status: data.status || "AVAILABLE",
      },
      include: {
        roomType: true,
      },
    });
  }

  static async getAllRooms(filters?: {
    checkIn?: string;
    checkOut?: string;
    guests?: number;
    roomTypeId?: string;
  }) {
    const whereClause: any = {};

    if (filters?.roomTypeId) {
      whereClause.roomTypeId = filters.roomTypeId;
    }

    if (filters?.guests) {
      whereClause.roomType = {
        capacity: { gte: filters.guests },
      };
    }

    // Get all rooms matching base criteria
    const rooms = await prisma.room.findMany({
      where: whereClause,
      include: {
        roomType: true,
      },
      orderBy: { roomNumber: "asc" },
    });

    // If checkIn and checkOut dates are provided, filter out rooms booked during this range
    if (filters?.checkIn && filters?.checkOut) {
      const checkInDate = new Date(filters.checkIn);
      const checkOutDate = new Date(filters.checkOut);

      // Find room IDs with active overlapping bookings
      const bookedRoomIds = await prisma.booking.findMany({
        where: {
          status: { in: ["CONFIRMED", "CHECKED_IN", "PENDING"] },
          AND: [
            { checkIn: { lt: checkOutDate } },
            { checkOut: { gt: checkInDate } },
          ],
        },
        select: { roomId: true },
      });

      const bookedSet = new Set(bookedRoomIds.map((b) => b.roomId));

      return rooms.map((room) => ({
        ...room,
        roomType: {
          ...room.roomType,
          amenities: JSON.parse(room.roomType.amenities || "[]"),
          images: JSON.parse(room.roomType.images || "[]"),
        },
        isAvailable: !bookedSet.has(room.id) && room.status === "AVAILABLE",
      }));
    }

    return rooms.map((room) => ({
      ...room,
      roomType: {
        ...room.roomType,
        amenities: JSON.parse(room.roomType.amenities || "[]"),
        images: JSON.parse(room.roomType.images || "[]"),
      },
      isAvailable: room.status === "AVAILABLE",
    }));
  }

  static async getRoomById(id: string) {
    const room = await prisma.room.findUnique({
      where: { id },
      include: { roomType: true },
    });

    if (!room) {
      throw new NotFoundError("Room not found");
    }

    return {
      ...room,
      roomType: {
        ...room.roomType,
        amenities: JSON.parse(room.roomType.amenities || "[]"),
        images: JSON.parse(room.roomType.images || "[]"),
      },
    };
  }

  static async updateRoomStatus(id: string, status: "AVAILABLE" | "OCCUPIED" | "MAINTENANCE") {
    const room = await prisma.room.findUnique({ where: { id } });
    if (!room) throw new NotFoundError("Room not found");

    return prisma.room.update({
      where: { id },
      data: { status },
    });
  }
}
