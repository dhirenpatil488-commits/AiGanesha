"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Home, Zap, Car, Plane, Utensils, ShoppingBag, Trash2, ChevronLeft, ChevronRight, Leaf, Gauge, Plus, X } from "lucide-react";
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

// --- Premium UI Sub-components ---

const PremiumLabel = ({ icon, text, subtext }: { icon?: React.ReactNode; text: string; subtext?: string }) => (
    <div className="mb-4">
        <label className="flex items-center gap-2.5 text-[14px] sm:text-[15px] text-white/90 font-sans tracking-[-0.01em]">
            {icon && <span className="text-[#F4A261] opacity-80">{icon}</span>}
            {text}
        </label>
        {subtext && <p className="text-[12px] text-white/40 mt-1 font-sans leading-relaxed">{subtext}</p>}
    </div>
);

const PremiumRange = ({ min, max, step, value, onChange, unit }: { min: number, max: number, step: number, value: number, onChange: (val: number) => void, unit?: string }) => (
    <div className="flex items-center gap-5">
        <input 
            type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} 
            className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#F4A261]"
        />
        <div className="flex items-center gap-2 bg-[#0d1218] border border-white/10 rounded-lg px-4 py-2.5 min-w-[120px]">
            <input 
                type="number" value={value} onChange={(e) => onChange(Number(e.target.value))}
                className="w-full bg-transparent text-white/90 text-[15px] font-mono outline-none text-right"
            />
            {unit && <span className="text-[11px] font-mono text-white/30 uppercase tracking-[0.1em]">{unit}</span>}
        </div>
    </div>
);

const PremiumRadioCard = ({ active, onClick, icon, title, description }: { active: boolean, onClick: () => void, icon?: React.ReactNode, title: React.ReactNode, description?: string }) => (
    <div 
        onClick={onClick}
        className={`relative flex flex-col gap-2 p-5 rounded-xl border transition-all duration-400 cursor-pointer overflow-hidden ${
            active 
            ? 'bg-[#F4A261]/[0.08] border-[#F4A261]/50 shadow-[0_0_20px_rgba(244,162,97,0.1)]' 
            : 'bg-[#0d1218]/50 border-white/5 hover:border-white/20 hover:bg-white/5'
        }`}
    >
        {active && <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#F4A261]/80 to-transparent" />}
        <div className="flex items-center gap-3">
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${active ? 'border-[#F4A261]' : 'border-white/20'}`}>
                {active && <div className="w-2 h-2 rounded-full bg-[#F4A261]" />}
            </div>
            {icon && <span className={active ? 'text-[#F4A261]' : 'text-white/40'}>{icon}</span>}
            <span className={`text-[14px] sm:text-[15px] font-sans ${active ? 'text-white' : 'text-white/70'}`}>{title}</span>
        </div>
        {description && <p className="text-[12px] text-white/40 font-sans leading-relaxed pl-7">{description}</p>}
    </div>
);

const PremiumSelect = ({ value, onChange, options }: { value: string, onChange: (val: string) => void, options: {value: string, label: string}[] }) => (
    <div className="relative">
        <select 
            value={value} onChange={(e) => onChange(e.target.value)}
            className="w-full bg-[#0d1218]/80 text-[14px] sm:text-[15px] text-white/80 border border-white/10 rounded-xl px-5 py-4 appearance-none outline-none focus:border-[#F4A261]/50 focus:bg-white/5 transition-all font-sans"
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-[#080C10] text-white/80">{opt.label}</option>
            ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
    </div>
);

const PremiumToggle = ({ checked, onChange, label, subtext }: { checked: boolean, onChange: (checked: boolean) => void, label: string, subtext?: string }) => (
    <label className={`flex items-start gap-4 p-5 rounded-xl border transition-all duration-300 cursor-pointer ${checked ? 'bg-[#F4A261]/[0.05] border-[#F4A261]/30' : 'bg-[#0d1218]/50 border-white/5 hover:border-white/20'}`}>
        <div className="pt-0.5">
            <div 
                onClick={(e) => { e.preventDefault(); onChange(!checked); }}
                className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ease-in-out ${checked ? 'bg-[#F4A261]' : 'bg-white/10'}`}
            >
                <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
        </div>
        <div className="flex-1" onClick={(e) => { e.preventDefault(); onChange(!checked); }}>
            <div className={`text-[14px] sm:text-[15px] font-sans ${checked ? 'text-white/90' : 'text-white/70'}`}>{label}</div>
            {subtext && <div className="text-[12px] text-white/40 mt-1">{subtext}</div>}
        </div>
    </label>
);

// --- Main Form ---

export default function HouseholdCalculator({ onBack }: HouseholdCalculatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<HouseholdData>(initialData);
  const [result, setResult] = useState<HouseholdResult | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep, result]);

  const updateData = <K extends keyof HouseholdData>(key: K, value: HouseholdData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
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

  const activeStepData = steps[currentStep - 1];
  const progressPercent = (currentStep / steps.length) * 100;

  return (
    <div className="w-full mx-auto transition-all duration-500 pb-20" style={{ maxWidth: '680px' }}>
      
      {/* Navigation Header */}
      <div className="mb-8 sm:mb-12 pt-10 sm:pt-4 px-4 sm:px-0">
          <button 
              onClick={onBack} 
              className="flex items-center gap-2 text-[11px] sm:text-[12px] font-mono text-white/30 hover:text-white/70 transition-colors uppercase tracking-[0.12em] mb-6 sm:mb-8 bg-transparent border-none cursor-pointer"
          >
              <ArrowLeft size={14} /> Back to Selection
          </button>
          
          <h1 className="text-[28px] sm:text-[36px] font-sans tracking-[-0.03em] text-white leading-tight font-light">
              <span className="font-semibold">Household</span> Footprint
          </h1>
          <p className="text-[14px] sm:text-[15px] text-white/40 font-sans mt-2 max-w-[480px] leading-relaxed">
              Measure your personal emissions profile across energy, transport, consumption, and diet.
          </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 px-4 sm:px-0">
          <div className="flex justify-between items-end mb-3">
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/40 text-[10px] uppercase font-mono tracking-[0.1em]">
                  Step {currentStep} of {steps.length}
              </div>
              <span className="text-[12px] font-mono uppercase tracking-[0.1em] text-[#F4A261]/80">
                  {activeStepData.title}
              </span>
          </div>
          <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
              <div 
                  className="h-full bg-[#F4A261] transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
              />
          </div>
      </div>

      {/* Container */}
      <main className="relative z-10 w-full bg-[#080C10]/60 backdrop-blur-xl border border-white/10 sm:rounded-2xl overflow-hidden shadow-xl mx-0 sm:mx-auto">
        <div className="flex flex-col min-h-[420px] p-6 sm:p-10">
          <div className="flex-grow space-y-10 sm:space-y-12">
            
            {/* Step 1: Household Info */}
            {currentStep === 1 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <PremiumLabel icon={<Home size={16} />} text="Number of people in household" subtext="This helps calculate per-capita emissions accurately." />
                  <PremiumRange min={1} max={10} step={1} value={data.householdSize} onChange={(v) => updateData("householdSize", v)} unit="people" />
                </div>
                <div>
                  <PremiumLabel text="Type of home" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "apartment", label: "Apartment" },
                      { id: "independent", label: "Independent House" },
                      { id: "shared", label: "Shared Housing" },
                    ].map((t) => (
                      <PremiumRadioCard
                        key={t.id}
                        active={data.homeType === t.id}
                        onClick={() => updateData("homeType", t.id as HouseholdData["homeType"])}
                        title={t.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Energy */}
            {currentStep === 2 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <PremiumLabel icon={<Zap size={16} />} text="Monthly electricity bill (INR)" />
                  <div className="bg-[#0d1218] border border-white/10 rounded-lg px-4 py-3 flex items-center">
                    <span className="text-white/40 mr-2 font-mono">₹</span>
                    <input 
                      type="number" value={data.electricityBillPerMonth} onChange={(e) => updateData("electricityBillPerMonth", Number(e.target.value))}
                      className="w-full bg-transparent text-white/90 text-[15px] font-mono outline-none"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <PremiumToggle 
                    checked={data.hasSolar} 
                    onChange={(v) => updateData("hasSolar", v)}
                    label="Do you have solar panels?" 
                    subtext="Solar reduces your grid emissions."
                  />
                  {data.hasSolar && (
                    <div className="pl-6 border-l-2 border-[#F4A261]/30 ml-4 animate-in fade-in duration-300">
                      <PremiumLabel text="What percentage of electricity comes from solar?" />
                      <PremiumSelect 
                        value={data.solarPercentage} 
                        onChange={(v) => updateData("solarPercentage", v as HouseholdData["solarPercentage"])}
                        options={[
                          { value: "0-25", label: "0-25%" },
                          { value: "25-50", label: "25-50%" },
                          { value: "50-75", label: "50-75%" },
                          { value: "75-100", label: "75-100%" }
                        ]}
                      />
                    </div>
                  )}
                </div>

                <div>
                  <PremiumLabel text="Primary cooking fuel" />
                  <PremiumSelect
                    value={data.cookingFuel}
                    onChange={(v) => updateData("cookingFuel", v as HouseholdData["cookingFuel"])}
                    options={[
                      { value: "lpg", label: "LPG Cylinders" },
                      { value: "png", label: "Piped Natural Gas (PNG)" },
                      { value: "electric", label: "Electric / Induction" },
                      { value: "mixed", label: "Mixed" }
                    ]}
                  />
                </div>

                {(data.cookingFuel === "lpg" || data.cookingFuel === "mixed") && (
                  <div className="animate-in fade-in duration-300">
                    <PremiumLabel text="LPG cylinders used per year" />
                    <div className="bg-[#0d1218] border border-white/10 rounded-lg px-4 py-3">
                      <input 
                        type="number" value={data.lpgCylindersPerYear} onChange={(e) => updateData("lpgCylindersPerYear", Number(e.target.value))}
                        className="w-full bg-transparent text-white/90 text-[15px] font-mono outline-none"
                      />
                    </div>
                  </div>
                )}

                {(data.cookingFuel === "png" || data.cookingFuel === "mixed") && (
                  <div className="animate-in fade-in duration-300">
                    <PremiumLabel text="Monthly PNG bill (INR)" />
                    <div className="bg-[#0d1218] border border-white/10 rounded-lg px-4 py-3 flex items-center">
                      <span className="text-white/40 mr-2 font-mono">₹</span>
                      <input 
                        type="number" value={data.pngBillPerMonth} onChange={(e) => updateData("pngBillPerMonth", Number(e.target.value))}
                        className="w-full bg-transparent text-white/90 text-[15px] font-mono outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Transport */}
            {currentStep === 3 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center bg-[#0d1218]/50 p-4 sm:p-5 rounded-xl border border-white/5">
                  <span className="text-[14px] sm:text-[15px] font-sans text-white/80 flex items-center gap-2">
                    <Car size={16} className="text-[#F4A261]"/> Household Vehicles ({data.vehicles.length})
                  </span>
                  <button 
                    onClick={addVehicle}
                    className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[11px] font-mono text-white/80 uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    <Plus size={14} /> Add
                  </button>
                </div>

                {data.vehicles.length === 0 ? (
                  <div className="text-center p-8 bg-white/[0.02] border border-dashed border-white/10 rounded-xl text-white/40 text-[14px] font-sans">
                    No personal vehicles added. Generating zero private transport emissions.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {data.vehicles.map((v, i) => (
                      <div key={i} className="relative p-5 sm:p-6 bg-[#0d1218] border border-white/10 rounded-xl">
                        <button 
                          onClick={() => removeVehicle(i)}
                          className="absolute top-4 right-4 text-white/30 hover:text-[#f85149] transition-colors p-1 cursor-pointer"
                        >
                          <X size={16} />
                        </button>
                        <div className="text-[10px] uppercase font-mono tracking-widest text-[#F4A261] mb-5">Vehicle {i + 1}</div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                          <div>
                            <div className="text-[11px] font-mono text-white/40 uppercase tracking-widest mb-2">Fuel / Type</div>
                            <PremiumSelect 
                              value={v.type} onChange={(val) => updateVehicle(i, 'type', val)}
                              options={[
                                {value: 'petrol', label: 'Petrol Car'},
                                {value: 'diesel', label: 'Diesel Car'},
                                {value: 'cng', label: 'CNG Car'},
                                {value: 'electric', label: 'Electric Car'},
                                {value: 'twoWheeler', label: 'Two-Wheeler'}
                              ]}
                            />
                          </div>
                          <div>
                            <div className="text-[11px] font-mono text-white/40 uppercase tracking-widest mb-2">km/week</div>
                            <input type="number" value={v.kmPerWeek} onChange={(e) => updateVehicle(i, 'kmPerWeek', e.target.value)} className="w-full bg-[#080C10] text-[15px] font-mono text-white/90 border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-[#F4A261]/50" />
                          </div>
                          <div>
                            <div className="text-[11px] font-mono text-white/40 uppercase tracking-widest mb-2">Efficiency (km/L)</div>
                            <input type="number" value={v.efficiency} onChange={(e) => updateVehicle(i, 'efficiency', e.target.value)} className="w-full bg-[#080C10] text-[15px] font-mono text-white/90 border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-[#F4A261]/50" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Flights */}
            {currentStep === 4 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="p-4 rounded-lg bg-[#F4A261]/10 border border-[#F4A261]/20">
                  <p className="text-[13px] font-sans text-white/80">
                    <strong className="text-[#F4A261]">Tip:</strong> A single long-haul flight can heavily swing your annual carbon footprint.
                  </p>
                </div>
                <div>
                  <PremiumLabel text="Short flights/year" subtext="Under 3 hours (e.g., Domestic)" icon={<Plane size={16}/>} />
                  <PremiumRange min={0} max={20} step={1} value={data.shortFlightsPerYear} onChange={(v) => updateData("shortFlightsPerYear", v)} unit="trips" />
                </div>
                <div>
                  <PremiumLabel text="Medium flights/year" subtext="3-6 hours (e.g., Continental)" />
                  <PremiumRange min={0} max={15} step={1} value={data.mediumFlightsPerYear} onChange={(v) => updateData("mediumFlightsPerYear", v)} unit="trips" />
                </div>
                <div>
                  <PremiumLabel text="Long flights/year" subtext="Over 6 hours (e.g., Intercontinental)" />
                  <PremiumRange min={0} max={10} step={1} value={data.longFlightsPerYear} onChange={(v) => updateData("longFlightsPerYear", v)} unit="trips" />
                </div>
              </div>
            )}

            {/* Step 5: Food */}
            {currentStep === 5 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <PremiumLabel icon={<Utensils size={16}/>} text="Diet type" />
                  <PremiumSelect
                    value={data.dietType} onChange={(v) => updateData("dietType", v as HouseholdData["dietType"])}
                    options={[
                      { value: "vegetarian", label: "Vegetarian" },
                      { value: "eggitarian", label: "Eggitarian" },
                      { value: "mixed", label: "Mixed" },
                      { value: "nonVegetarian", label: "Non-Vegetarian" },
                      { value: "highMeat", label: "High Meat" },
                    ]}
                  />
                </div>
                <div>
                  <PremiumLabel text="Dairy consumption" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {["low", "moderate", "high"].map((t) => (
                      <PremiumRadioCard 
                        key={t} active={data.dairyFrequency === t} 
                        onClick={() => updateData("dairyFrequency", t as HouseholdData["dairyFrequency"])}
                        title={<span className="capitalize">{t}</span>}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <PremiumLabel text="How often do you eat out?" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: "rarely", label: "Rarely" },
                      { id: "weekly", label: "Weekly" },
                      { id: "multiple", label: "Multiple/Week" }
                    ].map((t) => (
                      <PremiumRadioCard 
                        key={t.id} active={data.eatingOut === t.id} 
                        onClick={() => updateData("eatingOut", t.id as HouseholdData["eatingOut"])}
                        title={t.label}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 6: Shopping */}
            {currentStep === 6 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <PremiumLabel icon={<ShoppingBag size={16} />} text="Monthly shopping spend (INR)" subtext="Clothes, electronics, household items, etc." />
                  <div className="bg-[#0d1218] border border-white/10 rounded-lg px-4 py-3 flex items-center">
                    <span className="text-white/40 mr-2 font-mono">₹</span>
                    <input 
                      type="number" value={data.shoppingSpendPerMonth} onChange={(e) => updateData("shoppingSpendPerMonth", Number(e.target.value))}
                      className="w-full bg-transparent text-white/90 text-[15px] font-mono outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <PremiumLabel text="Major purchases this year" subtext="Manufacturing emissions are calculated based on these units." />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#0d1218]/50 border border-white/5 rounded-xl p-4">
                      <div className="text-[11px] font-mono text-white/40 uppercase tracking-widest mb-3">Smartphones</div>
                      <input type="number" min="0" value={data.smartphonesPerYear} onChange={(e) => updateData("smartphonesPerYear", Number(e.target.value))} className="w-full bg-[#080C10] text-[15px] font-mono text-white/90 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-[#F4A261]/50" />
                    </div>
                    <div className="bg-[#0d1218]/50 border border-white/5 rounded-xl p-4">
                      <div className="text-[11px] font-mono text-white/40 uppercase tracking-widest mb-3">Laptops</div>
                      <input type="number" min="0" value={data.laptopsPerYear} onChange={(e) => updateData("laptopsPerYear", Number(e.target.value))} className="w-full bg-[#080C10] text-[15px] font-mono text-white/90 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-[#F4A261]/50" />
                    </div>
                    <div className="bg-[#0d1218]/50 border border-white/5 rounded-xl p-4">
                      <div className="text-[11px] font-mono text-white/40 uppercase tracking-widest mb-3">Appliances (AC, Fridge)</div>
                      <input type="number" min="0" value={data.appliancesPerYear} onChange={(e) => updateData("appliancesPerYear", Number(e.target.value))} className="w-full bg-[#080C10] text-[15px] font-mono text-white/90 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-[#F4A261]/50" />
                    </div>
                    <div className="bg-[#0d1218]/50 border border-white/5 rounded-xl p-4">
                      <div className="text-[11px] font-mono text-white/40 uppercase tracking-widest mb-3">Large Furniture Items</div>
                      <input type="number" min="0" value={data.furniturePerYear} onChange={(e) => updateData("furniturePerYear", Number(e.target.value))} className="w-full bg-[#080C10] text-[15px] font-mono text-white/90 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-[#F4A261]/50" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 7: Waste */}
            {currentStep === 7 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <PremiumLabel icon={<Trash2 size={16} />} text="Garbage bags per week" />
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "1-2", label: "1-2 bags" },
                      { id: "3-4", label: "3-4 bags" },
                      { id: "5-6", label: "5-6 bags" },
                      { id: "more", label: "7+ bags" }
                    ].map((t) => (
                      <PremiumRadioCard 
                        key={t.id} active={data.wasteBags === t.id} 
                        onClick={() => updateData("wasteBags", t.id as HouseholdData["wasteBags"])}
                        title={t.label} 
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <PremiumToggle 
                    checked={data.composts} 
                    onChange={(v) => updateData("composts", v)}
                    label="Do you compost food waste?"
                    subtext="Composting reduces methane emissions."
                  />
                </div>

                <div className="p-5 rounded-xl bg-[#3fb950]/5 border border-[#3fb950]/20 space-y-3">
                  <div className="flex items-start gap-4">
                    <Leaf className="h-5 w-5 text-[#3fb950] shrink-0" />
                    <div>
                      <p className="text-[14px] text-white/90 font-sans mb-3">Tips to reduce waste emissions:</p>
                      <ul className="text-[13px] text-white/60 font-sans space-y-1.5">
                        <li>• Segregate wet and dry waste</li>
                        <li>• Compost organic waste at home</li>
                        <li>• Recycle paper, plastic, and metal</li>
                        <li>• Avoid single-use packaging</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Navigation Footer */}
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/5">
              <button 
                  onClick={handlePrev} disabled={currentStep === 1}
                  className={`flex items-center gap-2 px-6 py-3.5 border border-white/10 rounded-lg text-[12px] font-mono text-white/50 uppercase tracking-widest transition-colors cursor-pointer ${currentStep === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/5 hover:text-white/90'}`}
              >
                  <ChevronLeft size={16} /> Back
              </button>
              <button 
                  onClick={handleNext} 
                  className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-lg border text-[12px] font-mono uppercase tracking-[0.14em] transition-all duration-400 overflow-hidden cursor-pointer"
                  style={{ borderColor: 'rgba(244,162,97,0.4)', color: '#fff', background: 'rgba(244,162,97,0.1)' }}
              >
                  <div className="absolute inset-0 bg-gradient-to-r from-[#F4A261]/0 via-[#F4A261]/20 to-[#F4A261]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <span className="relative z-10 flex items-center gap-3">
                      {currentStep === steps.length ? 'Calculate' : 'Next'} 
                      {currentStep === steps.length ? <Gauge size={16} /> : <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                  </span>
              </button>
          </div>
        </div>
      </main>
    </div>
  );
}
