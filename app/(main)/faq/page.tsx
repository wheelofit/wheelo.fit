import React from "react";
import prisma from "@/lib/prisma";
import { SectionAccordion } from "@/components/ui/SectionAccordion";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions | Wheelo.fit",
  description:
    "Find answers to common questions about Wheelo.fit cycle classes, rentals, and more.",
};

export default async function FAQPage() {
  let faqs: { question: string; answer: string }[] = [];
  try {
    const prismaFAQ = prisma as unknown as {
      fAQ: {
        findMany: (
          args: unknown,
        ) => Promise<{ question: string; answer: string }[]>;
      };
    };
    faqs = await prismaFAQ.fAQ.findMany({
      where: { isActive: true },
      orderBy: { order: "asc" },
    });
  } catch (error) {
    console.error("Failed to fetch FAQs", error);
  }

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "4rem 2rem",
        minHeight: "60vh",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          color: "#fff",
          textAlign: "center",
          marginBottom: "3rem",
        }}
      >
        Frequently Asked Questions
      </h1>

      {faqs.length > 0 ? (
        <SectionAccordion
          sections={faqs.map((faq: { question: string; answer: string }) => ({
            title: faq.question,
            content: <p>{faq.answer}</p>,
          }))}
        />
      ) : (
        <p style={{ textAlign: "center", color: "#888" }}>
          No frequently asked questions available at this time.
        </p>
      )}
    </div>
  );
}
