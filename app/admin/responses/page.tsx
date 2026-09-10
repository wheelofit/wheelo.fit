import React from "react";
import { getPaginatedUpcomingEvents } from "../actions/infiniteScrollActions";
import InfiniteEventList from "../components/InfiniteEventList";

export default async function ResponsesPage() {
  // Fetch the first 10 upcoming events
  const initialEvents = await getPaginatedUpcomingEvents(0, 10);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Upcoming Events & Responses</h1>
      <p style={{ color: "#aaa", marginBottom: "2rem" }}>
        Manage your active events, view responses, and take attendance.
      </p>

      <InfiniteEventList
        initialEvents={initialEvents}
        fetchAction={getPaginatedUpcomingEvents}
      />
    </div>
  );
}
