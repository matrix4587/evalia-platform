import { describe, it, expect, vi, beforeEach } from "vitest";
// FIXED: Import the correct function name
import { listAvailableTasksForUser } from "@/server/services/task.service";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findUnique: vi.fn() },
    task: { findMany: vi.fn() }
  }
}));

describe("Task Service", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("returns a list of available tasks", async () => {
    // Since the function is listAvailableTasksForUser, we call it with a user ID
    vi.mocked(prisma.task.findMany).mockResolvedValue([]);
    const result = await listAvailableTasksForUser("user-1");
    expect(result).toBeDefined();
  });
});