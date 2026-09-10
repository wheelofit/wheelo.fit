import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Generating next 32 events...");

  const today = new Date();

  // Find the next Saturday
  const nextSaturday = new Date(today);
  nextSaturday.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7 || 7));
  nextSaturday.setHours(23, 0, 0, 0);

  // Find the next Sunday
  const nextSunday = new Date(today);
  nextSunday.setDate(today.getDate() + ((0 - today.getDay() + 7) % 7 || 7));
  nextSunday.setHours(6, 0, 0, 0);

  const events = [];

  for (let i = 0; i < 16; i++) {
    // Midnight ride (Saturday night)
    const midnightDate = new Date(nextSaturday);
    midnightDate.setDate(nextSaturday.getDate() + i * 7);
    events.push({
      title: "Mumbai Midnight Cycling",
      eventType: "MIDNIGHT",
      date: midnightDate,
      timeSlot: "11:00 PM - 3:30 AM",
      isActive: true,
    });

    // Sunday morning ride (Sunday morning)
    const sundayDate = new Date(nextSunday);
    sundayDate.setDate(nextSunday.getDate() + i * 7);
    events.push({
      title: "Sunday Morning Coastal Ride",
      eventType: "SUNDAY",
      date: sundayDate,
      timeSlot: "06:00 AM - 08:30 AM",
      isActive: true,
    });
  }

  // Insert into DB if it doesn't already exist
  let createdCount = 0;
  for (const event of events) {
    const existingEvent = await prisma.event.findFirst({
      where: {
        eventType: event.eventType,
        date: event.date,
      },
    });

    if (!existingEvent) {
      await prisma.event.create({
        data: event,
      });
      createdCount++;
    }
  }

  console.log(`Successfully generated ${createdCount} events.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
