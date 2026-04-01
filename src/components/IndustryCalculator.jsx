import React, { useState } from 'react';
import { 
  Building2, Factory, Zap, Cloud, Truck, Recycle, Activity, ChevronRight, ChevronLeft, Globe, Database, Briefcase, Pill, Wheat, Plane, Users, Plus, CheckCircle, ArrowLeft,
  TrendingDown, Sun, Car, Home, TreePine, Wind, Download, Target, AlertTriangle, Award
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, Legend, LabelList } from 'recharts';
import { calculateIndustryEmissions } from '../utils/calculations';
import '../index.css';

const SECTORS = [
    { id: 'manufacturing', label: 'Manufacturing & Heavy Industry' },
    { id: 'tech', label: 'Technology & Data Centers' },
    { id: 'finance', label: 'Banking & Financial Institutions' },
    { id: 'agriculture', label: 'Agriculture & Food Production' },
    { id: 'logistics', label: 'Logistics & Transportation' },
    { id: 'hospitality', label: 'Hospitality & Real Estate' },
    { id: 'healthcare', label: 'Healthcare & Pharma' },
    { id: 'other', label: 'Other Commercial Services' }
];

const createEmptyFacility = (id = 1) => ({
    id,
    name: `Facility ${id}`,
    type: 'manufacturing',
    floorArea: 0,
    employees: 0,
    operatingHours: 8760,
    isComplete: false,

    // Base Scope 1 (Shared)
    dieselGeneratorsL: 0, naturalGasHeatingM3: 0,

    // Base Scope 2 (Shared)
    elecLightingKwh: 0, elecHvacKwh: 0,

    // Specific Scope 1 (Stationary & Process)
    dieselBoilersL: 0, naturalGasM3: 0, lpgHeatingKg: 0, coalTonnes: 0,
    furnaceOilL: 0, biomassTonnes: 0, processCo2: 0, processCement: 0, 
    processSteel: 0, processLime: 0, processAluminum: 0, processChemical: 0, 
    leakRefrigerantKg: 0, leakMethane: 0, leakFireSuppression: 0, leakIndustrial: 0,
    medicalGas: 0, explosivesTonnes: 0, fertilizerTonnes: 0,

    // Specific Scope 1 (Mobile)
    petrolFleetL: 0, dieselFleetL: 0, cngFleetKg: 0, aviationFuelL: 0, marineFuelL: 0,
    dieselForkliftsL: 0, lpgForkliftsKg: 0, petrolInternalL: 0,
    cargoEquipmentL: 0, miningEquipmentL: 0, tractorDieselL: 0,

    // Specific Scope 2
    elecOfficesKwh: 0, elecMfgKwh: 0, elecRefrigerationKwh: 0, elecAutomatedStorageKwh: 0,
    elecItKwh: 0, elecServersKwh: 0, elecCoolingKwh: 0, elecUpsKwh: 0, elecPduKwh: 0,
    elecAtmsKwh: 0, elecWarehouseKwh: 0, elecLabEquipmentKwh: 0, elecVentilationKwh: 0,
    elecMedicalEquipmentKwh: 0, elecGuestRoomsKwh: 0, elecLaundryKwh: 0, elecKitchensKwh: 0,
    elecMiningKwh: 0, elecIrrigationKwh: 0, elecPlantOpsKwh: 0, elecConstructionKwh: 0,
    purchasedSteamTns: 0, purchasedHeatingGj: 0, purchasedCoolingGj: 0,
    solarGenKwh: 0, windGenKwh: 0, renewablePpaKwh: 0,

    // Specific Facility Scope 3
    c4RawMaterialsTonnes: 0, c4RawMaterialsDist: 0, c4TransportMode: 'truck',
    c5Landfill: 0, c5Incinerated: 0, c5Recycled: 0, c5Hazardous: 0,
    c6FlightDist: 0, c6TrainDist: 0, c6CarDist: 0, c6HotelStays: 0, c6TaxiDist: 0,
    c7CommutingEmployees: 0, c7CommuteDist: 0, c7RemotePct: 0,
    c9FinishedGoodsDist: 0, c9FinishedGoodsTonnes: 0,
    
    // Other Scope 3 overrides (Facility Level Mapping)
    goodsPurchasedResale: 0, packagingMaterialsTonnes: 0, officeEquipmentSpend: 0, 
    paperConsumptionKg: 0, waterConsumptionM3: 0, itHardwareEmissions: 0, serverLifecycleEmissions: 0, 
    cloudInfraEmissions: 0, subcontractedTransportDist: 0, chemicalPurchases$: 0, pharmaceuticalSupply$: 0,
    medicalEquipSpend: 0, foodProcurement$: 0, laundryServicesSpend: 0, wasteRockTonnes: 0,
    agriculturalWasteTonnes: 0, constructionMaterialsSpend: 0,
    
    // Additional passenger scopes
    customerTransportDist: 0, patientTravelDist: 0, studentCommutingDist: 0, tourismTransportDist: 0
});

const InputRow = ({ label, name, value, onChange, type="number" }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', flex: 1 }}>{label}</label>
        <input type={type} name={name} value={value} onChange={onChange} className="number-input" style={{ width: type==='text' ? '200px' : '120px' }} />
    </div>
);

const SectionHeader = ({ title }) => (
    <h3 style={{ fontSize: '0.95rem', color: 'var(--danger)', borderBottom: '1px solid rgba(239, 68, 68, 0.3)', paddingBottom: '0.5rem', marginBottom: '0.75rem', marginTop: 'clamp(0.75rem, 3vw, 1.5rem)' }}>{title}</h3>
);

const IndustryCalculator = ({ onBack }) => {
    // Top level app routing
    const [step, setStep] = useState('org'); 
    // Sub-routing for facility modal
    const [activeFacilityId, setActiveFacilityId] = useState(null);
    const [facilityStep, setFacilityStep] = useState(0);

    const [data, setData] = useState({
        // Org Profile
        orgName: '',
        sector: '',
        subSector: '',
        country: '',
        employeesTotal: 0,
        revenue: 0,
        productionOutput: 0,
        reportingYear: '2025',
        boundaryMethod: 'operational',

        // Facilities Array
        facilities: [createEmptyFacility(1)],

        // Org-Level Scope 3 (Cat 1,2,3,8,10,11,12,13,14,15)
        c1RawMaterials: 0, c1Spend: 0, c1Chemicals: 0, c1Agri: 0, c1Packaging: 0,
        c2Machinery: 0, c2Buildings: 0, c2Vehicles: 0, c2IT: 0,
        c3Extraction: 0, c3ElecGen: 0,
        c8LeasedBldgEnergy: 0, c8LeasedEquipEnergy: 0,
        c10ProcessingEnergy: 0, c11ProductEnergy: 0,
        c12WasteGenerated: 0, c12RecyclingRate: 0,
        c13DownstreamLeasedEnergy: 0, c14FranchiseEnergy: 0,
        c15LoansFossil: 0, c15LoansMfg: 0, c15LoansAg: 0, c15InvestEquity: 0,
        c15ProjectFinance: 0, c15Mortgage: 0,

        // Sector Modules
        bankFinancedTotal: 0, bankCorporateExposure: 0, bankRetailExposure: 0, bankInvestments: 0, bankAssetMgmt: 0,
        techServerKwh: 0, techCoolingKwh: 0, techBackupL: 0, techCloudEmissions: 0,
        agLivestock: 0, agFertilizer: 0, agSoil: 0,
        logFleetL: 0, logDist: 0, logLoad: 0,
        hospGuestKwh: 0, hospLaundry: 0, hospFood: 0,
        healthMedicalGas: 0, healthPharma: 0, healthWaste: 0
    });

    const handleOrgInput = (e) => {
        const { name, value, type } = e.target;
        setData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseFloat(value) || 0 : value
        }));
    };

    const handleFacilityInput = (facilityId, e) => {
        const { name, value, type } = e.target;
        const val = type === 'number' ? parseFloat(value) || 0 : value;
        setData(prev => ({
            ...prev,
            facilities: prev.facilities.map(f => f.id === facilityId ? { ...f, [name]: val } : f)
        }));
    };

    const addFacility = () => {
        setData(prev => ({
            ...prev,
            facilities: [...prev.facilities, createEmptyFacility(prev.facilities.length + 1)]
        }));
    };

    const closeFacilityWizard = (id) => {
        setData(prev => ({
            ...prev,
            facilities: prev.facilities.map(f => f.id === id ? { ...f, isComplete: true } : f)
        }));
        setActiveFacilityId(null);
        setFacilityStep(0);
    };

    // Render logic for specific facility form pages
    const renderFacilityStep = (fac) => {
        const h = (e) => handleFacilityInput(fac.id, e);
        
        switch(facilityStep) {
            case 0:
                return (
                    <div style={{ height: '500px', overflowY: 'auto', paddingRight: '1rem' }}>
                        <SectionHeader title="Facility Details" />
                        <InputRow label="Facility Name" name="name" type="text" value={fac.name} onChange={h} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Facility Type</label>
                            <select name="type" value={fac.type} onChange={h} style={{ padding: '0.5rem', background: 'rgba(0,0,0,0.4)', color: 'white', border: '1px solid var(--card-border)', borderRadius: '4px' }}>
                                <option value="manufacturing">Manufacturing Plant</option>
                                <option value="warehouse">Warehouse / Distribution Center</option>
                                <option value="office">Corporate Office</option>
                                <option value="retail">Retail Store</option>
                                <option value="datacenter">Data Center</option>
                                <option value="bank">Bank Branch / Financial Office</option>
                                <option value="logistics">Logistics Hub / Transport Depot</option>
                                <option value="lab">Research Laboratory</option>
                                <option value="hospital">Hospital / Healthcare Facility</option>
                                <option value="hotel">Hotel / Hospitality Facility</option>
                                <option value="campus">Educational Campus</option>
                                <option value="mining">Mining Site</option>
                                <option value="agriculture">Agricultural Facility</option>
                                <option value="powerplant">Power Generation Plant</option>
                                <option value="construction">Construction Site</option>
                            </select>
                        </div>
                        <InputRow label="Floor Area (sq meters)" name="floorArea" value={fac.floorArea} onChange={h} />
                        <InputRow label="Number of Employees" name="employees" value={fac.employees} onChange={h} />
                        <InputRow label="Operating Hours/Year" name="operatingHours" value={fac.operatingHours} onChange={h} />
                    </div>
                );
            case 1:
                return (
                    <div style={{ height: '500px', overflowY: 'auto', paddingRight: '1rem' }}>
                        {fac.type === 'manufacturing' && (
                            <>
                                <SectionHeader title="Scope 1: Stationary Combustion" />
                                <InputRow label="Diesel used in boilers (litres/yr)" name="dieselBoilersL" value={fac.dieselBoilersL} onChange={h} />
                                <InputRow label="Natural gas used in boilers/furnaces (m³/yr)" name="naturalGasM3" value={fac.naturalGasM3} onChange={h} />
                                <InputRow label="LPG used in industrial processes (kg/yr)" name="lpgHeatingKg" value={fac.lpgHeatingKg} onChange={h} />
                                <InputRow label="Coal used for production heat (tonnes/yr)" name="coalTonnes" value={fac.coalTonnes} onChange={h} />
                                <InputRow label="Furnace oil used (litres/yr)" name="furnaceOilL" value={fac.furnaceOilL} onChange={h} />
                                <InputRow label="Biomass fuel used (tonnes/yr)" name="biomassTonnes" value={fac.biomassTonnes} onChange={h} />
                                
                                <SectionHeader title="Scope 1: Mobile Combustion" />
                                <InputRow label="Diesel used in forklifts (litres/yr)" name="dieselForkliftsL" value={fac.dieselForkliftsL} onChange={h} />
                                <InputRow label="Petrol used in internal vehicles (litres/yr)" name="petrolInternalL" value={fac.petrolInternalL} onChange={h} />
                                <InputRow label="LPG used in forklifts (kg/yr)" name="lpgForkliftsKg" value={fac.lpgForkliftsKg} onChange={h} />

                                <SectionHeader title="Scope 1: Process Emissions" />
                                <InputRow label="CO₂ from chemical reactions" name="processCo2" value={fac.processCo2} onChange={h} />
                                <InputRow label="Cement clinker production (tonnes/yr)" name="processCement" value={fac.processCement} onChange={h} />
                                <InputRow label="Steel reduction processes (tonnes/yr)" name="processSteel" value={fac.processSteel} onChange={h} />
                                <InputRow label="Lime production emissions" name="processLime" value={fac.processLime} onChange={h} />
                                <InputRow label="Chemical process emissions" name="processChemical" value={fac.processChemical} onChange={h} />

                                <SectionHeader title="Scope 1: Fugitive Emissions" />
                                <InputRow label="Refrigerant leakage from cooling (kg/yr)" name="leakRefrigerantKg" value={fac.leakRefrigerantKg} onChange={h} />
                                <InputRow label="Leakage from compressed gases" name="leakIndustrial" value={fac.leakIndustrial} onChange={h} />
                                <InputRow label="Fire suppression gas leakage" name="leakFireSuppression" value={fac.leakFireSuppression} onChange={h} />
                            </>
                        )}
                        {fac.type === 'warehouse' && (
                            <>
                                <SectionHeader title="Scope 1: Combustion" />
                                <InputRow label="Diesel used in backup generators (L/yr)" name="dieselGeneratorsL" value={fac.dieselGeneratorsL} onChange={h} />
                                <InputRow label="LPG used in forklifts (kg/yr)" name="lpgForkliftsKg" value={fac.lpgForkliftsKg} onChange={h} />
                                <InputRow label="Diesel used in forklifts (L/yr)" name="dieselForkliftsL" value={fac.dieselForkliftsL} onChange={h} />
                                <InputRow label="Natural gas used in heating (m³/yr)" name="naturalGasHeatingM3" value={fac.naturalGasHeatingM3} onChange={h} />
                            </>
                        )}
                        {fac.type === 'office' && (
                            <>
                                <SectionHeader title="Scope 1: Operations" />
                                <InputRow label="Diesel used in generators (L/yr)" name="dieselGeneratorsL" value={fac.dieselGeneratorsL} onChange={h} />
                                <InputRow label="Petrol used in company cars (L/yr)" name="petrolFleetL" value={fac.petrolFleetL} onChange={h} />
                                <InputRow label="Natural gas used in heating (m³/yr)" name="naturalGasHeatingM3" value={fac.naturalGasHeatingM3} onChange={h} />
                            </>
                        )}
                        {fac.type === 'retail' && (
                            <>
                                <SectionHeader title="Scope 1: Store Operations" />
                                <InputRow label="Diesel used in generators (L/yr)" name="dieselGeneratorsL" value={fac.dieselGeneratorsL} onChange={h} />
                                <InputRow label="Natural gas used for heating (m³/yr)" name="naturalGasHeatingM3" value={fac.naturalGasHeatingM3} onChange={h} />
                            </>
                        )}
                        {fac.type === 'datacenter' && (
                            <>
                                <SectionHeader title="Scope 1: Backup Power" />
                                <InputRow label="Diesel used in backup generators (L/yr)" name="dieselGeneratorsL" value={fac.dieselGeneratorsL} onChange={h} />
                            </>
                        )}
                        {fac.type === 'bank' && (
                            <>
                                <SectionHeader title="Scope 1: Branch Operations" />
                                <InputRow label="Diesel used in backup generators (L/yr)" name="dieselGeneratorsL" value={fac.dieselGeneratorsL} onChange={h} />
                            </>
                        )}
                        {fac.type === 'logistics' && (
                            <>
                                <SectionHeader title="Scope 1: Transportation Fleet" />
                                <InputRow label="Diesel used in trucks (L/yr)" name="dieselFleetL" value={fac.dieselFleetL} onChange={h} />
                                <InputRow label="Petrol used in delivery vehicles (L/yr)" name="petrolFleetL" value={fac.petrolFleetL} onChange={h} />
                                <InputRow label="CNG used in fleet (kg/yr)" name="cngFleetKg" value={fac.cngFleetKg} onChange={h} />
                                <InputRow label="Fuel in cargo handling equipment (L/yr)" name="cargoEquipmentL" value={fac.cargoEquipmentL} onChange={h} />
                            </>
                        )}
                        {fac.type === 'lab' && (
                            <>
                                <SectionHeader title="Scope 1: Lab Operations" />
                                <InputRow label="Gas used in experiments" name="processChemical" value={fac.processChemical} onChange={h} />
                                <InputRow label="Diesel generators (L/yr)" name="dieselGeneratorsL" value={fac.dieselGeneratorsL} onChange={h} />
                                <InputRow label="Refrigerant leakage (kg/yr)" name="leakRefrigerantKg" value={fac.leakRefrigerantKg} onChange={h} />
                            </>
                        )}
                        {fac.type === 'hospital' && (
                            <>
                                <SectionHeader title="Scope 1: Health Operations" />
                                <InputRow label="Diesel generators (L/yr)" name="dieselGeneratorsL" value={fac.dieselGeneratorsL} onChange={h} />
                                <InputRow label="Medical gas emissions" name="medicalGas" value={fac.medicalGas} onChange={h} />
                                <InputRow label="Refrigerant leakage (kg/yr)" name="leakRefrigerantKg" value={fac.leakRefrigerantKg} onChange={h} />
                            </>
                        )}
                        {fac.type === 'hotel' && (
                            <>
                                <SectionHeader title="Scope 1: Hospitality Operations" />
                                <InputRow label="LPG used in kitchens (kg/yr)" name="lpgHeatingKg" value={fac.lpgHeatingKg} onChange={h} />
                                <InputRow label="Diesel generators (L/yr)" name="dieselGeneratorsL" value={fac.dieselGeneratorsL} onChange={h} />
                                <InputRow label="Natural gas for heating (m³/yr)" name="naturalGasHeatingM3" value={fac.naturalGasHeatingM3} onChange={h} />
                            </>
                        )}
                        {fac.type === 'campus' && (
                            <>
                                <SectionHeader title="Scope 1: Campus Infrastructure" />
                                <InputRow label="Diesel generators (L/yr)" name="dieselGeneratorsL" value={fac.dieselGeneratorsL} onChange={h} />
                                <InputRow label="LPG used in cafeterias (kg/yr)" name="lpgHeatingKg" value={fac.lpgHeatingKg} onChange={h} />
                            </>
                        )}
                        {fac.type === 'mining' && (
                            <>
                                <SectionHeader title="Scope 1: Extraction Sites" />
                                <InputRow label="Diesel used in mining equipment (L/yr)" name="miningEquipmentL" value={fac.miningEquipmentL} onChange={h} />
                                <InputRow label="Explosives used in extraction (tonnes)" name="explosivesTonnes" value={fac.explosivesTonnes} onChange={h} />
                            </>
                        )}
                        {fac.type === 'agriculture' && (
                            <>
                                <SectionHeader title="Scope 1: Field Operations" />
                                <InputRow label="Diesel used in tractors (L/yr)" name="tractorDieselL" value={fac.tractorDieselL} onChange={h} />
                                <InputRow label="Methane emissions from livestock" name="leakMethane" value={fac.leakMethane} onChange={h} />
                                <InputRow label="Fertilizer application (tonnes)" name="fertilizerTonnes" value={fac.fertilizerTonnes} onChange={h} />
                            </>
                        )}
                        {fac.type === 'powerplant' && (
                            <>
                                <SectionHeader title="Scope 1: Generation Fuels" />
                                <InputRow label="Coal used in power plant (tonnes)" name="coalTonnes" value={fac.coalTonnes} onChange={h} />
                                <InputRow label="Natural gas used in turbines (m³)" name="naturalGasM3" value={fac.naturalGasM3} onChange={h} />
                                <InputRow label="Fuel oil consumption (L/yr)" name="furnaceOilL" value={fac.furnaceOilL} onChange={h} />
                            </>
                        )}
                        {fac.type === 'construction' && (
                            <>
                                <SectionHeader title="Scope 1: Site Activity" />
                                <InputRow label="Diesel used in construction equipment (L)" name="miningEquipmentL" value={fac.miningEquipmentL} onChange={h} />
                                <InputRow label="Fuel used in generators (L)" name="dieselGeneratorsL" value={fac.dieselGeneratorsL} onChange={h} />
                            </>
                        )}
                    </div>
                );
            case 2:
                return (
                    <div style={{ height: '500px', overflowY: 'auto', paddingRight: '1rem' }}>
                        {fac.type === 'manufacturing' && (
                            <>
                                <SectionHeader title="Scope 2: Facilities & Grid" />
                                <InputRow label="Electricity in production eqp (kWh)" name="elecMfgKwh" value={fac.elecMfgKwh} onChange={h} />
                                <InputRow label="Electricity used for HVAC (kWh)" name="elecHvacKwh" value={fac.elecHvacKwh} onChange={h} />
                                <InputRow label="Electricity used for lighting (kWh)" name="elecLightingKwh" value={fac.elecLightingKwh} onChange={h} />
                                <InputRow label="Purchased steam used (tonnes)" name="purchasedSteamTns" value={fac.purchasedSteamTns} onChange={h} />
                                <InputRow label="Purchased cooling energy (GJ)" name="purchasedCoolingGj" value={fac.purchasedCoolingGj} onChange={h} />
                            </>
                        )}
                        {fac.type === 'warehouse' && (
                            <>
                                <SectionHeader title="Scope 2: Storage Facilities" />
                                <InputRow label="Electricity used for lighting (kWh)" name="elecLightingKwh" value={fac.elecLightingKwh} onChange={h} />
                                <InputRow label="Electricity used for refrigeration (kWh)" name="elecRefrigerationKwh" value={fac.elecRefrigerationKwh} onChange={h} />
                                <InputRow label="Electricity in automated storage (kWh)" name="elecAutomatedStorageKwh" value={fac.elecAutomatedStorageKwh} onChange={h} />
                                <InputRow label="Electricity used for HVAC (kWh)" name="elecHvacKwh" value={fac.elecHvacKwh} onChange={h} />
                            </>
                        )}
                        {fac.type === 'office' && (
                            <>
                                <SectionHeader title="Scope 2: Corporate Offices" />
                                <InputRow label="Electricity used in office operations (kWh)" name="elecOfficesKwh" value={fac.elecOfficesKwh} onChange={h} />
                                <InputRow label="Electricity used for HVAC (kWh)" name="elecHvacKwh" value={fac.elecHvacKwh} onChange={h} />
                                <InputRow label="Electricity used in IT infrastructure (kWh)" name="elecItKwh" value={fac.elecItKwh} onChange={h} />
                            </>
                        )}
                        {fac.type === 'retail' && (
                            <>
                                <SectionHeader title="Scope 2: Storefront Grid" />
                                <InputRow label="Electricity used in lighting (kWh)" name="elecLightingKwh" value={fac.elecLightingKwh} onChange={h} />
                                <InputRow label="Electricity used in refrigeration (kWh)" name="elecRefrigerationKwh" value={fac.elecRefrigerationKwh} onChange={h} />
                                <InputRow label="Electricity used in HVAC (kWh)" name="elecHvacKwh" value={fac.elecHvacKwh} onChange={h} />
                            </>
                        )}
                        {fac.type === 'datacenter' && (
                            <>
                                <SectionHeader title="Scope 2: IT Infrastructure" />
                                <InputRow label="Electricity used by servers (kWh)" name="elecServersKwh" value={fac.elecServersKwh} onChange={h} />
                                <InputRow label="Electricity used by cooling systems (kWh)" name="elecCoolingKwh" value={fac.elecCoolingKwh} onChange={h} />
                                <InputRow label="Electricity used in UPS systems (kWh)" name="elecUpsKwh" value={fac.elecUpsKwh} onChange={h} />
                                <InputRow label="Electricity used in power distribution (kWh)" name="elecPduKwh" value={fac.elecPduKwh} onChange={h} />
                            </>
                        )}
                        {fac.type === 'bank' && (
                            <>
                                <SectionHeader title="Scope 2: Branch Energy" />
                                <InputRow label="Electricity used in branch ops (kWh)" name="elecOfficesKwh" value={fac.elecOfficesKwh} onChange={h} />
                                <InputRow label="Electricity used in ATMs (kWh)" name="elecAtmsKwh" value={fac.elecAtmsKwh} onChange={h} />
                                <InputRow label="Electricity used in data infra (kWh)" name="elecItKwh" value={fac.elecItKwh} onChange={h} />
                            </>
                        )}
                        {fac.type === 'logistics' && (
                            <>
                                <SectionHeader title="Scope 2: Depot Grid" />
                                <InputRow label="Electricity used in warehouses (kWh)" name="elecWarehouseKwh" value={fac.elecWarehouseKwh} onChange={h} />
                                <InputRow label="Electricity used in offices (kWh)" name="elecOfficesKwh" value={fac.elecOfficesKwh} onChange={h} />
                            </>
                        )}
                        {fac.type === 'lab' && (
                            <>
                                <SectionHeader title="Scope 2: Research Facilities" />
                                <InputRow label="Electricity used for lab equipment (kWh)" name="elecLabEquipmentKwh" value={fac.elecLabEquipmentKwh} onChange={h} />
                                <InputRow label="Electricity used for ventilation (kWh)" name="elecVentilationKwh" value={fac.elecVentilationKwh} onChange={h} />
                            </>
                        )}
                        {fac.type === 'hospital' && (
                            <>
                                <SectionHeader title="Scope 2: Medical Grid" />
                                <InputRow label="Electricity used in medical equip (kWh)" name="elecMedicalEquipmentKwh" value={fac.elecMedicalEquipmentKwh} onChange={h} />
                                <InputRow label="Electricity used in HVAC (kWh)" name="elecHvacKwh" value={fac.elecHvacKwh} onChange={h} />
                                <InputRow label="Electricity used in laboratories (kWh)" name="elecLabEquipmentKwh" value={fac.elecLabEquipmentKwh} onChange={h} />
                            </>
                        )}
                        {fac.type === 'hotel' && (
                            <>
                                <SectionHeader title="Scope 2: Hospitality Base" />
                                <InputRow label="Electricity used in guest rooms (kWh)" name="elecGuestRoomsKwh" value={fac.elecGuestRoomsKwh} onChange={h} />
                                <InputRow label="Electricity used in laundry (kWh)" name="elecLaundryKwh" value={fac.elecLaundryKwh} onChange={h} />
                                <InputRow label="Electricity used in HVAC (kWh)" name="elecHvacKwh" value={fac.elecHvacKwh} onChange={h} />
                                <InputRow label="Electricity used in kitchens (kWh)" name="elecKitchensKwh" value={fac.elecKitchensKwh} onChange={h} />
                            </>
                        )}
                        {fac.type === 'campus' && (
                            <>
                                <SectionHeader title="Scope 2: School Grid" />
                                <InputRow label="Electricity used in buildings (kWh)" name="elecOfficesKwh" value={fac.elecOfficesKwh} onChange={h} />
                                <InputRow label="Electricity used in laboratories (kWh)" name="elecLabEquipmentKwh" value={fac.elecLabEquipmentKwh} onChange={h} />
                            </>
                        )}
                        {fac.type === 'mining' && (
                            <>
                                <SectionHeader title="Scope 2: Site Grid" />
                                <InputRow label="Electricity used in mining ops (kWh)" name="elecMiningKwh" value={fac.elecMiningKwh} onChange={h} />
                            </>
                        )}
                        {fac.type === 'agriculture' && (
                            <>
                                <SectionHeader title="Scope 2: Field Grid" />
                                <InputRow label="Electricity used for irrigation (kWh)" name="elecIrrigationKwh" value={fac.elecIrrigationKwh} onChange={h} />
                            </>
                        )}
                        {fac.type === 'powerplant' && (
                            <>
                                <SectionHeader title="Scope 2: Generation Ops" />
                                <InputRow label="Electricity used in plant ops (kWh)" name="elecPlantOpsKwh" value={fac.elecPlantOpsKwh} onChange={h} />
                            </>
                        )}
                        {fac.type === 'construction' && (
                            <>
                                <SectionHeader title="Scope 2: Temporary Site Power" />
                                <InputRow label="Electricity used onsite (kWh)" name="elecConstructionKwh" value={fac.elecConstructionKwh} onChange={h} />
                            </>
                        )}
                    </div>
                );
            case 3:
                return (
                    <div style={{ height: '500px', overflowY: 'auto', paddingRight: '1rem' }}>
                        {fac.type === 'manufacturing' && (
                            <>
                                <SectionHeader title="Facility Scope 3: Procurement & Travel" />
                                <InputRow label="Raw materials purchased (tonnes)" name="c4RawMaterialsTonnes" value={fac.c4RawMaterialsTonnes} onChange={h} />
                                <InputRow label="Raw material transport distance (km)" name="c4RawMaterialsDist" value={fac.c4RawMaterialsDist} onChange={h} />
                                <InputRow label="Waste sent to landfill (tonnes)" name="c5Landfill" value={fac.c5Landfill} onChange={h} />
                                <InputRow label="Waste recycled (tonnes)" name="c5Recycled" value={fac.c5Recycled} onChange={h} />
                                <InputRow label="Hazardous waste generated (tonnes)" name="c5Hazardous" value={fac.c5Hazardous} onChange={h} />
                                <InputRow label="Employee commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
                                <InputRow label="Business travel (km/yr)" name="c6FlightDist" value={fac.c6FlightDist} onChange={h} />
                                <InputRow label="Distribution of finished goods (km)" name="c9FinishedGoodsDist" value={fac.c9FinishedGoodsDist} onChange={h} />
                            </>
                        )}
                        {fac.type === 'warehouse' && (
                            <>
                                <SectionHeader title="Facility Scope 3: Logistics" />
                                <InputRow label="Goods transported to warehouse (km)" name="c4RawMaterialsDist" value={fac.c4RawMaterialsDist} onChange={h} />
                                <InputRow label="Goods transported from warehouse (km)" name="c9FinishedGoodsDist" value={fac.c9FinishedGoodsDist} onChange={h} />
                                <InputRow label="Packaging materials used (tonnes)" name="packagingMaterialsTonnes" value={fac.packagingMaterialsTonnes} onChange={h} />
                                <InputRow label="Waste from packaging (tonnes)" name="c5Landfill" value={fac.c5Landfill} onChange={h} />
                                <InputRow label="Employee commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
                            </>
                        )}
                        {fac.type === 'office' && (
                            <>
                                <SectionHeader title="Facility Scope 3: Operations" />
                                <InputRow label="Employee commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
                                <InputRow label="Business travel (flight km/yr)" name="c6FlightDist" value={fac.c6FlightDist} onChange={h} />
                                <InputRow label="Business travel (train km/yr)" name="c6TrainDist" value={fac.c6TrainDist} onChange={h} />
                                <InputRow label="Taxi travel (km/yr)" name="c6TaxiDist" value={fac.c6TaxiDist} onChange={h} />
                                <InputRow label="Office equipment purchases ($)" name="officeEquipmentSpend" value={fac.officeEquipmentSpend} onChange={h} />
                                <InputRow label="Paper consumption (kg/yr)" name="paperConsumptionKg" value={fac.paperConsumptionKg} onChange={h} />
                                <InputRow label="Waste generation (tonnes/yr)" name="c5Landfill" value={fac.c5Landfill} onChange={h} />
                                <InputRow label="Water consumption (m³/yr)" name="waterConsumptionM3" value={fac.waterConsumptionM3} onChange={h} />
                            </>
                        )}
                        {fac.type === 'retail' && (
                            <>
                                <SectionHeader title="Facility Scope 3: Store Supply" />
                                <InputRow label="Goods purchased for resale (tonnes)" name="goodsPurchasedResale" value={fac.goodsPurchasedResale} onChange={h} />
                                <InputRow label="Transport of goods to store (km)" name="c4RawMaterialsDist" value={fac.c4RawMaterialsDist} onChange={h} />
                                <InputRow label="Packaging waste (tonnes)" name="c5Landfill" value={fac.c5Landfill} onChange={h} />
                                <InputRow label="Customer transportation (km/yr)" name="customerTransportDist" value={fac.customerTransportDist} onChange={h} />
                                <InputRow label="Employee commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
                            </>
                        )}
                        {fac.type === 'datacenter' && (
                            <>
                                <SectionHeader title="Facility Scope 3: Capital & Cloud" />
                                <InputRow label="IT hardware manufacturing emissions" name="itHardwareEmissions" value={fac.itHardwareEmissions} onChange={h} />
                                <InputRow label="Server replacement lifecycle emissions" name="serverLifecycleEmissions" value={fac.serverLifecycleEmissions} onChange={h} />
                                <InputRow label="Cloud infrastructure emissions" name="cloudInfraEmissions" value={fac.cloudInfraEmissions} onChange={h} />
                                <InputRow label="Employee commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
                                <InputRow label="Business travel (km/yr)" name="c6FlightDist" value={fac.c6FlightDist} onChange={h} />
                            </>
                        )}
                        {fac.type === 'bank' && (
                            <>
                                <SectionHeader title="Facility Scope 3: Local Overheads" />
                                <InputRow label="Employee commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
                                <InputRow label="Business travel (km/yr)" name="c6FlightDist" value={fac.c6FlightDist} onChange={h} />
                                <InputRow label="Paper consumption (kg/yr)" name="paperConsumptionKg" value={fac.paperConsumptionKg} onChange={h} />
                                <InputRow label="IT equipment purchases ($)" name="officeEquipmentSpend" value={fac.officeEquipmentSpend} onChange={h} />
                                <InputRow label="Waste generation (tonnes/yr)" name="c5Landfill" value={fac.c5Landfill} onChange={h} />
                            </>
                        )}
                        {fac.type === 'logistics' && (
                            <>
                                <SectionHeader title="Facility Scope 3: Hub Dependencies" />
                                <InputRow label="Subcontracted transport (km)" name="subcontractedTransportDist" value={fac.subcontractedTransportDist} onChange={h} />
                                <InputRow label="Packaging materials (tonnes/yr)" name="packagingMaterialsTonnes" value={fac.packagingMaterialsTonnes} onChange={h} />
                                <InputRow label="Waste generated (tonnes/yr)" name="c5Landfill" value={fac.c5Landfill} onChange={h} />
                                <InputRow label="Employee commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
                            </>
                        )}
                        {fac.type === 'lab' && (
                            <>
                                <SectionHeader title="Facility Scope 3: Lab Overhead" />
                                <InputRow label="Chemical purchases ($)" name="chemicalPurchases$" value={fac.chemicalPurchases$} onChange={h} />
                                <InputRow label="Hazardous waste disposal (tonnes)" name="c5Hazardous" value={fac.c5Hazardous} onChange={h} />
                                <InputRow label="Staff commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
                                <InputRow label="Business travel (km/yr)" name="c6FlightDist" value={fac.c6FlightDist} onChange={h} />
                            </>
                        )}
                        {fac.type === 'hospital' && (
                            <>
                                <SectionHeader title="Facility Scope 3: Patient & Care" />
                                <InputRow label="Pharmaceutical supply chain ($)" name="pharmaceuticalSupply$" value={fac.pharmaceuticalSupply$} onChange={h} />
                                <InputRow label="Medical equipment purchases ($)" name="medicalEquipSpend" value={fac.medicalEquipSpend} onChange={h} />
                                <InputRow label="Medical waste disposal (tonnes)" name="c5Hazardous" value={fac.c5Hazardous} onChange={h} />
                                <InputRow label="Staff commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
                                <InputRow label="Patient travel (km/yr)" name="patientTravelDist" value={fac.patientTravelDist} onChange={h} />
                            </>
                        )}
                        {fac.type === 'hotel' && (
                            <>
                                <SectionHeader title="Facility Scope 3: Guest Needs" />
                                <InputRow label="Food procurement spend ($)" name="foodProcurement$" value={fac.foodProcurement$} onChange={h} />
                                <InputRow label="Laundry services spend ($)" name="laundryServicesSpend" value={fac.laundryServicesSpend} onChange={h} />
                                <InputRow label="Guest waste generation (tonnes)" name="c5Landfill" value={fac.c5Landfill} onChange={h} />
                                <InputRow label="Staff commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
                                <InputRow label="Tourism transportation (km/yr)" name="tourismTransportDist" value={fac.tourismTransportDist} onChange={h} />
                            </>
                        )}
                        {fac.type === 'campus' && (
                            <>
                                <SectionHeader title="Facility Scope 3: School Logistics" />
                                <InputRow label="Student commuting (km/yr)" name="studentCommutingDist" value={fac.studentCommutingDist} onChange={h} />
                                <InputRow label="Staff commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
                                <InputRow label="Campus waste (tonnes/yr)" name="c5Landfill" value={fac.c5Landfill} onChange={h} />
                                <InputRow label="Paper consumption (kg/yr)" name="paperConsumptionKg" value={fac.paperConsumptionKg} onChange={h} />
                            </>
                        )}
                        {fac.type === 'mining' && (
                            <>
                                <SectionHeader title="Facility Scope 3: Mining Ops" />
                                <InputRow label="Transportation of extracted materials (km)" name="c9FinishedGoodsDist" value={fac.c9FinishedGoodsDist} onChange={h} />
                                <InputRow label="Waste rock disposal (tonnes)" name="wasteRockTonnes" value={fac.wasteRockTonnes} onChange={h} />
                                <InputRow label="Employee commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
                            </>
                        )}
                        {fac.type === 'agriculture' && (
                            <>
                                <SectionHeader title="Facility Scope 3: Farm Support" />
                                <InputRow label="Crop transportation (km)" name="c9FinishedGoodsDist" value={fac.c9FinishedGoodsDist} onChange={h} />
                                <InputRow label="Agricultural waste (tonnes)" name="agriculturalWasteTonnes" value={fac.agriculturalWasteTonnes} onChange={h} />
                                <InputRow label="Worker commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
                            </>
                        )}
                        {fac.type === 'powerplant' && (
                            <>
                                <SectionHeader title="Facility Scope 3: Plant Operations" />
                                <InputRow label="Fuel extraction emissions" name="c4RawMaterialsTonnes" value={fac.c4RawMaterialsTonnes} onChange={h} />
                                <InputRow label="Transmission losses" name="c9FinishedGoodsTonnes" value={fac.c9FinishedGoodsTonnes} onChange={h} />
                            </>
                        )}
                        {fac.type === 'construction' && (
                            <>
                                <SectionHeader title="Facility Scope 3: Building Upstream" />
                                <InputRow label="Construction materials purchased ($)" name="constructionMaterialsSpend" value={fac.constructionMaterialsSpend} onChange={h} />
                                <InputRow label="Transportation of materials (km)" name="c4RawMaterialsDist" value={fac.c4RawMaterialsDist} onChange={h} />
                                <InputRow label="Waste from construction (tonnes)" name="c5Landfill" value={fac.c5Landfill} onChange={h} />
                            </>
                        )}
                    </div>
                );
            default: return null;
        }
    };

    const s = data.sector;
    const isAllHub = step === 'hub';
    const isEditingFacility = activeFacilityId !== null;

    return (
        <div className="container" style={{ maxWidth: step === 'results' ? '1100px' : '800px', margin: '0 auto', transition: 'max-width 0.3s ease' }}>
            {step === 'hub' && !isEditingFacility && (
                <button onClick={onBack} style={{ marginBottom: '0.75rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ChevronLeft size={16} /> Exit Calculator
                </button>
            )}

            <header className="header" style={{ marginBottom: 'clamp(1rem, 4vw, 2rem)' }}>
                <h1>GHG Protocol Hub</h1>
                {step === 'hub' && !isEditingFacility && <p>ISO 14064 Facility-Based Architecture</p>}
            </header>

            {/* MAIN APP ROUTER */}
            <main className="glass-panel" style={{ padding: 'clamp(1.2rem, 4vw, 2rem)', borderColor: s ? 'var(--card-border)' : 'var(--danger)' }}>
                
                {/* --- APP STEP 1: ORGANIZATION --- */}
                {step === 'org' && (
                    <div className="form-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 'clamp(1rem, 4vw, 2rem)', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '600' }}>
                            <Building2 size={18} /> <h2>Organization Profile</h2>
                        </div>
                        <InputRow label="Corporate Entity Name" name="orgName" type="text" value={data.orgName} onChange={handleOrgInput} />
                        <InputRow label="Total Global Employees" name="employeesTotal" value={data.employeesTotal} onChange={handleOrgInput} />
                        <InputRow label="Global Annual Revenue ($M)" name="revenue" value={data.revenue} onChange={handleOrgInput} />
                        
                        <div className="form-group" style={{ margin: '1rem 0' }}>
                            <label>Primary Industry Sector</label>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem', marginTop: '0.5rem' }}>
                                {SECTORS.map(type => (
                                    <label key={type.id} style={{ padding: '0.6rem', background: s === type.id ? 'rgba(239, 68, 68, 0.15)' : 'rgba(0,0,0,0.2)', border: `1px solid ${s === type.id ? 'var(--danger)' : 'var(--card-border)'}`, borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', transition: 'all 0.2s', fontSize: '0.85rem' }}>
                                        <input type="radio" name="sector" value={type.id} checked={s === type.id} onChange={handleOrgInput} style={{ accentColor: 'var(--danger)' }} />
                                        <span style={{ color: 'var(--text-primary)' }}>{type.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {s && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'clamp(1rem, 4vw, 2rem)' }}>
                                <button onClick={onBack} className="secondary-btn"><ArrowLeft size={16} /> Back to Home</button>
                                <button onClick={() => setStep('hub')} className="primary-btn">Begin Facility Analysis <ChevronRight size={16} /></button>
                            </div>
                        )}
                        {!s && (
                            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 'clamp(1rem, 4vw, 2rem)' }}>
                                <button onClick={onBack} className="secondary-btn"><ArrowLeft size={16} /> Back to Home</button>
                            </div>
                        )}
                    </div>
                )}

                {/* --- APP STEP 2: HYBRID DASHBOARD (THE HUB) --- */}
                {isAllHub && !isEditingFacility && (
                    <div className="form-content">
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'clamp(1rem, 4vw, 2rem)' }}>
                            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>
                                <Globe size={18} color="var(--danger)" /> Facilities Network
                            </h2>
                            <button onClick={addFacility} style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.4rem 0.8rem', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                <Plus size={14} /> Add Physical Location
                            </button>
                        </div>

                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'clamp(0.75rem, 3vw, 1.5rem)', lineHeight: 1.5 }}>
                            Scopes 1, 2, and localized Scope 3 metrics (commuting, waste, travel) are mapped directly to physical facilities. Click into each facility to configure its emissions payload.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: 'clamp(1rem, 4vw, 2rem)' }}>
                            {data.facilities.map(fac => (
                                <div key={fac.id} style={{ padding: 'clamp(1rem, 3vw, 1.5rem)', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--card-border)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Factory size={14} color="var(--text-secondary)" /> {fac.name}
                                        </h3>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Type: {fac.type} | {fac.employees} Staff</p>
                                    </div>
                                    <button 
                                        onClick={() => setActiveFacilityId(fac.id)}
                                        style={{ 
                                            background: fac.isComplete ? 'rgba(16, 185, 129, 0.15)' : 'var(--danger)', 
                                            border: 'none', color: fac.isComplete ? '#10b981' : '#fff', padding: '0.4rem 0.8rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500'
                                        }}
                                    >
                                        {fac.isComplete ? <><CheckCircle size={14} /> Data Ready</> : 'Enter Data'}
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem' }}>
                            <button onClick={() => setStep('org')} className="secondary-btn"><ChevronLeft size={16} /> Back</button>
                            <button onClick={() => setStep('org_scope3')} disabled={!data.facilities.every(f => f.isComplete)} style={{ padding: '0.6rem 1.2rem', background: data.facilities.every(f => f.isComplete) ? 'var(--danger)' : 'rgba(255,255,255,0.1)', border: 'none', color: '#fff', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: data.facilities.every(f => f.isComplete) ? 'pointer' : 'not-allowed' }}>
                                Proceed to Org-Level Emissions <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}

                {/* --- SUB_WIZARD: EDITING FACILITY DATA --- */}
                {isEditingFacility && (
                    <div className="form-content">
                        {(() => {
                            const fac = data.facilities.find(f => f.id === activeFacilityId);
                            const facSteps = ['Details', 'Scope 1', 'Scope 2', 'Scope 3 (Local)'];
                            return (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: 'clamp(0.75rem, 3vw, 1.5rem)' }}>
                                        <button onClick={() => setActiveFacilityId(null)} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0' }}><ArrowLeft size={16} /></button>
                                        <h2 style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>Configuring: <span style={{ color: 'var(--danger)' }}>{fac.name}</span></h2>
                                    </div>
                                    
                                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: 'clamp(1rem, 4vw, 2rem)' }}>
                                        {facSteps.map((s, i) => (
                                            <div key={i} style={{ flex: 1, height: '4px', background: i <= facilityStep ? 'var(--danger)' : 'var(--card-border)', borderRadius: '2px' }}></div>
                                        ))}
                                    </div>

                                    {renderFacilityStep(fac)}

                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--card-border)', marginTop: 'clamp(0.75rem, 3vw, 1.5rem)', paddingTop: '1.5rem' }}>
                                        <button onClick={() => setFacilityStep(p => Math.max(0, p-1))} disabled={facilityStep === 0} className="secondary-btn">Back</button>
                                        {facilityStep < facSteps.length - 1 ? (
                                            <button onClick={() => setFacilityStep(p => p+1)} className="primary-btn">Next <ChevronRight size={16} /></button>
                                        ) : (
                                            <button onClick={() => closeFacilityWizard(fac.id)} className="primary-btn" style={{ background: '#10b981' }}><CheckCircle size={16} /> Save & Return to Hub</button>
                                        )}
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                )}

                {/* --- APP STEP 3: ORGANIZATION LEVEL SCOPE 3 --- */}
                {step === 'org_scope3' && (
                    <div className="form-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 'clamp(1rem, 4vw, 2rem)', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '600' }}>
                            <Truck size={18} /> <h2>Organization-Level Upstream/Downstream</h2>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'clamp(0.75rem, 3vw, 1.5rem)', lineHeight: 1.5 }}>
                            These Scope 3 emissions map across the entire value chain rather than tying to specific facilities.
                        </p>
                        
                        <div style={{ height: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
                            <SectionHeader title="Category 1: Purchased Goods" />
                            <InputRow label="Total spend on goods (USD)" name="c1Spend" value={data.c1Spend} onChange={handleOrgInput} />
                            
                            <SectionHeader title="Category 2: Capital Goods" />
                            <InputRow label="Purchased Machinery (USD Spend)" name="c2Machinery" value={data.c2Machinery} onChange={handleOrgInput} />
                            <InputRow label="Purchased IT Equip (USD Spend)" name="c2IT" value={data.c2IT} onChange={handleOrgInput} />

                            <SectionHeader title="Category 11: Use of Sold Products" />
                            <InputRow label="Lifetime product power use (kWh/yr)" name="c11ProductEnergy" value={data.c11ProductEnergy} onChange={handleOrgInput} />

                            <SectionHeader title="Category 15: Corporate Investments" />
                            <InputRow label="Investments in equities (USD Millions)" name="c15InvestEquity" value={data.c15InvestEquity} onChange={handleOrgInput} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--card-border)', marginTop: 'clamp(1rem, 4vw, 2rem)', paddingTop: '1.5rem' }}>
                            <button onClick={() => setStep('hub')} className="secondary-btn"><ChevronLeft size={16} /> Back to Facilities</button>
                            <button onClick={() => setStep('results')} className="primary-btn">Calculate ESG Report <Activity size={16} /></button>
                        </div>
                    </div>
                )}

                {/* --- APP STEP 4: SECTOR MODULES --- */}
                {step === 'sector_modules' && s && ['finance', 'tech', 'agriculture', 'logistics', 'hospitality', 'healthcare'].includes(s) && (
                    <div className="form-content">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: 'clamp(1rem, 4vw, 2rem)', color: 'var(--text-primary)', fontSize: '1.1rem', fontWeight: '600' }}>
                            <Briefcase size={18} /> <h2>Sector-Specific Overrides</h2>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 'clamp(0.75rem, 3vw, 1.5rem)', lineHeight: 1.5 }}>
                            Provide industry-specific scaling factors required by your sector.
                        </p>
                        
                        {s === 'finance' && (
                            <div style={{ height: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
                                <SectionHeader title="Banking & Financial Institutions" />
                                <InputRow label="Total financed emissions (tCO2e)" name="bankFinancedTotal" value={data.bankFinancedTotal} onChange={handleOrgInput} />
                                <InputRow label="Corporate lending exposure (tCO2e)" name="bankCorporateExposure" value={data.bankCorporateExposure} onChange={handleOrgInput} />
                                <InputRow label="Retail lending exposure (tCO2e)" name="bankRetailExposure" value={data.bankRetailExposure} onChange={handleOrgInput} />
                                <InputRow label="Investment portfolio (tCO2e)" name="bankInvestments" value={data.bankInvestments} onChange={handleOrgInput} />
                                <InputRow label="Asset management portfolio (tCO2e)" name="bankAssetMgmt" value={data.bankAssetMgmt} onChange={handleOrgInput} />
                            </div>
                        )}

                        {s === 'tech' && (
                            <div style={{ height: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
                                <SectionHeader title="Data Centers / IT" />
                                <InputRow label="Server electricity (kWh)" name="techServerKwh" value={data.techServerKwh} onChange={handleOrgInput} />
                                <InputRow label="Cooling electricity (kWh)" name="techCoolingKwh" value={data.techCoolingKwh} onChange={handleOrgInput} />
                                <InputRow label="Backup generator fuel (L)" name="techBackupL" value={data.techBackupL} onChange={handleOrgInput} />
                                <InputRow label="Cloud infra (tCO2e)" name="techCloudEmissions" value={data.techCloudEmissions} onChange={handleOrgInput} />
                            </div>
                        )}

                        {s === 'agriculture' && (
                            <div style={{ height: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
                                <SectionHeader title="Agriculture" />
                                <InputRow label="Livestock heads" name="agLivestock" value={data.agLivestock} onChange={handleOrgInput} />
                                <InputRow label="Fertilizer use (tonnes)" name="agFertilizer" value={data.agFertilizer} onChange={handleOrgInput} />
                                <InputRow label="Soil emissions (tCO2e)" name="agSoil" value={data.agSoil} onChange={handleOrgInput} />
                            </div>
                        )}

                        {s === 'logistics' && (
                            <div style={{ height: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
                                <SectionHeader title="Logistics" />
                                <InputRow label="Fleet vehicle fuel (Litres)" name="logFleetL" value={data.logFleetL} onChange={handleOrgInput} />
                                <InputRow label="Distance travelled (km)" name="logDist" value={data.logDist} onChange={handleOrgInput} />
                                <InputRow label="Average load factor (%)" name="logLoad" value={data.logLoad} onChange={handleOrgInput} />
                            </div>
                        )}

                        {s === 'hospitality' && (
                            <div style={{ height: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
                                <SectionHeader title="Hospitality" />
                                <InputRow label="Guest electricity (kWh)" name="hospGuestKwh" value={data.hospGuestKwh} onChange={handleOrgInput} />
                                <InputRow label="Laundry operations (kWh)" name="hospLaundry" value={data.hospLaundry} onChange={handleOrgInput} />
                                <InputRow label="Food procurement (USD)" name="hospFood" value={data.hospFood} onChange={handleOrgInput} />
                            </div>
                        )}

                        {s === 'healthcare' && (
                            <div style={{ height: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
                                <SectionHeader title="Healthcare" />
                                <InputRow label="Medical gas (tCO2e)" name="healthMedicalGas" value={data.healthMedicalGas} onChange={handleOrgInput} />
                                <InputRow label="Pharma spend (USD)" name="healthPharma" value={data.healthPharma} onChange={handleOrgInput} />
                                <InputRow label="Medical waste (tonnes)" name="healthWaste" value={data.healthWaste} onChange={handleOrgInput} />
                            </div>
                        )}

                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--card-border)', marginTop: 'clamp(1rem, 4vw, 2rem)', paddingTop: '1.5rem' }}>
                            <button onClick={() => setStep('org_scope3')} className="secondary-btn"><ChevronLeft size={16} /> Back to Scope 3</button>
                            <button onClick={() => setStep('results')} className="primary-btn">Calculate ESG Report <Activity size={16} /></button>
                        </div>
                    </div>
                )}

                {/* --- APP STEP 5: RESULTS DASHBOARD --- */}
                {step === 'results' && (() => {
                    const e = calculateIndustryEmissions(data);
                    const fmt = (n, d=1) => (n||0).toLocaleString(undefined, { maximumFractionDigits: d });
                    const pct = (v, t) => t > 0 ? ((v/t)*100).toFixed(0) : 0;
                    
                    const statusColors = { leader: '#10b981', average: '#f59e0b', 'above-average': '#f97316', critical: '#ef4444' };
                    const statusLabels = { leader: '🏆 Industry Leader', average: '📊 Average', 'above-average': '⚠️ Above Average', critical: '🚨 Critical' };
                    
                    // Benchmark gauge: calculate position 0-100 of user value across scale
                    const bmScale = e.benchmark.high * 1.5;
                    const bmPos = Math.min((e.benchmark.userValue / bmScale) * 100, 100);
                    const bmLowPos = (e.benchmark.low / bmScale) * 100;
                    const bmAvgPos = (e.benchmark.avg / bmScale) * 100;
                    const bmHighPos = (e.benchmark.high / bmScale) * 100;

                    const sectionStyle = { marginBottom: 'clamp(1rem, 4vw, 2rem)' };
                    const cardStyle = { background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', borderRadius: '12px', padding: 'clamp(1rem, 3vw, 1.5rem)' };
                    const sectionTitle = (icon, title) => (
                        <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                            {icon} {title}
                        </h3>
                    );

                    return (
                        <div style={{ padding: '0' }}>
                            {/* Back nav */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'clamp(0.75rem, 3vw, 1.5rem)' }}>
                                <button onClick={() => setStep('org_scope3')} style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <ArrowLeft size={16}/> Back
                                </button>
                                <button onClick={() => window.print()} style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '0.4rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>
                                    <Download size={14}/> Download Report
                                </button>
                            </div>

                            {/* ===== 1. EXECUTIVE SUMMARY ===== */}
                            <div style={sectionStyle}>
                                {sectionTitle(<Activity size={16} color="var(--danger)"/>, 'Executive Summary')}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                                    {[
                                        { label: 'Total Corporate Footprint', value: fmt(e.tonnes.total), unit: 'tCO₂e/yr', color: '#ef4444', sub: `${data.facilities.length} facility locations` },
                                        { label: 'Emissions per Employee', value: fmt(e.dashboard.perEmployeeTonnes), unit: 'tCO₂e / person', color: '#f59e0b', sub: `${data.employeesTotal || 0} total employees` },
                                        { label: 'Revenue Intensity', value: fmt(e.dashboard.revenueIntensity, 2), unit: 'tCO₂e / $1M', color: '#8b5cf6', sub: `$${fmt(data.revenue)}M annual revenue` },
                                        { label: 'Scope 3 Share', value: fmt(e.dashboard.scope3Pct, 0), unit: '% of total', color: '#10b981', sub: `${fmt(e.tonnes.scope3)} tCO₂e value chain` },
                                    ].map(m => (
                                        <div key={m.label} style={{ ...cardStyle, textAlign: 'center', borderColor: m.color + '33' }}>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.5rem' }}>{m.label}</p>
                                            <div style={{ fontSize: '2.2rem', fontWeight: '700', color: m.color, lineHeight: 1 }}>{m.value}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{m.unit}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem', opacity: 0.7 }}>{m.sub}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ===== 2. SCOPE BREAKDOWN ===== */}
                            <div style={sectionStyle}>
                                {sectionTitle(<Zap size={16} color="var(--danger)"/>, 'Scope Breakdown')}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                    <div style={cardStyle}>
                                        {[
                                            { label: 'Scope 1 — Direct', t: e.tonnes.scope1, color: '#ef4444' },
                                            { label: 'Scope 2 — Energy Indirect', t: e.tonnes.scope2, color: '#f59e0b' },
                                            { label: 'Scope 3 — Value Chain', t: e.tonnes.scope3, color: '#10b981' },
                                        ].map(s => (
                                            <div key={s.label} style={{ marginBottom: '1.25rem' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                                                    <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{s.label}</span>
                                                    <span style={{ color: s.color, fontWeight: '600' }}>{fmt(s.t)} t ({pct(s.t, e.tonnes.total)}%)</span>
                                                </div>
                                                <div style={{ height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' }}>
                                                    <div style={{ width: `${pct(s.t, e.tonnes.total)}%`, height: '100%', background: s.color, borderRadius: '4px', transition: 'width 0.6s ease' }}/>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <div style={{ height: '180px', width: '100%' }}>
                                            <ResponsiveContainer>
                                                <PieChart>
                                                    <Pie data={e.chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={3} dataKey="value" stroke="none">
                                                        {e.chartData.map((entry, i) => <Cell key={i} fill={entry.fill}/>)}
                                                    </Pie>
                                                    <Tooltip formatter={(v) => [`${(v/1000).toFixed(1)} tCO₂e`]} contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', fontSize: '0.8rem' }} itemStyle={{ color: 'var(--text-primary)' }}/>
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center' }}>
                                            {e.chartData.map(d => (
                                                <span key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: d.fill, display: 'inline-block'}}/>
                                                    {d.name.replace('S3: ', '')}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ===== 3. EMISSIONS BY FACILITY ===== */}
                            {e.facilityEmissions.length > 0 && (
                                <div style={sectionStyle}>
                                    {sectionTitle(<Building2 size={16} color="var(--danger)"/>, 'Emissions by Facility')}
                                    <div style={cardStyle}>
                                        <div style={{ height: `${Math.max(200, e.facilityEmissions.length * 50)}px` }}>
                                            <ResponsiveContainer>
                                                <BarChart data={e.facilityEmissions} layout="vertical" margin={{ left: 80, right: 20, top: 5, bottom: 5 }}>
                                                    <XAxis type="number" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} tickFormatter={v => `${v.toFixed(0)}t`}/>
                                                    <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} width={75}/>
                                                    <Tooltip formatter={(v, n) => [`${v.toFixed(2)} tCO₂e`, n]} contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', fontSize: '0.8rem' }} itemStyle={{ color: 'var(--text-primary)' }}/>
                                                    <Legend wrapperStyle={{ fontSize: '0.8rem' }}/>
                                                    <Bar dataKey="scope1" stackId="a" fill="#ef4444" name="Scope 1" radius={[0,0,0,0]}/>
                                                    <Bar dataKey="scope2" stackId="a" fill="#f59e0b" name="Scope 2" radius={[0,0,0,0]}/>
                                                    <Bar dataKey="scope3" stackId="a" fill="#10b981" name="Scope 3" radius={[0,4,4,0]}/>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ===== 4. EMISSIONS BY ACTIVITY ===== */}
                            {e.activityChartData.length > 0 && (
                                <div style={sectionStyle}>
                                    {sectionTitle(<Factory size={16} color="var(--danger)"/>, 'Emissions by Activity')}
                                    <div style={cardStyle}>
                                        <div style={{ height: `${Math.max(220, e.activityChartData.length * 38)}px` }}>
                                            <ResponsiveContainer>
                                                <BarChart data={e.activityChartData} layout="vertical" margin={{ left: 120, right: 60, top: 5, bottom: 5 }}>
                                                    <XAxis type="number" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} tickFormatter={v => `${v.toFixed(0)}t`}/>
                                                    <YAxis type="category" dataKey="name" tick={{ fill: 'var(--text-secondary)', fontSize: 11 }} width={115}/>
                                                    <Tooltip formatter={(v) => [`${v.toFixed(2)} tCO₂e`]} contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', fontSize: '0.8rem' }} itemStyle={{ color: 'var(--text-primary)' }}/>
                                                    <Bar dataKey="value" radius={[0,4,4,0]}>
                                                        {e.activityChartData.map((entry, i) => <Cell key={i} fill={entry.fill}/>)}
                                                        <LabelList dataKey="value" position="right" formatter={v => v > 0 ? `${v.toFixed(1)}t` : ''} style={{ fill: 'var(--text-secondary)', fontSize: 10 }}/>
                                                    </Bar>
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ===== 5. SCOPE 3 BREAKDOWN ===== */}
                            {e.scope3ChartData.length > 0 && (
                                <div style={sectionStyle}>
                                    {sectionTitle(<Globe size={16} color="var(--danger)"/>, 'Scope 3 Breakdown (GHG Protocol Categories)')}
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                        <div style={{ ...cardStyle, height: '320px' }}>
                                            <ResponsiveContainer>
                                                <PieChart>
                                                    <Pie data={e.scope3ChartData} cx="50%" cy="50%" outerRadius={100} paddingAngle={2} dataKey="value" stroke="none">
                                                        {e.scope3ChartData.map((entry, i) => <Cell key={i} fill={entry.fill}/>)}
                                                    </Pie>
                                                    <Tooltip formatter={(v) => [`${v.toFixed(2)} tCO₂e`]} contentStyle={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', borderRadius: '8px', fontSize: '0.8rem' }} itemStyle={{ color: 'var(--text-primary)' }}/>
                                                </PieChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <div style={cardStyle}>
                                            {e.scope3ChartData.map(d => (
                                                <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', fontSize: '0.8rem' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
                                                        <span style={{ width: '8px', height: '8px', borderRadius: '2px', background: d.fill, display: 'inline-block', flexShrink: 0 }}/>
                                                        {d.name}
                                                    </span>
                                                    <span style={{ color: 'var(--text-primary)', fontWeight: '500', marginLeft: '0.5rem', whiteSpace: 'nowrap' }}>{fmt(d.value)} t</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* ===== 6. INDUSTRY BENCHMARK ===== */}
                            <div style={sectionStyle}>
                                {sectionTitle(<Target size={16} color="var(--danger)"/>, 'Industry Benchmark Comparison')}
                                <div style={cardStyle}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'clamp(0.75rem, 3vw, 1.5rem)' }}>
                                        <div>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.25rem' }}>Sector: <strong style={{ color: 'var(--text-primary)'}}>{e.benchmark.label}</strong></p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Your intensity: <strong style={{ color: statusColors[e.benchmark.status], fontSize: '1.1rem' }}>{fmt(e.benchmark.userValue, 1)} tCO₂e/employee/yr</strong></p>
                                        </div>
                                        <span style={{ background: statusColors[e.benchmark.status] + '22', color: statusColors[e.benchmark.status], padding: '0.3rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: '600', border: `1px solid ${statusColors[e.benchmark.status]}44` }}>
                                            {statusLabels[e.benchmark.status]}
                                        </span>
                                    </div>
                                    {/* Gauge ruler */}
                                    <div style={{ position: 'relative', height: '32px', background: 'linear-gradient(to right, #10b981 0%, #f59e0b 40%, #f97316 70%, #ef4444 100%)', borderRadius: '16px', marginBottom: 'clamp(0.75rem, 3vw, 1.5rem)' }}>
                                        {/* Markers */}
                                        {[{pos: bmLowPos, label: `Low\n${e.benchmark.low}t`}, {pos: bmAvgPos, label: `Avg\n${e.benchmark.avg}t`}, {pos: bmHighPos, label: `High\n${e.benchmark.high}t`}].map(m => (
                                            <div key={m.label} style={{ position: 'absolute', left: `${m.pos}%`, top: 0, bottom: 0, width: '2px', background: 'rgba(0,0,0,0.5)'}}/>
                                        ))}
                                        {/* User dot */}
                                        <div style={{ position: 'absolute', left: `${bmPos}%`, top: '50%', transform: 'translate(-50%, -50%)', width: '20px', height: '20px', borderRadius: '50%', background: 'white', border: '3px solid #1a1a2e', boxShadow: '0 2px 8px rgba(0,0,0,0.5)', zIndex: 2 }}/>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                        <span style={{ color: '#10b981' }}>0t (Best)</span>
                                        <span style={{ color: '#f59e0b' }}>Low: {e.benchmark.low}t</span>
                                        <span style={{ color: '#f97316' }}>Avg: {e.benchmark.avg}t</span>
                                        <span style={{ color: '#ef4444' }}>High: {e.benchmark.high}t</span>
                                    </div>
                                </div>
                            </div>

                            {/* ===== 7. CARBON INTENSITY METRICS ===== */}
                            <div style={sectionStyle}>
                                {sectionTitle(<Activity size={16} color="var(--danger)"/>, 'Carbon Intensity Metrics')}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                    {[
                                        { label: 'Per Employee', value: fmt(e.dashboard.perEmployeeTonnes, 2), unit: 'tCO₂e / employee / yr', icon: <Users size={20} color="#f59e0b"/>, color: '#f59e0b' },
                                        { label: 'Per $1M Revenue', value: fmt(e.dashboard.revenueIntensity, 2), unit: 'tCO₂e / $1M revenue', icon: <TrendingDown size={20} color="#8b5cf6"/>, color: '#8b5cf6' },
                                        { label: 'Per m² Floor Area', value: e.dashboard.floorAreaIntensity > 0 ? fmt(e.dashboard.floorAreaIntensity, 3) : '—', unit: 'tCO₂e / m² / yr', icon: <Building2 size={20} color="#10b981"/>, color: '#10b981' },
                                    ].map(m => (
                                        <div key={m.label} style={{ ...cardStyle, textAlign: 'center' }}>
                                            <div style={{ marginBottom: '0.5rem' }}>{m.icon}</div>
                                            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: m.color, lineHeight: 1.1 }}>{m.value}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>{m.unit}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem', opacity: 0.7 }}>{m.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* ===== 8. REDUCTION OPPORTUNITIES ===== */}
                            {e.reductionOpportunities.length > 0 && (
                                <div style={sectionStyle}>
                                    {sectionTitle(<TrendingDown size={16} color="var(--danger)"/>, 'Top Reduction Opportunities')}
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        {e.reductionOpportunities.map((op, i) => (
                                            <div key={i} style={{ ...cardStyle, display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: 'clamp(0.75rem, 2vw, 1rem) clamp(1rem, 3vw, 1.25rem)' }}>
                                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--danger)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.8rem', flexShrink: 0 }}>#{i+1}</div>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                                                        <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.9rem' }}>{op.name}</span>
                                                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '10px' }}>{op.scope}</span>
                                                    </div>
                                                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '0.4rem' }}>{op.tip}</p>
                                                    <div style={{ display: 'flex', gap: '0.75rem', fontSize: '0.78rem' }}>
                                                        <span style={{ color: '#ef4444' }}>Current: <strong>{fmt(op.tonnes, 1)} tCO₂e</strong></span>
                                                        <span style={{ color: '#10b981' }}>Est. saving: <strong>↓ {fmt(op.savingsTonnes, 1)} tCO₂e/yr</strong></span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ===== 9. RENEWABLE ENERGY IMPACT ===== */}
                            <div style={sectionStyle}>
                                {sectionTitle(<Sun size={16} color="var(--danger)"/>, 'Renewable Energy Impact')}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                                    {[
                                        { label: 'On-site Generation', value: fmt(e.renewable.totalKwh / 1000, 1), unit: 'MWh/yr', icon: <Sun size={20} color="#fcd34d"/>, color: '#fcd34d' },
                                        { label: 'CO₂ Avoided', value: fmt(e.renewable.offsetTonnes, 2), unit: 'tCO₂e offset', icon: <Wind size={20} color="#10b981"/>, color: '#10b981' },
                                        { label: 'Grid Coverage', value: fmt(e.renewable.pct, 1), unit: '% of electricity from renewables', icon: <Zap size={20} color="#8b5cf6"/>, color: '#8b5cf6' },
                                    ].map(m => (
                                        <div key={m.label} style={{ ...cardStyle, textAlign: 'center' }}>
                                            <div style={{ marginBottom: '0.5rem' }}>{m.icon}</div>
                                            <div style={{ fontSize: '1.8rem', fontWeight: '700', color: m.color }}>
                                                {m.value}{m.unit.includes('%') ? '%' : ''}
                                            </div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.4rem' }}>{m.unit}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.25rem', opacity: 0.7 }}>{m.label}</div>
                                        </div>
                                    ))}
                                </div>
                                {e.renewable.totalKwh === 0 && (
                                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.75rem', textAlign: 'center', fontStyle: 'italic', opacity: 0.7 }}>
                                        No on-site renewable generation entered. Add solar/wind kWh in facility Scope 2 data to see offset impact.
                                    </p>
                                )}
                            </div>

                            {/* ===== 10. REAL-WORLD EQUIVALENTS ===== */}
                            <div style={sectionStyle}>
                                {sectionTitle(<Globe size={16} color="var(--danger)"/>, 'Real-World Equivalents')}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem' }}>
                                    {[
                                        { label: 'Km driven by car', value: fmt(e.equivalents.drivingKm, 0), icon: <Car size={24} color="#f59e0b"/>, color: '#f59e0b' },
                                        { label: 'Homes powered/yr', value: fmt(e.equivalents.homesPowered, 0), icon: <Home size={24} color="#60a5fa"/>, color: '#60a5fa' },
                                        { label: 'Trees needed to offset', value: fmt(e.equivalents.trees, 0), icon: <TreePine size={24} color="#10b981"/>, color: '#10b981' },
                                        { label: 'Return flights equivalent', value: fmt(e.equivalents.flightsEquivalent, 0), icon: <Plane size={24} color="#a78bfa"/>, color: '#a78bfa' },
                                    ].map(m => (
                                        <div key={m.label} style={{ ...cardStyle, textAlign: 'center', padding: 'clamp(1rem, 3vw, 1.25rem) clamp(0.75rem, 2vw, 1rem)' }}>
                                            <div style={{ marginBottom: '0.75rem' }}>{m.icon}</div>
                                            <div style={{ fontSize: '1.6rem', fontWeight: '700', color: m.color }}>{m.value}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.3rem', lineHeight: 1.3 }}>{m.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bottom actions */}
                            <div style={{ textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid var(--card-border)', display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                                <button onClick={onBack} style={{ padding: '0.6rem 1.2rem', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--text-secondary)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <ArrowLeft size={14}/> Back to Home
                                </button>
                                <button onClick={() => setStep('hub')} style={{ padding: '0.6rem 1.2rem', background: 'transparent', border: '1px solid var(--card-border)', color: 'var(--text-primary)', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem' }}>
                                    Adjust Facility Data
                                </button>
                                <button onClick={() => window.print()} style={{ padding: '0.6rem 1.4rem', background: 'var(--danger)', border: 'none', color: 'white', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem', fontWeight: '500' }}>
                                    <Download size={14}/> Download Report
                                </button>
                            </div>
                        </div>
                    );
                })()}

            </main>
        </div>
    );
};

export default IndustryCalculator;

