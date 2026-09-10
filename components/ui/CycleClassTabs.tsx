"use client";

import React, { useState } from "react";

export default function CycleClassTabs() {
  const [activeTab, setActiveTab] = useState("carry");

  const tabs = [
    { id: "carry", label: "Things to carry" },
    { id: "wear", label: "Things to wear" },
    { id: "terms", label: "Terms & Conditions" },
    { id: "faqs", label: "FAQs" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "carry":
        return (
          <ul style={{ paddingLeft: "1.5rem", lineHeight: "2" }}>
            <li>A Water bottle</li>
            <li>Hand towel</li>
          </ul>
        );
      case "wear":
        return (
          <p>
            Comfortable T-shirt/Top and Track pants, Sports shoes. Avoid
            Loose/Baggy clothing near the chain.
          </p>
        );
      case "terms":
        return (
          <p>Classes are non-refundable. Please arrive 10 minutes early.</p>
        );
      case "faqs":
        return (
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <div>
              <strong>1) Where do you conduct your cycling classes?</strong>
              <p>
                We have our ground centres in all over Western Mumbai. Borivali,
                Kandivali, Malad, Goregaon, Andheri, Matunga/Dadar and Worli.
              </p>
            </div>
            <div>
              <strong>2) Will I get a bicycle of my height?</strong>
              <p>
                Yes, absolutely! Before confirming your session, we&apos;ll ask
                for your height so we can arrange a bicycle that&apos;s the
                right fit for you. Once you arrive at the venue, our trainers
                will adjust the seat height and make any necessary adjustments
                to ensure you&apos;re comfortable and ready to learn with
                confidence.
              </p>
            </div>
            <div>
              <strong>3) What is the duration of each session?</strong>
              <p>
                Each session will last an hour. In case you are late and we have
                a session later, your session will be cut short.
              </p>
            </div>
            <div>
              <strong>
                4) How many sessions do I need to learn cycling properly?
              </strong>
              <p>
                Generally, it takes 7 to 8 sessions to learn cycling properly
                with balancing and turnings.
              </p>
            </div>
            <div>
              <strong>5) Do you offer trial sessions?</strong>
              <p>
                Yes, we do. However, all trial sessions are paid, as each class
                includes personalized guidance and dedicated time from our
                experienced trainers. We do not offer free trial classes.
              </p>
            </div>
            <div>
              <strong>
                6) Is there a guarantee that I will learn cycling?
              </strong>
              <p>
                Our experienced trainers have successfully taught 500+ beginners
                to ride a bicycle with confidence. With personalized guidance,
                patience, and regular practice, we&apos;ll support you
                throughout your learning journey until you&apos;re able to ride
                independently.
              </p>
            </div>
            <div>
              <strong>7) How often should I attend cycling sessions?</strong>
              <p>
                For the best results, we recommend attending sessions regularly.
                If your schedule doesn&apos;t allow you to come every day, 2–3
                sessions per week are enough to ensure steady progress and help
                you learn cycling with confidence.
              </p>
            </div>
            <div>
              <strong>
                8) Are these cycling classes only available in Mumbai?
              </strong>
              <p>Yes, our cycling classes are in Mumbai only.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "2px",
          marginBottom: "1.5rem",
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "0.8rem 1.5rem",
              border: "none",
              background:
                activeTab === tab.id ? "var(--primary)" : "var(--surface)",
              color: activeTab === tab.id ? "#fff" : "#ccc",
              cursor: "pointer",
              fontWeight: "500",
              flex: "1 1 auto",
              transition: "background 0.2s",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div
        style={{
          background: "transparent",
          padding: "0.5rem",
          color: "#eee",
          minHeight: "120px",
        }}
      >
        {renderContent()}
      </div>
    </div>
  );
}
