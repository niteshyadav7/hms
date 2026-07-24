const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  await prisma.$executeRawUnsafe(`UPDATE "User" SET "isApproved" = true WHERE email = 'admin@hotel.com'`);
  console.log("Updated admin@hotel.com to isApproved = true");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
