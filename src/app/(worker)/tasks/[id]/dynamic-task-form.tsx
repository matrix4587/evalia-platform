"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Clock, AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export function DynamicTaskForm({ task }: { task: any }) {
  const router = useRouter();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  // Timer states
  const totalTime = (task.estimatedMinutes || 5) * 60;
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const hasSteps = task.content?.steps && Array.isArray(task.content.steps);
  const isSimpleText = task.content?.text;
  
  const steps = hasSteps ? task.content.steps : isSimpleText ? [
    {
      id: "step1",
      question: `Analyze the following text:\n\n"${task.content.text}"`,
      type: "radio",
      options: ["Positive", "Negative", "Neutral"]
    }
  ] : [];

  let activeStep = steps[currentStepIndex];

  if (hasSteps && currentStepIndex === 1) {
    const firstAnswer = answers["step1"];
    if (firstAnswer === "Positive" || firstAnswer === "Paris") activeStep = steps.find((s: any) => s.id === "step2_positive");
    else if (firstAnswer === "Negative" || firstAnswer === "Berlin") activeStep = steps.find((s: any) => s.id === "step2_negative");
    else activeStep = steps.find((s: any) => s.id === "step2_mixed");
  }

  // Initialize timer
  useEffect(() => {
    const storageKey = `task_timer_${task.id}`;
    const startTimeStr = localStorage.getItem(storageKey);

    if (startTimeStr) {
      const startTime = parseInt(startTimeStr, 10);
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      const remaining = totalTime - elapsedSeconds;
      setTimeLeft(remaining > 0 ? remaining : 0);
    } else {
      localStorage.setItem(storageKey, Date.now().toString());
      setTimeLeft(totalTime);
    }
  }, [task.id, totalTime]);

  const submitTask = async (finalAnswers: Record<string, string>) => {
    if (isSubmitting || isFinished) return;
    setIsSubmitting(true);

    // Calculate time spent
    const timeSpentSeconds = totalTime - (timeLeft || 0);

    try {
      const res = await fetch(`/api/tasks/${task.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          answers: finalAnswers,
          timeSpentSeconds: timeSpentSeconds // Send the actual time spent to API
        }),
      });

      if (!res.ok) throw new Error("Submission failed");

      setIsFinished(true);
      localStorage.removeItem(`task_timer_${task.id}`);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
      setIsSubmitting(false);
    }
  };

  // Timer tick
  useEffect(() => {
    if (timeLeft === null || isFinished || isSubmitting) return;
    if (timeLeft <= 0) {
      toast.error("Time is up! Auto-submitting your answers.");
      submitTask(answers);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isFinished, isSubmitting]);

  const handleOptionSelect = (option: string) => {
    if (!activeStep) return;
    setAnswers(prev => ({ ...prev, [activeStep.id]: option }));
  };

  const handleNext = () => {
    if (!answers[activeStep.id]) {
      toast.error("Please select an option before continuing.");
      return;
    }

    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      submitTask(answers);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (timeLeft === null) return <div className="p-10 text-center text-slate-500">Loading task timer...</div>;
  if (steps.length === 0) return <div className="p-10 text-center text-red-500">Invalid Task Format.</div>;

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center space-y-6">
        <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Task Complete!</h1>
        <p className="text-lg text-slate-600">Your answers have been submitted and earnings added to your wallet.</p>
        <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700 h-12 px-8">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  if (!activeStep) return <div className="p-10 text-center">Error loading active step data.</div>;

  const isTimeCritical = timeLeft <= 60;
  const currentSelection = answers[activeStep.id];
  const isLastStep = currentStepIndex === steps.length - 1;

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-12">
      
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="icon" className="h-8 w-8 shrink-0" asChild>
            <Link href="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900">{task.title}</h1>
            <p className="text-xs text-slate-500 mt-0.5">Complete this task to earn rewards.</p>
          </div>
        </div>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-mono font-bold text-sm shrink-0 ${
          isTimeCritical ? "bg-red-50 border-red-200 text-red-600 animate-pulse" : "bg-slate-50 border-slate-200 text-slate-700"
        }`}>
          {isTimeCritical ? <AlertCircle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question Card */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-slate-50 border-b py-3 px-5 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-800">
            {hasSteps ? `Question ${currentStepIndex + 1} of ${steps.length}` : "Task Instructions"}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-5 space-y-4">
          <p className="text-base font-medium text-slate-900 leading-relaxed whitespace-pre-wrap">
            {activeStep.question}
          </p>

          <div className="space-y-2">
            {activeStep.options.map((option: string) => {
              const isSelected = currentSelection === option;
              return (
                <div 
                  key={option} 
                  onClick={() => handleOptionSelect(option)}
                  className={`flex items-center gap-3 p-2.5 border rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" 
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <div className={`h-4 w-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected ? "border-blue-600" : "border-slate-300"
                  }`}>
                    {isSelected && <div className="h-2 w-2 rounded-full bg-blue-600" />}
                  </div>
                  <label className={`text-sm font-medium flex-1 cursor-pointer ${
                    isSelected ? "text-blue-900" : "text-slate-700"
                  }`}>
                    {option}
                  </label>
                </div>
              );
            })}
          </div>
        </CardContent>
        
        <div className="p-3 bg-slate-50 border-t flex justify-between items-center">
          <Button 
            variant="outline"
            onClick={handleBack}
            disabled={currentStepIndex === 0 || isSubmitting}
            className="h-9 px-4 text-sm font-bold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Previous
          </Button>
          
          <Button 
            onClick={handleNext}
            disabled={!currentSelection || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 font-bold h-9 px-6 text-sm"
          >
            {isSubmitting ? "Submitting..." : isLastStep ? "Submit & Earn" : "Next Question"}
            {!isLastStep && <ArrowRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </Card>
    </div>
  );
}