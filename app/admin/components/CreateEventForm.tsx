"use client";

import React, { useState } from "react";
import { createEvent } from "../actions/eventActions";

export default function CreateEventForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setError(null);
    setSuccess(null);

    const res = await createEvent(formData);

    if (res?.error) {
      setError(res.error);
    } else if (res?.success) {
      setSuccess(res.success);
      (
        document.getElementById("create-event-form") as HTMLFormElement
      )?.reset();
    }

    setPending(false);
  }

  return (
    <form
      id="create-event-form"
      action={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      {error && (
        <div
          style={{
            color: "#ff4d4d",
            background: "rgba(255,77,77,0.1)",
            padding: "0.8rem",
            borderRadius: "6px",
            fontSize: "0.9rem",
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          style={{
            color: "#4dff4d",
            background: "rgba(77,255,77,0.1)",
            padding: "0.8rem",
            borderRadius: "6px",
            fontSize: "0.9rem",
          }}
        >
          {success}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label htmlFor="title" style={{ fontSize: "0.9rem", color: "#ccc" }}>
          Event Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          required
          placeholder="e.g. South Bombay Night Ride"
          style={{
            padding: "0.8rem",
            borderRadius: "6px",
            border: "1px solid #444",
            background: "#222",
            color: "#fff",
          }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label
          htmlFor="eventType"
          style={{ fontSize: "0.9rem", color: "#ccc" }}
        >
          Event Type / Page
        </label>
        <select
          id="eventType"
          name="eventType"
          required
          style={{
            padding: "0.8rem",
            borderRadius: "6px",
            border: "1px solid #444",
            background: "#222",
            color: "#fff",
          }}
        >
          <option value="MIDNIGHT">Midnight Rides</option>
          <option value="SUNDAY">Sunday Morning Rides</option>
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label htmlFor="date" style={{ fontSize: "0.9rem", color: "#ccc" }}>
          Event Date
        </label>
        <input
          type="date"
          id="date"
          name="date"
          required
          style={{
            padding: "0.8rem",
            borderRadius: "6px",
            border: "1px solid #444",
            background: "#222",
            color: "#fff",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            flex: 1,
          }}
        >
          <label
            htmlFor="startTime"
            style={{ fontSize: "0.9rem", color: "#ccc" }}
          >
            Start Time
          </label>
          <input
            type="time"
            id="startTime"
            name="startTime"
            required
            style={{
              padding: "0.8rem",
              borderRadius: "6px",
              border: "1px solid #444",
              background: "#222",
              color: "#fff",
            }}
          />
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "0.5rem",
            flex: 1,
          }}
        >
          <label
            htmlFor="endTime"
            style={{ fontSize: "0.9rem", color: "#ccc" }}
          >
            End Time
          </label>
          <input
            type="time"
            id="endTime"
            name="endTime"
            required
            style={{
              padding: "0.8rem",
              borderRadius: "6px",
              border: "1px solid #444",
              background: "#222",
              color: "#fff",
            }}
          />
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <label htmlFor="ageLimit" style={{ fontSize: "0.9rem", color: "#ccc" }}>
          Age Limit (Optional)
        </label>
        <input
          type="text"
          id="ageLimit"
          name="ageLimit"
          placeholder="e.g. 18+"
          style={{
            padding: "0.8rem",
            borderRadius: "6px",
            border: "1px solid #444",
            background: "#222",
            color: "#fff",
          }}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        style={{
          marginTop: "1rem",
          padding: "1rem",
          background: "#fff",
          color: "#000",
          border: "none",
          borderRadius: "6px",
          fontWeight: "bold",
          cursor: pending ? "not-allowed" : "pointer",
          opacity: pending ? 0.7 : 1,
        }}
      >
        {pending ? "Creating..." : "Create Event"}
      </button>
    </form>
  );
}
