"use client";
import React from "react";
import useEmblaCarousel from "embla-carousel-react";
import AutoScroll from "embla-carousel-auto-scroll";
import styles from "@/app/(main)/rides/rides.module.css";

const testimonialsData = [
  {
    name: "Rahul Desai",
    initials: "RD",
    text: "The trainers were extremely patient and professional. I learned how to ride confidently in just a few sessions. Highly recommended!",
  },
  {
    name: "Sneha K.",
    initials: "SK",
    text: "My 8-year-old was struggling with balance, but the team here made learning so fun. He now rides every day without training wheels.",
  },
  {
    name: "Amit Verma",
    initials: "AV",
    text: "Fantastic experience! The focus on safety and correct posture helped me get over my fear of riding on the main roads. Thank you!",
  },
  {
    name: "Rahul Desai",
    initials: "RD",
    text: "The trainers were extremely patient and professional. I learned how to ride confidently in just a few sessions. Highly recommended!",
  },
  {
    name: "Sneha K.",
    initials: "SK",
    text: "My 8-year-old was struggling with balance, but the team here made learning so fun. He now rides every day without training wheels.",
  },
  {
    name: "Amit Verma",
    initials: "AV",
    text: "Fantastic experience! The focus on safety and correct posture helped me get over my fear of riding on the main roads. Thank you!",
  },
];

export default function CycleClassesTestimonials() {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: true },
    [
      AutoScroll({
        playOnInit: true,
        speed: 1,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ],
  );

  return (
    <div
      style={{
        padding: "6rem 5%",
        background: "#000",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle background glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          background:
            "radial-gradient(circle, rgba(30,181,58,0.05) 0%, transparent 70%)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      ></div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <h2
          style={{
            fontSize: "clamp(1.75rem, 5vw, 2.5rem)",
            fontWeight: "bold",
            marginBottom: "3rem",
            textAlign: "center",
          }}
        >
          Our <span style={{ color: "var(--primary)" }}>Testimonials</span>
        </h2>

        <div className={styles.embla} ref={emblaRef}>
          <div className={styles.embla__container}>
            {testimonialsData.map((testimonial, i) => (
              <div key={i} className={styles.embla__slide}>
                <div
                  className={styles.testimonialCard}
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(255,255,255,0.03), rgba(0,0,0,0.5))",
                    borderRadius: "24px",
                    border: "1px solid rgba(255,255,255,0.05)",
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "4px",
                      marginBottom: "1.5rem",
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((star) => (
                      <div
                        key={star}
                        style={{ color: "#1eb53a", fontSize: "1.2rem" }}
                      >
                        ★
                      </div>
                    ))}
                  </div>
                  <p
                    style={{
                      color: "#ddd",
                      fontSize: "1.05rem",
                      fontStyle: "italic",
                      lineHeight: "1.7",
                      marginBottom: "2rem",
                      flex: 1,
                    }}
                  >
                    &quot;{testimonial.text}&quot;
                  </p>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "1rem",
                      borderTop: "1px solid rgba(255,255,255,0.1)",
                      paddingTop: "1.5rem",
                    }}
                  >
                    <div
                      style={{
                        width: "48px",
                        height: "48px",
                        borderRadius: "50%",
                        background: "rgba(30,181,58,0.1)",
                        border: "1px solid rgba(30,181,58,0.3)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#1eb53a",
                        fontWeight: "bold",
                        fontSize: "1.1rem",
                      }}
                    >
                      {testimonial.initials}
                    </div>
                    <div>
                      <div
                        style={{
                          fontWeight: "bold",
                          color: "#fff",
                          fontSize: "1.1rem",
                        }}
                      >
                        {testimonial.name}
                      </div>
                      <div
                        style={{
                          color: "rgba(255,255,255,0.5)",
                          fontSize: "0.85rem",
                        }}
                      >
                        Cycling Learner
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
