"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Home, Zap, Car, Plane, Utensils, ShoppingBag, Trash2, ChevronLeft, ChevronRight, Leaf, TreeDeciduous, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { calculateHouseholdEmissions, type HouseholdData, type HouseholdResult } from "@/lib/calculations";
import EmissionsResult from "@/components/calculators/emissions-result";

interface HouseholdCalculatorProps {
  onBack: () => void;
}

const steps = [
  { id: 1, title: "Household", icon: Home },
  { id: 2, title: "Energy", icon: Zap },
  { id: 3, title: "Transport", icon: Car },
  { id: 4, title: "Flights", icon: Plane },
  { id: 5, title: "Food", icon: Utensils },
  { id: 6, title: "Shopping", icon: ShoppingBag },
  { id: 7, title: "Waste", icon: Trash2 },
];

const initialData: HouseholdData = {
  householdSize: 4,
  homeType: "apartment",
  electricityBillPerMonth: 2000,
  hasSolar: false,
  solarPercentage: "0-25",
  cookingFuel: "lpg",
  lpgCylindersPerYear: 8,
  pngBillPerMonth: 0,
  vehicles: [],
  shortFlightsPerYear: 0,
  mediumFlightsPerYear: 0,
  longFlightsPerYear: 0,
  dietType: "mixed",
  dairyFrequency: "moderate",
  eatingOut: "weekly",
  shoppingSpendPerMonth: 5000,
  smartphonesPerYear: 0,
  laptopsPerYear: 0,
  appliancesPerYear: 0,
  furniturePerYear: 0,
  wasteBags: "3-4",
  composts: false,
};

export default function HouseholdCalculator({ onBack }: HouseholdCalculatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<HouseholdData>(initialData);
  const [result, setResult] = useState<HouseholdResult | null>(null);

  // Scroll to top when changing steps
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  const updateData = <K extends keyof HouseholdData>(key: K, value: HouseholdData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      const emissions = calculateHouseholdEmissions(data);
      setResult(emissions);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const addVehicle = () => {
    updateData("vehicles", [...data.vehicles, { type: "petrol", kmPerWeek: 100, efficiency: 15 }]);
  };

  const updateVehicle = (index: number, field: string, value: string | number) => {
    const newVehicles = [...data.vehicles];
    newVehicles[index] = { ...newVehicles[index], [field]: value };
    updateData("vehicles", newVehicles);
  };

  const removeVehicle = (index: number) => {
    updateData("vehicles", data.vehicles.filter((_, i) => i !== index));
  };

  if (result) {
    return (
      <EmissionsResult
        result={result}
        type="household"
        onBack={() => setResult(null)}
        onStartOver={() => {
          setResult(null);
          setCurrentStep(1);
          setData(initialData);
        }}
      />
    );
  }

  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="w-full flex flex-col relative z-10 font-mono">
      {/* Sticky Top Wrapper */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-md shadow-sm border-b border-border/50">
        <div className="container mx-auto px-4 py-3">
          {/* Top row: Back button, Title, % */}
          <div className="flex items-center justify-between mb-3">
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-2 h-8 px-2 -ml-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Back</span>
            </Button>
            
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-emerald-500/10 flex items-center justify-center">
                <Home className="h-3 w-3 text-emerald-400" />
              </div>
              <span className="text-sm font-medium text-foreground hidden sm:block">Household</span>
              <span className="text-sm font-medium text-muted-foreground mx-2 hidden sm:block">/</span>
              <span className="text-sm font-medium text-foreground">{steps[currentStep - 1].title}</span>
            </div>

            <div className="text-sm font-medium text-primary">
              {Math.round(progress)}%
            </div>
          </div>

          <Progress value={progress} className="h-2 mb-2" />
          
          {/* Steps Flowchart - compressed */}
          <div className="flex justify-between overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible hide-scrollbar pt-1">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex flex-col items-center gap-1 transition-colors min-w-[50px] ${step.id === currentStep
                    ? "text-primary"
                    : step.id < currentStep
                      ? "text-primary/60"
                      : "text-muted-foreground/40"
                  }`}
              >
                <step.icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="text-[10px] sm:text-xs hidden md:block whitespace-nowrap">{step.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-[680px] w-full px-4 sm:px-0 mx-auto">
          {/* Step 1: Household Info */}
          {currentStep === 1 && (
            <Card className="bg-card border-border shadow-lg">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 text-3xl sm:text-4xl tracking-tight leading-tight font-bold font-mono">
                  <Home className="h-8 w-8 text-primary" />
                  Household Information
                </CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed mt-2 text-muted-foreground">Tell us about your household</CardDescription>
              </CardHeader>
              <CardContent className="space-y-10">
                <div className="space-y-4">
                  <Label className="text-sm sm:text-base font-medium">Number of people in household</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[data.householdSize]}
                      onValueChange={([v]) => updateData("householdSize", v)}
                      min={1}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-2xl sm:text-4xl font-bold font-mono text-primary w-8 sm:w-12 text-center">{data.householdSize}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm sm:text-base font-medium">Type of home</Label>
                  <Select value={data.homeType} onValueChange={(v) => updateData("homeType", v as HouseholdData["homeType"])}>
                    <SelectTrigger className="font-mono text-sm sm:text-base py-4 sm:py-6">
                      <SelectValue placeholder="Select home type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment" className="font-mono text-sm sm:text-base py-3 sm:py-4">Apartment</SelectItem>
                      <SelectItem value="independent" className="font-mono text-sm sm:text-base py-3 sm:py-4">Independent House</SelectItem>
                      <SelectItem value="shared" className="font-mono text-sm sm:text-base py-3 sm:py-4">Shared Housing</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Energy */}
          {currentStep === 2 && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 text-3xl sm:text-4xl tracking-tight leading-tight font-bold font-mono">
                  <Zap className="h-8 w-8 text-primary" />
                  Energy Consumption
                </CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed mt-2 text-muted-foreground">Your electricity and cooking fuel usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-10">
                <div className="space-y-4">
                  <Label htmlFor="electricity" className="text-sm sm:text-base font-medium">Monthly electricity bill (INR)</Label>
                  <Input
                    id="electricity"
                    type="number"
                    value={data.electricityBillPerMonth}
                    onChange={(e) => updateData("electricityBillPerMonth", Number(e.target.value))}
                    placeholder="e.g., 2000"
                    className="text-sm sm:text-base py-4 sm:py-6"
                  />
                </div>

                <div className="flex items-center justify-between p-6 rounded-xl bg-secondary/50">
                  <div className="space-y-2">
                    <Label className="text-sm sm:text-base font-medium">Do you have solar panels?</Label>
                    <p className="text-xs sm:text-sm text-muted-foreground">Solar reduces your grid emissions</p>
                  </div>
                  <Switch checked={data.hasSolar} onCheckedChange={(v) => updateData("hasSolar", v)} />
                </div>

                {data.hasSolar && (
                  <div className="space-y-4">
                    <Label className="text-sm sm:text-base font-medium">What percentage of electricity comes from solar?</Label>
                    <Select value={data.solarPercentage} onValueChange={(v) => updateData("solarPercentage", v as HouseholdData["solarPercentage"])}>
                      <SelectTrigger className="font-mono text-sm sm:text-base py-4 sm:py-6">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-25" className="font-mono text-sm sm:text-base py-3 sm:py-4">0-25%</SelectItem>
                        <SelectItem value="25-50" className="font-mono text-sm sm:text-base py-3 sm:py-4">25-50%</SelectItem>
                        <SelectItem value="50-75" className="font-mono text-sm sm:text-base py-3 sm:py-4">50-75%</SelectItem>
                        <SelectItem value="75-100" className="font-mono text-sm sm:text-base py-3 sm:py-4">75-100%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-4">
                  <Label className="text-sm sm:text-base font-medium">Primary cooking fuel</Label>
                  <Select value={data.cookingFuel} onValueChange={(v) => updateData("cookingFuel", v as HouseholdData["cookingFuel"])}>
                    <SelectTrigger className="font-mono text-sm sm:text-base py-4 sm:py-6">
                      <SelectValue placeholder="Select cooking fuel" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="lpg" className="font-mono text-sm sm:text-base py-3 sm:py-4">LPG</SelectItem>
                      <SelectItem value="png" className="font-mono text-sm sm:text-base py-3 sm:py-4">PNG</SelectItem>
                      <SelectItem value="electric" className="font-mono text-sm sm:text-base py-3 sm:py-4">Electric</SelectItem>
                      <SelectItem value="mixed" className="font-mono text-sm sm:text-base py-3 sm:py-4">Mixed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(data.cookingFuel === "lpg" || data.cookingFuel === "mixed") && (
                  <div className="space-y-4">
                    <Label htmlFor="lpg" className="text-sm sm:text-base font-medium">LPG cylinders used per year</Label>
                    <Input
                      id="lpg"
                      type="number"
                      value={data.lpgCylindersPerYear}
                      onChange={(e) => updateData("lpgCylindersPerYear", Number(e.target.value))}
                      placeholder="e.g., 8"
                      className="text-sm sm:text-base py-4 sm:py-6"
                    />
                  </div>
                )}

                {(data.cookingFuel === "png" || data.cookingFuel === "mixed") && (
                  <div className="space-y-4">
                    <Label htmlFor="png" className="text-sm sm:text-base font-medium">Monthly PNG bill (INR)</Label>
                    <Input
                      id="png"
                      type="number"
                      value={data.pngBillPerMonth}
                      onChange={(e) => updateData("pngBillPerMonth", Number(e.target.value))}
                      placeholder="e.g., 500"
                      className="text-sm sm:text-base py-4 sm:py-6"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Transport */}
          {currentStep === 3 && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 text-3xl sm:text-4xl tracking-tight leading-tight font-bold font-mono">
                  <Car className="h-8 w-8 text-primary" />
                  Personal Transportation
                </CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed mt-2 text-muted-foreground">Your vehicles and daily commute</CardDescription>
              </CardHeader>
              <CardContent className="space-y-10">
                <div className="space-y-6">
                  {data.vehicles.map((vehicle, index) => (
                    <div key={index} className="p-4 sm:p-6 rounded-xl bg-secondary/50 space-y-4 sm:space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-sm sm:text-base">Vehicle {index + 1}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeVehicle(index)} className="text-destructive hover:text-destructive">
                          Remove
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-sm sm:text-base font-medium">Fuel Type</Label>
                          <Select value={vehicle.type} onValueChange={(v) => updateVehicle(index, "type", v)}>
                            <SelectTrigger className="font-mono text-sm sm:text-base py-4 sm:py-5">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="petrol" className="font-mono text-sm sm:text-base py-2">Petrol Car</SelectItem>
                              <SelectItem value="diesel" className="font-mono text-sm sm:text-base py-2">Diesel Car</SelectItem>
                              <SelectItem value="cng" className="font-mono text-sm sm:text-base py-2">CNG Car</SelectItem>
                              <SelectItem value="twoWheeler" className="font-mono text-sm sm:text-base py-2">Two Wheeler</SelectItem>
                              <SelectItem value="electric" className="font-mono text-sm sm:text-base py-2">Electric</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-sm sm:text-base font-medium">KM per week</Label>
                          <Input
                            type="number"
                            value={vehicle.kmPerWeek}
                            onChange={(e) => updateVehicle(index, "kmPerWeek", Number(e.target.value))}
                            className="text-sm sm:text-base py-4 sm:py-5"
                          />
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-sm sm:text-base font-medium">Efficiency (km/l)</Label>
                          <Input
                            type="number"
                            value={vehicle.efficiency}
                            onChange={(e) => updateVehicle(index, "efficiency", Number(e.target.value))}
                            className="text-sm sm:text-base py-4 sm:py-5"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" onClick={addVehicle} className="w-full">
                  + Add Vehicle
                </Button>
                {data.vehicles.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No vehicles added. Click above to add your vehicles, or skip if you don{"'"}t own any.
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Flights */}
          {currentStep === 4 && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 text-3xl sm:text-4xl tracking-tight leading-tight font-bold font-mono">
                  <Plane className="h-8 w-8 text-primary" />
                  Air Travel
                </CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed mt-2 text-muted-foreground">Number of flights taken per year</CardDescription>
              </CardHeader>
              <CardContent className="space-y-10">
                <div className="space-y-4">
                  <Label className="text-sm sm:text-base font-medium">Short flights (under 3 hours)</Label>
                  <div className="flex items-center gap-6">
                    <Slider
                      value={[data.shortFlightsPerYear]}
                      onValueChange={([v]) => updateData("shortFlightsPerYear", v)}
                      min={0}
                      max={20}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-2xl sm:text-3xl font-bold font-mono text-primary w-8 sm:w-12 text-center">{data.shortFlightsPerYear}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm sm:text-base font-medium">Medium flights (3-6 hours)</Label>
                  <div className="flex items-center gap-6">
                    <Slider
                      value={[data.mediumFlightsPerYear]}
                      onValueChange={([v]) => updateData("mediumFlightsPerYear", v)}
                      min={0}
                      max={15}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-2xl sm:text-3xl font-bold font-mono text-primary w-8 sm:w-12 text-center">{data.mediumFlightsPerYear}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-sm sm:text-base font-medium">Long flights (over 6 hours)</Label>
                  <div className="flex items-center gap-6">
                    <Slider
                      value={[data.longFlightsPerYear]}
                      onValueChange={([v]) => updateData("longFlightsPerYear", v)}
                      min={0}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-2xl sm:text-3xl font-bold font-mono text-primary w-8 sm:w-12 text-center">{data.longFlightsPerYear}</span>
                  </div>
                </div>

                <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20">
                  <p className="text-sm text-amber-200">
                    <strong>Tip:</strong> A single long-haul flight can account for a significant portion of your annual carbon footprint.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Food */}
          {currentStep === 5 && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 text-3xl sm:text-4xl tracking-tight leading-tight font-bold font-mono">
                  <Utensils className="h-8 w-8 text-primary" />
                  Food & Diet
                </CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed mt-2 text-muted-foreground">Your eating habits and food choices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-10">
                <div className="space-y-4">
                  <Label className="text-sm sm:text-base font-medium">Diet type</Label>
                  <Select value={data.dietType} onValueChange={(v) => updateData("dietType", v as HouseholdData["dietType"])}>
                    <SelectTrigger className="font-mono text-sm sm:text-base py-4 sm:py-6">
                      <SelectValue placeholder="Select diet type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="vegetarian" className="font-mono text-sm sm:text-base py-3 sm:py-4">Vegetarian</SelectItem>
                      <SelectItem value="eggitarian" className="font-mono text-sm sm:text-base py-3 sm:py-4">Eggitarian</SelectItem>
                      <SelectItem value="mixed" className="font-mono text-sm sm:text-base py-3 sm:py-4">Mixed</SelectItem>
                      <SelectItem value="nonVegetarian" className="font-mono text-sm sm:text-base py-3 sm:py-4">Non-Vegetarian</SelectItem>
                      <SelectItem value="highMeat" className="font-mono text-sm sm:text-base py-3 sm:py-4">High Meat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Dairy consumption</Label>
                  <Select value={data.dairyFrequency} onValueChange={(v) => updateData("dairyFrequency", v as HouseholdData["dairyFrequency"])}>
                    <SelectTrigger className="font-mono text-sm sm:text-base py-4 sm:py-6">
                      <SelectValue placeholder="Select dairy consumption" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low" className="font-mono text-sm sm:text-base py-3 sm:py-4">Low</SelectItem>
                      <SelectItem value="moderate" className="font-mono text-sm sm:text-base py-3 sm:py-4">Moderate</SelectItem>
                      <SelectItem value="high" className="font-mono text-sm sm:text-base py-3 sm:py-4">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>How often do you eat out?</Label>
                  <Select value={data.eatingOut} onValueChange={(v) => updateData("eatingOut", v as HouseholdData["eatingOut"])}>
                    <SelectTrigger className="font-mono text-sm sm:text-base py-4 sm:py-6">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="rarely" className="font-mono text-sm sm:text-base py-3 sm:py-4">Rarely</SelectItem>
                      <SelectItem value="weekly" className="font-mono text-sm sm:text-base py-3 sm:py-4">Weekly</SelectItem>
                      <SelectItem value="multiple" className="font-mono text-sm sm:text-base py-3 sm:py-4">Multiple/Week</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                  <div className="space-y-1">
                    <Label>Do you compost food waste?</Label>
                    <p className="text-sm text-muted-foreground">Composting reduces methane emissions</p>
                  </div>
                  <Switch checked={data.composts} onCheckedChange={(v) => updateData("composts", v)} />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 6: Shopping */}
          {currentStep === 6 && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 text-3xl sm:text-4xl tracking-tight leading-tight font-bold font-mono">
                  <ShoppingBag className="h-8 w-8 text-primary" />
                  Shopping & Purchases
                </CardTitle>
                <CardDescription className="text-sm sm:text-base leading-relaxed mt-2 text-muted-foreground">Your consumer spending and major purchases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-10">
                <div className="space-y-4">
                  <Label htmlFor="shopping" className="text-sm sm:text-base font-medium">Monthly shopping spend (INR)</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">Clothes, electronics, household items, etc.</p>
                  <Input
                    id="shopping"
                    type="number"
                    value={data.shoppingSpendPerMonth}
                    onChange={(e) => updateData("shoppingSpendPerMonth", Number(e.target.value))}
                    placeholder="e.g., 5000"
                    className="text-sm sm:text-base py-4 sm:py-6"
                  />
                </div>

                <div className="space-y-6">
                  <Label className="text-sm sm:text-base font-medium">Major purchases this year</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="phones" className="text-xs sm:text-sm text-muted-foreground">
                        Smartphones
                      </Label>
                      <Input
                        id="phones"
                        type="number"
                        value={data.smartphonesPerYear}
                        onChange={(e) => updateData("smartphonesPerYear", Number(e.target.value))}
                        min={0}
                        className="text-sm sm:text-base py-4 sm:py-5"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="laptops" className="text-xs sm:text-sm text-muted-foreground">
                        Laptops/Computers
                      </Label>
                      <Input
                        id="laptops"
                        type="number"
                        value={data.laptopsPerYear}
                        onChange={(e) => updateData("laptopsPerYear", Number(e.target.value))}
                        min={0}
                        className="text-sm sm:text-base py-4 sm:py-5"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="appliances" className="text-xs sm:text-sm text-muted-foreground">
                        Large Appliances
                      </Label>
                      <Input
                        id="appliances"
                        type="number"
                        value={data.appliancesPerYear}
                        onChange={(e) => updateData("appliancesPerYear", Number(e.target.value))}
                        min={0}
                        className="text-sm sm:text-base py-4 sm:py-5"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="furniture" className="text-xs sm:text-sm text-muted-foreground">
                        Furniture Items
                      </Label>
                      <Input
                        id="furniture"
                        type="number"
                        value={data.furniturePerYear}
                        onChange={(e) => updateData("furniturePerYear", Number(e.target.value))}
                        min={0}
                        className="text-sm sm:text-base py-4 sm:py-5"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 7: Waste */}
          {currentStep === 7 && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 text-3xl sm:text-4xl tracking-tight leading-tight font-bold">
                  <Trash2 className="h-8 w-8 text-primary" />
                  Waste Generation
                </CardTitle>
                <CardDescription className="text-base mt-2 text-muted-foreground">How much waste your household produces</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Garbage bags per week</Label>
                  <Select value={data.wasteBags} onValueChange={(v) => updateData("wasteBags", v as HouseholdData["wasteBags"])}>
                    <SelectTrigger className="font-mono text-sm sm:text-base py-4 sm:py-6">
                      <SelectValue placeholder="Select bags per week" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2" className="font-mono text-sm sm:text-base py-3 sm:py-4">1-2 bags</SelectItem>
                      <SelectItem value="3-4" className="font-mono text-sm sm:text-base py-3 sm:py-4">3-4 bags</SelectItem>
                      <SelectItem value="5-6" className="font-mono text-sm sm:text-base py-3 sm:py-4">5-6 bags</SelectItem>
                      <SelectItem value="more" className="font-mono text-sm sm:text-base py-3 sm:py-4">7+ bags</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 space-y-3">
                  <div className="flex items-start gap-3">
                    <Leaf className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Tips to reduce waste emissions</p>
                      <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                        <li>- Segregate wet and dry waste</li>
                        <li>- Compost organic waste at home</li>
                        <li>- Recycle paper, plastic, and metal</li>
                        <li>- Avoid single-use plastics</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 sm:mt-12 mb-10 sm:mb-20">
            <Button variant="outline" size="lg" onClick={handlePrev} disabled={currentStep === 1} className="gap-2 text-xs sm:text-sm px-8 py-6 font-mono uppercase tracking-widest">
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              Previous
            </Button>
            <Button size="lg" onClick={handleNext} className="gap-2 text-xs sm:text-sm px-8 py-6 font-mono uppercase tracking-widest">
              {currentStep === steps.length ? (
                <>
                  Calculate
                  <Gauge className="h-4 w-4 sm:h-5 sm:w-5" />
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
