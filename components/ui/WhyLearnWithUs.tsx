import React from "react";

export default function WhyLearnWithUs() {
  const features = [
    {
      icon: "📋",
      title: "One-to-One Training",
      description: "Our cycling classes are private/one to one with trainers.",
      color: "#34d399",
    },
    {
      icon: "🧰",
      title: "Safety first",
      description: "We believe learning cycling can be safe and fall-free.",
      color: "#fbbf24",
    },
    {
      icon: "🚲",
      title: "Experienced trainers",
      description:
        "Our patient instructors will guide you from basics to advance.",
      color: "#06b6d4",
    },
  ];

  return (
    <div
      style={{
        padding: "4rem 2rem",
        textAlign: "center",
        background: "transparent",
      }}
    >
      <h2
        style={{
          fontSize: "2.5rem",
          marginBottom: "3rem",
          color: "#fff",
          fontWeight: "bold",
        }}
      >
        Why learn cycling with us?
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "3rem",
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
        {features.map((feature, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div
              style={{
                width: "80px",
                height: "80px",
                borderRadius: "50%",
                background: feature.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "2.5rem",
                marginBottom: "1.5rem",
                boxShadow: `0 10px 25px ${feature.color}40`,
              }}
            >
              {feature.icon}
            </div>
            <h3
              style={{
                fontSize: "1.2rem",
                marginBottom: "1rem",
                color: "#fff",
                fontWeight: "bold",
              }}
            >
              {feature.title}
            </h3>
            <p style={{ color: "#aaa", lineHeight: "1.6" }}>
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
