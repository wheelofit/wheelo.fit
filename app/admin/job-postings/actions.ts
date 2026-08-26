'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getJobPostings() {
  return await prisma.jobPosting.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

export async function createJobPosting(data: { title: string; description: string; isActive: boolean }) {
  await prisma.jobPosting.create({
    data
  });
  revalidatePath('/admin/job-postings');
  revalidatePath('/careers');
}

export async function updateJobPosting(id: string, data: { title: string; description: string; isActive: boolean }) {
  await prisma.jobPosting.update({
    where: { id },
    data
  });
  revalidatePath('/admin/job-postings');
  revalidatePath('/careers');
}

export async function deleteJobPosting(id: string) {
  await prisma.jobApplication.deleteMany({
    where: { jobPostingId: id }
  });

  await prisma.jobPosting.delete({
    where: { id }
  });
  revalidatePath('/admin/job-postings');
  revalidatePath('/careers');
}
