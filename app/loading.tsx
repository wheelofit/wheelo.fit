"use client";
import React from "react";

export default function Loading() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        gap: "1.5rem",
        backgroundColor: "var(--background)",
      }}
    >
      <style>{`
        @keyframes spin-wheel {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .loading-wheel {
          animation: spin-wheel 1s linear infinite;
        }
        .wheel-group-back {
          transform-origin: 35px 45px;
        }
        .wheel-group-front {
          transform-origin: 85px 45px;
        }
      `}</style>
      <svg
        width="120"
        height="80"
        viewBox="0 0 120 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Frame */}
        <path
          d="M 35 45 L 60 45 L 50 20 Z"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M 50 20 L 80 20 L 60 45 Z"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinejoin="round"
        />
        <path
          d="M 80 20 L 85 45"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Seat */}
        <path
          d="M 50 20 L 45 10"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 40 10 L 52 10"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Handlebars */}
        <path
          d="M 80 20 L 78 12"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path
          d="M 72 10 L 82 14"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Back Wheel */}
        <g className="loading-wheel wheel-group-back">
          <circle
            cx="35"
            cy="45"
            r="16"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
          />
          <circle cx="35" cy="45" r="3" fill="currentColor" />
          <line
            x1="35"
            y1="29"
            x2="35"
            y2="61"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="19"
            y1="45"
            x2="51"
            y2="45"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="23.68"
            y1="33.68"
            x2="46.32"
            y2="56.32"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="23.68"
            y1="56.32"
            x2="46.32"
            y2="33.68"
            stroke="currentColor"
            strokeWidth="1"
          />
        </g>

        {/* Front Wheel */}
        <g className="loading-wheel wheel-group-front">
          <circle
            cx="85"
            cy="45"
            r="16"
            stroke="currentColor"
            strokeWidth="3"
            fill="transparent"
          />
          <circle cx="85" cy="45" r="3" fill="currentColor" />
          <line
            x1="85"
            y1="29"
            x2="85"
            y2="61"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="69"
            y1="45"
            x2="101"
            y2="45"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="73.68"
            y1="33.68"
            x2="96.32"
            y2="56.32"
            stroke="currentColor"
            strokeWidth="1"
          />
          <line
            x1="73.68"
            y1="56.32"
            x2="96.32"
            y2="33.68"
            stroke="currentColor"
            strokeWidth="1"
          />
        </g>
      </svg>
    </div>
  );
}
