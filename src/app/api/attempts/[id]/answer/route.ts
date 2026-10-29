import { NextResponse } from "next/server";
import { saveAnswer } from "@/server/services/attempt.service";
import { auth } from "@/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const resolvedParams = await params;
    const body = await req.json();
    
    // FIX: Added body.questionId as the 3rd argument and body.response as the 4th
    const result = await saveAnswer(
      resolvedParams.id, 
      session.user.id, 
      body.questionId, 
      body.response
    );

    if (result.ok === false) {
      const statusMap: Record<string, number> = {
        ATTEMPT_NOT_FOUND: 404,
        ATTEMPT_NOT_EDITABLE: 400,
        QUESTION_NOT_IN_ASSESSMENT: 400,
        INTERNAL_ERROR: 500
      };
      return NextResponse.json({ error: result.reason }, { status: statusMap[result.reason] || 500 });
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}