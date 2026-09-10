"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getPaginatedAttendanceEvents } from "../actions/infiniteScrollActions";

type AttendanceEvent = {
  id: string;
  title: string;
  date: Date;
  timeSlot: string;
  eventType: string;
  presentCount: number;
  totalCount: number;
};

export default function InfiniteAttendanceList({
  initialEvents,
}: {
  initialEvents: AttendanceEvent[];
}) {
  const [events, setEvents] = useState<AttendanceEvent[]>(initialEvents);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialEvents.length === 10);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const BATCH_SIZE = 10;

  const loadMoreEvents = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextBatch = await getPaginatedAttendanceEvents(
        events.length,
        BATCH_SIZE,
      );

      if (nextBatch.length > 0) {
        setEvents((prev) => [...prev, ...nextBatch]);
      }

      if (nextBatch.length < BATCH_SIZE) {
        setHasMore(false); // No more events to load
      }
    } catch (error) {
      console.error("Failed to load more events:", error);
    } finally {
      setLoading(false);
    }
  }, [events.length, loading, hasMore]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreEvents();
        }
      },
      { rootMargin: "100px" },
    ); // Trigger a bit before they hit the absolute bottom

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [loadMoreEvents, hasMore]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {events.length === 0 ? (
        <p style={{ color: "#888" }}>No events yet.</p>
      ) : (
        events.map((event) => (
          <Link
            key={event.id}
            href={`/admin/attendance/${event.id}`}
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "block",
            }}
          >
            <div
              style={{
                background: "#1a1a1a",
                padding: "1.5rem",
                borderRadius: "8px",
                border: "1px solid #333",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
                transition: "background 0.2s ease",
                cursor: "pointer",
              }}
            >
              <div style={{ flex: "1 1 min-content", minWidth: "250px" }}>
                <h2
                  style={{
                    marginTop: 0,
                    marginBottom: "0.5rem",
                    fontSize: "1.3rem",
                    wordBreak: "break-word",
                  }}
                >
                  {event.title}
                </h2>
                <div
                  style={{
                    fontSize: "0.9rem",
                    color: "#ccc",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.5rem 1rem",
                  }}
                >
                  <span>
                    <strong>Date:</strong>{" "}
                    {new Date(event.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </span>
                  <span>
                    <strong>Time:</strong> {event.timeSlot}
                  </span>
                  <span>
                    <strong>Type:</strong> {event.eventType}
                  </span>
                </div>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "1rem" }}
              >
                <div
                  style={{
                    background: "#1eb53a22",
                    border: "1px solid #1eb53a",
                    padding: "0.5rem 1rem",
                    borderRadius: "20px",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    color: "#1eb53a",
                  }}
                >
                  {event.presentCount} / {event.totalCount} Present
                </div>
                <ArrowRight size={20} color="#888" />
              </div>
            </div>
          </Link>
        ))
      )}

      {/* Invisible element at the bottom to trigger intersection observer */}
      {hasMore && (
        <div
          ref={loadingRef}
          style={{ padding: "2rem", textAlign: "center", color: "#888" }}
        >
          Loading more events...
        </div>
      )}
      {!hasMore && events.length > 0 && (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            color: "#555",
            fontSize: "0.9rem",
          }}
        >
          You&apos;ve reached the end of the list.
        </div>
      )}
    </div>
  );
}
