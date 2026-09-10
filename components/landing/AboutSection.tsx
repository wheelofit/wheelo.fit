"use client";

import React, { useRef, useEffect } from "react";
import { motion, useInView, animate } from "framer-motion";
import { Users, Bike, CalendarDays } from "lucide-react";

const stats = [
  { icon: Users, label: "Active members", value: 4000, suffix: "+" },
  { icon: Bike, label: "Available cycles", value: 200, suffix: "+" },
  { icon: CalendarDays, label: "Events hosted", value: 250, suffix: "+" },
];

function AnimatedNumber({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView && ref.current) {
      const controls = animate(0, value, {
        duration: 1,
        ease: "easeOut",
        onUpdate: (latest) => {
          if (ref.current) {
            ref.current.textContent = Math.round(latest).toString() + suffix;
          }
        },
      });
      return controls.stop;
    }
  }, [value, suffix, isInView]);

  return <span ref={ref}>0{suffix}</span>;
}

export function AboutSection() {
  return (
    <section
      style={{ padding: "4rem 2rem", position: "relative", overflow: "hidden" }}
    >
      {/* Background glowing effects */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "300px",
          height: "300px",
          background:
            "radial-gradient(circle, rgba(74,222,128,0.05) 0%, rgba(0,0,0,0) 70%)",
          borderRadius: "50%",
          filter: "blur(40px)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "5%",
          width: "400px",
          height: "400px",
          background:
            "radial-gradient(circle, rgba(74,222,128,0.03) 0%, rgba(0,0,0,0) 70%)",
          borderRadius: "50%",
          filter: "blur(60px)",
          zIndex: 0,
        }}
      />

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "4rem",
          }}
        >
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            style={{
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              fontWeight: "bold",
              marginBottom: "1.5rem",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
            }}
          >
            Fitness Through <span className="text-gradient">Wheels</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            style={{
              maxWidth: "800px",
              fontSize: "clamp(1rem, 4vw, 1.25rem)",
              color: "rgba(240, 247, 242, 0.8)",
              lineHeight: "1.6",
            }}
          >
            Wheelo.fit is more than a cycling brand — it’s a community built
            around learning, exploration, and unforgettable experiences. Whether
            you’re learning to ride for the first time, exploring Mumbai through
            our guided cycling tours, or renting a cycle for your personal
            rides, we bring together safety, quality, and a welcoming community
            to create experiences you’ll always remember. Every ride is about
            building confidence, making connections, and enjoying the journey.
          </motion.p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2rem",
            marginTop: "4rem",
          }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
              viewport={{ once: true }}
              style={{
                background: "rgba(255, 255, 255, 0.02)",
                border: "1px solid rgba(255, 255, 255, 0.05)",
                borderRadius: "24px",
                padding: "2.5rem",
                textAlign: "center",
                backdropFilter: "blur(10px)",
                transition: "transform 0.3s ease, background 0.3s ease",
                cursor: "default",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.02)";
              }}
            >
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(74, 222, 128, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem auto",
                }}
              >
                <stat.icon style={{ color: "#4ade80" }} size={32} />
              </div>
              <h3
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "bold",
                  marginBottom: "0.5rem",
                  color: "#fff",
                }}
              >
                <AnimatedNumber value={stat.value} suffix={stat.suffix} />
              </h3>
              <p
                style={{
                  color: "rgba(240, 247, 242, 0.6)",
                  fontSize: "1.1rem",
                }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
