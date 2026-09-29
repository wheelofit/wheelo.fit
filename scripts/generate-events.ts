import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Generating next 32 events...");

  const today = new Date();

  const events: any[] = [];
  for (let i = 0; i < 16; i++) {
    // Find the next Friday
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + ((5 - today.getDay() + 7) % 7 || 7));
    nextFriday.setHours(22, 45, 0, 0);

    // Find the next Saturday
    const nextSaturday = new Date(today);
    nextSaturday.setDate(today.getDate() + ((6 - today.getDay() + 7) % 7 || 7));
    nextSaturday.setHours(22, 45, 0, 0);

    // Find the next Sunday
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + ((0 - today.getDay() + 7) % 7 || 7));
    nextSunday.setHours(6, 45, 0, 0);

    // Midnight ride (Friday night)
    const midnightFriday = new Date(nextFriday);
    midnightFriday.setDate(nextFriday.getDate() + i * 7);
    events.push({
      title: "Mumbai Midnight Cycling",
      eventType: "MIDNIGHT",
      date: midnightFriday,
      timeSlot: "10:45 PM - 03:30 AM",
      isActive: true,
    });

    // Midnight ride (Saturday night)
    const midnightSaturday = new Date(nextSaturday);
    midnightSaturday.setDate(nextSaturday.getDate() + i * 7);
    events.push({
      title: "Mumbai Midnight Cycling",
      eventType: "MIDNIGHT",
      date: midnightSaturday,
      timeSlot: "10:45 PM - 03:30 AM",
      isActive: true,
    });

    // Sunday morning ride (Sunday morning)
    const sundayDate = new Date(nextSunday);
    sundayDate.setDate(nextSunday.getDate() + i * 7);
    events.push({
      title: "Sunday Morning Coastal Ride",
      eventType: "SUNDAY",
      date: sundayDate,
      timeSlot: "06:45 AM - 09:00 AM",
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
