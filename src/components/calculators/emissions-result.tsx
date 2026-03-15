"use client";

import { ArrowLeft, TreeDeciduous, Car, Plane, Home, TrendingDown, Lightbulb, RotateCcw, Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from "recharts";
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
  let comparisonValue = 0;
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Form
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Share2 className="h-4 w-4" />
                <span className="hidden sm:inline">Share</span>
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 md:px-8 py-12">
        {/* Hero Stats */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">Your Carbon Footprint</h1>
            <p className="text-lg md:text-xl text-muted-foreground">Annual greenhouse gas emissions breakdown</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-primary/30 shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-5xl md:text-7xl font-bold text-primary mb-4">
                  {totalTonnes.toFixed(1)}
                </div>
                <div className="text-base md:text-lg text-muted-foreground font-medium">Total tonnes CO₂e/year</div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-lg">
              <CardContent className="p-8 text-center">
                <div className="text-5xl md:text-7xl font-bold text-foreground mb-4">
                  {perCapitaTonnes.toFixed(2)}
                </div>
                <div className="text-base md:text-lg text-muted-foreground font-medium">
                  {type === "household" ? "Per person" : "Per employee"} tonnes/year
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border shadow-lg">
              <CardContent className="p-8 text-center flex flex-col justify-center h-full min-h-[160px]">
                {isBusinessResult(result) ? (
                  <>
                    <div className="text-5xl md:text-7xl font-bold text-foreground mb-4">{comparisonValue}</div>
                    <div className="text-base md:text-lg text-muted-foreground font-medium">Efficiency Score</div>
                    <div className="text-sm md:text-base text-primary mt-2 font-medium">{comparisonLabel}</div>
                  </>
                ) : (
                  <>
                    <div className="text-4xl md:text-5xl font-bold text-foreground mb-4">{comparisonLabel}</div>
                    <div className="text-base md:text-lg text-muted-foreground font-medium">Comparison</div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Charts Section */}
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 mb-12">
          {/* Pie Chart */}
          <Card className="bg-card border-border shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl">Emissions Breakdown</CardTitle>
              <CardDescription className="text-base">Distribution by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={60}
                      paddingAngle={2}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => [`${(value / 1000).toFixed(2)} tonnes`, "Emissions"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Bar Chart */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Category Comparison</CardTitle>
              <CardDescription>Emissions by source (kg CO₂e)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 80 }}>
                    <XAxis type="number" tickFormatter={(v) => `${(v / 1000).toFixed(1)}t`} />
                    <YAxis type="category" dataKey="name" width={70} />
                    <Tooltip
                      formatter={(value: number) => [`${(value / 1000).toFixed(2)} tonnes`, "Emissions"]}
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Equivalents */}
        <div className="max-w-6xl mx-auto mb-12">
          <Card className="bg-card border-border shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-3 text-2xl">
                <TrendingDown className="h-6 w-6 text-primary" />
                What This Means
              </CardTitle>
              <CardDescription className="text-base">Your emissions in everyday terms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {isHouseholdResult(result) && (
                  <>
                    <div className="flex items-center gap-6 p-6 rounded-xl bg-secondary/50">
                      <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Car className="h-8 w-8 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-3xl md:text-4xl font-bold text-foreground">
                          {result.context.drivingKm.toLocaleString()}
                        </div>
                        <div className="text-base text-muted-foreground mt-1">km of driving</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 p-6 rounded-xl bg-secondary/50">
                      <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                        <Plane className="h-8 w-8 text-amber-400" />
                      </div>
                      <div>
                        <div className="text-3xl md:text-4xl font-bold text-foreground">
                          {result.context.delhiMumbaiFlights}
                        </div>
                        <div className="text-base text-muted-foreground mt-1">Delhi-Mumbai flights</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 p-6 rounded-xl bg-secondary/50">
                      <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <TreeDeciduous className="h-8 w-8 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-3xl md:text-4xl font-bold text-foreground">{result.context.trees}</div>
                        <div className="text-base text-muted-foreground mt-1">trees to offset</div>
                      </div>
                    </div>
                  </>
                )}
                {isBusinessResult(result) && (
                  <>
                    <div className="flex items-center gap-6 p-6 rounded-xl bg-secondary/50">
                      <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Car className="h-8 w-8 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-3xl md:text-4xl font-bold text-foreground">
                          {result.dashboard.equivalents.drivingKm.toLocaleString()}
                        </div>
                        <div className="text-base text-muted-foreground mt-1">km of driving</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 p-6 rounded-xl bg-secondary/50">
                      <div className="h-16 w-16 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0">
                        <Home className="h-8 w-8 text-purple-400" />
                      </div>
                      <div>
                        <div className="text-3xl md:text-4xl font-bold text-foreground">
                          {result.dashboard.equivalents.homesPowered}
                        </div>
                        <div className="text-base text-muted-foreground mt-1">homes powered/year</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 p-6 rounded-xl bg-secondary/50">
                      <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <TreeDeciduous className="h-8 w-8 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-3xl md:text-4xl font-bold text-foreground">
                          {result.dashboard.equivalents.trees}
                        </div>
                        <div className="text-base text-muted-foreground mt-1">trees to offset</div>
                      </div>
                    </div>
                  </>
                )}
                {isIndustryResult(result) && (
                  <>
                    <div className="flex items-center gap-6 p-6 rounded-xl bg-secondary/50">
                      <div className="h-16 w-16 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Car className="h-8 w-8 text-blue-400" />
                      </div>
                      <div>
                        <div className="text-3xl md:text-4xl font-bold text-foreground">
                          {result.equivalents.drivingKm.toLocaleString()}
                        </div>
                        <div className="text-base text-muted-foreground mt-1">km of driving</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 p-6 rounded-xl bg-secondary/50">
                      <div className="h-16 w-16 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                        <Plane className="h-8 w-8 text-amber-400" />
                      </div>
                      <div>
                        <div className="text-3xl md:text-4xl font-bold text-foreground">
                          {result.equivalents.flightsEquivalent}
                        </div>
                        <div className="text-base text-muted-foreground mt-1">international flights</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6 p-6 rounded-xl bg-secondary/50">
                      <div className="h-16 w-16 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                        <TreeDeciduous className="h-8 w-8 text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-3xl md:text-4xl font-bold text-foreground">{result.equivalents.trees}</div>
                        <div className="text-base text-muted-foreground mt-1">trees to offset</div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reduction Tips */}
        {isBusinessResult(result) && result.dashboard.opportunities.length > 0 && (
          <div className="max-w-6xl mx-auto mb-12">
            <Card className="bg-card border-border shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Lightbulb className="h-6 w-6 text-amber-400" />
                  Reduction Opportunities
                </CardTitle>
                <CardDescription className="text-base">Top actions to reduce your emissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {result.dashboard.opportunities.map((opp, index) => (
                    <div key={index} className="flex items-start gap-6 p-6 rounded-xl bg-secondary/50">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-bold text-primary">{index + 1}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground text-lg">{opp.text}</p>
                        <p className="text-base text-primary mt-2 font-medium">
                          Potential savings: {opp.potentialReductionTonnes} tonnes CO₂e/year
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Scope Breakdown for Business/Industry */}
        {(isBusinessResult(result) || isIndustryResult(result)) && (
          <div className="max-w-6xl mx-auto mb-12">
            <Card className="bg-card border-border shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">GHG Protocol Scopes</CardTitle>
                <CardDescription className="text-base">Emissions by scope category</CardDescription>
              </CardHeader>
              <CardContent>
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
                    <div className="space-y-8">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-base font-medium">
                          <span className="text-foreground">Scope 1 (Direct)</span>
                          <span className="text-muted-foreground">
                            {result.tonnes.scope1.toFixed(2)}t ({pctScope1.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={pctScope1} className="h-3 rounded-full" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-base font-medium">
                          <span className="text-foreground">Scope 2 (Electricity)</span>
                          <span className="text-muted-foreground">
                            {result.tonnes.scope2.toFixed(2)}t ({pctScope2.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={pctScope2} className="h-3 rounded-full" />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-base font-medium">
                          <span className="text-foreground">Scope 3 (Value Chain)</span>
                          <span className="text-muted-foreground">
                            {result.tonnes.scope3.toFixed(2)}t ({pctScope3.toFixed(1)}%)
                          </span>
                        </div>
                        <Progress value={pctScope3} className="h-3 rounded-full" />
                      </div>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Benchmark Comparison for Household */}
        {isHouseholdResult(result) && (
          <div className="max-w-6xl mx-auto mb-12">
            <Card className="bg-card border-border shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl">How You Compare</CardTitle>
                <CardDescription className="text-base">Your footprint vs benchmarks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div className="relative pt-6">
                    <div className="flex justify-between text-sm text-muted-foreground mb-3 font-medium">
                      <span>0</span>
                      <span>India Avg ({result.context.indiaAverage}t)</span>
                      <span>Global Avg ({result.context.globalAverage}t)</span>
                      <span>10t</span>
                    </div>
                    <div className="h-6 bg-gradient-to-r from-emerald-500 via-amber-500 to-red-500 rounded-full relative">
                      <div
                        className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-foreground rounded-full border-4 border-background shadow-lg"
                        style={{
                          left: `${Math.min((result.annualTonnes.perCapita / 10) * 100, 100)}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      />
                      <div
                        className="absolute top-full mt-3 text-sm text-primary font-bold bg-primary/10 px-3 py-1 rounded-full whitespace-nowrap"
                        style={{
                          left: `${Math.min((result.annualTonnes.perCapita / 10) * 100, 100)}%`,
                          transform: "translateX(-50%)",
                        }}
                      >
                        You: {result.annualTonnes.perCapita.toFixed(2)}t
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions */}
        <div className="max-w-6xl mx-auto mt-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button variant="outline" size="lg" onClick={onStartOver} className="gap-2 text-lg px-8 py-6">
              <RotateCcw className="h-5 w-5" />
              Start Over
            </Button>
            <Button size="lg" onClick={onBack} className="gap-2 text-lg px-8 py-6">
              <ArrowLeft className="h-5 w-5" />
              Edit Inputs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
