"use client";

import React, { useState, useTransition } from "react";
import { submitJobApplication } from "../actions";

export default function ApplyForm({ jobId }: { jobId: string }) {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage(null);
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const resumeLink = formData.get("resumeLink") as string;

    startTransition(async () => {
      try {
        const result = await submitJobApplication(jobId, {
          name,
          email,
          phone,
          resumeLink,
        });
        setMessage({ text: result.message, isError: !result.success });
        if (result.success) {
          (e.target as HTMLFormElement).reset();
        }
      } catch {
        setMessage({
          text: "Something went wrong. Please try again.",
          isError: true,
        });
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <div>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "var(--foreground)",
          }}
        >
          Full Name
        </label>
        <input
          type="text"
          name="name"
          required
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "4px",
            border: "1px solid #333",
            background: "#222",
            color: "#fff",
          }}
        />
      </div>
      <div>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "var(--foreground)",
          }}
        >
          Email
        </label>
        <input
          type="email"
          name="email"
          required
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "4px",
            border: "1px solid #333",
            background: "#222",
            color: "#fff",
          }}
        />
      </div>
      <div>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "var(--foreground)",
          }}
        >
          Phone Number
        </label>
        <input
          type="tel"
          name="phone"
          required
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "4px",
            border: "1px solid #333",
            background: "#222",
            color: "#fff",
          }}
        />
      </div>
      <div>
        <label
          style={{
            display: "block",
            marginBottom: "0.5rem",
            color: "var(--foreground)",
          }}
        >
          Resume Link (Google Drive, Dropbox, etc.)
        </label>
        <input
          type="url"
          name="resumeLink"
          required
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "4px",
            border: "1px solid #333",
            background: "#222",
            color: "#fff",
          }}
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        style={{
          padding: "1rem",
          background: "var(--primary)",
          color: "var(--primary-foreground)",
          border: "none",
          borderRadius: "8px",
          fontWeight: "bold",
          cursor: isPending ? "not-allowed" : "pointer",
          opacity: isPending ? 0.7 : 1,
          marginTop: "1rem",
        }}
      >
        {isPending ? "Submitting..." : "Submit Application"}
      </button>
      {message && (
        <p
          style={{
            color: message.isError ? "#f87171" : "#4ade80",
            margin: 0,
            fontSize: "0.9rem",
            marginTop: "0.5rem",
          }}
        >
          {message.text}
        </p>
      )}
    </form>
  );
}
