import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import styles from "@/components/ui/InfoPage.module.css";

export default async function CareersPage() {
  const activeJobs = await prisma.jobPosting.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return (
    <main className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Join Our Team</h1>
        <p className={styles.subtitle}>
          We are always looking for passionate, driven individuals to help us
          build the future of urban cycling and fitness.
        </p>
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.textBlock}>
          <h2>Why Work With Us?</h2>
          <p>
            At Wheelo.fit, we don&apos;t just ride together; we grow together.
            We offer a fast-paced, highly collaborative environment where your
            ideas actually matter.
          </p>
          <p>
            Perks include unlimited studio classes, free cycle rentals,
            comprehensive health insurance, flexible working hours, and a
            green-commute allowance.
          </p>
        </div>

        <div className={styles.jobList}>
          {activeJobs.length === 0 ? (
            <div
              className={styles.glassCard}
              style={{ textAlign: "center", padding: "40px" }}
            >
              <h3 style={{ color: "var(--foreground)", marginBottom: "10px" }}>
                No Open Positions
              </h3>
              <p style={{ color: "var(--foreground)", opacity: 0.8 }}>
                We currently don&apos;t have any open roles, but we are always
                on the lookout for great talent. Check back soon!
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "1.5rem",
              }}
            >
              {activeJobs.map((job) => (
                <div
                  key={job.id}
                  className={styles.glassCard}
                  style={{ padding: "2rem" }}
                >
                  <h3
                    style={{
                      margin: "0 0 1rem 0",
                      fontSize: "1.5rem",
                      color: "var(--foreground)",
                    }}
                  >
                    {job.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--foreground)",
                      opacity: 0.8,
                      marginBottom: "1.5rem",
                      display: "-webkit-box",
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {job.description}
                  </p>
                  <Link
                    href={`/careers/${job.id}`}
                    style={{
                      display: "inline-block",
                      padding: "0.8rem 1.5rem",
                      background: "var(--primary)",
                      color: "var(--primary-foreground)",
                      textDecoration: "none",
                      fontWeight: "bold",
                      borderRadius: "8px",
                    }}
                  >
                    View Details & Apply
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
