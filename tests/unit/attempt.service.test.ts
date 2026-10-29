import { describe, it, expect, vi, beforeEach } from "vitest";
import { startAttempt, saveAnswer } from "@/server/services/attempt.service";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    assessment: { findUnique: vi.fn() },
    assessmentAttempt: { findFirst: vi.fn(), create: vi.fn(), findUnique: vi.fn(), update: vi.fn() },
    question: { findMany: vi.fn() },
    assessmentAnswer: { upsert: vi.fn() }
  }
}));

describe("Attempt Service", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("should return NOT_FOUND if assessment doesn't exist", async () => {
    vi.mocked(prisma.assessment.findUnique).mockResolvedValue(null);
    const result = await startAttempt("fake-slug", "user-1");
    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.reason).toBe("NOT_FOUND");
  });

  it("should return ATTEMPTS_EXHAUSTED if user has max attempts", async () => {
    vi.mocked(prisma.assessment.findUnique).mockResolvedValue({ id: "a1", maxAttempts: 1, status: "PUBLISHED" } as any);
    vi.mocked(prisma.assessmentAttempt.findFirst).mockResolvedValue({ id: "att1" } as any);
    const result = await startAttempt("fake-slug", "user-1");
    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.reason).toBe("ATTEMPTS_EXHAUSTED");
  });

  it("should return ATTEMPT_NOT_FOUND if saving answer to non-existent attempt", async () => {
    vi.mocked(prisma.assessmentAttempt.findUnique).mockResolvedValue(null);
    // FIX: Added questionId and response as separate arguments
    const result = await saveAnswer("fake-id", "user-1", "q1", { answer: "test" });
    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.reason).toBe("ATTEMPT_NOT_FOUND");
  });

  it("should return ATTEMPT_NOT_EDITABLE if attempt is submitted", async () => {
    vi.mocked(prisma.assessmentAttempt.findUnique).mockResolvedValue({ id: "att1", status: "SUBMITTED", userId: "user-1" } as any);
    // FIX: Added questionId and response
    const result = await saveAnswer("att1", "user-1", "q1", { answer: "test" });
    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.reason).toBe("ATTEMPT_NOT_EDITABLE");
  });

  it("should return QUESTION_NOT_IN_ASSESSMENT if question doesn't belong", async () => {
    vi.mocked(prisma.assessmentAttempt.findUnique).mockResolvedValue({ id: "att1", status: "IN_PROGRESS", userId: "user-1", assessmentId: "a1" } as any);
    vi.mocked(prisma.question.findMany).mockResolvedValue([]);
    // FIX: Added questionId and response
    const result = await saveAnswer("att1", "user-1", "q1", { answer: "test" });
    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.reason).toBe("QUESTION_NOT_IN_ASSESSMENT");
  });
});