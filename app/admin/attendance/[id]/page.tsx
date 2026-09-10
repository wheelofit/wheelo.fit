import React from "react";
import Link from "next/link";
import { getEventAttendance } from "./actions";
import QRScanner from "./QRScanner";
import ParticipantList from "./ParticipantList";
import styles from "../../admin.module.css";

export default async function AttendancePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const { event, presentCount, totalCount } = await getEventAttendance(
    resolvedParams.id,
  );

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
        <div>
          <h1 style={{ margin: "0 0 0.5rem 0" }}>{event.title} - Attendance</h1>
          <p style={{ color: "#aaa", margin: 0 }}>
            {new Date(event.date).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })}{" "}
            | {event.timeSlot}
          </p>
        </div>
        <Link
          href="/admin/attendance"
          style={{
            padding: "0.5rem 1rem",
            background: "#333",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "4px",
          }}
        >
          &larr; Back to Events
        </Link>
      </div>

      <div
        style={{
          background: "#1eb53a22",
          border: "1px solid #1eb53a",
          padding: "1.5rem",
          borderRadius: "8px",
          marginBottom: "2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#1eb53a" }}>
          Live Attendance
        </h2>
        <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
          <span style={{ color: "#fff" }}>{presentCount}</span>
          <span style={{ color: "#888", fontSize: "1.5rem" }}>
            {" "}
            / {totalCount}
          </span>
        </div>
      </div>

      <div className={styles.twoColumnGrid}>
        <div>
          <QRScanner eventId={event.id} />
        </div>

        <div
          style={{
            background: "#1a1a1a",
            padding: "1.5rem",
            borderRadius: "8px",
            border: "1px solid #333",
          }}
        >
          <h3 style={{ margin: "0 0 1rem 0" }}>Participant List</h3>
          <ParticipantList
            registrations={event.registrations}
            eventId={event.id}
          />
        </div>
      </div>
    </div>
  );
}
