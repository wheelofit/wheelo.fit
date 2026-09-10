"use client";

import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import styles from "../admin.module.css";

interface AdminLayoutClientProps {
  role?: string;
  username?: string;
  children: React.ReactNode;
}

export default function AdminLayoutClient({
  role,
  username,
  children,
}: AdminLayoutClientProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const closeSidebar = () => setIsMobileMenuOpen(false);

  return (
    <div className={styles.container}>
      {/* Overlay for mobile when sidebar is open */}
      <div
        className={`${styles.overlay} ${isMobileMenuOpen ? styles.overlayOpen : ""}`}
        onClick={closeSidebar}
      ></div>

      {role && (
        <AdminSidebar
          role={role}
          username={username}
          isOpen={isMobileMenuOpen}
          closeSidebar={closeSidebar}
        />
      )}

      <div className={styles.mainWrapper}>
        <header className={styles.header}>
          <h2>Wheelo.fit Admin</h2>
          {role && (
            <button
              className={styles.hamburgerBtn}
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              ☰
            </button>
          )}
        </header>
        <main className={styles.mainContent}>{children}</main>
      </div>
    </div>
  );
}
