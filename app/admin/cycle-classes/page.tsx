import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";

import InfiniteInquiryList from "../components/InfiniteInquiryList";

export const dynamic = "force-dynamic";

export default async function AdminCycleClassesPage(props: {
  searchParams?: Promise<{ filter?: string }>;
}) {
  const searchParams = await props.searchParams;
  const filter = searchParams?.filter || "all";

  let whereClause = {};
  if (filter === "pending") {
    whereClause = { contacted: false };
  } else if (filter === "contacted") {
    whereClause = { contacted: true };
  }

  type CycleClassInquiry = {
    id: string;
    name: string;
    email: string;
    phone: string;
    experienceLevel?: string;
    message?: string;
    contacted: boolean;
    createdAt: Date;
  };

  const prismaInquiry = prisma as unknown as {
    cycleClassInquiry: {
      findMany: (args: unknown) => Promise<CycleClassInquiry[]>;
    };
  };
  const inquiries = await prismaInquiry.cycleClassInquiry.findMany({
    where: whereClause,
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
          marginBottom: "1.5rem",
        }}
      >
        <h1 style={{ fontSize: "1.8rem", fontWeight: "bold" }}>
          Cycle Class Inquiries
        </h1>

        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            background: "#222",
            padding: "0.3rem",
            borderRadius: "8px",
            border: "1px solid #444",
          }}
        >
          <Link
            href="/admin/cycle-classes?filter=all"
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "0.9rem",
              background: filter === "all" ? "#444" : "transparent",
              color: filter === "all" ? "#fff" : "#aaa",
            }}
          >
            All
          </Link>
          <Link
            href="/admin/cycle-classes?filter=pending"
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "0.9rem",
              background: filter === "pending" ? "#444" : "transparent",
              color: filter === "pending" ? "#fff" : "#aaa",
            }}
          >
            Pending
          </Link>
          <Link
            href="/admin/cycle-classes?filter=contacted"
            style={{
              padding: "0.4rem 0.8rem",
              borderRadius: "4px",
              textDecoration: "none",
              fontSize: "0.9rem",
              background: filter === "contacted" ? "#444" : "transparent",
              color: filter === "contacted" ? "#fff" : "#aaa",
            }}
          >
            Contacted
          </Link>
        </div>
      </div>

      <InfiniteInquiryList
        key={filter}
        initialInquiries={inquiries}
        filter={filter}
      />
    </div>
  );
}
