import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";

import RefundButton from "@/app/admin/components/RefundButton";

export default async function EventResponsesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const event = await prisma.event.findUnique({
    where: { id: resolvedParams.id },
    include: {
      registrations: {
        where: { paymentStatus: "SUCCESS" },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!event) {
    return <div>Event not found.</div>;
  }

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
        <div>
          <h1 style={{ margin: "0 0 0.5rem 0" }}>{event.title} - Responses</h1>
          <p style={{ color: "#aaa", margin: 0 }}>
            {new Date(event.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}{" "}
            | {event.timeSlot}
          </p>
        </div>
        <Link
          href="/admin/responses"
          style={{
            padding: "0.5rem 1rem",
            background: "#333",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          &larr; Back to Responses
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
        <h2 style={{ marginTop: 0, marginBottom: "1rem", fontSize: "1.2rem" }}>
          Total Registrations: {event.registrations.length}
        </h2>

        {event.registrations.length === 0 ? (
          <div
            style={{
              padding: "2rem",
              background: "#222",
              borderRadius: "6px",
              color: "#888",
              textAlign: "center",
            }}
          >
            No one has registered for this event yet.
          </div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                textAlign: "left",
              }}
            >
              <thead>
                <tr
                  style={{ background: "#222", borderBottom: "1px solid #444" }}
                >
                  <th style={{ padding: "0.8rem 1rem" }}>Name</th>
                  <th style={{ padding: "0.8rem 1rem" }}>Email</th>
                  <th style={{ padding: "0.8rem 1rem" }}>Phone</th>
                  <th style={{ padding: "0.8rem 1rem" }}>Ticket Code</th>
                  <th style={{ padding: "0.8rem 1rem" }}>Transaction ID</th>
                  <th style={{ padding: "0.8rem 1rem" }}>Status</th>
                  <th style={{ padding: "0.8rem 1rem" }}>Date Registered</th>
                  <th style={{ padding: "0.8rem 1rem" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {event.registrations.map(
                  (reg: {
                    id: string;
                    name: string;
                    email: string;
                    phone: string;
                    ticketCode: string | null;
                    transactionId: string | null;
                    isPresent: boolean;
                    createdAt: Date;
                  }) => (
                    <tr key={reg.id} style={{ borderBottom: "1px solid #333" }}>
                      <td style={{ padding: "0.8rem 1rem" }}>{reg.name}</td>
                      <td style={{ padding: "0.8rem 1rem" }}>{reg.email}</td>
                      <td style={{ padding: "0.8rem 1rem" }}>{reg.phone}</td>
                      <td
                        style={{
                          padding: "0.8rem 1rem",
                          fontFamily: "monospace",
                        }}
                      >
                        {reg.ticketCode || "-"}
                      </td>
                      <td
                        style={{
                          padding: "0.8rem 1rem",
                          fontFamily: "monospace",
                          fontSize: "0.8rem",
                        }}
                      >
                        {reg.transactionId || "-"}
                      </td>
                      <td style={{ padding: "0.8rem 1rem" }}>
                        {reg.isPresent ? (
                          <span
                            style={{ color: "#4ade80", fontWeight: "bold" }}
                          >
                            Present
                          </span>
                        ) : (
                          <span style={{ color: "#888" }}>Absent</span>
                        )}
                      </td>
                      <td style={{ padding: "0.8rem 1rem" }}>
                        {new Date(reg.createdAt).toLocaleString()}
                      </td>
                      <td style={{ padding: "0.8rem 1rem" }}>
                        {reg.transactionId && (
                          <RefundButton
                            transactionId={reg.transactionId}
                            type="event"
                          />
                        )}
                      </td>
                    </tr>
                  ),
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
