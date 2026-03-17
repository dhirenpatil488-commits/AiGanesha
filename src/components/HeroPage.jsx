import React from "react";
import { Leaf, Globe, ArrowRight, Flame, Eye, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNerdMode } from '@/lib/NerdModeContext';

export default function HeroPage({ onStart, onBackToPlatform }) {
  const { toggleNerdMode, isNerdMode } = useNerdMode();

  return (
    <main className="min-h-screen bg-background flex flex-col">

      {/* ── Navigation ─────────────────────────────────────────────── */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="font-bold text-lg text-foreground tracking-tight">AiGanesha</span>
              <p className="text-xs text-muted-foreground leading-none mt-0.5">Carbon Intelligence Platform</p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex items-center gap-6">
            <button
              onClick={onBackToPlatform}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Back to Platform
            </button>
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
      <section className="relative flex-1 overflow-hidden">
        {/* Ambient gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-background pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] bg-primary/3 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-6 py-20 md:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">

            {/* Platform name */}
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-4">AiGanesha</p>

            {/* Headline */}
            <h1 className="text-5xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight tracking-tight">
              Intelligence for a<br />
              <span className="text-secondary">Sustainable Future</span>
            </h1>

            {/* Description */}
            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              AiGanesha provides accessible tools to understand and measure greenhouse gas emissions
              across households, businesses, and industries using structured carbon accounting methodologies.
            </p>

            {/* CTA */}
            <Button
              onClick={onStart}
              variant="secondary"
              size="lg"
              className="text-base px-8 py-6 rounded-xl font-semibold shadow-lg shadow-secondary/30 hover:bg-primary hover:shadow-primary/30 transition-all duration-300"
            >
              Take Your First Step Towards Sustainability
            </Button>
          </div>
        </div>
      </section>

      {/* ── Climate Reality + Vision + Mission ─────────────────────── */}
      <section className="border-t border-border/50 bg-card/20 py-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">

            {/* Climate Reality */}
            <div className="group p-8 rounded-2xl border border-border/50 bg-card/40 hover:bg-card/60 hover:border-primary/30 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-6 group-hover:bg-orange-500/20 transition-colors">
                <Flame className="h-6 w-6 text-orange-400" />
              </div>
              <h2 className="text-base font-semibold text-foreground mb-3">Climate Reality</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                A hotter planet means more floods, droughts, and extreme weather.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mt-3">
                Understanding emissions is the first step toward reducing them.
              </p>
            </div>

            {/* Our Vision */}
            <div className="group p-8 rounded-2xl border border-border/50 bg-card/40 hover:bg-card/60 hover:border-primary/30 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-base font-semibold text-foreground mb-3">Our Vision</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                To buy more time for the planet and the life it sustains.
              </p>
            </div>

            {/* Our Mission */}
            <div className="group p-8 rounded-2xl border border-border/50 bg-card/40 hover:bg-card/60 hover:border-primary/30 transition-all duration-300">
              <div className="h-12 w-12 rounded-xl bg-sky-500/10 flex items-center justify-center mb-6 group-hover:bg-sky-500/20 transition-colors">
                <Target className="h-6 w-6 text-sky-400" />
              </div>
              <h2 className="text-base font-semibold text-foreground mb-3">Our Mission</h2>
              <p className="text-muted-foreground text-sm leading-relaxed">
                To make sustainability intelligence accessible through powerful and responsible tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-border/50 py-6">
        <div className="container mx-auto px-6 text-center text-sm text-muted-foreground">
          <p>Based on GHG Protocol methodology with India-specific emission factors</p>
          <p className="mt-1 text-muted-foreground/60">
            Data sources: IPCC, DEFRA, Central Electricity Authority of India
          </p>
        </div>
      </footer>

    </main>
  );
}
