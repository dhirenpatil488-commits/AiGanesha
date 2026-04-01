"use client";

import { ArrowLeft, TreeDeciduous, Car, Plane, Home, TrendingDown, Lightbulb, RotateCcw, Share2, Download, Fingerprint, AlertCircle, Leaf, CheckCircle2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { HouseholdResult, BusinessResult, IndustryResult } from "@/lib/calculations";

interface EmissionsResultProps {
  result: HouseholdResult | BusinessResult | IndustryResult;
  type: "household" | "business" | "industry";
  onBack: () => void;
  onStartOver: () => void;
}

const CHART_COLORS = [
  "#F4A261", // orange
  "#4EA8DE", // sky blue
  "#3fb950", // green
  "#a78bfa", // purple
  "#f87171", // red
  "#60a5fa", // blue
];

const HOUSEHOLD_RECOMMENDATIONS: Record<string, string[]> = {
  Energy: [
    "Switch off appliances at the wall when not in use",
    "Upgrade to LED lighting and 5-star ACs/fridges",
    "Set AC temperature to 24°C instead of 18°C",
  ],
  Transport: [
    "Carpool or use public transit twice a week",
    "Keep tires properly inflated to improve mileage",
    "Switch to an EV or electric two-wheeler",
  ],
  Flights: [
    "Combine business trips to reduce flight frequency",
    "Opt for direct flights (takeoffs use the most fuel)",
    "Replace one short flight with a train journey",
  ],
  Food: [
    "Adopt a meatless meal or day once a week",
    "Buy local, seasonal produce to reduce transport tags",
    "Plan meals carefully to reduce food waste",
  ],
  Shopping: [
    "Buy second-hand or refurbished electronics",
    "Invest in high-quality, long-lasting clothing",
    "Resist fast fashion and impulse online purchases",
  ],
  Waste: [
    "Start composting wet/kitchen waste at home",
    "Recycle paper, plastic, and glass locally",
    "Avoid single-use plastics and over-packaging",
  ],
};

function isHouseholdResult(r: any): r is HouseholdResult {
  return "annualTonnes" in r && "perCapita" in r.annualTonnes;
}
function isBusinessResult(r: any): r is BusinessResult {
  return "dashboard" in r && "score" in r.dashboard;
}
function isIndustryResult(r: any): r is IndustryResult {
  return "facilityEmissions" in r;
}

// ── Stat Card ─────────────────────────────────────────────────────────────────
function StatCard({ value, label, sub, accent }: { value: string | number; label: string; sub?: string; accent?: string }) {
  return (
    <div className="relative flex flex-col p-6 rounded-2xl border border-white/[0.07] bg-white/[0.025] overflow-hidden group hover:border-white/[0.14] hover:bg-white/[0.04] transition-all duration-300">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      <div
        className="text-[36px] sm:text-[44px] font-mono font-semibold leading-none tracking-[-0.03em] mb-2"
        style={{ color: accent || "rgba(255,255,255,0.85)" }}
      >
        {value}
      </div>
      <div className="text-[10px] font-mono uppercase tracking-[0.14em] text-white/30">{label}</div>
      {sub && <div className="text-[12px] font-mono text-white/50 mt-1">{sub}</div>}
    </div>
  );
}

// ── Progress Bar ───────────────────────────────────────────────────────────────
function ScopeBar({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-[12px] font-mono">
        <span className="text-white/50">{label}</span>
        <span className="text-white/70">{value}</span>
      </div>
      <div className="h-[3px] w-full bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export default function EmissionsResult({ result, type, onBack, onStartOver }: EmissionsResultProps) {
  const chartData = result.chartData.map((item, i) => ({
    ...item,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  }));

  // ── Derived KPIs ─────────────────────────────────────────────────────────────
  let totalTonnes = 0;
  let perCapitaTonnes = 0;
  let thirdLabel = "";
  let thirdValue: string | number = "";
  let thirdSub = "";

  let earths = 0;
  let biggestMistakeName = "";
  let biggestMistakePct = 0;
  let recommendedActions: string[] = [];

  if (isHouseholdResult(result)) {
    totalTonnes = result.annualTonnes.total;
    perCapitaTonnes = result.annualTonnes.perCapita;
    thirdValue = `${result.context.indiaMultiplier}×`;
    thirdLabel = "India Average";
    thirdSub = "Benchmark status";
    
    // Insights Calculations
    earths = Number((perCapitaTonnes / 2.0).toFixed(1));
    const highest = chartData[0] || { name: "Energy", percentage: 0 };
    biggestMistakeName = highest.name;
    biggestMistakePct = highest.percentage;
    recommendedActions = HOUSEHOLD_RECOMMENDATIONS[highest.name] || HOUSEHOLD_RECOMMENDATIONS["Energy"];
  } else if (isBusinessResult(result)) {
    totalTonnes = result.tonnes.total;
    perCapitaTonnes = result.dashboard.perEmployeeTonnes;
    thirdValue = result.dashboard.score;
    thirdLabel = "Efficiency Score";
    thirdSub = result.dashboard.ratingStr;
  } else if (isIndustryResult(result)) {
    totalTonnes = result.tonnes.total;
    perCapitaTonnes = result.dashboard.perEmployeeTonnes;
    thirdLabel = "vs Industry";
    thirdValue = result.benchmark.status;
  }

  // ── Color for total ───────────────────────────────────────────────────────────
  const totalColor =
    perCapitaTonnes < 2 ? "#3fb950" : perCapitaTonnes < 5 ? "#F4A261" : "#f85149";

  return (
    <div className="min-h-screen pb-24 font-sans" style={{ background: "#080C10" }}>

      {/* ── Sticky Nav ── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080C10]/90 backdrop-blur-xl">
        <div className="w-full max-w-[900px] mx-auto px-5 sm:px-8 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[11px] font-mono text-white/30 hover:text-white/70 uppercase tracking-[0.14em] transition-colors bg-transparent border-none cursor-pointer"
          >
            <ArrowLeft size={14} /> Back to Form
          </button>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-white/30 hover:text-white/60 hover:border-white/[0.14] transition-all text-[11px] font-mono uppercase tracking-[0.12em] cursor-pointer">
              <Share2 size={13} /> Share
            </button>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/[0.08] bg-white/[0.03] text-white/30 hover:text-white/60 hover:border-white/[0.14] transition-all text-[11px] font-mono uppercase tracking-[0.12em] cursor-pointer">
              <Download size={13} /> Export
            </button>
          </div>
        </div>
      </header>

      <div className="w-full max-w-[900px] mx-auto px-5 sm:px-8 pt-10 sm:pt-14">

        {/* ── Page Title ── */}
        <div className="mb-10">
          <p className="text-[11px] sm:text-[12px] font-mono text-white/20 uppercase tracking-[0.2em] mb-3">Results</p>
          <h1 className="text-[28px] sm:text-[36px] font-semibold tracking-[-0.03em] text-white leading-tight">
            Emissions Dashboard
          </h1>
          <p className="text-[14px] text-white/30 font-mono mt-2">
            Annual greenhouse gas emissions — breakdown & insights.
          </p>
        </div>

        {/* ── KPI Cards ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          <StatCard
            value={totalTonnes.toFixed(1)}
            label={`Total tCO₂e / year`}
            accent={totalColor}
          />
          <StatCard
            value={perCapitaTonnes.toFixed(2)}
            label={type === "household" ? "Per person  t / year" : "Per employee  t / year"}
          />
          <StatCard
            value={thirdValue}
            label={thirdLabel}
            sub={thirdSub}
          />
        </div>

        {/* ── Analytics Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

          {/* Pie Chart */}
          <div className="relative p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/25 mb-1">Breakdown</p>
            <h2 className="text-[15px] font-semibold text-white/80 tracking-[-0.02em] mb-5">Emissions by Category</h2>
            <div className="h-[220px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData} dataKey="value" nameKey="name"
                    cx="50%" cy="50%" outerRadius={85} innerRadius={55}
                    paddingAngle={2} stroke="none"
                  >
                    {chartData.map((entry, i) => (
                      <Cell key={`c-${i}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => [`${(val / 1000).toFixed(2)} t`, "Emissions"]}
                    contentStyle={{ backgroundColor: "#0d1218", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "10px", fontSize: "12px", color: "#fff" }}
                    itemStyle={{ color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 mt-4">
              {chartData.map((item) => (
                <div key={item.name} className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.fill }} />
                  <span className="text-[11px] font-mono text-white/50 truncate">{item.name}</span>
                  <span className="text-[11px] font-mono text-white/25 ml-auto">{item.percentage ? `${Math.round(item.percentage)}%` : ""}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Scopes / Benchmark */}
          <div className="relative p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            {(isBusinessResult(result) || isIndustryResult(result)) ? (
              <>
                <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/25 mb-1">GHG Protocol</p>
                <h2 className="text-[15px] font-semibold text-white/80 tracking-[-0.02em] mb-6">Protocol Scopes</h2>
                <div className="space-y-5">
                  {(() => {
                    const total = result.tonnes.total || 1;
                    const s1p = isBusinessResult(result) ? result.percentages.scope1 : (result.tonnes.scope1 / total) * 100;
                    const s2p = isBusinessResult(result) ? result.percentages.scope2 : (result.tonnes.scope2 / total) * 100;
                    const s3p = isBusinessResult(result) ? result.percentages.scope3 : (result.tonnes.scope3 / total) * 100;
                    return (
                      <>
                        <ScopeBar label="Scope 1 — Direct" value={`${result.tonnes.scope1.toFixed(2)} t  (${s1p.toFixed(1)}%)`} pct={s1p} color="#f85149" />
                        <ScopeBar label="Scope 2 — Electricity" value={`${result.tonnes.scope2.toFixed(2)} t  (${s2p.toFixed(1)}%)`} pct={s2p} color="#F4A261" />
                        <ScopeBar label="Scope 3 — Value Chain" value={`${result.tonnes.scope3.toFixed(2)} t  (${s3p.toFixed(1)}%)`} pct={s3p} color="#4EA8DE" />
                      </>
                    );
                  })()}
                </div>
              </>
            ) : isHouseholdResult(result) ? (
              <>
                <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/25 mb-1">Benchmarks</p>
                <h2 className="text-[15px] font-semibold text-white/80 tracking-[-0.02em] mb-6">How You Compare</h2>
                <div className="space-y-5">
                  <ScopeBar label="India Average" value={`${result.context.indiaAverage} t`} pct={(result.context.indiaAverage / 10) * 100} color="#3fb950" />
                  <ScopeBar label="Global Average" value={`${result.context.globalAverage} t`} pct={(result.context.globalAverage / 10) * 100} color="#F4A261" />
                  <ScopeBar label="Your Footprint" value={`${result.annualTonnes.perCapita.toFixed(2)} t`} pct={(result.annualTonnes.perCapita / 10) * 100} color={totalColor} />
                </div>
                {/* Gradient slider */}
                <div className="mt-8 relative">
                  <div className="h-[5px] rounded-full bg-gradient-to-r from-[#3fb950] via-[#F4A261] to-[#f85149]" />
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full border-2 border-[#080C10] shadow-md transition-all duration-700"
                    style={{ left: `${Math.min((result.annualTonnes.perCapita / 10) * 100, 97)}%`, transform: "translate(-50%, -50%)" }}
                  />
                  <div className="flex justify-between text-[10px] font-mono text-white/20 mt-2">
                    <span>0t</span><span>India {result.context.indiaAverage}t</span><span>Global {result.context.globalAverage}t</span><span>10t+</span>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* ── Real-World Equivalents ── */}
        <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden mb-4">
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
          <div className="px-6 pt-5 pb-3 border-b border-white/[0.05] flex items-center gap-2">
            <TrendingDown size={14} className="text-white/25" />
            <p className="text-[10px] font-mono uppercase tracking-[0.18em] text-white/25">Real-World Equivalents</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.05]">
            {isHouseholdResult(result) && (<>
              <EquivCell icon={<Car size={18} className="text-[#4EA8DE]" />} value={result.context.drivingKm.toLocaleString()} label="km of driving" color="#4EA8DE" />
              <EquivCell icon={<Plane size={18} className="text-[#F4A261]" />} value={result.context.delhiMumbaiFlights} label="Delhi–Mumbai flights" color="#F4A261" />
              <EquivCell icon={<TreeDeciduous size={18} className="text-[#3fb950]" />} value={result.context.trees.toLocaleString()} label="trees to offset" color="#3fb950" />
            </>)}
            {isBusinessResult(result) && (<>
              <EquivCell icon={<Car size={18} className="text-[#4EA8DE]" />} value={result.dashboard.equivalents.drivingKm.toLocaleString()} label="km of driving" color="#4EA8DE" />
              <EquivCell icon={<Home size={18} className="text-[#a78bfa]" />} value={result.dashboard.equivalents.homesPowered} label="homes powered / yr" color="#a78bfa" />
              <EquivCell icon={<TreeDeciduous size={18} className="text-[#3fb950]" />} value={result.dashboard.equivalents.trees} label="trees to offset" color="#3fb950" />
            </>)}
            {isIndustryResult(result) && (<>
              <EquivCell icon={<Car size={18} className="text-[#4EA8DE]" />} value={result.equivalents.drivingKm.toLocaleString()} label="km of driving" color="#4EA8DE" />
              <EquivCell icon={<Plane size={18} className="text-[#F4A261]" />} value={result.equivalents.flightsEquivalent} label="international flights" color="#F4A261" />
              <EquivCell icon={<TreeDeciduous size={18} className="text-[#3fb950]" />} value={result.equivalents.trees} label="trees to offset" color="#3fb950" />
            </>)}
          </div>
        </div>

        {/* ── Household Insights ── */}
        {isHouseholdResult(result) && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {/* If Everyone Lived Like You */}
            <div className="relative p-7 rounded-sm border border-white/[0.12] bg-gradient-to-br from-white/[0.04] to-transparent shadow-lg flex flex-col items-start justify-between">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div>
                <div className="w-10 h-10 rounded-sm bg-[#4EA8DE]/15 flex items-center justify-center mb-5">
                  <Fingerprint className="text-[#4EA8DE]" size={18} />
                </div>
                <h3 className="text-[15px] font-semibold text-[#4EA8DE] tracking-[-0.01em] mb-2 leading-tight">If Everyone Lived Like You</h3>
                <p className="text-[14px] text-white/60 leading-relaxed">
                  We would need <span className="text-[#4EA8DE] font-semibold">{earths} Earths</span> to sustain this lifestyle.
                </p>
              </div>
            </div>

            {/* Your Biggest Mistake */}
            <div className="relative p-7 rounded-sm border border-white/[0.12] bg-gradient-to-br from-[#f85149]/[0.03] to-transparent shadow-lg flex flex-col items-start justify-between">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div>
                <div className="w-10 h-10 rounded-sm bg-[#f85149]/15 flex items-center justify-center mb-5">
                  <AlertCircle className="text-[#f85149]" size={18} />
                </div>
                <h3 className="text-[15px] font-semibold text-[#f85149] tracking-[-0.01em] mb-2 leading-tight">Your Biggest Metric</h3>
                <p className="text-[14px] text-white/60 leading-relaxed">
                  Your highest emissions come from <span className="text-white/85 font-semibold">{biggestMistakeName}</span>, contributing <span className="text-[#f85149] font-semibold">{Math.round(biggestMistakePct)}%</span> of your footprint.
                </p>
              </div>
            </div>

            {/* Small Changes, Big Impact */}
            <div className="relative p-7 rounded-sm border border-white/[0.12] bg-gradient-to-br from-[#3fb950]/[0.03] to-transparent shadow-lg flex flex-col items-start">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <div className="w-10 h-10 rounded-sm bg-[#3fb950]/15 flex items-center justify-center mb-5">
                <Leaf className="text-[#3fb950]" size={18} />
              </div>
              <h3 className="text-[15px] font-semibold text-[#3fb950] tracking-[-0.01em] mb-4 leading-tight">Small Changes, Big Impact</h3>
              <p className="text-[13px] text-white/50 mb-3">Tackle your {biggestMistakeName} footprint:</p>
              <div className="space-y-3 w-full">
                {recommendedActions.map((action, i) => (
                  <div key={i} className="flex gap-3 items-start">
                    <CheckCircle2 size={16} className="text-[#3fb950] mt-[2px] flex-shrink-0" />
                    <span className="text-[13px] text-white/70 leading-snug">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Reduction Opportunities (Business) ── */}
        {isBusinessResult(result) && result.dashboard.opportunities.length > 0 && (
          <div className="relative rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 mb-4">
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="flex items-center gap-2 mb-5">
              <Lightbulb size={14} className="text-[#F4A261]" />
              <h2 className="text-[13px] font-semibold text-white/70 tracking-[-0.01em]">Reduction Opportunities</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {result.dashboard.opportunities.map((opp, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                  <div className="text-[10px] font-mono text-[#3fb950] uppercase tracking-[0.12em] mb-2">
                    Save {opp.potentialReductionTonnes} tCO₂e / yr
                  </div>
                  <p className="text-[13px] text-white/55 font-sans leading-relaxed">{opp.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer Actions ── */}
        <div className="flex items-center justify-center gap-3 mt-10 pt-8 border-t border-white/[0.05]">
          <button
            onClick={onStartOver}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.08] bg-white/[0.025] text-white/40 hover:text-white/70 hover:border-white/[0.14] transition-all text-[11px] font-mono uppercase tracking-[0.14em] cursor-pointer"
          >
            <RotateCcw size={13} /> Start Over
          </button>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/[0.08] bg-white/[0.025] text-white/40 hover:text-white/70 hover:border-white/[0.14] transition-all text-[11px] font-mono uppercase tracking-[0.14em] cursor-pointer"
          >
            <ArrowLeft size={13} /> Edit Inputs
          </button>
        </div>

      </div>
    </div>
  );
}

// ── Equivalent Cell ────────────────────────────────────────────────────────────
function EquivCell({ icon, value, label, color }: { icon: React.ReactNode; value: string | number; label: string; color: string }) {
  return (
    <div className="flex items-center gap-4 px-6 py-5 hover:bg-white/[0.02] transition-colors">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
        {icon}
      </div>
      <div>
        <div className="text-[22px] font-mono font-semibold text-white/80 leading-none tracking-[-0.02em]">{value}</div>
        <div className="text-[11px] font-mono text-white/30 mt-1 uppercase tracking-[0.08em]">{label}</div>
      </div>
    </div>
  );
}
