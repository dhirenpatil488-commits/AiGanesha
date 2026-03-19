"use client";

import { useState } from "react";
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Home className="h-4 w-4 text-emerald-400" />
              </div>
              <span className="font-medium text-foreground">Household Calculator</span>
            </div>
            <div className="text-sm text-muted-foreground">
              Step {currentStep} of {steps.length}
            </div>
          </div>
        </div>
      </header>

      {/* Progress */}
      <div className="border-b border-border/50 bg-card/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-base text-muted-foreground">{steps[currentStep - 1].title}</span>
            <span className="text-base font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between mt-3">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  step.id === currentStep
                    ? "text-primary"
                    : step.id < currentStep
                    ? "text-primary/60"
                    : "text-muted-foreground/50"
                }`}
              >
                <step.icon className="h-4 w-4 md:h-5 md:w-5" />
                <span className="text-xs hidden md:block">{step.title}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Step 1: Household Info */}
          {currentStep === 1 && (
            <Card className="bg-card border-border shadow-lg">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Home className="h-8 w-8 text-primary" />
                  Household Information
                </CardTitle>
                <CardDescription className="text-lg mt-2">Tell us about your household</CardDescription>
              </CardHeader>
              <CardContent className="space-y-10">
                <div className="space-y-4">
                  <Label className="text-lg">Number of people in household</Label>
                  <div className="flex items-center gap-4">
                    <Slider
                      value={[data.householdSize]}
                      onValueChange={([v]) => updateData("householdSize", v)}
                      min={1}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-2xl sm:text-4xl font-bold text-primary w-8 sm:w-12 text-center">{data.householdSize}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-lg">Type of home</Label>
                  <RadioGroup
                    value={data.homeType}
                    onValueChange={(v) => updateData("homeType", v as HouseholdData["homeType"])}
                    className="grid grid-cols-3 gap-3"
                  >
                    {[
                      { value: "apartment", label: "Apartment" },
                      { value: "independent", label: "Independent House" },
                      { value: "shared", label: "Shared Housing" },
                    ].map((option) => (
                      <div key={option.value}>
                        <RadioGroupItem value={option.value} id={option.value} className="peer sr-only" />
                        <Label
                          htmlFor={option.value}
                          className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-secondary/50 p-4 sm:p-6 hover:bg-secondary hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all min-h-[100px] sm:min-h-[120px]"
                        >
                          <span className="text-base sm:text-lg font-medium text-center">{option.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Energy */}
          {currentStep === 2 && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Zap className="h-8 w-8 text-primary" />
                  Energy Consumption
                </CardTitle>
                <CardDescription className="text-lg mt-2">Your electricity and cooking fuel usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-10">
                <div className="space-y-4">
                  <Label htmlFor="electricity" className="text-lg">Monthly electricity bill (INR)</Label>
                  <Input
                    id="electricity"
                    type="number"
                    value={data.electricityBillPerMonth}
                    onChange={(e) => updateData("electricityBillPerMonth", Number(e.target.value))}
                    placeholder="e.g., 2000"
                    className="text-lg py-6"
                  />
                </div>

                <div className="flex items-center justify-between p-6 rounded-xl bg-secondary/50">
                  <div className="space-y-2">
                    <Label className="text-lg">Do you have solar panels?</Label>
                    <p className="text-base text-muted-foreground">Solar reduces your grid emissions</p>
                  </div>
                  <Switch checked={data.hasSolar} onCheckedChange={(v) => updateData("hasSolar", v)} />
                </div>

                {data.hasSolar && (
                  <div className="space-y-4">
                    <Label className="text-lg">What percentage of electricity comes from solar?</Label>
                    <Select value={data.solarPercentage} onValueChange={(v) => updateData("solarPercentage", v as HouseholdData["solarPercentage"])}>
                      <SelectTrigger className="text-lg py-6">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-25" className="text-lg py-3">0-25%</SelectItem>
                        <SelectItem value="25-50" className="text-lg py-3">25-50%</SelectItem>
                        <SelectItem value="50-75" className="text-lg py-3">50-75%</SelectItem>
                        <SelectItem value="75-100" className="text-lg py-3">75-100%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-4">
                  <Label className="text-lg">Primary cooking fuel</Label>
                  <RadioGroup
                    value={data.cookingFuel}
                    onValueChange={(v) => updateData("cookingFuel", v as HouseholdData["cookingFuel"])}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3"
                  >
                    {[
                      { value: "lpg", label: "LPG" },
                      { value: "png", label: "PNG" },
                      { value: "electric", label: "Electric" },
                      { value: "mixed", label: "Mixed" },
                    ].map((option) => (
                      <div key={option.value}>
                        <RadioGroupItem value={option.value} id={`fuel-${option.value}`} className="peer sr-only" />
                        <Label
                          htmlFor={`fuel-${option.value}`}
                          className="flex items-center justify-center rounded-xl border-2 border-muted bg-secondary/50 p-4 sm:p-6 hover:bg-secondary hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all min-h-[80px] sm:min-h-[100px]"
                        >
                          <span className="text-base sm:text-lg font-medium">{option.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {(data.cookingFuel === "lpg" || data.cookingFuel === "mixed") && (
                  <div className="space-y-4">
                    <Label htmlFor="lpg" className="text-lg">LPG cylinders used per year</Label>
                    <Input
                      id="lpg"
                      type="number"
                      value={data.lpgCylindersPerYear}
                      onChange={(e) => updateData("lpgCylindersPerYear", Number(e.target.value))}
                      placeholder="e.g., 8"
                      className="text-lg py-6"
                    />
                  </div>
                )}

                {(data.cookingFuel === "png" || data.cookingFuel === "mixed") && (
                  <div className="space-y-4">
                    <Label htmlFor="png" className="text-lg">Monthly PNG bill (INR)</Label>
                    <Input
                      id="png"
                      type="number"
                      value={data.pngBillPerMonth}
                      onChange={(e) => updateData("pngBillPerMonth", Number(e.target.value))}
                      placeholder="e.g., 500"
                      className="text-lg py-6"
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
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Car className="h-8 w-8 text-primary" />
                  Personal Transportation
                </CardTitle>
                <CardDescription className="text-lg mt-2">Your vehicles and daily commute</CardDescription>
              </CardHeader>
              <CardContent className="space-y-10">
                <div className="space-y-6">
                  {data.vehicles.map((vehicle, index) => (
                    <div key={index} className="p-4 sm:p-6 rounded-xl bg-secondary/50 space-y-4 sm:space-y-6">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-base sm:text-lg">Vehicle {index + 1}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeVehicle(index)} className="text-destructive hover:text-destructive">
                          Remove
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-sm sm:text-base">Fuel Type</Label>
                          <Select value={vehicle.type} onValueChange={(v) => updateVehicle(index, "type", v)}>
                            <SelectTrigger className="text-sm sm:text-base py-4 sm:py-5">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="petrol" className="text-sm sm:text-base py-2">Petrol Car</SelectItem>
                              <SelectItem value="diesel" className="text-sm sm:text-base py-2">Diesel Car</SelectItem>
                              <SelectItem value="cng" className="text-sm sm:text-base py-2">CNG Car</SelectItem>
                              <SelectItem value="twoWheeler" className="text-sm sm:text-base py-2">Two Wheeler</SelectItem>
                              <SelectItem value="electric" className="text-sm sm:text-base py-2">Electric</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-sm sm:text-base">KM per week</Label>
                          <Input
                            type="number"
                            value={vehicle.kmPerWeek}
                            onChange={(e) => updateVehicle(index, "kmPerWeek", Number(e.target.value))}
                            className="text-sm sm:text-base py-4 sm:py-5"
                          />
                        </div>
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="text-sm sm:text-base">Efficiency (km/l)</Label>
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
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Plane className="h-8 w-8 text-primary" />
                  Air Travel
                </CardTitle>
                <CardDescription className="text-lg mt-2">Number of flights taken per year</CardDescription>
              </CardHeader>
              <CardContent className="space-y-10">
                <div className="space-y-4">
                  <Label className="text-lg">Short flights (under 3 hours)</Label>
                  <div className="flex items-center gap-6">
                    <Slider
                      value={[data.shortFlightsPerYear]}
                      onValueChange={([v]) => updateData("shortFlightsPerYear", v)}
                      min={0}
                      max={20}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-2xl sm:text-3xl font-bold text-primary w-8 sm:w-12 text-center">{data.shortFlightsPerYear}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-lg">Medium flights (3-6 hours)</Label>
                  <div className="flex items-center gap-6">
                    <Slider
                      value={[data.mediumFlightsPerYear]}
                      onValueChange={([v]) => updateData("mediumFlightsPerYear", v)}
                      min={0}
                      max={15}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-2xl sm:text-3xl font-bold text-primary w-8 sm:w-12 text-center">{data.mediumFlightsPerYear}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="text-lg">Long flights (over 6 hours)</Label>
                  <div className="flex items-center gap-6">
                    <Slider
                      value={[data.longFlightsPerYear]}
                      onValueChange={([v]) => updateData("longFlightsPerYear", v)}
                      min={0}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-2xl sm:text-3xl font-bold text-primary w-8 sm:w-12 text-center">{data.longFlightsPerYear}</span>
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
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <Utensils className="h-8 w-8 text-primary" />
                  Food & Diet
                </CardTitle>
                <CardDescription className="text-lg mt-2">Your eating habits and food choices</CardDescription>
              </CardHeader>
              <CardContent className="space-y-10">
                <div className="space-y-4">
                  <Label className="text-lg">Diet type</Label>
                  <RadioGroup
                    value={data.dietType}
                    onValueChange={(v) => updateData("dietType", v as HouseholdData["dietType"])}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4"
                  >
                    {[
                      { value: "vegetarian", label: "Vegetarian" },
                      { value: "eggitarian", label: "Eggitarian" },
                      { value: "mixed", label: "Mixed" },
                      { value: "nonVegetarian", label: "Non-Vegetarian" },
                      { value: "highMeat", label: "High Meat" },
                    ].map((option) => (
                      <div key={option.value}>
                        <RadioGroupItem value={option.value} id={`diet-${option.value}`} className="peer sr-only" />
                        <Label
                          htmlFor={`diet-${option.value}`}
                          className="flex items-center justify-center rounded-xl border-2 border-muted bg-secondary/50 p-4 sm:p-6 hover:bg-secondary hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all min-h-[80px] sm:min-h-[100px]"
                        >
                          <span className="text-base sm:text-lg font-medium text-center">{option.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>Dairy consumption</Label>
                  <RadioGroup
                    value={data.dairyFrequency}
                    onValueChange={(v) => updateData("dairyFrequency", v as HouseholdData["dairyFrequency"])}
                    className="grid grid-cols-3 gap-3"
                  >
                    {[
                      { value: "low", label: "Low" },
                      { value: "moderate", label: "Moderate" },
                      { value: "high", label: "High" },
                    ].map((option) => (
                      <div key={option.value}>
                        <RadioGroupItem value={option.value} id={`dairy-${option.value}`} className="peer sr-only" />
                        <Label
                          htmlFor={`dairy-${option.value}`}
                          className="flex items-center justify-center rounded-lg border-2 border-muted bg-secondary/50 p-3 hover:bg-secondary hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                        >
                          <span className="text-sm font-medium">{option.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                <div className="space-y-3">
                  <Label>How often do you eat out?</Label>
                  <RadioGroup
                    value={data.eatingOut}
                    onValueChange={(v) => updateData("eatingOut", v as HouseholdData["eatingOut"])}
                    className="grid grid-cols-3 gap-3"
                  >
                    {[
                      { value: "rarely", label: "Rarely" },
                      { value: "weekly", label: "Weekly" },
                      { value: "multiple", label: "Multiple/Week" },
                    ].map((option) => (
                      <div key={option.value}>
                        <RadioGroupItem value={option.value} id={`eating-${option.value}`} className="peer sr-only" />
                        <Label
                          htmlFor={`eating-${option.value}`}
                          className="flex items-center justify-center rounded-lg border-2 border-muted bg-secondary/50 p-3 hover:bg-secondary hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                        >
                          <span className="text-sm font-medium">{option.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
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
                <CardTitle className="flex items-center gap-3 text-2xl">
                  <ShoppingBag className="h-8 w-8 text-primary" />
                  Shopping & Purchases
                </CardTitle>
                <CardDescription className="text-lg mt-2">Your consumer spending and major purchases</CardDescription>
              </CardHeader>
              <CardContent className="space-y-10">
                <div className="space-y-4">
                  <Label htmlFor="shopping" className="text-lg">Monthly shopping spend (INR)</Label>
                  <p className="text-base text-muted-foreground">Clothes, electronics, household items, etc.</p>
                  <Input
                    id="shopping"
                    type="number"
                    value={data.shoppingSpendPerMonth}
                    onChange={(e) => updateData("shoppingSpendPerMonth", Number(e.target.value))}
                    placeholder="e.g., 5000"
                    className="text-lg py-6"
                  />
                </div>

                <div className="space-y-6">
                  <Label className="text-lg">Major purchases this year</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-3">
                      <Label htmlFor="phones" className="text-base text-muted-foreground">
                        Smartphones
                      </Label>
                      <Input
                        id="phones"
                        type="number"
                        value={data.smartphonesPerYear}
                        onChange={(e) => updateData("smartphonesPerYear", Number(e.target.value))}
                        min={0}
                        className="text-lg py-5"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="laptops" className="text-base text-muted-foreground">
                        Laptops/Computers
                      </Label>
                      <Input
                        id="laptops"
                        type="number"
                        value={data.laptopsPerYear}
                        onChange={(e) => updateData("laptopsPerYear", Number(e.target.value))}
                        min={0}
                        className="text-lg py-5"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="appliances" className="text-base text-muted-foreground">
                        Large Appliances
                      </Label>
                      <Input
                        id="appliances"
                        type="number"
                        value={data.appliancesPerYear}
                        onChange={(e) => updateData("appliancesPerYear", Number(e.target.value))}
                        min={0}
                        className="text-lg py-5"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="furniture" className="text-base text-muted-foreground">
                        Furniture Items
                      </Label>
                      <Input
                        id="furniture"
                        type="number"
                        value={data.furniturePerYear}
                        onChange={(e) => updateData("furniturePerYear", Number(e.target.value))}
                        min={0}
                        className="text-lg py-5"
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
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Trash2 className="h-5 w-5 text-primary" />
                  Waste Generation
                </CardTitle>
                <CardDescription>How much waste your household produces</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Garbage bags per week</Label>
                  <RadioGroup
                    value={data.wasteBags}
                    onValueChange={(v) => updateData("wasteBags", v as HouseholdData["wasteBags"])}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3"
                  >
                    {[
                      { value: "1-2", label: "1-2 bags" },
                      { value: "3-4", label: "3-4 bags" },
                      { value: "5-6", label: "5-6 bags" },
                      { value: "more", label: "7+ bags" },
                    ].map((option) => (
                      <div key={option.value}>
                        <RadioGroupItem value={option.value} id={`waste-${option.value}`} className="peer sr-only" />
                        <Label
                          htmlFor={`waste-${option.value}`}
                          className="flex items-center justify-center rounded-lg border-2 border-muted bg-secondary/50 p-3 hover:bg-secondary hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                        >
                          <span className="text-sm font-medium">{option.label}</span>
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
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
            <Button variant="outline" size="lg" onClick={handlePrev} disabled={currentStep === 1} className="gap-2 text-sm sm:text-lg px-4 sm:px-8 py-4 sm:py-6">
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              Previous
            </Button>
            <Button size="lg" onClick={handleNext} className="gap-2 text-sm sm:text-lg px-4 sm:px-8 py-4 sm:py-6">
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
