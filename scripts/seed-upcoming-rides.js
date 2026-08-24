import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding upcoming rides...');

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const eventsToCreate = [];

  // Generate for the next 8 weeks to roughly cover "30 rides" total
  // 8 weeks * 2 midnight (Fri/Sat) = 16 Midnight rides
  // 8 weeks * 1 morning (Sun) = 8 Sunday Morning rides
  // Let's generate 15 weeks just to be sure we have ~30 midnight rides.
  const WEEKS_TO_GENERATE = 15;

  for (let i = 0; i < WEEKS_TO_GENERATE; i++) {
    const currentWeekStart = new Date(today);
    currentWeekStart.setDate(today.getDate() + (i * 7));

    // Find next Friday
    const friday = new Date(currentWeekStart);
    friday.setDate(friday.getDate() + ((5 - friday.getDay() + 7) % 7));
    
    // Find next Saturday
    const saturday = new Date(friday);
    saturday.setDate(friday.getDate() + 1);

    // Find next Sunday
    const sunday = new Date(saturday);
    sunday.setDate(saturday.getDate() + 1);

    // Add Friday Midnight Ride
    eventsToCreate.push({
      title: 'Midnight Cycling - Friday',
      eventType: 'MIDNIGHT',
      date: friday,
      timeSlot: '10:15 PM',
      isActive: true,
    });

    // Add Saturday Midnight Ride
    eventsToCreate.push({
      title: 'Midnight Cycling - Saturday',
      eventType: 'MIDNIGHT',
      date: saturday,
      timeSlot: '10:15 PM',
      isActive: true,
    });

    // Add Sunday Morning Ride
    eventsToCreate.push({
      title: 'Sunday Sunrise Ride',
      eventType: 'SUNDAY',
      date: sunday,
      timeSlot: '06:15 AM',
      isActive: true,
    });
  }

  let createdCount = 0;
  for (const event of eventsToCreate) {
    // Only add if it doesn't already exist for that exact date and type
    const existing = await prisma.event.findFirst({
      where: {
        eventType: event.eventType,
        date: {
          gte: new Date(event.date.setHours(0, 0, 0, 0)),
          lt: new Date(event.date.setHours(23, 59, 59, 999))
        }
      }
    });

    if (!existing) {
      await prisma.event.create({
        data: event
      });
      createdCount++;
    }
  }

  console.log(`Successfully created ${createdCount} new upcoming rides.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
