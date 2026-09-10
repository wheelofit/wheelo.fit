import React from "react";
import OpenPaymentForm from "./OpenPaymentForm";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

export const metadata = {
  title: "Make a Payment | Wheelo.fit",
  description: "Make a custom payment to Wheelo.fit",
};

export default function PayPage() {
  return (
    <>
      <Navbar />
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 20px 60px",
        }}
      >
        <div
          style={{
            background: "#1a1a1a",
            padding: "3rem",
            borderRadius: "8px",
            border: "1px solid #333",
            maxWidth: "500px",
            width: "100%",
          }}
        >
          <h1 style={{ marginTop: 0, textAlign: "center", color: "#fff" }}>
            Make a Payment
          </h1>
          <p
            style={{ textAlign: "center", color: "#aaa", marginBottom: "2rem" }}
          >
            Enter your details and the amount you wish to pay.
          </p>
          <OpenPaymentForm />
        </div>
      </main>
      <Footer />
    </>
  );
}
