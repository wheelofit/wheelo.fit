"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function refundPaymentLink(id: string) {
  try {
    const link = await prisma.paymentLink.findUnique({ where: { id } });
    if (!link || !link.transactionId || link.paymentStatus !== "SUCCESS") {
      return { error: "Invalid or unpaid payment link" };
    }

    const { refundPhonePePayment } = await import("@/lib/phonepe");
    const amountInPaise = link.amount * 100;

    const result = await refundPhonePePayment(
      link.transactionId,
      amountInPaise,
    );

    if (result.success) {
      await prisma.paymentLink.update({
        where: { id },
        data: { paymentStatus: "REFUNDED" },
      });
      revalidatePath("/admin/payment-links");
      return { success: true };
    } else {
      return { error: result.error || "Refund failed" };
    }
  } catch (error: unknown) {
    console.error("Error refunding payment link:", error);
    return { error: "Failed to process refund" };
  }
}
