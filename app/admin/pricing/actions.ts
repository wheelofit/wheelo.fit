"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updatePricing(formData: FormData) {
  const midnightPriceStr = formData.get("midnightPrice") as string;
  const sundayPriceStr = formData.get("sundayPrice") as string;

  const midnightPrice = parseInt(midnightPriceStr, 10);
  const sundayPrice = parseInt(sundayPriceStr, 10);

  if (isNaN(midnightPrice) || isNaN(sundayPrice)) {
    return { error: "Invalid price values" };
  }

  try {
    // Update all midnight events
    await prisma.event.updateMany({
      where: { eventType: "MIDNIGHT" },
      data: { price: midnightPrice },
    });

    // Update all sunday events
    await prisma.event.updateMany({
      where: { eventType: "SUNDAY" },
      data: { price: sundayPrice },
    });

    // Revalidate paths so website updates instantly
    revalidatePath("/rides/midnight-rides");
    revalidatePath("/rides/sunday-morning");
    revalidatePath("/admin/events");
    revalidatePath("/admin/pricing");

    return { success: "Pricing updated successfully for all events!" };
  } catch (error) {
    console.error("Error updating pricing:", error);
    return { error: "Failed to update pricing" };
  }
}
