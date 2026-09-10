"use client";

import React, { useState } from "react";

export default function RefundButton({
  transactionId,
  type,
}: {
  transactionId: string;
  type: "event" | "rental";
}) {
  const [loading, setLoading] = useState(false);

  const handleRefund = async () => {
    if (
      !confirm(
        "Are you sure you want to refund this payment? This action cannot be undone.",
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/admin/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transactionId, type }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        alert("Refund initiated successfully!");
        window.location.reload();
      } else {
        alert(data.error || "Refund failed");
      }
    } catch (err) {
      console.error(err);
      alert("An unexpected error occurred while processing the refund.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleRefund}
      disabled={loading}
      style={{
        background: "#dc2626",
        color: "#fff",
        border: "none",
        padding: "0.4rem 0.8rem",
        borderRadius: "4px",
        cursor: loading ? "not-allowed" : "pointer",
        fontSize: "0.8rem",
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? "Refunding..." : "Refund"}
    </button>
  );
}
