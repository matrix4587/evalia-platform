import { auth } from "@/auth"; 
import { prisma } from "@/lib/prisma"; 
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, CheckCircle2, AlertCircle, Info, Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NotificationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch real notifications from the database
  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // Helper to get the right icon and color based on notification type
  const getIcon = (type: string) => {
    if (type.includes("WITHDRAWAL") || type.includes("PAYMENT")) {
      return <div className="p-3 bg-green-100 text-green-600 rounded-full shrink-0"><Wallet className="w-6 h-6" /></div>;
    }
    if (type.includes("REJECTED") || type.includes("FAILED") || type.includes("WARNING")) {
      return <div className="p-3 bg-red-100 text-red-600 rounded-full shrink-0"><AlertCircle className="w-6 h-6" /></div>;
    }
    if (type.includes("APPROVED") || type.includes("PASSED") || type.includes("PROMOTION")) {
      return <div className="p-3 bg-blue-100 text-blue-600 rounded-full shrink-0"><CheckCircle2 className="w-6 h-6" /></div>;
    }
    return <div className="p-3 bg-slate-100 text-slate-600 rounded-full shrink-0"><Info className="w-6 h-6" /></div>;
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Notifications</h1>
        <p className="text-slate-500 mt-1">
          Updates on your tasks, assessments, and payouts.
        </p>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {notifications.length === 0 ? (
          <Card className="border-slate-200 shadow-sm">
            <CardContent className="p-12 flex flex-col items-center justify-center text-center">
              <div className="h-16 w-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4">
                <Bell className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">You're all caught up!</h3>
              <p className="text-slate-500 mb-6 max-w-md">
                You don't have any new notifications right now. We'll let you know when there's an update on your tasks or earnings.
              </p>
              <Button asChild>
                <Link href="/tasks">Browse available tasks</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`border-slate-200 shadow-sm transition-all hover:shadow-md ${
                !notification.readAt ? "bg-blue-50/30 border-blue-100" : "bg-white"
              }`}
            >
              <CardContent className="p-5 flex items-start gap-4">
                {getIcon(notification.type)}
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-base ${!notification.readAt ? "font-extrabold text-slate-900" : "font-semibold text-slate-700"}`}>
                      {notification.title}
                    </h4>
                    <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                      {new Date(notification.createdAt).toLocaleDateString(undefined, { 
                        month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                      })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {notification.body}
                  </p>
                  
                  {notification.link && (
                    <div className="pt-2">
                      <Link href={notification.link} className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline">
                        View details &rarr;
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

    </div>
  );
}