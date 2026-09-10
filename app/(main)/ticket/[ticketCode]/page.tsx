import React from "react";
import prisma from "@/lib/prisma";
import TicketDownload from "./TicketDownload";

export default async function TicketPage({
  params,
}: {
  params: Promise<{ ticketCode: string }>;
}) {
  const { ticketCode } = await params;

  const registration = await (
    prisma as unknown as {
      registration: {
        findUnique: (args: unknown) => Promise<{
          ticketCode: string | null;
          name: string;
          email: string;
          ticketCount: number;
          additionalNames: string[];
          event: { title: string; date: Date; timeSlot: string };
        } | null>;
      };
    }
  ).registration.findUnique({
    where: { ticketCode },
    include: { event: true },
  });

  if (!registration) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "2rem 1rem",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #2a1e1e, #3a2a2a)",
            color: "#fff",
            borderRadius: "16px",
            padding: "2.5rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            maxWidth: "400px",
            width: "100%",
            textAlign: "center",
            border: "1px solid rgba(255,100,100,0.2)",
          }}
        >
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              marginBottom: "1rem",
              color: "#ff6b6b",
            }}
          >
            Invalid Ticket
          </h2>
          <p
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "1.1rem",
              marginBottom: "2rem",
            }}
          >
            This ticket does not exist or the QR code has been tampered with.
            Please check your ticket code and try again.
          </p>
        </div>
      </div>
    );
  }

  const ticketData = {
    ticketCode: registration.ticketCode as string,
    name: registration.name,
    email: registration.email,
    eventName: registration.event.title,
    eventDate: registration.event.date.toLocaleDateString("en-GB", {
      weekday: "short",
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    }),
    eventTime: registration.event.timeSlot,
    ticketCount: registration.ticketCount || 1,
    additionalNames: registration.additionalNames || [],
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem 1rem",
      }}
    >
      <TicketDownload ticket={ticketData} />
    </div>
  );
}
