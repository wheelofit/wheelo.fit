"use client";

import { useState } from "react";
import { updatePricing } from "./actions";

export default function PricingForm({
  initialMidnightPrice,
  initialSundayPrice,
}: {
  initialMidnightPrice: number;
  initialSundayPrice: number;
}) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setMessage(null);

    const res = await updatePricing(formData);

    if (res?.error) {
      setMessage({ type: "error", text: res.error });
    } else if (res?.success) {
      setMessage({ type: "success", text: res.success });
    }

    setPending(false);
  }

  return (
    <form
      action={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}
    >
      {message && (
        <div
          style={{
            padding: "1rem",
            borderRadius: "6px",
            background:
              message.type === "success"
                ? "rgba(77,255,77,0.1)"
                : "rgba(255,77,77,0.1)",
            color: message.type === "success" ? "#4dff4d" : "#ff4d4d",
            border: `1px solid ${message.type === "success" ? "#4dff4d" : "#ff4d4d"}`,
          }}
        >
          {message.text}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label htmlFor="midnightPrice" style={{ fontWeight: "bold" }}>
          Midnight Rides Price (₹)
        </label>
        <input
          type="number"
          id="midnightPrice"
          name="midnightPrice"
          defaultValue={initialMidnightPrice}
          required
          min="0"
          style={{
            padding: "0.8rem",
            borderRadius: "6px",
            border: "1px solid #444",
            background: "#222",
            color: "#fff",
            fontSize: "1rem",
          }}
        />
        <span style={{ fontSize: "0.8rem", color: "#888" }}>
          This will apply to all Midnight Ride events.
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label htmlFor="sundayPrice" style={{ fontWeight: "bold" }}>
          Sunday Morning Rides Price (₹)
        </label>
        <input
          type="number"
          id="sundayPrice"
          name="sundayPrice"
          defaultValue={initialSundayPrice}
          required
          min="0"
          style={{
            padding: "0.8rem",
            borderRadius: "6px",
            border: "1px solid #444",
            background: "#222",
            color: "#fff",
            fontSize: "1rem",
          }}
        />
        <span style={{ fontSize: "0.8rem", color: "#888" }}>
          This will apply to all Sunday Morning Ride events.
        </span>
      </div>

      <button
        type="submit"
        disabled={pending}
        style={{
          marginTop: "1rem",
          padding: "1rem",
          background: "#1eb53a",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontWeight: "bold",
          fontSize: "1rem",
          cursor: pending ? "not-allowed" : "pointer",
          opacity: pending ? 0.7 : 1,
        }}
      >
        {pending ? "Updating Pricing..." : "Save Pricing"}
      </button>
    </form>
  );
}
