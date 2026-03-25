import React, { useEffect } from "react";
import { Home, Building2, Factory, BarChart3, Target, Globe, ArrowRight } from "lucide-react";

const calculatorOptions = [
  {
    id: "household",
    title: "Household",
    description: "Calculate your personal and family carbon footprint",
    icon: Home,
    features: ["Energy consumption", "Transportation", "Food & diet", "Shopping habits"],
  },
  {
    id: "business",
    title: "Business",
    description: "Small to medium business emissions tracking",
    icon: Building2,
    features: ["Office operations", "Employee commuting", "Business travel", "Procurement"],
  },
  {
    id: "industry",
    title: "Industry",
    description: "Enterprise-level GHG Protocol reporting",
    icon: Factory,
    features: ["Multi-facility tracking", "Full Scope 1-3", "Sector benchmarking", "Reduction targets"],
  },
];

const stats = [
  { value: "2.0", label: "India Average", sublabel: "tCO₂e/person/yr" },
  { value: "4.7", label: "Global Average", sublabel: "tCO₂e/person/yr" },
  { value: "1.5°C", label: "Paris Target", sublabel: "Max warming" },
];

export default function LandingScreen({ onSelect, onBackToPlatform }) {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <main className="min-h-screen flex flex-col relative z-10 transition-colors duration-500">
            {/* ── Navigation ─────────────────────────────────────────────── */}
            <header className="border-b border-dotted border-white/10 sticky top-0 z-50 bg-[#080C10]/85 backdrop-blur-md">
                <div className="w-full max-w-[680px] mx-auto px-4 sm:px-0 flex justify-between">
                    <div className="py-3.5 sm:py-5 flex items-center">
                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        >
                            <span className="font-semibold text-[18px] sm:text-[22px] text-white/90 tracking-[-0.03em] select-none">
                                ai<span style={{ color: "#F4A261" }}>G</span>anesha
                            </span>
                        </div>
                    </div>
                    <div className="py-3.5 sm:py-5 flex items-center gap-5 sm:gap-6">
                        {onBackToPlatform && (
                            <button
                                onClick={onBackToPlatform}
                                className="text-[11px] sm:text-[12px] font-mono text-white/30 hover:text-white/70 transition-colors duration-300 uppercase tracking-[0.12em]"
                            >
                                ← Back
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* ── Hero Section ─────────────────────────────────────────────── */}
            <section className="relative overflow-hidden border-b border-dotted border-white/10">
                <div className="w-full max-w-[680px] mx-auto px-4 sm:px-0">
                    <div className="pt-8 pb-12 sm:pt-12 sm:pb-20 space-y-6 sm:space-y-8">

                        {/* Eyebrow + Headline Group */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/40 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.12em] mb-4 sm:mb-5">
                                <BarChart3 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                                <span>Measure. Understand. Reduce.</span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-[26px] min-[375px]:text-[28px] sm:text-[36px] md:text-[42px] leading-[1.15] tracking-[-0.03em] text-white font-sans">
                                <span className="font-semibold">Calculate Your</span><br />
                                <span className="font-light text-white/50">Carbon Footprint</span>
                            </h1>
                        </div>

                        <p className="text-[14px] sm:text-[15px] md:text-[16px] leading-[1.65] tracking-[-0.01em] text-white/35 max-w-[520px] font-sans font-normal">
                            Make informed decisions about your environmental impact. Our tools help households, businesses, and industries measure and reduce their greenhouse gas emissions.
                        </p>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 border-t border-l border-dotted border-white/10 mt-8 sm:mt-12">
                            {stats.map((stat, i) => (
                                <div
                                    key={i}
                                    className="py-6 sm:py-8 px-4 sm:px-5 border-r border-b border-dotted border-white/10 flex flex-col justify-between"
                                >
                                    <div className="text-[18px] sm:text-[22px] md:text-[26px] font-semibold text-white leading-none tracking-[-0.03em] mb-2">
                                        {stat.value}
                                    </div>
                                    <div>
                                        <div className="text-[10px] sm:text-[11px] font-mono text-white/30 uppercase tracking-[0.1em] leading-[1.4] mb-0.5">
                                            {stat.label}
                                        </div>
                                        <div className="text-[9px] sm:text-[10px] font-mono text-white/20 uppercase tracking-[0.1em] leading-[1.4]">
                                            {stat.sublabel}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Calculator Selection ─────────────────────────────────────────────── */}
            <section className="border-b border-dotted border-white/10">
                <div className="w-full max-w-[680px] mx-auto px-4 sm:px-0">
                    
                    <div className="grid grid-cols-1">
                        {calculatorOptions.map((option, idx) => (
                            <div
                                key={option.id}
                                className={`py-12 sm:py-16 flex flex-col ${idx !== calculatorOptions.length - 1 ? "border-b border-dotted border-white/10" : ""}`}
                            >
                                <div className="flex items-center gap-4 sm:gap-5 mb-5 sm:mb-6">
                                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                                        <option.icon className="h-4 w-4 sm:h-5 sm:w-5 text-white/60" />
                                    </div>
                                    <h3 className="text-[20px] sm:text-[24px] md:text-[28px] font-semibold text-white/90 leading-none tracking-[-0.02em]">
                                        {option.title}
                                    </h3>
                                </div>
                                
                                <p className="text-[14px] sm:text-[15px] md:text-[16px] leading-[1.65] tracking-[-0.01em] text-white/45 mb-8 sm:mb-10 max-w-[480px]">
                                    {option.description}
                                </p>

                                <ul className="space-y-3 sm:space-y-4 mb-8 sm:mb-10 max-w-[480px]">
                                    {option.features.map((feature) => (
                                        <li key={feature} className="flex items-center gap-4 sm:gap-5 text-[14px] sm:text-[15px] text-white/50">
                                            <span className="text-white/20 text-[12px] sm:text-[14px] font-mono tracking-widest select-none shrink-0">—</span>
                                            <span className="leading-tight font-light">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <div>
                                    <button
                                        onClick={() => onSelect(option.id)}
                                        className="group relative inline-flex items-center justify-center gap-2.5 sm:gap-3 w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 border text-[11px] sm:text-[12px] font-mono uppercase tracking-[0.14em] transition-all duration-400 overflow-hidden"
                                        style={{
                                            borderColor: 'rgba(255,255,255,0.2)',
                                            color: 'rgba(255,255,255,0.5)',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
                                            e.currentTarget.style.color = 'rgba(255,255,255,1)';
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                                            e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                                            e.currentTarget.style.background = 'transparent';
                                        }}
                                    >
                                        <span className="relative z-10 flex items-center gap-2.5 sm:gap-3">
                                            Start {option.title}
                                            <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:translate-x-0.5 transition-transform duration-400" />
                                        </span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Footer ─────────────────────────────────────────────────── */}
            <footer className="py-8 sm:py-12">
                <div className="w-full max-w-[680px] mx-auto px-4 sm:px-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                        <div>
                            <h4 className="text-[11px] sm:text-[12px] font-mono text-white/30 mb-2.5 flex items-center gap-2 uppercase tracking-[0.1em]">
                                <BarChart3 className="h-3.5 w-3.5" />
                                Detailed Breakdown
                            </h4>
                            <p className="text-[13px] sm:text-[14px] leading-[1.6] text-white/20">Visualize your emissions by category with interactive charts.</p>
                        </div>

                        <div>
                            <h4 className="text-[11px] sm:text-[12px] font-mono text-white/30 mb-2.5 flex items-center gap-2 uppercase tracking-[0.1em]">
                                <Target className="h-3.5 w-3.5" />
                                Reduction Tips
                            </h4>
                            <p className="text-[13px] sm:text-[14px] leading-[1.6] text-white/20">Get personalized recommendations to lower your footprint.</p>
                        </div>
                    </div>
                </div>
            </footer>
        </main>
    );
}
