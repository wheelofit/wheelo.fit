"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getTestimonials() {
  return await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createTestimonial(data: {
  name: string;
  role?: string;
  content: string;
  rating: number;
  avatarUrl?: string;
  isActive: boolean;
}) {
  await prisma.testimonial.create({
    data,
  });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function updateTestimonial(
  id: string,
  data: {
    name: string;
    role?: string;
    content: string;
    rating: number;
    avatarUrl?: string;
    isActive: boolean;
  },
) {
  await prisma.testimonial.update({
    where: { id },
    data,
  });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}

export async function deleteTestimonial(id: string) {
  await prisma.testimonial.delete({
    where: { id },
  });
  revalidatePath("/admin/testimonials");
  revalidatePath("/");
}
