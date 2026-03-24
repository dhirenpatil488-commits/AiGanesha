"use client";

import { useState } from "react";
import { Home, Building2, Factory, Leaf, ArrowRight, BarChart3, Target, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import HouseholdCalculator from "@/components/calculators/household-calculator";
import BusinessCalculator from "@/components/calculators/business-calculator";
import IndustryCalculator from "@/components/calculators/industry-calculator";

type CalculatorType = "landing" | "household" | "business" | "industry";

const calculatorOptions = [
  {
    id: "household" as const,
    title: "Household",
    description: "Calculate your personal and family carbon footprint",
    icon: Home,
    features: ["Energy consumption", "Transportation", "Food & diet", "Shopping habits"],
    color: "from-emerald-500/20 to-emerald-500/5",
    borderColor: "border-emerald-500/30",
    iconColor: "text-emerald-400",
  },
  {
    id: "business" as const,
    title: "Business",
    description: "Small to medium business emissions tracking",
    icon: Building2,
    features: ["Office operations", "Employee commuting", "Business travel", "Procurement"],
    color: "from-sky-500/20 to-sky-500/5",
    borderColor: "border-sky-500/30",
    iconColor: "text-sky-400",
  },
  {
    id: "industry" as const,
    title: "Industry",
    description: "Enterprise-level GHG Protocol reporting",
    icon: Factory,
    features: ["Multi-facility tracking", "Full Scope 1-3", "Sector benchmarking", "Reduction targets"],
    color: "from-amber-500/20 to-amber-500/5",
    borderColor: "border-amber-500/30",
    iconColor: "text-amber-400",
  },
];

const stats = [
  { value: "2.0", label: "India Average", sublabel: "tonnes CO₂e/person/year" },
  { value: "4.7", label: "Global Average", sublabel: "tonnes CO₂e/person/year" },
  { value: "1.5°C", label: "Paris Target", sublabel: "maximum warming" },
];

export default function GHGCalculator() {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>("landing");

  if (activeCalculator !== "landing") {
    const CalculatorComponent = {
      household: HouseholdCalculator,
      business: BusinessCalculator,
      industry: IndustryCalculator,
    }[activeCalculator];

    return (
      <main className="min-h-screen bg-background">
        <CalculatorComponent onBack={() => setActiveCalculator("landing")} />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Leaf className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">GHG Calculator</h1>
              <p className="text-xs text-muted-foreground">Carbon Footprint Tool</p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              GHG Protocol Compliant
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
        <div className="container mx-auto px-4 py-16 md:py-24 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <BarChart3 className="h-4 w-4" />
              Measure. Understand. Reduce.
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 text-balance leading-tight">
              Calculate Your
              <span className="text-primary"> Carbon Footprint</span>
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 text-pretty max-w-2xl mx-auto">
              Make informed decisions about your environmental impact. Our calculator helps households, businesses, and industries measure and reduce their greenhouse gas emissions.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-xl mx-auto mb-12">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                  <div className="text-xs text-muted-foreground/70 hidden md:block">{stat.sublabel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Selection */}
      <section className="container mx-auto px-4 pb-16 md:pb-24">
        <div className="text-center mb-10">
          <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Choose Your Calculator</h3>
          <p className="text-muted-foreground">Select the option that best matches your needs</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {calculatorOptions.map((option) => (
            <Card
              key={option.id}
              className={`group relative overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/5 bg-gradient-to-b ${option.color} ${option.borderColor} border`}
              onClick={() => setActiveCalculator(option.id)}
            >
              <CardHeader className="pb-4">
                <div className={`h-12 w-12 rounded-xl bg-secondary flex items-center justify-center mb-4 ${option.iconColor}`}>
                  <option.icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-xl text-foreground">{option.title}</CardTitle>
                <CardDescription className="text-muted-foreground">{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  {option.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" variant="secondary">
                  Start Calculation
                  <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t border-border/50 bg-card/30">
        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Detailed Breakdown</h4>
              <p className="text-sm text-muted-foreground">Visualize your emissions by category with interactive charts</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Reduction Tips</h4>
              <p className="text-sm text-muted-foreground">Get personalized recommendations to lower your footprint</p>
            </div>
            <div className="text-center">
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-primary" />
              </div>
              <h4 className="font-semibold text-foreground mb-2">Global Standards</h4>
              <p className="text-sm text-muted-foreground">Calculations based on GHG Protocol and IPCC guidelines</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Based on GHG Protocol methodology with India-specific emission factors</p>
          <p className="mt-1">Data sources: IPCC, DEFRA, Central Electricity Authority of India</p>
        </div>
      </footer>
    </main>
  );
}
