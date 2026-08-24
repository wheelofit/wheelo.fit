const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  await prisma.registration.deleteMany();
  await prisma.event.deleteMany();
  console.log('Deleted all registrations and events');
}
main().finally(() => prisma.$disconnect());
