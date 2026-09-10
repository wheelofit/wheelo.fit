"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import ToggleStatusBtn from "../cycle-classes/ToggleStatusBtn";
import { getPaginatedInquiries } from "../actions/infiniteScrollActions";

type CycleClassInquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  experienceLevel?: string | null;
  message?: string | null;
  contacted: boolean;
  createdAt: Date;
};

interface InfiniteInquiryListProps {
  initialInquiries: CycleClassInquiry[];
  filter: string;
}

export default function InfiniteInquiryList({
  initialInquiries,
  filter,
}: InfiniteInquiryListProps) {
  const [inquiries, setInquiries] =
    useState<CycleClassInquiry[]>(initialInquiries);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialInquiries.length === 10);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const BATCH_SIZE = 10;

  const loadMoreInquiries = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextBatch = await getPaginatedInquiries(
        inquiries.length,
        BATCH_SIZE,
        filter,
      );

      if (nextBatch.length > 0) {
        setInquiries((prev) => [...prev, ...nextBatch]);
      }

      if (nextBatch.length < BATCH_SIZE) {
        setHasMore(false); // No more to load
      }
    } catch (error) {
      console.error("Failed to load more inquiries:", error);
    } finally {
      setLoading(false);
    }
  }, [inquiries.length, loading, hasMore, filter]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadMoreInquiries();
        }
      },
      { rootMargin: "100px" },
    );

    if (loadingRef.current) {
      observerRef.current.observe(loadingRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, [loadMoreInquiries, hasMore]);

  if (inquiries.length === 0) {
    return (
      <div
        style={{
          padding: "2rem",
          background: "#222",
          borderRadius: "8px",
          textAlign: "center",
          color: "#aaa",
        }}
      >
        No inquiries found.
      </div>
    );
  }

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            textAlign: "left",
            background: "#222",
            borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <thead style={{ background: "#333" }}>
            <tr>
              <th
                style={{
                  padding: "1rem",
                  borderBottom: "1px solid #444",
                  color: "#ccc",
                }}
              >
                Name
              </th>
              <th
                style={{
                  padding: "1rem",
                  borderBottom: "1px solid #444",
                  color: "#ccc",
                }}
              >
                Contact
              </th>
              <th
                style={{
                  padding: "1rem",
                  borderBottom: "1px solid #444",
                  color: "#ccc",
                }}
              >
                Experience
              </th>
              <th
                style={{
                  padding: "1rem",
                  borderBottom: "1px solid #444",
                  color: "#ccc",
                }}
              >
                Message
              </th>
              <th
                style={{
                  padding: "1rem",
                  borderBottom: "1px solid #444",
                  color: "#ccc",
                }}
              >
                Date
              </th>
              <th
                style={{
                  padding: "1rem",
                  borderBottom: "1px solid #444",
                  color: "#ccc",
                }}
              >
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry.id} style={{ borderBottom: "1px solid #333" }}>
                <td style={{ padding: "1rem", borderBottom: "1px solid #444" }}>
                  <strong>{inquiry.name}</strong>
                </td>
                <td style={{ padding: "1rem", borderBottom: "1px solid #444" }}>
                  <div>{inquiry.email}</div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      marginTop: "0.2rem",
                    }}
                  >
                    <span style={{ color: "#aaa", fontSize: "0.9rem" }}>
                      {inquiry.phone}
                    </span>
                    <a
                      href={`tel:${inquiry.phone.replace(/[^0-9+]/g, "")}`}
                      style={{
                        background: "#1eb53a",
                        color: "#fff",
                        padding: "0.2rem 0.5rem",
                        borderRadius: "4px",
                        textDecoration: "none",
                        fontSize: "0.8rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                      Call
                    </a>
                  </div>
                </td>
                <td style={{ padding: "1rem", borderBottom: "1px solid #444" }}>
                  {inquiry.experienceLevel || "-"}
                </td>
                <td
                  style={{
                    padding: "1rem",
                    borderBottom: "1px solid #444",
                    maxWidth: "300px",
                  }}
                >
                  {inquiry.message ? (
                    <div style={{ whiteSpace: "pre-wrap", fontSize: "0.9rem" }}>
                      {inquiry.message}
                    </div>
                  ) : (
                    <span style={{ color: "#777" }}>No message</span>
                  )}
                </td>
                <td
                  style={{
                    padding: "1rem",
                    borderBottom: "1px solid #444",
                    color: "#aaa",
                    fontSize: "0.9rem",
                  }}
                >
                  {new Date(inquiry.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td style={{ padding: "1rem", borderBottom: "1px solid #444" }}>
                  <ToggleStatusBtn
                    id={inquiry.id}
                    isContacted={inquiry.contacted || false}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invisible element at the bottom to trigger intersection observer */}
      {hasMore && (
        <div
          ref={loadingRef}
          style={{ padding: "2rem", textAlign: "center", color: "#888" }}
        >
          Loading more inquiries...
        </div>
      )}
      {!hasMore && inquiries.length > 0 && (
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
