"use client";

import React, { useState } from "react";
import { PaymentLink } from "@prisma/client";
import { refundPaymentLink } from "./actions";

export default function PaymentLinkListItem({ link }: { link: PaymentLink }) {
  const [refunding, setRefunding] = useState(false);

  const handleRefund = async () => {
    if (
      confirm(
        "Are you sure you want to refund this payment? This action cannot be undone.",
      )
    ) {
      setRefunding(true);
      const res = await refundPaymentLink(link.id);
      if (res.error) {
        alert(res.error);
        setRefunding(false);
      }
    }
  };

  const isSuccess = link.paymentStatus === "SUCCESS";
  const isRefunded = link.paymentStatus === "REFUNDED";

  return (
    <li
      style={{
        background: "#222",
        padding: "1rem",
        borderRadius: "6px",
        border: "1px solid #333",
        display: "flex",
        flexDirection: "column",
        gap: "0.8rem",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div>
          <h3
            style={{
              margin: "0 0 0.4rem 0",
              fontSize: "1.3rem",
              color: "#fff",
            }}
          >
            ₹{link.amount}
          </h3>
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              fontSize: "0.85rem",
            }}
          >
            <span
              style={{
                background:
                  link.paymentStatus === "SUCCESS"
                    ? "#1eb53a"
                    : isRefunded
                      ? "#f39c12"
                      : "#444",
                color: "#fff",
                padding: "3px 8px",
                borderRadius: "4px",
                fontWeight: "bold",
              }}
            >
              {link.paymentStatus}
            </span>
          </div>
        </div>

        {isSuccess && (
          <button
            onClick={handleRefund}
            disabled={refunding}
            style={{
              background: "transparent",
              color: "#f39c12",
              border: "1px solid #f39c12",
              borderRadius: "4px",
              padding: "0.4rem 1rem",
              fontSize: "0.85rem",
              cursor: refunding ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
            title="Refund Payment"
          >
            {refunding ? "Refunding..." : "Refund"}
          </button>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.4rem",
          fontSize: "0.9rem",
          color: "#ccc",
          marginTop: "0.5rem",
        }}
      >
        {link.name && (
          <span style={{ color: "#fff", fontWeight: "500" }}>
            Paid by: {link.name} {link.phone ? `(${link.phone})` : ""}
          </span>
        )}
        {link.transactionId && (
          <span>
            Transaction ID:{" "}
            <strong style={{ color: "#fff" }}>{link.transactionId}</strong>
          </span>
        )}
        <span
          suppressHydrationWarning
          style={{ color: "#888", fontSize: "0.8rem" }}
        >
          Date: {new Date(link.createdAt).toLocaleString()}
        </span>
      </div>
    </li>
  );
}
