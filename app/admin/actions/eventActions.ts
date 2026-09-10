"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createEvent(formData: FormData) {
  const title = formData.get("title") as string;
  const eventType = formData.get("eventType") as string;
  const dateStr = formData.get("date") as string;
  const startTime = formData.get("startTime") as string;
  const endTime = formData.get("endTime") as string;
  const ageLimit = formData.get("ageLimit") as string;

  if (!title || !eventType || !dateStr || !startTime || !endTime) {
    return { error: "All fields except Age Limit are required" };
  }

  // Format time (e.g. "11:30 PM - 02:00 AM")
  const formatTime = (time: string) => {
    const [h, m] = time.split(":");
    let hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12;
    hour = hour ? hour : 12;
    return `${hour}:${m} ${ampm}`;
  };

  const timeSlot = `${formatTime(startTime)} - ${formatTime(endTime)}`;

  const date = new Date(dateStr);

  try {
    // Inherit the latest price for this event type
    const latestEvent = await prisma.event.findFirst({
      where: { eventType },
      orderBy: { createdAt: "desc" },
    });

    const price = latestEvent?.price || 0;

    await prisma.event.create({
      data: {
        title,
        eventType,
        date,
        timeSlot,
        ageLimit: ageLimit || null,
        price,
        isActive: true,
      },
    });

    revalidatePath("/admin/events");
    // Revalidate public routes to show the new event
    revalidatePath("/rides/midnight-rides");
    revalidatePath("/rides/cycle-classes");
    revalidatePath("/rides/sunday-morning");
    revalidatePath("/rides/rentals");

    return { success: "Event created successfully!" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create event" };
  }
}

export async function toggleEventActive(
  eventId: string,
  currentStatus: boolean,
) {
  try {
    await prisma.event.update({
      where: { id: eventId },
      data: { isActive: !currentStatus },
    });

    revalidatePath("/admin/events");
    revalidatePath("/rides/midnight-rides");
    revalidatePath("/rides/cycle-classes");
    revalidatePath("/rides/sunday-morning");
    revalidatePath("/rides/rentals");

    return {
      success: `Event ${!currentStatus ? "enabled" : "disabled"} successfully!`,
    };
  } catch (error) {
    console.error(error);
    return { error: "Failed to toggle event status" };
  }
}

export async function editEvent(eventId: string, formData: FormData) {
  const title = formData.get("title") as string;
  const eventType = formData.get("eventType") as string;
  const dateStr = formData.get("date") as string;
  const timeSlot = formData.get("timeSlot") as string;
  const ageLimit = formData.get("ageLimit") as string;
  const isActiveStr = formData.get("isActive") as string;

  if (!title || !eventType || !dateStr || !timeSlot) {
    return { error: "Required fields are missing" };
  }

  try {
    await prisma.event.update({
      where: { id: eventId },
      data: {
        title,
        eventType,
        date: new Date(dateStr),
        timeSlot,
        ageLimit: ageLimit || null,
        isActive: isActiveStr === "on" || isActiveStr === "true",
      },
    });

    revalidatePath("/admin/events");
    revalidatePath("/rides/midnight-rides");
    revalidatePath("/rides/cycle-classes");
    revalidatePath("/rides/sunday-morning");
    revalidatePath("/rides/rentals");

    return { success: "Event updated successfully!" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update event" };
  }
}
