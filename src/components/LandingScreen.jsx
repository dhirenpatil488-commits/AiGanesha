import React, { useEffect, useState } from "react";
import { Home, Building2, Factory, BarChart3, ArrowRight } from "lucide-react";

const calculatorOptions = [
  {
    id: "household",
    title: "Household",
    eyebrow: "Personal",
    description: "Energy, transport, diet, and consumption habits.",
    icon: Home,
    features: ["Energy consumption", "Transportation", "Food & diet", "Shopping"],
  },
  {
    id: "business",
    title: "Business",
    eyebrow: "SME",
    description: "Office operations, fleet, travel, and supply chain.",
    icon: Building2,
    features: ["Office operations", "Commuting", "Business travel", "Procurement"],
  },
  {
    id: "industry",
    title: "Industry",
    eyebrow: "Enterprise",
    description: "Full Scope 1-3 reporting across multiple facilities.",
    icon: Factory,
    features: ["Multi-facility", "Full Scope 1–3", "Benchmarking", "Targets"],
  },
];

export default function LandingScreen({ onSelect, onBackToPlatform }) {
  const [hovered, setHovered] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <main className="min-h-screen flex flex-col font-sans">

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080C10]/90 backdrop-blur-xl">
        <div className="w-full max-w-[860px] mx-auto px-6 sm:px-8 flex justify-between items-center py-5">
          <span className="font-semibold text-[20px] text-white/90 tracking-[-0.03em]">
            ai<span style={{ color: "#F4A261" }}>G</span>anesha
          </span>
          {onBackToPlatform && (
            <button onClick={onBackToPlatform}
              className="text-[11px] font-mono text-white/25 hover:text-white/60 transition-colors uppercase tracking-[0.14em]">
              ← Back
            </button>
          )}
        </div>
      </header>

      <div className="w-full max-w-[860px] mx-auto px-6 sm:px-8">

        {/* ── Hero ── */}
        <div className="pt-10 sm:pt-16 pb-14 sm:pb-20 border-b border-white/[0.06]">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-7 rounded-sm border border-white/[0.08] bg-white/[0.025] text-white/30 text-[10px] font-mono uppercase tracking-[0.16em]">
            <BarChart3 className="h-3 w-3 opacity-50" />
            Measure. Understand. Reduce.
          </div>

          <h1 className="text-[38px] sm:text-[52px] md:text-[62px] font-semibold leading-[1.05] tracking-[-0.04em] text-white mb-5">
            Calculate Your<br />
            <span style={{ color: 'rgba(255,255,255,0.22)' }} className="font-light">Carbon Footprint</span>
          </h1>

          <p className="text-[15px] sm:text-[17px] leading-[1.75] text-white/30 max-w-[520px] mb-10 sm:mb-12">
            Structured carbon accounting for households, businesses, and industries — built on GHG Protocol methodology.
          </p>

          {/* Stats strip */}
          <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 md:gap-14">
            {[
              { value: "2.0", label: "India Average", sub: "tCO₂e/person/yr" },
              { value: "4.7", label: "Global Average", sub: "tCO₂e/person/yr" },
              { value: "1.5°C", label: "Paris Target", sub: "Max warming" },
            ].map((s, i) => (
              <div key={i} className="flex items-baseline gap-3 sm:block">
                <span className="text-[28px] sm:text-[32px] font-semibold tracking-[-0.04em] text-white leading-none">{s.value}</span>
                <div className="sm:mt-2">
                  <div className="text-[11px] font-mono text-white/30 uppercase tracking-[0.1em]">{s.label}</div>
                  <div className="text-[10px] font-mono text-white/15 uppercase tracking-[0.08em] mt-0.5">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Calculator Selection ── */}
        <div className="py-12 sm:py-16">
          <p className="text-[10px] sm:text-[11px] font-mono text-white/20 uppercase tracking-[0.2em] mb-8 sm:mb-10">
            Select a Calculator
          </p>

          <div className="flex flex-col gap-4">
            {calculatorOptions.map((option) => {
              const Icon = option.icon;
              const isHovered = hovered === option.id;
              return (
                <div
                  key={option.id}
                  onClick={() => onSelect(option.id)}
                  onMouseEnter={() => setHovered(option.id)}
                  onMouseLeave={() => setHovered(null)}
                  className="flex items-center gap-5 sm:gap-7 p-6 sm:p-7 rounded-sm border cursor-pointer transition-all duration-300"
                  style={{
                    background: isHovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.018)',
                    borderColor: isHovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
                    transform: isHovered ? 'translateY(-2px)' : 'none',
                    boxShadow: isHovered ? '0 12px 40px rgba(0,0,0,0.4)' : 'none',
                  }}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 h-11 w-11 sm:h-12 sm:w-12 rounded-sm flex items-center justify-center border transition-all duration-300"
                    style={{
                      background: isHovered ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
                      borderColor: isHovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)',
                    }}>
                    <Icon className="h-5 w-5 transition-colors duration-300"
                      style={{ color: isHovered ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.25)' }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-3 mb-1.5">
                      <h2 className="text-[20px] sm:text-[24px] font-semibold tracking-[-0.03em] transition-colors duration-300"
                        style={{ color: isHovered ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.75)' }}>
                        {option.title}
                      </h2>
                      <span className="text-[10px] font-mono uppercase tracking-[0.12em]"
                        style={{ color: isHovered ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.18)' }}>
                        {option.eyebrow}
                      </span>
                    </div>
                    <p className="text-[13px] sm:text-[14px] leading-relaxed mb-3 transition-colors duration-300"
                      style={{ color: isHovered ? 'rgba(255,255,255,0.38)' : 'rgba(255,255,255,0.25)' }}>
                      {option.description}
                    </p>
                    <div className="hidden sm:flex flex-wrap gap-x-4 gap-y-1">
                      {option.features.map((f) => (
                        <span key={f} className="text-[11px] font-mono flex items-center gap-1.5 transition-colors duration-300"
                          style={{ color: 'rgba(255,255,255,0.18)' }}>
                          <span className="w-0.5 h-0.5 rounded-full bg-white/20" />
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ArrowRight className="flex-shrink-0 h-4 w-4 transition-all duration-300"
                    style={{
                      color: isHovered ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.15)',
                      transform: isHovered ? 'translateX(3px)' : 'none',
                    }} />
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer line */}
        <div className="border-t border-white/[0.05] py-8">
          <p className="text-[10px] font-mono text-white/12 uppercase tracking-[0.15em]">
            GHG Protocol · IPCC · DEFRA · CEA India
          </p>
        </div>

      </div>
    </main>
  );
}
