import { NextResponse } from "next/server";
import { rejectSubmission } from "@/server/services/review.service";
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
    
    const result = await rejectSubmission(
      resolvedParams.submissionId,
      session.user.id,
      { comment: body.comment || "Rejected by admin" }
    );

    if (result.ok === false) {
      const statusMap: Record<string, number> = {
        SUBMISSION_NOT_FOUND: 404,
        ALREADY_REVIEWED: 400,
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