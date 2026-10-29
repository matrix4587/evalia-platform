import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      
      {/* Left Side - Marketing/Branding Panel */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 relative overflow-hidden flex-col justify-between p-10 text-white">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-purple-500 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 font-extrabold text-2xl">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-blue-600 shadow-lg">
              E
            </div>
            Evalia
          </Link>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-4xl font-extrabold leading-tight mb-6">
            Welcome back to the future of AI.
          </h1>
          <p className="text-lg text-blue-100 mb-8">
            Log in to access your dashboard, take assessments, and start earning by training the world's most advanced AI models.
          </p>
          <ul className="space-y-4">
            {["Flexible remote work", "Weekly payouts", "Unlock premium capabilities"].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-blue-50 font-medium">
                <CheckCircle2 className="w-5 h-5 text-blue-200" /> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 text-sm text-blue-200 flex items-center justify-between">
          <p>© {new Date().getFullYear()} Evalia.</p>
          <div className="flex gap-4">
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          </div>
        </div>
      </div>

      {/* Right Side - Form Area */}
      <div className="flex flex-1 flex-col items-center p-6 relative w-full h-full overflow-y-auto">
        
        {/* THE FIX: Moved "Back to home" out of absolute positioning and into the flex flow */}
        <div className="w-full max-w-md pt-4 pb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
        </div>

        {/* Center the form */}
        <div className="w-full max-w-md my-auto">
          {children}
        </div>
        
      </div>

    </div>
  );
}