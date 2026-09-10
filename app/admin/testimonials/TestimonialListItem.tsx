"use client";

import React, { useState } from "react";
import { updateTestimonial, deleteTestimonial } from "./actions";
export interface TestimonialData {
  id: string;
  name: string;
  role: string | null;
  content: string;
  rating: number;
  avatarUrl: string | null;
  isActive: boolean;
}

export default function TestimonialListItem({
  testimonial,
}: {
  testimonial: TestimonialData;
}) {
  const [loading, setLoading] = useState(false);

  async function handleToggleStatus() {
    setLoading(true);
    try {
      await updateTestimonial(testimonial.id, {
        name: testimonial.name,
        role: testimonial.role || "",
        content: testimonial.content,
        rating: testimonial.rating,
        avatarUrl: testimonial.avatarUrl || "",
        isActive: !testimonial.isActive,
      });
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    setLoading(true);
    try {
      await deleteTestimonial(testimonial.id);
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
      setLoading(false);
    }
  }

  return (
    <li
      style={{
        padding: "1rem",
        background: "#222",
        borderRadius: "6px",
        borderLeft: testimonial.isActive
          ? "4px solid #1eb53a"
          : "4px solid #555",
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
          <h3 style={{ margin: "0 0 0.3rem 0", fontSize: "1.1rem" }}>
            {testimonial.name}{" "}
            <span style={{ fontSize: "0.8rem", color: "#ffcc00" }}>
              ({testimonial.rating}★)
            </span>
          </h3>
          <p
            style={{
              margin: "0 0 0.5rem 0",
              color: "#888",
              fontSize: "0.9rem",
            }}
          >
            {testimonial.role || "No Role"}
          </p>
          <p
            style={{
              margin: "0 0 0.5rem 0",
              color: "#ddd",
              fontSize: "0.95rem",
              fontStyle: "italic",
            }}
          >
            &quot;{testimonial.content}&quot;
          </p>
          <span
            style={{
              fontSize: "0.75rem",
              padding: "2px 6px",
              borderRadius: "4px",
              background: testimonial.isActive ? "#1eb53a33" : "#555",
              color: testimonial.isActive ? "#28d648" : "#aaa",
            }}
          >
            {testimonial.isActive ? "Active" : "Hidden"}
          </span>
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
        <button
          onClick={handleToggleStatus}
          disabled={loading}
          style={{
            padding: "0.4rem 0.8rem",
            background: testimonial.isActive ? "#444" : "#1eb53a",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          {testimonial.isActive ? "Hide" : "Show"}
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          style={{
            padding: "0.4rem 0.8rem",
            background: "#ff4d4d",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "0.8rem",
          }}
        >
          Delete
        </button>
      </div>
    </li>
  );
}
