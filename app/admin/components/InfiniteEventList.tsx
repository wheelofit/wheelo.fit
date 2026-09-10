"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import EventListItem from "./EventListItem";

type Event = {
  id: string;
  title: string;
  eventType: string;
  date: Date;
  timeSlot: string;
  ageLimit: string | null;
  isActive: boolean;
};

interface InfiniteEventListProps {
  initialEvents: Event[];
  fetchAction: (skip: number, take: number) => Promise<Event[]>;
  isPast?: boolean;
}

export default function InfiniteEventList({
  initialEvents,
  fetchAction,
  isPast,
}: InfiniteEventListProps) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialEvents.length === 10);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const BATCH_SIZE = 10;

  const loadMoreEvents = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextBatch = await fetchAction(events.length, BATCH_SIZE);

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
  }, [events.length, loading, hasMore, fetchAction]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreEvents();
        }
      },
      { rootMargin: "100px" },
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [loadMoreEvents, hasMore]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        marginTop: "2rem",
      }}
    >
      {events.length === 0 ? (
        <p style={{ color: "#888" }}>No events yet.</p>
      ) : (
        events.map((event) => (
          <div key={event.id} style={{ opacity: isPast ? 0.8 : 1 }}>
            <EventListItem event={event} isPast={isPast} />
          </div>
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
