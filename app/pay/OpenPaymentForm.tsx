"use client";

import React, { useState } from "react";

export default function OpenPaymentForm() {
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
      <input type="hidden" name="type" value="open_payment" />

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

      <div>
        <label
          htmlFor="amount"
          style={{ display: "block", marginBottom: "0.5rem", color: "#ccc" }}
        >
          Amount (INR) *
        </label>
        <input
          type="number"
          id="amount"
          name="amount"
          min="1"
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
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "0.5rem",
        }}
      >
        {loading ? (
          <>
            <svg
              style={{ animation: "spin 1s linear infinite" }}
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 1 1-6.219-8.56"></path>
            </svg>
            <style>{`
              @keyframes spin {
                100% { transform: rotate(360deg); }
              }
            `}</style>
            Processing...
          </>
        ) : (
          `Pay Now`
        )}
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
