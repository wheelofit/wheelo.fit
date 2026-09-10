import React from "react";
import prisma from "@/lib/prisma";
import Link from "next/link";
import {
  Calendar,
  Users,
  Bike,
  MessageSquare,
  ArrowRight,
  DollarSign,
} from "lucide-react";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const sessionCookie = (await cookies()).get("admin_session")?.value;
  const session = await decrypt(sessionCookie);
  const isSuperAdmin = session?.role === "SUPERADMIN";
  // 1. Revenue (IST Timezone)
  const now = new Date();
  const istOffset = 5.5 * 60 * 60 * 1000; // IST is UTC+5:30
  const nowIST = new Date(now.getTime() + istOffset);

  const istYear = nowIST.getUTCFullYear();
  const istMonth = nowIST.getUTCMonth();
  const istDate = nowIST.getUTCDate();

  // 00:00 IST corresponds to 18:30 UTC of the previous day
  const startOfToday = new Date(
    Date.UTC(istYear, istMonth, istDate, -5, -30, 0, 0),
  );
  const startOfMonth = new Date(Date.UTC(istYear, istMonth, 1, -5, -30, 0, 0));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const prismaDb = prisma as any;

  const [
    regRevToday,
    bookingRevToday,
    paymentRevToday,
    regRevMonth,
    bookingRevMonth,
    paymentRevMonth,
  ] = await Promise.all([
    prismaDb.registration.aggregate({
      _sum: { amount: true },
      where: { paymentStatus: "SUCCESS", createdAt: { gte: startOfToday } },
    }),
    prismaDb.rentalBooking.aggregate({
      _sum: { totalAmount: true },
      where: {
        paymentStatus: { in: ["SUCCESS", "REFUNDED"] },
        createdAt: { gte: startOfToday },
      },
    }),
    prismaDb.paymentLink.aggregate({
      _sum: { amount: true },
      where: {
        paymentStatus: { in: ["SUCCESS", "REFUNDED"] },
        createdAt: { gte: startOfToday },
      },
    }),

    prismaDb.registration.aggregate({
      _sum: { amount: true },
      where: { paymentStatus: "SUCCESS", createdAt: { gte: startOfMonth } },
    }),
    prismaDb.rentalBooking.aggregate({
      _sum: { totalAmount: true },
      where: {
        paymentStatus: { in: ["SUCCESS", "REFUNDED"] },
        createdAt: { gte: startOfMonth },
      },
    }),
    prismaDb.paymentLink.aggregate({
      _sum: { amount: true },
      where: {
        paymentStatus: { in: ["SUCCESS", "REFUNDED"] },
        createdAt: { gte: startOfMonth },
      },
    }),
  ]);

  const todayRevenue =
    (regRevToday._sum.amount || 0) +
    (bookingRevToday._sum.totalAmount || 0) +
    (paymentRevToday._sum.amount || 0);
  const monthRevenue =
    (regRevMonth._sum.amount || 0) +
    (bookingRevMonth._sum.totalAmount || 0) +
    (paymentRevMonth._sum.amount || 0);

  // 2. Key Metrics
  const [activeEvents, totalRegs, activeRentals, pendingInquiries] =
    await Promise.all([
      prismaDb.event.count({ where: { isActive: true } }),
      prismaDb.registration.count({ where: { paymentStatus: "SUCCESS" } }),
      prismaDb.rentalBooking.count({ where: { status: "CONFIRMED" } }),
      prismaDb.cycleClassInquiry.count({ where: { contacted: false } }),
    ]);

  // 3. Activity Feed
  const [recentRegs, recentBookings, recentPayments] = await Promise.all([
    prismaDb.registration.findMany({
      where: { paymentStatus: "SUCCESS" },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { event: { select: { title: true } } },
    }),
    prismaDb.rentalBooking.findMany({
      where: { paymentStatus: { in: ["SUCCESS", "REFUNDED"] } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { cycle: { select: { type: true } } },
    }),
    prismaDb.paymentLink.findMany({
      where: { paymentStatus: { in: ["SUCCESS", "REFUNDED"] } },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const allActivities = [
    ...recentRegs.map(
      (r: {
        id: string;
        name: string;
        amount: number;
        createdAt: Date;
        event?: { title: string };
      }) => ({
        id: `reg-${r.id}`,
        type: "REGISTRATION",
        title: `Registration for ${r.event?.title || "Event"}`,
        name: r.name,
        amount: r.amount,
        date: r.createdAt,
      }),
    ),
    ...recentBookings.map(
      (b: {
        id: string;
        name: string;
        totalAmount: number;
        createdAt: Date;
        cycle?: { type: string };
      }) => ({
        id: `book-${b.id}`,
        type: "BOOKING",
        title: `Rental Booking: ${b.cycle?.type || "Cycle"}`,
        name: b.name,
        amount: b.totalAmount,
        date: b.createdAt,
      }),
    ),
    ...recentPayments.map(
      (p: {
        id: string;
        name?: string;
        amount: number;
        purpose?: string;
        createdAt: Date;
      }) => ({
        id: `pay-${p.id}`,
        type: "PAYMENT",
        title: `Custom Payment`,
        name: p.name || "Someone",
        amount: p.amount,
        purpose: p.purpose,
        date: p.createdAt,
      }),
    ),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1
            style={{
              marginTop: 0,
              marginBottom: "0.5rem",
              fontSize: "2rem",
              color: "#fff",
            }}
          >
            Dashboard Overview
          </h1>
          <p style={{ color: "#aaa", margin: 0 }}>
            Here is what&apos;s happening across Wheelo.fit today.
          </p>
        </div>
        <div style={{ display: "flex", gap: "1rem" }}>
          <Link
            href="/admin/payment-links"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              background: "#1eb53a",
              color: "#fff",
              padding: "0.6rem 1.2rem",
              borderRadius: "8px",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Request Payment
          </Link>
        </div>
      </div>

      {/* Revenue Section - Only for SUPERADMIN */}
      {isSuperAdmin && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1.5rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              background: "#1a1a1a",
              padding: "2rem",
              borderRadius: "12px",
              border: "1px solid #333",
            }}
          >
            <h2
              style={{
                margin: "0 0 0.5rem 0",
                fontSize: "1rem",
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Today&apos;s Revenue
            </h2>
            <div
              style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#fff" }}
            >
              ₹{todayRevenue.toLocaleString("en-IN")}
            </div>
          </div>
          <div
            style={{
              background: "#1a1a1a",
              padding: "2rem",
              borderRadius: "12px",
              border: "1px solid #333",
            }}
          >
            <h2
              style={{
                margin: "0 0 0.5rem 0",
                fontSize: "1rem",
                color: "#888",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              This Month&apos;s Revenue
            </h2>
            <div
              style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#fff" }}
            >
              ₹{monthRevenue.toLocaleString("en-IN")}
            </div>
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "1.5rem",
          marginBottom: "2rem",
        }}
      >
        <div
          style={{
            background: "#1a1a1a",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid #333",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              background: "#3b82f622",
              color: "#3b82f6",
              padding: "1rem",
              borderRadius: "10px",
            }}
          >
            <Calendar size={28} />
          </div>
          <div>
            <h3
              style={{
                margin: "0 0 0.2rem 0",
                color: "#888",
                fontSize: "0.9rem",
                textTransform: "uppercase",
              }}
            >
              Active Events
            </h3>
            <div
              style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#fff" }}
            >
              {activeEvents}
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#1a1a1a",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid #333",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              background: "#10b98122",
              color: "#10b981",
              padding: "1rem",
              borderRadius: "10px",
            }}
          >
            <Users size={28} />
          </div>
          <div>
            <h3
              style={{
                margin: "0 0 0.2rem 0",
                color: "#888",
                fontSize: "0.9rem",
                textTransform: "uppercase",
              }}
            >
              Total Registrations
            </h3>
            <div
              style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#fff" }}
            >
              {totalRegs}
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#1a1a1a",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid #333",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              background: "#f59e0b22",
              color: "#f59e0b",
              padding: "1rem",
              borderRadius: "10px",
            }}
          >
            <Bike size={28} />
          </div>
          <div>
            <h3
              style={{
                margin: "0 0 0.2rem 0",
                color: "#888",
                fontSize: "0.9rem",
                textTransform: "uppercase",
              }}
            >
              Active Rentals
            </h3>
            <div
              style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#fff" }}
            >
              {activeRentals}
            </div>
          </div>
        </div>

        <div
          style={{
            background: "#1a1a1a",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid #333",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <div
            style={{
              background: "#ef444422",
              color: "#ef4444",
              padding: "1rem",
              borderRadius: "10px",
            }}
          >
            <MessageSquare size={28} />
          </div>
          <div>
            <h3
              style={{
                margin: "0 0 0.2rem 0",
                color: "#888",
                fontSize: "0.9rem",
                textTransform: "uppercase",
              }}
            >
              Pending Inquiries
            </h3>
            <div
              style={{ fontSize: "1.8rem", fontWeight: "bold", color: "#fff" }}
            >
              {pendingInquiries}
            </div>
          </div>
        </div>
      </div>

      <style>
        {`
          @media (max-width: 900px) {
            .dashboard-bottom-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      {/* Bottom Grid */}
      <div
        className="dashboard-bottom-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 300px",
          gap: "1.5rem",
        }}
      >
        {/* Unified Activity Feed */}
        <div
          style={{
            background: "#1a1a1a",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid #333",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h2 style={{ margin: 0, fontSize: "1.2rem", color: "#fff" }}>
              Recent Activity
            </h2>
          </div>

          {allActivities.length === 0 ? (
            <p style={{ color: "#888", fontSize: "0.9rem" }}>
              No recent activity.
            </p>
          ) : (
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              {allActivities.map((activity) => (
                <li
                  key={activity.id}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "1rem",
                    paddingBottom: "1rem",
                    borderBottom: "1px solid #222",
                  }}
                >
                  <div
                    style={{
                      padding: "0.8rem",
                      borderRadius: "8px",
                      background:
                        activity.type === "REGISTRATION"
                          ? "#3b82f622"
                          : activity.type === "BOOKING"
                            ? "#f59e0b22"
                            : "#8b5cf622",
                      color:
                        activity.type === "REGISTRATION"
                          ? "#3b82f6"
                          : activity.type === "BOOKING"
                            ? "#f59e0b"
                            : "#8b5cf6",
                    }}
                  >
                    {activity.type === "REGISTRATION" && <Users size={20} />}
                    {activity.type === "BOOKING" && <Bike size={20} />}
                    {activity.type === "PAYMENT" && <DollarSign size={20} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontWeight: "bold",
                        color: "#fff",
                        marginBottom: "0.2rem",
                      }}
                    >
                      {activity.title}
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#aaa" }}>
                      {activity.type === "REGISTRATION" && (
                        <>
                          {activity.name} registered{" "}
                          {isSuperAdmin && `and paid ₹${activity.amount}`}
                        </>
                      )}
                      {activity.type === "BOOKING" && (
                        <>
                          {activity.name} booked a cycle{" "}
                          {isSuperAdmin && `(₹${activity.amount})`}
                        </>
                      )}
                      {activity.type === "PAYMENT" && (
                        <>
                          {activity.name} made a custom payment{" "}
                          {isSuperAdmin && `of ₹${activity.amount}`}{" "}
                          {activity.purpose ? `for ${activity.purpose}` : ""}
                        </>
                      )}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#666",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {new Date(activity.date).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Quick Actions */}
        <div
          style={{
            background: "#1a1a1a",
            padding: "1.5rem",
            borderRadius: "12px",
            border: "1px solid #333",
          }}
        >
          <h2
            style={{
              margin: "0 0 1.5rem 0",
              fontSize: "1.2rem",
              color: "#fff",
            }}
          >
            Quick Links
          </h2>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}
          >
            <Link
              href="/admin/responses"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem",
                background: "#222",
                borderRadius: "8px",
                textDecoration: "none",
                color: "#ccc",
                transition: "background 0.2s",
              }}
            >
              <span>View Registrations</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/admin/rentals/bookings"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem",
                background: "#222",
                borderRadius: "8px",
                textDecoration: "none",
                color: "#ccc",
                transition: "background 0.2s",
              }}
            >
              <span>Manage Rentals</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/admin/cycle-classes"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem",
                background: "#222",
                borderRadius: "8px",
                textDecoration: "none",
                color: "#ccc",
                transition: "background 0.2s",
              }}
            >
              <span>Class Inquiries</span>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                {pendingInquiries > 0 && (
                  <span
                    style={{
                      background: "#ef4444",
                      color: "#fff",
                      padding: "2px 6px",
                      borderRadius: "10px",
                      fontSize: "0.7rem",
                      fontWeight: "bold",
                    }}
                  >
                    {pendingInquiries}
                  </span>
                )}
                <ArrowRight size={16} />
              </div>
            </Link>
            <Link
              href="/admin/manage-admins"
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem",
                background: "#222",
                borderRadius: "8px",
                textDecoration: "none",
                color: "#ccc",
                transition: "background 0.2s",
              }}
            >
              <span>Admin Settings</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
