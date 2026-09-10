import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { initiatePhonePePayment } from "@/lib/phonepe";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const type = formData.get("type") as string;

    // Automatic Trash Cleanup: Delete PENDING transactions older than 1 hour
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      await Promise.all([
        prisma.registration.deleteMany({
          where: { paymentStatus: "PENDING", createdAt: { lt: oneHourAgo } },
        }),
        prisma.rentalBooking.deleteMany({
          where: { paymentStatus: "PENDING", createdAt: { lt: oneHourAgo } },
        }),
        prisma.paymentLink.deleteMany({
          where: { paymentStatus: "PENDING", createdAt: { lt: oneHourAgo } },
        }),
      ]);
    } catch (cleanupError) {
      console.error("Cleanup failed:", cleanupError);
      // Ignore errors so it doesn't block the actual payment
    }

    let amountInPaise = 0;
    let merchantOrderId = `TXN_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;
    const ticketCode = `TKT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    if (type === "event") {
      const eventId = formData.get("eventId") as string;
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;
      const ticketCount =
        parseInt(formData.get("ticketCount") as string, 10) || 1;

      if (!eventId || !name || !email || !phone) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 },
        );
      }

      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event)
        return NextResponse.json({ error: "Event not found" }, { status: 404 });

      const globalEvent = await prisma.event.findFirst({
        where: { eventType: event.eventType, price: { gt: 0 } },
        orderBy: { updatedAt: "desc" },
      });
      const price =
        globalEvent?.price || (event.eventType === "MIDNIGHT" ? 749 : 649);
      const amount = price * ticketCount;
      amountInPaise = amount * 100;

      const additionalNames: string[] = [];
      for (let i = 0; i < ticketCount - 1; i++) {
        const addName = formData.get(`additionalName_${i}`) as string;
        if (addName) additionalNames.push(addName);
      }

      await prisma.registration.create({
        data: {
          eventId,
          name,
          email,
          phone,
          ticketCount,
          additionalNames,
          paymentStatus: "PENDING",
          transactionId: merchantOrderId,
          amount,
          ticketCode,
        },
      });
    } else if (type === "rental") {
      const cycleId = formData.get("cycleId") as string;
      const startDateStr = formData.get("startDate") as string;
      const durationValue = parseInt(
        formData.get("durationValue") as string,
        10,
      );
      const durationUnit = formData.get("durationUnit") as string;
      const quantity = parseInt(formData.get("quantity") as string, 10);
      const name = formData.get("name") as string;
      const email = formData.get("email") as string;
      const phone = formData.get("phone") as string;
      const price = parseInt(formData.get("price") as string, 10);

      if (
        !cycleId ||
        !startDateStr ||
        isNaN(durationValue) ||
        !durationUnit ||
        isNaN(quantity) ||
        !name ||
        !email ||
        !phone ||
        isNaN(price)
      ) {
        return NextResponse.json(
          { error: "Missing required fields for rental" },
          { status: 400 },
        );
      }

      const rentalFee = price * durationValue * quantity;
      const depositAmount = 1000 * quantity;
      const totalAmount = rentalFee + depositAmount;

      amountInPaise = totalAmount * 100;
      merchantOrderId = `RTXN_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      const startDate = new Date(startDateStr);
      const endDate = new Date(startDate);

      if (durationUnit === "DAYS") {
        endDate.setDate(endDate.getDate() + durationValue - 1);
      } else if (durationUnit === "MONTHS") {
        endDate.setDate(endDate.getDate() + durationValue * 30 - 1);
      }

      await prisma.rentalBooking.create({
        data: {
          cycleId,
          startDate,
          endDate,
          quantity,
          name,
          email,
          phone,
          status: "PENDING",
          paymentStatus: "PENDING",
          transactionId: merchantOrderId,
          totalAmount,
        },
      });
    } else if (type === "open_payment") {
      const name = formData.get("name") as string;
      const email = (formData.get("email") as string) || "noemail@example.com";
      const phone = formData.get("phone") as string;
      const amountStr = formData.get("amount") as string;
      const amount = parseInt(amountStr, 10);

      if (!name || !phone || !amount || isNaN(amount) || amount <= 0) {
        return NextResponse.json(
          { error: "Missing required fields or invalid amount" },
          { status: 400 },
        );
      }

      amountInPaise = amount * 100;
      merchantOrderId = `PTXN_${Date.now()}_${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      await prisma.paymentLink.create({
        data: {
          amount,
          purpose: "Custom Payment",
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Dummy expiry, not used
          paymentStatus: "PENDING",
          transactionId: merchantOrderId,
          name,
          email,
          phone,
        },
      });
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    if (amountInPaise === 0) {
      if (type === "event") {
        await prisma.registration.updateMany({
          where: { transactionId: merchantOrderId },
          data: { paymentStatus: "SUCCESS" },
        });
        return NextResponse.json({
          success: true,
          redirectUrl: `${baseUrl}/ticket/${ticketCode}`,
        });
      } else if (type === "rental") {
        await prisma.rentalBooking.updateMany({
          where: { transactionId: merchantOrderId },
          data: { paymentStatus: "SUCCESS", status: "CONFIRMED" },
        });
        return NextResponse.json({
          success: true,
          redirectUrl: `${baseUrl}/rentals/success?txn=${merchantOrderId}`,
        });
      } else if (type === "open_payment") {
        await prisma.paymentLink.updateMany({
          where: { transactionId: merchantOrderId },
          data: { paymentStatus: "SUCCESS" },
        });
        return NextResponse.json({
          success: true,
          redirectUrl: `${baseUrl}/pay/success?txn=${merchantOrderId}`,
        });
      }
    }

    // Initiate PhonePe payment (PhonePe V2 SDK)
    const callbackUrl = `${baseUrl}/api/payment/callback?merchantOrderId=${merchantOrderId}`;
    const { redirectUrl } = await initiatePhonePePayment(
      merchantOrderId,
      amountInPaise,
      callbackUrl,
    );

    return NextResponse.json({ success: true, redirectUrl });
  } catch (error: unknown) {
    console.error("Error initiating payment:", error);
    return NextResponse.json(
      {
        error: "Failed to initiate payment",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
