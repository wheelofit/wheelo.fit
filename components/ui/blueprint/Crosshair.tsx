import React from "react";

interface CrosshairProps {
  position?:
    "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  size?: number;
  color?: string;
}

export function Crosshair({
  position = "center",
  size = 12,
  color = "var(--primary)",
}: CrosshairProps) {
  const getStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: position === "center" ? "relative" : "absolute",
      width: size,
      height: size,
      color,
      pointerEvents: "none",
      zIndex: 10,
      opacity: 0.7,
    };

    switch (position) {
      case "top-left":
        return {
          ...baseStyle,
          top: 0,
          left: 0,
          transform: "translate(-50%, -50%)",
        };
      case "top-right":
        return {
          ...baseStyle,
          top: 0,
          right: 0,
          transform: "translate(50%, -50%)",
        };
      case "bottom-left":
        return {
          ...baseStyle,
          bottom: 0,
          left: 0,
          transform: "translate(-50%, 50%)",
        };
      case "bottom-right":
        return {
          ...baseStyle,
          bottom: 0,
          right: 0,
          transform: "translate(50%, 50%)",
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div style={getStyle()}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line
          x1="6"
          y1="0"
          x2="6"
          y2="12"
          stroke="currentColor"
          strokeWidth="1"
        />
        <line
          x1="0"
          y1="6"
          x2="12"
          y2="6"
          stroke="currentColor"
          strokeWidth="1"
        />
        <circle cx="6" cy="6" r="3" stroke="currentColor" strokeWidth="0.5" />
      </svg>
    </div>
  );
}
