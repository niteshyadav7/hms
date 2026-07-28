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

  // 5. Seed Guest Testimonials & Reviews
  const reviewsSeed = [
    {
      guestName: "Sophia Montgomery",
      guestEmail: "sophia.m@luxurytravel.com",
      rating: 5,
      comment: "An absolute slice of paradise! The Overwater Sanctuary Villa exceeded every expectation. Lumina AI butler made room service ordering seamless.",
      createdAt: new Date("2024-11-15T10:00:00Z"),
    },
    {
      guestName: "Alexander Vance",
      guestEmail: "alexander.vance@venture.com",
      rating: 5,
      comment: "Michelin dining at Aether was world-class. Spa treatments at Celestial Pavilion were deeply rejuvenating. Will return next season!",
      createdAt: new Date("2024-11-18T14:30:00Z"),
    },
    {
      guestName: "Elena Rostova",
      guestEmail: "elena.r@designstudio.io",
      rating: 5,
      comment: "Bespoke VIP hospitality, pristine lagoon waters, and instant NFC digital key suite access. 10/10 experience!",
      createdAt: new Date("2024-11-20T18:15:00Z"),
    },
    {
      guestName: "Julian Sterling",
      guestEmail: "j.sterling@lumina-voyage.com",
      rating: 5,
      comment: "The private infinity pool villa offers breathtaking sunset views. The 24/7 AI Concierge answered every query instantly.",
      createdAt: new Date("2024-11-22T09:45:00Z"),
    },
    {
      guestName: "Victoria Chen",
      guestEmail: "victoria.chen@heritage.org",
      rating: 5,
      comment: "Celestial hydrotherapy spa treatment was transformative. Gourmet floating breakfast served directly in our pool was unforgettable.",
      createdAt: new Date("2024-11-25T11:20:00Z"),
    },
    {
      guestName: "Marcus Aurelius Thorne",
      guestEmail: "m.thorne@globalcap.com",
      rating: 5,
      comment: "World-class luxury hospitality redefined. From private yacht transfers to personalized wine tasting, everything was perfection.",
      createdAt: new Date("2024-11-28T16:00:00Z"),
    },
  ];

  if ((prisma as any).review) {
    for (const rev of reviewsSeed) {
      try {
        await (prisma as any).review.create({
          data: rev,
        });
      } catch (err) {
        // Skip duplicate seeding if already present
      }
    }
    console.log("Seeded verified guest reviews!");
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
