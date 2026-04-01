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
    { id: 'household', title: 'Household Info', icon: <Home size={18} /> },
    { id: 'electricity', title: 'Electricity', icon: <Zap size={18} /> },
    { id: 'cooking', title: 'Cooking Fuel', icon: <Flame size={18} /> },
    { id: 'transport', title: 'Transport', icon: <Car size={18} /> },
    { id: 'flights', title: 'Air Travel', icon: <Plane size={18} /> },
    { id: 'food', title: 'Food', icon: <Utensils size={18} /> },
    { id: 'spending', title: 'Spending', icon: <ShoppingBag size={18} /> },
    { id: 'purchases', title: 'Major Purchases', icon: <Smartphone size={18} /> },
    { id: 'waste', title: 'Waste', icon: <Trash2 size={18} /> },
    { id: 'lifestyle', title: 'Lifestyle', icon: <HeartPulse size={18} /> },
    { id: 'results', title: 'Results', icon: <Activity size={18} /> }
];

const HouseholdCalculator = ({ onBack }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState({
        // 1. Household
        householdSize: 1,
        homeType: 'apartment', // apartment, independent, shared
        
        // 2. Electricity
        electricityBillPerMonth: 2000,
        hasSolar: false,
        solarPercentage: '0-25', // 0-25, 25-50, 50-75, 75-100
        
        // 3. Cooking
        cookingFuel: 'lpg', // lpg, png, electric, mixed
        lpgCylindersPerYear: 6,
        pngBillPerMonth: 500,
        
        // 4. Transport (Array of vehicles)
        vehicles: [],
        
        // 5. Flights
        shortFlightsPerYear: 0,
        mediumFlightsPerYear: 0,
        longFlightsPerYear: 0,
        
        // 6. Food
        dietType: 'mixed', // vegetarian, eggitarian, mixed, nonVegetarian, highMeat
        dairyFrequency: 'moderate', // rarely, moderate, high
        eatingOut: 'rarely', // rarely, weekly, multiple
        
        // 7. Spending
        shoppingSpendPerMonth: 10000,
        
        // 8. Major Purchases
        smartphonesPerYear: 0,
        laptopsPerYear: 0,
        appliancesPerYear: 0,
        furniturePerYear: 0,
        
        // 9. Waste
        wasteBags: '3-4', // 1-2, 3-4, 5-6, more
        recycles: true,
        composts: false,
        
        // 10. Lifestyle
        useAC: true,
        workFromHome: false,
        usePublicTransport: false
    });

    const handleInput = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'radio' || isNaN(value) ? value : parseFloat(value) || 0)
        }));
    };

    const addVehicle = () => {
        setFormData(prev => ({
            ...prev,
            vehicles: [...prev.vehicles, { id: Date.now(), type: 'petrol', kmPerWeek: 100, efficiency: 15 }]
        }));
    };

    const removeVehicle = (id) => {
        setFormData(prev => ({
            ...prev,
            vehicles: prev.vehicles.filter(v => v.id !== id)
        }));
    };

    const updateVehicle = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            vehicles: prev.vehicles.map(v => v.id === id ? { ...v, [field]: isNaN(value) ? value : parseFloat(value) || 0 } : v)
        }));
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const emissions = calculateEmissions(formData);

    const getIntensityColor = (score) => {
        if (score < 2.5) return 'var(--success)';
        if (score < 4.5) return 'var(--warning)';
        return 'var(--danger)';
    };

    const isResults = currentStep === STEPS.length - 1;
    const activeStepData = STEPS[currentStep];

    return (
        <div className="container" style={{ maxWidth: isResults ? '1000px' : '650px', margin: '0 auto', transition: 'max-width 0.3s ease' }}>
            <button onClick={onBack} style={{ marginBottom: '0.75rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ChevronLeft size={16} /> Back to Selection
            </button>
            <header className="header" style={{ marginBottom: isResults ? '2rem' : '1.5rem' }}>
                <h1>Carbon Footprint Calculator</h1>
                {!isResults && <p>Measure, understand, and reduce your environmental impact.</p>}
            </header>

            {!isResults && (
                <div style={{ marginBottom: 'clamp(1rem, 4vw, 2rem)', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                        <span>Step {currentStep + 1} of {STEPS.length - 1}</span>
                        <span>{activeStepData.title}</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--card-border)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ 
                            width: `${((currentStep + 1) / (STEPS.length - 1)) * 100}%`, 
                            height: '100%', 
                            background: 'var(--accent-primary)',
                            transition: 'width 0.3s ease'
                        }}></div>
                    </div>
                </div>
            )}

            <main className="glass-panel" style={{ padding: 'clamp(1.2rem, 4vw, 2rem)' }}>
                {!isResults ? (
                    <div className="form-content" style={{ minHeight: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 'clamp(1rem, 4vw, 2rem)', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '600' }}>
                            {activeStepData.icon} <h2>{activeStepData.title}</h2>
                        </div>

                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 4vw, 2rem)' }}>
                            
                            {/* STEP 1: Household */}
                            {activeStepData.id === 'household' && (
                                <>
                                    <div className="form-group">
                                        <label><Users size={16} /> How many people live in your household?</label>
                                        <div className="range-wrap">
                                            <input type="range" name="householdSize" min="1" max="10" step="1" value={formData.householdSize} onChange={handleInput} />
                                            <input type="number" name="householdSize" className="number-input" value={formData.householdSize} onChange={handleInput} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>What type of home do you live in?</label>
                                        <div className="radio-group" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                            {['apartment', 'independent', 'shared'].map(type => (
                                                <label key={type} className={`radio-btn ${formData.homeType === type ? 'active' : ''}`}>
                                                    <input type="radio" name="homeType" value={type} checked={formData.homeType === type} onChange={handleInput} />
                                                    <span style={{ textTransform: 'capitalize' }}>{type === 'independent' ? 'Independent House' : type}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* STEP 2: Electricity */}
                            {activeStepData.id === 'electricity' && (
                                <>
                                    <div className="form-group">
                                        <label>Average monthly electricity bill (₹)</label>
                                        <div className="range-wrap">
                                            <input type="range" name="electricityBillPerMonth" min="0" max="25000" step="500" value={formData.electricityBillPerMonth} onChange={handleInput} />
                                            <input type="number" name="electricityBillPerMonth" className="number-input" value={formData.electricityBillPerMonth} onChange={handleInput} style={{ width: '80px' }} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                            <input type="checkbox" name="hasSolar" checked={formData.hasSolar} onChange={handleInput} style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }} />
                                            Do you have rooftop solar installed?
                                        </label>
                                    </div>
                                    {formData.hasSolar && (
                                        <div className="form-group" style={{ paddingLeft: '1.5rem', borderLeft: '2px solid var(--accent-primary)' }}>
                                            <label>Approx. percentage of electricity from solar?</label>
                                            <select name="solarPercentage" value={formData.solarPercentage} onChange={handleInput} style={{ padding: '0.6rem', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', border: '1px solid var(--card-border)', borderRadius: '8px', outline: 'none', marginTop: '0.5rem', width: '100%', fontFamily: 'inherit' }}>
                                                <option value="0-25">0–25% (Small array)</option>
                                                <option value="25-50">25–50% (Supplementary)</option>
                                                <option value="50-75">50–75% (Major source)</option>
                                                <option value="75-100">75–100% (Almost self-reliant)</option>
                                            </select>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* STEP 3: Cooking */}
                            {activeStepData.id === 'cooking' && (
                                <>
                                    <div className="form-group">
                                        <label>Primary cooking fuel</label>
                                        <select name="cookingFuel" value={formData.cookingFuel} onChange={handleInput} style={{ padding: '0.6rem', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', border: '1px solid var(--card-border)', borderRadius: '8px', outline: 'none', marginTop: '0.5rem', width: '100%', fontFamily: 'inherit' }}>
                                            <option value="lpg">LPG Cylinders</option>
                                            <option value="png">Piped Natural Gas (PNG)</option>
                                            <option value="electric">Electric Cooking / Induction</option>
                                            <option value="mixed">Mixed (Multiple types)</option>
                                        </select>
                                    </div>
                                    
                                    {(formData.cookingFuel === 'lpg' || formData.cookingFuel === 'mixed') && (
                                        <div className="form-group">
                                            <label>How many LPG cylinders per year?</label>
                                            <div className="range-wrap">
                                                <input type="range" name="lpgCylindersPerYear" min="0" max="24" step="1" value={formData.lpgCylindersPerYear} onChange={handleInput} />
                                                <input type="number" name="lpgCylindersPerYear" className="number-input" value={formData.lpgCylindersPerYear} onChange={handleInput} />
                                            </div>
                                        </div>
                                    )}
                                    
                                    {(formData.cookingFuel === 'png' || formData.cookingFuel === 'mixed') && (
                                        <div className="form-group">
                                            <label>Average monthly PNG bill (₹)</label>
                                            <div className="range-wrap">
                                                <input type="range" name="pngBillPerMonth" min="0" max="5000" step="100" value={formData.pngBillPerMonth} onChange={handleInput} />
                                                <input type="number" name="pngBillPerMonth" className="number-input" value={formData.pngBillPerMonth} onChange={handleInput} style={{ width: '80px' }} />
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* STEP 4: Transport */}
                            {activeStepData.id === 'transport' && (
                                <>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <label>Household Vehicles ({formData.vehicles.length})</label>
                                        <button onClick={addVehicle} style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', border: '1px solid var(--card-border)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Plus size={14} /> Add Vehicle
                                        </button>
                                    </div>

                                    {formData.vehicles.length === 0 ? (
                                        <div style={{ padding: 'clamp(1.2rem, 4vw, 2rem)', textAlign: 'center', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', border: '1px dashed var(--card-border)', color: 'var(--text-secondary)' }}>
                                            No personal vehicles. Generating zero transport emissions.
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {formData.vehicles.map((v, index) => (
                                                <div key={v.id} style={{ padding: 'clamp(1rem, 3vw, 1.5rem)', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative' }}>
                                                    <button onClick={() => removeVehicle(v.id)} style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.5rem' }}>
                                                        <X size={16} />
                                                    </button>
                                                    <div style={{ marginBottom: '0.75rem', fontWeight: '500', color: 'var(--accent-primary)' }}>Vehicle {index + 1}</div>
                                                    
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem' }}>
                                                        <select value={v.type} onChange={(e) => updateVehicle(v.id, 'type', e.target.value)} style={{ padding: '0.6rem', background: 'rgba(0,0,0,0.4)', color: 'var(--text-primary)', border: '1px solid var(--card-border)', borderRadius: '6px', outline: 'none', width: '100%' }}>
                                                            <option value="petrol">Petrol Car</option>
                                                            <option value="diesel">Diesel Car</option>
                                                            <option value="cng">CNG Car</option>
                                                            <option value="electric">Electric Car</option>
                                                            <option value="twoWheeler">Two-Wheeler</option>
                                                        </select>
                                                        
                                                        <div>
                                                            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>km driven per week</label>
                                                            <input type="number" value={v.kmPerWeek} onChange={(e) => updateVehicle(v.id, 'kmPerWeek', e.target.value)} style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.4)', color: 'var(--text-primary)', border: '1px solid var(--card-border)', borderRadius: '6px', width: '100%', outline: 'none', marginTop: '0.25rem' }} />
                                                        </div>

                                                        <div>
                                                            <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Efficiency (km/L or km/kg)</label>
                                                            <input type="number" value={v.efficiency} onChange={(e) => updateVehicle(v.id, 'efficiency', e.target.value)} style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.4)', color: 'var(--text-primary)', border: '1px solid var(--card-border)', borderRadius: '6px', width: '100%', outline: 'none', marginTop: '0.25rem' }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* STEP 5: Flights */}
                            {activeStepData.id === 'flights' && (
                                <>
                                    <div className="form-group">
                                        <label>Short-distance flights/year</label>
                                        <div className="range-wrap">
                                            <input type="range" name="shortFlightsPerYear" min="0" max="50" step="1" value={formData.shortFlightsPerYear} onChange={handleInput} />
                                            <input type="number" name="shortFlightsPerYear" className="number-input" value={formData.shortFlightsPerYear} onChange={handleInput} />
                                        </div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Less than 1,500 km (e.g. Domestic)</span>
                                    </div>
                                    <div className="form-group">
                                        <label>Medium-distance flights/year</label>
                                        <div className="range-wrap">
                                            <input type="range" name="mediumFlightsPerYear" min="0" max="20" step="1" value={formData.mediumFlightsPerYear} onChange={handleInput} />
                                            <input type="number" name="mediumFlightsPerYear" className="number-input" value={formData.mediumFlightsPerYear} onChange={handleInput} />
                                        </div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>1,500–4,000 km (e.g. Continental)</span>
                                    </div>
                                    <div className="form-group">
                                        <label>Long-distance flights/year</label>
                                        <div className="range-wrap">
                                            <input type="range" name="longFlightsPerYear" min="0" max="20" step="1" value={formData.longFlightsPerYear} onChange={handleInput} />
                                            <input type="number" name="longFlightsPerYear" className="number-input" value={formData.longFlightsPerYear} onChange={handleInput} />
                                        </div>
                                        <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>More than 4,000 km (e.g. Intercontinental)</span>
                                    </div>
                                </>
                            )}

                            {/* STEP 6: Food */}
                            {activeStepData.id === 'food' && (
                                <>
                                    <div className="form-group">
                                        <label>Which best describes your diet?</label>
                                        <select name="dietType" value={formData.dietType} onChange={handleInput} style={{ padding: '0.6rem', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', border: '1px solid var(--card-border)', borderRadius: '8px', outline: 'none', width: '100%', marginTop: '0.5rem', fontFamily: 'inherit' }}>
                                            <option value="vegetarian">Vegetarian</option>
                                            <option value="eggitarian">Eggitarian</option>
                                            <option value="mixed">Mixed Diet (Average meat)</option>
                                            <option value="nonVegetarian">Regular Non-Vegetarian (Frequent meat)</option>
                                            <option value="highMeat">High Red-Meat Consumption</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Dairy consumption frequency</label>
                                        <div className="radio-group" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                            {['rarely', 'moderate', 'high'].map(type => (
                                                <label key={type} className={`radio-btn ${formData.dairyFrequency === type ? 'active' : ''}`}>
                                                    <input type="radio" name="dairyFrequency" value={type} checked={formData.dairyFrequency === type} onChange={handleInput} />
                                                    <span style={{ textTransform: 'capitalize' }}>{type}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Eating out frequency</label>
                                        <div className="radio-group" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                                            {[
                                                {id: 'rarely', label: 'Rarely'}, 
                                                {id: 'weekly', label: 'Weekly'}, 
                                                {id: 'multiple', label: 'Multiple times per week'}
                                            ].map(type => (
                                                <label key={type.id} className={`radio-btn ${formData.eatingOut === type.id ? 'active' : ''}`}>
                                                    <input type="radio" name="eatingOut" value={type.id} checked={formData.eatingOut === type.id} onChange={handleInput} />
                                                    <span>{type.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* STEP 7: Spending */}
                            {activeStepData.id === 'spending' && (
                                <>
                                    <div className="form-group">
                                        <label>Monthly spending on goods (₹)</label>
                                        <div className="range-wrap">
                                            <input type="range" name="shoppingSpendPerMonth" min="0" max="300000" step="1000" value={formData.shoppingSpendPerMonth} onChange={handleInput} />
                                            <input type="number" name="shoppingSpendPerMonth" className="number-input" value={formData.shoppingSpendPerMonth} onChange={handleInput} style={{ width: '80px' }} />
                                        </div>
                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginTop: '0.5rem' }}>
                                            Includes clothing, electronics, household items, personal goods. (Do not include rent or food).
                                        </span>
                                    </div>
                                </>
                            )}

                            {/* STEP 8: Purchases */}
                            {activeStepData.id === 'purchases' && (
                                <>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Major purchases have significant manufacturing "embedded" emissions.</p>
                                    <div className="form-group">
                                        <label>Smartphones purchased per year</label>
                                        <div className="range-wrap">
                                            <input type="range" name="smartphonesPerYear" min="0" max="10" step="1" value={formData.smartphonesPerYear} onChange={handleInput} />
                                            <input type="number" name="smartphonesPerYear" className="number-input" value={formData.smartphonesPerYear} onChange={handleInput} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Laptops / tablets purchased per year</label>
                                        <div className="range-wrap">
                                            <input type="range" name="laptopsPerYear" min="0" max="5" step="1" value={formData.laptopsPerYear} onChange={handleInput} />
                                            <input type="number" name="laptopsPerYear" className="number-input" value={formData.laptopsPerYear} onChange={handleInput} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Large appliances purchased per year (AC, Fridge, Washer)</label>
                                        <div className="range-wrap">
                                            <input type="range" name="appliancesPerYear" min="0" max="10" step="1" value={formData.appliancesPerYear} onChange={handleInput} />
                                            <input type="number" name="appliancesPerYear" className="number-input" value={formData.appliancesPerYear} onChange={handleInput} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Furniture pieces purchased per year (Beds, Sofas, Tables)</label>
                                        <div className="range-wrap">
                                            <input type="range" name="furniturePerYear" min="0" max="20" step="1" value={formData.furniturePerYear} onChange={handleInput} />
                                            <input type="number" name="furniturePerYear" className="number-input" value={formData.furniturePerYear} onChange={handleInput} />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* STEP 9: Waste */}
                            {activeStepData.id === 'waste' && (
                                <>
                                    <div className="form-group">
                                        <label>Garbage bags generated per week</label>
                                        <div className="radio-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '0.5rem' }}>
                                            {[
                                                {id: '1-2', label: '1–2 bags'}, 
                                                {id: '3-4', label: '3–4 bags'}, 
                                                {id: '5-6', label: '5–6 bags'},
                                                {id: 'more', label: 'More than 6'}
                                            ].map(type => (
                                                <label key={type.id} className={`radio-btn ${formData.wasteBags === type.id ? 'active' : ''}`}>
                                                    <input type="radio" name="wasteBags" value={type.id} checked={formData.wasteBags === type.id} onChange={handleInput} />
                                                    <span>{type.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ gap: '0.75rem', marginTop: '0.75rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--card-border)', borderRadius: '8px' }}>
                                            <input type="checkbox" name="recycles" checked={formData.recycles} onChange={handleInput} style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }} />
                                            <div>
                                                <div style={{ fontWeight: '500' }}>I separate recyclable waste</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Plastic, paper, glass, metal</div>
                                            </div>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--card-border)', borderRadius: '8px' }}>
                                            <input type="checkbox" name="composts" checked={formData.composts} onChange={handleInput} style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }} />
                                            <div>
                                                <div style={{ fontWeight: '500' }}>I compost food waste</div>
                                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Organic home composting</div>
                                            </div>
                                        </label>
                                    </div>
                                </>
                            )}

                            {/* STEP 10: Lifestyle */}
                            {activeStepData.id === 'lifestyle' && (
                                <>
                                    <div className="form-group" style={{ gap: '0.75rem' }}>
                                        <label style={{ display: 'flex', justifyItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--card-border)', borderRadius: '8px' }}>
                                            <input type="checkbox" name="useAC" checked={formData.useAC} onChange={handleInput} style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }} />
                                            <div style={{ fontWeight: '500' }}>Regularly use Air Conditioning at home</div>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--card-border)', borderRadius: '8px' }}>
                                            <input type="checkbox" name="workFromHome" checked={formData.workFromHome} onChange={handleInput} style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }} />
                                            <div style={{ fontWeight: '500' }}>Work from home frequently</div>
                                        </label>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.75rem', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--card-border)', borderRadius: '8px' }}>
                                            <input type="checkbox" name="usePublicTransport" checked={formData.usePublicTransport} onChange={handleInput} style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }} />
                                            <div style={{ fontWeight: '500' }}>Regularly use public transport</div>
                                        </label>
                                    </div>
                                </>
                            )}

                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'clamp(1rem, 4vw, 2rem)', paddingTop: '1.5rem', borderTop: '1px solid var(--card-border)' }}>
                            <button 
                                onClick={prevStep} 
                                disabled={currentStep === 0}
                                style={{ 
                                    padding: '0.6rem 1.2rem', 
                                    background: 'transparent', 
                                    border: '1px solid var(--card-border)', 
                                    color: 'var(--text-primary)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: currentStep === 0 ? 'not-allowed' : 'pointer',
                                    opacity: currentStep === 0 ? 0.3 : 1
                                }}
                            >
                                <ChevronLeft size={16} /> Back
                            </button>
                            <button 
                                onClick={nextStep} 
                                style={{ 
                                    padding: '0.6rem 1.2rem', 
                                    background: 'var(--accent-primary)', 
                                    border: 'none', 
                                    color: '#fff',
                                    fontWeight: '600',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    cursor: 'pointer',
                                    boxShadow: '0 4px 12px var(--accent-glow)'
                                }}
                            >
                                {currentStep === STEPS.length - 2 ? 'See Results' : 'Next'} {currentStep !== STEPS.length - 2 && <ChevronRight size={16} />}
                            </button>
                        </div>
                    </div>
                ) : (
                    // --- RESULTS STEP ---
                    <div className="results-dashboard" style={{ animation: 'fadeInDown 0.8s ease-out' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'clamp(1rem, 4vw, 2rem)' }}>
                            <div>
                                <h2 style={{ fontSize: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>Your Carbon Footprint</h2>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                    <span style={{ fontSize: 'clamp(3rem, 8vw, 4.5rem)', fontWeight: '800', lineHeight: 1, color: getIntensityColor(emissions.annualTonnes.perCapita) }}>
                                        {emissions.annualTonnes.perCapita.toFixed(2)}
                                    </span>
                                    <span style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', fontWeight: '500' }}>t CO₂e / year</span>
                                </div>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>Per capita (Household of {formData.householdSize})</div>
                            </div>
                            <button onClick={() => setCurrentStep(0)} style={{ padding: '0.4rem 0.8rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '6px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                                Recalculate
                            </button>
                        </div>

                        <div className="results-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(1rem, 4vw, 2rem)' }}>
                            {/* Left Column */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 4vw, 2rem)' }}>
                                {/* Comparison Bar */}
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: 'clamp(1rem, 3vw, 1.5rem)', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                                    <h3 style={{ fontSize: '1rem', marginBottom: 'clamp(0.75rem, 3vw, 1.5rem)', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Globe size={18}/> Global Comparison</h3>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                                                <span>India Average</span>
                                                <span>{emissions.context.indiaAverage.toFixed(1)} t</span>
                                            </div>
                                            <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                                                <div style={{ width: `${Math.min((emissions.context.indiaAverage / 10) * 100, 100)}%`, height: '100%', background: 'var(--success)', borderRadius: '6px' }}></div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--text-secondary)' }}>
                                                <span>Global Average</span>
                                                <span>{emissions.context.globalAverage.toFixed(1)} t</span>
                                            </div>
                                            <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px' }}>
                                                <div style={{ width: `${Math.min((emissions.context.globalAverage / 10) * 100, 100)}%`, height: '100%', background: 'var(--warning)', borderRadius: '6px' }}></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                                                <span>Your Footprint</span>
                                                <span>{emissions.annualTonnes.perCapita.toFixed(2)} t</span>
                                            </div>
                                            <div style={{ width: '100%', height: '12px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', position: 'relative' }}>
                                                <div style={{ width: `${Math.min((emissions.annualTonnes.perCapita / 10) * 100, 100)}%`, height: '100%', background: getIntensityColor(emissions.annualTonnes.perCapita), borderRadius: '6px' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Context Block */}
                                <div style={{ background: 'rgba(88, 166, 255, 0.05)', padding: 'clamp(1rem, 3vw, 1.5rem)', borderRadius: '12px', border: '1px solid rgba(88, 166, 255, 0.2)' }}>
                                    <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>This is equivalent to:</h3>
                                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Car size={16} color="var(--transport-color)" /> Driving <strong>{emissions.context.drivingKm.toLocaleString()} km</strong> in a petrol car</li>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Plane size={16} color="var(--flights-color)" /> <strong>{emissions.context.delhiMumbaiFlights}</strong> return flights between Delhi and Mumbai</li>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><TreePine size={16} color="var(--success)" /> Requires <strong>{emissions.context.trees.toLocaleString()} trees</strong> to offset annually</li>
                                        <li style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}><Users size={16} color="var(--accent-primary)" /> <strong>{emissions.context.indiaMultiplier}×</strong> the average Indian footprint</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Right Column */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'clamp(1rem, 4vw, 2rem)' }}>
                                {/* Chart with percentages */}
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: 'clamp(1rem, 3vw, 1.5rem)', borderRadius: '12px', border: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                    <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', width: '100%', textAlign: 'left', marginBottom: '0.75rem' }}>Impact Breakdown</h3>
                                    
                                    <div style={{ height: '220px', width: '100%' }}>
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={emissions.chartData}
                                                    cx="50%" cy="50%"
                                                    innerRadius={60} outerRadius={80}
                                                    paddingAngle={2}
                                                    dataKey="value" stroke="none"
                                                >
                                                    {emissions.chartData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.fill} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value) => `${value.toFixed(2)} t CO₂e`}
                                                    contentStyle={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'var(--text-primary)' }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', width: '100%', marginTop: '0.75rem' }}>
                                        {emissions.chartData.map((item) => (
                                            <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: item.fill }}></div>
                                                <span style={{ color: 'var(--text-primary)', flexGrow: 1 }}>{item.name}</span>
                                                <span style={{ color: 'var(--text-secondary)' }}>{Math.round(item.percentage)}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div style={{ background: 'linear-gradient(135deg, rgba(63, 185, 80, 0.1) 0%, transparent 100%)', padding: 'clamp(1rem, 3vw, 1.5rem)', borderRadius: '12px', border: '1px solid rgba(63, 185, 80, 0.2)' }}>
                                    <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lightbulb size={18} color="var(--success)"/> How you can reduce emissions</h3>
                                    <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                                        {emissions.percentages.energy > 15 && (
                                            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                                                <span>Switch to renewable electricity or add more solar layout</span>
                                                <span style={{ color: 'var(--success)', fontWeight: '600', whiteSpace: 'nowrap' }}>-{((emissions.annualTonnes.energy) * 0.8).toFixed(1)} t</span>
                                            </li>
                                        )}
                                        {emissions.percentages.food > 15 && formData.dietType !== 'vegetarian' && (
                                            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                                                <span>Adopt a plant-forward vegetarian diet</span>
                                                <span style={{ color: 'var(--success)', fontWeight: '600', whiteSpace: 'nowrap' }}>-{((emissions.annualTonnes.food) * 0.4).toFixed(1)} t</span>
                                            </li>
                                        )}
                                        {emissions.percentages.flights > 10 && (
                                            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                                                <span>Reduce annual flights by half</span>
                                                <span style={{ color: 'var(--success)', fontWeight: '600', whiteSpace: 'nowrap' }}>-{((emissions.annualTonnes.flights) * 0.5).toFixed(1)} t</span>
                                            </li>
                                        )}
                                        {emissions.percentages.transportation > 15 && (
                                            <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                                                <span>Use public transport twice a week</span>
                                                <span style={{ color: 'var(--success)', fontWeight: '600', whiteSpace: 'nowrap' }}>-{((emissions.annualTonnes.transportation) * 0.3).toFixed(1)} t</span>
                                            </li>
                                        )}
                                        <li style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                                            <span>Compost organic waste at home</span>
                                            <span style={{ color: 'var(--success)', fontWeight: '600', whiteSpace: 'nowrap' }}>-{((emissions.annualTonnes.waste) * 0.3).toFixed(1)} t</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Share Block */}
                        <div style={{ marginTop: 'clamp(1rem, 4vw, 2rem)', padding: 'clamp(1rem, 3vw, 1.5rem)', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                            <div>
                                <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem' }}>Share your footprint</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Inspire others to measure and decrease their impact.</p>
                            </div>
                            <button style={{ padding: '0.6rem 1.2rem', background: 'var(--bg-color)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', transition: 'all 0.2s' }}>
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
