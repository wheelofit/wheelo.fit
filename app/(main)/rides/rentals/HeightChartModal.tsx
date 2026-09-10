import React from "react";
import { X, PersonStanding } from "lucide-react";

export default function HeightChartModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  const data = [
    { height: "6.5 Ft", size: "29 Inch" },
    { height: "6.0 Ft", size: "27.5 Inch" },
    { height: "5.5 Ft", size: "26 Inch" },
    { height: "5.0 Ft", size: "24 Inch" },
    { height: "4.5 Ft", size: "20 Inch" },
    { height: "4.0 Ft", size: "16 Inch" },
    { height: "3.5 Ft", size: "14 Inch" },
    { height: "3.0 Ft", size: "12 Inch" },
    { height: "2.5 Ft", size: "-" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0,0,0,0.85)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <style>{`
        .height-modal-inner {
          background: #111;
          border-radius: 16px;
          border: 1px solid #333;
          width: 100%;
          max-width: 450px;
          max-height: 90vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }
        .height-modal-body {
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }
        .height-chart-container {
          padding: 2rem 1.5rem;
          display: flex;
          gap: 2rem;
          justify-content: center;
          align-items: stretch;
        }
        .height-chart-icon {
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          color: #1eb53a;
          padding-bottom: 10px;
        }
        .height-chart-icon svg {
          width: 120px;
          height: 120px;
        }
        .height-chart-scale {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 400px;
          width: 150px;
        }
        
        /* Mobile specific adjustments */
        @media (max-width: 400px) {
          .height-chart-container {
            gap: 1rem;
            padding: 1.5rem 1rem;
          }
          .height-chart-icon svg {
            width: 80px;
            height: 80px;
          }
          .height-chart-scale {
            width: 130px;
            height: 350px;
          }
          .height-chart-scale-text {
            font-size: 0.75rem !important;
          }
        }
        
        /* Mobile landscape adjustments */
        @media (max-height: 600px) {
          .height-chart-container {
            padding: 1rem;
          }
          .height-chart-scale {
            height: 250px;
          }
          .height-chart-icon svg {
            width: 70px;
            height: 70px;
          }
        }
      `}</style>

      <div className="height-modal-inner" onClick={(e) => e.stopPropagation()}>
        {/* Header - Fixed */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "1.2rem 1.5rem",
            borderBottom: "1px solid #222",
            flexShrink: 0,
          }}
        >
          <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#fff" }}>
            Height & Size Guide
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "#222",
              border: "none",
              color: "#ccc",
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="height-modal-body">
          <div className="height-chart-container">
            <div className="height-chart-icon">
              <PersonStanding strokeWidth={1} />
            </div>

            <div className="height-chart-scale">
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "2px",
                  height: "100%",
                  background: "#333",
                }}
              ></div>

              {data.map((item, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "relative",
                    zIndex: 1,
                  }}
                >
                  <div
                    className="height-chart-scale-text"
                    style={{
                      width: "40%",
                      textAlign: "right",
                      color: "#aaa",
                      fontSize: "0.85rem",
                    }}
                  >
                    {item.height}
                  </div>

                  {/* Tick mark */}
                  <div
                    style={{
                      width: "12px",
                      height: "2px",
                      background: "#1eb53a",
                      borderRadius: "2px",
                    }}
                  ></div>

                  <div
                    className="height-chart-scale-text"
                    style={{
                      width: "40%",
                      textAlign: "left",
                      color: "#fff",
                      fontSize: "0.85rem",
                      fontWeight: "bold",
                    }}
                  >
                    {item.size !== "-" ? item.size : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              background: "#1a1a1a",
              padding: "1.5rem",
              borderTop: "1px solid #222",
            }}
          >
            <h4
              style={{
                color: "#1eb53a",
                margin: "0 0 0.5rem 0",
                fontSize: "0.95rem",
              }}
            >
              Please note:
            </h4>
            <p
              style={{
                color: "#888",
                fontSize: "0.85rem",
                margin: "0 0 0.25rem 0",
              }}
            >
              <strong style={{ color: "#ccc" }}>Step 1.</strong> Note your
              height on the left side of the scale.
            </p>
            <p
              style={{
                color: "#888",
                fontSize: "0.85rem",
                margin: "0 0 0.25rem 0",
              }}
            >
              <strong style={{ color: "#ccc" }}>Step 2.</strong> Check the
              closest tyre size to your height on the right side.
            </p>
            <p
              style={{
                color: "#1eb53a",
                fontSize: "0.85rem",
                margin: "0.5rem 0 0 0",
                fontWeight: "bold",
              }}
            >
              That&apos;s your ideal cycle size!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
