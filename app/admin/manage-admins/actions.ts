"use server";

import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function createAdmin(formData: FormData) {
  const sessionCookie = (await cookies()).get("admin_session")?.value;
  const session = await decrypt(sessionCookie);

  if (session?.role !== "SUPERADMIN") {
    return { error: "Unauthorized. Only Super Admins can create new admins." };
  }

  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  if (!username || !password || password.length < 6) {
    return { error: "Username and password (min 6 chars) are required" };
  }

  try {
    const existingUser = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (existingUser) {
      return { error: "Username already exists" };
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.adminUser.create({
      data: {
        username,
        passwordHash,
        role: "ADMIN", // Only standard admins can be created here
      },
    });

    revalidatePath("/admin/manage-admins");
    return { success: "Admin created successfully!" };
  } catch {
    return { error: "Failed to create admin" };
  }
}

export async function deleteAdmin(adminId: string) {
  const sessionCookie = (await cookies()).get("admin_session")?.value;
  const session = await decrypt(sessionCookie);

  if (session?.role !== "SUPERADMIN") {
    return { error: "Unauthorized." };
  }

  try {
    const adminToDelete = await prisma.adminUser.findUnique({
      where: { id: adminId },
    });

    if (!adminToDelete) {
      return { error: "Admin not found." };
    }

    if (adminToDelete.username === session?.username) {
      return { error: "You cannot delete your own account." };
    }

    await prisma.adminUser.delete({
      where: { id: adminId },
    });

    revalidatePath("/admin/manage-admins");
    return { success: "Admin deleted successfully!" };
  } catch {
    return { error: "Failed to delete admin." };
  }
}

export async function editAdmin(adminId: string, formData: FormData) {
  const sessionCookie = (await cookies()).get("admin_session")?.value;
  const session = await decrypt(sessionCookie);

  if (session?.role !== "SUPERADMIN") {
    return { error: "Unauthorized." };
  }

  const username = formData.get("username") as string;
  const role = formData.get("role") as string;
  const password = formData.get("password") as string;

  if (!username || !role) {
    return { error: "Username and role are required." };
  }

  try {
    const existingUser = await prisma.adminUser.findFirst({
      where: {
        username,
        id: { not: adminId },
      },
    });

    if (existingUser) {
      return { error: "Username already exists." };
    }

    const updateData: Record<string, string> = { username, role };

    if (password && password.length >= 6) {
      updateData.passwordHash = await bcrypt.hash(password, 10);
    } else if (password && password.length < 6) {
      return { error: "Password must be at least 6 characters." };
    }

    await prisma.adminUser.update({
      where: { id: adminId },
      data: updateData,
    });

    revalidatePath("/admin/manage-admins");
    return { success: "Admin updated successfully!" };
  } catch {
    return { error: "Failed to update admin." };
  }
}
