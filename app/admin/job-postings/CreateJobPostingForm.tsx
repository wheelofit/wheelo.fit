"use client";

import React, { useState, useTransition } from "react";
import { createJobPosting } from "./actions";

export default function CreateJobPostingForm() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage("");
    const formData = new FormData(e.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const isActive = formData.get("isActive") === "on";

    startTransition(async () => {
      try {
        await createJobPosting({ title, description, isActive });
        setMessage("Job posting created successfully.");
        (e.target as HTMLFormElement).reset();
      } catch {
        setMessage("Failed to create job posting.");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <div>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Job Title
        </label>
        <input
          type="text"
          name="title"
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
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Description
        </label>
        <textarea
          name="description"
          required
          rows={5}
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "4px",
            border: "1px solid #333",
            background: "#222",
            color: "#fff",
            fontFamily: "inherit",
          }}
        />
      </div>
      <div>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            cursor: "pointer",
          }}
        >
          <input type="checkbox" name="isActive" defaultChecked />
          Active (Visible on careers page)
        </label>
      </div>
      <button
        type="submit"
        disabled={isPending}
        style={{
          padding: "0.8rem",
          background: "#fff",
          color: "#000",
          border: "none",
          borderRadius: "4px",
          fontWeight: "bold",
          cursor: isPending ? "not-allowed" : "pointer",
          opacity: isPending ? 0.7 : 1,
        }}
      >
        {isPending ? "Creating..." : "Create Job Posting"}
      </button>
      {message && (
        <p
          style={{
            color: message.includes("success") ? "#4ade80" : "#f87171",
            margin: 0,
            fontSize: "0.9rem",
          }}
        >
          {message}
        </p>
      )}
    </form>
  );
}
