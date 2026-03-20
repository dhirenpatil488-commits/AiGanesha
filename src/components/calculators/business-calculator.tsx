"use client";

import { useState } from "react";
import { ArrowLeft, Building2, Zap, Truck, Users, ShoppingCart, Trash2, ChevronLeft, ChevronRight, Gauge } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { calculateBusinessEmissions, type BusinessData, type BusinessResult } from "@/lib/calculations";
import EmissionsResult from "@/components/calculators/emissions-result";

interface BusinessCalculatorProps {
  onBack: () => void;
}

const BUSINESS_TYPES = [
  { id: "office", label: "Office / Professional Services" },
  { id: "retail", label: "Retail Shop" },
  { id: "restaurant", label: "Restaurant / Cafe / Food" },
  { id: "workshop", label: "Workshop / Manufacturing" },
  { id: "logistics", label: "Logistics / Delivery" },
  { id: "home", label: "Home-based Business" },
];

const steps = [
  { id: 1, title: "Business Type", icon: Building2 },
  { id: 2, title: "Energy", icon: Zap },
  { id: 3, title: "Operations", icon: Truck },
  { id: 4, title: "Employees", icon: Users },
  { id: 5, title: "Procurement", icon: ShoppingCart },
  { id: 6, title: "Waste", icon: Trash2 },
];

const initialData: BusinessData = {
  businessType: "office",
  electricityBillPerMonth: 5000,
  employees: 10,
  acCount: 2,
  computerCount: 10,
  usesFridges: false,
  retailFridges: 0,
  commercialFridges: 0,
  usesDelivery: false,
  retailDeliveryFuel: 0,
  logisticsFuelLitres: 0,
  logisticsFuelType: "diesel",
  usesGenerator: false,
  dieselGeneratorLitres: 0,
  commercialLpgCylinders: 0,
  homeBusinessLpg: 0,
  homeAddtlElectricity: 0,
  avgCommuteKm: 15,
  flightsKmPerYear: 0,
  trainKmPerYear: 0,
  spendOfficeSupplies: 10000,
  spendResaleGoods: 0,
  spendFoodSupply: 0,
  spendRawMaterials: 0,
  spendPackaging: 0,
  wasteBags: 5,
  compostsWaste: "no",
};

export default function BusinessCalculator({ onBack }: BusinessCalculatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<BusinessData>(initialData);
  const [result, setResult] = useState<BusinessResult | null>(null);

  const updateData = <K extends keyof BusinessData>(key: K, value: BusinessData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      const emissions = calculateBusinessEmissions(data);
      setResult(emissions);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (result) {
    return (
      <EmissionsResult
        result={result}
        type="business"
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
  const t = data.businessType;

  return (
    <div className="w-full flex flex-col relative z-10">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-sky-500/10 flex items-center justify-center">
                <Building2 className="h-4 w-4 text-sky-400" />
              </div>
              <span className="font-medium text-foreground">Business Calculator</span>
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
            <span className="text-[13px] sm:text-[14px] text-muted-foreground">{steps[currentStep - 1].title}</span>
            <span className="text-base font-medium text-primary">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="flex justify-between mt-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:overflow-visible sm:pb-0 hide-scrollbar">
            {steps.map((step) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex flex-col items-center gap-1 transition-colors min-w-[64px] ${step.id === currentStep
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
        <div className="max-w-[680px] w-full px-4 sm:px-0 mx-auto">
          {/* Step 1: Business Type */}
          {currentStep === 1 && (
            <Card className="bg-card border-border shadow-lg">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 text-[32px] sm:text-[40px] leading-[1.2] tracking-[-0.03em] font-bold">
                  <Building2 className="h-8 w-8 text-primary" />
                  Business Type
                </CardTitle>
                <CardDescription className="text-[15px] sm:text-[16px] leading-[1.48] tracking-[-0.02em] mt-2 text-muted-foreground">Select the type that best describes your business</CardDescription>
              </CardHeader>
              <CardContent className="space-y-10">
                <RadioGroup
                  value={data.businessType}
                  onValueChange={(v) => updateData("businessType", v as BusinessData["businessType"])}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  {BUSINESS_TYPES.map((type) => (
                    <div key={type.id}>
                      <RadioGroupItem value={type.id} id={type.id} className="peer sr-only" />
                      <Label
                        htmlFor={type.id}
                        className="flex items-center gap-3 rounded-xl border-2 border-muted bg-secondary/50 p-3 sm:p-4 hover:bg-secondary hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                      >
                        <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground" />
                        <span className="font-medium text-[15px] sm:text-[16px]">{type.label}</span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>

                <div className="space-y-4">
                  <Label className="text-[15px] sm:text-[16px]">Number of employees</Label>
                  <div className="flex items-center gap-6">
                    <Slider
                      value={[data.employees]}
                      onValueChange={([v]) => updateData("employees", v)}
                      min={1}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-2xl sm:text-4xl font-bold text-primary w-12 sm:w-16 text-center">{data.employees}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Energy */}
          {currentStep === 2 && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 text-[32px] sm:text-[40px] leading-[1.2] tracking-[-0.03em] font-bold">
                  <Zap className="h-8 w-8 text-primary" />
                  Energy Consumption
                </CardTitle>
                <CardDescription className="text-[15px] sm:text-[16px] leading-[1.48] tracking-[-0.02em] mt-2 text-muted-foreground">Electricity and fuel usage</CardDescription>
              </CardHeader>
              <CardContent className="space-y-10">
                {t === "home" ? (
                  <div className="space-y-4">
                    <Label htmlFor="homeElec" className="text-[15px] sm:text-[16px]">Additional electricity for business (INR/month)</Label>
                    <Input
                      id="homeElec"
                      type="number"
                      value={data.homeAddtlElectricity}
                      onChange={(e) => updateData("homeAddtlElectricity", Number(e.target.value))}
                      placeholder="e.g., 500"
                      className="text-[15px] sm:text-[16px] py-4 sm:py-6"
                    />
                    <p className="text-[13px] sm:text-[14px] text-muted-foreground">
                      Estimate the portion of your home electricity used for business
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Label htmlFor="electricity" className="text-[15px] sm:text-[16px]">Monthly electricity bill (INR)</Label>
                    <Input
                      id="electricity"
                      type="number"
                      value={data.electricityBillPerMonth}
                      onChange={(e) => updateData("electricityBillPerMonth", Number(e.target.value))}
                      placeholder="e.g., 5000"
                      className="text-[15px] sm:text-[16px] py-4 sm:py-6"
                    />
                  </div>
                )}

                {t === "office" && (
                  <>
                    <div className="space-y-4">
                      <Label className="text-[15px] sm:text-[16px]">Number of air conditioners</Label>
                      <div className="flex items-center gap-6">
                        <Slider
                          value={[data.acCount || 0]}
                          onValueChange={([v]) => updateData("acCount", v)}
                          min={0}
                          max={20}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-2xl sm:text-3xl font-bold text-primary w-8 sm:w-12 text-center">{data.acCount}</span>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[15px] sm:text-[16px]">Number of computers/workstations</Label>
                      <div className="flex items-center gap-6">
                        <Slider
                          value={[data.computerCount || 0]}
                          onValueChange={([v]) => updateData("computerCount", v)}
                          min={0}
                          max={50}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-2xl sm:text-3xl font-bold text-primary w-8 sm:w-12 text-center">{data.computerCount}</span>
                      </div>
                    </div>
                  </>
                )}

                {t === "retail" && (
                  <div className="flex items-center justify-between p-6 rounded-xl bg-secondary/50">
                    <div className="space-y-2">
                      <Label className="text-[15px] sm:text-[16px]">Do you use refrigeration?</Label>
                      <p className="text-[13px] sm:text-[14px] text-muted-foreground">Display fridges, cold storage</p>
                    </div>
                    <Switch checked={data.usesFridges} onCheckedChange={(v) => updateData("usesFridges", v)} />
                  </div>
                )}

                {t === "retail" && data.usesFridges && (
                  <div className="space-y-4">
                    <Label className="text-[15px] sm:text-[16px]">Number of refrigeration units</Label>
                    <Input
                      type="number"
                      value={data.retailFridges}
                      onChange={(e) => updateData("retailFridges", Number(e.target.value))}
                      placeholder="e.g., 3"
                      className="text-[15px] sm:text-[16px] py-4 sm:py-6"
                    />
                  </div>
                )}

                {t === "restaurant" && (
                  <>
                    <div className="space-y-4">
                      <Label className="text-[15px] sm:text-[16px]">Commercial fridges/freezers</Label>
                      <Input
                        type="number"
                        value={data.commercialFridges}
                        onChange={(e) => updateData("commercialFridges", Number(e.target.value))}
                        placeholder="e.g., 4"
                        className="text-[15px] sm:text-[16px] py-4 sm:py-6"
                      />
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[15px] sm:text-[16px]">LPG cylinders used per year</Label>
                      <Input
                        type="number"
                        value={data.commercialLpgCylinders}
                        onChange={(e) => updateData("commercialLpgCylinders", Number(e.target.value))}
                        placeholder="e.g., 24"
                        className="text-[15px] sm:text-[16px] py-4 sm:py-6"
                      />
                    </div>
                  </>
                )}

                {t === "home" && (
                  <div className="space-y-4">
                    <Label className="text-[15px] sm:text-[16px]">LPG cylinders for business per year</Label>
                    <Input
                      type="number"
                      value={data.homeBusinessLpg}
                      onChange={(e) => updateData("homeBusinessLpg", Number(e.target.value))}
                      placeholder="e.g., 2"
                      className="text-[15px] sm:text-[16px] py-4 sm:py-6"
                    />
                  </div>
                )}

                {t === "workshop" && (
                  <div className="flex items-center justify-between p-6 rounded-xl bg-secondary/50">
                    <div className="space-y-2">
                      <Label className="text-[15px] sm:text-[16px]">Do you use a diesel generator?</Label>
                      <p className="text-[13px] sm:text-[14px] text-muted-foreground">For backup power</p>
                    </div>
                    <Switch checked={data.usesGenerator} onCheckedChange={(v) => updateData("usesGenerator", v)} />
                  </div>
                )}

                {t === "workshop" && data.usesGenerator && (
                  <div className="space-y-4">
                    <Label className="text-[15px] sm:text-[16px]">Diesel used per year (litres)</Label>
                    <Input
                      type="number"
                      value={data.dieselGeneratorLitres}
                      onChange={(e) => updateData("dieselGeneratorLitres", Number(e.target.value))}
                      placeholder="e.g., 500"
                      className="text-[15px] sm:text-[16px] py-4 sm:py-6"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 3: Operations */}
          {currentStep === 3 && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 text-[32px] sm:text-[40px] leading-[1.2] tracking-[-0.03em] font-bold">
                  <Truck className="h-8 w-8 text-primary" />
                  Operations & Transport
                </CardTitle>
                <CardDescription className="text-[15px] sm:text-[16px] leading-[1.48] tracking-[-0.02em] mt-2 text-muted-foreground">Delivery, logistics, and business travel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-10">
                {t === "retail" && (
                  <>
                    <div className="flex items-center justify-between p-6 rounded-xl bg-secondary/50">
                      <div className="space-y-2">
                        <Label className="text-[15px] sm:text-[16px]">Do you offer delivery?</Label>
                        <p className="text-[13px] sm:text-[14px] text-muted-foreground">Using your own vehicles</p>
                      </div>
                      <Switch checked={data.usesDelivery} onCheckedChange={(v) => updateData("usesDelivery", v)} />
                    </div>
                    {data.usesDelivery && (
                      <div className="space-y-4">
                        <Label className="text-[15px] sm:text-[16px]">Fuel used for delivery per year (litres)</Label>
                        <Input
                          type="number"
                          value={data.retailDeliveryFuel}
                          onChange={(e) => updateData("retailDeliveryFuel", Number(e.target.value))}
                          placeholder="e.g., 1000"
                          className="text-[15px] sm:text-[16px] py-4 sm:py-6"
                        />
                      </div>
                    )}
                  </>
                )}

                {t === "logistics" && (
                  <>
                    <div className="space-y-4">
                      <Label className="text-[15px] sm:text-[16px]">Fuel type</Label>
                      <Select
                        value={data.logisticsFuelType}
                        onValueChange={(v) => updateData("logisticsFuelType", v as BusinessData["logisticsFuelType"])}
                      >
                        <SelectTrigger className="text-[15px] sm:text-[16px] py-4 sm:py-6">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="diesel" className="text-[15px] sm:text-[16px] py-3 sm:py-4">Diesel</SelectItem>
                          <SelectItem value="petrol" className="text-[15px] sm:text-[16px] py-3 sm:py-4">Petrol</SelectItem>
                          <SelectItem value="cng" className="text-[15px] sm:text-[16px] py-3 sm:py-4">CNG</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-4">
                      <Label className="text-[15px] sm:text-[16px]">Total fuel used per year (litres/kg)</Label>
                      <Input
                        type="number"
                        value={data.logisticsFuelLitres}
                        onChange={(e) => updateData("logisticsFuelLitres", Number(e.target.value))}
                        placeholder="e.g., 5000"
                        className="text-[15px] sm:text-[16px] py-4 sm:py-6"
                      />
                    </div>
                  </>
                )}

                {t === "office" && (
                  <>
                    <div className="space-y-4">
                      <Label htmlFor="flights" className="text-[15px] sm:text-[16px]">Business flights per year (total km)</Label>
                      <Input
                        id="flights"
                        type="number"
                        value={data.flightsKmPerYear}
                        onChange={(e) => updateData("flightsKmPerYear", Number(e.target.value))}
                        placeholder="e.g., 10000"
                        className="text-[15px] sm:text-[16px] py-4 sm:py-6"
                      />
                      <p className="text-[13px] sm:text-[14px] text-muted-foreground">
                        Tip: Delhi-Mumbai is ~1400km one way
                      </p>
                    </div>
                    <div className="space-y-4">
                      <Label htmlFor="trains" className="text-[15px] sm:text-[16px]">Train travel per year (km)</Label>
                      <Input
                        id="trains"
                        type="number"
                        value={data.trainKmPerYear}
                        onChange={(e) => updateData("trainKmPerYear", Number(e.target.value))}
                        placeholder="e.g., 5000"
                        className="text-[15px] sm:text-[16px] py-4 sm:py-6"
                      />
                    </div>
                  </>
                )}

                {!["retail", "logistics", "office"].includes(t) && (
                  <div className="p-6 rounded-xl bg-secondary/50 text-center">
                    <p className="text-muted-foreground text-lg">
                      No specific transport questions for this business type.
                    </p>
                    <p className="text-base text-muted-foreground mt-2">
                      Employee commuting is captured in the next step.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 4: Employees */}
          {currentStep === 4 && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 text-[32px] sm:text-[40px] leading-[1.2] tracking-[-0.03em] font-bold">
                  <Users className="h-8 w-8 text-primary" />
                  Employee Commuting
                </CardTitle>
                <CardDescription className="text-[15px] sm:text-[16px] leading-[1.48] tracking-[-0.02em] mt-2 text-muted-foreground">Daily commute of your team</CardDescription>
              </CardHeader>
              <CardContent className="space-y-10">
                {t !== "home" ? (
                  <>
                    <div className="space-y-4">
                      <Label className="text-[15px] sm:text-[16px]">Average one-way commute distance (km)</Label>
                      <div className="flex items-center gap-6">
                        <Slider
                          value={[data.avgCommuteKm || 0]}
                          onValueChange={([v]) => updateData("avgCommuteKm", v)}
                          min={0}
                          max={50}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-2xl sm:text-3xl font-bold text-primary w-16 sm:w-20 text-center">{data.avgCommuteKm} km</span>
                      </div>
                    </div>

                    <div className="p-6 rounded-xl bg-primary/5 border border-primary/20">
                      <p className="text-lg text-foreground">
                        <strong>Calculation:</strong> {data.employees} employees × {data.avgCommuteKm} km × 2 (round trip) × 52 weeks
                      </p>
                      <p className="text-base text-muted-foreground mt-2">
                        = {((data.employees || 0) * (data.avgCommuteKm || 0) * 2 * 52).toLocaleString()} km total commuting per year
                      </p>
                    </div>

                    <div className="p-6 rounded-xl bg-amber-500/10 border border-amber-500/20">
                      <p className="text-base text-amber-200">
                        <strong>Tip:</strong> Encourage carpooling, public transit, or work-from-home days to reduce commuting emissions.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="p-6 rounded-xl bg-secondary/50 text-center">
                    <p className="text-lg text-muted-foreground">
                      Home-based businesses typically have minimal commuting emissions.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 5: Procurement */}
          {currentStep === 5 && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 text-[32px] sm:text-[40px] leading-[1.2] tracking-[-0.03em] font-bold">
                  <ShoppingCart className="h-8 w-8 text-primary" />
                  Procurement & Purchases
                </CardTitle>
                <CardDescription className="text-[15px] sm:text-[16px] leading-[1.48] tracking-[-0.02em] mt-2 text-muted-foreground">Monthly spend on business supplies</CardDescription>
              </CardHeader>
              <CardContent className="space-y-10">
                {t === "office" && (
                  <div className="space-y-4">
                    <Label htmlFor="supplies" className="text-[15px] sm:text-[16px]">Office supplies spend (INR/month)</Label>
                    <Input
                      id="supplies"
                      type="number"
                      value={data.spendOfficeSupplies}
                      onChange={(e) => updateData("spendOfficeSupplies", Number(e.target.value))}
                      placeholder="e.g., 10000"
                      className="text-[15px] sm:text-[16px] py-4 sm:py-6"
                    />
                    <p className="text-[13px] sm:text-[14px] text-muted-foreground">Paper, stationery, cleaning supplies, etc.</p>
                  </div>
                )}

                {t === "retail" && (
                  <div className="space-y-4">
                    <Label htmlFor="resale" className="text-[15px] sm:text-[16px]">Goods for resale spend (INR/month)</Label>
                    <Input
                      id="resale"
                      type="number"
                      value={data.spendResaleGoods}
                      onChange={(e) => updateData("spendResaleGoods", Number(e.target.value))}
                      placeholder="e.g., 100000"
                      className="text-[15px] sm:text-[16px] py-4 sm:py-6"
                    />
                    <p className="text-[13px] sm:text-[14px] text-muted-foreground">Cost of inventory purchased</p>
                  </div>
                )}

                {t === "restaurant" && (
                  <div className="space-y-4">
                    <Label htmlFor="food" className="text-[15px] sm:text-[16px]">Food & supplies spend (INR/month)</Label>
                    <Input
                      id="food"
                      type="number"
                      value={data.spendFoodSupply}
                      onChange={(e) => updateData("spendFoodSupply", Number(e.target.value))}
                      placeholder="e.g., 150000"
                      className="text-[15px] sm:text-[16px] py-4 sm:py-6"
                    />
                    <p className="text-[13px] sm:text-[14px] text-muted-foreground">Ingredients, packaging, disposables</p>
                  </div>
                )}

                {t === "workshop" && (
                  <div className="space-y-4">
                    <Label htmlFor="materials" className="text-[15px] sm:text-[16px]">Raw materials spend (INR/month)</Label>
                    <Input
                      id="materials"
                      type="number"
                      value={data.spendRawMaterials}
                      onChange={(e) => updateData("spendRawMaterials", Number(e.target.value))}
                      placeholder="e.g., 200000"
                      className="text-[15px] sm:text-[16px] py-4 sm:py-6"
                    />
                  </div>
                )}

                {t === "home" && (
                  <div className="space-y-4">
                    <Label htmlFor="packaging" className="text-[15px] sm:text-[16px]">Packaging & supplies spend (INR/month)</Label>
                    <Input
                      id="packaging"
                      type="number"
                      value={data.spendPackaging}
                      onChange={(e) => updateData("spendPackaging", Number(e.target.value))}
                      placeholder="e.g., 5000"
                      className="text-[15px] sm:text-[16px] py-4 sm:py-6"
                    />
                  </div>
                )}

                {t === "logistics" && (
                  <div className="p-6 rounded-xl bg-secondary/50 text-center">
                    <p className="text-lg text-muted-foreground">
                      Logistics businesses primarily emit through fuel use, captured earlier.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Step 6: Waste */}
          {currentStep === 6 && (
            <Card className="bg-card border-border">
              <CardHeader className="pb-8">
                <CardTitle className="flex items-center gap-3 text-[32px] sm:text-[40px] leading-[1.2] tracking-[-0.03em] font-bold">
                  <Trash2 className="h-8 w-8 text-primary" />
                  Waste Generation
                </CardTitle>
                <CardDescription className="text-[15px] sm:text-[16px] leading-[1.48] tracking-[-0.02em] mt-2 text-muted-foreground">Business waste output</CardDescription>
              </CardHeader>
              <CardContent className="space-y-10">
                {t !== "logistics" ? (
                  <>
                    <div className="space-y-4">
                      <Label className="text-[15px] sm:text-[16px]">Garbage bags per week</Label>
                      <div className="flex items-center gap-6">
                        <Slider
                          value={[data.wasteBags || 0]}
                          onValueChange={([v]) => updateData("wasteBags", v)}
                          min={0}
                          max={50}
                          step={1}
                          className="flex-1"
                        />
                        <span className="text-2xl sm:text-3xl font-bold text-primary w-8 sm:w-12 text-center">{data.wasteBags}</span>
                      </div>
                    </div>

                    {t === "restaurant" && (
                      <div className="space-y-4">
                        <Label className="text-[15px] sm:text-[16px]">Do you compost food waste?</Label>
                        <RadioGroup
                          value={data.compostsWaste}
                          onValueChange={(v) => updateData("compostsWaste", v as BusinessData["compostsWaste"])}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                          <div>
                            <RadioGroupItem value="yes" id="compost-yes" className="peer sr-only" />
                            <Label
                              htmlFor="compost-yes"
                              className="flex items-center justify-center rounded-xl border-2 border-muted bg-secondary/50 p-4 sm:p-6 hover:bg-secondary hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                            >
                              <span className="text-[15px] sm:text-[16px] font-medium">Yes, we compost</span>
                            </Label>
                          </div>
                          <div>
                            <RadioGroupItem value="no" id="compost-no" className="peer sr-only" />
                            <Label
                              htmlFor="compost-no"
                              className="flex items-center justify-center rounded-xl border-2 border-muted bg-secondary/50 p-4 sm:p-6 hover:bg-secondary hover:border-primary/50 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
                            >
                              <span className="text-[15px] sm:text-[16px] font-medium">No</span>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-6 rounded-xl bg-secondary/50 text-center">
                    <p className="text-lg text-muted-foreground">
                      Logistics businesses typically have minimal waste emissions.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 sm:mt-12 mb-10 sm:mb-20">
            <Button variant="outline" size="lg" onClick={handlePrev} disabled={currentStep === 1} className="gap-2 text-[13px] sm:text-[14px] px-8 py-6 font-mono uppercase tracking-widest">
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              Previous
            </Button>
            <Button size="lg" onClick={handleNext} className="gap-2 text-[13px] sm:text-[14px] px-8 py-6 font-mono uppercase tracking-widest">
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
