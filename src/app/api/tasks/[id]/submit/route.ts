import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const { answers, timeSpentSeconds } = await req.json();

    const task = await prisma.task.findUnique({
      where: { id: resolvedParams.id }
    });

    if (!task) return NextResponse.json({ error: "Task not found" }, { status: 404 });

    const existingAssignment = await prisma.taskAssignment.findFirst({
      where: { taskId: task.id, userId: session.user.id }
    });

    if (existingAssignment) {
      return NextResponse.json({ error: "Task already completed" }, { status: 400 });
    }

    // 1. Calculate earnings based on TIME SPENT
    const ratePerHour = task.ratePerHourCents || 1000;
    const ratePerSecond = ratePerHour / 3600;
    
    // Ensure minimum pay of 1 minute (60 seconds) so users don't get $0.01
    const billableSeconds = Math.max(timeSpentSeconds || 0, 60); 
    const earningsCents = Math.round(ratePerSecond * billableSeconds);

    // 2. Run database transaction
    await prisma.$transaction([
      // Record the assignment WITH the time spent
      prisma.taskAssignment.create({
        data: {
          taskId: task.id,
          userId: session.user.id,
          status: "COMPLETED",
          completedAt: new Date(),
          activeSeconds: billableSeconds, // This is the crucial field
        }
      }),
      
      prisma.taskSubmission.create({
        data: {
          taskId: task.id,
          userId: session.user.id,
          response: answers,
          qualityScore: 100,
        }
      }),

      prisma.wallet.update({
        where: { userId: session.user.id },
        data: {
          balanceCents: { increment: earningsCents },
          lifetimeEarningsCents: { increment: earningsCents },
        }
      }),

      prisma.transaction.create({
        data: {
          userId: session.user.id,
          type: "TASK_EARNING",
          amountCents: earningsCents,
          // Use a standard description without the time appended
          description: `Earnings for task: ${task.title}`, 
        }
      }),

      prisma.task.update({
        where: { id: task.id },
        data: { status: "APPROVED" }
      })
    ]);

    return NextResponse.json({ success: true, earnedCents: earningsCents });
  } catch (error) {
    console.error("[TASK_SUBMIT]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}