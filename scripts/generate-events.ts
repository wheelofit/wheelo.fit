import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Generating next 16 weeks of events...");

  // We want to safely calculate dates in IST (+5:30)
  const now = new Date();
  const utcTime = now.getTime() + now.getTimezoneOffset() * 60000;
  const istTime = new Date(utcTime + 330 * 60000); // +5:30 for IST

  // Start generation from this week's Monday in IST
  const dayOfWeek = istTime.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  const currentWeekMonday = new Date(istTime);
  currentWeekMonday.setDate(istTime.getDate() + diffToMonday);
  currentWeekMonday.setHours(0, 0, 0, 0); // Midnight IST

  const events: any[] = [];

  for (let i = 0; i < 16; i++) {
    // Current week's Monday + offset for Friday, Saturday, Sunday

    // Friday: +4 days
    const fridayIST = new Date(currentWeekMonday);
    fridayIST.setDate(currentWeekMonday.getDate() + 4 + i * 7);
    // Saturday: +5 days
    const saturdayIST = new Date(currentWeekMonday);
    saturdayIST.setDate(currentWeekMonday.getDate() + 5 + i * 7);
    // Sunday: +6 days
    const sundayIST = new Date(currentWeekMonday);
    sundayIST.setDate(currentWeekMonday.getDate() + 6 + i * 7);

    // Set exact times in IST
    // Midnight rides: 22:45 (10:45 PM)
    fridayIST.setHours(22, 45, 0, 0);
    saturdayIST.setHours(22, 45, 0, 0);

    // Sunday morning ride: 06:45 AM
    sundayIST.setHours(6, 45, 0, 0);

    // Convert back to UTC for database storage
    const fridayUTC = new Date(fridayIST.getTime() - 330 * 60000);
    const saturdayUTC = new Date(saturdayIST.getTime() - 330 * 60000);
    const sundayUTC = new Date(sundayIST.getTime() - 330 * 60000);

    // Midnight ride (Friday night)
    events.push({
      title: "Mumbai Midnight Cycling",
      eventType: "MIDNIGHT",
      date: fridayUTC,
      timeSlot: "10:45 PM - 03:30 AM",
      isActive: true,
    });

    // Midnight ride (Saturday night)
    events.push({
      title: "Mumbai Midnight Cycling",
      eventType: "MIDNIGHT",
      date: saturdayUTC,
      timeSlot: "10:45 PM - 03:30 AM",
      isActive: true,
    });

    // Sunday morning ride
    events.push({
      title: "Sunday Morning Coastal Ride",
      eventType: "SUNDAY",
      date: sundayUTC,
      timeSlot: "06:45 AM - 09:00 AM",
      isActive: true,
    });
  }

  // Insert into DB
  let createdCount = 0;
  for (const event of events) {
    // Only create events that are in the future
    const nowUTC = new Date();
    if (event.date > nowUTC) {
      // Check if event already exists
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
