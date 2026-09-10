import React from "react";
import { getPaginatedAttendanceEvents } from "../actions/infiniteScrollActions";
import InfiniteAttendanceList from "../components/InfiniteAttendanceList";

export default async function AttendanceDashboardPage() {
  // Fetch the first 10 events directly via the server action
  const initialEvents = await getPaginatedAttendanceEvents(0, 10);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Event Attendance</h1>
      <p style={{ color: "#aaa", marginBottom: "2rem" }}>
        Select an event to open the scanner and manage attendance.
      </p>

      <InfiniteAttendanceList initialEvents={initialEvents} />
    </div>
  );
}
