import React from "react";
import prisma from "@/lib/prisma";
import PricingForm from "./PricingForm";

export default async function PricingPage() {
  // Find current pricing by looking at the most recently created active event of each type
  const midnightEvent = await prisma.event.findFirst({
    where: { eventType: "MIDNIGHT" },
    orderBy: { createdAt: "desc" },
  });

  const sundayEvent = await prisma.event.findFirst({
    where: { eventType: "SUNDAY" },
    orderBy: { createdAt: "desc" },
  });

  const midnightPrice = midnightEvent?.price || 749;
  const sundayPrice = sundayEvent?.price || 649;

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Global Pricing</h1>
      <p style={{ color: "#aaa", marginBottom: "2rem" }}>
        Manage the pricing for your events here. Updating the price will
        automatically update all existing events in the database and apply to
        all future bookings.
      </p>

      <div
        style={{
          background: "#1a1a1a",
          padding: "2rem",
          borderRadius: "8px",
          border: "1px solid #333",
          maxWidth: "600px",
        }}
      >
        <PricingForm
          initialMidnightPrice={midnightPrice}
          initialSundayPrice={sundayPrice}
        />
      </div>
    </div>
  );
}
