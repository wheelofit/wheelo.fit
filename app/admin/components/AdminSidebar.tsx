"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "../actions";
import styles from "../admin.module.css";

interface AdminSidebarProps {
  role?: string;
  username?: string;
  isOpen?: boolean;
  closeSidebar?: () => void;
}

export default function AdminSidebar({
  role,
  username,
  isOpen,
  closeSidebar,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.sidebarOpen : ""}`}>
      <div>
        <h3 style={{ margin: "0 0 0.5rem 0" }}>Menu</h3>
        <p style={{ fontSize: "0.8rem", color: "#aaa", margin: 0 }}>
          Logged in as: <strong>{username}</strong>
        </p>
        <p style={{ fontSize: "0.8rem", color: "#aaa", margin: 0 }}>
          Role: <strong>{role}</strong>
        </p>
      </div>

      <nav className={styles.nav}>
        <Link
          href="/admin"
          onClick={closeSidebar}
          style={{
            color: pathname === "/admin" ? "#fff" : "#888",
            textDecoration: "none",
            fontWeight: pathname === "/admin" ? "bold" : "normal",
          }}
        >
          Dashboard
        </Link>

        <Link
          href="/admin/attendance"
          onClick={closeSidebar}
          style={{
            color: pathname.includes("/attendance") ? "#fff" : "#888",
            textDecoration: "none",
            fontWeight: pathname.includes("/attendance") ? "bold" : "normal",
          }}
        >
          Event Attendance
        </Link>

        <Link
          href="/admin/responses"
          onClick={closeSidebar}
          style={{
            color: pathname === "/admin/responses" ? "#fff" : "#888",
            textDecoration: "none",
            fontWeight: pathname === "/admin/responses" ? "bold" : "normal",
          }}
        >
          View Responses
        </Link>

        <Link
          href="/admin/event-history"
          onClick={closeSidebar}
          style={{
            color: pathname === "/admin/event-history" ? "#fff" : "#888",
            textDecoration: "none",
            fontWeight: pathname === "/admin/event-history" ? "bold" : "normal",
          }}
        >
          Event History
        </Link>

        <Link
          href="/admin/job-postings"
          onClick={closeSidebar}
          style={{
            color: pathname.startsWith("/admin/job-postings") ? "#fff" : "#888",
            textDecoration: "none",
            fontWeight: pathname.startsWith("/admin/job-postings")
              ? "bold"
              : "normal",
          }}
        >
          Job Postings
        </Link>

        <Link
          href="/admin/testimonials"
          onClick={closeSidebar}
          style={{
            color: pathname.startsWith("/admin/testimonials") ? "#fff" : "#888",
            textDecoration: "none",
            fontWeight: pathname.startsWith("/admin/testimonials")
              ? "bold"
              : "normal",
          }}
        >
          Testimonials
        </Link>

        <Link
          href="/admin/cycle-classes"
          onClick={closeSidebar}
          style={{
            color: pathname.startsWith("/admin/cycle-classes")
              ? "#fff"
              : "#888",
            textDecoration: "none",
            fontWeight: pathname.startsWith("/admin/cycle-classes")
              ? "bold"
              : "normal",
          }}
        >
          Cycle Class Inquiries
        </Link>

        <Link
          href="/admin/rentals"
          onClick={closeSidebar}
          style={{
            color: pathname.startsWith("/admin/rentals") ? "#fff" : "#888",
            textDecoration: "none",
            fontWeight: pathname.startsWith("/admin/rentals")
              ? "bold"
              : "normal",
          }}
        >
          Manage Rentals
        </Link>

        <Link
          href="/admin/pricing"
          onClick={closeSidebar}
          style={{
            color: pathname.startsWith("/admin/pricing") ? "#fff" : "#888",
            textDecoration: "none",
            fontWeight: pathname.startsWith("/admin/pricing")
              ? "bold"
              : "normal",
          }}
        >
          Event Pricing
        </Link>

        <Link
          href="/admin/faqs"
          onClick={closeSidebar}
          style={{
            color: pathname.startsWith("/admin/faqs") ? "#fff" : "#888",
            textDecoration: "none",
            fontWeight: pathname.startsWith("/admin/faqs") ? "bold" : "normal",
          }}
        >
          Manage FAQs
        </Link>

        {role === "SUPERADMIN" && (
          <Link
            href="/admin/manage-admins"
            onClick={closeSidebar}
            style={{
              color: pathname === "/admin/manage-admins" ? "#fff" : "#888",
              textDecoration: "none",
              fontWeight:
                pathname === "/admin/manage-admins" ? "bold" : "normal",
            }}
          >
            Manage Admins
          </Link>
        )}

        <Link
          href="/admin/payment-links"
          onClick={closeSidebar}
          style={{
            color: pathname.startsWith("/admin/payment-links")
              ? "#fff"
              : "#888",
            textDecoration: "none",
            fontWeight: pathname.startsWith("/admin/payment-links")
              ? "bold"
              : "normal",
          }}
        >
          Payment Links
        </Link>
      </nav>

      <div style={{ marginTop: "auto" }}>
        <button
          onClick={() => {
            if (closeSidebar) closeSidebar();
            logout();
          }}
          style={{
            width: "100%",
            padding: "0.8rem",
            background: "#ff4d4d",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
