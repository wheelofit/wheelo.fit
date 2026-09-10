"use client";

import React from "react";
import styles from "./StickyBottomBar.module.css";

interface StickyBottomBarProps {
  priceText: string;
  onBookNowClick: () => void;
}

export function StickyBottomBar({
  priceText,
  onBookNowClick,
}: StickyBottomBarProps) {
  return (
    <div className={styles.stickyBar}>
      <div className={styles.container}>
        <div className={styles.priceSection}>
          <span className={styles.priceLabel}>From:</span>
          <span className={styles.priceValue}>{priceText}</span>
        </div>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.bookNowBtn}
            onClick={onBookNowClick}
          >
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
}
