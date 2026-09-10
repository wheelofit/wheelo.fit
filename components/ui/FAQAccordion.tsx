"use client";

import React, { useState } from "react";
import styles from "./Footer.module.css";

interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export function FAQAccordion({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className={styles.faqSection}>
      <h3 className={styles.faqTitle}>Frequently Asked Questions</h3>
      <div className={styles.faqList}>
        {faqs.map((faq, index) => (
          <div
            key={faq.id}
            className={`${styles.faqItem} ${openIndex === index ? styles.faqOpen : ""}`}
          >
            <button
              className={styles.faqQuestion}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
            >
              {faq.question}
              <span className={styles.faqIcon}>
                {openIndex === index ? "−" : "+"}
              </span>
            </button>
            <div className={styles.faqAnswerWrapper}>
              <p className={styles.faqAnswer}>{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
