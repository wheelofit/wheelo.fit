"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Reorder } from "framer-motion";
import { GripVertical } from "lucide-react";
import { createFAQ, updateFAQ, deleteFAQ, updateFAQOrder } from "./actions";
import { getPaginatedFAQs } from "../actions/infiniteScrollActions";

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  isActive: boolean;
}

export default function FAQClientView({ faqs }: { faqs: FAQItem[] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFAQ, setEditingFAQ] = useState<FAQItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [items, setItems] = useState(faqs);
  const [prevFaqs, setPrevFaqs] = useState(faqs);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(faqs.length === 10);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const BATCH_SIZE = 10;

  if (faqs !== prevFaqs) {
    setPrevFaqs(faqs);
    setItems(faqs);
    setHasMore(faqs.length === 10);
  }

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const nextBatch = await getPaginatedFAQs(items.length, BATCH_SIZE);

      if (nextBatch.length > 0) {
        setItems((prev) => {
          // Avoid duplicates
          const newItems = nextBatch.filter(
            (newItem: FAQItem) => !prev.some((p) => p.id === newItem.id),
          );
          return [...prev, ...newItems];
        });
      }

      if (nextBatch.length < BATCH_SIZE) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to load more:", error);
    } finally {
      setLoading(false);
    }
  }, [items.length, loading, hasMore]);

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

  const openCreateModal = () => {
    setEditingFAQ(null);
    setIsModalOpen(true);
  };

  const openEditModal = (faq: FAQItem) => {
    setEditingFAQ(faq);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);

    if (editingFAQ) {
      await updateFAQ(editingFAQ.id, formData);
    } else {
      await createFAQ(formData);
    }

    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      await deleteFAQ(id);
    }
  };

  const handleReorder = async (newOrder: FAQItem[]) => {
    setItems(newOrder);
    await updateFAQOrder(newOrder.map((item) => item.id));
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", color: "#fff" }}>Manage FAQs</h2>
        <button
          onClick={openCreateModal}
          style={{
            background: "#1eb53a",
            color: "#fff",
            border: "none",
            padding: "0.8rem 1.5rem",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          + Add FAQ
        </button>
      </div>

      <div
        style={{
          background: "#1a1a1a",
          borderRadius: "12px",
          border: "1px solid #333",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            background: "#222",
            borderBottom: "1px solid #333",
            padding: "1rem",
            color: "#888",
            fontWeight: "bold",
          }}
        >
          <div style={{ width: "40px" }}></div>
          <div style={{ flex: 1 }}>Question</div>
          <div style={{ width: "100px" }}>Status</div>
          <div style={{ width: "150px" }}>Actions</div>
        </div>

        <Reorder.Group
          axis="y"
          values={items}
          onReorder={handleReorder}
          style={{ listStyle: "none", padding: 0, margin: 0 }}
        >
          {items.map((faq) => (
            <Reorder.Item
              key={faq.id}
              value={faq}
              style={{
                display: "flex",
                borderBottom: "1px solid #333",
                padding: "1rem",
                alignItems: "center",
                background: "#1a1a1a",
                cursor: "grab",
              }}
            >
              <div
                style={{
                  width: "40px",
                  color: "#888",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <GripVertical size={20} style={{ cursor: "grab" }} />
              </div>
              <div style={{ flex: 1, color: "#fff", paddingRight: "1rem" }}>
                {faq.question}
              </div>
              <div style={{ width: "100px" }}>
                <span
                  style={{
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "0.8rem",
                    background: faq.isActive ? "#1eb53a22" : "#ff4d4d22",
                    color: faq.isActive ? "#1eb53a" : "#ff4d4d",
                  }}
                >
                  {faq.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div style={{ width: "150px" }}>
                <button
                  onClick={() => openEditModal(faq)}
                  style={{
                    background: "#0284c7",
                    color: "#fff",
                    border: "none",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "0.5rem",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  style={{
                    background: "#dc2626",
                    color: "#fff",
                    border: "none",
                    padding: "0.4rem 0.8rem",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </Reorder.Item>
          ))}
          {items.length === 0 && (
            <div
              style={{ padding: "2rem", textAlign: "center", color: "#888" }}
            >
              No FAQs found. Add one!
            </div>
          )}
        </Reorder.Group>

        {hasMore && (
          <div
            ref={loadingRef}
            style={{ padding: "2rem", textAlign: "center", color: "#888" }}
          >
            Loading more FAQs...
          </div>
        )}
      </div>

      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "#111",
              padding: "2rem",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "600px",
              border: "1px solid #333",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
              }}
            >
              <h3 style={{ color: "#fff", margin: 0 }}>
                {editingFAQ ? "Edit FAQ" : "Add FAQ"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "#888",
                  cursor: "pointer",
                  fontSize: "1.5rem",
                }}
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    color: "#ccc",
                  }}
                >
                  Question
                </label>
                <input
                  type="text"
                  name="question"
                  defaultValue={editingFAQ?.question}
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
                  Answer
                </label>
                <textarea
                  name="answer"
                  defaultValue={editingFAQ?.answer}
                  required
                  rows={4}
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

              {editingFAQ && (
                <label
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#ccc",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="checkbox"
                    name="isActive"
                    defaultChecked={editingFAQ.isActive}
                    style={{ width: "18px", height: "18px" }}
                  />
                  Show publicly
                </label>
              )}

              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: "1rem",
                    background: "#333",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    flex: 1,
                    padding: "1rem",
                    background: "#1eb53a",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    cursor: isSubmitting ? "default" : "pointer",
                  }}
                >
                  {isSubmitting ? "Saving..." : "Save FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
