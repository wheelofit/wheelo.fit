"use client";

import React, { useState } from "react";

interface PaymentLinkFormProps {
  linkId: string;
  amount: number;
}

export default function PaymentLinkForm({
  linkId,
  amount,
}: PaymentLinkFormProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    try {
      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success && data.redirectUrl) {
        window.location.href = data.redirectUrl;
      } else {
        alert(data.error || "Failed to initiate payment");
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <input type="hidden" name="type" value="payment_link" />
      <input type="hidden" name="linkId" value={linkId} />

      <div>
        <label
          htmlFor="name"
          style={{ display: "block", marginBottom: "0.5rem", color: "#ccc" }}
        >
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "4px",
            border: "1px solid #444",
            background: "#222",
            color: "#fff",
          }}
        />
      </div>

      <div>
        <label
          htmlFor="email"
          style={{ display: "block", marginBottom: "0.5rem", color: "#ccc" }}
        >
          Email Address *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "4px",
            border: "1px solid #444",
            background: "#222",
            color: "#fff",
          }}
        />
      </div>

      <div>
        <label
          htmlFor="phone"
          style={{ display: "block", marginBottom: "0.5rem", color: "#ccc" }}
        >
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          required
          pattern="[0-9]{10}"
          title="Please enter a valid 10-digit phone number"
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "4px",
            border: "1px solid #444",
            background: "#222",
            color: "#fff",
          }}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          padding: "1rem",
          background: "#1eb53a",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: loading ? "not-allowed" : "pointer",
          fontWeight: "bold",
          marginTop: "1rem",
          fontSize: "1.1rem",
        }}
      >
        {loading ? "Processing..." : `Pay ₹${amount}`}
      </button>

      <p
        style={{
          textAlign: "center",
          fontSize: "0.8rem",
          color: "#666",
          margin: 0,
        }}
      >
        Secure payments powered by PhonePe
      </p>
    </form>
  );
}
