import React from "react";

interface DimensionLineProps {
  label: string;
  width?: string;
  color?: string;
  className?: string;
}

export function DimensionLine({
  label,
  width = "100%",
  color = "var(--primary)",
  className = "",
}: DimensionLineProps) {
  return (
    <div
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        opacity: 0.8,
        width,
        color,
      }}
    >
      <svg
        width="8"
        height="12"
        viewBox="0 0 8 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M 8 0 L 0 6 L 8 12" stroke="currentColor" strokeWidth="1.5" />
        <line
          x1="1"
          y1="0"
          x2="1"
          y2="12"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>

      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          padding: "0 8px",
        }}
      >
        <div style={{ flex: 1, height: "1px", background: "currentColor" }} />
        <span
          style={{
            padding: "0 12px",
            fontSize: "12px",
            fontFamily: "monospace",
            letterSpacing: "0.05em",
          }}
        >
          {label}
        </span>
        <div style={{ flex: 1, height: "1px", background: "currentColor" }} />
      </div>

      <svg
        width="8"
        height="12"
        viewBox="0 0 8 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M 0 0 L 8 6 L 0 12" stroke="currentColor" strokeWidth="1.5" />
        <line
          x1="7"
          y1="0"
          x2="7"
          y2="12"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}
