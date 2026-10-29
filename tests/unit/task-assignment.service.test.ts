import { describe, it, expect, vi, beforeEach } from "vitest";
import { acceptTask } from "@/server/services/task-assignment.service";
import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    task: { findUnique: vi.fn() },
    taskAssignment: { count: vi.fn(), create: vi.fn(), findFirst: vi.fn() },
    userCapability: { findMany: vi.fn() }
  }
}));

describe("Task Assignment Service", () => {
  beforeEach(() => { vi.clearAllMocks(); });

  it("returns TASK_NOT_FOUND if task is missing", async () => {
    vi.mocked(prisma.task.findUnique).mockResolvedValue(null);
    const result = await acceptTask("fake-id", "user-1");
    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.reason).toBe("TASK_NOT_FOUND");
  });

  it("returns TASK_NOT_AVAILABLE if task status is not AVAILABLE", async () => {
    vi.mocked(prisma.task.findUnique).mockResolvedValue({ id: "t1", status: "APPROVED", project: { status: "ACTIVE" } } as any);
    const result = await acceptTask("t1", "user-1");
    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.reason).toBe("TASK_NOT_AVAILABLE");
  });

  it("returns PROJECT_NOT_ACTIVE if project is paused", async () => {
    vi.mocked(prisma.task.findUnique).mockResolvedValue({ id: "t1", status: "AVAILABLE", project: { status: "PAUSED" } } as any);
    const result = await acceptTask("t1", "user-1");
    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.reason).toBe("PROJECT_NOT_ACTIVE");
  });

  it("returns TASK_FULL if max assignments reached", async () => {
    vi.mocked(prisma.task.findUnique).mockResolvedValue({ id: "t1", status: "AVAILABLE", maxAssignments: 1, project: { status: "ACTIVE" } } as any);
    vi.mocked(prisma.taskAssignment.count).mockResolvedValue(1);
    const result = await acceptTask("t1", "user-1");
    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.reason).toBe("TASK_FULL");
  });

  it("returns NOT_QUALIFIED if user lacks capabilities", async () => {
    vi.mocked(prisma.task.findUnique).mockResolvedValue({ 
      id: "t1", status: "AVAILABLE", maxAssignments: 5, project: { status: "ACTIVE" },
      requirements: [{ capabilityId: "c1" }] 
    } as any);
    vi.mocked(prisma.taskAssignment.count).mockResolvedValue(0);
    vi.mocked(prisma.userCapability.findMany).mockResolvedValue([]);
    const result = await acceptTask("t1", "user-1");
    expect(result.ok).toBe(false);
    if (result.ok === false) expect(result.reason).toBe("NOT_QUALIFIED");
  });
});