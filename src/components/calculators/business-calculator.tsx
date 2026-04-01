"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Building2, Zap, Truck, Users, ShoppingCart, Trash2, ChevronLeft, ChevronRight, Gauge } from "lucide-react";
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
                type="number" value={value || 0} onChange={(e) => onChange(Number(e.target.value))}
                className="w-full bg-transparent text-white/90 text-[15px] font-mono outline-none text-right"
            />
            {unit && <span className="text-[11px] font-mono text-white/30 uppercase tracking-[0.1em]">{unit}</span>}
        </div>
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

const PremiumInput = ({ value, onChange, placeholder, prefix, hint }: { value: number, onChange: (val: number) => void, placeholder?: string, prefix?: string, hint?: string }) => (
    <div className="space-y-2">
      <div className="bg-[#0d1218] border border-white/10 rounded-lg px-4 py-3 flex items-center shadow-inner">
          {prefix && <span className="text-white/40 mr-2 font-mono">{prefix}</span>}
          <input 
              type="number" value={value || 0} onChange={(e) => onChange(Number(e.target.value))} placeholder={placeholder}
              className="w-full bg-transparent text-white/90 text-[15px] font-mono outline-none"
          />
      </div>
      {hint && <p className="text-[12px] text-white/40 font-sans tracking-wide">{hint}</p>}
    </div>
);

// --- Main Form ---

export default function BusinessCalculator({ onBack }: BusinessCalculatorProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<BusinessData>(initialData);
  const [result, setResult] = useState<BusinessResult | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep, result]);

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

  const activeStepData = steps[currentStep - 1];
  const progressPercent = (currentStep / steps.length) * 100;
  const t = data.businessType;

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
              <span className="font-semibold text-sky-400/90">Business</span> Footprint
          </h1>
          <p className="text-[14px] sm:text-[15px] text-white/40 font-sans mt-2 max-w-[480px] leading-relaxed">
              Calculate operational emissions across energy, logistics, procurement, and your team.
          </p>
      </div>

      {/* Progress Bar */}
      <div className="mb-8 px-4 sm:px-0">
          <div className="flex justify-between items-end mb-3">
              <div className="inline-flex items-center px-3 py-1 rounded-full border border-sky-400/10 bg-sky-400/5 text-sky-400/60 text-[10px] uppercase font-mono tracking-[0.1em]">
                  Step {currentStep} of {steps.length}
              </div>
              <span className="text-[12px] font-mono uppercase tracking-[0.1em] text-sky-400/80">
                  {activeStepData.title}
              </span>
          </div>
          <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
              <div 
                  className="h-full bg-sky-400/70 transition-all duration-500 ease-out"
                  style={{ width: `${progressPercent}%` }}
              />
          </div>
      </div>

      {/* Container */}
      <main className="relative z-10 w-full bg-[#080C10]/60 backdrop-blur-xl border border-white/10 sm:rounded-2xl overflow-hidden shadow-xl mx-0 sm:mx-auto">
        <div className="flex flex-col min-h-[420px] p-6 sm:p-10">
          <div className="flex-grow space-y-10 sm:space-y-12">
            
            {/* Step 1: Business Type */}
            {currentStep === 1 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <PremiumLabel icon={<Building2 size={16} />} text="Business Type" subtext="Select the type that best describes your business" />
                  <PremiumSelect
                    value={data.businessType}
                    onChange={(v) => updateData("businessType", v as BusinessData["businessType"])}
                    options={BUSINESS_TYPES.map(type => ({ value: type.id, label: type.label }))}
                  />
                </div>
                <div>
                  <PremiumLabel text="Number of employees" />
                  <PremiumRange min={1} max={100} step={1} value={data.employees} onChange={(v) => updateData("employees", v)} unit="staff" />
                </div>
              </div>
            )}

            {/* Step 2: Energy */}
            {currentStep === 2 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {t === "home" ? (
                  <div>
                    <PremiumLabel icon={<Zap size={16} />} text="Additional electricity for business (INR/month)" subtext="Estimate the portion of your home electricity used for business" />
                    <PremiumInput value={data.homeAddtlElectricity} onChange={(v) => updateData("homeAddtlElectricity", v)} prefix="₹" />
                  </div>
                ) : (
                  <div>
                    <PremiumLabel icon={<Zap size={16} />} text="Monthly electricity bill (INR)" />
                    <PremiumInput value={data.electricityBillPerMonth} onChange={(v) => updateData("electricityBillPerMonth", v)} prefix="₹" />
                  </div>
                )}

                {t === "office" && (
                  <>
                    <div className="animate-in fade-in duration-300">
                      <PremiumLabel text="Number of air conditioners" />
                      <PremiumRange min={0} max={20} step={1} value={data.acCount || 0} onChange={(v) => updateData("acCount", v)} unit="units" />
                    </div>
                    <div className="animate-in fade-in duration-300">
                      <PremiumLabel text="Number of computers/workstations" />
                      <PremiumRange min={0} max={50} step={1} value={data.computerCount || 0} onChange={(v) => updateData("computerCount", v)} unit="units" />
                    </div>
                  </>
                )}

                {t === "retail" && (
                  <div className="animate-in fade-in duration-300 space-y-4">
                    <PremiumToggle 
                      checked={data.usesFridges} 
                      onChange={(v) => updateData("usesFridges", v)}
                      label="Do you use refrigeration?" 
                      subtext="Display fridges, cold storage."
                    />
                    {data.usesFridges && (
                      <div className="pl-6 border-l-2 border-sky-400/30 ml-4 animate-in fade-in duration-300">
                        <PremiumLabel text="Number of refrigeration units" />
                        <PremiumInput value={data.retailFridges} onChange={(v) => updateData("retailFridges", v)} />
                      </div>
                    )}
                  </div>
                )}

                {t === "restaurant" && (
                  <div className="animate-in fade-in duration-300 space-y-10">
                    <div>
                      <PremiumLabel text="Commercial fridges/freezers" />
                      <PremiumInput value={data.commercialFridges} onChange={(v) => updateData("commercialFridges", v)} />
                    </div>
                    <div>
                      <PremiumLabel text="LPG cylinders used per year" />
                      <PremiumInput value={data.commercialLpgCylinders} onChange={(v) => updateData("commercialLpgCylinders", v)} />
                    </div>
                  </div>
                )}

                {t === "home" && (
                  <div className="animate-in fade-in duration-300">
                    <PremiumLabel text="LPG cylinders for business per year" />
                    <PremiumInput value={data.homeBusinessLpg} onChange={(v) => updateData("homeBusinessLpg", v)} />
                  </div>
                )}

                {t === "workshop" && (
                  <div className="animate-in fade-in duration-300 space-y-4">
                    <PremiumToggle 
                      checked={data.usesGenerator} 
                      onChange={(v) => updateData("usesGenerator", v)}
                      label="Do you use a diesel generator?" 
                      subtext="For backup power."
                    />
                    {data.usesGenerator && (
                      <div className="pl-6 border-l-2 border-sky-400/30 ml-4 animate-in fade-in duration-300">
                        <PremiumLabel text="Diesel used per year (litres)" />
                        <PremiumInput value={data.dieselGeneratorLitres} onChange={(v) => updateData("dieselGeneratorLitres", v)} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Operations */}
            {currentStep === 3 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {t === "retail" && (
                  <div className="animate-in fade-in duration-300 space-y-4">
                    <PremiumToggle 
                      checked={data.usesDelivery} 
                      onChange={(v) => updateData("usesDelivery", v)}
                      label="Do you offer delivery?" 
                      subtext="Using your own vehicles."
                    />
                    {data.usesDelivery && (
                      <div className="pl-6 border-l-2 border-sky-400/30 ml-4 animate-in fade-in duration-300">
                        <PremiumLabel icon={<Truck size={16}/>} text="Fuel used for delivery per year (litres)" />
                        <PremiumInput value={data.retailDeliveryFuel} onChange={(v) => updateData("retailDeliveryFuel", v)} />
                      </div>
                    )}
                  </div>
                )}

                {t === "logistics" && (
                  <div className="animate-in fade-in duration-300 space-y-10">
                    <div>
                      <PremiumLabel icon={<Truck size={16}/>} text="Fleet fuel type" />
                      <PremiumSelect
                        value={data.logisticsFuelType}
                        onChange={(v) => updateData("logisticsFuelType", v as BusinessData["logisticsFuelType"])}
                        options={[
                          { value: "diesel", label: "Diesel" },
                          { value: "petrol", label: "Petrol" },
                          { value: "cng", label: "CNG" },
                        ]}
                      />
                    </div>
                    <div>
                      <PremiumLabel text="Total fuel used per year (litres/kg)" />
                      <PremiumInput value={data.logisticsFuelLitres} onChange={(v) => updateData("logisticsFuelLitres", v)} />
                    </div>
                  </div>
                )}

                {t === "office" && (
                  <div className="animate-in fade-in duration-300 space-y-10">
                    <div>
                      <PremiumLabel text="Business flights per year (total km)" hint="Tip: Delhi-Mumbai is ~1400km one way" />
                      <PremiumInput value={data.flightsKmPerYear} onChange={(v) => updateData("flightsKmPerYear", v)} />
                    </div>
                    <div>
                      <PremiumLabel text="Train travel per year (km)" />
                      <PremiumInput value={data.trainKmPerYear} onChange={(v) => updateData("trainKmPerYear", v)} />
                    </div>
                  </div>
                )}

                {!["retail", "logistics", "office"].includes(t) && (
                  <div className="p-8 border border-dashed border-white/10 rounded-xl text-center">
                    <div className="text-white/40 text-[14px] font-sans">No specific transport questions for this business type.</div>
                    <div className="text-white/30 text-[12px] mt-2 font-mono">Employee commuting is captured next.</div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Employees (Commuting) */}
            {currentStep === 4 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {t !== "home" ? (
                  <>
                    <div>
                      <PremiumLabel icon={<Users size={16} />} text="Average one-way commute distance (km)" />
                      <PremiumRange min={0} max={50} step={1} value={data.avgCommuteKm || 0} onChange={(v) => updateData("avgCommuteKm", v)} unit="km" />
                    </div>
                    
                    <div className="p-5 rounded-xl bg-sky-400/5 border border-sky-400/10">
                      <p className="text-[13px] text-sky-200/80 font-mono tracking-wide leading-relaxed">
                        <strong className="text-sky-400 font-semibold uppercase">Calc:</strong> {data.employees} emp × {data.avgCommuteKm}km × 2 × 52w = 
                        <span className="text-white ml-2">
                        {((data.employees || 0) * (data.avgCommuteKm || 0) * 2 * 52).toLocaleString()} km/yr
                        </span>
                      </p>
                    </div>

                    <div className="p-4 rounded-lg bg-[#F4A261]/10 border border-[#F4A261]/20">
                      <p className="text-[13px] font-sans text-white/80 leading-relaxed">
                        <strong className="text-[#F4A261]">Tip:</strong> Encourage carpooling, public transit, or work-from-home days to reduce group commuting emissions.
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="p-8 border border-dashed border-white/10 rounded-xl text-center">
                    <div className="text-white/40 text-[14px] font-sans">Home-based businesses typically have minimal commuting emissions.</div>
                  </div>
                )}
              </div>
            )}

            {/* Step 5: Procurement */}
            {currentStep === 5 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {t === "office" && (
                  <div className="animate-in fade-in duration-300">
                    <PremiumLabel icon={<ShoppingCart size={16} />} text="Office supplies spend (INR/month)" subtext="Paper, stationery, cleaning supplies, etc." />
                    <PremiumInput value={data.spendOfficeSupplies} onChange={(v) => updateData("spendOfficeSupplies", v)} prefix="₹" />
                  </div>
                )}

                {t === "retail" && (
                  <div className="animate-in fade-in duration-300">
                    <PremiumLabel icon={<ShoppingCart size={16} />} text="Goods for resale spend (INR/month)" subtext="Cost of inventory purchased" />
                    <PremiumInput value={data.spendResaleGoods} onChange={(v) => updateData("spendResaleGoods", v)} prefix="₹" />
                  </div>
                )}

                {t === "restaurant" && (
                  <div className="animate-in fade-in duration-300">
                    <PremiumLabel icon={<ShoppingCart size={16} />} text="Food & supplies spend (INR/month)" subtext="Ingredients, packaging, disposables" />
                    <PremiumInput value={data.spendFoodSupply} onChange={(v) => updateData("spendFoodSupply", v)} prefix="₹" />
                  </div>
                )}

                {t === "workshop" && (
                  <div className="animate-in fade-in duration-300">
                    <PremiumLabel icon={<ShoppingCart size={16} />} text="Raw materials spend (INR/month)" />
                    <PremiumInput value={data.spendRawMaterials} onChange={(v) => updateData("spendRawMaterials", v)} prefix="₹" />
                  </div>
                )}

                {t === "home" && (
                  <div className="animate-in fade-in duration-300">
                    <PremiumLabel icon={<ShoppingCart size={16} />} text="Packaging & supplies spend (INR/month)" />
                    <PremiumInput value={data.spendPackaging} onChange={(v) => updateData("spendPackaging", v)} prefix="₹" />
                  </div>
                )}

                {t === "logistics" && (
                  <div className="p-8 border border-dashed border-white/10 rounded-xl text-center animate-in fade-in duration-300">
                    <div className="text-white/40 text-[14px] font-sans">Logistics businesses primarily emit through fuel use, captured earlier.</div>
                  </div>
                )}
              </div>
            )}

            {/* Step 6: Waste */}
            {currentStep === 6 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {t !== "logistics" ? (
                  <>
                    <div className="animate-in fade-in duration-300">
                      <PremiumLabel icon={<Trash2 size={16}/>} text="Garbage bags per week" />
                      <PremiumRange min={0} max={50} step={1} value={data.wasteBags || 0} onChange={(v) => updateData("wasteBags", v)} unit="bags" />
                    </div>

                    {t === "restaurant" && (
                      <div className="animate-in fade-in duration-300">
                        <PremiumLabel text="Do you compost food waste?" />
                        <PremiumSelect
                          value={data.compostsWaste}
                          onChange={(v) => updateData("compostsWaste", v as BusinessData["compostsWaste"])}
                          options={[
                            { value: "yes", label: "Yes, we compost" },
                            { value: "no", label: "No, we don't" },
                          ]}
                        />
                      </div>
                    )}
                  </>
                ) : (
                  <div className="p-8 border border-dashed border-white/10 rounded-xl text-center">
                    <div className="text-white/40 text-[14px] font-sans">Logistics businesses typically have minimal waste emissions compared to fuel.</div>
                  </div>
                )}
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
                  style={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: '#fff', background: 'rgba(56, 189, 248, 0.1)' }}
              >
                  <div className="absolute inset-0 bg-gradient-to-r from-sky-400/0 via-sky-400/20 to-sky-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
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
