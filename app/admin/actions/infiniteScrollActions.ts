"use server";

import prisma from "@/lib/prisma";

export async function getPaginatedUpcomingEvents(
  skip: number,
  take: number = 10,
) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const events = await prisma.event.findMany({
    where: {
      date: { gte: startOfToday },
    },
    orderBy: { date: "asc" },
    skip,
    take,
  });

  return events;
}

export async function getPaginatedPastEvents(skip: number, take: number = 10) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const events = await prisma.event.findMany({
    where: {
      date: { lt: startOfToday },
    },
    orderBy: { date: "desc" },
    skip,
    take,
  });

  return events;
}

export async function getPaginatedAttendanceEvents(
  skip: number,
  take: number = 10,
) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const events = await (prisma as any).event.findMany({
    where: {
      date: { gte: startOfToday },
    },
    include: {
      registrations: true,
    },
    orderBy: { date: "asc" },
    skip,
    take,
  });

  // Calculate counts server-side before sending to client
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const processedEvents = events.map((event: any) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const presentCount = event.registrations.reduce(
      (acc: number, r: any) => (r.isPresent ? acc + (r.ticketCount || 1) : acc),
      0,
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const totalCount = event.registrations.reduce(
      (acc: number, r: any) => acc + (r.ticketCount || 1),
      0,
    );

    // We don't need to send the full registrations array to the client for this view,
    // just the calculated counts to keep the payload small.
    return {
      id: event.id,
      title: event.title,
      date: event.date,
      timeSlot: event.timeSlot,
      eventType: event.eventType,
      presentCount,
      totalCount,
    };
  });

  return processedEvents;
}

export async function getPaginatedInquiries(
  skip: number,
  take: number = 10,
  filter: string = "all",
) {
  let whereClause = {};
  if (filter === "pending") {
    whereClause = { contacted: false };
  } else if (filter === "contacted") {
    whereClause = { contacted: true };
  }

  const inquiries = await prisma.cycleClassInquiry.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });

  return inquiries;
}

export async function getPaginatedCycles(skip: number, take: number = 10) {
  const cycles = await prisma.rentalCycle.findMany({
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });
  return cycles;
}

export async function getPaginatedBookings(skip: number, take: number = 10) {
  const bookings = await prisma.rentalBooking.findMany({
    where: { status: "CONFIRMED" },
    orderBy: { createdAt: "desc" },
    include: {
      cycle: true,
    },
    skip,
    take,
  });
  return bookings;
}

export async function getPaginatedFAQs(skip: number, take: number = 10) {
  const faqs = await prisma.fAQ.findMany({
    orderBy: { order: "asc" },
    skip,
    take,
  });
  return faqs;
}

export async function getPaginatedPayments(skip: number, take: number = 10) {
  const payments = await prisma.paymentLink.findMany({
    where: {
      paymentStatus: { in: ["SUCCESS", "REFUNDED"] },
    },
    orderBy: { createdAt: "desc" },
    skip,
    take,
  });
  return payments;
}
