import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

export default async function PaymentSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ txn?: string }>;
}) {
  const transactionId = (await searchParams).txn;

  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "80vh",
          padding: "120px 20px 60px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            background: "#1a1a1a",
            padding: "3rem",
            borderRadius: "12px",
            border: "1px solid #1eb53a",
            maxWidth: "500px",
            width: "100%",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(30,181,58,0.1)",
          }}
        >
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🎉</div>

          <h1 style={{ margin: "0 0 1rem 0", color: "#1eb53a" }}>
            Payment Successful!
          </h1>

          <p style={{ color: "#ccc", marginBottom: "2rem", lineHeight: "1.6" }}>
            Thank you for your payment. Your transaction has been completed
            successfully.
          </p>

          {transactionId && (
            <div
              style={{
                background: "#222",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "2rem",
                border: "1px solid #333",
              }}
            >
              <p
                style={{
                  margin: "0 0 0.5rem 0",
                  color: "#888",
                  fontSize: "0.9rem",
                }}
              >
                Transaction ID
              </p>
              <p style={{ margin: 0, color: "#fff", wordBreak: "break-all" }}>
                {transactionId}
              </p>
            </div>
          )}

          <Link
            href="/"
            style={{
              display: "inline-block",
              padding: "1rem 2rem",
              background: "#333",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "4px",
              fontWeight: "bold",
            }}
          >
            Return to Home
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
