"use client";

import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { markPresent } from "./actions";
import { Camera, X, RefreshCcw } from "lucide-react";

export default function QRScanner({ eventId }: { eventId: string }) {
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [scanning, setScanning] = useState(true);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState<"environment" | "user">(
    "environment",
  );

  const handleScan = async (result: { rawValue: string }[]) => {
    if (!result || !result[0]) return;
    const rawValue = result[0].rawValue;

    // Extract ticketCode from URL
    let ticketCode = rawValue;
    if (rawValue.includes("/ticket/")) {
      const parts = rawValue.split("/ticket/");
      ticketCode = parts[parts.length - 1];
    }

    if (ticketCode) {
      setScanning(false);
      setMessage({ text: "Processing...", type: "info" });

      const res = await markPresent(ticketCode, eventId);

      if (res.success) {
        setMessage({
          text: res.message,
          type: res.alreadyPresent ? "info" : "success",
        });
      } else {
        setMessage({ text: res.message, type: "error" });
      }

      // Close camera after success or error, but let message show for a bit
      setTimeout(() => {
        setMessage(null);
        setScanning(true);
        setIsCameraOpen(false);
      }, 2500);
    }
  };

  return (
    <div
      style={{
        background: "#111",
        padding: "1.5rem",
        borderRadius: "8px",
        border: "1px solid #333",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h3 style={{ margin: 0 }}>Scan Event Pass</h3>
        {isCameraOpen && (
          <button
            onClick={() => setIsCameraOpen(false)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#ff4d4d22",
              color: "#ff4d4d",
              border: "1px solid #ff4d4d",
              padding: "0.4rem 0.8rem",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            <X size={16} /> Close
          </button>
        )}
      </div>

      {!isCameraOpen ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "3rem 1rem",
            background: "#222",
            borderRadius: "8px",
          }}
        >
          <Camera size={48} color="#888" style={{ marginBottom: "1rem" }} />
          <p
            style={{
              color: "#aaa",
              marginBottom: "1.5rem",
              textAlign: "center",
            }}
          >
            Scanner is inactive. Open it to scan participant passes.
          </p>
          <button
            onClick={() => setIsCameraOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#1eb53a",
              color: "#fff",
              border: "none",
              padding: "0.8rem 1.5rem",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "1rem",
            }}
          >
            <Camera size={20} /> Open Scanner
          </button>
        </div>
      ) : (
        <div style={{ position: "relative" }}>
          <div
            style={{
              height: "350px",
              width: "100%",
              overflow: "hidden",
              borderRadius: "8px",
              position: "relative",
            }}
          >
            {scanning ? (
              <Scanner
                onScan={handleScan}
                formats={["qr_code"]}
                constraints={{
                  facingMode,
                  width: { ideal: 640 },
                  height: { ideal: 480 },
                }}
                retryDelay={100}
                settleDelayMs={200}
                components={{ finder: true }}
                styles={{ container: { width: "100%", height: "100%" } }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  background: "#222",
                }}
              >
                <p
                  style={{
                    color:
                      message?.type === "success"
                        ? "#4ade80"
                        : message?.type === "error"
                          ? "#f87171"
                          : "#60a5fa",
                    fontWeight: "bold",
                    textAlign: "center",
                    padding: "1rem",
                    fontSize: "1.2rem",
                  }}
                >
                  {message?.text}
                </p>
              </div>
            )}
          </div>

          {scanning && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "1rem",
              }}
            >
              <button
                onClick={() =>
                  setFacingMode((prev) =>
                    prev === "environment" ? "user" : "environment",
                  )
                }
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  background: "#333",
                  color: "#fff",
                  border: "1px solid #555",
                  padding: "0.6rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                <RefreshCcw size={16} /> Switch Camera (
                {facingMode === "environment" ? "Back" : "Front"})
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
