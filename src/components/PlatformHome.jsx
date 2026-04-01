import React, { useState } from 'react';
import { ArrowRight, X, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PlatformHome({ onNavigate, onBack }) {
    const [showReasoning, setShowReasoning] = useState(false);

    return (
        <main className="min-h-screen flex flex-col font-sans">

            {/* ── Nav ── */}
            <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#080C10]/90 backdrop-blur-xl">
                <div className="w-full max-w-[860px] mx-auto px-6 sm:px-8 flex justify-between items-center py-5">
                    <span className="font-semibold text-[20px] text-white/90 tracking-[-0.03em] cursor-pointer"
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        ai<span style={{ color: "#F4A261" }}>G</span>anesha
                    </span>
                    <div className="flex items-center gap-6">
                        {onBack && (
                            <button onClick={onBack}
                                className="text-[11px] font-mono text-white/25 hover:text-white/60 transition-colors uppercase tracking-[0.14em]">
                                ← Back
                            </button>
                        )}
                        <a href="mailto:founder@aiganesha.org"
                            className="hidden sm:block text-[11px] font-mono text-white/25 hover:text-white/60 transition-colors uppercase tracking-[0.14em]">
                            Contact
                        </a>
                    </div>
                </div>
            </header>

            <div className="w-full max-w-[860px] mx-auto px-6 sm:px-8">

                {/* ── Hero ── */}
                {/* ── Hero ── */}
                <div className="pt-2 sm:pt-6 pb-12 sm:pb-16 border-b border-white/[0.06]">
                    
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-5 rounded-sm border border-white/[0.08] bg-white/[0.025] text-white/30 text-[10px] font-mono uppercase tracking-[0.16em]">
                        <span className="w-1 h-1 rounded-sm bg-[#F4A261]/50" />
                        Building for the future
                    </div>

                    <h1 className="text-[38px] sm:text-[52px] md:text-[64px] font-semibold leading-[1.05] tracking-[-0.04em] text-white mb-5">
                        Intelligence for a<br />
                        <span style={{ color: 'rgba(255,255,255,0.22)' }} className="font-light">Sustainable Future</span>
                    </h1>

                    <p className="text-[15px] sm:text-[17px] leading-[1.75] text-white/30 max-w-[500px] mb-8 sm:mb-10">
                        ai<span style={{ color: "#F4A261" }}>G</span>anesha offers tools that help individuals and businesses see their true climate impact, so what was invisible becomes clear, and what is clear can be transformed.
                    </p>

                    <button
                        onClick={() => onNavigate('landing')}
                        className="group inline-flex items-center gap-3 px-7 py-4 rounded-sm border text-[12px] sm:text-[13px] font-mono uppercase tracking-[0.14em] transition-all duration-300"
                        style={{ borderColor: '#F4A261', color: '#fff', background: 'rgba(244,162,97,0.14)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,162,97,0.22)'; e.currentTarget.style.boxShadow = '0 0 32px rgba(244,162,97,0.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(244,162,97,0.14)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        Take Your First Step
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>

                    {/* ── Fact Strip (Original Research) ── */}
                    <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-3">
                        {[
                            { value: "50", unit: "yrs", label: "Until 1.5°C is locked in" },
                            { value: "200M", unit: "ppl", label: "Displaced by climate" },
                            { value: "7M", unit: "/yr", label: "Deaths from air pollution" },
                            { value: "50%", unit: "land", label: "Used by humans" },
                        ].map((stat, i) => (
                            <div key={i}
                                className="group relative flex flex-col p-5 sm:p-6 rounded-sm border border-white/[0.06] bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.035]"
                            >
                                {/* Subtle top accent */}
                                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Number + unit */}
                                <div className="flex items-baseline gap-1.5 mb-3">
                                    <span className="text-[28px] sm:text-[32px] font-mono font-semibold text-white/85 leading-none tracking-[-0.03em]">
                                        {stat.value}
                                    </span>
                                    <span className="text-[11px] font-mono text-white/30 tracking-[0.05em]">
                                        {stat.unit}
                                    </span>
                                </div>

                                {/* Label */}
                                <div className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.12em] leading-[1.65] text-white/35 group-hover:text-white/50 transition-colors duration-300">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Content Sections ── */}
                <div className="divide-y divide-white/[0.06]">
                    {/* Climate Reality */}
                    <div className="py-12 sm:py-16 relative">
                        <p className="text-[11px] sm:text-[13px] font-mono text-white/20 uppercase tracking-[0.2em] mb-6">Climate Reality</p>

                        <div className="flex flex-col sm:flex-row sm:items-end gap-5 sm:gap-10">
                            <p className="text-[22px] sm:text-[28px] md:text-[32px] leading-[1.55] text-white/50 font-light max-w-[600px]">
                                We have about a decade left to avoid the most severe and irreversible climate impacts.
                            </p>

                            {/* Mobile CTA: standard button */}
                            <button
                                onClick={() => setShowReasoning(true)}
                                className="flex sm:hidden mt-2 items-center gap-2.5 px-4 py-2.5 rounded-sm border border-white/[0.07] bg-white/[0.02] text-white/40 active:bg-white/[0.06] transition-all text-[11px] font-mono uppercase tracking-[0.12em] self-start"
                            >
                                <Info className="h-3.5 w-3.5" />
                                See the reasoning
                            </button>

                        </div>

                        {/* Desktop CTA: Hand-drawn annotation — left side, outside frame */}
                        <button
                            onClick={() => setShowReasoning(true)}
                            className="hidden md:flex flex-row items-center gap-4 cursor-pointer group opacity-60 hover:opacity-100 transition-opacity duration-300 absolute"
                            style={{ top: '65%', left: '-15px', transform: 'translateX(-100%) translateY(-50%)' }}
                        >
                            <span className="text-[#e07b54] whitespace-nowrap select-none"
                                style={{
                                    fontFamily: '"Comic Sans MS", "Chalkboard SE", "Marker Felt", cursive',
                                    fontSize: '18px',
                                    transform: 'rotate(-4deg)',
                                    display: 'inline-block',
                                    letterSpacing: '0.01em',
                                    marginTop: '-4px'
                                }}>
                                Know the reasoning
                            </span>
                            {/* Hand-drawn arrow (original shape, flipped horizontally) */}
                            <svg width="44" height="16" viewBox="0 0 44 16" fill="none"
                                className="text-[#e07b54] group-hover:translate-x-1 transition-transform duration-300 mt-1 scale-x-[-1]">
                                <path d="M44 8 Q 28 14 10 8 M 10 8 Q 14 3 16 1 M 10 8 Q 14 13 16 15"
                                    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                    </div>

                    {/* Our Vision */}
                    <div className="py-12 sm:py-16">
                        <p className="text-[11px] sm:text-[13px] font-mono text-white/20 uppercase tracking-[0.2em] mb-6">Our Vision</p>
                        <p className="text-[22px] sm:text-[28px] md:text-[32px] leading-[1.55] text-white/50 font-light max-w-[600px]">
                            To buy more time for the planet and the life it sustains.
                        </p>
                    </div>

                    {/* Our Mission */}
                    <div className="py-12 sm:py-16">
                        <p className="text-[11px] sm:text-[13px] font-mono text-white/20 uppercase tracking-[0.2em] mb-6">Our Mission</p>
                        <p className="text-[22px] sm:text-[28px] md:text-[32px] leading-[1.55] text-white/50 font-light max-w-[600px]">
                            To make sustainability intelligence accessible through powerful and responsible tools.
                        </p>
                    </div>
                </div>

                {/* ── Bottom CTA ── */}
                <div className="py-16 sm:py-20 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-8">
                    <div>
                        <p className="text-[11px] sm:text-[13px] font-mono text-white/20 uppercase tracking-[0.2em] mb-3">
                            Ready to start?
                        </p>
                        <p className="text-[22px] sm:text-[26px] font-semibold tracking-[-0.03em] text-white/80 leading-[1.2]">
                            Measure your impact.<br />
                            <span className="text-white/25 font-light">Then reduce it.</span>
                        </p>
                    </div>

                    <button
                        onClick={() => onNavigate('landing')}
                        className="group inline-flex items-center gap-3 px-7 py-4 rounded-sm border text-[12px] sm:text-[13px] font-mono uppercase tracking-[0.14em] transition-all duration-300 flex-shrink-0"
                        style={{ borderColor: '#F4A261', color: '#fff', background: 'rgba(244,162,97,0.14)' }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,162,97,0.22)'; e.currentTarget.style.boxShadow = '0 0 32px rgba(244,162,97,0.2)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(244,162,97,0.14)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        Take Your First Step
                        <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                </div>

                {/* Footer */}
                <div className="border-t border-white/[0.05] py-8">
                    <p className="text-[10px] font-mono text-white/12 uppercase tracking-[0.15em]">
                        GHG Protocol · IPCC · DEFRA · CEA India
                    </p>
                </div>

            </div>

            {/* ── Reasoning Modal ── */}
            <AnimatePresence>
                {showReasoning && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowReasoning(false)}
                            className="absolute inset-0 bg-[#080C10]/85 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.96, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 10 }}
                            className="relative w-full max-w-[500px] bg-[#0a0f15] border border-white/[0.08] p-7 sm:p-9 rounded-md shadow-2xl overflow-y-auto max-h-[85vh]">
                            <button onClick={() => setShowReasoning(false)}
                                className="absolute top-5 right-5 p-1.5 rounded-sm bg-white/[0.04] hover:bg-white/[0.08] text-white/30 hover:text-white/65 transition-colors">
                                <X className="h-4 w-4" />
                            </button>
                            <h3 className="text-[16px] font-semibold text-white/80 tracking-[-0.02em] mb-6">The Math Behind the Decade</h3>
                            <div className="space-y-4 text-[14px] leading-[1.8] text-white/38">
                                <p>The carbon budget is the total CO₂ that can still be emitted while keeping warming within 1.5°C.</p>
                                <p>Remaining budget: <span className="text-white/65">200–400 billion tonnes.</span> Annual emissions: <span className="text-white/65">~40 billion tonnes/year.</span></p>
                                <div className="py-4 px-5 rounded-sm border border-white/[0.07] bg-white/[0.02] font-mono text-[12px] text-white/40 space-y-2.5">
                                    <div className="text-[9px] uppercase tracking-[0.14em] text-white/18 mb-3">At current pace:</div>
                                    <div className="flex justify-between"><span>200 ÷ 40</span><span className="text-white/65">= 5 years</span></div>
                                    <div className="flex justify-between"><span>400 ÷ 40</span><span className="text-white/65">= 10 years</span></div>
                                </div>
                                <p>The budget could be exhausted within <span className="text-white/65 font-medium">5 to 10 years.</span></p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </main>
    );
}
