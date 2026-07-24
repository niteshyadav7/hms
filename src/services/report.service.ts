import { prisma } from "../lib/db";

export class ReportService {
  static async getDashboardKPIs() {
    const totalRooms = await prisma.room.count();
    const occupiedRooms = await prisma.room.count({ where: { status: "OCCUPIED" } });
    const maintenanceRooms = await prisma.room.count({ where: { status: "MAINTENANCE" } });
    const availableRooms = totalRooms - occupiedRooms - maintenanceRooms;

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const todayBookingsCount = await prisma.booking.count({
      where: {
        createdAt: {
          gte: startOfToday,
          lte: endOfToday,
        },
      },
    });

    const todayCheckIns = await prisma.booking.count({
      where: {
        checkIn: {
          gte: startOfToday,
          lte: endOfToday,
        },
        status: { in: ["CONFIRMED", "CHECKED_IN"] },
      },
    });

    const totalRevenueResult = await prisma.payment.aggregate({
      where: { status: "PAID" },
      _sum: { amount: true },
    });

    const totalRevenue = totalRevenueResult._sum.amount || 0;
    const occupancyRate = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

    return {
      totalRooms,
      availableRooms,
      occupiedRooms,
      maintenanceRooms,
      todayBookingsCount,
      todayCheckIns,
      totalRevenue,
      occupancyRate,
    };
  }
}
