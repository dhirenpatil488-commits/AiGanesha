import React from 'react';
import { Leaf, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PlatformHome({ onNavigate, onBack }) {
    return (
        <main className="min-h-screen flex flex-col relative z-10 transition-colors duration-500">
            {/* ── Navigation ─────────────────────────────────────────────── */}
            <header className="border-b border-dotted border-white/15 sticky top-0 z-50 bg-[#0d0f17]/80 backdrop-blur-md">
                <div className="w-full max-w-[680px] mx-auto px-4 sm:px-0 flex justify-between">
                    <div className="py-4 sm:py-6 flex items-center">
                        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                            <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
                                <Leaf className="h-5 w-5 sm:h-6 sm:w-6 text-[#4EA8DE]" />
                            </div>
                            <span className="font-bold text-[15px] sm:text-base text-white tracking-tight">ai<span style={{ color: "#F4A261" }}>G</span>anesha</span>
                        </div>
                    </div>
                    <div className="py-4 sm:py-6 flex items-center gap-6">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="text-[13px] sm:text-[14px] font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest"
                            >
                                Back to Intro
                            </button>
                        )}
                        <a href="mailto:founder@aiganesha.org" className="text-[13px] sm:text-[14px] font-mono text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest hidden sm:block">
                            Contact
                        </a>
                    </div>
                </div>
            </header>

            {/* ── Hero ───────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden border-b border-dotted border-white/15">
                <div className="w-full max-w-[680px] mx-auto px-4 sm:px-0">
                    <div className="pt-4 pb-10 sm:pt-6 sm:pb-20 space-y-8 sm:space-y-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-[11px] sm:text-[12px] font-mono uppercase tracking-widest">
                            <Activity size={14} />
                            <span>Building for the Future</span>
                        </div>

                        <h1 className="text-[32px] sm:text-[40px] leading-[1.2] tracking-[-0.03em] font-bold text-white text-balance">
                            Intelligence for a<br />
                            <span className="text-secondary">Sustainable Future</span>
                        </h1>

                        <p className="text-[15px] sm:text-[16px] leading-[1.48] tracking-[-0.02em] text-muted-foreground w-full">
                            ai<span style={{ color: "#F4A261" }}>G</span>anesha provides accessible tools to understand and measure GHG emissions
                            across households, businesses, and industries using structured carbon accounting methodologies.
                        </p>

                        <div className="pt-4 sm:pt-8 w-full">
                            <Button
                                onClick={() => onNavigate('landing')}
                                variant="secondary"
                                size="lg"
                                className="w-full text-[13px] sm:text-[14px] px-8 py-6 rounded-none font-mono uppercase tracking-widest bg-white/5 border border-white/20 hover:bg-white/10 text-white transition-all duration-300 h-auto whitespace-normal shadow-none"
                            >
                                Take Your First Step Towards Sustainability
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Principles ─────────────────────── */}
            <section className="border-b border-dotted border-white/15">
                <div className="w-full max-w-[680px] mx-auto px-4 sm:px-0">
                    {/* Climate Reality */}
                    <div className="py-8 sm:py-10 border-b border-dotted border-white/15">
                        <h2 className="text-[24px] sm:text-[26px] leading-[1.4] tracking-[-0.03em] font-bold text-white mb-4">Climate Reality</h2>
                        <p className="text-[15px] sm:text-[16px] leading-[1.48] tracking-[-0.02em] text-muted-foreground">
                            A hotter planet means more floods, droughts, and extreme weather.
                            Understanding emissions is the first step toward reducing them.
                        </p>
                    </div>

                    {/* Our Vision */}
                    <div className="py-8 sm:py-10 border-b border-dotted border-white/15">
                        <h2 className="text-[24px] sm:text-[26px] leading-[1.4] tracking-[-0.03em] font-bold text-white mb-4">Our Vision</h2>
                        <p className="text-[15px] sm:text-[16px] leading-[1.48] tracking-[-0.02em] text-muted-foreground">
                            To buy more time for the planet and the life it sustains.
                        </p>
                    </div>

                    {/* Our Mission */}
                    <div className="py-8 sm:py-10">
                        <h2 className="text-[24px] sm:text-[26px] leading-[1.4] tracking-[-0.03em] font-bold text-white mb-4">Our Mission</h2>
                        <p className="text-[15px] sm:text-[16px] leading-[1.48] tracking-[-0.02em] text-muted-foreground">
                            To make sustainability intelligence accessible through powerful and responsible tools.
                        </p>
                    </div>
                </div>
            </section>

            {/* ── Footer ─────────────────────────────────────────────────── */}
            <footer className="py-8 border-b border-dotted border-white/15">
                <div className="w-full max-w-[680px] mx-auto px-4 sm:px-0">
                    <div className="text-[13px] sm:text-[14px] font-mono text-muted-foreground flex flex-col md:flex-row justify-between uppercase tracking-widest gap-4 sm:gap-0">
                        <p>Based on GHG Protocol methodology.</p>
                        <p className="opacity-60">Data: IPCC, DEFRA, CEA India</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
