import React, { useEffect, useState } from "react";
import {
  Calculator,
  Package,
  FileText,
  Globe,
  Network,
  Zap,
  ShieldAlert,
  CircleDollarSign,
  ShoppingCart,
  ArrowRight,
  Lock,
  Hexagon,
  Radar
} from "lucide-react";

const toolsOptions = [
  {
    id: "landing",
    title: "GHG Calculator",
    eyebrow: "Available Now",
    description: "Measure scopes 1, 2, and 3 emissions for households, businesses, and industry.",
    icon: Calculator,
    status: "active"
  },
  {
    id: "lca",
    title: "LCA (Product Carbon Footprint)",
    eyebrow: "Coming Soon",
    description: "Cradle-to-grave analysis for individual products and services.",
    icon: Package,
    status: "upcoming"
  },
  {
    id: "report",
    title: "Sustainability Report Generator",
    eyebrow: "Coming Soon",
    description: "Automated standard-compliant ESG reporting and disclosures.",
    icon: FileText,
    status: "upcoming"
  },
  {
    id: "risk",
    title: "Climate Risk & Scenario Analysis",
    eyebrow: "Coming Soon",
    description: "Physical and transition risk forecasting aligned with TCFD.",
    icon: Radar,
    status: "upcoming"
  },
  {
    id: "supply-chain",
    title: "Supply Chain Assessment",
    eyebrow: "Coming Soon",
    description: "Vendor tracking and tier-based supplier emission modeling.",
    icon: Network,
    status: "upcoming"
  },
  {
    id: "energy",
    title: "Energy Transition Planner",
    eyebrow: "Coming Soon",
    description: "ROI and feasibility modeling for renewables and efficiency upgrades.",
    icon: Zap,
    status: "upcoming"
  },
  {
    id: "greenwash",
    title: "Greenwashing Detector",
    eyebrow: "Coming Soon",
    description: "AI-driven analysis of marketing claims against verifiable data.",
    icon: ShieldAlert,
    status: "upcoming"
  },
  {
    id: "simulator",
    title: "\"Do Nothing\" Cost Simulator",
    eyebrow: "Coming Soon",
    description: "Financial modeling of carbon taxes and lost market opportunities.",
    icon: CircleDollarSign,
    status: "upcoming"
  },
  {
    id: "impact",
    title: "“Before You Buy” Impact Checker",
    eyebrow: "Coming Soon",
    description: "Quick-scan product comparison for sustainable procurement.",
    icon: ShoppingCart,
    status: "upcoming"
  }
];

export default function ToolsDirectory({ onSelect, onBackToPlatform }) {
  const [hovered, setHovered] = useState(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <main className="min-h-screen flex flex-col font-sans mb-12">
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
        <div className="pt-10 sm:pt-16 pb-12 sm:pb-16 border-b border-white/[0.06]">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-7 rounded-sm border border-white/[0.08] bg-white/[0.025] text-white/30 text-[10px] font-mono uppercase tracking-[0.16em]">
            <Hexagon className="h-3 w-3 opacity-50" />
            Ecosystem
          </div>

          <h1 className="text-[38px] sm:text-[52px] md:text-[62px] font-semibold leading-[1.05] tracking-[-0.04em] text-white mb-5">
            Platform<br />
            <span style={{ color: 'rgba(255,255,255,0.22)' }} className="font-light">Tools & Solutions</span>
          </h1>

          <p className="text-[15px] sm:text-[17px] leading-[1.75] text-white/30 max-w-[560px]">
            A comprehensive suite of tools designed to help you measure, analyze, and reduce your environmental impact across every dimension.
          </p>
        </div>

        {/* ── Tools Grid ── */}
        <div className="py-12 sm:py-16">
          <p className="text-[10px] sm:text-[11px] font-mono text-white/20 uppercase tracking-[0.2em] mb-8 sm:mb-10">
            Select a Tool
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {toolsOptions.map((option) => {
              const Icon = option.icon;
              const isActive = option.status === "active";
              const isHovered = hovered === option.id && isActive;

              return (
                <div
                  key={option.id}
                  onClick={() => isActive && onSelect(option.id)}
                  onMouseEnter={() => setHovered(option.id)}
                  onMouseLeave={() => setHovered(null)}
                  className={`flex items-start gap-4 p-5 sm:p-6 rounded-sm border transition-all duration-300 ${isActive ? 'cursor-pointer' : 'cursor-default'}`}
                  style={{
                    background: isHovered ? 'rgba(255,255,255,0.04)' : isActive ? 'rgba(255,255,255,0.018)' : 'transparent',
                    borderColor: isHovered ? 'rgba(255,255,255,0.15)' : isActive ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.03)',
                    transform: isHovered ? 'translateY(-2px)' : 'none',
                    boxShadow: isHovered ? '0 12px 40px rgba(0,0,0,0.4)' : 'none',
                    opacity: isActive ? 1 : 0.4
                  }}
                >
                  {/* Icon */}
                  <div className="flex-shrink-0 h-10 w-10 sm:h-12 sm:w-12 rounded-sm flex items-center justify-center border transition-all duration-300 mt-1"
                    style={{
                      background: isHovered ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.03)',
                      borderColor: isHovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)',
                    }}>
                    <Icon className="h-5 w-5 transition-colors duration-300"
                      style={{ color: isHovered ? 'rgba(255,255,255,0.95)' : isActive ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.25)' }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-[10px] font-mono uppercase tracking-[0.12em]"
                        style={{
                          color: isHovered ? '#F4A261' : isActive ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.3)'
                        }}>
                        {option.eyebrow}
                      </span>
                    </div>
                    <h2 className="text-[17px] sm:text-[19px] font-semibold tracking-[-0.03em] transition-colors duration-300 mb-2 leading-tight"
                      style={{ color: isHovered ? 'rgba(255,255,255,0.95)' : isActive ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.6)' }}>
                      {option.title}
                    </h2>
                    <p className="text-[13px] leading-relaxed transition-colors duration-300"
                      style={{ color: isHovered ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.3)' }}>
                      {option.description}
                    </p>
                  </div>

                  {/* Right Status Icon */}
                  {isActive ? (
                    <ArrowRight className="flex-shrink-0 h-4 w-4 transition-all duration-300 mt-2"
                      style={{
                        color: isHovered ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.15)',
                        transform: isHovered ? 'translateX(3px)' : 'none',
                      }} />
                  ) : (
                    <Lock className="flex-shrink-0 h-4 w-4 mt-2"
                      style={{ color: 'rgba(255,255,255,0.15)' }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
