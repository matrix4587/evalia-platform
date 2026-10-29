import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, HelpCircle, Target, Award, ShieldCheck, Zap, TrendingUp } from "lucide-react";
import Link from "next/link";

// Mock data for the UI
const assessments = [
  { id: "sentiment-analysis", title: "Sentiment Analysis Basics", category: "NLP", difficulty: "Beginner", description: "Test your ability to identify positive, negative, and neutral sentiment in short text samples.", questions: 3, time: "15 min", pass: 70 },
  { id: "python-review", title: "Python Code Review", category: "PROGRAMMING", difficulty: "Intermediate", description: "Identify bugs and idiomatic improvements in short Python code snippets.", questions: 3, time: "25 min", pass: 75 },
  { id: "general-reasoning", title: "General Reasoning", category: "REASONING", difficulty: "Intermediate", description: "Basic logic and pattern-recognition questions to assess systematic reasoning.", questions: 2, time: "20 min", pass: 75 },
  { id: "creative-writing", title: "Creative Writing: Grammar & Clarity", category: "WRITING", difficulty: "Beginner", description: "Choose the clearest, most grammatically correct version of each sentence.", questions: 3, time: "15 min", pass: 70 },
];

export default function AssessmentsPage() {
  return (
    <div className="space-y-10 max-w-6xl mx-auto pb-16">
      
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Assessments</h1>
        <p className="text-slate-500 mt-1 text-lg">
          Pass assessments to earn capabilities. Capabilities unlock paid tasks.
        </p>
      </div>

      {/* Assessment List */}
      <div className="flex flex-col gap-4 w-[80%] mx-auto">
        {assessments.map((assessment) => (
          <Card key={assessment.id} className="shadow-sm border-slate-200 overflow-hidden hover:shadow-md transition-shadow">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-5 gap-4">
              
              {/* Left Side: Main Content */}
              <div className="flex-1 w-full">
                <div className="flex items-center gap-3 mb-1">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    {assessment.category}
                  </div>
                  <div className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    assessment.difficulty === "Beginner" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                  }`}>
                    {assessment.difficulty}
                  </div>
                </div>
                
                <CardTitle className="text-lg font-extrabold tracking-tight text-slate-900 leading-tight mb-1">
                  {assessment.title}
                </CardTitle>
                
                <p className="text-sm text-slate-600 mb-2 line-clamp-1 pr-4">
                  {assessment.description}
                </p>

                <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-slate-400" /> {assessment.questions} Qs
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> {assessment.time}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-slate-400" /> Pass {assessment.pass}
                  </div>
                </div>
              </div>

              {/* Right Side: Action Button */}
              <div className="w-full md:w-auto flex justify-end mt-2 md:mt-0">
                {/* THE FIX: Wrapped the button in a Link that routes to the specific assessment */}
                <Link href={`/assessments/${assessment.id}`}>
                  <Button className="w-full md:w-auto h-9 text-xs font-semibold bg-black text-white hover:bg-slate-800 px-6">
                    Start assessment
                  </Button>
                </Link>
              </div>

            </div>
          </Card>
        ))}
      </div>

      {/* --- ADDITIONAL INFO SECTION --- */}
      <div className="w-[80%] mx-auto mt-16 pt-10 border-t border-slate-200">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-slate-900">Why take assessments?</h2>
          <p className="text-slate-500 mt-1">Stand out from the crowd and unlock better opportunities.</p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow flex flex-col items-center text-center p-8">
            <div className="h-14 w-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-5">
              <Award className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl font-bold text-slate-900 mb-3">Unlock High-Value Capabilities</CardTitle>
            <p className="text-base text-slate-600 leading-relaxed">
              Prove your domain expertise by passing rigorous assessments. Upon success, you will instantly unlock verified capability badges on your profile. These badges are the key to accessing premium tasks that require specialized knowledge and attention to detail.
            </p>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow flex flex-col items-center text-center p-8">
            <div className="h-14 w-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-5">
              <Zap className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl font-bold text-slate-900 mb-3">Unlock Premium Earning Potential</CardTitle>
            <p className="text-base text-slate-600 leading-relaxed">
              Your capabilities directly determine your earning power. By unlocking advanced tiers, you gain exclusive access to higher-paying projects, complex coding tasks, and specialized AI training jobs that offer significantly better hourly rates and performance bonuses.
            </p>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow flex flex-col items-center text-center p-8">
            <div className="h-14 w-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-5">
              <ShieldCheck className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl font-bold text-slate-900 mb-3">Build Trust & Reliability</CardTitle>
            <p className="text-base text-slate-600 leading-relaxed">
              Assessments act as a transparent quality filter. When clients see that you have passed specific skill checks, they trust your work implicitly. This high level of trust leads to fewer revisions, better client feedback, and a stronger reputation within the platform's community.
            </p>
          </Card>

          <Card className="border-slate-200 shadow-sm bg-white hover:shadow-md transition-shadow flex flex-col items-center text-center p-8">
            <div className="h-14 w-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-5">
              <TrendingUp className="h-7 w-7" />
            </div>
            <CardTitle className="text-xl font-bold text-slate-900 mb-3">Fast-Track Your Career</CardTitle>
            <p className="text-base text-slate-600 leading-relaxed">
              Workers who consistently pass assessments are prioritized for rapid career progression. Accumulating multiple capabilities places you in the top tier of the workforce, making you a prime candidate for community roles, mentorship programs, and priority task allocation.
            </p>
          </Card>
        </div>
      </div>

    </div>
  );
}