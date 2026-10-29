import { NextResponse } from "next/server";
import { submitAttempt } from "@/server/services/attempt.service";
import { auth } from "@/auth";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const resolvedParams = await params;
    const result = await submitAttempt(resolvedParams.id, session.user.id);

    if (result.ok === false) {
      const statusMap: Record<string, number> = {
        ATTEMPT_NOT_FOUND: 404,
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