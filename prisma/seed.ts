import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding initial HMS data...");

  // 1. Create Admin User
  const adminPasswordHash = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@hotel.com" },
    update: {},
    create: {
      email: "admin@hotel.com",
      name: "Admin Receptionist",
      passwordHash: adminPasswordHash,
      phone: "+1 555-0199",
      role: "ADMIN",
      isApproved: true,
    },
  });
  console.log("Created Admin:", admin.email);

  // 2. Create Guest User
  const guestPasswordHash = await bcrypt.hash("guest123", 10);
  const guest = await prisma.user.upsert({
    where: { email: "guest@example.com" },
    update: {},
    create: {
      email: "guest@example.com",
      name: "John Doe",
      passwordHash: guestPasswordHash,
      phone: "+1 555-0188",
      role: "GUEST",
    },
  });
  console.log("Created Guest:", guest.email);

  // 3. Create Room Types
  const deluxeType = await prisma.roomType.upsert({
    where: { name: "Deluxe Suite" },
    update: {},
    create: {
      name: "Deluxe Suite",
      description: "Spacious suite featuring king-size bed, balcony view, and luxury bath.",
      basePrice: 150.0,
      capacity: 2,
      amenities: JSON.stringify(["WiFi", "AC", "TV", "King Bed", "Balcony", "Mini Bar"]),
      images: JSON.stringify(["https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1600&q=85"]),
    },
  });

  const standardType = await prisma.roomType.upsert({
    where: { name: "Standard Room" },
    update: {},
    create: {
      name: "Standard Room",
      description: "Cozy room with queen bed, high-speed WiFi, and work desk.",
      basePrice: 90.0,
      capacity: 2,
      amenities: JSON.stringify(["WiFi", "AC", "TV", "Queen Bed"]),
      images: JSON.stringify(["https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1600&q=85"]),
    },
  });

  const familyType = await prisma.roomType.upsert({
    where: { name: "Family Executive Suite" },
    update: {},
    create: {
      name: "Family Executive Suite",
      description: "Large 2-bedroom suite ideal for families, up to 4 guests.",
      basePrice: 240.0,
      capacity: 4,
      amenities: JSON.stringify(["WiFi", "AC", "2 TVs", "2 King Beds", "Kitchenette", "Jacuzzi"]),
      images: JSON.stringify(["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1600&q=85"]),
    },
  });

  // 4. Create Rooms
  const roomsData = [
    { roomNumber: "101", roomTypeId: standardType.id, floor: 1, status: "AVAILABLE" as const },
    { roomNumber: "102", roomTypeId: standardType.id, floor: 1, status: "AVAILABLE" as const },
    { roomNumber: "201", roomTypeId: deluxeType.id, floor: 2, status: "AVAILABLE" as const },
    { roomNumber: "202", roomTypeId: deluxeType.id, floor: 2, status: "AVAILABLE" as const },
    { roomNumber: "301", roomTypeId: familyType.id, floor: 3, status: "AVAILABLE" as const },
  ];

  for (const r of roomsData) {
    await prisma.room.upsert({
      where: { roomNumber: r.roomNumber },
      update: {},
      create: r,
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
