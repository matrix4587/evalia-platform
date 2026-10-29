import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const resolvedParams = await params;
    
    const assessment = await prisma.assessment.findUnique({
      where: { slug: resolvedParams.slug },
      include: {
        questions: {
          include: {
            options: true // Include the full option details, including isCorrect
          }
        }
      }
    });

    if (!assessment) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    return NextResponse.json(assessment);
  } catch (error) {
    return NextResponse.json({ error: "Internal Error" }, { status: 500 });
  }
}