import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyPhonePePayment } from "@/lib/phonepe";
import {
  sendEventRegistrationEmail,
  sendRentalConfirmationEmail,
  sendCustomPaymentNotificationEmail,
} from "@/lib/mailer";

export async function GET(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  try {
    const { searchParams } = new URL(req.url);
    const merchantOrderId = searchParams.get("merchantOrderId");

    if (!merchantOrderId) {
      return NextResponse.redirect(
        `${baseUrl}/payment-failed?reason=missing_order_id`,
        303,
      );
    }

    // Server-side verification via PhonePe SDK
    const { success, state } = await verifyPhonePePayment(merchantOrderId);

    const isRental = merchantOrderId.startsWith("RTXN_");
    const isPaymentLink = merchantOrderId.startsWith("PTXN_");

    if (success) {
      if (isRental) {
        const rental = await prisma.rentalBooking.findFirst({
          where: { transactionId: merchantOrderId },
          include: { cycle: true },
        });

        if (!rental) {
          return NextResponse.redirect(
            `${baseUrl}/payment-failed?reason=rental_not_found`,
            303,
          );
        }

        if (rental.paymentStatus !== "SUCCESS") {
          await prisma.rentalBooking.update({
            where: { id: rental.id },
            data: { paymentStatus: "SUCCESS", status: "CONFIRMED" },
          });

          // Send confirmation email
          await sendRentalConfirmationEmail(rental, rental.cycle);
        }

        return NextResponse.redirect(
          `${baseUrl}/rentals/success?txn=${merchantOrderId}`,
          303,
        );
      } else if (isPaymentLink) {
        const link = await prisma.paymentLink.findFirst({
          where: { transactionId: merchantOrderId },
        });

        if (!link) {
          return NextResponse.redirect(
            `${baseUrl}/payment-failed?reason=payment_link_not_found`,
            303,
          );
        }

        if (link.paymentStatus !== "SUCCESS") {
          await prisma.paymentLink.update({
            where: { id: link.id },
            data: { paymentStatus: "SUCCESS" },
          });

          await sendCustomPaymentNotificationEmail({
            name: link.name,
            phone: link.phone,
            amount: link.amount,
            transactionId: link.transactionId,
          });
        }

        return NextResponse.redirect(
          `${baseUrl}/pay/success?txn=${merchantOrderId}`,
          303,
        );
      } else {
        const reg = await prisma.registration.findFirst({
          where: { transactionId: merchantOrderId },
          include: { event: true },
        });

        if (!reg) {
          return NextResponse.redirect(
            `${baseUrl}/payment-failed?reason=registration_not_found`,
            303,
          );
        }

        if (reg.paymentStatus !== "SUCCESS") {
          await prisma.registration.update({
            where: { id: reg.id },
            data: { paymentStatus: "SUCCESS" },
          });

          // Send confirmation email
          await sendEventRegistrationEmail(reg, reg.event);
        }

        return NextResponse.redirect(
          `${baseUrl}/ticket/${reg.ticketCode}`,
          303,
        );
      }
    } else {
      console.error("PhonePe payment not successful. State:", state);
      // Delete the pending registration or rental so it doesn't stay in the DB
      if (isRental) {
        await prisma.rentalBooking.deleteMany({
          where: { transactionId: merchantOrderId },
        });
      } else if (isPaymentLink) {
        await prisma.paymentLink.deleteMany({
          where: { transactionId: merchantOrderId },
        });
      } else {
        await prisma.registration.deleteMany({
          where: { transactionId: merchantOrderId },
        });
      }
      return NextResponse.redirect(
        `${baseUrl}/payment-failed?reason=${state}`,
        303,
      );
    }
  } catch (error: unknown) {
    console.error("Payment callback error:", error);
    return NextResponse.redirect(
      `${baseUrl}/payment-failed?reason=server_error`,
      303,
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    console.log("PhonePe S2S Webhook received:", JSON.stringify(body));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
