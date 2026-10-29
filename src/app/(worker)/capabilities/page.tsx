import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, BookOpen } from "lucide-react";
import Link from "next/link";

export default function CapabilitiesPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Capabilities</h1>
          <p className="text-slate-500 mt-2 text-lg">
            Skills you've unlocked by passing assessments. These determine which tasks you can accept.
          </p>
        </div>
        
        {/* THE FIX: Changed href from "/assessments" to "/dashboard#assessments" */}
        <Button asChild className="w-fit">
          <Link href="/dashboard#assessments" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Take an assessment
          </Link>
        </Button>
      </div>

      {/* Empty State Card */}
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="flex flex-col items-center justify-center py-24 px-6 text-center">
          
          {/* Icon Circle */}
          <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
            <Award className="h-8 w-8" />
          </div>

          <h3 className="text-xl font-bold text-slate-900 mb-2">No capabilities yet</h3>
          
          <p className="text-slate-500 max-w-md mx-auto mb-8 leading-relaxed">
            Complete your first assessment to earn a capability. Once you have one, qualified tasks will appear on your tasks page.
          </p>

          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link href="/dashboard#assessments">Browse assessments</Link>
          </Button>
          
        </CardContent>
      </Card>

    </div>
  );
}