import React from "react";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { redirect } from "next/navigation";
import CreateAdminForm from "./CreateAdminForm";
import AdminListItem from "./AdminListItem";
import prisma from "@/lib/prisma";
import styles from "../admin.module.css";

export default async function ManageAdminsPage() {
  const sessionCookie = (await cookies()).get("admin_session")?.value;
  const session = await decrypt(sessionCookie);

  if (session?.role !== "SUPERADMIN") {
    redirect("/admin");
  }

  const admins = await prisma.adminUser.findMany({
    select: { id: true, username: true, role: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Manage Admins</h1>
      <p style={{ color: "#aaa", marginBottom: "2rem" }}>
        Create new standard Admin accounts. Standard Admins have access to all
        features except this page.
      </p>

      <div className={styles.twoColumnGrid}>
        <div
          style={{
            background: "#1a1a1a",
            padding: "2rem",
            borderRadius: "8px",
            border: "1px solid #333",
          }}
        >
          <h2
            style={{ marginTop: 0, marginBottom: "1.5rem", fontSize: "1.2rem" }}
          >
            Create New Admin
          </h2>
          <CreateAdminForm />
        </div>

        <div
          style={{
            background: "#1a1a1a",
            padding: "2rem",
            borderRadius: "8px",
            border: "1px solid #333",
          }}
        >
          <h2
            style={{ marginTop: 0, marginBottom: "1.5rem", fontSize: "1.2rem" }}
          >
            Existing Admins
          </h2>
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
            {admins.map(
              (admin: {
                id: string;
                username: string;
                role: string;
                createdAt: Date;
              }) => (
                <AdminListItem
                  key={admin.id}
                  admin={admin}
                  currentUsername={session?.username as string}
                />
              ),
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
