"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
const CycleClassForm = dynamic(() => import("./CycleClassForm"), {
  ssr: false,
});

export default function EnquireModalFAB() {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Global styles for this component */}
      <style>{`
        .modal-no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .modal-no-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          background: "var(--primary, #1eb53a)",
          color: "#fff",
          border: "none",
          borderRadius: "50px",
          padding: "16px 24px",
          fontSize: "1.1rem",
          fontWeight: "bold",
          cursor: "pointer",
          boxShadow: "0 10px 25px rgba(30,181,58,0.4)",
          zIndex: 90,
          display: "flex",
          alignItems: "center",
          gap: "10px",
          transition: "transform 0.2s, box-shadow 0.2s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "0 15px 35px rgba(30,181,58,0.5)";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 10px 25px rgba(30,181,58,0.4)";
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
        Enquire Now
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(5px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          {/* Modal Content Box */}
          <div
            className="modal-no-scrollbar"
            data-lenis-prevent
            style={{
              background: "#111",
              borderRadius: "24px",
              width: "100%",
              maxWidth: "500px",
              maxHeight: "90vh",
              overflowY: "auto",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
              position: "relative",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              style={{
                position: "absolute",
                top: "15px",
                right: "15px",
                background: "rgba(255,255,255,0.1)",
                border: "none",
                color: "#fff",
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                zIndex: 2,
                transition: "background 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.2)")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
              }
            >
              ✕
            </button>

            {/* The actual form inside the modal */}
            <CycleClassForm />
          </div>
        </div>
      )}
    </>
  );
}
