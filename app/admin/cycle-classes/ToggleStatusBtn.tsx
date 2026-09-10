"use client";

import { useTransition } from "react";
import { toggleContactedStatus } from "./actions";

export default function ToggleStatusBtn({
  id,
  isContacted,
}: {
  id: string;
  isContacted: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleContactedStatus(id, isContacted);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      style={{
        padding: "0.4rem 0.8rem",
        borderRadius: "4px",
        border: "none",
        background: isContacted ? "rgba(77,255,77,0.2)" : "rgba(255,165,0,0.2)",
        color: isContacted ? "#4dff4d" : "#ffa500",
        cursor: isPending ? "not-allowed" : "pointer",
        fontSize: "0.8rem",
        fontWeight: "bold",
        opacity: isPending ? 0.7 : 1,
      }}
    >
      {isPending ? "Updating..." : isContacted ? "Contacted" : "Pending"}
    </button>
  );
}
