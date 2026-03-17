import React from 'react';
import { Leaf, ArrowRight, Activity, Flame, Eye, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PlatformHome({ onNavigate }) {
    return (
        <main className="min-h-screen bg-background flex flex-col relative z-10 transition-colors duration-500">

            {/* ── Navigation ─────────────────────────────────────────────── */}
            <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="w-full max-w-7xl mx-auto px-5 md:px-10 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                        {/* G symbol cropped from logo */}
                        <div className="h-20 w-20 rounded-2xl bg-white flex items-center justify-center overflow-hidden shrink-0 shadow-sm border border-border/50">
                            <img
                                src="/aiganesha-logo.png"
                                alt="AiGanesha"
                                className="w-auto object-cover"
                                style={{ objectPosition: '52% center', width: '104px', height: '68px', marginLeft: '-14px' }}
                            />
                        </div>
                    </div>
                    <nav className="flex items-center gap-6">
                        <a
                            href="mailto:founder@aiganesha.org"
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors hidden sm:block"
                        >
                            Contact
                        </a>
                    </nav>
                </div>
            </header>

            {/* ── Hero ───────────────────────────────────────────────────── */}
            <section className="relative overflow-hidden pt-10 pb-8 md:pt-14 md:pb-12">
                {/* Ambient gradients */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-background pointer-events-none" />
                <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-primary/3 rounded-full blur-3xl pointer-events-none" />

                <div className="w-full max-w-5xl mx-auto px-5 md:px-10 relative">
                    <div className="max-w-3xl mx-auto space-y-12">
                        {/* Branding & Main Heading (Centered in screen axis) */}
                        <div className="flex flex-col items-center space-y-8 text-center lg:-mx-32">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
                                <Activity size={16} />
                                <span>Building for the Future</span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight tracking-tight">
                                Intelligence for a<br />
                                <span className="text-secondary">Sustainable Future</span>
                            </h1>
                        </div>

                        {/* Description (Starts at 768px baseline, spans 1024px width) */}
                        <div className="flex justify-start">
                            <p className="text-lg sm:text-xl md:text-xl text-muted-foreground w-full lg:w-[1024px] lg:max-w-none leading-relaxed px-2 md:px-0 text-left">
                                AiGanesha provides accessible tools to understand and measure GHG emissions
                                across households, businesses, and industries using structured carbon accounting methodologies.
                            </p>
                        </div>

                        {/* CTA (Centered) */}
                        <div className="flex justify-center pt-4 md:pt-8">
                            <div className="relative inline-flex flex-col items-center">
                                <Button
                                    onClick={() => onNavigate('landing')}
                                    variant="secondary"
                                    size="lg"
                                    className="text-sm sm:text-base px-6 py-4 sm:px-8 sm:py-6 rounded-xl font-semibold shadow-lg shadow-secondary/30 hover:bg-primary hover:shadow-primary/30 transition-all duration-300 h-auto whitespace-normal"
                                >
                                    Take Your First Step Towards Sustainability
                                </Button>

                                {/* Decorative handwritten note */}
                                <div className="absolute -right-24 top-1/2 -translate-y-1/2 hidden lg:block">
                                    <span className="font-cursive text-secondary text-2xl rotate-12 inline-block">
                                        Start here →
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Climate Reality + Vision + Mission ─────────────────────── */}
            <section className="border-t border-border/50 bg-card/20 py-20">
                <div className="w-full max-w-7xl mx-auto px-5 md:px-10">
                    <div className="flex flex-col gap-12 max-w-3xl mx-auto text-left">

                        {/* Climate Reality */}
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Climate Reality</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                A hotter planet means more floods, droughts, and extreme weather. <br className="hidden sm:block" />
                                Understanding emissions is the first step toward reducing them.
                            </p>
                        </div>

                        {/* Our Vision */}
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Our Vision</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                To buy more time for the planet and the life it sustains.
                            </p>
                        </div>

                        {/* Our Mission */}
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">Our Mission</h2>
                            <p className="text-muted-foreground text-lg leading-relaxed">
                                To make sustainability intelligence accessible through powerful and responsible tools.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Footer ─────────────────────────────────────────────────── */}
            <footer className="border-t border-border/50 py-6">
                <div className="w-full max-w-7xl mx-auto px-5 md:px-10 text-center text-sm text-muted-foreground">
                    <p>Based on GHG Protocol methodology with India-specific emission factors</p>
                    <p className="mt-1 text-muted-foreground/60">
                        Data sources: IPCC, DEFRA, Central Electricity Authority of India
                    </p>
                </div>
            </footer>

        </main>
    );
}
