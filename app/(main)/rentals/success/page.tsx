import React from "react";
import Link from "next/link";

export default async function RentalSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ txn?: string }>;
}) {
  const resolvedParams = await searchParams;

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6rem 2rem 2rem 2rem",
      }}
    >
      <div
        style={{
          background: "#111",
          padding: "3rem",
          borderRadius: "12px",
          border: "1px solid #333",
          textAlign: "center",
          maxWidth: "500px",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            background: "#1eb53a22",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 2rem",
          }}
        >
          <span style={{ color: "#1eb53a", fontSize: "3rem" }}>✓</span>
        </div>
        <h1 style={{ color: "#fff", marginBottom: "1rem" }}>
          Rental Confirmed!
        </h1>
        <p style={{ color: "#aaa", marginBottom: "2rem", lineHeight: 1.6 }}>
          Thank you for renting with Wheelo.fit. Your payment was successful and
          your cycle is reserved. We will contact you with further details.
        </p>

        {resolvedParams.txn && (
          <div
            style={{
              background: "#222",
              padding: "1rem",
              borderRadius: "6px",
              marginBottom: "2rem",
            }}
          >
            <div
              style={{
                color: "#888",
                fontSize: "0.9rem",
                marginBottom: "0.5rem",
              }}
            >
              Transaction ID
            </div>
            <div
              style={{
                color: "#fff",
                fontFamily: "monospace",
                fontWeight: "bold",
              }}
            >
              {resolvedParams.txn}
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            href="/"
            style={{
              background: "#1eb53a",
              color: "#000",
              padding: "0.8rem 1.5rem",
              textDecoration: "none",
              borderRadius: "6px",
              fontWeight: "bold",
            }}
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  );
}
