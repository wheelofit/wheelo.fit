"use client";

import React, { useState, useEffect } from "react";
import { StickyBottomBar } from "./StickyBottomBar";
import { ImageSlider } from "./ImageSlider";
import { SectionAccordion } from "./SectionAccordion";
import styles from "./RidePageLayout.module.css";

interface Section {
  title: string;
  content: React.ReactNode;
}

interface RidePageLayoutProps {
  title: string;
  overview: React.ReactNode;
  inclusionsExclusions: React.ReactNode;
  itinerary: React.ReactNode;
  additionalSections: Section[];
  sliderImages: { id: string; img: string; url?: string; height?: number }[];
  bookingForm: React.ReactNode;
  priceText: string;
}

export function RidePageLayout({
  title,
  overview,
  inclusionsExclusions,
  itinerary,
  additionalSections,
  sliderImages,
  bookingForm,
  priceText,
}: RidePageLayoutProps) {
  const [isFormVisible, setIsFormVisible] = useState(false);

  const handleBookNowClick = () => {
    setIsFormVisible(true);
  };

  useEffect(() => {
    if (isFormVisible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isFormVisible]);

  return (
    <div className={styles.layoutContainer}>
      <header className={styles.header}>
        <h1 className={styles.pageTitle}>{title}</h1>
      </header>

      {/* Top Image Slider via Embla Carousel */}
      <section className={styles.sliderSection}>
        <ImageSlider images={sliderImages} />
      </section>

      <main className={styles.mainContent}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Overview</h2>
          <div className={styles.sectionBody}>{overview}</div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Inclusions & Exclusions</h2>
          <div className={styles.sectionBody}>{inclusionsExclusions}</div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Tour Plan (Itinerary)</h2>
          <div className={styles.sectionBody}>{itinerary}</div>
        </section>

        {additionalSections && additionalSections.length > 0 && (
          <section className={styles.section}>
            <SectionAccordion sections={additionalSections} />
          </section>
        )}
      </main>

      {isFormVisible && (
        <div
          className={styles.modalOverlay}
          onClick={() => setIsFormVisible(false)}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
          >
            <button
              className={styles.modalCloseBtn}
              onClick={() => setIsFormVisible(false)}
            >
              &times;
            </button>
            {bookingForm}
          </div>
        </div>
      )}

      <StickyBottomBar
        priceText={priceText}
        onBookNowClick={handleBookNowClick}
      />
    </div>
  );
}
