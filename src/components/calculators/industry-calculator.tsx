"use client";

import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Factory,
  Building2,
  Zap,
  Truck,
  Package,
  Users,
  ChevronLeft,
  ChevronRight,
  Plus,
  CheckCircle,
  Globe,
  Activity,
  Briefcase,
  Database,
  Wheat,
  Pill,
  Building,
  Warehouse,
  Server,
  Landmark,
  FlaskConical,
  Hotel,
  GraduationCap,
  HardHat,
  Tractor,
  Flame,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { calculateIndustryEmissions, type IndustryResult } from "@/lib/calculations";
import EmissionsResult from "@/components/calculators/emissions-result";

interface IndustryCalculatorProps {
  onBack: () => void;
}

const SECTORS = [
  { id: "manufacturing", label: "Manufacturing & Heavy Industry" },
  { id: "tech", label: "Technology & Data Centers" },
  { id: "finance", label: "Banking & Financial Institutions" },
  { id: "agriculture", label: "Agriculture & Food Production" },
  { id: "logistics", label: "Logistics & Transportation" },
  { id: "hospitality", label: "Hospitality & Real Estate" },
  { id: "healthcare", label: "Healthcare & Pharma" },
  { id: "other", label: "Other Commercial Services" },
];

const FACILITY_TYPES = [
  { id: "manufacturing", label: "Manufacturing Plant", icon: Factory },
  { id: "warehouse", label: "Warehouse / Distribution Center", icon: Warehouse },
  { id: "office", label: "Corporate Office", icon: Building },
  { id: "retail", label: "Retail Store", icon: ShoppingBag },
  { id: "datacenter", label: "Data Center", icon: Server },
  { id: "bank", label: "Bank Branch / Financial Office", icon: Landmark },
  { id: "logistics", label: "Logistics Hub / Transport Depot", icon: Truck },
  { id: "lab", label: "Research Laboratory", icon: FlaskConical },
  { id: "hospital", label: "Hospital / Healthcare Facility", icon: Pill },
  { id: "hotel", label: "Hotel / Hospitality Facility", icon: Hotel },
  { id: "campus", label: "Educational Campus", icon: GraduationCap },
  { id: "mining", label: "Mining Site", icon: HardHat },
  { id: "agriculture", label: "Agricultural Facility", icon: Tractor },
  { id: "powerplant", label: "Power Generation Plant", icon: Flame },
  { id: "construction", label: "Construction Site", icon: Building2 },
];

interface Facility {
  id: number;
  name: string;
  type: string;
  floorArea: number;
  employees: number;
  operatingHours: number;
  isComplete: boolean;
  // Scope 1 - Stationary
  dieselGeneratorsL: number;
  naturalGasHeatingM3: number;
  dieselBoilersL: number;
  naturalGasM3: number;
  lpgHeatingKg: number;
  coalTonnes: number;
  furnaceOilL: number;
  biomassTonnes: number;
  // Scope 1 - Process
  processCo2: number;
  processCement: number;
  processSteel: number;
  processLime: number;
  processChemical: number;
  // Scope 1 - Fugitive
  leakRefrigerantKg: number;
  leakMethane: number;
  leakFireSuppression: number;
  leakIndustrial: number;
  medicalGas: number;
  explosivesTonnes: number;
  fertilizerTonnes: number;
  // Scope 1 - Mobile
  petrolFleetL: number;
  dieselFleetL: number;
  cngFleetKg: number;
  aviationFuelL: number;
  marineFuelL: number;
  dieselForkliftsL: number;
  lpgForkliftsKg: number;
  petrolInternalL: number;
  cargoEquipmentL: number;
  miningEquipmentL: number;
  tractorDieselL: number;
  // Scope 2
  elecLightingKwh: number;
  elecHvacKwh: number;
  elecOfficesKwh: number;
  elecMfgKwh: number;
  elecRefrigerationKwh: number;
  elecAutomatedStorageKwh: number;
  elecItKwh: number;
  elecServersKwh: number;
  elecCoolingKwh: number;
  elecUpsKwh: number;
  elecPduKwh: number;
  elecAtmsKwh: number;
  elecWarehouseKwh: number;
  elecLabEquipmentKwh: number;
  elecVentilationKwh: number;
  elecMedicalEquipmentKwh: number;
  elecGuestRoomsKwh: number;
  elecLaundryKwh: number;
  elecKitchensKwh: number;
  elecMiningKwh: number;
  elecIrrigationKwh: number;
  elecPlantOpsKwh: number;
  elecConstructionKwh: number;
  purchasedSteamTns: number;
  purchasedHeatingGj: number;
  purchasedCoolingGj: number;
  solarGenKwh: number;
  windGenKwh: number;
  renewablePpaKwh: number;
  // Scope 3 - Facility Level
  c4RawMaterialsTonnes: number;
  c4RawMaterialsDist: number;
  c5Landfill: number;
  c5Incinerated: number;
  c5Recycled: number;
  c5Hazardous: number;
  c6FlightDist: number;
  c6TrainDist: number;
  c6CarDist: number;
  c6HotelStays: number;
  c6TaxiDist: number;
  c7CommuteDist: number;
  c7CommutingEmployees: number;
  c7RemotePct: number;
  c9FinishedGoodsDist: number;
  c9FinishedGoodsTonnes: number;
  goodsPurchasedResale: number;
  packagingMaterialsTonnes: number;
  officeEquipmentSpend: number;
  paperConsumptionKg: number;
  waterConsumptionM3: number;
  itHardwareEmissions: number;
  serverLifecycleEmissions: number;
  cloudInfraEmissions: number;
  subcontractedTransportDist: number;
  chemicalPurchasesSpend: number;
  pharmaceuticalSupplySpend: number;
  medicalEquipSpend: number;
  foodProcurementSpend: number;
  laundryServicesSpend: number;
  wasteRockTonnes: number;
  agriculturalWasteTonnes: number;
  constructionMaterialsSpend: number;
  customerTransportDist: number;
  patientTravelDist: number;
  studentCommutingDist: number;
  tourismTransportDist: number;
}

interface OrgData {
  orgName: string;
  sector: string;
  employeesTotal: number;
  revenue: number;
  facilities: Facility[];
  // Org-Level Scope 3
  c1Spend: number;
  c2Machinery: number;
  c2IT: number;
  c11ProductEnergy: number;
  c15InvestEquity: number;
}

const createEmptyFacility = (id: number): Facility => ({
  id,
  name: `Facility ${id}`,
  type: "manufacturing",
  floorArea: 0,
  employees: 0,
  operatingHours: 8760,
  isComplete: false,
  dieselGeneratorsL: 0,
  naturalGasHeatingM3: 0,
  dieselBoilersL: 0,
  naturalGasM3: 0,
  lpgHeatingKg: 0,
  coalTonnes: 0,
  furnaceOilL: 0,
  biomassTonnes: 0,
  processCo2: 0,
  processCement: 0,
  processSteel: 0,
  processLime: 0,
  processChemical: 0,
  leakRefrigerantKg: 0,
  leakMethane: 0,
  leakFireSuppression: 0,
  leakIndustrial: 0,
  medicalGas: 0,
  explosivesTonnes: 0,
  fertilizerTonnes: 0,
  petrolFleetL: 0,
  dieselFleetL: 0,
  cngFleetKg: 0,
  aviationFuelL: 0,
  marineFuelL: 0,
  dieselForkliftsL: 0,
  lpgForkliftsKg: 0,
  petrolInternalL: 0,
  cargoEquipmentL: 0,
  miningEquipmentL: 0,
  tractorDieselL: 0,
  elecLightingKwh: 0,
  elecHvacKwh: 0,
  elecOfficesKwh: 0,
  elecMfgKwh: 0,
  elecRefrigerationKwh: 0,
  elecAutomatedStorageKwh: 0,
  elecItKwh: 0,
  elecServersKwh: 0,
  elecCoolingKwh: 0,
  elecUpsKwh: 0,
  elecPduKwh: 0,
  elecAtmsKwh: 0,
  elecWarehouseKwh: 0,
  elecLabEquipmentKwh: 0,
  elecVentilationKwh: 0,
  elecMedicalEquipmentKwh: 0,
  elecGuestRoomsKwh: 0,
  elecLaundryKwh: 0,
  elecKitchensKwh: 0,
  elecMiningKwh: 0,
  elecIrrigationKwh: 0,
  elecPlantOpsKwh: 0,
  elecConstructionKwh: 0,
  purchasedSteamTns: 0,
  purchasedHeatingGj: 0,
  purchasedCoolingGj: 0,
  solarGenKwh: 0,
  windGenKwh: 0,
  renewablePpaKwh: 0,
  c4RawMaterialsTonnes: 0,
  c4RawMaterialsDist: 0,
  c5Landfill: 0,
  c5Incinerated: 0,
  c5Recycled: 0,
  c5Hazardous: 0,
  c6FlightDist: 0,
  c6TrainDist: 0,
  c6CarDist: 0,
  c6HotelStays: 0,
  c6TaxiDist: 0,
  c7CommuteDist: 0,
  c7CommutingEmployees: 0,
  c7RemotePct: 0,
  c9FinishedGoodsDist: 0,
  c9FinishedGoodsTonnes: 0,
  goodsPurchasedResale: 0,
  packagingMaterialsTonnes: 0,
  officeEquipmentSpend: 0,
  paperConsumptionKg: 0,
  waterConsumptionM3: 0,
  itHardwareEmissions: 0,
  serverLifecycleEmissions: 0,
  cloudInfraEmissions: 0,
  subcontractedTransportDist: 0,
  chemicalPurchasesSpend: 0,
  pharmaceuticalSupplySpend: 0,
  medicalEquipSpend: 0,
  foodProcurementSpend: 0,
  laundryServicesSpend: 0,
  wasteRockTonnes: 0,
  agriculturalWasteTonnes: 0,
  constructionMaterialsSpend: 0,
  customerTransportDist: 0,
  patientTravelDist: 0,
  studentCommutingDist: 0,
  tourismTransportDist: 0,
});

const initialData: OrgData = {
  orgName: "",
  sector: "",
  employeesTotal: 0,
  revenue: 0,
  facilities: [createEmptyFacility(1)],
  c1Spend: 0,
  c2Machinery: 0,
  c2IT: 0,
  c11ProductEnergy: 0,
  c15InvestEquity: 0,
};

// Input Row Component
function InputRow({
  label,
  name,
  value,
  onChange,
  type = "number",
}: {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-border/30">
      <Label className="text-sm sm:text-base font-medium text-muted-foreground flex-1">{label}</Label>
      <Input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`${type === "text" ? "w-72" : "w-40"} bg-secondary/50 border-border text-right text-sm sm:text-base py-4 sm:py-5`}
      />
    </div>
  );
}

// Section Header Component
function SectionHeader({ title }: { title: string }) {
  return (
    <h3 className="text-2xl sm:text-3xl tracking-tight leading-tight font-bold font-mono text-primary border-b border-primary/30 pb-3 mt-8 mb-6">
      {title}
    </h3>
  );
}

export default function IndustryCalculator({ onBack }: IndustryCalculatorProps) {
  const [step, setStep] = useState<"org" | "hub" | "org_scope3" | "results">("org");
  const [data, setData] = useState<OrgData>(initialData);
  const [result, setResult] = useState<IndustryResult | null>(null);
  const [activeFacilityId, setActiveFacilityId] = useState<number | null>(null);
  const [facilityStep, setFacilityStep] = useState(0);

  // Scroll to top when changing steps
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, facilityStep]);

  const handleOrgInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleSectorChange = (value: string) => {
    setData((prev) => ({ ...prev, sector: value }));
  };

  const handleFacilityInput = (facilityId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const val = type === "number" ? parseFloat(value) || 0 : value;
    setData((prev) => ({
      ...prev,
      facilities: prev.facilities.map((f) => (f.id === facilityId ? { ...f, [name]: val } : f)),
    }));
  };

  const handleFacilityTypeChange = (facilityId: number, value: string) => {
    setData((prev) => ({
      ...prev,
      facilities: prev.facilities.map((f) => (f.id === facilityId ? { ...f, type: value } : f)),
    }));
  };

  const addFacility = () => {
    setData((prev) => ({
      ...prev,
      facilities: [...prev.facilities, createEmptyFacility(prev.facilities.length + 1)],
    }));
  };

  const closeFacilityWizard = (id: number) => {
    setData((prev) => ({
      ...prev,
      facilities: prev.facilities.map((f) => (f.id === id ? { ...f, isComplete: true } : f)),
    }));
    setActiveFacilityId(null);
    setFacilityStep(0);
  };

  const calculateResults = () => {
    // Build data structure for calculation
    const calcData = {
      sector: data.sector || "manufacturing",
      totalEmployees: data.employeesTotal,
      annualRevenue: data.revenue,
      facilities: data.facilities.map((f) => ({
        name: f.name,
        employees: f.employees,
        floorAreaSqm: f.floorArea,
        electricityKwh:
          f.elecLightingKwh +
          f.elecHvacKwh +
          f.elecOfficesKwh +
          f.elecMfgKwh +
          f.elecRefrigerationKwh +
          f.elecServersKwh +
          f.elecCoolingKwh +
          f.elecMedicalEquipmentKwh +
          f.elecGuestRoomsKwh +
          f.elecMiningKwh +
          f.elecIrrigationKwh +
          f.elecConstructionKwh,
        renewableKwh: f.solarGenKwh + f.windGenKwh + f.renewablePpaKwh,
        naturalGasUnits: f.naturalGasM3 + f.naturalGasHeatingM3,
        dieselLitres:
          f.dieselGeneratorsL + f.dieselBoilersL + f.dieselFleetL + f.dieselForkliftsL,
        lpgKg: f.lpgHeatingKg + f.lpgForkliftsKg,
        refrigerantLeakageKg: f.leakRefrigerantKg,
        companyVehicleKm: (f.petrolFleetL + f.dieselFleetL) * 10,
        wasteToLandfillTonnes: f.c5Landfill,
      })),
      scope3: {
        purchasedGoodsSpend: data.c1Spend,
        capitalGoodsSpend: data.c2Machinery + data.c2IT,
        fuelEnergyKwh: 0,
        upstreamTransportSpend: data.facilities.reduce((sum, f) => sum + f.c4RawMaterialsDist * 0.5, 0),
        wasteDisposalTonnes: data.facilities.reduce((sum, f) => sum + f.c5Landfill + f.c5Hazardous, 0),
        businessTravelKm: data.facilities.reduce((sum, f) => sum + f.c6FlightDist + f.c6TrainDist, 0),
        employeeCommutingKm: data.facilities.reduce((sum, f) => sum + f.c7CommuteDist, 0),
        downstreamTransportSpend: data.facilities.reduce((sum, f) => sum + f.c9FinishedGoodsDist * 0.5, 0),
        usePhaseEmissions: data.c11ProductEnergy * 0.0005,
        endOfLifeTonnes: 0,
        leasedAssetsEmissions: 0,
        franchiseEmissions: 0,
        investmentEmissions: data.c15InvestEquity * 1000,
      },
    };

    const calcResult = calculateIndustryEmissions(calcData);
    setResult(calcResult);
    setStep("results");
  };

  const isEditingFacility = activeFacilityId !== null;
  const allFacilitiesComplete = data.facilities.every((f) => f.isComplete);

  // Render Facility Step Content
  const renderFacilityStep = (fac: Facility) => {
    const h = (e: React.ChangeEvent<HTMLInputElement>) => handleFacilityInput(fac.id, e);

    switch (facilityStep) {
      case 0:
        return (
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
            <SectionHeader title="Facility Details" />
            <InputRow label="Facility Name" name="name" type="text" value={fac.name} onChange={h} />
            <div className="flex items-center justify-between py-4 border-b border-border/30">
              <Label className="text-sm sm:text-base font-medium text-muted-foreground">Facility Type</Label>
              <Select value={fac.type} onValueChange={(v) => handleFacilityTypeChange(fac.id, v)}>
                <SelectTrigger className="font-mono w-72 bg-secondary/50 text-sm sm:text-base py-4 sm:py-5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {FACILITY_TYPES.map((type) => (
                    <SelectItem key={type.id} value={type.id} className="font-mono text-sm sm:text-base py-3">
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <InputRow label="Floor Area (sq meters)" name="floorArea" value={fac.floorArea} onChange={h} />
            <InputRow label="Number of Employees" name="employees" value={fac.employees} onChange={h} />
            <InputRow label="Operating Hours/Year" name="operatingHours" value={fac.operatingHours} onChange={h} />
          </div>
        );

      case 1:
        return (
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {fac.type === "manufacturing" && (
              <>
                <SectionHeader title="Scope 1: Stationary Combustion" />
                <InputRow label="Diesel used in boilers (litres/yr)" name="dieselBoilersL" value={fac.dieselBoilersL} onChange={h} />
                <InputRow label="Natural gas in boilers/furnaces (m3/yr)" name="naturalGasM3" value={fac.naturalGasM3} onChange={h} />
                <InputRow label="LPG in industrial processes (kg/yr)" name="lpgHeatingKg" value={fac.lpgHeatingKg} onChange={h} />
                <InputRow label="Coal for production heat (tonnes/yr)" name="coalTonnes" value={fac.coalTonnes} onChange={h} />
                <InputRow label="Furnace oil used (litres/yr)" name="furnaceOilL" value={fac.furnaceOilL} onChange={h} />
                <InputRow label="Biomass fuel used (tonnes/yr)" name="biomassTonnes" value={fac.biomassTonnes} onChange={h} />
                <SectionHeader title="Scope 1: Mobile Combustion" />
                <InputRow label="Diesel in forklifts (litres/yr)" name="dieselForkliftsL" value={fac.dieselForkliftsL} onChange={h} />
                <InputRow label="Petrol in internal vehicles (litres/yr)" name="petrolInternalL" value={fac.petrolInternalL} onChange={h} />
                <InputRow label="LPG in forklifts (kg/yr)" name="lpgForkliftsKg" value={fac.lpgForkliftsKg} onChange={h} />
                <SectionHeader title="Scope 1: Process Emissions" />
                <InputRow label="CO2 from chemical reactions" name="processCo2" value={fac.processCo2} onChange={h} />
                <InputRow label="Cement clinker production (tonnes/yr)" name="processCement" value={fac.processCement} onChange={h} />
                <InputRow label="Steel reduction processes (tonnes/yr)" name="processSteel" value={fac.processSteel} onChange={h} />
                <SectionHeader title="Scope 1: Fugitive Emissions" />
                <InputRow label="Refrigerant leakage (kg/yr)" name="leakRefrigerantKg" value={fac.leakRefrigerantKg} onChange={h} />
                <InputRow label="Compressed gas leakage" name="leakIndustrial" value={fac.leakIndustrial} onChange={h} />
              </>
            )}
            {fac.type === "warehouse" && (
              <>
                <SectionHeader title="Scope 1: Combustion" />
                <InputRow label="Diesel in backup generators (L/yr)" name="dieselGeneratorsL" value={fac.dieselGeneratorsL} onChange={h} />
                <InputRow label="LPG in forklifts (kg/yr)" name="lpgForkliftsKg" value={fac.lpgForkliftsKg} onChange={h} />
                <InputRow label="Diesel in forklifts (L/yr)" name="dieselForkliftsL" value={fac.dieselForkliftsL} onChange={h} />
                <InputRow label="Natural gas for heating (m3/yr)" name="naturalGasHeatingM3" value={fac.naturalGasHeatingM3} onChange={h} />
              </>
            )}
            {fac.type === "office" && (
              <>
                <SectionHeader title="Scope 1: Operations" />
                <InputRow label="Diesel in generators (L/yr)" name="dieselGeneratorsL" value={fac.dieselGeneratorsL} onChange={h} />
                <InputRow label="Petrol in company cars (L/yr)" name="petrolFleetL" value={fac.petrolFleetL} onChange={h} />
                <InputRow label="Natural gas for heating (m3/yr)" name="naturalGasHeatingM3" value={fac.naturalGasHeatingM3} onChange={h} />
              </>
            )}
            {fac.type === "retail" && (
              <>
                <SectionHeader title="Scope 1: Store Operations" />
                <InputRow label="Diesel in generators (L/yr)" name="dieselGeneratorsL" value={fac.dieselGeneratorsL} onChange={h} />
                <InputRow label="Natural gas for heating (m3/yr)" name="naturalGasHeatingM3" value={fac.naturalGasHeatingM3} onChange={h} />
              </>
            )}
            {fac.type === "datacenter" && (
              <>
                <SectionHeader title="Scope 1: Backup Power" />
                <InputRow label="Diesel in backup generators (L/yr)" name="dieselGeneratorsL" value={fac.dieselGeneratorsL} onChange={h} />
              </>
            )}
            {fac.type === "bank" && (
              <>
                <SectionHeader title="Scope 1: Branch Operations" />
                <InputRow label="Diesel in backup generators (L/yr)" name="dieselGeneratorsL" value={fac.dieselGeneratorsL} onChange={h} />
              </>
            )}
            {fac.type === "logistics" && (
              <>
                <SectionHeader title="Scope 1: Transportation Fleet" />
                <InputRow label="Diesel in trucks (L/yr)" name="dieselFleetL" value={fac.dieselFleetL} onChange={h} />
                <InputRow label="Petrol in delivery vehicles (L/yr)" name="petrolFleetL" value={fac.petrolFleetL} onChange={h} />
                <InputRow label="CNG in fleet (kg/yr)" name="cngFleetKg" value={fac.cngFleetKg} onChange={h} />
                <InputRow label="Fuel in cargo handling (L/yr)" name="cargoEquipmentL" value={fac.cargoEquipmentL} onChange={h} />
              </>
            )}
            {fac.type === "lab" && (
              <>
                <SectionHeader title="Scope 1: Lab Operations" />
                <InputRow label="Gas used in experiments" name="processChemical" value={fac.processChemical} onChange={h} />
                <InputRow label="Diesel generators (L/yr)" name="dieselGeneratorsL" value={fac.dieselGeneratorsL} onChange={h} />
                <InputRow label="Refrigerant leakage (kg/yr)" name="leakRefrigerantKg" value={fac.leakRefrigerantKg} onChange={h} />
              </>
            )}
            {fac.type === "hospital" && (
              <>
                <SectionHeader title="Scope 1: Health Operations" />
                <InputRow label="Diesel generators (L/yr)" name="dieselGeneratorsL" value={fac.dieselGeneratorsL} onChange={h} />
                <InputRow label="Medical gas emissions" name="medicalGas" value={fac.medicalGas} onChange={h} />
                <InputRow label="Refrigerant leakage (kg/yr)" name="leakRefrigerantKg" value={fac.leakRefrigerantKg} onChange={h} />
              </>
            )}
            {fac.type === "hotel" && (
              <>
                <SectionHeader title="Scope 1: Hospitality Operations" />
                <InputRow label="LPG in kitchens (kg/yr)" name="lpgHeatingKg" value={fac.lpgHeatingKg} onChange={h} />
                <InputRow label="Diesel generators (L/yr)" name="dieselGeneratorsL" value={fac.dieselGeneratorsL} onChange={h} />
                <InputRow label="Natural gas for heating (m3/yr)" name="naturalGasHeatingM3" value={fac.naturalGasHeatingM3} onChange={h} />
              </>
            )}
            {fac.type === "campus" && (
              <>
                <SectionHeader title="Scope 1: Campus Infrastructure" />
                <InputRow label="Diesel generators (L/yr)" name="dieselGeneratorsL" value={fac.dieselGeneratorsL} onChange={h} />
                <InputRow label="LPG in cafeterias (kg/yr)" name="lpgHeatingKg" value={fac.lpgHeatingKg} onChange={h} />
              </>
            )}
            {fac.type === "mining" && (
              <>
                <SectionHeader title="Scope 1: Extraction Sites" />
                <InputRow label="Diesel in mining equipment (L/yr)" name="miningEquipmentL" value={fac.miningEquipmentL} onChange={h} />
                <InputRow label="Explosives used (tonnes)" name="explosivesTonnes" value={fac.explosivesTonnes} onChange={h} />
              </>
            )}
            {fac.type === "agriculture" && (
              <>
                <SectionHeader title="Scope 1: Field Operations" />
                <InputRow label="Diesel in tractors (L/yr)" name="tractorDieselL" value={fac.tractorDieselL} onChange={h} />
                <InputRow label="Methane from livestock" name="leakMethane" value={fac.leakMethane} onChange={h} />
                <InputRow label="Fertilizer application (tonnes)" name="fertilizerTonnes" value={fac.fertilizerTonnes} onChange={h} />
              </>
            )}
            {fac.type === "powerplant" && (
              <>
                <SectionHeader title="Scope 1: Generation Fuels" />
                <InputRow label="Coal in power plant (tonnes)" name="coalTonnes" value={fac.coalTonnes} onChange={h} />
                <InputRow label="Natural gas in turbines (m3)" name="naturalGasM3" value={fac.naturalGasM3} onChange={h} />
                <InputRow label="Fuel oil consumption (L/yr)" name="furnaceOilL" value={fac.furnaceOilL} onChange={h} />
              </>
            )}
            {fac.type === "construction" && (
              <>
                <SectionHeader title="Scope 1: Site Activity" />
                <InputRow label="Diesel in construction equipment (L)" name="miningEquipmentL" value={fac.miningEquipmentL} onChange={h} />
                <InputRow label="Fuel in generators (L)" name="dieselGeneratorsL" value={fac.dieselGeneratorsL} onChange={h} />
              </>
            )}
          </div>
        );

      case 2:
        return (
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {fac.type === "manufacturing" && (
              <>
                <SectionHeader title="Scope 2: Facilities & Grid" />
                <InputRow label="Electricity in production (kWh)" name="elecMfgKwh" value={fac.elecMfgKwh} onChange={h} />
                <InputRow label="Electricity for HVAC (kWh)" name="elecHvacKwh" value={fac.elecHvacKwh} onChange={h} />
                <InputRow label="Electricity for lighting (kWh)" name="elecLightingKwh" value={fac.elecLightingKwh} onChange={h} />
                <InputRow label="Purchased steam (tonnes)" name="purchasedSteamTns" value={fac.purchasedSteamTns} onChange={h} />
                <InputRow label="Purchased cooling (GJ)" name="purchasedCoolingGj" value={fac.purchasedCoolingGj} onChange={h} />
              </>
            )}
            {fac.type === "warehouse" && (
              <>
                <SectionHeader title="Scope 2: Storage Facilities" />
                <InputRow label="Electricity for lighting (kWh)" name="elecLightingKwh" value={fac.elecLightingKwh} onChange={h} />
                <InputRow label="Electricity for refrigeration (kWh)" name="elecRefrigerationKwh" value={fac.elecRefrigerationKwh} onChange={h} />
                <InputRow label="Electricity in automated storage (kWh)" name="elecAutomatedStorageKwh" value={fac.elecAutomatedStorageKwh} onChange={h} />
                <InputRow label="Electricity for HVAC (kWh)" name="elecHvacKwh" value={fac.elecHvacKwh} onChange={h} />
              </>
            )}
            {fac.type === "office" && (
              <>
                <SectionHeader title="Scope 2: Corporate Offices" />
                <InputRow label="Electricity in office ops (kWh)" name="elecOfficesKwh" value={fac.elecOfficesKwh} onChange={h} />
                <InputRow label="Electricity for HVAC (kWh)" name="elecHvacKwh" value={fac.elecHvacKwh} onChange={h} />
                <InputRow label="Electricity in IT infra (kWh)" name="elecItKwh" value={fac.elecItKwh} onChange={h} />
              </>
            )}
            {fac.type === "retail" && (
              <>
                <SectionHeader title="Scope 2: Storefront Grid" />
                <InputRow label="Electricity for lighting (kWh)" name="elecLightingKwh" value={fac.elecLightingKwh} onChange={h} />
                <InputRow label="Electricity for refrigeration (kWh)" name="elecRefrigerationKwh" value={fac.elecRefrigerationKwh} onChange={h} />
                <InputRow label="Electricity for HVAC (kWh)" name="elecHvacKwh" value={fac.elecHvacKwh} onChange={h} />
              </>
            )}
            {fac.type === "datacenter" && (
              <>
                <SectionHeader title="Scope 2: IT Infrastructure" />
                <InputRow label="Electricity by servers (kWh)" name="elecServersKwh" value={fac.elecServersKwh} onChange={h} />
                <InputRow label="Electricity by cooling (kWh)" name="elecCoolingKwh" value={fac.elecCoolingKwh} onChange={h} />
                <InputRow label="Electricity in UPS (kWh)" name="elecUpsKwh" value={fac.elecUpsKwh} onChange={h} />
                <InputRow label="Electricity in power distribution (kWh)" name="elecPduKwh" value={fac.elecPduKwh} onChange={h} />
              </>
            )}
            {fac.type === "bank" && (
              <>
                <SectionHeader title="Scope 2: Branch Energy" />
                <InputRow label="Electricity in branch ops (kWh)" name="elecOfficesKwh" value={fac.elecOfficesKwh} onChange={h} />
                <InputRow label="Electricity in ATMs (kWh)" name="elecAtmsKwh" value={fac.elecAtmsKwh} onChange={h} />
                <InputRow label="Electricity in data infra (kWh)" name="elecItKwh" value={fac.elecItKwh} onChange={h} />
              </>
            )}
            {fac.type === "logistics" && (
              <>
                <SectionHeader title="Scope 2: Depot Grid" />
                <InputRow label="Electricity in warehouses (kWh)" name="elecWarehouseKwh" value={fac.elecWarehouseKwh} onChange={h} />
                <InputRow label="Electricity in offices (kWh)" name="elecOfficesKwh" value={fac.elecOfficesKwh} onChange={h} />
              </>
            )}
            {fac.type === "lab" && (
              <>
                <SectionHeader title="Scope 2: Research Facilities" />
                <InputRow label="Electricity for lab equipment (kWh)" name="elecLabEquipmentKwh" value={fac.elecLabEquipmentKwh} onChange={h} />
                <InputRow label="Electricity for ventilation (kWh)" name="elecVentilationKwh" value={fac.elecVentilationKwh} onChange={h} />
              </>
            )}
            {fac.type === "hospital" && (
              <>
                <SectionHeader title="Scope 2: Medical Grid" />
                <InputRow label="Electricity in medical equip (kWh)" name="elecMedicalEquipmentKwh" value={fac.elecMedicalEquipmentKwh} onChange={h} />
                <InputRow label="Electricity for HVAC (kWh)" name="elecHvacKwh" value={fac.elecHvacKwh} onChange={h} />
                <InputRow label="Electricity in labs (kWh)" name="elecLabEquipmentKwh" value={fac.elecLabEquipmentKwh} onChange={h} />
              </>
            )}
            {fac.type === "hotel" && (
              <>
                <SectionHeader title="Scope 2: Hospitality Base" />
                <InputRow label="Electricity in guest rooms (kWh)" name="elecGuestRoomsKwh" value={fac.elecGuestRoomsKwh} onChange={h} />
                <InputRow label="Electricity in laundry (kWh)" name="elecLaundryKwh" value={fac.elecLaundryKwh} onChange={h} />
                <InputRow label="Electricity for HVAC (kWh)" name="elecHvacKwh" value={fac.elecHvacKwh} onChange={h} />
                <InputRow label="Electricity in kitchens (kWh)" name="elecKitchensKwh" value={fac.elecKitchensKwh} onChange={h} />
              </>
            )}
            {fac.type === "campus" && (
              <>
                <SectionHeader title="Scope 2: School Grid" />
                <InputRow label="Electricity in buildings (kWh)" name="elecOfficesKwh" value={fac.elecOfficesKwh} onChange={h} />
                <InputRow label="Electricity in labs (kWh)" name="elecLabEquipmentKwh" value={fac.elecLabEquipmentKwh} onChange={h} />
              </>
            )}
            {fac.type === "mining" && (
              <>
                <SectionHeader title="Scope 2: Site Grid" />
                <InputRow label="Electricity in mining ops (kWh)" name="elecMiningKwh" value={fac.elecMiningKwh} onChange={h} />
              </>
            )}
            {fac.type === "agriculture" && (
              <>
                <SectionHeader title="Scope 2: Field Grid" />
                <InputRow label="Electricity for irrigation (kWh)" name="elecIrrigationKwh" value={fac.elecIrrigationKwh} onChange={h} />
              </>
            )}
            {fac.type === "powerplant" && (
              <>
                <SectionHeader title="Scope 2: Generation Ops" />
                <InputRow label="Electricity in plant ops (kWh)" name="elecPlantOpsKwh" value={fac.elecPlantOpsKwh} onChange={h} />
              </>
            )}
            {fac.type === "construction" && (
              <>
                <SectionHeader title="Scope 2: Temporary Site Power" />
                <InputRow label="Electricity onsite (kWh)" name="elecConstructionKwh" value={fac.elecConstructionKwh} onChange={h} />
              </>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
            {fac.type === "manufacturing" && (
              <>
                <SectionHeader title="Scope 3: Procurement & Travel" />
                <InputRow label="Raw materials purchased (tonnes)" name="c4RawMaterialsTonnes" value={fac.c4RawMaterialsTonnes} onChange={h} />
                <InputRow label="Raw material transport (km)" name="c4RawMaterialsDist" value={fac.c4RawMaterialsDist} onChange={h} />
                <InputRow label="Waste to landfill (tonnes)" name="c5Landfill" value={fac.c5Landfill} onChange={h} />
                <InputRow label="Waste recycled (tonnes)" name="c5Recycled" value={fac.c5Recycled} onChange={h} />
                <InputRow label="Hazardous waste (tonnes)" name="c5Hazardous" value={fac.c5Hazardous} onChange={h} />
                <InputRow label="Employee commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
                <InputRow label="Business travel (km/yr)" name="c6FlightDist" value={fac.c6FlightDist} onChange={h} />
                <InputRow label="Finished goods distribution (km)" name="c9FinishedGoodsDist" value={fac.c9FinishedGoodsDist} onChange={h} />
              </>
            )}
            {fac.type === "warehouse" && (
              <>
                <SectionHeader title="Scope 3: Logistics" />
                <InputRow label="Goods transported to warehouse (km)" name="c4RawMaterialsDist" value={fac.c4RawMaterialsDist} onChange={h} />
                <InputRow label="Goods transported from warehouse (km)" name="c9FinishedGoodsDist" value={fac.c9FinishedGoodsDist} onChange={h} />
                <InputRow label="Packaging materials (tonnes)" name="packagingMaterialsTonnes" value={fac.packagingMaterialsTonnes} onChange={h} />
                <InputRow label="Packaging waste (tonnes)" name="c5Landfill" value={fac.c5Landfill} onChange={h} />
                <InputRow label="Employee commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
              </>
            )}
            {fac.type === "office" && (
              <>
                <SectionHeader title="Scope 3: Operations" />
                <InputRow label="Employee commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
                <InputRow label="Business travel - flights (km/yr)" name="c6FlightDist" value={fac.c6FlightDist} onChange={h} />
                <InputRow label="Business travel - train (km/yr)" name="c6TrainDist" value={fac.c6TrainDist} onChange={h} />
                <InputRow label="Taxi travel (km/yr)" name="c6TaxiDist" value={fac.c6TaxiDist} onChange={h} />
                <InputRow label="Office equipment purchases ($)" name="officeEquipmentSpend" value={fac.officeEquipmentSpend} onChange={h} />
                <InputRow label="Paper consumption (kg/yr)" name="paperConsumptionKg" value={fac.paperConsumptionKg} onChange={h} />
                <InputRow label="Waste generation (tonnes/yr)" name="c5Landfill" value={fac.c5Landfill} onChange={h} />
                <InputRow label="Water consumption (m3/yr)" name="waterConsumptionM3" value={fac.waterConsumptionM3} onChange={h} />
              </>
            )}
            {fac.type === "retail" && (
              <>
                <SectionHeader title="Scope 3: Store Supply" />
                <InputRow label="Goods purchased for resale (tonnes)" name="goodsPurchasedResale" value={fac.goodsPurchasedResale} onChange={h} />
                <InputRow label="Transport of goods to store (km)" name="c4RawMaterialsDist" value={fac.c4RawMaterialsDist} onChange={h} />
                <InputRow label="Packaging waste (tonnes)" name="c5Landfill" value={fac.c5Landfill} onChange={h} />
                <InputRow label="Customer transportation (km/yr)" name="customerTransportDist" value={fac.customerTransportDist} onChange={h} />
                <InputRow label="Employee commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
              </>
            )}
            {fac.type === "datacenter" && (
              <>
                <SectionHeader title="Scope 3: Capital & Cloud" />
                <InputRow label="IT hardware manufacturing emissions" name="itHardwareEmissions" value={fac.itHardwareEmissions} onChange={h} />
                <InputRow label="Server lifecycle emissions" name="serverLifecycleEmissions" value={fac.serverLifecycleEmissions} onChange={h} />
                <InputRow label="Cloud infrastructure emissions" name="cloudInfraEmissions" value={fac.cloudInfraEmissions} onChange={h} />
                <InputRow label="Employee commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
                <InputRow label="Business travel (km/yr)" name="c6FlightDist" value={fac.c6FlightDist} onChange={h} />
              </>
            )}
            {fac.type === "bank" && (
              <>
                <SectionHeader title="Scope 3: Local Overheads" />
                <InputRow label="Employee commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
                <InputRow label="Business travel (km/yr)" name="c6FlightDist" value={fac.c6FlightDist} onChange={h} />
                <InputRow label="Paper consumption (kg/yr)" name="paperConsumptionKg" value={fac.paperConsumptionKg} onChange={h} />
                <InputRow label="IT equipment purchases ($)" name="officeEquipmentSpend" value={fac.officeEquipmentSpend} onChange={h} />
                <InputRow label="Waste generation (tonnes/yr)" name="c5Landfill" value={fac.c5Landfill} onChange={h} />
              </>
            )}
            {fac.type === "logistics" && (
              <>
                <SectionHeader title="Scope 3: Hub Dependencies" />
                <InputRow label="Subcontracted transport (km)" name="subcontractedTransportDist" value={fac.subcontractedTransportDist} onChange={h} />
                <InputRow label="Packaging materials (tonnes/yr)" name="packagingMaterialsTonnes" value={fac.packagingMaterialsTonnes} onChange={h} />
                <InputRow label="Waste generated (tonnes/yr)" name="c5Landfill" value={fac.c5Landfill} onChange={h} />
                <InputRow label="Employee commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
              </>
            )}
            {fac.type === "lab" && (
              <>
                <SectionHeader title="Scope 3: Lab Overhead" />
                <InputRow label="Chemical purchases ($)" name="chemicalPurchasesSpend" value={fac.chemicalPurchasesSpend} onChange={h} />
                <InputRow label="Hazardous waste disposal (tonnes)" name="c5Hazardous" value={fac.c5Hazardous} onChange={h} />
                <InputRow label="Staff commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
                <InputRow label="Business travel (km/yr)" name="c6FlightDist" value={fac.c6FlightDist} onChange={h} />
              </>
            )}
            {fac.type === "hospital" && (
              <>
                <SectionHeader title="Scope 3: Patient & Care" />
                <InputRow label="Pharmaceutical supply chain ($)" name="pharmaceuticalSupplySpend" value={fac.pharmaceuticalSupplySpend} onChange={h} />
                <InputRow label="Medical equipment purchases ($)" name="medicalEquipSpend" value={fac.medicalEquipSpend} onChange={h} />
                <InputRow label="Medical waste disposal (tonnes)" name="c5Hazardous" value={fac.c5Hazardous} onChange={h} />
                <InputRow label="Staff commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
                <InputRow label="Patient travel (km/yr)" name="patientTravelDist" value={fac.patientTravelDist} onChange={h} />
              </>
            )}
            {fac.type === "hotel" && (
              <>
                <SectionHeader title="Scope 3: Guest Needs" />
                <InputRow label="Food procurement spend ($)" name="foodProcurementSpend" value={fac.foodProcurementSpend} onChange={h} />
                <InputRow label="Laundry services spend ($)" name="laundryServicesSpend" value={fac.laundryServicesSpend} onChange={h} />
                <InputRow label="Guest waste generation (tonnes)" name="c5Landfill" value={fac.c5Landfill} onChange={h} />
                <InputRow label="Staff commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
                <InputRow label="Tourism transportation (km/yr)" name="tourismTransportDist" value={fac.tourismTransportDist} onChange={h} />
              </>
            )}
            {fac.type === "campus" && (
              <>
                <SectionHeader title="Scope 3: School Logistics" />
                <InputRow label="Student commuting (km/yr)" name="studentCommutingDist" value={fac.studentCommutingDist} onChange={h} />
                <InputRow label="Staff commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
                <InputRow label="Campus waste (tonnes/yr)" name="c5Landfill" value={fac.c5Landfill} onChange={h} />
                <InputRow label="Paper consumption (kg/yr)" name="paperConsumptionKg" value={fac.paperConsumptionKg} onChange={h} />
              </>
            )}
            {fac.type === "mining" && (
              <>
                <SectionHeader title="Scope 3: Mining Ops" />
                <InputRow label="Transport of extracted materials (km)" name="c9FinishedGoodsDist" value={fac.c9FinishedGoodsDist} onChange={h} />
                <InputRow label="Waste rock disposal (tonnes)" name="wasteRockTonnes" value={fac.wasteRockTonnes} onChange={h} />
                <InputRow label="Employee commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
              </>
            )}
            {fac.type === "agriculture" && (
              <>
                <SectionHeader title="Scope 3: Farm Support" />
                <InputRow label="Crop transportation (km)" name="c9FinishedGoodsDist" value={fac.c9FinishedGoodsDist} onChange={h} />
                <InputRow label="Agricultural waste (tonnes)" name="agriculturalWasteTonnes" value={fac.agriculturalWasteTonnes} onChange={h} />
                <InputRow label="Worker commuting (km/yr)" name="c7CommuteDist" value={fac.c7CommuteDist} onChange={h} />
              </>
            )}
            {fac.type === "powerplant" && (
              <>
                <SectionHeader title="Scope 3: Plant Operations" />
                <InputRow label="Fuel extraction emissions" name="c4RawMaterialsTonnes" value={fac.c4RawMaterialsTonnes} onChange={h} />
                <InputRow label="Transmission losses" name="c9FinishedGoodsTonnes" value={fac.c9FinishedGoodsTonnes} onChange={h} />
              </>
            )}
            {fac.type === "construction" && (
              <>
                <SectionHeader title="Scope 3: Building Upstream" />
                <InputRow label="Construction materials purchased ($)" name="constructionMaterialsSpend" value={fac.constructionMaterialsSpend} onChange={h} />
                <InputRow label="Transportation of materials (km)" name="c4RawMaterialsDist" value={fac.c4RawMaterialsDist} onChange={h} />
                <InputRow label="Waste from construction (tonnes)" name="c5Landfill" value={fac.c5Landfill} onChange={h} />
              </>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (result) {
    return (
      <EmissionsResult
        result={result}
        type="industry"
        onBack={() => {
          setResult(null);
          setStep("org_scope3");
        }}
        onStartOver={() => {
          setResult(null);
          setStep("org");
          setData({
            orgName: "",
            employeesTotal: 0,
            revenue: 0,
            sector: "",
            facilities: [],
            c1Spend: 0,
            c2Machinery: 0,
            c2IT: 0,
            c11ProductEnergy: 0,
            c15InvestEquity: 0,
          });
        }}
      />
    );
  }

  const facilitySteps = ["Details", "Scope 1", "Scope 2", "Scope 3 (Local)"];

  return (
    <div className="w-full flex flex-col relative z-10 p-4 md:p-12 font-mono">
      <div className="max-w-[680px] w-full px-4 sm:px-0 mx-auto transition-all duration-300">
        {/* Back Button */}
        {step === "hub" && !isEditingFacility && (
          <Button variant="ghost" onClick={onBack} className="mb-4 text-muted-foreground hover:text-foreground">
            <ChevronLeft className="w-4 h-4 mr-2" /> Exit Calculator
          </Button>
        )}

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl leading-[1.2] bold text-foreground mb-4">GHG Protocol Hub</h1>
          {step === "hub" && !isEditingFacility && (
            <p className="text-xl text-muted-foreground">ISO 14064 Facility-Based Architecture</p>
          )}
        </div>

        {/* Main Content */}
        <Card className="bg-card border-border shadow-lg">
          <CardContent className="p-8 md:p-10">
            {/* STEP 1: Organization Profile */}
            {step === "org" && (
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-8">
                  <Building2 className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl font-semibold text-foreground">Organization Profile</h2>
                </div>

                <InputRow label="Corporate Entity Name" name="orgName" type="text" value={data.orgName} onChange={handleOrgInput} />
                <InputRow label="Total Global Employees" name="employeesTotal" value={data.employeesTotal} onChange={handleOrgInput} />
                <InputRow label="Global Annual Revenue ($M)" name="revenue" value={data.revenue} onChange={handleOrgInput} />

                <div className="space-y-4 mt-8">
                  <Label className="text-foreground font-medium text-lg">Primary Industry Sector</Label>
                  <Select value={data.sector} onValueChange={(v) => handleSectorChange(v)}>
                    <SelectTrigger className="font-mono text-sm sm:text-base py-4 sm:py-6">
                      <SelectValue placeholder="Select industry sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {SECTORS.map((sector) => (
                        <SelectItem key={sector.id} value={sector.id} className="font-mono text-sm sm:text-base py-3 sm:py-4">
                          {sector.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-between pt-6 border-t border-border">
                  <Button variant="outline" onClick={onBack}>
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
                  </Button>
                  {data.sector && (
                    <Button onClick={() => setStep("hub")} className="bg-primary hover:bg-primary/90">
                      Begin Facility Analysis <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </div>
            )}

            {/* STEP 2: Facilities Hub */}
            {step === "hub" && !isEditingFacility && (
              <div className="space-y-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <Globe className="w-8 h-8 text-primary" />
                    <h2 className="text-2xl font-semibold text-foreground">Facilities Network</h2>
                  </div>
                  <Button variant="outline" size="lg" onClick={addFacility} className="border-primary text-primary hover:bg-primary/10 text-base">
                    <Plus className="w-5 h-5 mr-2" /> Add Physical Location
                  </Button>
                </div>

                <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                  Scopes 1, 2, and localized Scope 3 metrics (commuting, waste, travel) are mapped directly to physical facilities.
                  Click into each facility to configure its emissions payload.
                </p>

                <div className="space-y-4">
                  {data.facilities.map((fac) => (
                    <div
                      key={fac.id}
                      className="p-4 sm:p-6 rounded-xl bg-secondary/30 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <h3 className="font-medium text-lg text-foreground flex items-center gap-2 mb-1">
                          <Factory className="w-5 h-5 text-muted-foreground" />
                          {fac.name}
                        </h3>
                        <p className="text-base text-muted-foreground">
                          Type: {FACILITY_TYPES.find((t) => t.id === fac.type)?.label || fac.type} | {fac.employees} Staff
                        </p>
                      </div>
                      <Button
                        size="lg"
                        onClick={() => setActiveFacilityId(fac.id)}
                        className={`text-base px-6 ${fac.isComplete ? "bg-emerald-600 hover:bg-emerald-700" : "bg-primary hover:bg-primary/90"}`}
                      >
                        {fac.isComplete ? (
                          <>
                            <CheckCircle className="w-5 h-5 mr-2" /> Data Ready
                          </>
                        ) : (
                          "Enter Data"
                        )}
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-border mt-8">
                  <Button variant="outline" size="lg" onClick={() => setStep("org")} className="w-full sm:w-auto text-sm sm:text-base px-4 sm:px-6 py-4 sm:py-6 font-medium">
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Back
                  </Button>
                  <Button
                    size="lg"
                    onClick={() => setStep("org_scope3")}
                    disabled={!allFacilitiesComplete}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base px-4 sm:px-6 py-4 sm:py-6 font-medium"
                  >
                    Proceed to Org-Level Emissions <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}

            {/* FACILITY WIZARD */}
            {isEditingFacility && (
              <>
                {(() => {
                  const fac = data.facilities.find((f) => f.id === activeFacilityId);
                  if (!fac) return null;

                  return (
                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveFacilityId(null)}
                          className="p-0 h-auto text-muted-foreground hover:text-foreground"
                        >
                          <ArrowLeft className="w-4 h-4" />
                        </Button>
                        <h2 className="text-lg font-semibold text-foreground">
                          Configuring: <span className="text-primary">{fac.name}</span>
                        </h2>
                      </div>

                      {/* Progress Steps */}
                      <div className="flex gap-2">
                        {facilitySteps.map((_, i) => (
                          <div
                            key={i}
                            className={`flex-1 h-1 rounded-full transition-colors ${
                              i <= facilityStep ? "bg-primary" : "bg-border"
                            }`}
                          />
                        ))}
                      </div>

                      <div className="text-sm text-muted-foreground mb-4">
                        Step {facilityStep + 1} of {facilitySteps.length}: {facilitySteps[facilityStep]}
                      </div>

                      {renderFacilityStep(fac)}

                      <div className="flex justify-between pt-6 border-t border-border">
                        <Button
                          variant="outline"
                          onClick={() => setFacilityStep((p) => Math.max(0, p - 1))}
                          disabled={facilityStep === 0}
                        >
                          Back
                        </Button>
                        {facilityStep < facilitySteps.length - 1 ? (
                          <Button onClick={() => setFacilityStep((p) => p + 1)} className="bg-primary hover:bg-primary/90">
                            Next <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        ) : (
                          <Button
                            onClick={() => closeFacilityWizard(fac.id)}
                            className="bg-emerald-600 hover:bg-emerald-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" /> Save & Return to Hub
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </>
            )}

            {/* STEP 3: Organization-Level Scope 3 */}
            {step === "org_scope3" && (
              <div className="space-y-8">
                <div className="flex items-center gap-4 mb-8">
                  <Truck className="w-8 h-8 text-primary" />
                  <h2 className="text-2xl sm:text-3xl tracking-tight leading-tight font-bold font-mono text-foreground">Organization-Level Upstream/Downstream</h2>
                </div>

                <p className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                  These Scope 3 emissions map across the entire value chain rather than tying to specific facilities.
                </p>

                <div className="max-h-[500px] overflow-y-auto pr-2 space-y-4">
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

                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-border mt-8">
                  <Button variant="outline" size="lg" onClick={() => setStep("hub")} className="w-full sm:w-auto text-xs sm:text-sm px-8 py-6 font-mono uppercase tracking-widest">
                    <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-2" /> Back to Facilities
                  </Button>
                  <Button size="lg" onClick={calculateResults} className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-xs sm:text-sm px-8 py-6 font-mono uppercase tracking-widest">
                    Calculate ESG Report <Activity className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
