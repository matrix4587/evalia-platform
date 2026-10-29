import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    const { answers } = await req.json(); // Array of { questionId, selectedOption }

    const assessment = await prisma.assessment.findUnique({
      where: { slug: resolvedParams.slug },
      include: {
        questions: { include: { options: true } },
        rules: true,
      }
    });

    if (!assessment) return NextResponse.json({ error: "Assessment not found" }, { status: 404 });

    // Calculate score
    let correctCount = 0;
    const totalQuestions = assessment.questions.length;

    assessment.questions.forEach((q) => {
      const userAnswer = answers.find((a: any) => a.questionId === q.id);
      if (userAnswer) {
        const correctOption = q.options.find(o => o.isCorrect);
        if (correctOption && userAnswer.selectedOption === correctOption.label) {
          correctCount++;
        }
      }
    });

    const scorePercentage = (correctCount / totalQuestions) * 100;
    const passed = scorePercentage >= 80; // Condition 3: 80% to pass

    // Save the attempt
    const attempt = await prisma.assessmentAttempt.create({
      data: {
        assessmentId: assessment.id,
        userId: session.user.id,
        status: "GRADED",
        score: scorePercentage,
        submittedAt: new Date(),
        gradedAt: new Date(),
      }
    });

    // If passed, grant the capability
    if (passed && assessment.rules.length > 0) {
      const rule = assessment.rules[0];
      await prisma.userCapability.upsert({
        where: { userId_capabilityId: { userId: session.user.id, capabilityId: rule.capabilityId } },
        update: { level: rule.targetLevel, score: scorePercentage },
        create: {
          userId: session.user.id,
          capabilityId: rule.capabilityId,
          level: rule.targetLevel,
          score: scorePercentage,
          sourceRuleId: rule.id,
        }
      });
    }

    return NextResponse.json({ 
      success: true, 
      score: scorePercentage, 
      passed,
      correctCount,
      totalQuestions
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}