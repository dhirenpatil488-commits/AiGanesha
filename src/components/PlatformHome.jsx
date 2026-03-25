import React, { useState } from 'react';
import { Leaf, ArrowRight, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PlatformHome({ onNavigate, onBack }) {
    const [showReasoning, setShowReasoning] = useState(false);

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
                            <span className="font-semibold text-[18px] sm:text-[22px] text-white/90 tracking-[-0.03em]">
                                ai<span style={{ color: "#F4A261" }}>G</span>anesha
                            </span>
                        </div>
                    </div>
                    <div className="py-3.5 sm:py-5 flex items-center gap-5 sm:gap-6">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="text-[11px] sm:text-[12px] font-mono text-white/30 hover:text-white/70 transition-colors duration-300 uppercase tracking-[0.12em]"
                            >
                                ← Back
                            </button>
                        )}
                        <a
                            href="mailto:founder@aiganesha.org"
                            className="text-[11px] sm:text-[12px] font-mono text-white/30 hover:text-white/70 transition-colors duration-300 uppercase tracking-[0.12em] hidden sm:block"
                        >
                            Contact
                        </a>
                    </div>
                </div>
            </header>

            {/* ── Hero ───────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden border-b border-dotted border-white/10">
                <div className="w-full max-w-[680px] mx-auto px-4 sm:px-0">
                    <div className="pt-8 pb-12 sm:pt-12 sm:pb-20 space-y-6 sm:space-y-8">

                        {/* Eyebrow + Headline Group */}
                        <div>
                            <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/40 text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.12em] mb-4 sm:mb-5">
                                <span>Building for the future</span>
                            </div>

                            {/* Headline — two tone */}
                            <h1 className="text-[26px] min-[375px]:text-[28px] sm:text-[36px] md:text-[42px] leading-[1.15] tracking-[-0.03em] text-white font-sans">
                                <span className="font-semibold">Intelli<span style={{ color: "#F4A261" }}>g</span>ence for a</span><br />
                                <span className="font-light text-white/50">Sustainable Future</span>
                            </h1>
                        </div>

                        {/* Description */}
                        <p className="text-[14px] sm:text-[15px] md:text-[16px] leading-[1.65] tracking-[-0.01em] text-white/35 max-w-[520px] font-sans font-normal">
                            ai<span style={{ color: "#F4A261" }}>G</span>anesha provides accessible tools to understand and measure GHG emissions across households, businesses, and industries using structured carbon accounting methodologies.
                        </p>

                        {/* Ghost CTA button */}
                        <div className="pt-2 sm:pt-4 w-full">
                            <button
                                onClick={() => onNavigate('landing')}
                                className="group relative inline-flex items-center justify-center gap-2.5 sm:gap-3 w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 border text-[11px] sm:text-[12px] font-mono uppercase tracking-[0.14em] transition-all duration-400 overflow-hidden"
                                style={{
                                    borderColor: 'rgba(244,162,97,0.35)',
                                    color: 'rgba(255,255,255,0.78)',
                                    background: 'rgba(244,162,97,0.04)',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.borderColor = 'rgba(244,162,97,0.65)';
                                    e.currentTarget.style.color = 'rgba(255,255,255,1)';
                                    e.currentTarget.style.boxShadow = '0 0 20px rgba(244,162,97,0.12)';
                                    e.currentTarget.style.background = 'rgba(244,162,97,0.08)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.borderColor = 'rgba(244,162,97,0.35)';
                                    e.currentTarget.style.color = 'rgba(255,255,255,0.78)';
                                    e.currentTarget.style.boxShadow = 'none';
                                    e.currentTarget.style.background = 'rgba(244,162,97,0.04)';
                                }}
                            >
                                <span className="relative z-10 flex items-center gap-2.5 sm:gap-3">
                                    Take Your First Step
                                    <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:translate-x-0.5 transition-transform duration-400" />
                                </span>
                            </button>
                        </div>

                        {/* ── Climate Stats Grid ── */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-l border-dotted border-white/10 mt-8 sm:mt-12">
                            {[
                                { value: "50", unit: "years", label: "Until 1.5°C is locked in" },
                                { value: "200M", unit: "people", label: "Displaced by climate" },
                                { value: "7M", unit: "/ year", label: "Deaths from air pollution" },
                                { value: "50%", unit: "land", label: "Used by humans" },
                            ].map((stat, i) => (
                                <div
                                    key={i}
                                    className="py-6 sm:py-8 px-4 sm:px-6 border-r border-b border-dotted border-white/10"
                                >
                                    <div className="text-[20px] sm:text-[24px] md:text-[28px] font-semibold text-white leading-none tracking-[-0.03em] mb-2">
                                        {stat.value}
                                        <span className="text-[12px] sm:text-[13px] font-mono text-white/40 ml-1">{stat.unit}</span>
                                    </div>
                                    <div className="text-[10px] sm:text-[11px] font-mono text-white/30 uppercase tracking-[0.1em] leading-[1.4]">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                    </div>
                </div>
            </section>

            {/* ── Principles ─────────────────────────────────────────────── */}
            <section className="border-b border-dotted border-white/10">
                <div className="w-full max-w-[680px] mx-auto px-4 sm:px-0">

                    {/* Climate Reality */}
                    <div className="py-7 sm:py-10 border-b border-dotted border-white/10 relative">
                        <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                            <h2 className="text-[15px] sm:text-[16px] leading-[1.65] text-white/45 font-sans">
                                Climate Reality
                            </h2>
                            {/* Mobile/Tablet button */}
                            <button
                                onClick={() => setShowReasoning(true)}
                                className="flex lg:hidden items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group cursor-pointer"
                            >
                                <Info className="h-3 w-3 text-[#F4A261] opacity-70 group-hover:opacity-100 transition-opacity" />
                                <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.1em] text-white/40 group-hover:text-white/70 transition-colors pt-0.5">
                                    Reasoning
                                </span>
                            </button>
                        </div>
                        
                        <div className="relative w-full min-h-[40px]">
                            <p className="text-[15px] sm:text-[16px] leading-[1.65] text-white/45 font-sans mb-2 sm:mb-0 sm:w-[85%] pr-4 md:pr-0">
                                We have about a decade left to avoid the most severe and irreversible climate impacts.
                            </p>

                            {/* Laptop hand-drawn annotation almost touching the grid line */}
                            <button
                                onClick={() => setShowReasoning(true)}
                                className="hidden lg:flex absolute left-full ml-2 top-1/2 -translate-y-[40%] items-center gap-3 cursor-pointer group opacity-90 hover:opacity-100 transition-opacity w-max"
                            >
                                {/* Hand-drawn SVG arrow pointing LEFT towards paragraph */}
                                <svg width="45" height="16" viewBox="0 0 45 16" fill="none" className="text-[#e76f51] group-hover:-translate-x-1.5 transition-transform translate-y-0.5">
                                    <path d="M45 8 Q 28 14 10 8 M 10 8 Q 14 3 16 1 M 10 8 Q 14 13 16 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="text-[#e76f51] text-[16px] xl:text-[17px] whitespace-nowrap" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", "Marker Felt", hand, cursive', transform: 'rotate(-4deg)', letterSpacing: '0.01em' }}>
                                    Know the reasoning
                                </span>
                            </button>
                        </div>
                    </div>

                    {/* Our Vision */}
                    <div className="py-7 sm:py-10 border-b border-dotted border-white/10">
                        <h2 className="text-[15px] sm:text-[16px] leading-[1.65] text-white/45 font-sans mb-1">
                            Our Vision
                        </h2>
                        <p className="text-[15px] sm:text-[16px] leading-[1.65] text-white/45 font-sans">
                            To buy more time for the planet and the life it sustains.
                        </p>
                    </div>

                    {/* Our Mission */}
                    <div className="py-7 sm:py-10">
                        <h2 className="text-[15px] sm:text-[16px] leading-[1.65] text-white/45 font-sans mb-1">
                            Our Mission
                        </h2>
                        <p className="text-[15px] sm:text-[16px] leading-[1.65] text-white/45 font-sans">
                            To make sustainability intelligence accessible through powerful and responsible tools.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Footer ─────────────────────────────────────────────────── */}
            <footer className="py-6 sm:py-8">
                <div className="w-full max-w-[680px] mx-auto px-4 sm:px-0">
                    <div className="text-[10px] sm:text-[11px] font-mono text-white/20 flex flex-col sm:flex-row justify-between uppercase tracking-[0.12em] gap-2 sm:gap-0">
                        <p>Based on GHG Protocol methodology.</p>
                        <p>Data: IPCC · DEFRA · CEA India</p>
                    </div>
                </div>
            </footer>

            {/* ── Reasoning Modal ────────────────────────────────────────────── */}
            <AnimatePresence>
                {showReasoning && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowReasoning(false)}
                            className="absolute inset-0 bg-[#080C10]/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="relative w-full max-w-[520px] bg-[#0d1218] border border-white/10 p-6 sm:p-8 rounded-2xl shadow-2xl overflow-y-auto max-h-[85vh] hide-scrollbar"
                        >
                            <button
                                onClick={() => setShowReasoning(false)}
                                className="absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/80 transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>

                            <div className="flex items-center gap-3 mb-5 sm:mb-6">
                                <div className="h-8 w-8 rounded-full bg-[#F4A261]/10 flex items-center justify-center border border-[#F4A261]/20">
                                    <Info className="h-4 w-4 text-[#F4A261]" />
                                </div>
                                <h3 className="text-[16px] sm:text-[18px] font-semibold text-white/90 tracking-[-0.01em]">
                                    The Math Behind the Decade
                                </h3>
                            </div>

                            <div className="space-y-4 text-[13px] sm:text-[15px] leading-[1.65] text-white/50 font-sans tracking-[-0.01em]">
                                <p>
                                    The carbon budget is the total amount of CO₂ that can still be emitted while keeping global warming within safer limits, such as 1.5°C.
                                </p>
                                <p>
                                    Current scientific estimates place this remaining budget at approximately <span className="text-white/80 font-medium">200–400 billion tonnes</span> of CO₂.
                                </p>
                                <p>
                                    At the same time, global emissions are about <span className="text-white/80 font-medium">40 billion tonnes</span> of CO₂ per year.
                                </p>
                                
                                <div className="py-4 px-5 rounded-lg border border-white/10 bg-white/[0.02] my-5 font-mono text-[12px] sm:text-[13px] text-white/60">
                                    <div className="mb-2 uppercase text-[10px] tracking-[0.1em] text-white/30">If emissions continue at this rate:</div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span><span className="text-[#F4A261]">200</span> ÷ 40</span>
                                        <span className="text-white/80">= 5 years</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span><span className="text-[#F4A261]">400</span> ÷ 40</span>
                                        <span className="text-white/80">= 10 years</span>
                                    </div>
                                </div>

                                <p>
                                    This means the remaining carbon budget could be exhausted within roughly <strong className="text-white/90 font-medium">5 to 10 years</strong>.
                                </p>
                                <p>
                                    As this budget is used up, the likelihood of exceeding 1.5°C increases, along with the risk of severe and irreversible climate impacts.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
