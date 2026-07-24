import bcrypt from "bcryptjs";
import { prisma } from "../lib/db";
import { ConflictError, NotFoundError } from "../lib/errors";

export class GuestService {
  static async getAllGuests(search?: string) {
    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search, mode: "insensitive" } },
      ];
    }

    try {
      const users = await prisma.user.findMany({
        where,
        include: {
          _count: {
            select: { bookings: true },
          },
          bookings: {
            select: {
              id: true,
              bookingNumber: true,
              checkIn: true,
              checkOut: true,
              totalPrice: true,
              status: true,
            },
            orderBy: { createdAt: "desc" },
            take: 5,
          },
        },
        orderBy: { createdAt: "desc" },
      });

      return users.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        // admin@hotel.com is the system superadmin and is approved by default
        isApproved:
          u.email === "admin@hotel.com"
            ? true
            : u.isApproved !== undefined && u.isApproved !== null
            ? u.isApproved
            : u.role === "ADMIN"
            ? false
            : true,
        createdAt: u.createdAt,
        _count: u._count || { bookings: 0 },
        bookings: u.bookings || [],
      }));
    } catch (err) {
      const users = await prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
      });

      return users.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone,
        role: u.role,
        isApproved:
          u.email === "admin@hotel.com"
            ? true
            : u.isApproved !== undefined && u.isApproved !== null
            ? u.isApproved
            : u.role === "ADMIN"
            ? false
            : true,
        createdAt: u.createdAt,
        _count: { bookings: 0 },
        bookings: [],
      }));
    }
  }

  static async approveUser(userId: string, isApproved: boolean) {
    const existing = await prisma.user.findUnique({ where: { id: userId } });
    if (!existing) {
      throw new NotFoundError("User not found");
    }

    try {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: { isApproved } as any,
      });
      return updated;
    } catch (err) {
      await prisma.$executeRawUnsafe(
        `UPDATE "User" SET "isApproved" = $1 WHERE id = $2`,
        isApproved,
        userId
      );
      return { ...existing, isApproved };
    }
  }

  static async createUserByAdmin(data: {
    name: string;
    email: string;
    password: string;
    role?: "GUEST" | "ADMIN";
    phone?: string;
  }) {
    const existing = await prisma.user.findUnique({
      where: { email: data.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictError("User with this email already exists");
    }

    const passwordHash = await bcrypt.hash(data.password, 10);
    const role = data.role || "ADMIN";

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email.toLowerCase(),
        passwordHash,
        phone: data.phone,
        role: role,
        isApproved: true,
      } as any,
    });

    return user;
  }
}
