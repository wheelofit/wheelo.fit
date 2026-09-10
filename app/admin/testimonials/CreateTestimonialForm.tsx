"use client";

import React, { useState } from "react";
import { createTestimonial } from "./actions";

export default function CreateTestimonialForm() {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState("5");
  const [isActive, setIsActive] = useState(true);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await createTestimonial({
        name,
        role,
        content,
        rating: parseInt(rating),
        isActive,
      });
      setName("");
      setRole("");
      setContent("");
      setRating("5");
      setIsActive(true);
      alert("Testimonial created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create testimonial.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
    >
      <div>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Name *
        </label>
        <input
          required
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "4px",
            border: "1px solid #333",
            background: "#222",
            color: "#fff",
          }}
          placeholder="John Doe"
        />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Role (Optional)
        </label>
        <input
          type="text"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "4px",
            border: "1px solid #333",
            background: "#222",
            color: "#fff",
          }}
          placeholder="Avid Cyclist"
        />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Testimonial *
        </label>
        <textarea
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "4px",
            border: "1px solid #333",
            background: "#222",
            color: "#fff",
            fontFamily: "inherit",
          }}
          rows={4}
          placeholder="This was the best experience of my life..."
        />
      </div>
      <div>
        <label style={{ display: "block", marginBottom: "0.5rem" }}>
          Rating
        </label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          style={{
            width: "100%",
            padding: "0.8rem",
            borderRadius: "4px",
            border: "1px solid #333",
            background: "#222",
            color: "#fff",
          }}
        >
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
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
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
          />
          Active (Visible on public website)
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: "0.5rem",
          padding: "0.8rem",
          background: "#fff",
          color: "#000",
          border: "none",
          borderRadius: "4px",
          fontWeight: "bold",
          cursor: loading ? "not-allowed" : "pointer",
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? "Saving..." : "Add Testimonial"}
      </button>
    </form>
  );
}
