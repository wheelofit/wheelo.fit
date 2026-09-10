import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { refundPhonePePayment } from "@/lib/phonepe";

export async function POST(req: NextRequest) {
  try {
    const { transactionId, type } = await req.json();

    if (!transactionId || !type) {
      return NextResponse.json(
        { error: "Missing transactionId or type" },
        { status: 400 },
      );
    }

    let record;
    let amountInPaise = 0;

    if (type === "event") {
      record = await prisma.registration.findFirst({
        where: { transactionId },
      });
      if (!record)
        return NextResponse.json(
          { error: "Registration not found" },
          { status: 404 },
        );
      if (record.paymentStatus !== "SUCCESS")
        return NextResponse.json(
          { error: "Cannot refund a non-successful payment" },
          { status: 400 },
        );
      amountInPaise = record.amount * 100;
    } else if (type === "rental") {
      record = await prisma.rentalBooking.findFirst({
        where: { transactionId },
      });
      if (!record)
        return NextResponse.json(
          { error: "Rental not found" },
          { status: 404 },
        );
      if (record.paymentStatus !== "SUCCESS")
        return NextResponse.json(
          { error: "Cannot refund a non-successful payment" },
          { status: 400 },
        );
      amountInPaise = record.totalAmount * 100;
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    // Attempt PhonePe Refund
    const refundResult = await refundPhonePePayment(
      transactionId,
      amountInPaise,
    );

    if (refundResult.success) {
      // Update DB to reflect refund
      if (type === "event") {
        await prisma.registration.update({
          where: { id: record.id },
          data: { paymentStatus: "REFUNDED", isPresent: false },
        });
      } else if (type === "rental") {
        await prisma.rentalBooking.update({
          where: { id: record.id },
          data: { paymentStatus: "REFUNDED", status: "CANCELLED" },
        });
      }
      return NextResponse.json({
        success: true,
        message: "Refund initiated successfully",
      });
    } else {
      return NextResponse.json(
        {
          error: refundResult.error || "Failed to initiate refund with PhonePe",
        },
        { status: 500 },
      );
    }
  } catch (error: unknown) {
    console.error("Refund API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
