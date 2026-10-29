"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle2, XCircle, RotateCcw, AlertCircle, Lock } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function TakeAssessmentPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [assessment, setAssessment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // State to track answers, feedback, and attempts
  const [answers, setAnswers] = useState<Record<string, string>>({}); 
  const [feedback, setFeedback] = useState<Record<string, 'correct' | 'incorrect' | 'locked' | null>>({});
  const [attempts, setAttempts] = useState<Record<string, number>>({});
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const MAX_ATTEMPTS = 3;

  useEffect(() => {
    fetch(`/api/assessments/${slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setAssessment(data);
        setIsLoading(false);
      })
      .catch(err => {
        toast.error("Failed to load assessment");
        setIsLoading(false);
      });
  }, [slug]);

  const handleOptionSelect = (questionId: string, optionLabel: string, isCorrect: boolean) => {
    // If already correct or locked, do nothing
    if (feedback[questionId] === 'correct' || feedback[questionId] === 'locked') return;

    const currentAttempts = attempts[questionId] || 0;
    const newAttempts = currentAttempts + 1;

    setAttempts(prev => ({ ...prev, [questionId]: newAttempts }));
    setAnswers(prev => ({ ...prev, [questionId]: optionLabel }));

    if (isCorrect) {
      setFeedback(prev => ({ ...prev, [questionId]: 'correct' }));
    } else {
      if (newAttempts >= MAX_ATTEMPTS) {
        // Out of attempts
        setFeedback(prev => ({ ...prev, [questionId]: 'locked' }));
      } else {
        // Still has attempts left
        setFeedback(prev => ({ ...prev, [questionId]: 'incorrect' }));
      }
    }
  };

  const handleRetry = (questionId: string) => {
    // Clear the selection, but keep the attempt count
    setAnswers(prev => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });
    setFeedback(prev => ({ ...prev, [questionId]: null }));
  };

  const handleSubmit = async () => {
    // Check if all questions are either correct or locked (out of attempts)
    const allAnswered = assessment.questions.every(
      (q: any) => feedback[q.id] === 'correct' || feedback[q.id] === 'locked'
    );

    if (!allAnswered) {
      toast.error("Please complete all questions before submitting.");
      return;
    }

    setIsSubmitting(true);
    try {
      // Only submit answers where the user got it correct on their own
      // Or should we submit the final wrong answer? The spec says "last try option will be recorded whether correct or wrong".
      // The `answers` state holds the last clicked option, so we can just pass that.
      
      const payload = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId,
        selectedOption
      }));

      const res = await fetch(`/api/assessments/${slug}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payload }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResult(data);
      router.refresh();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div className="p-10 text-center text-slate-500">Loading assessment...</div>;
  if (!assessment) return <div className="p-10 text-center text-red-500">Assessment not found.</div>;

  if (result) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center space-y-6">
        {result.passed ? (
          <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
        ) : (
          <XCircle className="h-20 w-20 text-red-500 mx-auto" />
        )}
        <h1 className="text-3xl font-extrabold text-slate-900">
          {result.passed ? "Assessment Passed!" : "Assessment Failed"}
        </h1>
        <p className="text-lg text-slate-600">
          You scored {result.score.toFixed(0)}%. You needed 80% to pass.
        </p>
        <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700 h-12 px-8">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  // Check if the submit button should be enabled
  const isFormComplete = assessment.questions.every(
    (q: any) => feedback[q.id] === 'correct' || feedback[q.id] === 'locked'
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex items-center gap-4">
        <Button variant="outline" size="icon" className="h-10 w-10 shrink-0" asChild>
          <Link href="/dashboard"><ArrowLeft className="h-5 w-5" /></Link>
        </Button>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">{assessment.name}</h1>
          <p className="text-slate-500 mt-1">You have {MAX_ATTEMPTS} attempts per question.</p>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-6">
        {assessment.questions.map((q: any, index: number) => {
          const currentFeedback = feedback[q.id];
          const currentAttempts = attempts[q.id] || 0;
          const isLocked = currentFeedback === 'locked';
          
          return (
            <Card key={q.id} className={`border-slate-200 shadow-sm overflow-hidden transition-colors ${
              currentFeedback === 'correct' ? 'ring-2 ring-green-500/50' : 
              currentFeedback === 'incorrect' ? 'ring-2 ring-red-500/50' : 
              isLocked ? 'ring-2 ring-slate-400 opacity-90' : ''
            }`}>
              <CardHeader className="bg-slate-50 border-b py-4 px-6 flex flex-row items-center justify-between">
                <CardTitle className="text-base font-bold text-slate-800">
                  Question {index + 1} <span className="text-slate-400 font-normal ml-2">of {assessment.questions.length}</span>
                </CardTitle>
                {/* Attempts Counter */}
                <div className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  isLocked ? 'bg-red-100 text-red-700' :
                  currentFeedback === 'correct' ? 'bg-green-100 text-green-700' :
                  'bg-slate-200 text-slate-600'
                }`}>
                  Attempts: {currentAttempts} / {MAX_ATTEMPTS}
                </div>
              </CardHeader>
              
              <CardContent className="p-6 space-y-4">
                <p className="text-lg font-medium text-slate-900 leading-relaxed">{q.prompt}</p>
                
                <div className="space-y-2.5">
                  {q.options.map((opt: any) => {
                    const isSelected = answers[q.id] === opt.label;
                    const isCorrectOption = opt.isCorrect;
                    
                    let optionClass = "border-slate-200 hover:bg-slate-50 bg-white";
                    
                    if (isSelected && currentFeedback === 'correct') {
                      optionClass = "border-green-500 bg-green-50 ring-1 ring-green-500";
                    } else if (isSelected && currentFeedback === 'incorrect') {
                      optionClass = "border-red-500 bg-red-50 ring-1 ring-red-500";
                    } else if (isLocked) {
                      if (isCorrectOption) {
                        // Reveal correct answer
                        optionClass = "border-green-500 bg-green-50/50";
                      } else if (isSelected) {
                        // Show the user's final wrong answer
                        optionClass = "border-red-500 bg-red-50/50 opacity-60";
                      } else {
                        optionClass = "border-slate-200 bg-slate-50 opacity-40";
                      }
                    }

                    return (
                      <div 
                        key={opt.id} 
                        onClick={() => !isLocked && currentFeedback !== 'correct' && handleOptionSelect(q.id, opt.label, isCorrectOption)}
                        className={`flex items-center gap-3 p-3.5 border rounded-xl transition-all ${optionClass} ${
                          isLocked || currentFeedback === 'correct' ? 'cursor-default' : 'cursor-pointer'
                        }`}
                      >
                        <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          isSelected && currentFeedback === 'correct' ? "border-green-600" :
                          isSelected && currentFeedback === 'incorrect' ? "border-red-600" :
                          isLocked && isCorrectOption ? "border-green-600" :
                          isLocked && isSelected ? "border-red-600" :
                          "border-slate-300"
                        }`}>
                          {isSelected && currentFeedback === 'correct' && <div className="h-2.5 w-2.5 rounded-full bg-green-600" />}
                          {isSelected && currentFeedback === 'incorrect' && <div className="h-2.5 w-2.5 rounded-full bg-red-600" />}
                          {isLocked && isCorrectOption && <div className="h-2.5 w-2.5 rounded-full bg-green-600" />}
                          {isLocked && isSelected && !isCorrectOption && <div className="h-2.5 w-2.5 rounded-full bg-red-600" />}
                        </div>
                        
                        <label className={`text-sm font-medium flex-1 ${
                          isSelected && currentFeedback === 'correct' ? "text-green-900" :
                          isSelected && currentFeedback === 'incorrect' ? "text-red-900" :
                          isLocked && isCorrectOption ? "text-green-900 font-bold" :
                          isLocked && isSelected ? "text-red-900" :
                          "text-slate-700"
                        }`}>
                          {opt.label}
                        </label>
                        
                        {isSelected && currentFeedback === 'correct' && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                        {isSelected && currentFeedback === 'incorrect' && <XCircle className="h-5 w-5 text-red-600" />}
                        {isLocked && isCorrectOption && <CheckCircle2 className="h-5 w-5 text-green-600" />}
                      </div>
                    );
                  })}
                </div>

                {/* Success Feedback */}
                {currentFeedback === 'correct' && (
                  <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-bold text-green-800">Correct!</h4>
                      <p className="text-sm text-green-700 mt-1">You accurately identified the correct evaluation approach.</p>
                    </div>
                  </div>
                )}

                {/* Error Feedback - Still has attempts */}
                {currentFeedback === 'incorrect' && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl flex flex-col gap-3">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-bold text-red-800">Incorrect Answer</h4>
                        <p className="text-sm text-red-700 mt-1">
                          That is not the most accurate evaluation. You have {MAX_ATTEMPTS - currentAttempts} {MAX_ATTEMPTS - currentAttempts === 1 ? 'attempt' : 'attempts'} left.
                        </p>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleRetry(q.id)} 
                      variant="outline" 
                      size="sm" 
                      className="w-fit ml-8 border-red-200 text-red-700 hover:bg-red-100 hover:text-red-800"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" /> Try Again
                    </Button>
                  </div>
                )}

                {/* Error Feedback - Locked out */}
                {isLocked && (
                  <div className="mt-4 p-4 bg-slate-100 border border-slate-300 rounded-xl flex items-start gap-3">
                    <Lock className="w-5 h-5 text-slate-500 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-800">Question Locked</h4>
                      <p className="text-sm text-slate-600 mt-1">
                        You have run out of attempts. The correct answer is highlighted in green above. Your last attempt has been recorded.
                      </p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Button 
        onClick={handleSubmit} 
        disabled={isSubmitting || !isFormComplete}
        className="w-full h-12 text-lg font-bold bg-blue-600 hover:bg-blue-700 mt-6"
      >
        {isSubmitting ? "Submitting..." : "Submit Assessment"}
      </Button>
      
    </div>
  );
}