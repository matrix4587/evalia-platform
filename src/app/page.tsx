import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ArrowRight, Brain, CheckCircle2, Globe2, 
  LineChart, ShieldCheck, Wallet, Building2, UserCheck, 
  Star, Sparkles, Zap, TrendingUp, Lock
} from "lucide-react";

const howItWorks = [
  { step: "01", title: "Sign up", description: "Create a verified account in minutes. Complete your professional profile.", icon: UserCheck },
  { step: "02", title: "Complete assessments", description: "Take category-specific assessments — AI evaluation, programming, finance, and more.", icon: Brain },
  { step: "03", title: "Unlock capabilities", description: "Every assessment builds a capability profile. Pass thresholds to unlock higher-paying tiers.", icon: Lock },
  { step: "04", title: "Complete tasks", description: "Work on real AI training projects from global companies — evaluation and annotation.", icon: Zap },
  { step: "05", title: "Earn money", description: "Your hourly rate reflects your capabilities and quality score. Track earnings in real time.", icon: TrendingUp },
  { step: "06", title: "Withdraw weekly", description: "Request payouts every Friday. Multiple payment methods including PayPal, Wise, and M-Pesa.", icon: Wallet },
];

const categories = [
  "AI Response Evaluation", "Data Annotation", "Text Classification", "Image Annotation", "Video Annotation", "Audio Transcription", "Speech Evaluation", "Translation Evaluation", "Search Relevance", "AI Safety Evaluation", "Prompt Evaluation", "Prompt Engineering", "Coding Evaluation", "Mathematical Reasoning", "General Reasoning", "Fact Checking", "Data Quality", "Business Analysis", "Financial Reasoning", "Marketing Analysis", "Operations & Supply Chain", "Computer Science", "Domain Expert Tasks",
];

const stats = [
  { label: "Active trainers", value: "12,840+" },
  { label: "Countries", value: "140+" },
  { label: "Tasks completed", value: "8.4M+" },
  { label: "Avg. quality score", value: "94.2%" },
];

const trustPoints = [
  { icon: ShieldCheck, title: "Quality-controlled work", description: "Every submission is scored. Gold-standard tasks and peer review keep the network calibrated." },
  { icon: LineChart, title: "Transparent progression", description: "See exactly which capabilities you've unlocked, which assessments to take next, and how your rate grows." },
  { icon: Wallet, title: "Reliable weekly payouts", description: "Immutable ledger, server-side time tracking, and Friday payouts. No surprises." },
  { icon: Globe2, title: "Global by design", description: "Work from anywhere. Payment methods and languages built for a worldwide workforce." },
];

const testimonials = [
  { quote: "Evalia gave me the flexibility to work from home while earning a great income. The assessments were challenging but fair.", name: "Sarah J.", role: "AI Trainer, USA" },
  { quote: "The platform is incredibly smooth. Payouts are always on time, and I love seeing my quality score improve as I do more tasks.", name: "David M.", role: "Data Annotator, UK" },
  { quote: "I started with basic data quality tasks and worked my way up to advanced AI evaluation. The career progression here is real.", name: "Amina K.", role: "Senior Evaluator, Kenya" }
];

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50 overflow-x-hidden scroll-smooth">
      
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-slate-200/50 bg-white/80 backdrop-blur-lg shadow-sm">
        <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-2xl text-slate-900 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white group-hover:bg-blue-700 transition-colors text-xl">E</div>
            Evalia
          </Link>
          
          <nav className="hidden items-center gap-8 text-base font-bold text-slate-600 md:flex">
            <Link href="#how-it-works" className="hover:text-blue-600 transition-colors">How it works</Link>
            <Link href="#for-trainers" className="hover:text-blue-600 transition-colors">For trainers</Link>
            <Link href="#for-companies" className="hover:text-blue-600 transition-colors">For companies</Link>
            <Link href="/pricing" className="hover:text-blue-600 transition-colors">Pricing</Link>
            <Link href="/faq" className="hover:text-blue-600 transition-colors">FAQ</Link>
          </nav>
          
          <div className="flex items-center gap-4">
            <Button variant="secondary" className="rounded-full font-bold text-base h-10 px-6 bg-slate-100 hover:bg-slate-200 text-slate-800" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            
            <Button className="rounded-full font-bold text-base bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all hover:-translate-y-0.5 h-10 px-6" asChild>
              <Link href="/register" className="flex flex-row items-center justify-center gap-2 whitespace-nowrap">
                Become a Trainer 
                <ArrowRight className="h-4 w-4 stroke-[3]" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/50 bg-gradient-to-b from-blue-50/80 via-white to-slate-50">
        {/* THE FIX: Changed md:grid-cols-2 to md:grid-cols-[1.2fr_0.8fr] to give text more room */}
        <div className="max-w-7xl mx-auto grid gap-10 px-4 sm:px-6 lg:px-8 py-12 md:py-20 md:grid-cols-[1.2fr_0.8fr] md:items-center">
          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-bold text-blue-700 shadow-sm">
              <Sparkles className="h-4 w-4" /> Trusted by AI labs worldwide
            </div>
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl leading-[1.1] text-slate-900">
              Train Humans.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Improve AI.</span>
            </h1>
            <p className="mt-6 max-w-xl text-xl text-slate-600 leading-relaxed font-medium">
              Join a global network of AI trainers and evaluators helping build safer, smarter and more reliable artificial intelligence.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" className="rounded-full h-14 px-8 text-lg font-bold bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/30 transition-all hover:-translate-y-1" asChild>
                <Link href="/register" className="flex flex-row items-center justify-center gap-2 whitespace-nowrap">
                  Become an AI Trainer 
                  <ArrowRight className="h-5 w-5 stroke-[3]" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg font-bold border-slate-300 text-slate-700 hover:bg-slate-100 transition-all hover:-translate-y-1" asChild>
                <Link href="/for-companies">For Companies</Link>
              </Button>
            </div>

            {/* THE FIX: Added whitespace-nowrap to the stats to keep labels on one line */}
            <dl className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-4 border-t border-slate-200 pt-8">
              {stats.map((s) => (
                <div key={s.label} className="group cursor-default">
                  <dt className="text-[11px] font-bold uppercase tracking-wider text-slate-500 group-hover:text-blue-600 transition-colors whitespace-nowrap">{s.label}</dt>
                  <dd className="mt-1 text-3xl font-extrabold text-slate-900 group-hover:scale-105 transition-transform origin-left">{s.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* THE FIX: Added a max-w-md to the card wrapper to make it narrower */}
          <div className="relative hidden md:block max-w-md w-full justify-self-end">
            <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-blue-400/30 to-purple-400/30 blur-3xl" />
            <Card className="overflow-hidden border-slate-200/60 shadow-2xl bg-white/90 backdrop-blur-xl p-0">
              <div className="border-b bg-slate-50/50 p-6">
                <h3 className="text-xl font-bold flex items-center gap-2 text-slate-900"><Brain className="h-6 w-6 text-blue-600" /> Capability Profile</h3>
                <p className="text-sm font-medium text-slate-500 mt-1">Your real profile is built from assessments.</p>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { label: "AI Evaluation", level: "Advanced", tone: "primary" },
                  { label: "Data Quality", level: "Intermediate", tone: "muted" },
                  { label: "General Reasoning", level: "Advanced", tone: "primary" },
                  { label: "Programming", level: "Intermediate", tone: "primary" },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white px-4 py-3 text-base shadow-sm hover:shadow-md transition-all cursor-default">
                    <span className="font-bold text-slate-700">{row.label}</span>
                    <span className={row.tone === "primary" ? "rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700" : "rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"}>{row.level}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Logos */}
      <section className="border-b border-slate-200/50 bg-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">Trusted by leading AI research teams</p>
          <div className="flex flex-wrap justify-center items-center gap-10 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-2xl font-black hover:text-blue-600 transition-colors cursor-default">OpenAI</span>
            <span className="text-2xl font-black hover:text-blue-600 transition-colors cursor-default">Anthropic</span>
            <span className="text-2xl font-black hover:text-blue-600 transition-colors cursor-default">Scale AI</span>
            <span className="text-2xl font-black hover:text-blue-600 transition-colors cursor-default">Cohere</span>
            <span className="text-2xl font-black hover:text-blue-600 transition-colors cursor-default">Hugging Face</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-b border-slate-200/50 bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">How it works</h2>
            <p className="mt-3 text-lg text-slate-600 font-medium">From sign-up to your first payout — a transparent process.</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {howItWorks.map((item) => {
              const Icon = item.icon;
              return (
                <Card 
                  key={item.step} 
                  className="group relative overflow-hidden border-slate-200/80 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-white hover:bg-slate-900 hover:border-slate-800 p-0 cursor-pointer"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-xs font-bold text-blue-600 bg-blue-50 group-hover:bg-blue-600 group-hover:text-white px-3 py-1 rounded-full transition-colors duration-300">
                        Step {item.step}
                      </div>
                      <Icon className="h-6 w-6 text-slate-300 group-hover:text-white transition-colors duration-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-white mb-2 transition-colors duration-300">
                      {item.title}
                    </h3>
                    <p className="text-sm text-slate-600 group-hover:text-slate-300 leading-relaxed font-medium transition-colors duration-300">
                      {item.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dual Audience */}
      <section className="border-b border-slate-200/50 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl">A platform for everyone</h2>
            <p className="mt-3 text-lg text-slate-600 font-medium">Whether you want to earn flexible income or scale your AI data pipeline.</p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {/* For Workers */}
            <Card id="for-trainers" className="border-slate-200 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br from-white to-slate-50 group p-0 rounded-2xl overflow-hidden">
              <div className="p-8">
                <div className="h-14 w-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><UserCheck className="w-7 h-7" /></div>
                <h3 className="text-2xl font-extrabold text-slate-900 mb-3">For AI Trainers</h3>
                <p className="text-slate-600 mb-6 text-base font-medium">Work from anywhere. Choose your hours. Earn competitive pay by helping train the world's most advanced AI.</p>
                <ul className="space-y-4 mb-8">
                  {["Flexible remote work", "Weekly payouts via Stripe or M-Pesa", "No degree required for basic tasks"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                      <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
                
                <Button className="w-full h-12 rounded-full font-bold bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 text-base !text-white" asChild>
                  <Link href="/register" className="flex flex-row items-center justify-center gap-2 whitespace-nowrap">
                    Start Training 
                    <ArrowRight className="h-5 w-5 stroke-[3]" />
                  </Link>
                </Button>
              </div>
            </Card>

            {/* For Enterprises */}
            <Card id="for-companies" className="border-slate-800 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-slate-900 text-white group relative overflow-hidden p-0 rounded-2xl">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-colors" />
              <div className="p-8 relative z-10">
                <div className="h-14 w-14 bg-slate-800 text-white rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><Building2 className="w-7 h-7" /></div>
                <h3 className="text-2xl font-extrabold mb-3">For Enterprises</h3>
                <p className="text-slate-300 mb-6 text-base font-medium">Get high-quality human feedback (RLHF) for your LLMs. Scale your data operations with a vetted workforce.</p>
                <ul className="space-y-4 mb-8">
                  {["Vetted, capability-tested workforce", "Enterprise-grade security and NDAs", "API and custom pipeline integration"].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-sm font-bold text-slate-200">
                      <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0" /> {item}
                    </li>
                  ))}
                </ul>
                <Button 
                  variant="secondary" 
                  className="w-full h-12 rounded-full font-bold bg-white !text-slate-900 hover:bg-green-500 hover:!text-white transition-all duration-300 text-base shadow-sm hover:shadow-green-500/30" 
                  asChild
                >
                  <Link href="/for-companies">Request a Demo</Link>
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Task categories */}
      <section className="border-b border-slate-200/50 bg-slate-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-8">
            <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Task categories</h2>
            <p className="mt-2 text-base text-slate-600 font-medium">Specialize in what you're best at.</p>
          </div>
          <div className="mx-auto flex max-w-5xl flex-wrap justify-center gap-2.5">
            {categories.map((c) => (
              <span key={c} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 shadow-sm hover:border-blue-400 hover:text-blue-700 hover:shadow-md hover:-translate-y-0.5 transition-all cursor-default">
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / quality */}
      <section className="border-b border-slate-200/50 bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-bold mb-4">
                <ShieldCheck className="h-4 w-4" /> Enterprise-Grade
              </div>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-4">Built for serious AI work</h2>
              <p className="text-base text-slate-600 mb-6 font-medium">Not a gig site. A quality-controlled evaluation platform trusted for the tasks that shape how AI models behave.</p>
              <ul className="space-y-3">
                {["Server-side time tracking", "Gold-standard tasks to detect quality drift", "Immutable financial ledger, transactional payouts", "Anti-fraud risk scoring with human review"].map((line) => (
                  <li key={line} className="flex items-start gap-3 text-base font-semibold text-slate-700">
                    <div className="bg-blue-100 p-1 rounded-full mt-0.5"><CheckCircle2 className="h-4 w-4 text-blue-600 shrink-0" /></div>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {trustPoints.map((t) => {
                const Icon = t.icon;
                return (
                  <Card key={t.title} className="border-slate-200 shadow-sm hover:shadow-lg transition-shadow p-0 rounded-xl">
                    <div className="p-6">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 mb-4"><Icon className="h-6 w-6" /></div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">{t.title}</h3>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">{t.description}</p>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-b border-slate-200/50 bg-slate-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-extrabold text-center text-slate-900 sm:text-3xl mb-12">Loved by Trainers Worldwide</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, i) => (
              <Card key={i} className="border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 p-0 rounded-xl">
                <div className="p-8">
                  <div className="flex gap-1 mb-5 text-yellow-400">{[1, 2, 3, 4, 5].map((star) => <Star key={star} className="w-5 h-5 fill-current" />)}</div>
                  <p className="text-base text-slate-700 italic mb-6 font-medium">"{testimonial.quote}"</p>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-100 to-purple-100 text-blue-700 rounded-full flex items-center justify-center text-lg font-extrabold shadow-inner">{testimonial.name.charAt(0)}</div>
                    <div>
                      <p className="text-base font-bold text-slate-900">{testimonial.name}</p>
                      <p className="text-sm font-medium text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col items-start justify-between gap-8 px-4 sm:px-6 lg:px-8 py-16 md:flex-row md:items-center relative z-10">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">Ready to train the next generation of AI?</h2>
            <p className="max-w-xl text-blue-100 text-lg font-medium">Create your profile, take your first assessment, and unlock paid tasks this week.</p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Button size="lg" variant="secondary" className="rounded-full h-14 px-8 text-lg font-bold text-blue-700 shadow-xl hover:-translate-y-1 transition-transform" asChild>
              <Link href="/register" className="flex flex-row items-center justify-center gap-2 whitespace-nowrap">
                Become an AI Trainer 
                <ArrowRight className="h-5 w-5 stroke-[3]" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="rounded-full h-14 px-8 text-lg font-bold border-white/40 bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm transition-all hover:-translate-y-1" asChild>
              <Link href="/for-companies">For Companies</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-between gap-6 py-10 text-base font-medium md:flex-row px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-bold text-white text-lg">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm text-white">E</div>
            Evalia © {new Date().getFullYear()}
          </div>
          <div className="flex flex-wrap items-center gap-8">
            <Link href="/about" className="hover:text-white transition-colors">About</Link>
            <Link href="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}