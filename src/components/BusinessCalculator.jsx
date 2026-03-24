import React, { useState } from 'react';
import { 
  Building2, Zap, Users, Truck, Flame, Plane, Trash2, Activity,
  ChevronRight, ChevronLeft, Plus, X, Globe, Lightbulb, Factory, Package, ShoppingBag, Briefcase,
  TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Leaf, Car, Home
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { calculateBusinessEmissions } from '../utils/calculations';
import '../index.css';

const BUSINESS_TYPES = [
    { id: 'office', label: 'Office / Professional Services' },
    { id: 'retail', label: 'Retail Shop' },
    { id: 'restaurant', label: 'Restaurant / Café / Food' },
    { id: 'workshop', label: 'Workshop / Manufacturing' },
    { id: 'logistics', label: 'Logistics / Delivery' },
    { id: 'home', label: 'Home-based Business' }
];

const BusinessCalculator = ({ onBack }) => {
    const [currentStep, setCurrentStep] = useState(0);
    
    // Massive State catching all precise revised metrics
    const [data, setData] = useState({
        businessType: '',
        
        // Scope 2 - Universal Power
        electricityBillPerMonth: 0,
        
        // --- 1. Office Specific
        acCount: 0,
        computerCount: 0,
        trainKmPerYear: 0,
        flightsKmPerYear: 0,
        spendOfficeSupplies: 0,
        // (Office, Retail, Rest, Work, Log) Commute
        employees: 0,
        avgCommuteKm: 0,
        commuteMode: 'mixed', // car, twowheeler, transit, mixed
        
        // --- 2. Retail Specific
        usesFridges: false,
        retailFridges: 0,
        spendResaleGoods: 0,
        usesDelivery: false,
        retailDeliveryFuel: 0,

        // --- 3. Restaurant Specific
        commercialLpgCylinders: 0,
        commercialFridges: 0,
        spendFoodSupply: 0,
        compostsWaste: 'no',

        // --- 4. Workshop Specific
        usesGenerator: false,
        dieselGeneratorLitres: 0,
        spendRawMaterials: 0,

        // --- 5. Logistics Specific
        logisticsVehicles: 0,
        logisticsFuelType: 'diesel', // petrol, diesel, cng
        logisticsFuelLitres: 0,

        // --- 6. Home Business Specific
        homeAddtlElectricity: 0,
        homeBusinessLpg: 0,
        spendPackaging: 0,

        // Universal Scope 3 Waste (except logistics)
        wasteBags: 0
    });

    const handleInput = (e) => {
        const { name, value, type, checked } = e.target;
        setData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'radio' || isNaN(value) ? value : parseFloat(value) || 0)
        }));
    };

    const handleSelect = (e) => {
        const { name, value } = e.target;
        setData(prev => ({ ...prev, [name]: value }));
    };

    // Determine sequence array based strictly on Business Type selection
    const t = data.businessType;
    let steps = [
        { id: 'setup', title: 'Business Profile', icon: <Building2 size={18} /> }
    ];

    if (t) {
        // ENERGY
        if (t === 'home') {
            steps.push({ id: 'energy_home', title: 'Power & Fuel', icon: <Zap size={18} /> });
        } else {
            steps.push({ id: 'energy_base', title: 'Electricity & Facilities', icon: <Zap size={18} /> });
        }

        // FLEET / EQUIPMENT (Scope 1 Configs)
        if (t === 'restaurant') steps.push({ id: 'kitchen', title: 'Commercial Kitchen', icon: <Flame size={18} /> });
        if (t === 'workshop') steps.push({ id: 'generator', title: 'Generator', icon: <Factory size={18} /> });
        if (t === 'logistics' || t === 'retail') steps.push({ id: 'fleet', title: 'Logistics', icon: <Truck size={18} /> });

        // EMPLOYEES (Commuting Scope 3)
        if (['office', 'retail', 'restaurant', 'workshop', 'logistics'].includes(t)) {
            steps.push({ id: 'employees', title: 'Employees', icon: <Users size={18} /> });
        }

        // BUSINESS TRAVEL
        if (t === 'office') steps.push({ id: 'travel', title: 'Business Travel', icon: <Plane size={18} /> });

        // PROCUREMENT & WASTE (Scope 3)
        if (t !== 'logistics') steps.push({ id: 'procurement', title: 'Materials & Waste', icon: <Package size={18} /> });

        // RESULTS
        steps.push({ id: 'results', title: 'Results', icon: <Activity size={18} /> });
    }

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    const emissions = t && currentStep === steps.length - 1 ? calculateBusinessEmissions(data) : null;
    const isResults = currentStep === steps.length - 1 && t;
    const activeStepData = steps[currentStep];

    return (
        <div className="container" style={{ maxWidth: isResults ? '1000px' : '650px', margin: '0 auto', transition: 'max-width 0.3s ease' }}>
            <button onClick={onBack} style={{ marginBottom: '1rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ChevronLeft size={16} /> Back to Selection
            </button>
            
            <header className="header" style={{ marginBottom: isResults ? '2rem' : '1.5rem' }}>
                <h1>Small Business Carbon Footprint</h1>
                {!isResults && <p>Measure Scope 1, 2, and 3 emissions from your operations.</p>}
            </header>

            {t && !isResults && (
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                        <span>Step {currentStep + 1} of {steps.length - 1}</span>
                        <span>{activeStepData.title}</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'var(--card-border)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ 
                            width: `${((currentStep + 1) / (steps.length - 1)) * 100}%`, 
                            height: '100%', 
                            background: 'var(--warning)',
                            transition: 'width 0.3s ease'
                        }}></div>
                    </div>
                </div>
            )}

            <main className="glass-panel" style={{ padding: '2rem', borderColor: t ? 'var(--card-border)' : 'var(--warning)' }}>
                {!isResults ? (
                    <div className="form-content" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', color: 'var(--text-primary)', fontSize: '1.2rem', fontWeight: '600' }}>
                            {activeStepData.icon} <h2>{activeStepData.title}</h2>
                        </div>

                        <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            
                            {/* 1. SETUP */}
                            {activeStepData.id === 'setup' && (
                                <div className="form-group">
                                    <label>What type of business do you operate?</label>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginTop: '1rem' }}>
                                        {BUSINESS_TYPES.map(type => (
                                            <label 
                                                key={type.id} 
                                                style={{ 
                                                    padding: '1rem', 
                                                    background: t === type.id ? 'rgba(210, 153, 34, 0.15)' : 'rgba(0,0,0,0.2)', 
                                                    border: `1px solid ${t === type.id ? 'var(--warning)' : 'var(--card-border)'}`, 
                                                    borderRadius: '8px', 
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '0.75rem',
                                                    transition: 'all 0.2s'
                                                }}
                                            >
                                                <input type="radio" name="businessType" value={type.id} checked={t === type.id} onChange={handleInput} style={{ accentColor: 'var(--warning)' }} />
                                                <span style={{ fontWeight: t === type.id ? '600' : '400', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{type.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 2. ENERGY (Base) */}
                            {activeStepData.id === 'energy_base' && (
                                <>
                                    <div className="form-group">
                                        <label>{t === 'logistics' ? 'Monthly office electricity bill (₹)' : 'Average monthly electricity bill (₹)'}</label>
                                        <div className="range-wrap">
                                            <input type="range" name="electricityBillPerMonth" min="0" max="250000" step="1000" value={data.electricityBillPerMonth} onChange={handleInput} />
                                            <input type="number" name="electricityBillPerMonth" className="number-input" value={data.electricityBillPerMonth} onChange={handleInput} style={{ width: '120px' }} />
                                        </div>
                                    </div>
                                    
                                    {t === 'office' && (
                                        <>
                                            <div className="form-group">
                                                <label>How many air conditioners are used in the office?</label>
                                                <div className="range-wrap">
                                                    <input type="range" name="acCount" min="0" max="50" step="1" value={data.acCount} onChange={handleInput} />
                                                    <input type="number" name="acCount" className="number-input" value={data.acCount} onChange={handleInput} />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>How many desktop computers or servers operate regularly?</label>
                                                <div className="range-wrap">
                                                    <input type="range" name="computerCount" min="0" max="200" step="1" value={data.computerCount} onChange={handleInput} />
                                                    <input type="number" name="computerCount" className="number-input" value={data.computerCount} onChange={handleInput} />
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {t === 'retail' && (
                                        <div className="form-group">
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                                <input type="checkbox" name="usesFridges" checked={data.usesFridges} onChange={handleInput} style={{ width: '18px', height: '18px', accentColor: 'var(--warning)' }} />
                                                Does the shop use refrigerators or cooling units?
                                            </label>
                                            
                                            {data.usesFridges && (
                                                <div style={{ marginTop: '1.5rem', paddingLeft: '2rem', borderLeft: '2px solid var(--warning)' }}>
                                                    <label>How many refrigeration units?</label>
                                                    <div className="range-wrap">
                                                        <input type="range" name="retailFridges" min="1" max="50" step="1" value={data.retailFridges} onChange={handleInput} />
                                                        <input type="number" name="retailFridges" className="number-input" value={data.retailFridges} onChange={handleInput} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </>
                            )}

                            {/* 2. ENERGY (Home) */}
                            {activeStepData.id === 'energy_home' && (
                                <>
                                    <div className="form-group">
                                        <label>Additional electricity used for business per month (₹)</label>
                                        <div className="range-wrap">
                                            <input type="range" name="homeAddtlElectricity" min="0" max="20000" step="500" value={data.homeAddtlElectricity} onChange={handleInput} />
                                            <input type="number" name="homeAddtlElectricity" className="number-input" value={data.homeAddtlElectricity} onChange={handleInput} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>LPG cylinders used for business per year</label>
                                        <div className="range-wrap">
                                            <input type="range" name="homeBusinessLpg" min="0" max="50" step="1" value={data.homeBusinessLpg} onChange={handleInput} />
                                            <input type="number" name="homeBusinessLpg" className="number-input" value={data.homeBusinessLpg} onChange={handleInput} />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* 3. RESTAURANT KITCHEN */}
                            {activeStepData.id === 'kitchen' && (
                                <>
                                    <div className="form-group">
                                        <label>LPG cylinders used per year</label>
                                        <div className="range-wrap">
                                            <input type="range" name="commercialLpgCylinders" min="0" max="500" step="5" value={data.commercialLpgCylinders} onChange={handleInput} />
                                            <input type="number" name="commercialLpgCylinders" className="number-input" value={data.commercialLpgCylinders} onChange={handleInput} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Number of refrigerators / freezers</label>
                                        <div className="range-wrap">
                                            <input type="range" name="commercialFridges" min="0" max="20" step="1" value={data.commercialFridges} onChange={handleInput} />
                                            <input type="number" name="commercialFridges" className="number-input" value={data.commercialFridges} onChange={handleInput} />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* 3. WORKSHOP GENERATOR */}
                            {activeStepData.id === 'generator' && (
                                <div className="form-group">
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                        <input type="checkbox" name="usesGenerator" checked={data.usesGenerator} onChange={handleInput} style={{ width: '18px', height: '18px', accentColor: 'var(--warning)' }} />
                                        Does the workshop use a diesel generator?
                                    </label>
                                    
                                    {data.usesGenerator && (
                                        <div style={{ marginTop: '1.5rem', paddingLeft: '2rem', borderLeft: '2px solid var(--warning)' }}>
                                            <label>Diesel used per year (litres)</label>
                                            <div className="range-wrap">
                                                <input type="range" name="dieselGeneratorLitres" min="50" max="10000" step="50" value={data.dieselGeneratorLitres} onChange={handleInput} />
                                                <input type="number" name="dieselGeneratorLitres" className="number-input" value={data.dieselGeneratorLitres} onChange={handleInput} />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 3. LOGISTICS/RETAIL FLEET */}
                            {activeStepData.id === 'fleet' && (
                                <>
                                    {t === 'retail' && (
                                        <div className="form-group">
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer' }}>
                                                <input type="checkbox" name="usesDelivery" checked={data.usesDelivery} onChange={handleInput} style={{ width: '18px', height: '18px', accentColor: 'var(--warning)' }} />
                                                Does the shop use delivery vehicles?
                                            </label>
                                            
                                            {data.usesDelivery && (
                                                <div style={{ marginTop: '1.5rem', paddingLeft: '2rem', borderLeft: '2px solid var(--warning)' }}>
                                                    <label>Annual fuel consumption for deliveries (litres)</label>
                                                    <div className="range-wrap">
                                                        <input type="range" name="retailDeliveryFuel" min="100" max="10000" step="100" value={data.retailDeliveryFuel} onChange={handleInput} />
                                                        <input type="number" name="retailDeliveryFuel" className="number-input" value={data.retailDeliveryFuel} onChange={handleInput} />
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {t === 'logistics' && (
                                        <>
                                            <div className="form-group">
                                                <label>Number of delivery vehicles</label>
                                                <div className="range-wrap">
                                                    <input type="range" name="logisticsVehicles" min="1" max="100" step="1" value={data.logisticsVehicles} onChange={handleInput} />
                                                    <input type="number" name="logisticsVehicles" className="number-input" value={data.logisticsVehicles} onChange={handleInput} />
                                                </div>
                                            </div>
                                            <div className="form-group">
                                                <label>Primary Vehicle type</label>
                                                <select name="logisticsFuelType" value={data.logisticsFuelType} onChange={handleSelect} style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', border: '1px solid var(--card-border)', borderRadius: '8px', outline: 'none', width: '100%', marginTop: '0.5rem' }}>
                                                    <option value="petrol">Petrol Fleet</option>
                                                    <option value="diesel">Diesel Fleet</option>
                                                    <option value="cng">CNG Fleet</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Annual fuel consumption (litres / kg)</label>
                                                <div className="range-wrap">
                                                    <input type="range" name="logisticsFuelLitres" min="1000" max="500000" step="1000" value={data.logisticsFuelLitres} onChange={handleInput} />
                                                    <input type="number" name="logisticsFuelLitres" className="number-input" value={data.logisticsFuelLitres} onChange={handleInput} />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}

                            {/* 4. EMPLOYEES */}
                            {activeStepData.id === 'employees' && (
                                <>
                                    <div className="form-group">
                                        <label>Number of employees</label>
                                        <div className="range-wrap">
                                            <input type="range" name="employees" min="0" max="500" step="1" value={data.employees} onChange={handleInput} />
                                            <input type="number" name="employees" className="number-input" value={data.employees} onChange={handleInput} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Average commuting distance per employee per week (km)</label>
                                        <div className="range-wrap">
                                            <input type="range" name="avgCommuteKm" min="0" max="250" step="5" value={data.avgCommuteKm} onChange={handleInput} />
                                            <input type="number" name="avgCommuteKm" className="number-input" value={data.avgCommuteKm} onChange={handleInput} />
                                        </div>
                                    </div>
                                    {t === 'office' && (
                                        <div className="form-group">
                                            <label>What is the primary commuting mode of employees?</label>
                                            <select name="commuteMode" value={data.commuteMode} onChange={handleSelect} style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', border: '1px solid var(--card-border)', borderRadius: '8px', outline: 'none', width: '100%', marginTop: '0.5rem' }}>
                                                <option value="car">Car</option>
                                                <option value="twowheeler">Two-wheeler</option>
                                                <option value="transit">Public transport</option>
                                                <option value="mixed">Mixed</option>
                                            </select>
                                        </div>
                                    )}
                                </>
                            )}

                            {/* 5. BUSINESS TRAVEL */}
                            {activeStepData.id === 'travel' && (
                                <>
                                    <div className="form-group">
                                        <label>Total flight distance travelled for business per year (km)</label>
                                        <div className="range-wrap">
                                            <input type="range" name="flightsKmPerYear" min="0" max="500000" step="1000" value={data.flightsKmPerYear} onChange={handleInput} />
                                            <input type="number" name="flightsKmPerYear" className="number-input" value={data.flightsKmPerYear} onChange={handleInput} />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Total train travel distance for business per year (km)</label>
                                        <div className="range-wrap">
                                            <input type="range" name="trainKmPerYear" min="0" max="50000" step="1000" value={data.trainKmPerYear} onChange={handleInput} />
                                            <input type="number" name="trainKmPerYear" className="number-input" value={data.trainKmPerYear} onChange={handleInput} />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* 6. PROCUREMENT & WASTE */}
                            {activeStepData.id === 'procurement' && (
                                <>
                                    {t === 'office' && (
                                        <div className="form-group">
                                            <label>Average monthly spending on office supplies and equipment (₹)</label>
                                            <div className="range-wrap">
                                                <input type="range" name="spendOfficeSupplies" min="0" max="500000" step="5000" value={data.spendOfficeSupplies} onChange={handleInput} />
                                                <input type="number" name="spendOfficeSupplies" className="number-input" value={data.spendOfficeSupplies} onChange={handleInput} style={{ width: '120px' }} />
                                            </div>
                                        </div>
                                    )}
                                    {t === 'retail' && (
                                        <div className="form-group">
                                            <label>Average monthly value of goods purchased for resale (₹)</label>
                                            <div className="range-wrap">
                                                <input type="range" name="spendResaleGoods" min="0" max="1000000" step="10000" value={data.spendResaleGoods} onChange={handleInput} />
                                                <input type="number" name="spendResaleGoods" className="number-input" value={data.spendResaleGoods} onChange={handleInput} style={{ width: '120px' }} />
                                            </div>
                                        </div>
                                    )}
                                    {t === 'restaurant' && (
                                        <div className="form-group">
                                            <label>Average monthly spending on ingredients (₹)</label>
                                            <div className="range-wrap">
                                                <input type="range" name="spendFoodSupply" min="0" max="1000000" step="10000" value={data.spendFoodSupply} onChange={handleInput} />
                                                <input type="number" name="spendFoodSupply" className="number-input" value={data.spendFoodSupply} onChange={handleInput} style={{ width: '120px' }} />
                                            </div>
                                        </div>
                                    )}
                                    {t === 'workshop' && (
                                        <div className="form-group">
                                            <label>Monthly spending on raw materials (₹)</label>
                                            <div className="range-wrap">
                                                <input type="range" name="spendRawMaterials" min="0" max="1000000" step="10000" value={data.spendRawMaterials} onChange={handleInput} />
                                                <input type="number" name="spendRawMaterials" className="number-input" value={data.spendRawMaterials} onChange={handleInput} style={{ width: '120px' }} />
                                            </div>
                                        </div>
                                    )}
                                    {t === 'home' && (
                                        <div className="form-group">
                                            <label>Monthly spending on packaging and materials (₹)</label>
                                            <div className="range-wrap">
                                                <input type="range" name="spendPackaging" min="0" max="100000" step="1000" value={data.spendPackaging} onChange={handleInput} />
                                                <input type="number" name="spendPackaging" className="number-input" value={data.spendPackaging} onChange={handleInput} style={{ width: '120px' }} />
                                            </div>
                                        </div>
                                    )}
                                    
                                    {/* Universal Waste */}
                                    <div className="form-group">
                                        <label>Garbage bags generated per week</label>
                                        <div className="range-wrap">
                                            <input type="range" name="wasteBags" min="0" max="100" step="1" value={data.wasteBags} onChange={handleInput} />
                                            <input type="number" name="wasteBags" className="number-input" value={data.wasteBags} onChange={handleInput} />
                                        </div>
                                    </div>

                                    {t === 'restaurant' && (
                                        <div className="form-group">
                                            <label>Is food waste composted?</label>
                                            <select name="compostsWaste" value={data.compostsWaste} onChange={handleSelect} style={{ padding: '0.75rem', background: 'rgba(0,0,0,0.2)', color: 'var(--text-primary)', border: '1px solid var(--card-border)', borderRadius: '8px', outline: 'none', width: '100%', marginTop: '0.5rem' }}>
                                                <option value="no">No</option>
                                                <option value="yes">Yes</option>
                                            </select>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {t && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--card-border)' }}>
                                <button onClick={prevStep} disabled={currentStep === 0} style={{ padding: '0.75rem 1.5rem', background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: currentStep === 0 ? 'not-allowed' : 'pointer', opacity: currentStep === 0 ? 0.3 : 1 }}>
                                    <ChevronLeft size={16} /> Back
                                </button>
                                <button onClick={nextStep} style={{ padding: '0.75rem 1.5rem', background: 'var(--warning)', border: 'none', color: '#111', fontWeight: '600', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', boxShadow: '0 4px 12px rgba(210, 153, 34, 0.4)' }}>
                                    {currentStep === steps.length - 2 ? 'See Results' : 'Next'} {currentStep !== steps.length - 2 && <ChevronRight size={16} />}
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    // --- RESULTS STEP ---
                    <div className="results-dashboard" style={{ animation: 'fadeInDown 0.8s ease-out' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                            <div>
                                <h2 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', fontWeight: '600', marginBottom: '0.25rem' }}>Business Carbon Performance</h2>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', textTransform: 'capitalize' }}>
                                    {BUSINESS_TYPES.find(type => type.id === t)?.label}
                                </div>
                            </div>
                            <button onClick={() => setCurrentStep(0)} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--card-border)', borderRadius: '6px', color: 'var(--text-primary)', cursor: 'pointer' }}>
                                Recalculate
                            </button>
                        </div>

                        {/* HERO SECTION */}
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--card-border)', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>Total Carbon Footprint</div>
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '4rem', fontWeight: '800', lineHeight: 1, color: 'var(--text-primary)' }}>
                                        {emissions.tonnes.total.toFixed(2)}
                                    </span>
                                    <span style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', fontWeight: '500' }}>t CO₂e / year</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Monthly Equivalent</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>{emissions.dashboard.monthlyTonnes.toFixed(2)} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '400' }}>t / mo</span></div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Per Employee</div>
                                    <div style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-primary)' }}>{emissions.dashboard.perEmployeeTonnes.toFixed(2)} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '400' }}>t / yr</span></div>
                                </div>
                            </div>
                        </div>

                        {/* PERFORMANCE & BENCHMARKING ROW */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.5fr)', gap: '2rem', marginBottom: '2rem' }}>
                            {/* Score Card */}
                            <div style={{ background: 'linear-gradient(135deg, rgba(210, 153, 34, 0.1) 0%, transparent 100%)', padding: '1.5rem', borderRadius: '12px', border: '1px solid rgba(210, 153, 34, 0.3)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
                                <div style={{ fontSize: '0.9rem', color: 'var(--warning)', marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '600' }}>Carbon Efficiency Score</div>
                                <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: `8px solid ${emissions.dashboard.score >= 80 ? 'var(--success)' : emissions.dashboard.score >= 60 ? 'var(--warning)' : 'var(--danger)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                                    <span style={{ fontSize: '3rem', fontWeight: '800', color: 'var(--text-primary)' }}>{emissions.dashboard.score}</span>
                                </div>
                                <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{emissions.dashboard.ratingStr}</div>
                            </div>

                            {/* Industry Benchmark */}
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                                <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={18}/> Industry Benchmark Comparison</h3>
                                
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Your Business</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>{emissions.tonnes.total.toFixed(2)} t</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Industry Average</div>
                                        <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>{emissions.dashboard.benchmarkTotal.toFixed(2)} t</div>
                                    </div>
                                </div>

                                <div style={{ position: 'relative', width: '100%', height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', marginBottom: '1.5rem', overflow: 'hidden' }}>
                                    <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${Math.min((emissions.dashboard.benchmarkTotal / Math.max(emissions.tonnes.total, emissions.dashboard.benchmarkTotal)) * 100, 100)}%`, background: 'rgba(255,255,255,0.2)', borderRight: '2px solid rgba(255,255,255,0.5)' }}></div>
                                    <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${Math.min((emissions.tonnes.total / Math.max(emissions.tonnes.total, emissions.dashboard.benchmarkTotal)) * 100, 100)}%`, background: emissions.tonnes.total > emissions.dashboard.benchmarkTotal ? 'var(--danger)' : 'var(--success)', opacity: 0.8 }}></div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', color: emissions.tonnes.total > emissions.dashboard.benchmarkTotal ? 'var(--danger)' : 'var(--success)' }}>
                                    {emissions.tonnes.total > emissions.dashboard.benchmarkTotal ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                    <span style={{ fontWeight: '600' }}>{Math.abs(emissions.dashboard.benchmarkRatio).toFixed(1)}% {emissions.tonnes.total > emissions.dashboard.benchmarkTotal ? 'higher' : 'lower'}</span> than industry avg
                                </div>

                                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--card-border)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Intensity (Per Employee)</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                                            {emissions.dashboard.perEmployeeTonnes.toFixed(2)} t
                                            {emissions.dashboard.perEmployeeTonnes <= emissions.dashboard.benchmarkPerEmployee ? <CheckCircle size={16} color="var(--success)"/> : <AlertTriangle size={16} color="var(--warning)"/>}
                                        </div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Intensity (Per Op. Day)</div>
                                        <div style={{ fontSize: '1.1rem', fontWeight: '600', color: 'var(--text-primary)', marginTop: '0.25rem' }}>{emissions.dashboard.perDayKg.toFixed(1)} kg</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CHARTS AND DETAILS ROW */}
                        <div className="results-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: '2rem', marginBottom: '2rem' }}>
                            {/* Activity Breakdown Chart (Left) */}
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                                <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={18} /> Emissions by Activity</h3>
                                
                                <div style={{ height: '240px', width: '100%', marginBottom: '1.5rem' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie data={emissions.chartData} cx="50%" cy="50%" innerRadius={70} outerRadius={90} paddingAngle={2} dataKey="value" stroke="none">
                                                {emissions.chartData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                                ))}
                                            </Pie>
                                            <Tooltip formatter={(value) => `${(value/1000).toFixed(2)} t CO₂e`} contentStyle={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--card-border)', borderRadius: '8px', color: 'var(--text-primary)' }} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Category Ranking</div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        {emissions.activityKwargs.map((act, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', width: '20px', fontWeight: 'bold' }}>#{i+1}</span>
                                                    <span style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>{act.name}</span>
                                                </div>
                                                <div style={{ fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>{((act.val / emissions.rawKg.total) * 100).toFixed(1)}%</div>
                                            </div>
                                        ))}
                                    </div>
                                    {emissions.activityKwargs.length > 0 && (
                                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(210, 153, 34, 0.1)', borderLeft: '3px solid var(--warning)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                            <strong style={{ color: 'var(--warning)', display: 'block', marginBottom: '0.25rem' }}>Insight:</strong> {emissions.activityKwargs[0].name} contributes the largest share of emissions to your operations.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Scopes and Opportunities (Right) */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                {/* GHG Protocol Scopes */}
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Globe size={18}/> GHG Protocol Scopes</h3>
                                    </div>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--danger)', fontWeight: '600' }}>
                                                <span>Scope 1 (Direct)</span>
                                                <span>{emissions.tonnes.scope1.toFixed(2)} t</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                <span>{emissions.percentages.scope1.toFixed(1)}% of total</span>
                                                <span>Target: 15-30%</span>
                                            </div>
                                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                                                <div style={{ width: `${emissions.percentages.scope1}%`, height: '100%', background: 'var(--danger)', borderRadius: '4px' }}></div>
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--warning)', fontWeight: '600' }}>
                                                <span>Scope 2 (Energy)</span>
                                                <span>{emissions.tonnes.scope2.toFixed(2)} t</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                <span>{emissions.percentages.scope2.toFixed(1)}% of total</span>
                                                <span>Target: 20-40%</span>
                                            </div>
                                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                                                <div style={{ width: `${emissions.percentages.scope2}%`, height: '100%', background: 'var(--warning)', borderRadius: '4px' }}></div>
                                            </div>
                                        </div>

                                        <div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.25rem', color: 'var(--success)', fontWeight: '600' }}>
                                                <span>Scope 3 (Value Chain)</span>
                                                <span>{emissions.tonnes.scope3.toFixed(2)} t</span>
                                            </div>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                                <span>{emissions.percentages.scope3.toFixed(1)}% of total</span>
                                                <span>Target: 40-70%</span>
                                            </div>
                                            <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                                                <div style={{ width: `${emissions.percentages.scope3}%`, height: '100%', background: 'var(--success)', borderRadius: '4px' }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    {(emissions.percentages.scope3 > 70 || emissions.percentages.scope2 > 40 || emissions.percentages.scope1 > 30) && (
                                        <div style={{ marginTop: '1.25rem', fontSize: '0.85rem', color: 'var(--warning)', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                                            <AlertTriangle size={14} style={{ marginTop: '0.1rem', flexShrink: 0 }}/>
                                            <span>
                                                {emissions.percentages.scope3 > 70 ? "Your Scope 3 emissions are higher than typical businesses in your sector." : 
                                                 emissions.percentages.scope2 > 40 ? "Electricity usage is slightly higher than similar businesses." :
                                                 "Your direct Scope 1 fuel emissions are above typical SME thresholds."}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Top Reduction Opportunities */}
                                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
                                    <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Lightbulb size={18} color="var(--warning)"/> Top Reduction Opportunities</h3>
                                    
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                                        {emissions.dashboard.opportunities.map((opp, i) => (
                                            <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                                                <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(210, 153, 34, 0.2)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 'bold', flexShrink: 0 }}>{i+1}</div>
                                                <div>
                                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.35rem', lineHeight: '1.4' }}>{opp.text}</div>
                                                    <div style={{ fontSize: '0.85rem', color: 'var(--success)' }}>Potential reduction: {opp.potentialReductionTonnes} t</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* EQUIVALENTS ROW */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '12px' }}><Car size={24} /></div>
                                <div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>{emissions.dashboard.equivalents.drivingKm.toLocaleString()} km</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Driven in a petrol car</div>
                                </div>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', borderRadius: '12px' }}><Home size={24} /></div>
                                <div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>{emissions.dashboard.equivalents.homesPowered.toLocaleString()} homes</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Electricity for one year</div>
                                </div>
                            </div>
                            <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '12px' }}><Leaf size={24} /></div>
                                <div>
                                    <div style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)' }}>{emissions.dashboard.equivalents.trees.toLocaleString()} trees</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Needed to absorb carbon</div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}
            </main>
        </div>
    );
};

export default BusinessCalculator;
