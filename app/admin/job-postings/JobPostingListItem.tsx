"use client";

import React, { useTransition } from "react";
import Link from "next/link";
import { updateJobPosting, deleteJobPosting } from "./actions";

export interface JobPostingData {
  id: string;
  title: string;
  description: string;
  isActive: boolean;
}

export default function JobPostingListItem({ job }: { job: JobPostingData }) {
  const [isPending, startTransition] = useTransition();

  const toggleActive = () => {
    startTransition(async () => {
      await updateJobPosting(job.id, {
        title: job.title,
        description: job.description,
        isActive: !job.isActive,
      });
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this job posting?")) {
      startTransition(async () => {
        await deleteJobPosting(job.id);
      });
    }
  };

  return (
    <li
      style={{
        background: "#222",
        padding: "1rem",
        borderRadius: "6px",
        border: "1px solid #333",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "0.5rem",
        }}
      >
        <div>
          <h3 style={{ margin: "0 0 0.5rem 0" }}>{job.title}</h3>
          <span
            style={{
              fontSize: "0.8rem",
              padding: "0.2rem 0.5rem",
              borderRadius: "4px",
              background: job.isActive ? "#166534" : "#7f1d1d",
              color: "#fff",
            }}
          >
            {job.isActive ? "Active" : "Inactive"}
          </span>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            onClick={toggleActive}
            disabled={isPending}
            style={{
              padding: "0.4rem 0.8rem",
              background: "#333",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Toggle Status
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            style={{
              padding: "0.4rem 0.8rem",
              background: "#991b1b",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
      <p
        style={{
          color: "#aaa",
          fontSize: "0.9rem",
          marginBottom: "1rem",
          whiteSpace: "pre-line",
        }}
      >
        {job.description.length > 100
          ? `${job.description.substring(0, 100)}...`
          : job.description}
      </p>
      <div>
        <Link
          href={`/admin/job-postings/${job.id}/responses`}
          style={{
            display: "inline-block",
            padding: "0.4rem 0.8rem",
            background: "#2563eb",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "4px",
            fontSize: "0.9rem",
          }}
        >
          View Responses
        </Link>
      </div>
    </li>
  );
}
