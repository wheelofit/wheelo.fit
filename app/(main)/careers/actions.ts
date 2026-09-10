"use server";

import prisma from "@/lib/prisma";

export async function submitJobApplication(
  jobPostingId: string,
  data: { name: string; email: string; phone: string; resumeLink: string },
) {
  // Check for duplicate application by email or phone for this specific job posting
  const existingApp = await prisma.jobApplication.findFirst({
    where: {
      jobPostingId,
      OR: [{ email: data.email }, { phone: data.phone }],
    },
  });

  if (existingApp) {
    return {
      success: false,
      message:
        "An application with this email or phone number has already been submitted for this position.",
    };
  }

  // Create application
  await prisma.jobApplication.create({
    data: {
      jobPostingId,
      ...data,
    },
  });

  return {
    success: true,
    message: "Your application has been submitted successfully!",
  };
}
