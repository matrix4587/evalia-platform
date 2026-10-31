import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const body = await req.json();
    const userAnswers = body.answers; 

    console.log("=== 🚀 SUBMIT ASSESSMENT START ===");
    console.log("Assessment Slug:", resolvedParams.slug);
    console.log("User Answers Received:", JSON.stringify(userAnswers, null, 2));

    if (!userAnswers || !Array.isArray(userAnswers)) {
      return NextResponse.json({ error: "Invalid answers format" }, { status: 400 });
    }

    const assessment = await prisma.assessment.findUnique({
      where: { slug: resolvedParams.slug },
      include: {
        questions: {
          include: {
            options: true
          }
        }
      }
    });

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    let correctCount = 0;
    const totalQuestions = assessment.questions.length;

    console.log(`Assessment has ${totalQuestions} questions.`);

    assessment.questions.forEach((question) => {
      const userAnswer = userAnswers.find((a: any) => a.questionId === question.id);
      
      if (userAnswer) {
        const correctOption = question.options.find(opt => opt.isCorrect);
        
        console.log(`--- Question: ${question.id} ---`);
        console.log(`User Selected: "${userAnswer.selectedOption}"`);
        console.log(`Correct Option Label from DB: "${correctOption?.label}"`);
        
        if (correctOption && userAnswer.selectedOption === correctOption.label) {
          console.log("✅ MATCH: Correct answer!");
          correctCount++;
        } else {
          console.log("❌ MISMATCH: Incorrect answer.");
        }
      } else {
        console.log(`⚠️ No answer found for question: ${question.id}`);
      }
    });

    const scorePercentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const passed = scorePercentage >= assessment.passingScore;

    console.log(`Final Score: ${scorePercentage}%. Passed: ${passed}`);

    await prisma.assessmentAttempt.create({
      data: {
        assessmentId: assessment.id,
        userId: session.user.id,
        status: "GRADED",
        score: scorePercentage,
        submittedAt: new Date(),
        gradedAt: new Date(),
      }
    });

    if (passed) {
      const rule = await prisma.qualificationRule.findFirst({
        where: { assessmentId: assessment.id }
      });

      if (rule) {
        await prisma.userCapability.upsert({
          where: { 
            userId_capabilityId: { 
              userId: session.user.id, 
              capabilityId: rule.capabilityId 
            } 
          },
          update: { 
            level: rule.targetLevel, 
            score: scorePercentage 
          },
          create: {
            userId: session.user.id,
            capabilityId: rule.capabilityId,
            level: rule.targetLevel,
            score: scorePercentage,
            sourceRuleId: rule.id,
          }
        });
      }
    }

    return NextResponse.json({ 
      success: true, 
      score: scorePercentage, 
      passed,
      correctCount,
      totalQuestions
    });

  } catch (error) {
    console.error("[ASSESSMENT_SUBMIT]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}