import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { PaymentProvider } from "@prisma/client";

const withdrawalSchema = z.object({
  amount: z.number().min(10, "Minimum withdrawal is $10"),
  method: z.nativeEnum(PaymentProvider),
  paymentDetail: z.string().min(1, "Payment details are required"), // New field validation
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = withdrawalSchema.parse(body);
    
    const amountCents = Math.round(validatedData.amount * 100); 
    const method = validatedData.method;
    const paymentDetail = validatedData.paymentDetail;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { wallet: true }, 
    });

    if (!user || !user.wallet) {
      return NextResponse.json({ error: "Wallet not found" }, { status: 404 });
    }

    if (user.wallet.balanceCents < amountCents) {
      return NextResponse.json({ error: "Insufficient balance" }, { status: 400 });
    }

    const feeCents = 0;
    const netCents = amountCents - feeCents;

    const result = await prisma.$transaction([
      prisma.wallet.update({
        where: { userId: user.id },
        data: { 
          balanceCents: { decrement: amountCents },
          pendingCents: { increment: amountCents } 
        },
      }),
      prisma.withdrawal.create({
        data: {
          userId: user.id,
          amountCents: amountCents,
          feeCents: feeCents,
          netCents: netCents,
          provider: method,
          status: "REQUESTED",
          // Save the new payment detail! 
          // Note: Depending on your schema, you might want to add this to the "metadata" or "providerPayload" JSON field, or a new dedicated string field.
          // If your schema doesn't have a dedicated field, we can just append it to the notes.
          reviewNotes: `Payout Detail (${method}): ${paymentDetail}`
        },
      }),
    ]);

    return NextResponse.json(
      { message: "Withdrawal request submitted successfully", data: result[1] },
      { status: 201 }
    );

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("[WITHDRAWAL_POST]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}