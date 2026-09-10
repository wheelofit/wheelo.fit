import React from "react";
import { getTestimonials } from "./actions";
import CreateTestimonialForm from "./CreateTestimonialForm";
import TestimonialListItem from "./TestimonialListItem";
import styles from "../admin.module.css";

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Manage Testimonials</h1>
      <p style={{ color: "#aaa", marginBottom: "2rem" }}>
        Add and manage client testimonials. Active testimonials will be visible
        on the public landing page.
      </p>

      <div className={styles.twoColumnGrid}>
        <div
          style={{
            background: "#1a1a1a",
            padding: "2rem",
            borderRadius: "8px",
            border: "1px solid #333",
          }}
        >
          <h2
            style={{ marginTop: 0, marginBottom: "1.5rem", fontSize: "1.2rem" }}
          >
            Add New Testimonial
          </h2>
          <CreateTestimonialForm />
        </div>

        <div
          style={{
            background: "#1a1a1a",
            padding: "2rem",
            borderRadius: "8px",
            border: "1px solid #333",
          }}
        >
          <h2
            style={{ marginTop: 0, marginBottom: "1.5rem", fontSize: "1.2rem" }}
          >
            All Testimonials
          </h2>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            {testimonials.length === 0 ? (
              <p style={{ color: "#888" }}>No testimonials added yet.</p>
            ) : (
              testimonials.map(
                (
                  testimonial: import("./TestimonialListItem").TestimonialData,
                ) => (
                  <TestimonialListItem
                    key={testimonial.id}
                    testimonial={testimonial}
                  />
                ),
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
