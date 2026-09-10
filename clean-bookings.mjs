import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const bookings = await prisma.rentalBooking.findMany();
  const cycles = await prisma.rentalCycle.findMany();
  const cycleIds = new Set(cycles.map((c) => c.id));

  let count = 0;
  for (const b of bookings) {
    if (!cycleIds.has(b.cycleId)) {
      await prisma.rentalBooking.delete({ where: { id: b.id } });
      count++;
    }
  }
  console.log("Deleted orphaned bookings: " + count);
}

main().then(() => prisma.$disconnect());
