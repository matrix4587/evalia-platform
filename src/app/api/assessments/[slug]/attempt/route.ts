import { NextResponse } from "next/server";
import { getAssessmentAttemptsForUser } from "@/server/services/assessment.service"; 
import { auth } from "@/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    
    // The service returns an Array of attempts, not a result object
    const attempts = await getAssessmentAttemptsForUser(session.user.id, resolvedParams.slug);

    // Example logic: Check if the user has exhausted their attempts
    // (Assuming maxAttempts is 1 for this example, you can adjust based on your rules)
    if (attempts && attempts.length >= 1) {
      return NextResponse.json(
        { error: "ATTEMPTS_EXHAUSTED", message: "You have no attempts remaining." },
        { status: 400 }
      );
    }

    // If everything is fine, return the attempts (or a success message)
    return NextResponse.json({ 
      success: true, 
      message: "Attempt verified successfully.",
      attempts 
    });

  } catch (error) {
    console.error("[ASSESSMENT_ATTEMPT]", error);
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}