import React from "react";
import prisma from "@/lib/prisma";
import styles from "../admin.module.css";
import Link from "next/link";
import CreateCycleForm from "./CreateCycleForm";
import CycleList from "./CycleList";

export const dynamic = "force-dynamic";

export default async function AdminRentalsPage() {
  const cycles = await (
    prisma as unknown as {
      rentalCycle: {
        findMany: (
          args: unknown,
        ) => Promise<import("./EditCycleModal").CycleData[]>;
      };
    }
  ).rentalCycle.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", fontWeight: "bold" }}>
          Manage Cycle Inventory
        </h1>
        <Link
          href="/admin/rentals/bookings"
          style={{
            padding: "0.6rem 1.2rem",
            background: "#1eb53a",
            color: "#fff",
            textDecoration: "none",
            borderRadius: "4px",
            fontWeight: "bold",
          }}
        >
          View Bookings &rarr;
        </Link>
      </div>

      <div className={styles.twoColumnGrid}>
        <div>
          <div
            style={{
              background: "#1a1a1a",
              padding: "1.5rem",
              borderRadius: "8px",
              border: "1px solid #333",
              marginBottom: "2rem",
            }}
          >
            <h2 style={{ fontSize: "1.4rem", marginBottom: "1.5rem" }}>
              Add New Cycle Type
            </h2>
            <CreateCycleForm />
          </div>
        </div>

        <div>
          <div
            style={{
              background: "#1a1a1a",
              padding: "1.5rem",
              borderRadius: "8px",
              border: "1px solid #333",
            }}
          >
            <h2 style={{ fontSize: "1.4rem", marginBottom: "1.5rem" }}>
              Current Inventory
            </h2>
            <CycleList cycles={cycles} />
          </div>
        </div>
      </div>
    </div>
  );
}
