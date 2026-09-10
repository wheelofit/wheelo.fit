"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { FAQItem } from "./FAQClientView";

export async function getFAQs(): Promise<FAQItem[]> {
  const prismaFAQ = prisma as unknown as {
    fAQ: { findMany: (args: unknown) => Promise<FAQItem[]> };
  };
  try {
    return await prismaFAQ.fAQ.findMany({
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Error fetching FAQs:", error);
    return [];
  }
}

export async function createFAQ(formData: FormData) {
  const question = formData.get("question") as string;
  const answer = formData.get("answer") as string;
  const order = parseInt(formData.get("order") as string, 10) || 0;

  if (!question || !answer)
    return { error: "Question and answer are required" };

  try {
    const prismaFAQ = prisma as unknown as {
      fAQ: { create: (args: unknown) => Promise<unknown> };
    };
    await prismaFAQ.fAQ.create({
      data: {
        question,
        answer,
        order,
        isActive: true,
      },
    });
    revalidatePath("/admin/faqs");
    revalidatePath("/");
    return { success: "FAQ created successfully" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to create FAQ" };
  }
}

export async function updateFAQ(id: string, formData: FormData) {
  const question = formData.get("question") as string;
  const answer = formData.get("answer") as string;
  const isActive =
    formData.get("isActive") === "on" || formData.get("isActive") === "true";

  try {
    const prismaFAQ = prisma as unknown as {
      fAQ: { update: (args: unknown) => Promise<unknown> };
    };
    await prismaFAQ.fAQ.update({
      where: { id },
      data: {
        question,
        answer,
        isActive,
      },
    });
    revalidatePath("/admin/faqs");
    revalidatePath("/");
    return { success: "FAQ updated successfully" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update FAQ" };
  }
}

export async function deleteFAQ(id: string) {
  try {
    const prismaFAQ = prisma as unknown as {
      fAQ: { delete: (args: unknown) => Promise<unknown> };
    };
    await prismaFAQ.fAQ.delete({
      where: { id },
    });
    revalidatePath("/admin/faqs");
    revalidatePath("/");
    return { success: "FAQ deleted successfully" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to delete FAQ" };
  }
}

export async function updateFAQOrder(orderedIds: string[]) {
  try {
    const prismaFAQ = prisma as unknown as {
      fAQ: { update: (args: unknown) => Promise<unknown> };
    };
    for (let i = 0; i < orderedIds.length; i++) {
      await prismaFAQ.fAQ.update({
        where: { id: orderedIds[i] },
        data: { order: i },
      });
    }
    revalidatePath("/admin/faqs");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to update order" };
  }
}
