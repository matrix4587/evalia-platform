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
    // The frontend sends an array like: [{ questionId: '...', selectedOption: 'Positive' }]
    const userAnswers = body.answers; 

    if (!userAnswers || !Array.isArray(userAnswers)) {
      return NextResponse.json({ error: "Invalid answers format" }, { status: 400 });
    }

    // 1. Fetch the assessment WITH the correct answers from the database
    const assessment = await prisma.assessment.findUnique({
      where: { slug: resolvedParams.slug },
      include: {
        questions: {
          include: {
            options: true // We need the options to check which one is correct
          }
        }
      }
    });

    if (!assessment) {
      return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
    }

    // 2. Grade the assessment
    let correctCount = 0;
    const totalQuestions = assessment.questions.length;

    assessment.questions.forEach((question) => {
      // Find the user's answer for this question
      const userAnswer = userAnswers.find((a: any) => a.questionId === question.id);
      
      if (userAnswer) {
        // Find the correct option from the database
        const correctOption = question.options.find(opt => opt.isCorrect);
        
        // Compare the user's selected label to the correct option's label
        if (correctOption && userAnswer.selectedOption === correctOption.label) {
          correctCount++;
        }
      }
    });

    const scorePercentage = totalQuestions > 0 ? (correctCount / totalQuestions) * 100 : 0;
    const passed = scorePercentage >= assessment.passingScore;

    // 3. Save the attempt
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

    // 4. If passed, grant the capability
    if (passed) {
      // Find the rule that grants the capability for this assessment
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

    // 5. Return the result to the frontend
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