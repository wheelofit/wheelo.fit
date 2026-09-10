import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import CycleDetailView from "./CycleDetailView";

import { CycleData } from "../RentalsView";

export default async function CycleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  type CycleBooking = { startDate: Date; endDate: Date; quantity: number };
  type CycleWithBookings = Omit<
    CycleData,
    "isInstock" | "nextAvailableDate"
  > & { bookings: CycleBooking[] };

  const cycle = await (
    prisma as unknown as {
      rentalCycle: {
        findUnique: (args: unknown) => Promise<CycleWithBookings | null>;
      };
    }
  ).rentalCycle.findUnique({
    where: { id },
    include: { bookings: { where: { status: "CONFIRMED" } } },
  });

  if (!cycle) {
    notFound();
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let isInstock = true;
  let nextAvailableDate = null;

  const getBookedQty = (date: Date) =>
    cycle.bookings.reduce((sum: number, b: CycleBooking) => {
      const bStart = new Date(b.startDate);
      bStart.setHours(0, 0, 0, 0);
      const bEnd = new Date(b.endDate);
      bEnd.setHours(23, 59, 59, 999);
      if (date >= bStart && date <= bEnd) {
        return sum + b.quantity;
      }
      return sum;
    }, 0);

  const isAvailableFor30DaysFrom = (startDate: Date) => {
    for (let i = 0; i < 30; i++) {
      const d = new Date(startDate);
      d.setDate(d.getDate() + i);
      if (cycle.quantity - getBookedQty(d) <= 0) return false;
    }
    return true;
  };

  if (!isAvailableFor30DaysFrom(today)) {
    isInstock = false;
    for (let i = 1; i <= 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      if (isAvailableFor30DaysFrom(d)) {
        nextAvailableDate = d.toISOString();
        break;
      }
    }
  }

  return (
    <div>
      <CycleDetailView cycle={{ ...cycle, isInstock, nextAvailableDate }} />
    </div>
  );
}
