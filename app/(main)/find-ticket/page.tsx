"use client";

import React, { useState } from "react";
import Link from "next/link";
import { findTickets } from "./actions";

type TicketResult = {
  id: string;
  ticketCode: string | null;
  eventName: string;
  eventDate: string;
  eventTime: string;
};

export default function FindTicketPage() {
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tickets, setTickets] = useState<TicketResult[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    setTickets(null);

    const formData = new FormData();
    formData.append("query", query);

    const res = await findTickets(formData);

    if (res.error) {
      setError(res.error);
    } else if (res.tickets) {
      setTickets(res.tickets);
    }

    setPending(false);
  };

  return (
    <div
      style={{
        minHeight: "80vh",
        padding: "4rem 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div style={{ maxWidth: "500px", width: "100%" }}>
        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          Find Your Ticket
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            marginBottom: "2.5rem",
          }}
        >
          Enter the email address or phone number you used during registration
          to retrieve your event passes.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
        >
          <div>
            <label
              htmlFor="query"
              style={{
                display: "block",
                marginBottom: "0.5rem",
                fontWeight: "500",
              }}
            >
              Email or Phone Number
            </label>
            <input
              type="text"
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. john@example.com or +123456789"
              required
              style={{
                width: "100%",
                padding: "1rem",
                borderRadius: "8px",
                border: "1px solid rgba(255,255,255,0.2)",
                background: "rgba(255,255,255,0.05)",
                color: "#fff",
                fontSize: "1rem",
              }}
            />
          </div>
          <button
            type="submit"
            disabled={pending}
            style={{
              padding: "1rem",
              borderRadius: "8px",
              border: "none",
              background: "#fff",
              color: "#000",
              fontSize: "1.1rem",
              fontWeight: "bold",
              cursor: pending ? "not-allowed" : "pointer",
              opacity: pending ? 0.7 : 1,
              marginTop: "1rem",
            }}
          >
            {pending ? "Searching..." : "Find Tickets"}
          </button>
        </form>

        {error && (
          <div
            style={{
              marginTop: "2rem",
              padding: "1rem",
              background: "rgba(255,77,77,0.1)",
              color: "#ff4d4d",
              borderRadius: "8px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {tickets && (
          <div style={{ marginTop: "3rem" }}>
            <h3
              style={{
                fontSize: "1.5rem",
                fontWeight: "bold",
                marginBottom: "1.5rem",
              }}
            >
              Your Tickets
            </h3>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {tickets.map((ticket) => (
                <Link
                  href={`/ticket/${ticket.ticketCode}`}
                  key={ticket.id}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div
                    style={{
                      padding: "1.5rem",
                      background: "linear-gradient(135deg, #2a2a2a, #1e1e1e)",
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.1)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      transition: "transform 0.2s, background 0.2s",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-2px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    <div>
                      <h4
                        style={{
                          fontSize: "1.2rem",
                          fontWeight: "bold",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {ticket.eventName}
                      </h4>
                      <p
                        style={{
                          color: "rgba(255,255,255,0.6)",
                          fontSize: "0.9rem",
                        }}
                      >
                        {new Date(ticket.eventDate).toLocaleDateString(
                          "en-GB",
                          { day: "2-digit", month: "2-digit", year: "numeric" },
                        )}{" "}
                        at {ticket.eventTime}
                      </p>
                    </div>
                    <div style={{ color: "#aaa" }}>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M5 12h14M12 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
