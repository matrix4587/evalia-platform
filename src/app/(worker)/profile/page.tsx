import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BadgeCheck, Mail, MapPin, Phone, User as UserIcon, ShieldCheck, Scale, Info } from "lucide-react";
import Link from "next/link";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      profile: true,
      wallet: true,
      _count: {
        select: {
          taskSubmissions: true,
          assessmentAttempts: true,
        }
      }
    }
  });

  if (!user) redirect("/login");

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Your Profile Overview</h1>
        <p className="text-slate-500 mt-1">Manage your personal information and see your stats.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Profile Card */}
        <Card className="md:col-span-1 shadow-sm border-slate-200">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-24 w-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-3xl font-bold mb-4">
              {user.name?.charAt(0) || "U"}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-sm text-slate-500 mb-4">{user.role}</p>
            
            <div className="w-full space-y-3 mt-4 text-sm text-left">
              <div className="flex items-center gap-3 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" /> {user.email}
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" /> {user.profile?.phoneNumber || "Not set"}
              </div>
              <div className="flex items-center gap-3 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400" /> {user.profile?.country || "Not set"}
              </div>
            </div>

            <Button asChild className="w-full mt-6" variant="outline">
              <Link href="/profile/edit">Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Stats & Info */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Stat Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="p-4 pb-1">
                <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Earnings</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-1">
                <div className="text-2xl font-bold text-slate-900">
                  ${((user.wallet?.lifetimeEarningsCents || 0) / 100).toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="p-4 pb-1">
                <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tasks Completed</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-1">
                <div className="text-2xl font-bold text-slate-900">
                  {user._count.taskSubmissions}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="p-4 pb-1">
                <CardTitle className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Assessments Taken</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-1">
                <div className="text-2xl font-bold text-slate-900">
                  {user._count.assessmentAttempts}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Verification Card */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-lg font-bold text-slate-900">Account Verification</CardTitle>
              <CardDescription className="text-slate-500 mt-1">Your account details and verification status.</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <BadgeCheck className="w-5 h-5 text-green-500" />
                  <span className="font-semibold text-slate-700">Email Verified</span>
                </div>
                <span className="text-xs font-bold text-green-700 bg-green-100 px-3 py-1 rounded-full">Verified</span>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-xl bg-slate-50">
                <div className="flex items-center gap-3">
                  <UserIcon className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold text-slate-700">Worker Account</span>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-100 px-3 py-1 rounded-full">Active</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* NEW INFO SECTION: Integrity & Fairness */}
      <div className="pt-6 border-t border-slate-200">
        <Card className="bg-slate-50 border-slate-200 shadow-sm overflow-hidden">
          <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-purple-500" />
          <CardHeader className="p-6 pb-4">
            <CardTitle className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-600" />
              Why accurate information matters
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 pt-0 grid gap-6 md:grid-cols-3">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
                <ShieldCheck className="w-5 h-5 text-green-600" />
                Platform Integrity
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Your profile data is used to match you with tasks you qualify for. Accurate skills and experience ensure the AI models you train meet the highest quality standards.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
                <Scale className="w-5 h-5 text-blue-600" />
                Fairness & Equity
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Accurate location and demographic data help us ensure fair pay, equal opportunity, and a diverse workforce. It allows us to distribute tasks equitably across all regions.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-slate-900 font-bold mb-1">
                <UserIcon className="w-5 h-5 text-red-600" />
                Fraud Prevention
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Providing incorrect information (like using multiple accounts or false IDs) violates our terms of service. Accurate data protects the platform, our clients, and your fellow workers from fraud.
              </p>
            </div>

          </CardContent>
        </Card>
      </div>
    </div>
  );
}