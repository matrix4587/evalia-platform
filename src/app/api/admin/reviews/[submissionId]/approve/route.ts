import { NextResponse } from "next/server";
import { approveSubmission } from "@/server/services/review.service";
import { auth } from "@/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ submissionId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const body = await req.json();
    
    const result = await approveSubmission(
      resolvedParams.submissionId,
      session.user.id,
      { score: body.score, comment: body.comment }
    );

    // FIX: Check result.ok === false to narrow the type
    if (result.ok === false) {
      const statusMap: Record<string, number> = {
        SUBMISSION_NOT_FOUND: 404,
        ALREADY_REVIEWED: 400,
        BELOW_QUALITY_THRESHOLD: 400,
        INTERNAL_ERROR: 500
      };
      return NextResponse.json(
        { error: result.reason },
        { status: statusMap[result.reason] || 500 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}