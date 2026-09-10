import React from "react";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import AdminLayoutClient from "./components/AdminLayoutClient";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const sessionCookie = (await cookies()).get("admin_session")?.value;
  const session = await decrypt(sessionCookie);

  // If there's no session, it's likely the login page or middleware will handle it.
  const role = session?.role as string | undefined;
  const username = session?.username as string | undefined;

  return (
    <AdminLayoutClient role={role} username={username}>
      {children}
    </AdminLayoutClient>
  );
}
