"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { PaymentLink } from "@prisma/client";
import PaymentLinkListItem from "./PaymentLinkListItem";
import { getPaginatedPayments } from "../actions/infiniteScrollActions";

export default function InfinitePaymentList({
  initialPayments,
}: {
  initialPayments: PaymentLink[];
}) {
  const [payments, setPayments] = useState<PaymentLink[]>(initialPayments);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPayments.length === 10);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const BATCH_SIZE = 10;

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextBatch = await getPaginatedPayments(payments.length, BATCH_SIZE);

      if (nextBatch.length > 0) {
        setPayments((prev) => [...prev, ...nextBatch]);
      }

      if (nextBatch.length < BATCH_SIZE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more:", error);
    } finally {
      setLoading(false);
    }
  }, [payments.length, loading, hasMore]);

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

  if (payments.length === 0) {
    return <p style={{ color: "#888" }}>No payments found.</p>;
  }

  return (
    <>
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        {payments.map((link) => (
          <PaymentLinkListItem key={link.id} link={link} />
        ))}
      </ul>
      {hasMore && (
        <div
          ref={loadingRef}
          style={{ padding: "2rem", textAlign: "center", color: "#888" }}
        >
          Loading more payments...
        </div>
      )}
      {!hasMore && payments.length > 0 && (
        <div
          style={{
            padding: "1rem",
            textAlign: "center",
            color: "#555",
            fontSize: "0.9rem",
          }}
        >
          End of payments list.
        </div>
      )}
    </>
  );
}
