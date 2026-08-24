import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const events = await prisma.event.findMany({
    include: {
      _count: {
        select: { registrations: true }
      }
    }
  });

  for (const event of events) {
    if (event._count.registrations === 0) {
      await prisma.event.delete({
        where: { id: event.id }
      });
      console.log('Deleted event:', event.title, event.date);
    }
  }
}
main().finally(() => prisma.$disconnect());
