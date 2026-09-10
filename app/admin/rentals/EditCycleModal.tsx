"use client";

import React, { useState } from "react";
import { updateRentalCycle } from "./actions";

export interface PricingOption {
  durationLabel: string;
  durationValue: number;
  durationUnit: string;
  price: number;
  label?: string;
  value?: number;
  unit?: string;
}

export interface CycleData {
  id: string;
  type: string;
  quantity: number;
  category?: string | null;
  tyreSize?: string | null;
  speed?: string | null;
  bikeType?: string | null;
  brakes?: string | null;
  imageUrl?: string | null;
  isActive: boolean;
  pricing: PricingOption[];
}

export default function EditCycleModal({
  cycle,
  onClose,
}: {
  cycle: CycleData;
  onClose: () => void;
}) {
  const [pricingOptions, setPricingOptions] = useState<PricingOption[]>(() => {
    const defaultOptions = [
      {
        label: "1 Month",
        value: 1,
        unit: "MONTHS",
        price: 1400,
        durationLabel: "1 Month",
        durationValue: 1,
        durationUnit: "MONTHS",
      },
      {
        label: "3 Months",
        value: 3,
        unit: "MONTHS",
        price: 1200,
        durationLabel: "3 Months",
        durationValue: 3,
        durationUnit: "MONTHS",
      },
      {
        label: "6 Months",
        value: 6,
        unit: "MONTHS",
        price: 999,
        durationLabel: "6 Months",
        durationValue: 6,
        durationUnit: "MONTHS",
      },
    ];

    if (!cycle.pricing || cycle.pricing.length === 0) return defaultOptions;

    return defaultOptions.map((def) => {
      const existing = cycle.pricing.find(
        (p) => p.durationValue === def.value && p.durationUnit === def.unit,
      );
      return existing ? { ...def, price: existing.price } : def;
    });
  });
  const [pending, setPending] = useState(false);

  const handlePricingChange = (
    index: number,
    field: string,
    val: string | number,
  ) => {
    const newOptions = [...pricingOptions];
    newOptions[index] = { ...newOptions[index], [field]: val };
    setPricingOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    await updateRentalCycle(cycle.id, formData);
    setPending(false);
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.8)",
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        overflowY: "auto",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "600px",
          margin: "auto",
          background: "#111",
          padding: "2rem",
          borderRadius: "12px",
          border: "1px solid #333",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "1rem",
            right: "1rem",
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "1.5rem",
            cursor: "pointer",
          }}
        >
          &times;
        </button>
        <h2 style={{ marginTop: 0, color: "#1eb53a" }}>
          Edit Cycle: {cycle.type}
        </h2>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginTop: "1.5rem",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#ccc",
              }}
            >
              Cycle Type (e.g., Mountain Bike)
            </label>
            <input
              type="text"
              name="type"
              defaultValue={cycle.type}
              required
              style={{
                width: "100%",
                padding: "0.8rem",
                borderRadius: "4px",
                border: "1px solid #444",
                background: "#222",
                color: "#fff",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#ccc",
              }}
            >
              Category
            </label>
            <select
              name="category"
              defaultValue={cycle.category || "Gear"}
              required
              style={{
                width: "100%",
                padding: "0.8rem",
                borderRadius: "4px",
                border: "1px solid #444",
                background: "#222",
                color: "#fff",
              }}
            >
              <option value="Non Gear">Non Gear</option>
              <option value="Gear">Gear</option>
              <option value="Premium">Premium</option>
              <option value="Kids">Kids</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 200px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#ccc",
                }}
              >
                Tyre Size
              </label>
              <select
                name="tyreSize"
                defaultValue={cycle.tyreSize || "26 Inches (5'0 - 6'6)"}
                required
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  borderRadius: "4px",
                  border: "1px solid #444",
                  background: "#222",
                  color: "#fff",
                }}
              >
                <option value="14 Inches (3'0 - 3'6)">
                  14 Inches (3&apos;0 - 3&apos;6)
                </option>
                <option value="16 Inches (3'6 - 3'1)">
                  16 Inches (3&apos;6 - 3&apos;1)
                </option>
                <option value="20 Inches (4'0 - 4'7)">
                  20 Inches (4&apos;0 - 4&apos;7)
                </option>
                <option value="24 Inches (4'6 - 5'2)">
                  24 Inches (4&apos;6 - 5&apos;2)
                </option>
                <option value="26 Inches (5'0 - 6'6)">
                  26 Inches (5&apos;0 - 6&apos;6)
                </option>
                <option value="27.5 Inches (5'4 - 6'2)">
                  27.5 Inches (5&apos;4 - 6&apos;2)
                </option>
                <option value="29 Inches (5'8 - 6'4)">
                  29 Inches (5&apos;8 - 6&apos;4)
                </option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#ccc",
                }}
              >
                Speed
              </label>
              <select
                name="speed"
                defaultValue={cycle.speed || "Single Speed"}
                required
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  borderRadius: "4px",
                  border: "1px solid #444",
                  background: "#222",
                  color: "#fff",
                }}
              >
                <option value="Single Speed">Single Speed</option>
                <option value="7 (1x7) Gears">7 (1x7) Gears</option>
                <option value="8 (1x8) Gears">8 (1x8) Gears</option>
                <option value="9 (1x9) Gears">9 (1x9) Gears</option>
                <option value="14 (2x7) Gears">14 (2x7) Gears</option>
                <option value="21 (3x7) Gears">21 (3x7) Gears</option>
              </select>
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ flex: "1 1 200px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#ccc",
                }}
              >
                Bike Type
              </label>
              <select
                name="bikeType"
                defaultValue={cycle.bikeType || "MTB"}
                required
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  borderRadius: "4px",
                  border: "1px solid #444",
                  background: "#222",
                  color: "#fff",
                }}
              >
                <option value="MTB">MTB</option>
                <option value="Hybrid">Hybrid</option>
                <option value="Road Bike">Road Bike</option>
                <option value="Kids">Kids</option>
              </select>
            </div>

            <div style={{ flex: 1 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  color: "#ccc",
                }}
              >
                Brakes
              </label>
              <select
                name="brakes"
                defaultValue={cycle.brakes || "Power"}
                required
                style={{
                  width: "100%",
                  padding: "0.8rem",
                  borderRadius: "4px",
                  border: "1px solid #444",
                  background: "#222",
                  color: "#fff",
                }}
              >
                <option value="Power">Power</option>
                <option value="Disc">Disc</option>
                <option value="Hydraulic">Hydraulic</option>
              </select>
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#ccc",
              }}
            >
              Total Quantity Available
            </label>
            <input
              type="number"
              name="quantity"
              defaultValue={cycle.quantity}
              min="0"
              required
              style={{
                width: "100%",
                padding: "0.8rem",
                borderRadius: "4px",
                border: "1px solid #444",
                background: "#222",
                color: "#fff",
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: "block",
                marginBottom: "0.5rem",
                color: "#ccc",
              }}
            >
              Cycle Image (leave blank to keep current)
            </label>
            <input
              type="file"
              name="image"
              accept="image/*"
              style={{
                width: "100%",
                padding: "0.8rem",
                borderRadius: "4px",
                border: "1px solid #444",
                background: "#222",
                color: "#fff",
              }}
            />
            {cycle.imageUrl && (
              <p
                style={{
                  fontSize: "0.8rem",
                  color: "#888",
                  marginTop: "0.5rem",
                  wordBreak: "break-all",
                }}
              >
                Current image: {cycle.imageUrl.split("/").pop()}
              </p>
            )}
          </div>

          <div
            style={{
              background: "#222",
              padding: "1rem",
              borderRadius: "6px",
              border: "1px solid #333",
            }}
          >
            <h3
              style={{
                margin: "0 0 1rem 0",
                fontSize: "1.1rem",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              Pricing Options
            </h3>

            <style>
              {`
                input[type="number"]::-webkit-outer-spin-button,
                input[type="number"]::-webkit-inner-spin-button {
                  -webkit-appearance: none;
                  margin: 0;
                }
                input[type="number"] {
                  -moz-appearance: textfield;
                }
              `}
            </style>

            <div
              className="pricing-header"
              style={{ display: "flex", gap: "0.5rem", marginBottom: "0.5rem" }}
            >
              <div style={{ flex: 1, fontSize: "0.8rem", color: "#888" }}>
                Label
              </div>
              <div
                style={{ width: "120px", fontSize: "0.8rem", color: "#888" }}
              >
                Price (₹)
              </div>
            </div>

            {pricingOptions.map((opt: PricingOption, index: number) => (
              <div
                key={index}
                className="pricing-row"
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  marginBottom: "0.5rem",
                  alignItems: "center",
                }}
              >
                <input
                  type="text"
                  name={`pricingLabel_${index}`}
                  value={opt.label}
                  readOnly
                  style={{
                    flex: 1,
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #333",
                    background: "#222",
                    color: "#ccc",
                    cursor: "not-allowed",
                  }}
                />
                <input
                  type="hidden"
                  name={`pricingValue_${index}`}
                  value={opt.value}
                />
                <input
                  type="hidden"
                  name={`pricingUnit_${index}`}
                  value={opt.unit}
                />
                <input
                  type="number"
                  name={`pricingPrice_${index}`}
                  placeholder="Price"
                  value={opt.price}
                  onChange={(e) =>
                    handlePricingChange(index, "price", Number(e.target.value))
                  }
                  required
                  min="0"
                  style={{
                    width: "120px",
                    padding: "0.5rem",
                    borderRadius: "4px",
                    border: "1px solid #555",
                    background: "#111",
                    color: "#fff",
                  }}
                />
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                padding: "0.8rem",
                background: "#333",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              style={{
                flex: 1,
                padding: "0.8rem",
                background: "#1eb53a",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                fontSize: "1rem",
                cursor: pending ? "not-allowed" : "pointer",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              {pending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
