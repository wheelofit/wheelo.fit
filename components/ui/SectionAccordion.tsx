"use client";

import React, { useState } from "react";
import styles from "./SectionAccordion.module.css";

interface Section {
  title: string;
  content: React.ReactNode;
}

export function SectionAccordion({ sections }: { sections: Section[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!sections || sections.length === 0) return null;

  return (
    <div className={styles.accordionSection}>
      {sections.map((section, index) => (
        <div
          key={index}
          className={`${styles.accordionItem} ${openIndex === index ? styles.accordionOpen : ""}`}
        >
          <button
            className={styles.accordionHeader}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
          >
            {section.title}
            <span className={styles.accordionIcon}>+</span>
          </button>
          <div className={styles.accordionContentWrapper}>
            <div className={styles.accordionContentInner}>
              <div className={styles.accordionContent}>{section.content}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
