"use client";

import { ArrowLeft, TreeDeciduous, Car, Plane, Home, TrendingDown, Lightbulb, RotateCcw, Share2, Download, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import type { HouseholdResult, BusinessResult, IndustryResult } from "@/lib/calculations";

interface EmissionsResultProps {
  result: HouseholdResult | BusinessResult | IndustryResult;
  type: "household" | "business" | "industry";
  onBack: () => void;
  onStartOver: () => void;
}

const CHART_COLORS = [
  "hsl(142 71% 45%)",
  "hsl(200 80% 50%)",
  "hsl(45 93% 47%)",
  "hsl(280 65% 60%)",
  "hsl(15 80% 55%)",
  "hsl(220 15% 55%)",
];

function isHouseholdResult(result: HouseholdResult | BusinessResult | IndustryResult): result is HouseholdResult {
  return "annualTonnes" in result && "perCapita" in (result as HouseholdResult).annualTonnes;
}

function isBusinessResult(result: HouseholdResult | BusinessResult | IndustryResult): result is BusinessResult {
  return "dashboard" in result && "score" in (result as BusinessResult).dashboard;
}

function isIndustryResult(result: HouseholdResult | BusinessResult | IndustryResult): result is IndustryResult {
  return "facilityEmissions" in result;
}

export default function EmissionsResult({ result, type, onBack, onStartOver }: EmissionsResultProps) {
  const chartData = result.chartData.map((item, index) => ({
    ...item,
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }));

  // Get main metrics based on type
  let totalTonnes = 0;
  let perCapitaTonnes = 0;
  let comparisonValue: string | number = 0;
  let comparisonLabel = "";

  if (isHouseholdResult(result)) {
    totalTonnes = result.annualTonnes.total;
    perCapitaTonnes = result.annualTonnes.perCapita;
    comparisonValue = result.context.indiaMultiplier;
    comparisonLabel = `${comparisonValue}x India average`;
  } else if (isBusinessResult(result)) {
    totalTonnes = result.tonnes.total;
    perCapitaTonnes = result.dashboard.perEmployeeTonnes;
    comparisonValue = result.dashboard.score;
    comparisonLabel = result.dashboard.ratingStr;
  } else if (isIndustryResult(result)) {
    totalTonnes = result.tonnes.total;
    perCapitaTonnes = result.dashboard.perEmployeeTonnes;
    comparisonLabel = `${result.benchmark.status} vs industry`;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="w-full max-w-[860px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 h-8 text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-3.5 w-3.5" />
              Back to Form
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 h-8 text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground">
                <Share2 className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2 h-8 text-xs font-medium uppercase tracking-widest text-muted-foreground hover:text-foreground">
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="w-full max-w-[860px] mx-auto px-4 sm:px-6 pt-8 md:pt-12">
        {/* Title Block */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-1 tracking-tight">Emissions Dashboard</h1>
          <p className="text-sm md:text-base text-muted-foreground">Annual greenhouse gas emissions breakdown and insights.</p>
        </div>

        {/* Hero KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-to-br from-primary/10 to-transparent border-primary/20 shadow-sm relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -mr-10 -mt-10 transition-transform group-hover:scale-110" />
            <CardContent className="p-5 flex flex-col justify-center h-full relative z-10">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-1">
                {totalTonnes.toFixed(1)}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-wider">Total tCO₂e/year</div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-5 flex flex-col justify-center h-full">
              <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">
                {perCapitaTonnes.toFixed(2)}
              </div>
              <div className="text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-wider">
                {type === "household" ? "Per person" : "Per employee"} t/year
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border shadow-sm">
            <CardContent className="p-5 flex flex-col justify-center h-full">
              {isBusinessResult(result) ? (
                <>
                  <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">{comparisonValue}</div>
                  <div className="text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-wider">Efficiency Score</div>
                  <div className="text-xs text-primary mt-1 font-medium">{comparisonLabel}</div>
                </>
              ) : (
                <>
                  <div className="text-xl md:text-2xl font-bold text-foreground mb-1 leading-tight">{comparisonLabel}</div>
                  <div className="text-xs md:text-sm text-muted-foreground font-medium uppercase tracking-wider mt-1">Benchmark Status</div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Mobile Warning Banner */}
        <div className="block sm:hidden mb-8">
          <div className="p-5 rounded-lg bg-primary/5 border border-primary/20 flex flex-col items-center text-center">
            <Monitor className="h-6 w-6 text-primary mb-3" />
            <h3 className="text-sm font-bold text-foreground mb-1">View on Desktop</h3>
            <p className="text-xs text-muted-foreground">
              Some charts are hidden for mobile optimization. Open on desktop for the full interactive breakdown.
            </p>
          </div>
        </div>

        {/* Detailed Analytics Tracker - Hidden on Mobile */}
        <div className="hidden sm:block space-y-6">

          {/* Core Analytics Grid: Charts & Equivalents */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Pie Chart */}
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-2 pt-5 px-5">
                <CardTitle className="text-lg font-bold tracking-tight">Emissions Breakdown</CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Data distribution by category</CardDescription>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="h-[240px] w-full flex justify-center items-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={90}
                        innerRadius={60}
                        paddingAngle={2}
                        label={({ name, percent }) => percent > 0.05 ? `${name} ${(percent * 100).toFixed(0)}%` : ''}
                        labelLine={false}
                        style={{ fontSize: '11px', fill: 'var(--muted-foreground)' }}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => [`${(value / 1000).toFixed(2)} tonnes`, "Volume"]}
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "6px",
                          fontSize: "12px",
                          padding: "8px 12px"
                        }}
                        itemStyle={{ color: "hsl(var(--foreground))" }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* GHG Protocol Scopes OR How You Compare */}
            {(isBusinessResult(result) || isIndustryResult(result)) ? (
              <Card className="bg-card border-border shadow-sm h-full">
                <CardHeader className="pb-4 pt-5 px-5">
                  <CardTitle className="text-lg font-bold tracking-tight">Protocol Scopes</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Scope 1, 2, and 3 classifications</CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  {(() => {
                    const total = result.tonnes.total || 1;
                    const pctScope1 = isBusinessResult(result)
                      ? result.percentages.scope1
                      : (result.tonnes.scope1 / total) * 100;
                    const pctScope2 = isBusinessResult(result)
                      ? result.percentages.scope2
                      : (result.tonnes.scope2 / total) * 100;
                    const pctScope3 = isBusinessResult(result)
                      ? result.percentages.scope3
                      : (result.tonnes.scope3 / total) * 100;

                    return (
                      <div className="space-y-6 pt-2">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm font-medium">
                            <span className="text-foreground">Scope 1 (Direct)</span>
                            <span className="text-muted-foreground text-xs">
                              {result.tonnes.scope1.toFixed(2)}t ({pctScope1.toFixed(1)}%)
                            </span>
                          </div>
                          <Progress value={pctScope1} className="h-2 rounded-full" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm font-medium">
                            <span className="text-foreground">Scope 2 (Electricity)</span>
                            <span className="text-muted-foreground text-xs">
                              {result.tonnes.scope2.toFixed(2)}t ({pctScope2.toFixed(1)}%)
                            </span>
                          </div>
                          <Progress value={pctScope2} className="h-2 rounded-full" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm font-medium">
                            <span className="text-foreground">Scope 3 (Value Chain)</span>
                            <span className="text-muted-foreground text-xs">
                              {result.tonnes.scope3.toFixed(2)}t ({pctScope3.toFixed(1)}%)
                            </span>
                          </div>
                          <Progress value={pctScope3} className="h-2 rounded-full" />
                        </div>
                      </div>
                    );
                  })()}
                </CardContent>
              </Card>
            ) : isHouseholdResult(result) ? (
              <Card className="bg-card border-border shadow-sm h-full">
                <CardHeader className="pb-4 pt-5 px-5">
                  <CardTitle className="text-lg font-bold tracking-tight">Benchmark Scaling</CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">Your footprint against global averages</CardDescription>
                </CardHeader>
                <CardContent className="px-5 pb-5">
                  <div className="relative pt-10 pb-6">
                    <div className="flex justify-between text-xs text-muted-foreground mb-3 font-medium px-1">
                      <span>0t</span>
                      <span className="hidden lg:block">India ({result.context.indiaAverage}t)</span>
                      <span className="hidden lg:block">Global ({result.context.globalAverage}t)</span>
                      <span>10t+</span>
                    </div>
                    <div className="h-4 bg-gradient-to-r from-emerald-500/80 via-amber-500/80 to-red-500/80 rounded-full relative">
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-foreground rounded-full border-[3px] border-background shadow-md transition-all duration-700"
                        style={{
                          left: `${Math.min((result.annualTonnes.perCapita / 10) * 100, 100)}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                      <div
                        className="absolute bottom-full mb-3 text-xs text-background font-bold bg-foreground px-2.5 py-1 rounded truncate shadow-sm transition-all duration-700"
                        style={{
                          left: `${Math.min((result.annualTonnes.perCapita / 10) * 100, 100)}%`,
                          transform: "translateX(-50%)",
                        }}
                      >
                        You: {result.annualTonnes.perCapita.toFixed(2)}t
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-solid border-t-foreground border-t-4 border-x-transparent border-x-4 border-b-0"></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* Context / Equivalents Strip */}
          <Card className="bg-card border-border shadow-sm overflow-hidden">
            <CardHeader className="bg-muted/30 pb-3 pt-4 px-5 border-b border-border/50">
              <CardTitle className="flex items-center gap-2 text-sm font-bold tracking-widest uppercase text-muted-foreground">
                <TrendingDown className="h-4 w-4" />
                Real-World Equivalents
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border/50">
                {isHouseholdResult(result) && (
                  <>
                    <div className="flex items-center gap-4 p-5 hover:bg-muted/20 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Car className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-foreground">
                          {result.context.drivingKm.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">km of driving</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 hover:bg-muted/20 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                        <Plane className="h-5 w-5 text-amber-400" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-foreground">
                          {result.context.delhiMumbaiFlights}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">Delhi-Mumbai flights</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 hover:bg-muted/20 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <TreeDeciduous className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-foreground">{result.context.trees}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">trees to offset</div>
                      </div>
                    </div>
                  </>
                )}
                {isBusinessResult(result) && (
                  <>
                    <div className="flex items-center gap-4 p-5 hover:bg-muted/20 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Car className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-foreground">
                          {result.dashboard.equivalents.drivingKm.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">km of driving</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 hover:bg-muted/20 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                        <Home className="h-5 w-5 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-foreground">
                          {result.dashboard.equivalents.homesPowered}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">homes powered/year</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 hover:bg-muted/20 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <TreeDeciduous className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-foreground">
                          {result.dashboard.equivalents.trees}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">trees to offset</div>
                      </div>
                    </div>
                  </>
                )}
                {isIndustryResult(result) && (
                  <>
                    <div className="flex items-center gap-4 p-5 hover:bg-muted/20 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Car className="h-5 w-5 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-foreground">
                          {result.equivalents.drivingKm.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">km of driving</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 hover:bg-muted/20 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                        <Plane className="h-5 w-5 text-amber-400" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-foreground">
                          {result.equivalents.flightsEquivalent}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">international flights</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 p-5 hover:bg-muted/20 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <TreeDeciduous className="h-5 w-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-xl font-bold text-foreground">{result.equivalents.trees}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">trees to offset</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Reduction Tips */}
          {isBusinessResult(result) && result.dashboard.opportunities.length > 0 && (
            <Card className="bg-card border-border shadow-sm">
              <CardHeader className="pb-3 pt-5 px-5">
                <CardTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
                  <Lightbulb className="h-4 w-4 text-amber-400" />
                  Reduction Opportunities
                </CardTitle>
                <CardDescription className="text-xs text-muted-foreground">Actionable insights to lower scope footprint</CardDescription>
              </CardHeader>
              <CardContent className="px-5 pb-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.dashboard.opportunities.map((opp, index) => (
                    <div key={index} className="flex flex-col gap-2 p-4 rounded-lg bg-secondary/30 border border-border/50">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <span className="text-[10px] font-bold text-primary">{index + 1}</span>
                        </div>
                        <span className="text-xs text-primary font-bold uppercase tracking-wider">
                          Save {opp.potentialReductionTonnes} tCO₂e/yr
                        </span>
                      </div>
                      <p className="text-sm text-foreground ml-7">{opp.text}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

        </div> {/* End of hidden sm:block */}

        {/* Footer Actions */}
        <div className="flex flex-row items-center justify-center gap-3 mt-10">
          <Button variant="outline" size="sm" onClick={onStartOver} className="gap-2 h-10 px-5 text-sm font-medium">
            <RotateCcw className="h-4 w-4" />
            Start Over
          </Button>
          <Button onClick={onBack} size="sm" className="gap-2 h-10 px-5 text-sm font-medium">
            <ArrowLeft className="h-4 w-4" />
            Edit Inputs
          </Button>
        </div>

      </div>
    </div>
  );
}
