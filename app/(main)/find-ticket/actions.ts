"use server";

import prisma from "@/lib/prisma";

export async function findTickets(formData: FormData) {
  const query = formData.get("query") as string;

  if (!query) {
    return { error: "Please provide an email or phone number." };
  }

  try {
    const registrations = await prisma.registration.findMany({
      where: {
        OR: [{ email: query }, { phone: query }],
        ticketCode: { not: null },
      },
      include: {
        event: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (registrations.length === 0) {
      return {
        error: "No tickets found for the provided email or phone number.",
      };
    }

    const tickets = registrations.map((reg) => ({
      id: reg.id,
      ticketCode: reg.ticketCode,
      eventName: reg.event.title,
      eventDate: reg.event.date.toISOString(),
      eventTime: reg.event.timeSlot,
    }));

    return { tickets };
  } catch (error) {
    console.error(error);
    return { error: "Something went wrong while searching for tickets." };
  }
}
