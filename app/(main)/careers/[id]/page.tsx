import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import styles from "@/components/ui/InfoPage.module.css";
import ApplyForm from "./ApplyForm";

export default async function JobPostingPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const job = await prisma.jobPosting.findUnique({
    where: { id },
  });

  if (!job || !job.isActive) {
    notFound();
  }

  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>{job.title}</h1>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.textBlock}>
          <h2>Job Description</h2>
          <p style={{ whiteSpace: "pre-line" }}>{job.description}</p>
        </div>

        <div className={styles.jobList}>
          <div className={styles.glassCard} style={{ padding: "2rem" }}>
            <h2
              style={{
                marginTop: 0,
                marginBottom: "1.5rem",
                color: "var(--foreground)",
              }}
            >
              Apply Now
            </h2>
            <ApplyForm jobId={job.id} />
          </div>
        </div>
      </div>
    </main>
  );
}
