import { PrismaClient, ReviewStatus, ReviewType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type ApproveResult = 
  | { ok: true; paymentCents: number; transactionId: string; reviewId: string; }
  | { ok: false; reason: string };

export type RejectResult = 
  | { ok: true; reviewId: string; }
  | { ok: false; reason: string };

export async function approveSubmission(
  submissionId: string,
  reviewerId: string,
  data: { score: number; comment?: string }
): Promise<ApproveResult> {
  try {
    const submission = await prisma.taskSubmission.findUnique({
      where: { id: submissionId },
      include: {
        task: { include: { project: true } },
        user: true,
        reviews: true
      }
    });

    if (!submission) return { ok: false, reason: "SUBMISSION_NOT_FOUND" };

    const existingReview = submission.reviews.find(r => r.reviewerId === reviewerId);
    if (existingReview) return { ok: false, reason: "ALREADY_REVIEWED" };

    const threshold = submission.task.project.qualityThreshold || 80;
    if (data.score < threshold) return { ok: false, reason: "BELOW_QUALITY_THRESHOLD" };

    const ratePerHour = submission.task.ratePerHourCents || 1000;
    const estimatedMinutes = submission.task.estimatedMinutes || 10;
    const paymentCents = Math.round((ratePerHour / 60) * estimatedMinutes);

    const result = await prisma.$transaction(async (tx) => {
      const review = await tx.taskReview.create({
        data: {
          submissionId: submission.id,
          taskId: submission.taskId,
          reviewerId: reviewerId,
          type: "ADMIN",
          status: "APPROVED",
          score: data.score,
          comment: data.comment || "Approved by admin",
          reviewedAt: new Date(),
        }
      });

      await tx.taskSubmission.update({
        where: { id: submission.id },
        data: { qualityScore: data.score, isCorrect: true }
      });

      await tx.taskAssignment.update({
        where: { id: submission.assignmentId },
        data: { status: "COMPLETED", completedAt: new Date() }
      });

      await tx.wallet.update({
        where: { userId: submission.userId },
        data: {
          balanceCents: { increment: paymentCents },
          lifetimeEarningsCents: { increment: paymentCents }
        }
      });

      const transaction = await tx.transaction.create({
        data: {
          userId: submission.userId,
          type: "TASK_EARNING",
          amountCents: paymentCents,
          description: `Earnings for task: ${submission.task.title}`,
          taskId: submission.taskId,
          submissionId: submission.id,
          reviewId: review.id,
        }
      });

      return { review, transaction };
    });

    return { ok: true, paymentCents, transactionId: result.transaction.id, reviewId: result.review.id };
  } catch (error) {
    console.error("[APPROVE_SUBMISSION]", error);
    return { ok: false, reason: "INTERNAL_ERROR" };
  }
}

export async function rejectSubmission(
  submissionId: string,
  reviewerId: string,
  data: { comment: string }
): Promise<RejectResult> {
  try {
    const submission = await prisma.taskSubmission.findUnique({
      where: { id: submissionId },
      include: { reviews: true }
    });

    if (!submission) return { ok: false, reason: "SUBMISSION_NOT_FOUND" };

    const existingReview = submission.reviews.find(r => r.reviewerId === reviewerId);
    if (existingReview) return { ok: false, reason: "ALREADY_REVIEWED" };

    const review = await prisma.$transaction(async (tx) => {
      const newReview = await tx.taskReview.create({
        data: {
          submissionId: submission.id,
          taskId: submission.taskId,
          reviewerId: reviewerId,
          type: "ADMIN",
          status: "REJECTED",
          comment: data.comment,
          reviewedAt: new Date(),
        }
      });

      await tx.taskSubmission.update({
        where: { id: submission.id },
        data: { isCorrect: false }
      });

      await tx.taskAssignment.update({
        where: { id: submission.assignmentId },
        // FIX: Changed "REJECTED" to "ABANDONED" based on your Prisma Schema
        data: { status: "ABANDONED" } 
      });

      return newReview;
    });

    return { ok: true, reviewId: review.id };
  } catch (error) {
    console.error("[REJECT_SUBMISSION]", error);
    return { ok: false, reason: "INTERNAL_ERROR" };
  }
}