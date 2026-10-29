import { describe, it, expect, vi, beforeEach } from "vitest";
// FIXED: Import the correct function name
import { evaluateQualificationRules } from "@/server/services/capability.service";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    assessmentAttempt: { findUnique: vi.fn() },
    qualificationRule: { findMany: vi.fn() },
    userCapability: { upsert: vi.fn() },
    capabilityHistory: { create: vi.fn() }
  }
}));

describe("Capability Service", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("returns ATTEMPT_NOT_FOUND if attempt is missing", async () => {
    vi.mocked(prisma.assessmentAttempt.findUnique).mockResolvedValue(null);
    // FIXED: Call the correct function name
    const result = await evaluateQualificationRules("fake-id");
    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.reason).toBe("ATTEMPT_NOT_FOUND");
  });

  it("returns ATTEMPT_NOT_GRADED if attempt has no score", async () => {
    vi.mocked(prisma.assessmentAttempt.findUnique).mockResolvedValue({ id: "a1", status: "SUBMITTED", score: null } as any);
    // FIXED: Call the correct function name
    const result = await evaluateQualificationRules("a1");
    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.reason).toBe("ATTEMPT_NOT_GRADED");
  });
});