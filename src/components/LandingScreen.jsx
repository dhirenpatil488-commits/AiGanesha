import React from "react";
import { Home, Building2, Factory, Leaf, BarChart3, Target, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

const calculatorOptions = [
  {
    id: "household",
    title: "Household",
    description: "Calculate your personal and family carbon footprint",
    icon: Home,
    features: ["Energy consumption", "Transportation", "Food & diet", "Shopping habits"],
    iconColor: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  {
    id: "business",
    title: "Business",
    description: "Small to medium business emissions tracking",
    icon: Building2,
    features: ["Office operations", "Employee commuting", "Business travel", "Procurement"],
    iconColor: "text-sky-400",
    bgColor: "bg-sky-500/10",
  },
  {
    id: "industry",
    title: "Industry",
    description: "Enterprise-level GHG Protocol reporting",
    icon: Factory,
    features: ["Multi-facility tracking", "Full Scope 1-3", "Sector benchmarking", "Reduction targets"],
    iconColor: "text-amber-400",
    bgColor: "bg-amber-500/10",
  },
];

const stats = [
  { value: "2.0", label: "India Average", sublabel: "tCO₂e/person/yr" },
  { value: "4.7", label: "Global Average", sublabel: "tCO₂e/person/yr" },
  { value: "1.5°C", label: "Paris Target", sublabel: "Max warming" },
];

export default function LandingScreen({ onSelect, onBackToPlatform }) {
  return (
    <main className="min-h-screen flex flex-col relative z-10 transition-colors duration-500">
      {/* ── Header ─────────────────────────────────────────────── */}
      <header className="border-b border-dotted border-white/15 sticky top-0 z-50 bg-[#0d0f17]/80 backdrop-blur-md">
        <div className="w-full max-w-[680px] mx-auto px-4 sm:px-0 grid grid-cols-2">
          {/* Logo */}
          <div className="py-4 sm:py-6 flex items-center">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <span className="font-bold text-[15px] sm:text-base text-foreground tracking-tight">GHG Calculator</span>
            </div>
          </div>

          {/* Navigation / Back */}
          <div className="py-4 sm:py-6 flex flex-col sm:flex-row items-end sm:items-center justify-end gap-1 sm:gap-4">
            <span className="hidden sm:flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono text-muted-foreground uppercase tracking-widest opacity-60">
              <Globe className="h-3 w-3" />
              Protocol Compliant
            </span>
            {onBackToPlatform && (
              <button
                onClick={onBackToPlatform}
                className="flex items-center gap-1.5 text-[13px] sm:text-[14px] font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest mt-1 sm:mt-0"
              >
                ← Home
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Section ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-dotted border-white/15">
        <div className="w-full max-w-[680px] mx-auto px-4 sm:px-0">
          <div className="pt-4 pb-10 sm:pt-6 sm:pb-20 space-y-8 sm:space-y-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[11px] sm:text-[12px] font-mono uppercase tracking-widest">
              <BarChart3 className="h-4 w-4" />
              <span>Measure. Understand. Reduce.</span>
            </div>

            <h2 className="text-[32px] sm:text-[40px] leading-[1.2] tracking-[-0.03em] font-bold text-foreground text-balance">
              Calculate Your<br />
              <span className="text-primary">Carbon Footprint</span>
            </h2>

            <p className="text-[15px] sm:text-[16px] leading-[1.48] tracking-[-0.02em] text-muted-foreground w-full">
              Make informed decisions about your environmental impact. Our calculator helps households, businesses, and industries measure and reduce their greenhouse gas emissions.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 pt-8 border-t border-dotted border-white/15">
              {stats.map((stat) => (
                <div key={stat.label} className="text-left">
                  <div className="text-[24px] sm:text-[26px] leading-[1.4] tracking-[-0.03em] font-bold text-accent mb-1">{stat.value}</div>
                  <div className="text-[11px] sm:text-[12px] font-mono text-muted-foreground uppercase tracking-widest">{stat.label}</div>
                  <div className="text-[10px] uppercase font-mono text-muted-foreground/60 mt-1">{stat.sublabel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Calculator Selection ─────────────────────────────────────────────── */}
      <section className="border-b border-dotted border-white/15">
        <div className="w-full max-w-[680px] mx-auto px-4 sm:px-0">
          <div className="py-6 border-b border-dotted border-white/15">
            <h3 className="text-[13px] sm:text-[14px] font-mono text-foreground uppercase tracking-widest opacity-80">Choose Your Calculator</h3>
          </div>

          <div className="grid grid-cols-1">
            {calculatorOptions.map((option, idx) => (
              <div
                key={option.id}
                className={`py-10 flex flex-col ${idx !== calculatorOptions.length - 1 ? "border-b border-dotted border-white/15" : ""}`}
              >
                <div className={`h-12 w-12 sm:h-14 sm:w-14 rounded-xl flex items-center justify-center mb-6 border border-white/10 ${option.bgColor} ${option.iconColor}`}>
                  <option.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                </div>

                <h3 className="text-[24px] sm:text-[26px] leading-[1.4] tracking-[-0.03em] font-bold text-foreground mb-3">{option.title}</h3>
                <p className="text-[15px] sm:text-[16px] leading-[1.48] tracking-[-0.02em] text-muted-foreground mb-8">
                  {option.description}
                </p>

                <ul className="space-y-4 mb-10">
                  {option.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-[14px] sm:text-[15px] font-mono text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span className="leading-tight">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full text-[13px] sm:text-[14px] px-10 py-6 rounded-none font-mono uppercase tracking-widest bg-white/5 border border-white/20 hover:bg-white/10 text-white transition-colors"
                  variant="secondary"
                  onClick={() => onSelect(option.id)}
                >
                  Start Calculator
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ─────────────────────────────────────────────── */}
      <section className="border-b border-dotted border-white/15">
        <div className="w-full max-w-[680px] mx-auto px-4 sm:px-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-0">
            <div className="py-8 sm:py-10 border-b border-dotted border-white/15 sm:border-b-0">
              <h4 className="text-[13px] sm:text-[14px] font-mono text-foreground mb-2 flex items-center gap-2 uppercase tracking-widest">
                <BarChart3 className="h-4 w-4 text-primary" />
                Detailed Breakdown
              </h4>
              <p className="text-[15px] sm:text-[16px] leading-[1.48] tracking-[-0.02em] text-muted-foreground">Visualize your emissions by category with interactive charts.</p>
            </div>

            <div className="py-8 sm:py-10">
              <h4 className="text-[13px] sm:text-[14px] font-mono text-foreground mb-2 flex items-center gap-2 uppercase tracking-widest">
                <Target className="h-4 w-4 text-primary" />
                Reduction Tips
              </h4>
              <p className="text-[15px] sm:text-[16px] leading-[1.48] tracking-[-0.02em] text-muted-foreground">Get personalized recommendations to lower your footprint.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
