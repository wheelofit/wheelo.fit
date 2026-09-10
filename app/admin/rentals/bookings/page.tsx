import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import BookingList from "./BookingList";

export const dynamic = "force-dynamic";

export default async function AdminRentalsBookingsPage() {
  const bookings = await (
    prisma as unknown as {
      rentalBooking: {
        findMany: (
          args: unknown,
        ) => Promise<import("./BookingList").BookingData[]>;
      };
    }
  ).rentalBooking.findMany({
    where: { status: "CONFIRMED" },
    orderBy: { createdAt: "desc" },
    include: {
      cycle: true,
    },
    take: 10,
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", fontWeight: "bold" }}>
          Rental Bookings
        </h1>
        <Link
          href="/admin/rentals"
          style={{
            padding: "0.6rem 1.2rem",
            background: "#333",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          &larr; Back to Inventory
        </Link>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          padding: "1.5rem",
          borderRadius: "8px",
          border: "1px solid #333",
        }}
      >
        <BookingList bookings={bookings} />
      </div>
    </div>
  );
}
