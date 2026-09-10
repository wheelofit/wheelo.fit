"use client";

import React, { useState } from "react";

export default function CopyLinkSection() {
  const [copied, setCopied] = useState(false);

  // Try to remove "admin." if the app uses subdomains, otherwise just use origin
  const origin =
    typeof window !== "undefined"
      ? window.location.origin.replace("admin.", "")
      : "";
  const shareableUrl = `${origin}/pay`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      style={{
        background: "#1a1a1a",
        padding: "1.5rem",
        borderRadius: "8px",
        border: "1px solid #333",
        marginBottom: "2rem",
      }}
    >
      <h2 style={{ marginTop: 0, marginBottom: "1rem", fontSize: "1.1rem" }}>
        Share Payment Link
      </h2>
      <p style={{ color: "#aaa", fontSize: "0.9rem", marginBottom: "1rem" }}>
        Copy the link below and send it to your customers to accept custom
        payments.
      </p>
      <div style={{ display: "flex", gap: "0.5rem" }}>
        <input
          type="text"
          readOnly
          value={shareableUrl}
          style={{
            flex: 1,
            padding: "0.8rem",
            borderRadius: "4px",
            border: "1px solid #444",
            background: "#111",
            color: "#aaa",
            fontSize: "0.9rem",
          }}
        />
        <button
          onClick={handleCopy}
          style={{
            padding: "0.8rem 1.5rem",
            background: copied ? "#1eb53a" : "#333",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: "bold",
            whiteSpace: "nowrap",
          }}
        >
          {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>
    </div>
  );
}
