import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Target, ArrowRight, Lock, CheckCircle2, XCircle, Award, Zap, ShieldCheck, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userCapabilities = await prisma.userCapability.findMany({
    where: { userId: session.user.id },
    include: { capability: true }
  });
  const userCapabilityIds = userCapabilities.map(uc => uc.capabilityId);

  const userAttempts = await prisma.assessmentAttempt.findMany({
    where: { userId: session.user.id },
    orderBy: { submittedAt: "desc" }
  });

  const tasks = await prisma.task.findMany({
    where: { status: "AVAILABLE" },
    include: { 
      project: true,
      requirements: { include: { capability: true } }
    },
    orderBy: { createdAt: "desc" },
  });

  const assessments = await prisma.assessment.findMany({
    where: { status: "PUBLISHED" },
    include: { rules: { include: { capability: true } } },
  });

  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-12">
      
      {/* TASKS SECTION */}
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Available Tasks</h1>
          <p className="text-slate-500 mt-1 text-lg">Paid work you qualify for.</p>
        </div>

        <div className="grid gap-3">
          {tasks.map((task) => {
            const isUnlocked = task.requirements.every(req => 
              userCapabilityIds.includes(req.capabilityId)
            );

            return (
              <Card key={task.id} className={`shadow-sm border-slate-200 transition-shadow ${isUnlocked ? "hover:shadow-md" : "opacity-80 bg-slate-50"}`}>
                <div className="p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                        {task.project.category}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        {task.difficulty}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{task.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-1">{task.instructions}</p>
                    
                    <div className="flex items-center gap-4 text-sm font-bold text-slate-900 pt-1">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-slate-700" /> {task.estimatedMinutes} min
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Target className="w-4 h-4 text-slate-700" /> ${(task.ratePerHourCents || 0)/100}/hr
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-auto">
                    {isUnlocked ? (
                      <Button asChild className="w-full md:w-auto h-9 text-sm font-semibold bg-black text-white hover:bg-slate-800 px-6">
                        <Link href={`/tasks/${task.id}`}>Start Task <ArrowRight className="ml-2 w-4 h-4" /></Link>
                      </Button>
                    ) : (
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2 text-sm font-medium text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg">
                          <Lock className="w-4 h-4" /> Locked
                        </div>
                        {task.requirements[0] && (
                          <p className="text-xs text-slate-500 text-right">
                            Requires <strong>{task.requirements[0].capability.name}</strong>.
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ASSESSMENTS SECTION */}
      <div id="assessments" className="space-y-4 pt-6 border-t border-slate-200">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Assessments</h2>
          <p className="text-slate-500 mt-1">Pass these with 80% or higher to unlock locked tasks.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {assessments.map((assessment) => {
            const latestAttempt = userAttempts.find(
              (attempt) => attempt.assessmentId === assessment.id
            );

            const hasPassed = latestAttempt?.score && latestAttempt.score >= 80;
            const hasFailed = latestAttempt?.score !== undefined && latestAttempt.score !== null && latestAttempt.score < 80;

            return (
              // THE FIX: Added flex flex-col to the card to control vertical layout
              <Card key={assessment.id} className={`shadow-sm border-slate-200 transition-shadow flex flex-col ${
                hasPassed ? "bg-slate-50 opacity-90" : 
                hasFailed ? "bg-red-50/30 border-red-100" : 
                "hover:shadow-md"
              }`}>
                <CardHeader className="p-4 pb-1">
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded uppercase tracking-wider">
                      {assessment.category}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">Pass: {assessment.passingScore}%</span>
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900">{assessment.name}</CardTitle>
                </CardHeader>
                
                {/* THE FIX: flex-1 makes the content fill available space, pushing the button down */}
                <CardContent className="p-4 pt-1 flex-1 flex flex-col">
                  <p className="text-xs text-slate-600 mb-3 line-clamp-2">{assessment.description}</p>
                  
                  {/* mt-auto pushes this container to the absolute bottom of the card */}
                  <div className="mt-auto">
                    {hasPassed ? (
                      <Button disabled className="w-full h-8 text-xs bg-slate-200 text-slate-500 font-bold cursor-not-allowed">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Passed ({latestAttempt.score}%)
                      </Button>
                    ) : hasFailed ? (
                      <Button disabled className="w-full h-8 text-xs bg-red-100 text-red-700 font-bold cursor-not-allowed border border-red-200">
                        <XCircle className="w-3.5 h-3.5 mr-1.5" /> Failed ({latestAttempt.score}%)
                      </Button>
                    ) : (
                      <Button asChild className="w-full h-8 text-xs font-bold bg-blue-600 hover:bg-blue-700">
                        <Link href={`/assessments/${assessment.slug}/take`}>Take Assessment</Link>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ADDITIONAL INFO SECTION */}
      <div className="pt-8 border-t border-slate-200">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Why take assessments?</h2>
          <p className="text-slate-500 mt-1">Stand out from the crowd and unlock better opportunities.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow flex flex-col items-center text-center p-6">
            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Award className="h-6 w-6" />
            </div>
            <CardTitle className="text-lg font-bold text-slate-900 mb-2">Unlock High-Value Capabilities</CardTitle>
            <p className="text-sm text-slate-600 leading-relaxed">
              Prove your domain expertise by passing rigorous assessments. Upon success, you will instantly unlock verified capability badges on your profile. These badges are the key to accessing premium tasks that require specialized knowledge and attention to detail.
            </p>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow flex flex-col items-center text-center p-6">
            <div className="h-12 w-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <CardTitle className="text-lg font-bold text-slate-900 mb-2">Unlock Premium Earning Potential</CardTitle>
            <p className="text-sm text-slate-600 leading-relaxed">
              Your capabilities directly determine your earning power. By unlocking advanced tiers, you gain exclusive access to higher-paying projects, complex coding tasks, and specialized AI training jobs that offer significantly better hourly rates and performance bonuses.
            </p>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow flex flex-col items-center text-center p-6">
            <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <CardTitle className="text-lg font-bold text-slate-900 mb-2">Build Trust & Reliability</CardTitle>
            <p className="text-sm text-slate-600 leading-relaxed">
              Assessments act as a transparent quality filter. When clients see that you have passed specific skill checks, they trust your work implicitly. This high level of trust leads to fewer revisions, better client feedback, and a stronger reputation within the platform's community.
            </p>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow flex flex-col items-center text-center p-6">
            <div className="h-12 w-12 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="h-6 w-6" />
            </div>
            <CardTitle className="text-lg font-bold text-slate-900 mb-2">Fast-Track Your Career</CardTitle>
            <p className="text-sm text-slate-600 leading-relaxed">
              Workers who consistently pass assessments are prioritized for rapid career progression. Accumulating multiple capabilities places you in the top tier of the workforce, making you a prime candidate for community roles, mentorship programs, and priority task allocation.
            </p>
          </Card>
        </div>
      </div>

    </div>
  );
}