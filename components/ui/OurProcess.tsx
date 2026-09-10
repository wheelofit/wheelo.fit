"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

export default function OurProcess() {
  const steps = [
    { icon: "💬", title: "WHATSAPP US" },
    { icon: "ℹ️", title: "GET MORE DETAILS" },
    { icon: "📋", title: "COMPLETE FORMALITIES" },
    { icon: "📍", title: "GO FOR CLASS" },
    { icon: "🚲", title: "LEARN CYCLING" },
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.8 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  const lineVariants: Variants = {
    hidden: { scaleX: 0, originX: 0 },
    visible: {
      scaleX: 1,
      originX: 0,
      transition: { duration: 1.5, ease: "easeInOut" },
    },
  };

  return (
    <div
      style={{
        background: "var(--surface)",
        padding: "6rem 2rem",
        marginTop: "2rem",
        overflow: "hidden",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.h2
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: "3rem",
            color: "#fff",
            fontWeight: "900",
            letterSpacing: "2px",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          OUR PROCESS
        </motion.h2>

        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            width: "80px",
            height: "4px",
            background: "var(--primary)",
            margin: "0 auto 5rem auto",
            borderRadius: "2px",
          }}
        />

        <style>{`
          .process-container {
            display: flex;
            flex-direction: column;
            position: relative;
            gap: 2rem;
            padding-left: 20px;
          }
          .process-step {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 1.5rem;
            width: 100%;
          }
          .step-icon-container {
            width: 80px;
            height: 80px;
            font-size: 2rem;
            flex-shrink: 0;
          }
          .step-title {
            text-align: left;
          }
          .timeline-line-horizontal { display: none; }
          .timeline-line-vertical { display: block; }
          
          @media (min-width: 768px) {
            .process-container {
              flex-direction: row;
              justify-content: space-between;
              align-items: flex-start;
              gap: 2rem;
              padding-left: 0;
            }
            .process-step {
              flex-direction: column;
              align-items: center;
              flex: 1;
            }
            .step-icon-container {
              width: 100px;
              height: 100px;
              font-size: 2.5rem;
            }
            .step-title {
              text-align: center;
            }
            .timeline-line-horizontal { display: block !important; }
            .timeline-line-vertical { display: none !important; }
          }
        `}</style>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="process-container"
        >
          {/* Horizontal Timeline line for desktop */}
          <motion.div
            variants={lineVariants}
            style={{
              position: "absolute",
              top: "50px",
              left: "10%",
              right: "10%",
              height: "4px",
              background: "rgba(255,255,255,0.1)",
              zIndex: 1,
            }}
            className="timeline-line-horizontal"
          />

          {/* Vertical Timeline line for mobile */}
          <motion.div
            initial={{ scaleY: 0, originY: 0 }}
            whileInView={{ scaleY: 1, originY: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            style={{
              position: "absolute",
              top: "20px",
              bottom: "20px",
              left: "60px",
              width: "4px",
              background: "rgba(255,255,255,0.1)",
              zIndex: 1,
            }}
            className="timeline-line-vertical"
          />

          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              className="process-step"
              style={{ position: "relative", zIndex: 2, cursor: "pointer" }}
            >
              <motion.div
                whileHover={{
                  rotate: 10,
                  boxShadow: "0 0 25px rgba(30, 181, 58, 0.6)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 10 }}
                className="step-icon-container"
                style={{
                  borderRadius: "50%",
                  background: "var(--surface-hover)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "4px solid var(--primary)",
                  marginBottom: "1rem",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
                  transition: "background 0.3s",
                }}
              >
                {step.icon}
              </motion.div>
              <h3
                className="step-title"
                style={{
                  fontSize: "0.9rem",
                  color: "#fff",
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                }}
              >
                {step.title}
              </h3>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
