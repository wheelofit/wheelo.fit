import React from "react";
import { getPaginatedPastEvents } from "../actions/infiniteScrollActions";
import InfiniteEventList from "../components/InfiniteEventList";

export default async function EventHistoryPage() {
  // Fetch the first 10 past events
  const initialEvents = await getPaginatedPastEvents(0, 10);

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Event History</h1>
      <p style={{ color: "#aaa", marginBottom: "2rem" }}>
        View responses and registrations for past, completed events.
      </p>

      <InfiniteEventList
        initialEvents={initialEvents}
        fetchAction={getPaginatedPastEvents}
        isPast={true}
      />
    </div>
  );
}
