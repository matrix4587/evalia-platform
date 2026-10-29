"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

// Mock Questions Data
const mockQuestions = [
  {
    id: 1,
    text: 'Analyze the following sentence and determine its primary sentiment: "The new update completely ruined my workflow, I can\'t believe they shipped this buggy version."',
    type: "Multiple Choice",
    options: ["Positive", "Neutral", "Negative", "Mixed"],
    correctAnswer: "Negative",
  },
  {
    id: 2,
    text: 'Which of the following Python code snippets contains a syntax error?',
    type: "Multiple Choice",
    options: [
      'print("Hello World")',
      'def my_function(): \n return 1',
      'if x = 5: \n print("Five")',
      'list = [1, 2, 3]'
    ],
    correctAnswer: 'if x = 5: \n print("Five")',
  },
  {
    id: 3,
    text: 'What is the most appropriate way to handle missing data in a large dataset?',
    type: "Multiple Choice",
    options: ["Delete all rows with missing data", "Fill missing values with the mean/median", "Ignore the missing data", "Replace missing data with zero"],
    correctAnswer: "Fill missing values with the mean/median",
  }
];

export default function AssessmentTestPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  // Format slug to title
  const assessmentTitle = slug
    ?.split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  // State for the test
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const currentQuestion = mockQuestions[currentQuestionIndex];

  const handleNext = () => {
    if (!selectedOption) return;

    if (currentQuestionIndex < mockQuestions.length - 1) {
      // Move to next question
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null); // Reset selection
    } else {
      // Finish test
      setIsSubmitting(true);
      // Simulate API call to submit assessment
      setTimeout(() => {
        setIsSubmitting(false);
        setIsFinished(true);
      }, 1500);
    }
  };

  if (isFinished) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center space-y-6">
        <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900">Assessment Complete!</h1>
        <p className="text-lg text-slate-600">
          You have successfully submitted your answers for {assessmentTitle}. Your results will be graded shortly.
        </p>
        <Button asChild className="mt-4 bg-blue-600 hover:bg-blue-700 h-12 px-8">
          <Link href="/assessments">Back to Assessments</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/assessments"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">{assessmentTitle}</h1>
            <p className="text-slate-500">Test your skills and unlock new capabilities.</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
          <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 15:00 remaining</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-blue-600 transition-all duration-300 ease-in-out" 
          style={{ width: `${((currentQuestionIndex + 1) / mockQuestions.length) * 100}%` }}
        />
      </div>

      {/* Question Card */}
      <Card className="border-slate-200 shadow-lg">
        <CardHeader className="border-b bg-slate-50 py-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Question {currentQuestionIndex + 1} of {mockQuestions.length}</CardTitle>
            <span className="text-xs font-bold text-slate-500 bg-white border px-2 py-1 rounded-md">{currentQuestion.type}</span>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <p className="text-lg font-medium text-slate-900 leading-relaxed whitespace-pre-wrap">
            {currentQuestion.text}
          </p>

          {/* Interactive Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = selectedOption === option;
              return (
                <div 
                  key={option} 
                  onClick={() => setSelectedOption(option)}
                  className={`flex items-center space-x-3 p-4 border rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? "border-blue-600 bg-blue-50 ring-1 ring-blue-600" 
                      : "border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  {/* Radio Circle */}
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                    isSelected ? "border-blue-600" : "border-slate-300"
                  }`}>
                    {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />}
                  </div>
                  <label className={`text-base font-medium flex-1 cursor-pointer whitespace-pre-wrap ${
                    isSelected ? "text-blue-900" : "text-slate-700"
                  }`}>
                    {option}
                  </label>
                </div>
              );
            })}
          </div>
        </CardContent>
        
        <CardFooter className="p-6 border-t flex justify-between bg-slate-50/50">
          <Button variant="outline" disabled={currentQuestionIndex === 0}>
            Previous
          </Button>
          <Button 
            onClick={handleNext}
            disabled={!selectedOption || isSubmitting}
            className="bg-blue-600 hover:bg-blue-700 font-bold min-w-[140px]"
          >
            {isSubmitting ? "Submitting..." : currentQuestionIndex === mockQuestions.length - 1 ? "Finish Assessment" : "Next Question"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}