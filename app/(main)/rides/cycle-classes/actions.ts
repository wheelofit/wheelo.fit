"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitCycleClassInquiry(formData: FormData) {
  const name = formData.get("name") as string;
  const phone = formData.get("phone") as string;
  const area = formData.get("area") as string;
  const height = formData.get("height") as string;

  if (!name || !phone) {
    return { error: "Name and WhatsApp no are required fields." };
  }

  // Constructing a message field to hold area and height
  const message = `Area: ${area || "N/A"}\nHeight: ${height || "N/A"}`;
  const email = `${phone.replace(/\D/g, "")}@whatsapp.dummy`; // dummy email since it's required in schema

  try {
    // We are casting it because prisma client might not have type definitions loaded immediately due to locked file during generate.
    await (
      prisma as unknown as {
        cycleClassInquiry: { create: (args: unknown) => Promise<unknown> };
      }
    ).cycleClassInquiry.create({
      data: {
        name,
        email,
        phone,
        message,
      },
    });

    revalidatePath("/admin/cycle-classes");
    return {
      success: "Your inquiry has been submitted! We will contact you soon.",
    };
  } catch (error) {
    console.error("Failed to submit inquiry:", error);
    return { error: "Failed to submit your inquiry. Please try again later." };
  }
}
