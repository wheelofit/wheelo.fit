import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import PaymentLinkForm from "./PaymentLinkForm";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

export default async function PaymentLinkPage({
  params,
}: {
  params: Promise<{ linkId: string }>;
}) {
  const { linkId } = await params;

  if (!linkId || linkId.length !== 24) {
    notFound();
  }

  const link = await prisma.paymentLink.findUnique({
    where: { id: linkId },
  });

  if (!link) {
    notFound();
  }

  const isExpired = new Date(link.expiresAt) < new Date();
  const isPaid = link.paymentStatus === "SUCCESS";

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
            padding: "2.5rem",
            borderRadius: "12px",
            border: "1px solid #333",
            maxWidth: "500px",
            width: "100%",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              fontSize: "2.5rem",
              margin: "0 0 0.5rem 0",
              color: "#1eb53a",
            }}
          >
            ₹{link.amount}
          </h1>
          <p
            style={{
              textAlign: "center",
              color: "#ccc",
              margin: "0 0 2rem 0",
              fontSize: "1.1rem",
            }}
          >
            {link.purpose || "Payment Request"}
          </p>

          {isPaid ? (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
              <h2 style={{ margin: "0 0 1rem 0" }}>Payment Successful</h2>
              <p style={{ color: "#aaa" }}>
                This payment request has already been fulfilled.
              </p>
            </div>
          ) : isExpired ? (
            <div style={{ textAlign: "center", padding: "2rem 0" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏱️</div>
              <h2 style={{ margin: "0 0 1rem 0" }}>Link Expired</h2>
              <p style={{ color: "#aaa" }}>
                This payment link is no longer valid.
              </p>
            </div>
          ) : (
            <PaymentLinkForm linkId={link.id} amount={link.amount} />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
