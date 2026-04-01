import React, { useState } from 'react';
import { 
  Home, Zap, Flame, Car, Plane, Utensils, ShoppingBag, 
  Smartphone, Trash2, HeartPulse, Users, Activity,
  ChevronRight, ChevronLeft, TreePine, Globe, Share2, Lightbulb, Plus, X
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { calculateEmissions } from '../utils/calculations';
import '../index.css';

const STEPS = [
    { id: 'household', title: 'Household', icon: <Home size={16} /> },
    { id: 'electricity', title: 'Electricity', icon: <Zap size={16} /> },
    { id: 'cooking', title: 'Cooking', icon: <Flame size={16} /> },
    { id: 'transport', title: 'Transport', icon: <Car size={16} /> },
    { id: 'flights', title: 'Flights', icon: <Plane size={16} /> },
    { id: 'food', title: 'Food', icon: <Utensils size={16} /> },
    { id: 'spending', title: 'Spending', icon: <ShoppingBag size={16} /> },
    { id: 'purchases', title: 'Purchases', icon: <Smartphone size={16} /> },
    { id: 'waste', title: 'Waste', icon: <Trash2 size={16} /> },
    { id: 'lifestyle', title: 'Lifestyle', icon: <HeartPulse size={16} /> },
    { id: 'results', title: 'Results', icon: <Activity size={16} /> }
];

// --- Premium UI Components ---

const PremiumLabel = ({ icon, text, subtext }) => (
    <div className="mb-4">
        <label className="flex items-center gap-2.5 text-[14px] sm:text-[15px] text-white/90 font-sans tracking-[-0.01em]">
            {icon && <span className="text-[#F4A261] opacity-80">{icon}</span>}
            {text}
        </label>
        {subtext && <p className="text-[12px] text-white/40 mt-1 font-sans leading-relaxed">{subtext}</p>}
    </div>
);

const PremiumRange = ({ name, min, max, step, value, onChange, unit }) => (
    <div className="flex items-center gap-5">
        <input 
            type="range" name={name} min={min} max={max} step={step} value={value} onChange={onChange} 
            className="flex-1 h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-[#F4A261]"
        />
        <div className="flex items-center gap-2 bg-[#0d1218] border border-white/10 rounded-lg px-4 py-2.5 min-w-[120px]">
            <input 
                type="number" name={name} value={value} onChange={onChange}
                className="w-full bg-transparent text-white/90 text-[15px] font-mono outline-none text-right"
            />
            {unit && <span className="text-[11px] font-mono text-white/30 uppercase tracking-[0.1em]">{unit}</span>}
        </div>
    </div>
);

const PremiumRadioCard = ({ active, onClick, icon, title, description }) => (
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

const ChevronDown = ({ size }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
);

const PremiumSelect = ({ name, value, onChange, options }) => (
    <div className="relative">
        <select 
            name={name} value={value} onChange={onChange}
            className="w-full bg-[#0d1218]/80 text-[14px] sm:text-[15px] text-white/80 border border-white/10 rounded-xl px-5 py-4 appearance-none outline-none focus:border-[#F4A261]/50 focus:bg-white/5 transition-all font-sans"
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value} className="bg-[#080C10] text-white/80">{opt.label}</option>
            ))}
        </select>
        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/30">
            <ChevronDown size={16} />
        </div>
    </div>
);

const PremiumToggle = ({ checked, onChange, label, subtext }) => (
    <label className={`flex items-start gap-4 p-5 rounded-xl border transition-all duration-300 cursor-pointer ${checked ? 'bg-[#F4A261]/[0.05] border-[#F4A261]/30' : 'bg-[#0d1218]/50 border-white/5 hover:border-white/20'}`}>
        <div className="pt-0.5">
            <div className={`w-10 h-5 rounded-full p-1 transition-colors duration-300 ease-in-out ${checked ? 'bg-[#F4A261]' : 'bg-white/10'}`}>
                <div className={`w-3 h-3 bg-white rounded-full shadow-md transform transition-transform duration-300 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
        </div>
        <div className="flex-1">
            <div className={`text-[14px] sm:text-[15px] font-sans ${checked ? 'text-white/90' : 'text-white/70'}`}>{label}</div>
            {subtext && <div className="text-[12px] text-white/40 mt-1">{subtext}</div>}
        </div>
    </label>
);


// --- Main Component ---

const HouseholdCalculator = ({ onBack }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        householdSize: 1, homeType: 'apartment',
        electricityBillPerMonth: 2000, hasSolar: false, solarPercentage: '0-25',
        cookingFuel: 'lpg', lpgCylindersPerYear: 6, pngBillPerMonth: 500,
        vehicles: [],
        shortFlightsPerYear: 0, mediumFlightsPerYear: 0, longFlightsPerYear: 0,
        dietType: 'mixed', dairyFrequency: 'moderate', eatingOut: 'rarely',
        shoppingSpendPerMonth: 10000,
        smartphonesPerYear: 0, laptopsPerYear: 0, appliancesPerYear: 0, furniturePerYear: 0,
        wasteBags: '3-4', recycles: true, composts: false,
        useAC: true, workFromHome: false, usePublicTransport: false
    });

    const handleInput = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : (type === 'radio' || isNaN(value) ? value : parseFloat(value) || 0) }));
    };

    const addVehicle = () => setFormData(p => ({ ...p, vehicles: [...p.vehicles, { id: Date.now(), type: 'petrol', kmPerWeek: 100, efficiency: 15 }] }));
    const removeVehicle = (id) => setFormData(p => ({ ...p, vehicles: p.vehicles.filter(v => v.id !== id) }));
    const updateVehicle = (id, field, value) => setFormData(p => ({ ...p, vehicles: p.vehicles.map(v => v.id === id ? { ...v, [field]: isNaN(value) ? value : parseFloat(value) || 0 } : v) }));

    const nextStep = () => window.scrollTo({ top: 0, behavior: 'smooth' }) || setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    const prevStep = () => window.scrollTo({ top: 0, behavior: 'smooth' }) || setCurrentStep(prev => Math.max(prev - 1, 0));

    const emissions = calculateEmissions(formData);
    const activeStepData = STEPS[currentStep];
    const isResults = currentStep === STEPS.length - 1;

    const getIntensityColor = (score) => {
        if (score < 2.5) return '#3fb950'; // green
        if (score < 4.5) return '#F4A261'; // orange
        return '#f85149'; // red
    };

    return (
        <div className="w-full mx-auto transition-all duration-500 pb-20" style={{ maxWidth: isResults ? '1000px' : '680px' }}>
            
            {/* Navigation & Header */}
            <div className="mb-8 sm:mb-12 pt-10 sm:pt-4 px-4 sm:px-0">
                <button 
                    onClick={onBack} 
                    className="flex items-center gap-2 text-[11px] sm:text-[12px] font-mono text-white/30 hover:text-white/70 transition-colors uppercase tracking-[0.12em] mb-6 sm:mb-8 bg-transparent border-none cursor-pointer"
                >
                    <ChevronLeft size={14} /> Back to Selection
                </button>
                
                <h1 className="text-[28px] sm:text-[36px] font-sans tracking-[-0.03em] text-white leading-tight font-light">
                    <span className="font-semibold">Household</span> Footprint
                </h1>
                {!isResults && (
                    <p className="text-[14px] sm:text-[15px] text-white/40 font-sans mt-2 max-w-[480px] leading-relaxed">
                        Measure your personal emissions profile across energy, transport, consumption, and diet.
                    </p>
                )}
            </div>

            {/* Progress Bar (if not results) */}
            {!isResults && (
                <div className="mb-8 px-4 sm:px-0">
                    <div className="flex justify-between items-end mb-3">
                        <div className="inline-flex items-center px-3 py-1 rounded-full border border-white/10 bg-white/5 text-white/40 text-[10px] uppercase font-mono tracking-[0.1em]">
                            Step {currentStep + 1} of {STEPS.length - 1}
                        </div>
                        <span className="text-[12px] font-mono uppercase tracking-[0.1em] text-[#F4A261]/80">
                            {activeStepData.title}
                        </span>
                    </div>
                    <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-[#F4A261] transition-all duration-500 ease-out"
                            style={{ width: `${((currentStep + 1) / (STEPS.length - 1)) * 100}%` }}
                        />
                    </div>
                </div>
            )}

            {/* Main Form Container */}
            <main className={`relative z-10 w-full bg-[#080C10]/60 backdrop-blur-xl border border-white/10 sm:rounded-2xl overflow-hidden transition-all duration-500 ${isResults ? 'p-6 sm:p-10 shadow-2xl' : 'shadow-xl'} mx-0 sm:mx-auto`}>
                
                {/* Inner Form Content */}
                {!isResults ? (
                    <div className="flex flex-col min-h-[420px] p-6 sm:p-10">
                        <div className="flex-grow space-y-10 sm:space-y-12">
                            
                            {/* STEP 1: Household */}
                            {activeStepData.id === 'household' && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div>
                                        <PremiumLabel 
                                            icon={<Users size={16}/>} 
                                            text="How many people live in your household?" 
                                            subtext="This helps calculate per-capita emissions accurately."
                                        />
                                        <PremiumRange name="householdSize" min="1" max="10" step="1" value={formData.householdSize} onChange={handleInput} unit="people" />
                                    </div>
                                    <div>
                                        <PremiumLabel text="What type of home do you live in?" />
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {[
                                                {id: 'apartment', label: 'Apartment'}, 
                                                {id: 'independent', label: 'Independent House'}, 
                                                {id: 'shared', label: 'Shared / Co-living'}
                                            ].map(t => (
                                                <PremiumRadioCard 
                                                    key={t.id} active={formData.homeType === t.id} 
                                                    onClick={() => handleInput({ target: { name: 'homeType', value: t.id, type: 'radio' }})}
                                                    title={t.label} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 2: Electricity */}
                            {activeStepData.id === 'electricity' && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div>
                                        <PremiumLabel text="Average monthly electricity bill" icon={<Zap size={16}/>} />
                                        <PremiumRange name="electricityBillPerMonth" min="0" max="25000" step="500" value={formData.electricityBillPerMonth} onChange={handleInput} unit="₹" />
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <PremiumToggle 
                                            checked={formData.hasSolar} 
                                            onChange={(e) => handleInput({ target: { name: 'hasSolar', type: 'checkbox', checked: !formData.hasSolar }})}
                                            label="Do you have rooftop solar installed?" 
                                        />
                                        
                                        {formData.hasSolar && (
                                            <div className="pl-6 border-l-2 border-[#F4A261]/30 ml-4 animate-in fade-in duration-300">
                                                <PremiumLabel text="Percentage of electricity from solar?" />
                                                <PremiumSelect 
                                                    name="solarPercentage" value={formData.solarPercentage} onChange={handleInput}
                                                    options={[
                                                        {value: "0-25", label: "0–25% (Small array)"},
                                                        {value: "25-50", label: "25–50% (Supplementary)"},
                                                        {value: "50-75", label: "50–75% (Major source)"},
                                                        {value: "75-100", label: "75–100% (Almost self-reliant)"}
                                                    ]}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* STEP 3: Cooking */}
                            {activeStepData.id === 'cooking' && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div>
                                        <PremiumLabel text="Primary cooking fuel" icon={<Flame size={16}/>} />
                                        <PremiumSelect 
                                            name="cookingFuel" value={formData.cookingFuel} onChange={handleInput}
                                            options={[
                                                {value: 'lpg', label: 'LPG Cylinders'},
                                                {value: 'png', label: 'Piped Natural Gas (PNG)'},
                                                {value: 'electric', label: 'Electric Cooking / Induction'},
                                                {value: 'mixed', label: 'Mixed (Multiple types)'}
                                            ]}
                                        />
                                    </div>

                                    {(formData.cookingFuel === 'lpg' || formData.cookingFuel === 'mixed') && (
                                        <div className="animate-in fade-in duration-300">
                                            <PremiumLabel text="How many LPG cylinders per year?" />
                                            <PremiumRange name="lpgCylindersPerYear" min="0" max="24" step="1" value={formData.lpgCylindersPerYear} onChange={handleInput} unit="cylinders" />
                                        </div>
                                    )}

                                    {(formData.cookingFuel === 'png' || formData.cookingFuel === 'mixed') && (
                                        <div className="animate-in fade-in duration-300">
                                            <PremiumLabel text="Average monthly PNG bill" />
                                            <PremiumRange name="pngBillPerMonth" min="0" max="5000" step="100" value={formData.pngBillPerMonth} onChange={handleInput} unit="₹" />
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* STEP 4: Transport */}
                            {activeStepData.id === 'transport' && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex justify-between items-center bg-[#0d1218]/50 p-4 sm:p-5 rounded-xl border border-white/5">
                                        <span className="text-[14px] sm:text-[15px] font-sans text-white/80">
                                            Household Vehicles ({formData.vehicles.length})
                                        </span>
                                        <button 
                                            onClick={addVehicle}
                                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[11px] font-mono text-white/80 uppercase tracking-widest transition-colors cursor-pointer"
                                        >
                                            <Plus size={14} /> Add
                                        </button>
                                    </div>

                                    {formData.vehicles.length === 0 ? (
                                        <div className="text-center p-8 bg-white/[0.02] border border-dashed border-white/10 rounded-xl text-white/40 text-[14px] font-sans">
                                            No personal vehicles. Generating zero private transport emissions.
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {formData.vehicles.map((v, i) => (
                                                <div key={v.id} className="relative p-5 sm:p-6 bg-[#0d1218] border border-white/10 rounded-xl">
                                                    <button 
                                                        onClick={() => removeVehicle(v.id)}
                                                        className="absolute top-4 right-4 text-white/30 hover:text-[#f85149] transition-colors p-1 cursor-pointer"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                    <div className="text-[10px] uppercase font-mono tracking-widest text-[#F4A261] mb-5">Vehicle {i + 1}</div>
                                                    
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                                                        <div>
                                                            <div className="text-[11px] font-mono text-white/40 uppercase tracking-widest mb-2">Fuel / Type</div>
                                                            <PremiumSelect 
                                                                name={`v-${v.id}`} value={v.type} onChange={(e) => updateVehicle(v.id, 'type', e.target.value)}
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
                                                            <input type="number" value={v.kmPerWeek} onChange={(e) => updateVehicle(v.id, 'kmPerWeek', e.target.value)} className="w-full bg-[#080C10] text-[15px] font-mono text-white/90 border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-[#F4A261]/50" />
                                                        </div>
                                                        <div>
                                                            <div className="text-[11px] font-mono text-white/40 uppercase tracking-widest mb-2">Efficiency (km/L)</div>
                                                            <input type="number" value={v.efficiency} onChange={(e) => updateVehicle(v.id, 'efficiency', e.target.value)} className="w-full bg-[#080C10] text-[15px] font-mono text-white/90 border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-[#F4A261]/50" />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* STEP 5: Flights */}
                            {activeStepData.id === 'flights' && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div>
                                        <PremiumLabel text="Short-distance flights/year" subtext="Less than 1,500 km (e.g., Domestic)" icon={<Plane size={16}/>} />
                                        <PremiumRange name="shortFlightsPerYear" min="0" max="50" step="1" value={formData.shortFlightsPerYear} onChange={handleInput} unit="trips" />
                                    </div>
                                    <div>
                                        <PremiumLabel text="Medium-distance flights/year" subtext="1,500–4,000 km (e.g., Continental)" />
                                        <PremiumRange name="mediumFlightsPerYear" min="0" max="20" step="1" value={formData.mediumFlightsPerYear} onChange={handleInput} unit="trips" />
                                    </div>
                                    <div>
                                        <PremiumLabel text="Long-distance flights/year" subtext="More than 4,000 km (e.g., Intercontinental)" />
                                        <PremiumRange name="longFlightsPerYear" min="0" max="20" step="1" value={formData.longFlightsPerYear} onChange={handleInput} unit="trips" />
                                    </div>
                                </div>
                            )}

                            {/* STEP 6: Food */}
                            {activeStepData.id === 'food' && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div>
                                        <PremiumLabel text="Which best describes your diet?" icon={<Utensils size={16}/>} />
                                        <PremiumSelect 
                                            name="dietType" value={formData.dietType} onChange={handleInput}
                                            options={[
                                                {value: 'vegetarian', label: 'Vegetarian'},
                                                {value: 'eggitarian', label: 'Eggitarian'},
                                                {value: 'mixed', label: 'Mixed Diet (Average meat)'},
                                                {value: 'nonVegetarian', label: 'Regular Non-Vegetarian'},
                                                {value: 'highMeat', label: 'High Red-Meat Consumption'}
                                            ]}
                                        />
                                    </div>
                                    <div>
                                        <PremiumLabel text="Dairy consumption frequency" />
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {['rarely', 'moderate', 'high'].map(t => (
                                                <PremiumRadioCard 
                                                    key={t} active={formData.dairyFrequency === t} 
                                                    onClick={() => handleInput({ target: { name: 'dairyFrequency', value: t, type: 'radio' }})}
                                                    title={<span className="capitalize">{t}</span>}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div>
                                        <PremiumLabel text="Eating out frequency" />
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                            {[
                                                {id: 'rarely', label: 'Rarely'}, 
                                                {id: 'weekly', label: 'Weekly'}, 
                                                {id: 'multiple', label: 'Multiple / week'}
                                            ].map(t => (
                                                <PremiumRadioCard 
                                                    key={t.id} active={formData.eatingOut === t.id} 
                                                    onClick={() => handleInput({ target: { name: 'eatingOut', value: t.id, type: 'radio' }})}
                                                    title={t.label} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* STEP 7: Spending */}
                            {activeStepData.id === 'spending' && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div>
                                        <PremiumLabel text="Monthly spending on goods" subtext="Includes clothing, electronics, household items. Excludes rent/food." icon={<ShoppingBag size={16}/>} />
                                        <PremiumRange name="shoppingSpendPerMonth" min="0" max="300000" step="1000" value={formData.shoppingSpendPerMonth} onChange={handleInput} unit="₹" />
                                    </div>
                                </div>
                            )}

                            {/* STEP 8: Purchases */}
                            {activeStepData.id === 'purchases' && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="text-[13px] text-[#F4A261]/80 font-mono tracking-wide py-3 px-4 bg-[#F4A261]/5 border border-[#F4A261]/20 rounded-lg">
                                        Major purchases contain significant embedded manufacturing emissions.
                                    </div>
                                    <div>
                                        <PremiumLabel text="Smartphones purchased per year" icon={<Smartphone size={16}/>} />
                                        <PremiumRange name="smartphonesPerYear" min="0" max="10" step="1" value={formData.smartphonesPerYear} onChange={handleInput} />
                                    </div>
                                    <div>
                                        <PremiumLabel text="Laptops / tablets purchased per year" />
                                        <PremiumRange name="laptopsPerYear" min="0" max="5" step="1" value={formData.laptopsPerYear} onChange={handleInput} />
                                    </div>
                                    <div>
                                        <PremiumLabel text="Large appliances (AC, Fridge) per year" />
                                        <PremiumRange name="appliancesPerYear" min="0" max="10" step="1" value={formData.appliancesPerYear} onChange={handleInput} />
                                    </div>
                                    <div>
                                        <PremiumLabel text="Furniture pieces purchased per year" />
                                        <PremiumRange name="furniturePerYear" min="0" max="20" step="1" value={formData.furniturePerYear} onChange={handleInput} />
                                    </div>
                                </div>
                            )}

                            {/* STEP 9: Waste */}
                            {activeStepData.id === 'waste' && (
                                <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div>
                                        <PremiumLabel text="Garbage bags generated per week" icon={<Trash2 size={16}/>} />
                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                {id: '1-2', label: '1–2 bags'}, 
                                                {id: '3-4', label: '3–4 bags'}, 
                                                {id: '5-6', label: '5–6 bags'},
                                                {id: 'more', label: 'More than 6'}
                                            ].map(t => (
                                                <PremiumRadioCard 
                                                    key={t.id} active={formData.wasteBags === t.id} 
                                                    onClick={() => handleInput({ target: { name: 'wasteBags', value: t.id, type: 'radio' }})}
                                                    title={t.label} 
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <PremiumToggle 
                                            checked={formData.recycles} 
                                            onChange={() => handleInput({ target: { name: 'recycles', type: 'checkbox', checked: !formData.recycles }})}
                                            label="I separate recyclable waste"
                                            subtext="Plastic, paper, glass, metal"
                                        />
                                        <PremiumToggle 
                                            checked={formData.composts} 
                                            onChange={() => handleInput({ target: { name: 'composts', type: 'checkbox', checked: !formData.composts }})}
                                            label="I compost food waste"
                                            subtext="Organic home composting"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* STEP 10: Lifestyle */}
                            {activeStepData.id === 'lifestyle' && (
                                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <PremiumLabel text="Lifestyle Adjustments" icon={<HeartPulse size={16}/>} />
                                    <PremiumToggle 
                                        checked={formData.useAC} 
                                        onChange={() => handleInput({ target: { name: 'useAC', type: 'checkbox', checked: !formData.useAC }})}
                                        label="Regularly use Air Conditioning at home"
                                    />
                                    <PremiumToggle 
                                        checked={formData.workFromHome} 
                                        onChange={() => handleInput({ target: { name: 'workFromHome', type: 'checkbox', checked: !formData.workFromHome }})}
                                        label="Work from home frequently"
                                    />
                                    <PremiumToggle 
                                        checked={formData.usePublicTransport} 
                                        onChange={() => handleInput({ target: { name: 'usePublicTransport', type: 'checkbox', checked: !formData.usePublicTransport }})}
                                        label="Regularly use public transport"
                                    />
                                </div>
                            )}

                        </div>

                        {/* Navigation Footer */}
                        <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/5">
                            <button 
                                onClick={prevStep} disabled={currentStep === 0}
                                className={`flex items-center gap-2 px-6 py-3.5 border border-white/10 rounded-lg text-[12px] font-mono text-white/50 uppercase tracking-widest transition-colors cursor-pointer ${currentStep === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/5 hover:text-white/90'}`}
                            >
                                <ChevronLeft size={16} /> Back
                            </button>
                            <button 
                                onClick={nextStep} 
                                className="group relative inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-lg border text-[12px] font-mono uppercase tracking-[0.14em] transition-all duration-400 overflow-hidden cursor-pointer"
                                style={{ borderColor: 'rgba(244,162,97,0.4)', color: '#fff', background: 'rgba(244,162,97,0.1)' }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-[#F4A261]/0 via-[#F4A261]/20 to-[#F4A261]/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                <span className="relative z-10 flex items-center gap-3">
                                    {currentStep === STEPS.length - 2 ? 'See Results' : 'Next'} 
                                    {currentStep !== STEPS.length - 2 && <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                                </span>
                            </button>
                        </div>
                    </div>
                ) : (
                    // --- RESULTS DASHBOARD ---
                    <div className="animate-in slide-in-from-bottom-8 fade-in duration-700">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-6 mb-12">
                            <div>
                                <h2 className="text-[11px] font-mono text-white/40 uppercase tracking-[0.15em] mb-4">Your Carbon Footprint</h2>
                                <div className="flex items-baseline gap-3">
                                    <span className="text-[64px] sm:text-[80px] font-light leading-none tracking-tighter" style={{ color: getIntensityColor(emissions.annualTonnes.perCapita) }}>
                                        {emissions.annualTonnes.perCapita.toFixed(2)}
                                    </span>
                                    <span className="text-[18px] sm:text-[22px] text-white/40 font-mono tracking-widest">t CO₂e</span>
                                </div>
                                <div className="text-white/30 text-[13px] font-mono mt-3">Per capita (Household of {formData.householdSize})</div>
                            </div>
                            <button 
                                onClick={() => setCurrentStep(0)} 
                                className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-[11px] font-mono text-white/60 uppercase tracking-widest transition-colors w-full sm:w-auto cursor-pointer"
                            >
                                Recalculate
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                            
                            {/* Left Column: Context & Global Comparison */}
                            <div className="space-y-6 sm:space-y-8">
                                <div className="bg-[#0d1218]/80 p-6 sm:p-8 rounded-2xl border border-white/5">
                                    <h3 className="flex items-center gap-2 text-[15px] text-white/90 font-sans mb-8"><Globe size={16} className="text-[#4EA8DE]"/> Global Comparison</h3>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <div className="flex justify-between text-[13px] text-white/40 font-mono mb-2">
                                                <span>India Average</span><span>{emissions.context.indiaAverage.toFixed(1)} t</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#3fb950]" style={{ width: `${Math.min((emissions.context.indiaAverage / 10) * 100, 100)}%` }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-[13px] text-white/40 font-mono mb-2">
                                                <span>Global Average</span><span>{emissions.context.globalAverage.toFixed(1)} t</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-[#F4A261]" style={{ width: `${Math.min((emissions.context.globalAverage / 10) * 100, 100)}%` }} />
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between text-[13px] text-white/90 font-mono mb-2">
                                                <span>Your Footprint</span><span>{emissions.annualTonnes.perCapita.toFixed(2)} t</span>
                                            </div>
                                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full" style={{ backgroundColor: getIntensityColor(emissions.annualTonnes.perCapita), width: `${Math.min((emissions.annualTonnes.perCapita / 10) * 100, 100)}%` }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-[#4EA8DE]/5 p-6 sm:p-8 rounded-2xl border border-[#4EA8DE]/20">
                                    <h3 className="text-[13px] text-[#4EA8DE]/80 font-mono uppercase tracking-widest mb-6">This is equivalent to:</h3>
                                    <ul className="space-y-5 text-[14px] sm:text-[15px] font-sans text-white/70">
                                        <li className="flex gap-4"><Car size={18} className="text-[#4EA8DE] shrink-0" /> <span>Driving <strong className="text-white">{emissions.context.drivingKm.toLocaleString()} km</strong> in a petrol car</span></li>
                                        <li className="flex gap-4"><Plane size={18} className="text-[#F4A261] shrink-0" /> <span><strong className="text-white">{emissions.context.delhiMumbaiFlights}</strong> return flights between Delhi and Mumbai</span></li>
                                        <li className="flex gap-4"><TreePine size={18} className="text-[#3fb950] shrink-0" /> <span>Requires <strong className="text-white">{emissions.context.trees.toLocaleString()} trees</strong> to offset annually</span></li>
                                    </ul>
                                </div>
                            </div>

                            {/* Right Column: Chart & Actionable Intel */}
                            <div className="space-y-6 sm:space-y-8">
                                <div className="bg-[#0d1218]/80 p-6 sm:p-8 rounded-2xl border border-white/5 flex flex-col items-center">
                                    <h3 className="w-full text-left text-[14px] font-sans text-white/90 mb-6">Impact Breakdown</h3>
                                    
                                    <div className="h-[240px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={emissions.chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={90}
                                                    paddingAngle={3} dataKey="value" stroke="none"
                                                >
                                                    {emissions.chartData.map((entry, i) => (
                                                        <Cell key={`cell-${i}`} fill={entry.fill} />
                                                    ))}
                                                </Pie>
                                                <Tooltip 
                                                    formatter={(val) => `${val.toFixed(2)} t CO₂e`}
                                                    contentStyle={{ backgroundColor: '#0d1218', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '13px', color: '#fff' }}
                                                    itemStyle={{ color: '#fff' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 w-full mt-4">
                                        {emissions.chartData.map((item) => (
                                            <div key={item.name} className="flex items-center gap-3 text-[13px] font-sans">
                                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                                                <span className="text-white/80 flex-grow">{item.name}</span>
                                                <span className="text-white/40 font-mono">{Math.round(item.percentage)}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-gradient-to-br from-[#3fb950]/10 to-transparent p-6 sm:p-8 rounded-2xl border border-[#3fb950]/20">
                                    <h3 className="flex items-center gap-2 text-[14px] font-sans text-[#3fb950] mb-6"><Lightbulb size={16}/> Reduction Pathways</h3>
                                    <ul className="space-y-4 text-[14px] font-sans text-white/80">
                                        {emissions.percentages.energy > 15 && (
                                            <li className="flex justify-between items-start gap-4">
                                                <span>Switch to renewable electricity or solar</span>
                                                <span className="text-[#3fb950] font-mono shrink-0">-{((emissions.annualTonnes.energy) * 0.8).toFixed(1)} t</span>
                                            </li>
                                        )}
                                        {emissions.percentages.food > 15 && formData.dietType !== 'vegetarian' && (
                                            <li className="flex justify-between items-start gap-4">
                                                <span>Adopt a plant-forward vegetarian diet</span>
                                                <span className="text-[#3fb950] font-mono shrink-0">-{((emissions.annualTonnes.food) * 0.4).toFixed(1)} t</span>
                                            </li>
                                        )}
                                        {emissions.percentages.flights > 10 && (
                                            <li className="flex justify-between items-start gap-4">
                                                <span>Reduce annual flights by half</span>
                                                <span className="text-[#3fb950] font-mono shrink-0">-{((emissions.annualTonnes.flights) * 0.5).toFixed(1)} t</span>
                                            </li>
                                        )}
                                        {emissions.percentages.transportation > 15 && (
                                            <li className="flex justify-between items-start gap-4">
                                                <span>Use public transport twice a week</span>
                                                <span className="text-[#3fb950] font-mono shrink-0">-{((emissions.annualTonnes.transportation) * 0.3).toFixed(1)} t</span>
                                            </li>
                                        )}
                                        <li className="flex justify-between items-start gap-4">
                                            <span>Compost organic waste at home</span>
                                            <span className="text-[#3fb950] font-mono shrink-0">-{((emissions.annualTonnes.waste) * 0.3).toFixed(1)} t</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Share Block */}
                        <div className="mt-8 p-6 sm:p-8 bg-white/[0.02] rounded-2xl border border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
                            <div>
                                <h3 className="text-[15px] font-sans text-white/90 mb-1">Share your footprint</h3>
                                <p className="text-[13px] font-sans text-white/40">Inspire others to measure and decrease their impact.</p>
                            </div>
                            <button className="flex items-center justify-center gap-3 px-6 py-3 bg-[#0d1218] border border-white/10 text-white/80 rounded-lg text-[11px] font-mono uppercase tracking-widest hover:bg-white/5 transition-colors w-full sm:w-auto cursor-pointer">
                                <Share2 size={16} /> Share Result
                            </button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default HouseholdCalculator;
