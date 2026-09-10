"use client";

import React, { useState, useTransition } from "react";
import Link from "next/link";
import { toggleEventActive, editEvent } from "../actions/eventActions";

type Event = {
  id: string;
  title: string;
  eventType: string;
  date: Date;
  timeSlot: string;
  ageLimit: string | null;
  isActive: boolean;
};

export default function EventListItem({
  event,
  isPast,
}: {
  event: Event;
  isPast?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function handleToggleActive() {
    startTransition(async () => {
      const res = await toggleEventActive(event.id, event.isActive);
      if (res?.error) {
        setError(res.error);
      }
    });
  }

  async function handleEditSubmit(formData: FormData) {
    setError(null);
    // isActive checkbox fix for unchecked state
    if (!formData.has("isActive")) {
      formData.append("isActive", "false");
    }

    startTransition(async () => {
      const res = await editEvent(event.id, formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setIsEditing(false);
      }
    });
  }

  if (isEditing) {
    // Format date for input type="date"
    const dateObj = new Date(event.date);
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    const dateFormatted = `${yyyy}-${mm}-${dd}`;

    return (
      <li
        style={{
          padding: "1rem",
          background: "#222",
          borderRadius: "6px",
          border: "1px solid #444",
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            <strong style={{ fontSize: "1.1rem" }}>{event.title}</strong>
            <span
              style={{
                padding: "0.2rem 0.5rem",
                borderRadius: "4px",
                fontSize: "0.7rem",
                background: event.isActive
                  ? "rgba(77,255,77,0.2)"
                  : "rgba(255,77,77,0.2)",
                color: event.isActive ? "#4dff4d" : "#ff4d4d",
              }}
            >
              {event.isActive ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>
          <div style={{ fontSize: "0.9rem", color: "#ccc" }}>
            <strong>Type:</strong> {event.eventType}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#ccc" }}>
            <strong>Date:</strong>{" "}
            {new Date(event.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}
          </div>
          <div style={{ fontSize: "0.9rem", color: "#ccc" }}>
            <strong>Time:</strong> {event.timeSlot}
          </div>
        </div>

        {/* MODAL OVERLAY */}
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            zIndex: 9999,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "1rem",
          }}
        >
          <div
            style={{
              background: "#1a1a1a",
              padding: "2rem",
              borderRadius: "12px",
              border: "1px solid #333",
              width: "100%",
              maxWidth: "500px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                marginBottom: "1.5rem",
                fontSize: "1.2rem",
              }}
            >
              Edit Event Timings
            </h3>

            <form
              action={handleEditSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {error && (
                <div style={{ color: "#ff4d4d", fontSize: "0.8rem" }}>
                  {error}
                </div>
              )}

              {/* HIDDEN FIELDS TO SATISFY ACTION REQUIREMENTS */}
              <input type="hidden" name="title" value={event.title} />
              <input type="hidden" name="eventType" value={event.eventType} />
              <input
                type="hidden"
                name="ageLimit"
                value={event.ageLimit || ""}
              />
              <input
                type="hidden"
                name="isActive"
                value={event.isActive ? "true" : "false"}
              />

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      color: "#ccc",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Event Date
                  </label>
                  <input
                    type="date"
                    name="date"
                    defaultValue={dateFormatted}
                    required
                    style={{
                      width: "100%",
                      padding: "0.8rem",
                      borderRadius: "6px",
                      border: "1px solid #444",
                      background: "#222",
                      color: "#fff",
                      fontSize: "1rem",
                    }}
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "0.9rem",
                      color: "#ccc",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Time Slot (e.g. 11:30 PM - 02:00 AM)
                  </label>
                  <input
                    type="text"
                    name="timeSlot"
                    defaultValue={event.timeSlot}
                    required
                    style={{
                      width: "100%",
                      padding: "0.8rem",
                      borderRadius: "6px",
                      border: "1px solid #444",
                      background: "#222",
                      color: "#fff",
                      fontSize: "1rem",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  justifyContent: "flex-end",
                  marginTop: "1rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setError(null);
                  }}
                  disabled={isPending}
                  style={{
                    padding: "0.6rem 1.2rem",
                    background: "transparent",
                    color: "#ccc",
                    border: "1px solid #555",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  style={{
                    padding: "0.6rem 1.2rem",
                    background: "#1eb53a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {isPending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </li>
    );
  }

  return (
    <li
      style={{
        padding: "1rem",
        background: "#222",
        borderRadius: "6px",
        border: "1px solid #444",
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "1rem",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            marginBottom: "0.5rem",
          }}
        >
          <strong style={{ fontSize: "1.1rem" }}>{event.title}</strong>
          <span
            style={{
              padding: "0.2rem 0.5rem",
              borderRadius: "4px",
              fontSize: "0.7rem",
              background: event.isActive
                ? "rgba(77,255,77,0.2)"
                : "rgba(255,77,77,0.2)",
              color: event.isActive ? "#4dff4d" : "#ff4d4d",
            }}
          >
            {event.isActive ? "ACTIVE" : "INACTIVE"}
          </span>
        </div>
        <div style={{ fontSize: "0.9rem", color: "#ccc" }}>
          <strong>Type:</strong> {event.eventType}
        </div>
        <div style={{ fontSize: "0.9rem", color: "#ccc" }}>
          <strong>Date:</strong>{" "}
          {new Date(event.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </div>
        <div style={{ fontSize: "0.9rem", color: "#ccc" }}>
          <strong>Time:</strong> {event.timeSlot}
        </div>
        {event.ageLimit && (
          <div style={{ fontSize: "0.9rem", color: "#ccc" }}>
            <strong>Age Limit:</strong> {event.ageLimit}
          </div>
        )}
        {error && (
          <div
            style={{
              color: "#ff4d4d",
              fontSize: "0.8rem",
              marginTop: "0.5rem",
            }}
          >
            {error}
          </div>
        )}
      </div>

      {!isPast && (
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <Link
            href={`/admin/responses/${event.id}`}
            style={{
              padding: "0.3rem 0.6rem",
              background: "#eab308",
              color: "#000",
              textDecoration: "none",
              borderRadius: "4px",
              fontSize: "0.8rem",
              fontWeight: "bold",
            }}
          >
            View Responses
          </Link>
          <Link
            href={`/admin/attendance/${event.id}`}
            style={{
              padding: "0.3rem 0.6rem",
              background: "#3b82f6",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "4px",
              fontSize: "0.8rem",
            }}
          >
            Attendance
          </Link>
          <button
            onClick={() => setIsEditing(true)}
            disabled={isPending}
            style={{
              padding: "0.3rem 0.6rem",
              background: "#444",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.8rem",
            }}
          >
            Edit
          </button>
          <button
            onClick={handleToggleActive}
            disabled={isPending}
            style={{
              padding: "0.3rem 0.6rem",
              background: event.isActive ? "#ff9900" : "#1eb53a",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "0.8rem",
            }}
          >
            {isPending ? "..." : event.isActive ? "Disable" : "Enable"}
          </button>
        </div>
      )}
    </li>
  );
}
