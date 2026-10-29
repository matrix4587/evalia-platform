import { describe, it, expect, vi, beforeEach } from "vitest";
import { approveSubmission, rejectSubmission } from "@/server/services/review.service";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    taskSubmission: { findUnique: vi.fn() },
    taskReview: { create: vi.fn() },
    taskAssignment: { update: vi.fn() },
    wallet: { update: vi.fn() },
    transaction: { create: vi.fn() },
    $transaction: vi.fn((cb) => cb(prisma))
  }
}));

describe("Review Service", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("returns SUBMISSION_NOT_FOUND if submission is missing (approve)", async () => {
    vi.mocked(prisma.taskSubmission.findUnique).mockResolvedValue(null);
    const result = await approveSubmission("fake-id", "rev-1", { score: 90 });
    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.reason).toBe("SUBMISSION_NOT_FOUND");
  });

  it("returns ALREADY_REVIEWED if reviewer already reviewed", async () => {
    vi.mocked(prisma.taskSubmission.findUnique).mockResolvedValue({
      id: "sub-1", reviews: [{ reviewerId: "rev-1" }]
    } as any);
    const result = await approveSubmission("sub-1", "rev-1", { score: 90 });
    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.reason).toBe("ALREADY_REVIEWED");
  });

  it("returns SUBMISSION_NOT_FOUND if submission is missing (reject)", async () => {
    vi.mocked(prisma.taskSubmission.findUnique).mockResolvedValue(null);
    const result = await rejectSubmission("fake-id", "rev-1", { comment: "bad" });
    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.reason).toBe("SUBMISSION_NOT_FOUND");
  });
});