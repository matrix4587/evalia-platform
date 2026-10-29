import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Wallet } from "lucide-react";
import { DynamicTaskForm } from "./dynamic-task-form"; // We'll create this next

export default async function TaskPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const resolvedParams = await params;

  const task = await prisma.task.findUnique({
    where: { id: resolvedParams.id },
  });

  if (!task) notFound();

  // Check if already completed
  const existingAssignment = await prisma.taskAssignment.findFirst({
    where: { taskId: task.id, userId: session.user.id }
  });

  if (existingAssignment) {
    return (
      <div className="max-w-3xl mx-auto mt-10 text-center space-y-4">
        <h1 className="text-2xl font-bold">Task Already Completed</h1>
        <p className="text-slate-500">You have already submitted this task.</p>
        <Button asChild><Link href="/tasks">Back to Tasks</Link></Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/tasks"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{task.title}</h1>
            <p className="text-slate-500">Complete this task to earn rewards.</p>
          </div>
        </div>
        <div className="flex gap-4 text-sm font-bold text-slate-600 bg-slate-100 px-4 py-2 rounded-lg">
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {task.estimatedMinutes} min</span>
          <span className="flex items-center gap-1"><Wallet className="w-4 h-4" /> ${(task.ratePerHourCents || 0)/100}/hr</span>
        </div>
      </div>

      {/* Pass the task data to the Client Component Form */}
      <DynamicTaskForm task={task} />
    </div>
  );
}