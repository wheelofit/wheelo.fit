import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function JobPostingResponsesPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const jobPosting = await prisma.jobPosting.findUnique({
    where: { id },
    include: {
      applications: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!jobPosting) {
    return (
      <div>
        <h1 style={{ marginTop: 0 }}>Job Posting Not Found</h1>
        <Link href="/admin/job-postings" style={{ color: "#2563eb" }}>
          Back to Job Postings
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <Link
          href="/admin/job-postings"
          style={{
            color: "#fff",
            textDecoration: "none",
            padding: "0.4rem 0.8rem",
            background: "#333",
            borderRadius: "4px",
          }}
        >
          &larr; Back
        </Link>
        <h1 style={{ margin: 0 }}>Responses: {jobPosting.title}</h1>
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
          Applications ({jobPosting.applications.length})
        </h2>

        {jobPosting.applications.length === 0 ? (
          <p style={{ color: "#888" }}>No applications received yet.</p>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {jobPosting.applications.map((app) => (
              <div
                key={app.id}
                style={{
                  background: "#222",
                  padding: "1.5rem",
                  borderRadius: "6px",
                  border: "1px solid #333",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                    marginBottom: "1rem",
                  }}
                >
                  <div>
                    <p
                      style={{
                        margin: "0 0 0.5rem 0",
                        color: "#aaa",
                        fontSize: "0.8rem",
                      }}
                    >
                      Name
                    </p>
                    <p style={{ margin: 0, fontWeight: "bold" }}>{app.name}</p>
                  </div>
                  <div>
                    <p
                      style={{
                        margin: "0 0 0.5rem 0",
                        color: "#aaa",
                        fontSize: "0.8rem",
                      }}
                    >
                      Email
                    </p>
                    <p style={{ margin: 0 }}>
                      <a
                        href={`mailto:${app.email}`}
                        style={{ color: "#2563eb" }}
                      >
                        {app.email}
                      </a>
                    </p>
                  </div>
                  <div>
                    <p
                      style={{
                        margin: "0 0 0.5rem 0",
                        color: "#aaa",
                        fontSize: "0.8rem",
                      }}
                    >
                      Phone
                    </p>
                    <p style={{ margin: 0 }}>{app.phone}</p>
                  </div>
                  <div>
                    <p
                      style={{
                        margin: "0 0 0.5rem 0",
                        color: "#aaa",
                        fontSize: "0.8rem",
                      }}
                    >
                      Applied On
                    </p>
                    <p style={{ margin: 0 }}>
                      {new Date(app.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <div>
                  <p
                    style={{
                      margin: "0 0 0.5rem 0",
                      color: "#aaa",
                      fontSize: "0.8rem",
                    }}
                  >
                    Resume Link
                  </p>
                  <a
                    href={app.resumeLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: "#2563eb", wordBreak: "break-all" }}
                  >
                    {app.resumeLink}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
