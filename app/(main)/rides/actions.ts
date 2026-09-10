"use server";

import prisma from "@/lib/prisma";

export async function registerForEvent(formData: FormData) {
  const eventId = formData.get("eventId") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const ticketCountStr = formData.get("ticketCount") as string;
  const ticketCount = parseInt(ticketCountStr, 10) || 1;

  const additionalNames: string[] = [];
  for (let i = 0; i < ticketCount - 1; i++) {
    const addName = formData.get(`additionalName_${i}`) as string;
    if (addName) {
      additionalNames.push(addName);
    }
  }

  if (!eventId || !name || !email || !phone) {
    return { error: "All fields are required." };
  }

  try {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    if (!event || !event.isActive) {
      return { error: "Event is no longer available." };
    }

    const randomString = Math.random()
      .toString(36)
      .substring(2, 8)
      .toUpperCase();
    const ticketCode = `TKT-${randomString}`;

    await (
      prisma as unknown as {
        registration: { create: (args: unknown) => Promise<unknown> };
      }
    ).registration.create({
      data: {
        eventId,
        name,
        email,
        phone,
        ticketCount,
        additionalNames,
        ticketCode,
      },
    });

    return {
      success: "Registration successful! We will see you there.",
      ticketCode,
    };
  } catch (error) {
    console.error(error);
    return { error: "Failed to submit registration. Please try again." };
  }
}
