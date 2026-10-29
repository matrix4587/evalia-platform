import { auth } from "@/auth"; 
import { prisma } from "@/lib/prisma"; 
import { redirect } from "next/navigation";
import { WithdrawalForm } from "./withdrawal-form";
import { Card } from "@/components/ui/card";
import { Info } from "lucide-react";

export default async function WithdrawalsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const wallet = await prisma.wallet.findUnique({
    where: { userId: session.user.id },
  });

  const recentWithdrawals = await prisma.withdrawal.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const balanceCents = wallet?.balanceCents || 0;

  return (
    <div className="p-4 md:p-8">
      <div className="mx-auto max-w-5xl space-y-5">
        
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Withdrawals</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage your earnings and request payouts to your preferred payment method.
          </p>
        </div>

        {/* Compact Info & Balance Row */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="shadow-sm border-slate-200 p-4 flex flex-col justify-center space-y-0.5 md:col-span-1">
            <p className="text-xs font-medium text-slate-500">Available Balance</p>
            <h3 className="text-2xl font-bold text-slate-900">
              ${(balanceCents / 100).toFixed(2)}
            </h3>
            <p className="text-[11px] text-slate-500">Ready for withdrawal</p>
          </Card>

          <Card className="shadow-sm border-slate-200 p-4 bg-blue-50/50 md:col-span-2 flex items-center">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-blue-100 text-blue-600 rounded-full mt-0.5">
                <Info size={16} />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900">Withdrawal Rules</h4>
                <ul className="text-xs text-slate-600 space-y-0.5 list-disc list-inside mt-1">
                  <li>Minimum withdrawal amount is <strong>$10.00 USD</strong>.</li>
                  <li>Payouts are processed within 1-3 business days.</li>
                  <li>No hidden fees for bank transfers or M-Pesa.</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>

        <WithdrawalForm availableBalanceCents={balanceCents} />

        {/* History Table */}
        <div className="space-y-2 pt-2">
          <h3 className="text-lg font-semibold tracking-tight text-slate-900">Recent Withdrawals</h3>
          
          <Card className="shadow-sm border-slate-200 overflow-hidden">
            {recentWithdrawals.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-500">
                You have no recent withdrawal requests.
              </div>
            ) : (
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm text-left">
                  <thead className="bg-slate-50 [&_tr]:border-b border-slate-200">
                    <tr className="border-b transition-colors hover:bg-slate-100/50">
                      <th className="h-10 px-4 align-middle font-medium text-slate-500">Date</th>
                      <th className="h-10 px-4 align-middle font-medium text-slate-500">Amount</th>
                      <th className="h-10 px-4 align-middle font-medium text-slate-500">Method</th>
                      <th className="h-10 px-4 align-middle font-medium text-slate-500">Status</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {recentWithdrawals.map((w) => (
                      <tr key={w.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                        <td className="p-3 align-middle text-xs text-slate-600">
                          {new Date(w.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 align-middle text-xs font-medium text-slate-900">
                          ${(w.amountCents / 100).toFixed(2)}
                        </td>
                        <td className="p-3 align-middle">
                          <span className="uppercase text-[10px] font-semibold tracking-wider text-slate-500">
                            {w.provider.replace("_", " ")}
                          </span>
                        </td>
                        <td className="p-3 align-middle">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            w.status === "PAID" ? "bg-green-100 text-green-700" :
                            w.status === "REJECTED" || w.status === "FAILED" ? "bg-red-100 text-red-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {w.status.replace("_", " ")}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}