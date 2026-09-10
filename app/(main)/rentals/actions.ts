"use server";

import prisma from "@/lib/prisma";

export async function getCycleAvailabilityMap(
  cycleId: string,
  month: number,
  year: number,
) {
  try {
    type RentalCycle = { id: string; isActive: boolean; quantity: number };
    type RentalBooking = { startDate: Date; endDate: Date; quantity: number };
    const prismaRental = prisma as unknown as {
      rentalCycle: {
        findUnique: (args: unknown) => Promise<RentalCycle | null>;
      };
      rentalBooking: { findMany: (args: unknown) => Promise<RentalBooking[]> };
    };

    const cycle = await prismaRental.rentalCycle.findUnique({
      where: { id: cycleId },
    });
    if (!cycle || !cycle.isActive) return null;

    const startDate = new Date(year, month, 1);
    // Fetch until the end of the next month to support bookings spanning months
    const endDate = new Date(year, month + 2, 0, 23, 59, 59);

    const bookings = await prismaRental.rentalBooking.findMany({
      where: {
        cycleId,
        status: "CONFIRMED",
        AND: [{ startDate: { lte: endDate } }, { endDate: { gte: startDate } }],
      },
    });

    const availabilityMap: Record<string, number> = {};

    // Calculate for current and next month
    for (let m = 0; m < 2; m++) {
      const targetMonth = month + m;
      const targetYear = targetMonth > 11 ? year + 1 : year;
      const normalizedMonth = targetMonth > 11 ? targetMonth - 12 : targetMonth;

      const totalDays = new Date(targetYear, normalizedMonth + 1, 0).getDate();

      for (let day = 1; day <= totalDays; day++) {
        const currentDate = new Date(targetYear, normalizedMonth, day);
        // Adjust for local timezone offset when generating string
        const dateStr = new Date(
          currentDate.getTime() - currentDate.getTimezoneOffset() * 60000,
        )
          .toISOString()
          .split("T")[0];

        const overlappingBookings = bookings.filter((b: RentalBooking) => {
          const bStart = new Date(b.startDate);
          const bEnd = new Date(b.endDate);
          bStart.setHours(0, 0, 0, 0);
          bEnd.setHours(0, 0, 0, 0);
          const cDate = new Date(currentDate);
          cDate.setHours(0, 0, 0, 0);
          return cDate >= bStart && cDate <= bEnd;
        });

        const bookedQty = overlappingBookings.reduce(
          (sum: number, b: RentalBooking) => sum + b.quantity,
          0,
        );
        availabilityMap[dateStr] = Math.max(0, cycle.quantity - bookedQty);
      }
    }

    return availabilityMap;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function checkAvailability(
  cycleId: string,
  startDateStr: string,
  durationValue: number,
  durationUnit: string,
  requestedQuantity: number,
) {
  try {
    type RentalCycle = { id: string; isActive: boolean; quantity: number };
    type RentalBooking = { startDate: Date; endDate: Date; quantity: number };
    const prismaRental = prisma as unknown as {
      rentalCycle: {
        findUnique: (args: unknown) => Promise<RentalCycle | null>;
      };
      rentalBooking: { findMany: (args: unknown) => Promise<RentalBooking[]> };
    };

    const cycle = await prismaRental.rentalCycle.findUnique({
      where: { id: cycleId },
    });
    if (!cycle || !cycle.isActive)
      return { available: false, reason: "Cycle not available." };

    if (requestedQuantity > cycle.quantity)
      return { available: false, reason: "Not enough total stock." };

    const startDate = new Date(startDateStr);
    const endDate = new Date(startDate);

    if (durationUnit === "DAYS") {
      endDate.setDate(endDate.getDate() + durationValue - 1);
    } else if (durationUnit === "MONTHS") {
      // Approximate 30 days per month
      endDate.setDate(endDate.getDate() + durationValue * 30 - 1);
    } else {
      // For HOURS or other, keep same day
    }

    // Find overlapping bookings
    const overlappingBookings = await prismaRental.rentalBooking.findMany({
      where: {
        cycleId,
        status: "CONFIRMED",
        AND: [{ startDate: { lte: endDate } }, { endDate: { gte: startDate } }],
      },
    });

    const bookedQuantity = overlappingBookings.reduce(
      (sum: number, b: RentalBooking) => sum + b.quantity,
      0,
    );
    const availableQty = cycle.quantity - bookedQuantity;

    if (availableQty >= requestedQuantity) {
      return { available: true, availableQty };
    } else {
      return {
        available: false,
        reason: `Only ${availableQty} available for these dates.`,
      };
    }
  } catch (error) {
    console.error(error);
    return { available: false, reason: "Error checking availability." };
  }
}

export async function bookRental(formData: FormData) {
  const cycleId = formData.get("cycleId") as string;
  const startDateStr = formData.get("startDate") as string;
  const durationValue = parseInt(formData.get("durationValue") as string, 10);
  const durationUnit = formData.get("durationUnit") as string;
  const quantity = parseInt(formData.get("quantity") as string, 10);

  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;

  if (
    !cycleId ||
    !startDateStr ||
    isNaN(durationValue) ||
    !durationUnit ||
    isNaN(quantity) ||
    !name ||
    !email ||
    !phone
  ) {
    return { error: "Missing required fields." };
  }

  // Check availability again before booking
  const avail = await checkAvailability(
    cycleId,
    startDateStr,
    durationValue,
    durationUnit,
    quantity,
  );

  if (!avail.available) {
    return { error: avail.reason || "Cycle is no longer available." };
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(startDate);

  if (durationUnit === "DAYS") {
    endDate.setDate(endDate.getDate() + durationValue - 1);
  } else if (durationUnit === "MONTHS") {
    endDate.setDate(endDate.getDate() + durationValue * 30 - 1);
  }

  try {
    const prismaBooking = prisma as unknown as {
      rentalBooking: { create: (args: unknown) => Promise<unknown> };
    };
    await prismaBooking.rentalBooking.create({
      data: {
        cycleId,
        startDate,
        endDate,
        quantity,
        name,
        email,
        phone,
        status: "CONFIRMED",
      },
    });

    return { success: "Booking confirmed successfully!" };
  } catch (error) {
    console.error(error);
    return { error: "Failed to complete booking." };
  }
}
