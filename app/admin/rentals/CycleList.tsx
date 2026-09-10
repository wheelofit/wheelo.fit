"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { toggleCycleActive, deleteCycle } from "./actions";
import EditCycleModal from "./EditCycleModal";
import { getPaginatedCycles } from "../actions/infiniteScrollActions";

import type { CycleData, PricingOption } from "./EditCycleModal";

export default function CycleList({
  cycles: initialCycles,
}: {
  cycles: CycleData[];
}) {
  const [cycles, setCycles] = useState<CycleData[]>(initialCycles);
  const [editingCycle, setEditingCycle] = useState<CycleData | null>(null);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialCycles.length === 10);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const BATCH_SIZE = 10;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextBatch = await getPaginatedCycles(cycles.length, BATCH_SIZE);

      if (nextBatch.length > 0) {
        setCycles((prev) => [...prev, ...nextBatch]);
      }

      if (nextBatch.length < BATCH_SIZE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more:", error);
    } finally {
      setLoading(false);
    }
  }, [cycles.length, loading, hasMore]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMore();
        }
      },
      { rootMargin: "100px" },
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [loadMore, hasMore]);

  if (cycles.length === 0) {
    return <p style={{ color: "#888" }}>No cycles in inventory yet.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {cycles.map((c) => (
        <div
          key={c.id}
          style={{
            background: "#222",
            padding: "1rem",
            borderRadius: "8px",
            borderLeft: c.isActive ? "4px solid #1eb53a" : "4px solid #555",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              flexWrap: "wrap",
              gap: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            <div>
              <h3 style={{ margin: "0 0 0.3rem 0" }}>{c.type}</h3>
              <p style={{ margin: 0, color: "#aaa", fontSize: "0.9rem" }}>
                Stock: {c.quantity}
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
              <button
                onClick={() => setEditingCycle(c)}
                style={{
                  background: "#0ea5e922",
                  color: "#0ea5e9",
                  border: "1px solid #0ea5e9",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                Edit
              </button>
              <button
                onClick={async () => {
                  await toggleCycleActive(c.id, c.isActive);
                  // Optimistic update
                  setCycles(
                    cycles.map((cycle) =>
                      cycle.id === c.id
                        ? { ...cycle, isActive: !cycle.isActive }
                        : cycle,
                    ),
                  );
                }}
                style={{
                  background: c.isActive ? "#333" : "#1eb53a",
                  color: "#fff",
                  border: "none",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                {c.isActive ? "Deactivate" : "Activate"}
              </button>
              <button
                onClick={async () => {
                  if (
                    confirm("Are you sure you want to delete this cycle type?")
                  ) {
                    await deleteCycle(c.id);
                    // Optimistic update
                    setCycles(cycles.filter((cycle) => cycle.id !== c.id));
                  }
                }}
                style={{
                  background: "#ff4d4d22",
                  color: "#ff4d4d",
                  border: "1px solid #ff4d4d",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "0.8rem",
                }}
              >
                Delete
              </button>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              flexWrap: "wrap",
              marginTop: "1rem",
            }}
          >
            {c.pricing.map((p: PricingOption, i: number) => (
              <div
                key={i}
                style={{
                  background: "#111",
                  padding: "0.3rem 0.6rem",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  color: "#ccc",
                  border: "1px solid #333",
                }}
              >
                {p.durationLabel}: ₹{p.price}
              </div>
            ))}
          </div>
        </div>
      ))}

      {hasMore && (
        <div
          ref={loadingRef}
          style={{ padding: "2rem", textAlign: "center", color: "#888" }}
        >
          Loading more cycles...
        </div>
      )}
      {!hasMore && cycles.length > 0 && (
        <div
          style={{
            padding: "1rem",
            textAlign: "center",
            color: "#555",
            fontSize: "0.9rem",
          }}
        >
          End of inventory.
        </div>
      )}

      {editingCycle && (
        <EditCycleModal
          cycle={editingCycle}
          onClose={() => setEditingCycle(null)}
        />
      )}
    </div>
  );
}
