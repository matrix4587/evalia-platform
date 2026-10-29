import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OnboardingReviewPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      
      {/* Page Header (Restored) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Review your profile</h1>
          <p className="text-slate-500 mt-2 text-lg">
            Confirm everything looks right. You can edit any section before finishing.
          </p>
        </div>
        <Button variant="ghost" className="text-slate-500 hover:text-slate-900 self-start sm:self-auto" asChild>
          <Link href="/dashboard">Skip for now &rarr;</Link>
        </Button>
      </div>

      {/* Step Progress (Restored) */}
      <div className="space-y-3 bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex justify-between text-sm font-semibold text-slate-700">
          <span>Step 1 of 7</span>
          <span>0% complete</span>
        </div>
        <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-blue-600 w-[14%]" />
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button size="sm" className="rounded-full bg-blue-600 hover:bg-blue-700">Personal</Button>
        <Button size="sm" variant="outline" className="rounded-full bg-white text-slate-600 border-slate-200">Education</Button>
        <Button size="sm" variant="outline" className="rounded-full bg-white text-slate-600 border-slate-200">Experience</Button>
        <Button size="sm" variant="outline" className="rounded-full bg-white text-slate-600 border-slate-200">Skills</Button>
        <Button size="sm" variant="outline" className="rounded-full bg-white text-slate-600 border-slate-200">Languages</Button>
        <Button size="sm" variant="outline" className="rounded-full bg-white text-slate-600 border-slate-200">Resume</Button>
        <Button size="sm" variant="outline" className="rounded-full bg-white text-slate-600 border-slate-200">Review</Button>
      </div>

      {/* Personal Information Card */}
      <Card className="shadow-sm border-slate-200 overflow-hidden">
        {/* THE FIX: Added p-6 and padding to the header */}
        <CardHeader className="bg-slate-50 border-b border-slate-200 p-6 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl font-bold text-slate-800">Personal</CardTitle>
          <Button variant="link" className="text-blue-600 font-semibold p-0 h-auto">Edit</Button>
        </CardHeader>
        <CardContent className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
          
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Full name</p>
            <p className="text-lg font-medium text-slate-900">Evans Kibet</p>
          </div>
          
          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Country</p>
            <p className="text-lg font-medium text-slate-900">—</p>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Phone</p>
            <p className="text-lg font-medium text-slate-900">—</p>
          </div>

          <div className="space-y-1.5">
            <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide">Date of birth</p>
            <p className="text-lg font-medium text-slate-900">—</p>
          </div>

        </CardContent>
      </Card>

      {/* Education Card */}
      <Card className="shadow-sm border-slate-200 overflow-hidden">
        {/* THE FIX: Added p-6 and padding to the header */}
        <CardHeader className="bg-slate-50 border-b border-slate-200 p-6 flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl font-bold text-slate-800">Education</CardTitle>
          <Button variant="link" className="text-blue-600 font-semibold p-0 h-auto">Edit</Button>
        </CardHeader>
        <CardContent className="p-6 md:p-8">
           <p className="text-base text-slate-500">No education added yet.</p>
        </CardContent>
      </Card>

    </div>
  );
}