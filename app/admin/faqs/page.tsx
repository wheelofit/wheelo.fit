import React from "react";
import FAQClientView from "./FAQClientView";
import prisma from "@/lib/prisma";
import { FAQItem } from "./FAQClientView";

export default async function AdminFAQPage() {
  const prismaFAQ = prisma as unknown as {
    fAQ: { findMany: (args: unknown) => Promise<FAQItem[]> };
  };
  const faqs = await prismaFAQ.fAQ.findMany({
    orderBy: { order: "asc" },
    take: 10,
  });

  return (
    <div>
      <h1 style={{ fontSize: "2rem", marginBottom: "2rem", color: "#fff" }}>
        FAQ Management
      </h1>
      <FAQClientView faqs={faqs} />
    </div>
  );
}
