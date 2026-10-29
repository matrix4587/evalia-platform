import { auth } from "@/auth"; 
import { prisma } from "@/lib/prisma"; 
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowDownToLine, Clock, TrendingUp, Wallet, FileText } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function EarningsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const wallet = await prisma.wallet.findUnique({
    where: { userId: session.user.id },
  });

  const transactions = await prisma.transaction.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  const assignments = await prisma.taskAssignment.findMany({
    where: { userId: session.user.id },
    include: { task: true },
    orderBy: { completedAt: "desc" },
  });

  const balanceCents = wallet?.balanceCents || 0;
  const pendingCents = wallet?.pendingCents || 0;
  const lifetimeEarningsCents = wallet?.lifetimeEarningsCents || 0;
  const totalWithdrawnCents = wallet?.totalWithdrawnCents || 0;

  // Enhanced matching logic
  const getTimeSpent = (description: string | null) => {
    if (!description) return null;
    
    // 1. Clean the description to get the task title
    const taskTitle = description.replace("Earnings for task: ", "").split(" (")[0].trim();
    
    // 2. Find the assignment that matches this task title
    const assignment = assignments.find(a => a.task.title.trim() === taskTitle);
    
    // 3. Return formatted time if found
    if (assignment && assignment.activeSeconds) {
      const mins = Math.floor(assignment.activeSeconds / 60);
      const secs = assignment.activeSeconds % 60;
      return `${mins}m ${secs}s`;
    }
    return "N/A";
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Earnings</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">
            Your earnings, current balance, and withdrawal history.
          </p>
        </div>
        <Button asChild className="w-full sm:w-fit h-10">
          <Link href="/withdrawals" className="flex items-center justify-center gap-2">
            <ArrowDownToLine className="h-4 w-4" />
            Withdraw funds
          </Link>
        </Button>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-sm border-slate-200 w-full">
          <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Available balance</CardTitle>
            <Wallet className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-bold text-slate-900">${(balanceCents / 100).toFixed(2)}</div>
            <p className="text-sm text-slate-500 mt-1">Withdrawable now</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 w-full">
          <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Pending</CardTitle>
            <Clock className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-bold text-slate-900">${(pendingCents / 100).toFixed(2)}</div>
            <p className="text-sm text-slate-500 mt-1">Awaiting review</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 w-full">
          <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Lifetime earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-bold text-slate-900">${(lifetimeEarningsCents / 100).toFixed(2)}</div>
            <p className="text-sm text-slate-500 mt-1">All-time</p>
          </CardContent>
        </Card>

        <Card className="shadow-sm border-slate-200 w-full">
          <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-slate-600">Total withdrawn</CardTitle>
            <ArrowDownToLine className="h-4 w-4 text-slate-400" />
          </CardHeader>
          <CardContent className="p-5 pt-0">
            <div className="text-3xl font-bold text-slate-900">${(totalWithdrawnCents / 100).toFixed(2)}</div>
            <p className="text-sm text-slate-500 mt-1">All payouts</p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <div className="space-y-4 pt-2">
        <h2 className="text-xl font-bold text-slate-900">Recent transactions</h2>
        
        <Card className="shadow-sm border-slate-200 overflow-hidden w-full">
          {transactions.length === 0 ? (
            <CardContent className="p-0">
              <div className="py-16 px-6 flex flex-col items-center justify-center text-center">
                <div className="bg-slate-100 p-4 rounded-full mb-4">
                  <FileText className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-1">No transactions yet</h3>
                <p className="text-slate-500 mb-6">Earnings from approved tasks will appear here.</p>
                <Button asChild><Link href="/dashboard">Browse tasks</Link></Button>
              </div>
            </CardContent>
          ) : (
            <div className="relative w-full overflow-x-auto">
              <table className="w-full caption-bottom text-sm text-left">
                <thead className="bg-slate-50 [&_tr]:border-b border-slate-200">
                  <tr className="border-b transition-colors hover:bg-slate-100/50">
                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Date</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Description</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Time Spent</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Amount</th>
                    <th className="h-12 px-4 align-middle font-medium text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody className="[&_tr:last-child]:border-0">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50">
                      <td className="p-4 align-middle text-slate-600 whitespace-nowrap">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4 align-middle font-medium text-slate-900 min-w-[200px]">
                        {tx.description || tx.type}
                      </td>
                      <td className="p-4 align-middle text-slate-600 whitespace-nowrap">
                        {getTimeSpent(tx.description)}
                      </td>
                      <td className={`p-4 align-middle font-bold whitespace-nowrap ${tx.amountCents >= 0 ? "text-green-600" : "text-slate-900"}`}>
                        {tx.amountCents >= 0 ? "+" : ""}${(tx.amountCents / 100).toFixed(2)}
                      </td>
                      <td className="p-4 align-middle">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          tx.status === "APPROVED" ? "bg-green-100 text-green-700" :
                          tx.status === "REJECTED" ? "bg-red-100 text-red-700" :
                          "bg-yellow-100 text-yellow-700"
                        }`}>
                          {tx.status}
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
  );
}