import React from "react";
import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem",
        textAlign: "center",
        background: "#0a0a0a",
      }}
    >
      <div
        style={{
          background: "#111",
          padding: "3rem",
          borderRadius: "24px",
          border: "1px solid rgba(255,255,255,0.1)",
          maxWidth: "500px",
          width: "100%",
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            background: "rgba(255, 77, 77, 0.1)",
            color: "#ff4d4d",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 1.5rem",
            fontSize: "3rem",
          }}
        >
          ✕
        </div>

        <h1 style={{ fontSize: "2rem", marginBottom: "1rem", color: "#fff" }}>
          Payment Failed
        </h1>
        <p
          style={{
            color: "rgba(255,255,255,0.7)",
            marginBottom: "2rem",
            lineHeight: "1.6",
          }}
        >
          Unfortunately, your payment could not be processed. Your booking has
          not been confirmed. Please try booking again.
        </p>

        <Link
          href="/"
          style={{
            display: "inline-block",
            background: "var(--primary, #1eb53a)",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "50px",
            textDecoration: "none",
            fontWeight: "bold",
            transition: "opacity 0.2s",
          }}
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
}
