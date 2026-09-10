"use client";

import React, { useState, useEffect } from "react";
import { getCycleAvailabilityMap } from "./actions";
import styles from "@/components/ui/BookingForm.module.css";

import { CycleData } from "@/app/(main)/rides/rentals/RentalsView";

export default function RentalBookingForm({
  cycles,
  preselectedCycleId,
  onCancel,
}: {
  cycles: CycleData[];
  preselectedCycleId?: string;
  onCancel?: () => void;
}) {
  const [step, setStep] = useState(preselectedCycleId ? 2 : 1);
  const [selectedCycleId, setSelectedCycleId] = useState(
    preselectedCycleId || "",
  );
  const [availabilityMap, setAvailabilityMap] = useState<
    Record<string, number>
  >({});

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [selectedPricing, setSelectedPricing] = useState<
    CycleData["pricing"][0] | null
  >(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");

  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (preselectedCycleId) {
      Promise.resolve().then(() => {
        setSelectedCycleId(preselectedCycleId);
        setStep(2);
      });
    }
  }, [preselectedCycleId]);

  useEffect(() => {
    if (selectedCycleId) {
      getCycleAvailabilityMap(selectedCycleId, currentMonth, currentYear).then(
        (res) => {
          if (res) setAvailabilityMap(res);
        },
      );
    }
  }, [selectedCycleId, currentMonth, currentYear]);

  // Reset selections when cycle changes
  useEffect(() => {
    if (selectedCycleId) {
      Promise.resolve().then(() => {
        setSelectedPricing(null);
        setQuantity(1);
        setSelectedDate("");
      });
    }
  }, [selectedCycleId]);

  const selectedCycle = cycles.find((c) => c.id === selectedCycleId);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDate || !selectedPricing || !selectedCycleId) return;

    setPending(true);
    setMessage(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.append("type", "rental");
    formData.append("cycleId", selectedCycleId);
    formData.append("startDate", selectedDate);
    formData.append("durationValue", selectedPricing.durationValue.toString());
    formData.append("durationUnit", selectedPricing.durationUnit);
    formData.append("quantity", quantity.toString());
    formData.append("price", selectedPricing.price.toString());

    try {
      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        body: formData,
      });

      const res = await response.json();

      if (!response.ok || res.error) {
        setMessage({
          type: "error",
          text: res.error || "Payment initiation failed",
        });
      } else if (res.success && res.redirectUrl) {
        // Redirect to PhonePe or Success Page
        window.location.href = res.redirectUrl;
      }
    } catch {
      setMessage({ type: "error", text: "An unexpected error occurred." });
    }

    setPending(false);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className={styles.calendarDayEmpty}></div>,
      );
    }

    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(currentYear, currentMonth, d);
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isPast = dateObj < today;

      let minAvailForDuration = availabilityMap[dateStr] || 0;
      // If a package is selected, find the minimum availability across the whole duration
      if (selectedPricing && minAvailForDuration > 0) {
        // Approximate days if MONTHS (assuming 30 days per month)
        const durationDays =
          selectedPricing.durationUnit === "MONTHS"
            ? selectedPricing.durationValue * 30
            : selectedPricing.durationValue;
        for (let i = 0; i < durationDays; i++) {
          const dt = new Date(dateObj);
          dt.setDate(dt.getDate() + i);
          const dStr = new Date(dt.getTime() - dt.getTimezoneOffset() * 60000)
            .toISOString()
            .split("T")[0];

          if (availabilityMap[dStr] !== undefined) {
            minAvailForDuration = Math.min(
              minAvailForDuration,
              availabilityMap[dStr],
            );
          }
        }
      }

      let isSelected = false;
      let isInRange = false;
      let isRangeEnd = false;

      if (selectedDate && selectedPricing) {
        const start = new Date(selectedDate);
        const durationDays =
          selectedPricing.durationUnit === "MONTHS"
            ? selectedPricing.durationValue * 30
            : selectedPricing.durationValue;

        const end = new Date(start);
        end.setDate(end.getDate() + durationDays - 1);

        const current = new Date(dateStr);
        if (dateStr === selectedDate) {
          isSelected = true;
        } else if (current > start && current < end) {
          isInRange = true;
        } else if (current.getTime() === end.getTime()) {
          isRangeEnd = true;
        }
      }

      const isAvailable = minAvailForDuration >= quantity;

      let bgColor = "#222";
      let cursor = "default";
      let opacity = 1;

      if (isPast) {
        opacity = 0.3;
      } else if (availabilityMap[dateStr] !== undefined) {
        if (isAvailable) {
          bgColor =
            isSelected || isInRange || isRangeEnd ? "#1eb53a" : "#1eb53a44";
          cursor = "pointer";
        } else {
          bgColor = "#ff4d4d44";
          opacity = 0.5;
        }
      }

      days.push(
        <div
          className="calendar-cell"
          key={d}
          onClick={() => {
            if (!isPast && isAvailable) setSelectedDate(dateStr);
          }}
          style={{
            background: bgColor,
            opacity,
            cursor,
            textAlign: "center",
            borderRadius: "4px",
            border:
              isSelected || isInRange || isRangeEnd
                ? "2px solid #fff"
                : "1px solid #444",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <span style={{ fontWeight: "bold" }}>{d}</span>
          {!isPast && availabilityMap[dateStr] !== undefined && (
            <span
              className="calendar-status-text"
              style={{
                color: isAvailable
                  ? isSelected || isInRange || isRangeEnd
                    ? "#fff"
                    : "#1eb53a"
                  : "#ff4d4d",
              }}
            >
              {isAvailable ? "Available" : "Sold out"}
            </span>
          )}
        </div>,
      );
    }

    return (
      <div
        style={{
          background: "#1a1a1a",
          padding: "1rem",
          borderRadius: "8px",
          border: "1px solid #333",
          overflow: "hidden",
        }}
      >
        <style>{`
          .calendar-grid {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            gap: 0.5rem;
            width: 100%;
          }
          .calendar-cell {
            padding: 0.6rem 0.2rem;
            min-width: 0;
            word-wrap: break-word;
          }
          .calendar-status-text {
            font-size: 0.7rem;
            margin-top: 4px;
            display: block;
            word-break: break-word;
            line-height: 1;
          }
          @media (max-width: 480px) {
            .calendar-grid {
              gap: 2px;
            }
            .calendar-cell {
              padding: 0.4rem 0;
            }
            .calendar-status-text {
              font-size: 0.45rem;
              letter-spacing: -0.5px;
              margin-top: 2px;
            }
          }
          @media (max-width: 380px) {
            .calendar-status-text {
              font-size: 0.4rem;
              letter-spacing: -0.5px;
            }
          }
        `}</style>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
          }}
        >
          <button
            type="button"
            onClick={prevMonth}
            style={{
              background: "#333",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            &larr;
          </button>
          <h3 style={{ margin: 0 }}>
            {new Date(currentYear, currentMonth).toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <button
            type="button"
            onClick={nextMonth}
            style={{
              background: "#333",
              color: "#fff",
              border: "none",
              padding: "0.5rem 1rem",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            &rarr;
          </button>
        </div>
        <div className="calendar-grid">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div
              key={day}
              style={{
                textAlign: "center",
                color: "#888",
                fontSize: "0.8rem",
                fontWeight: "bold",
                paddingBottom: "0.5rem",
              }}
            >
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  if (cycles.length === 0) {
    return (
      <p style={{ textAlign: "center", color: "#888" }}>
        No cycles available for rent currently.
      </p>
    );
  }

  const stepsToRender = preselectedCycleId ? [2, 3, 4] : [1, 2, 3, 4];

  return (
    <div
      className={styles.formContainer}
      style={{
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
        background: "#111",
        padding: "2rem",
        borderRadius: "12px",
        border: "1px solid #333",
      }}
    >
      {preselectedCycleId && onCancel && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <h3 style={{ margin: 0, color: "#fff" }}>
            Book: {selectedCycle?.type}
          </h3>
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: "transparent",
              border: "none",
              color: "#888",
              fontSize: "1.5rem",
              cursor: "pointer",
            }}
          >
            &times;
          </button>
        </div>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "2rem",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "15px",
            left: "16px",
            right: "16px",
            height: "2px",
            background: "#333",
            zIndex: 0,
          }}
        >
          <div
            style={{
              width:
                stepsToRender.length > 1
                  ? `${(stepsToRender.indexOf(step) / (stepsToRender.length - 1)) * 100}%`
                  : "0%",
              height: "100%",
              background: "#1eb53a",
              transition: "width 0.3s ease",
            }}
          ></div>
        </div>
        {stepsToRender.map((s, index) => (
          <div
            key={s}
            style={{
              zIndex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
              background: "#111",
              padding: "0 0.5rem",
            }}
          >
            <div
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: step >= s ? "#1eb53a" : "#222",
                color: step >= s ? "#fff" : "#888",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                border: `2px solid ${step >= s ? "#1eb53a" : "#444"}`,
                transition: "all 0.3s ease",
              }}
            >
              {step > s ? "✓" : index + 1}
            </div>
            <span
              style={{ fontSize: "0.8rem", color: step >= s ? "#fff" : "#888" }}
            >
              {s === 1
                ? "Cycle"
                : s === 2
                  ? "Package"
                  : s === 3
                    ? "Date"
                    : "Details"}
            </span>
          </div>
        ))}
      </div>

      {message && (
        <div
          style={{
            padding: "1rem",
            marginBottom: "1.5rem",
            borderRadius: "6px",
            background: message.type === "error" ? "#ff4d4d22" : "#1eb53a22",
            color: message.type === "error" ? "#ff4d4d" : "#1eb53a",
            border: `1px solid ${message.type === "error" ? "#ff4d4d" : "#1eb53a"}`,
          }}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {step === 1 && !preselectedCycleId && (
          <div className="step-content">
            <h3 style={{ marginBottom: "1rem", color: "#fff" }}>
              Choose your ride
            </h3>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {cycles.map((c) => (
                <label
                  key={c.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    padding: "1rem",
                    background: selectedCycleId === c.id ? "#1eb53a22" : "#222",
                    border: `1px solid ${selectedCycleId === c.id ? "#1eb53a" : "#444"}`,
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="cycleSelection"
                    checked={selectedCycleId === c.id}
                    onChange={() => setSelectedCycleId(c.id)}
                  />
                  <span
                    style={{
                      fontWeight: "bold",
                      fontSize: "1.1rem",
                      color: "#fff",
                    }}
                  >
                    {c.type}
                  </span>
                </label>
              ))}
            </div>
            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!selectedCycleId}
                className={styles.submitBtn}
                style={{
                  width: "auto",
                  padding: "0.8rem 2rem",
                  opacity: !selectedCycleId ? 0.5 : 1,
                }}
              >
                Next &rarr;
              </button>
            </div>
          </div>
        )}

        {step === 2 && selectedCycle && (
          <div className="step-content">
            <h3 style={{ marginBottom: "1rem", color: "#fff" }}>
              Select Package
            </h3>
            <div className={styles.field}>
              <label className={styles.label}>Pricing Package</label>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {selectedCycle.pricing.map(
                  (p: CycleData["pricing"][0], i: number) => {
                    const isSelected =
                      selectedPricing?.durationValue === p.durationValue &&
                      selectedPricing?.durationUnit === p.durationUnit;
                    return (
                      <div
                        key={i}
                        onClick={() => setSelectedPricing(p)}
                        style={{
                          padding: "1rem",
                          background: isSelected ? "#1eb53a" : "#222",
                          color: isSelected ? "#fff" : "#ccc",
                          borderRadius: "6px",
                          cursor: "pointer",
                          border: "1px solid #444",
                          flex: "1 1 120px",
                          textAlign: "center",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: "bold",
                            marginBottom: "0.2rem",
                            fontSize: "1.1rem",
                          }}
                        >
                          {p.durationLabel}
                        </div>
                        <div>
                          ₹{p.price}
                          {p.durationUnit === "MONTHS"
                            ? "/month"
                            : p.durationUnit === "DAYS"
                              ? "/day"
                              : ""}
                        </div>
                      </div>
                    );
                  },
                )}
              </div>
            </div>

            {selectedPricing && (
              <div className={styles.field} style={{ marginTop: "1.5rem" }}>
                <label className={styles.label}>Quantity (Cycles)</label>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    background: "#222",
                    padding: "0.5rem",
                    borderRadius: "8px",
                    border: "1px solid #444",
                    width: "fit-content",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    style={{
                      background: "#333",
                      color: "#fff",
                      border: "none",
                      width: "40px",
                      height: "40px",
                      borderRadius: "6px",
                      fontSize: "1.2rem",
                      cursor: "pointer",
                    }}
                  >
                    -
                  </button>
                  <span
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      width: "40px",
                      textAlign: "center",
                      color: "#fff",
                    }}
                  >
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setQuantity(
                        Math.min(selectedCycle.quantity, quantity + 1),
                      )
                    }
                    disabled={quantity >= selectedCycle.quantity}
                    style={{
                      background:
                        quantity >= selectedCycle.quantity ? "#222" : "#333",
                      color:
                        quantity >= selectedCycle.quantity ? "#555" : "#fff",
                      border: "none",
                      width: "40px",
                      height: "40px",
                      borderRadius: "6px",
                      fontSize: "1.2rem",
                      cursor:
                        quantity >= selectedCycle.quantity
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    +
                  </button>
                </div>
                <input type="hidden" name="quantity" value={quantity} />
              </div>
            )}

            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              {!preselectedCycleId && (
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    background: "#333",
                    color: "#fff",
                    border: "none",
                    padding: "0.8rem 1.5rem",
                    borderRadius: "6px",
                    cursor: "pointer",
                  }}
                >
                  &larr; Back
                </button>
              )}
              {preselectedCycleId && <div></div>}
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!selectedPricing}
                className={styles.submitBtn}
                style={{
                  width: "auto",
                  padding: "0.8rem 2rem",
                  opacity: !selectedPricing ? 0.5 : 1,
                }}
              >
                Next &rarr;
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="step-content">
            <h3 style={{ marginBottom: "1rem", color: "#fff" }}>
              Select Start Date
            </h3>
            <p
              style={{
                color: "#888",
                marginBottom: "1rem",
                fontSize: "0.9rem",
              }}
            >
              Showing availability for {quantity} cycle(s) over{" "}
              {selectedPricing?.durationLabel}.
            </p>
            {renderCalendar()}
            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <button
                type="button"
                onClick={() => setStep(2)}
                style={{
                  background: "#333",
                  color: "#fff",
                  border: "none",
                  padding: "0.8rem 1.5rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                &larr; Back
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                disabled={!selectedDate}
                className={styles.submitBtn}
                style={{
                  width: "auto",
                  padding: "0.8rem 2rem",
                  opacity: !selectedDate ? 0.5 : 1,
                }}
              >
                Next &rarr;
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="step-content">
            <h3 style={{ marginBottom: "1rem", color: "#fff" }}>
              Contact Details
            </h3>
            <div className={styles.field}>
              <label className={styles.label}>Full Name</label>
              <input
                type="text"
                name="name"
                required
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                type="email"
                name="email"
                required
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Phone</label>
              <input
                type="tel"
                name="phone"
                required
                className={styles.input}
              />
            </div>

            {selectedPricing && (
              <div
                style={{
                  marginTop: "2rem",
                  padding: "1.5rem",
                  background: "#222",
                  borderRadius: "8px",
                  border: "1px solid #444",
                }}
              >
                <h4 style={{ margin: "0 0 1rem 0", color: "#fff" }}>
                  Payment Summary
                </h4>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "0.5rem",
                    color: "#ccc",
                  }}
                >
                  <span>
                    Rental Fee (₹{selectedPricing.price} ×{" "}
                    {selectedPricing.durationValue}{" "}
                    {selectedPricing.durationUnit.toLowerCase()} × {quantity}{" "}
                    cycles)
                  </span>
                  <span>
                    ₹
                    {selectedPricing.price *
                      selectedPricing.durationValue *
                      quantity}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "1rem",
                    color: "#ccc",
                  }}
                >
                  <span>
                    Refundable Security Deposit (₹1000 × {quantity} cycles)
                  </span>
                  <span>₹{1000 * quantity}</span>
                </div>
                <div
                  style={{
                    borderTop: "1px solid #444",
                    paddingTop: "1rem",
                    display: "flex",
                    justifyContent: "space-between",
                    fontWeight: "bold",
                    color: "#1eb53a",
                    fontSize: "1.2rem",
                  }}
                >
                  <span>Total Amount</span>
                  <span>
                    ₹
                    {selectedPricing.price *
                      selectedPricing.durationValue *
                      quantity +
                      1000 * quantity}
                  </span>
                </div>
                <p
                  style={{
                    margin: "1rem 0 0 0",
                    fontSize: "0.8rem",
                    color: "#888",
                  }}
                >
                  * The security deposit will be automatically refunded to your
                  original payment method when the cycle is returned.
                </p>
              </div>
            )}

            <div
              style={{
                marginTop: "2rem",
                display: "flex",
                flexWrap: "wrap-reverse",
                gap: "1rem",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <button
                type="button"
                onClick={() => setStep(3)}
                style={{
                  background: "#333",
                  color: "#fff",
                  border: "none",
                  padding: "0.8rem 1.5rem",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                &larr; Back
              </button>
              <button
                type="submit"
                disabled={pending}
                className={styles.submitBtn}
                style={{
                  width: "auto",
                  padding: "0.8rem 2rem",
                  opacity: pending ? 0.5 : 1,
                  cursor: pending ? "not-allowed" : "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                {pending ? (
                  <>
                    <span className="btn-spinner"></span> Booking...
                  </>
                ) : !selectedCycle?.isInstock ? (
                  "Confirm Pre-Booking"
                ) : (
                  "Confirm Rental Booking"
                )}
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
