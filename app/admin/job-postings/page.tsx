import React from "react";
import { getJobPostings } from "./actions";
import CreateJobPostingForm from "./CreateJobPostingForm";
import JobPostingListItem from "./JobPostingListItem";
import styles from "../admin.module.css";

export default async function JobPostingsPage() {
  const jobPostings = await getJobPostings();

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Manage Job Postings</h1>
      <p style={{ color: "#aaa", marginBottom: "2rem" }}>
        Create and manage job postings. Active postings will be visible on the
        public careers page.
      </p>

      <div className={styles.twoColumnGrid}>
        <div
          style={{
            background: "#1a1a1a",
            padding: "2rem",
            borderRadius: "8px",
            border: "1px solid #333",
          }}
        >
          <h2
            style={{ marginTop: 0, marginBottom: "1.5rem", fontSize: "1.2rem" }}
          >
            Create New Job Posting
          </h2>
          <CreateJobPostingForm />
        </div>

        <div
          style={{
            background: "#1a1a1a",
            padding: "2rem",
            borderRadius: "8px",
            border: "1px solid #333",
          }}
        >
          <h2
            style={{ marginTop: 0, marginBottom: "1.5rem", fontSize: "1.2rem" }}
          >
            All Job Postings
          </h2>
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
            {jobPostings.length === 0 ? (
              <p style={{ color: "#888" }}>No job postings created yet.</p>
            ) : (
              jobPostings.map(
                (job: import("./JobPostingListItem").JobPostingData) => (
                  <JobPostingListItem key={job.id} job={job} />
                ),
              )
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
