// GHG Emission Factors and Calculation Utilities
// Based on GHG Protocol methodology with India-specific factors

// Emission Factors (kg CO2e per unit)
export const EMISSION_FACTORS = {
  electricity: 0.733, // kg CO2e per kWh (India grid average)
  lpg: 2.984, // kg CO2e per kg LPG
  png: 2.756, // kg CO2e per unit PNG
  petrol: 2.335, // kg CO2e per litre
  diesel: 2.705, // kg CO2e per litre
  cng: 2.756, // kg CO2e per kg
  flightShort: 0.15, // kg CO2e per km
  flightMedium: 0.11, // kg CO2e per km
  flightLong: 0.09, // kg CO2e per km
  waste: 1.35, // tonnes CO2e per tonne waste
  procurement: 0.002941, // kg CO2e per ₹ spent
};

// Industry Benchmarks (tonnes CO2e per employee)
export const INDUSTRY_BENCHMARKS: Record<string, { low: number; avg: number; high: number }> = {
  technology: { low: 2, avg: 4, high: 8 },
  finance: { low: 3, avg: 6, high: 12 },
  retail: { low: 5, avg: 10, high: 20 },
  manufacturing: { low: 15, avg: 35, high: 80 },
  logistics: { low: 20, avg: 50, high: 120 },
  hospitality: { low: 8, avg: 18, high: 35 },
  healthcare: { low: 6, avg: 14, high: 30 },
  education: { low: 2, avg: 5, high: 10 },
  construction: { low: 25, avg: 60, high: 150 },
  agriculture: { low: 30, avg: 80, high: 200 },
  energy: { low: 50, avg: 150, high: 400 },
  mining: { low: 60, avg: 180, high: 500 },
};

// Business Benchmarks
export const BUSINESS_BENCHMARKS: Record<string, { total: number; perEmployee: number }> = {
  office: { total: 8, perEmployee: 4 },
  retail: { total: 15, perEmployee: 8.5 },
  restaurant: { total: 52.5, perEmployee: 17.5 },
  workshop: { total: 95, perEmployee: 22.5 },
  logistics: { total: 240, perEmployee: 40 },
  home: { total: 5, perEmployee: 2 },
};

// Household Emissions Calculator
export interface HouseholdData {
  householdSize: number;
  homeType: 'apartment' | 'independent' | 'shared';
  electricityBillPerMonth: number;
  hasSolar: boolean;
  solarPercentage?: '0-25' | '25-50' | '50-75' | '75-100';
  cookingFuel: 'lpg' | 'png' | 'electric' | 'mixed';
  lpgCylindersPerYear?: number;
  pngBillPerMonth?: number;
  vehicles: Array<{
    type: 'petrol' | 'diesel' | 'cng' | 'twoWheeler' | 'electric';
    kmPerWeek: number;
    efficiency?: number;
  }>;
  shortFlightsPerYear: number;
  mediumFlightsPerYear: number;
  longFlightsPerYear: number;
  dietType: 'vegetarian' | 'eggitarian' | 'nonVegetarian' | 'highMeat' | 'mixed';
  dairyFrequency: 'low' | 'moderate' | 'high';
  eatingOut: 'rarely' | 'weekly' | 'multiple';
  shoppingSpendPerMonth: number;
  smartphonesPerYear: number;
  laptopsPerYear: number;
  appliancesPerYear: number;
  furniturePerYear: number;
  wasteBags: '1-2' | '3-4' | '5-6' | 'more';
  composts: boolean;
}

export interface HouseholdResult {
  rawAnnualKg: { total: number; perCapita: number };
  annualTonnes: {
    energy: number;
    transportation: number;
    flights: number;
    food: number;
    shopping: number;
    waste: number;
    total: number;
    perCapita: number;
  };
  percentages: {
    energy: number;
    transportation: number;
    flights: number;
    food: number;
    shopping: number;
    waste: number;
  };
  chartData: Array<{ name: string; value: number; percentage: number; fill: string }>;
  context: {
    drivingKm: number;
    delhiMumbaiFlights: number;
    trees: number;
    indiaMultiplier: number;
    indiaAverage: number;
    globalAverage: number;
  };
}

export const calculateHouseholdEmissions = (data: HouseholdData): HouseholdResult => {
  const householdSize = data.householdSize || 1;

  // Electricity Emissions
  const monthlyBill = data.electricityBillPerMonth || 0;
  const annualElectricityKwh = (monthlyBill / 8) * 12;
  let electricityEmissions = annualElectricityKwh * EMISSION_FACTORS.electricity;

  // Home Type Adjustment
  if (data.homeType === 'independent') electricityEmissions *= 1.15;
  else if (data.homeType === 'shared') electricityEmissions *= 0.75;

  // Solar offset
  if (data.hasSolar) {
    const solarReductions: Record<string, number> = {
      '0-25': 0.875,
      '25-50': 0.625,
      '50-75': 0.375,
      '75-100': 0.125,
    };
    electricityEmissions *= solarReductions[data.solarPercentage || '0-25'] || 1;
  }

  // Cooking Emissions
  let cookingEmissions = 0;
  if (data.cookingFuel === 'lpg' || data.cookingFuel === 'mixed') {
    cookingEmissions += (data.lpgCylindersPerYear || 0) * 14.2 * EMISSION_FACTORS.lpg;
  }
  if (data.cookingFuel === 'png' || data.cookingFuel === 'mixed') {
    const monthlyUnits = (data.pngBillPerMonth || 0) / 50;
    cookingEmissions += monthlyUnits * 12 * EMISSION_FACTORS.png;
  }

  // Transport Emissions
  let transportEmissions = 0;
  const vehicles = data.vehicles || [];
  vehicles.forEach((v) => {
    const kmPerYear = (v.kmPerWeek || 0) * 52;
    const efficiencyDefaults: Record<string, number> = {
      petrol: 15,
      diesel: 18,
      cng: 20,
      twoWheeler: 40,
      electric: 1,
    };
    const eff = v.efficiency || efficiencyDefaults[v.type];

    if (v.type === 'petrol' || v.type === 'twoWheeler') {
      transportEmissions += (kmPerYear / eff) * EMISSION_FACTORS.petrol;
    } else if (v.type === 'diesel') {
      transportEmissions += (kmPerYear / eff) * EMISSION_FACTORS.diesel;
    } else if (v.type === 'cng') {
      transportEmissions += (kmPerYear / eff) * EMISSION_FACTORS.cng;
    } else if (v.type === 'electric') {
      transportEmissions += kmPerYear * 0.15 * EMISSION_FACTORS.electricity;
    }
  });

  // Flight Emissions
  const flightEmissions =
    (data.shortFlightsPerYear || 0) * 1000 * EMISSION_FACTORS.flightShort +
    (data.mediumFlightsPerYear || 0) * 2500 * EMISSION_FACTORS.flightMedium +
    (data.longFlightsPerYear || 0) * 6000 * EMISSION_FACTORS.flightLong;

  // Food Emissions
  const dietEmissions: Record<string, number> = {
    vegetarian: 650,
    eggitarian: 750,
    mixed: 950,
    nonVegetarian: 1150,
    highMeat: 1600,
  };
  let foodEmissions = (dietEmissions[data.dietType] || 950) * householdSize;

  if (data.dairyFrequency === 'high') foodEmissions *= 1.2;
  else if (data.dairyFrequency === 'moderate') foodEmissions *= 1.1;

  if (data.eatingOut === 'multiple') foodEmissions *= 1.08;
  else if (data.eatingOut === 'weekly') foodEmissions *= 1.05;

  if (data.composts) foodEmissions *= 0.95;

  // Shopping Emissions
  const spendingEmissions = (data.shoppingSpendPerMonth || 0) * 12 * EMISSION_FACTORS.procurement;
  const purchaseEmissions =
    (data.smartphonesPerYear || 0) * 70 +
    (data.laptopsPerYear || 0) * 250 +
    (data.appliancesPerYear || 0) * 1000 +
    (data.furniturePerYear || 0) * 300;

  // Waste Emissions
  const wasteBagsMap: Record<string, number> = { '1-2': 1.5, '3-4': 3.5, '5-6': 5.5, more: 8 };
  const bagsPerWeek = wasteBagsMap[data.wasteBags] || 2;
  const wasteKgPerYear = bagsPerWeek * 5 * 52;
  const wasteEmissions = (wasteKgPerYear / 1000) * EMISSION_FACTORS.waste * 1000;

  // Aggregations
  const aggEnergy = electricityEmissions + cookingEmissions;
  const aggTransport = transportEmissions;
  const aggFlights = flightEmissions;
  const aggFood = foodEmissions;
  const aggShopping = spendingEmissions + purchaseEmissions;
  const aggWaste = wasteEmissions;

  const totalHouseholdKg = aggEnergy + aggTransport + aggFlights + aggFood + aggShopping + aggWaste;
  const perCapitaKg = totalHouseholdKg / householdSize;
  const perCapitaTonnes = perCapitaKg / 1000;

  const pct = (val: number) => (totalHouseholdKg > 0 ? (val / totalHouseholdKg) * 100 : 0);

  const percentages = {
    energy: pct(aggEnergy),
    transportation: pct(aggTransport),
    flights: pct(aggFlights),
    food: pct(aggFood),
    shopping: pct(aggShopping),
    waste: pct(aggWaste),
  };

  const chartData = [
    { name: 'Energy', value: aggEnergy, percentage: percentages.energy, fill: 'hsl(var(--chart-1))' },
    { name: 'Transport', value: aggTransport, percentage: percentages.transportation, fill: 'hsl(var(--chart-2))' },
    { name: 'Flights', value: aggFlights, percentage: percentages.flights, fill: 'hsl(var(--chart-3))' },
    { name: 'Food', value: aggFood, percentage: percentages.food, fill: 'hsl(var(--chart-4))' },
    { name: 'Shopping', value: aggShopping, percentage: percentages.shopping, fill: 'hsl(var(--chart-5))' },
    { name: 'Waste', value: aggWaste, percentage: percentages.waste, fill: 'hsl(45 80% 55%)' },
  ].sort((a, b) => b.value - a.value);

  const indiaAverage = 2.0;

  return {
    rawAnnualKg: { total: totalHouseholdKg, perCapita: perCapitaKg },
    annualTonnes: {
      energy: aggEnergy / householdSize / 1000,
      transportation: aggTransport / householdSize / 1000,
      flights: aggFlights / householdSize / 1000,
      food: aggFood / householdSize / 1000,
      shopping: aggShopping / householdSize / 1000,
      waste: aggWaste / householdSize / 1000,
      total: totalHouseholdKg / 1000,
      perCapita: perCapitaTonnes,
    },
    percentages,
    chartData,
    context: {
      drivingKm: Math.round(perCapitaTonnes * 5208),
      delhiMumbaiFlights: Math.round(perCapitaTonnes / 0.28),
      trees: Math.round(perCapitaTonnes * 40),
      indiaMultiplier: parseFloat((perCapitaTonnes / indiaAverage).toFixed(1)),
      indiaAverage,
      globalAverage: 4.7,
    },
  };
};

// Business Emissions Calculator
export interface BusinessData {
  businessType: 'office' | 'retail' | 'restaurant' | 'workshop' | 'logistics' | 'home';
  electricityBillPerMonth: number;
  employees: number;
  acCount?: number;
  computerCount?: number;
  usesFridges?: boolean;
  retailFridges?: number;
  commercialFridges?: number;
  usesDelivery?: boolean;
  retailDeliveryFuel?: number;
  logisticsFuelLitres?: number;
  logisticsFuelType?: 'petrol' | 'diesel' | 'cng';
  usesGenerator?: boolean;
  dieselGeneratorLitres?: number;
  commercialLpgCylinders?: number;
  homeBusinessLpg?: number;
  homeAddtlElectricity?: number;
  avgCommuteKm?: number;
  flightsKmPerYear?: number;
  trainKmPerYear?: number;
  spendOfficeSupplies?: number;
  spendResaleGoods?: number;
  spendFoodSupply?: number;
  spendRawMaterials?: number;
  spendPackaging?: number;
  wasteBags?: number;
  compostsWaste?: 'yes' | 'no';
}

export interface BusinessResult {
  rawKg: { scope1: number; scope2: number; scope3: number; total: number };
  tonnes: { scope1: number; scope2: number; scope3: number; total: number };
  percentages: { scope1: number; scope2: number; scope3: number };
  chartData: Array<{ name: string; value: number; fill: string }>;
  dashboard: {
    monthlyTonnes: number;
    perEmployeeTonnes: number;
    perDayKg: number;
    score: number;
    ratingStr: string;
    benchmarkTotal: number;
    benchmarkPerEmployee: number;
    benchmarkRatio: number;
    opportunities: Array<{ text: string; potentialReductionTonnes: string }>;
    equivalents: { drivingKm: number; homesPowered: number; trees: number };
  };
}

export const calculateBusinessEmissions = (data: BusinessData): BusinessResult => {
  let scope1 = 0;
  let scope2 = 0;
  let scope3 = 0;

  const activity = {
    electricity: 0,
    vehicleFuel: 0,
    lpg: 0,
    refrigeration: 0,
    commuting: 0,
    travel: 0,
    procurement: 0,
    waste: 0,
  };

  const t = data.businessType;

  // Electricity (Scope 2)
  let baseElectricityKg = 0;
  if (t === 'home') {
    baseElectricityKg = ((data.homeAddtlElectricity || 0) / 8) * 12 * EMISSION_FACTORS.electricity;
  } else {
    baseElectricityKg = ((data.electricityBillPerMonth || 0) / 8) * 12 * EMISSION_FACTORS.electricity;
  }

  if (t === 'office') {
    let multiplier = 1.0;
    const ac = data.acCount || 0;
    if (ac >= 1 && ac <= 2) multiplier += 0.1;
    else if (ac >= 3 && ac <= 5) multiplier += 0.2;
    else if (ac > 5) multiplier += 0.3;

    const pc = data.computerCount || 0;
    if (pc >= 5 && pc <= 10) multiplier += 0.05;
    else if (pc > 10) multiplier += 0.1;

    const el = baseElectricityKg * multiplier;
    scope2 += el;
    activity.electricity += el;
  } else {
    scope2 += baseElectricityKg;
    activity.electricity += baseElectricityKg;
  }

  // Refrigeration
  if (t === 'retail' && data.usesFridges && data.retailFridges) {
    const fr = data.retailFridges * 300 * EMISSION_FACTORS.electricity;
    scope2 += fr;
    activity.electricity += fr;
  }
  if (t === 'restaurant' && data.commercialFridges) {
    const fr = data.commercialFridges * 400 * EMISSION_FACTORS.electricity;
    scope2 += fr;
    activity.electricity += fr;
  }

  // Vehicle Fuel (Scope 1)
  if (t === 'retail' && data.usesDelivery && data.retailDeliveryFuel) {
    const fuel = data.retailDeliveryFuel * EMISSION_FACTORS.petrol;
    scope1 += fuel;
    activity.vehicleFuel += fuel;
  }
  if (t === 'logistics' && data.logisticsFuelLitres) {
    const factors: Record<string, number> = {
      petrol: EMISSION_FACTORS.petrol,
      diesel: EMISSION_FACTORS.diesel,
      cng: EMISSION_FACTORS.cng,
    };
    const fuel = data.logisticsFuelLitres * (factors[data.logisticsFuelType || 'diesel'] || EMISSION_FACTORS.diesel);
    scope1 += fuel;
    activity.vehicleFuel += fuel;
  }
  if (t === 'workshop' && data.usesGenerator && data.dieselGeneratorLitres) {
    const gen = data.dieselGeneratorLitres * EMISSION_FACTORS.diesel;
    scope1 += gen;
    activity.vehicleFuel += gen;
  }

  // LPG (Scope 1)
  if (t === 'restaurant' && data.commercialLpgCylinders) {
    const lpg = data.commercialLpgCylinders * 14.2 * EMISSION_FACTORS.lpg;
    scope1 += lpg;
    activity.lpg += lpg;
  }
  if (t === 'home' && data.homeBusinessLpg) {
    const lpg = data.homeBusinessLpg * 14.2 * EMISSION_FACTORS.lpg;
    scope1 += lpg;
    activity.lpg += lpg;
  }

  // Commuting (Scope 3)
  const headcount = data.employees || 0;
  if (['office', 'retail', 'restaurant', 'workshop', 'logistics'].includes(t)) {
    const commuteKm = data.avgCommuteKm || 0;
    const comm = headcount * commuteKm * 52 * 0.12;
    scope3 += comm;
    activity.commuting += comm;
  }

  // Business Travel (Scope 3)
  if (t === 'office') {
    const flights = (data.flightsKmPerYear || 0) * 0.15;
    const trains = (data.trainKmPerYear || 0) * 0.04;
    scope3 += flights + trains;
    activity.travel += flights + trains;
  }

  // Procurement (Scope 3)
  const monthlyProcurementFactor = 12 * EMISSION_FACTORS.procurement;
  let proc = 0;
  if (t === 'office') proc = (data.spendOfficeSupplies || 0) * monthlyProcurementFactor;
  if (t === 'retail') proc = (data.spendResaleGoods || 0) * monthlyProcurementFactor;
  if (t === 'restaurant') proc = (data.spendFoodSupply || 0) * monthlyProcurementFactor;
  if (t === 'workshop') proc = (data.spendRawMaterials || 0) * monthlyProcurementFactor;
  if (t === 'home') proc = (data.spendPackaging || 0) * monthlyProcurementFactor;
  scope3 += proc;
  activity.procurement += proc;

  // Waste (Scope 3)
  if (t !== 'logistics' && data.wasteBags) {
    const bagsPerWeek = data.wasteBags || 0;
    const wasteKgPerYear = bagsPerWeek * 5 * 52;
    let wasteFootprint = (wasteKgPerYear / 1000) * EMISSION_FACTORS.waste * 1000;
    if (t === 'restaurant' && data.compostsWaste === 'yes') {
      wasteFootprint *= 0.5;
    }
    scope3 += wasteFootprint;
    activity.waste += wasteFootprint;
  }

  const totalKg = scope1 + scope2 + scope3;
  const totalTonnes = totalKg / 1000;
  const employeesFloat = Math.max(headcount, 1);
  const perEmployeeTonnes = totalTonnes / employeesFloat;
  const perDayKg = totalKg / 300;

  const currentBenchmark = BUSINESS_BENCHMARKS[t] || BUSINESS_BENCHMARKS.office;

  let scoreRatio = perEmployeeTonnes / currentBenchmark.perEmployee;
  if (t === 'home') scoreRatio = totalTonnes / currentBenchmark.total;
  let score = 100 - scoreRatio * 30;
  score = Math.max(0, Math.min(100, Math.round(score)));

  let ratingStr = 'Low-carbon business';
  if (score < 40) ratingStr = 'Very high emissions';
  else if (score < 60) ratingStr = 'High emissions';
  else if (score < 80) ratingStr = 'Moderate emissions';

  const activitiesList = [
    { name: 'Electricity', val: activity.electricity, tip: 'Reduce electricity consumption (LED lights, energy efficiency)' },
    { name: 'Vehicle Fuel', val: activity.vehicleFuel, tip: 'Improve vehicle efficiency or optimize delivery routes' },
    { name: 'LPG / Heat', val: activity.lpg, tip: 'Shift to electric heating or more efficient burners' },
    { name: 'Commuting', val: activity.commuting, tip: 'Encourage carpooling, transit, or remote work' },
    { name: 'Business Travel', val: activity.travel, tip: 'Reduce flights; use virtual meetings' },
    { name: 'Procurement', val: activity.procurement, tip: 'Source lower-carbon materials' },
    { name: 'Waste', val: activity.waste, tip: 'Reduce waste; increase recycling/composting' },
  ]
    .filter((a) => a.val > 0)
    .sort((a, b) => b.val - a.val);

  const opportunities = activitiesList.slice(0, 3).map((a) => ({
    text: a.tip,
    potentialReductionTonnes: ((a.val / 1000) * 0.15).toFixed(1),
  }));

  const chartData = [];
  if (activity.electricity > 0) chartData.push({ name: 'Electricity', value: activity.electricity, fill: 'hsl(var(--chart-1))' });
  if (activity.vehicleFuel > 0) chartData.push({ name: 'Vehicle Fuel', value: activity.vehicleFuel, fill: 'hsl(var(--chart-5))' });
  if (activity.lpg > 0) chartData.push({ name: 'LPG / Heating', value: activity.lpg, fill: 'hsl(30 80% 55%)' });
  if (activity.commuting > 0) chartData.push({ name: 'Commuting', value: activity.commuting, fill: 'hsl(var(--chart-2))' });
  if (activity.travel > 0) chartData.push({ name: 'Travel', value: activity.travel, fill: 'hsl(var(--chart-3))' });
  if (activity.procurement > 0) chartData.push({ name: 'Procurement', value: activity.procurement, fill: 'hsl(var(--chart-4))' });
  if (activity.waste > 0) chartData.push({ name: 'Waste', value: activity.waste, fill: 'hsl(220 10% 50%)' });

  return {
    rawKg: { scope1, scope2, scope3, total: totalKg },
    tonnes: {
      scope1: scope1 / 1000,
      scope2: scope2 / 1000,
      scope3: scope3 / 1000,
      total: totalTonnes,
    },
    percentages: {
      scope1: totalKg > 0 ? (scope1 / totalKg) * 100 : 0,
      scope2: totalKg > 0 ? (scope2 / totalKg) * 100 : 0,
      scope3: totalKg > 0 ? (scope3 / totalKg) * 100 : 0,
    },
    chartData,
    dashboard: {
      monthlyTonnes: totalTonnes / 12,
      perEmployeeTonnes,
      perDayKg,
      score,
      ratingStr,
      benchmarkTotal: currentBenchmark.total,
      benchmarkPerEmployee: currentBenchmark.perEmployee,
      benchmarkRatio: ((totalTonnes - currentBenchmark.total) / currentBenchmark.total) * 100,
      opportunities,
      equivalents: {
        drivingKm: Math.round(totalKg / 0.192),
        homesPowered: Math.round(totalTonnes / 5),
        trees: Math.round(totalTonnes * 47.6),
      },
    },
  };
};

// Industry Calculator Types
export interface FacilityData {
  name: string;
  employees: number;
  floorAreaSqm: number;
  electricityKwh: number;
  renewableKwh: number;
  naturalGasUnits: number;
  dieselLitres: number;
  lpgKg: number;
  refrigerantLeakageKg: number;
  companyVehicleKm: number;
  wasteToLandfillTonnes: number;
}

export interface IndustryData {
  sector: string;
  totalEmployees: number;
  annualRevenue: number;
  facilities: FacilityData[];
  scope3: {
    purchasedGoodsSpend: number;
    capitalGoodsSpend: number;
    fuelEnergyKwh: number;
    upstreamTransportSpend: number;
    wasteDisposalTonnes: number;
    businessTravelKm: number;
    employeeCommutingKm: number;
    downstreamTransportSpend: number;
    usePhaseEmissions: number;
    endOfLifeTonnes: number;
    leasedAssetsEmissions: number;
    franchiseEmissions: number;
    investmentEmissions: number;
  };
}

export interface IndustryResult {
  rawKg: { scope1: number; scope2: number; scope3: number; total: number };
  tonnes: { scope1: number; scope2: number; scope3: number; total: number };
  dashboard: {
    perEmployeeTonnes: number;
    revenueIntensity: number;
    floorAreaIntensity: number;
    scope3Pct: number;
  };
  facilityEmissions: Array<{ name: string; scope1: number; scope2: number; total: number }>;
  chartData: Array<{ name: string; value: number; fill: string }>;
  scope3ChartData: Array<{ name: string; value: number; fill: string }>;
  benchmark: {
    label: string;
    low: number;
    avg: number;
    high: number;
    userValue: number;
    status: 'excellent' | 'good' | 'average' | 'high';
  };
  reductionOpportunities: Array<{ category: string; suggestion: string; potentialSavings: number }>;
  renewable: { totalKwh: number; offsetTonnes: number; pct: number };
  equivalents: { drivingKm: number; homesPowered: number; trees: number; flightsEquivalent: number };
}

export const calculateIndustryEmissions = (data: IndustryData): IndustryResult => {
  let scope1 = 0;
  let scope2 = 0;
  let scope3 = 0;
  let grandTotalRenewableKwh = 0;
  let totalFloorArea = 0;

  const facilityEmissions: Array<{ name: string; scope1: number; scope2: number; total: number }> = [];

  // Process facilities
  data.facilities.forEach((f) => {
    totalFloorArea += f.floorAreaSqm || 0;
    grandTotalRenewableKwh += f.renewableKwh || 0;

    // Scope 1
    const s1 =
      (f.naturalGasUnits || 0) * EMISSION_FACTORS.png +
      (f.dieselLitres || 0) * EMISSION_FACTORS.diesel +
      (f.lpgKg || 0) * EMISSION_FACTORS.lpg +
      (f.refrigerantLeakageKg || 0) * 1430 + // R-410A GWP
      (f.companyVehicleKm || 0) * 0.192;

    // Scope 2
    const netElectricity = Math.max(0, (f.electricityKwh || 0) - (f.renewableKwh || 0));
    const s2 = netElectricity * EMISSION_FACTORS.electricity;

    scope1 += s1;
    scope2 += s2;

    facilityEmissions.push({
      name: f.name || 'Facility',
      scope1: s1 / 1000,
      scope2: s2 / 1000,
      total: (s1 + s2) / 1000,
    });
  });

  // Scope 3 calculations
  const s3 = data.scope3;
  const cat1 = (s3.purchasedGoodsSpend || 0) * EMISSION_FACTORS.procurement * 12;
  const cat2 = (s3.capitalGoodsSpend || 0) * 0.5;
  const cat3 = (s3.fuelEnergyKwh || 0) * 0.05;
  const cat4 = (s3.upstreamTransportSpend || 0) * EMISSION_FACTORS.procurement * 12;
  const cat5 = (s3.wasteDisposalTonnes || 0) * EMISSION_FACTORS.waste * 1000;
  const cat6 = (s3.businessTravelKm || 0) * 0.15;
  const cat7 = (s3.employeeCommutingKm || 0) * data.totalEmployees * 0.12;
  const cat9 = (s3.downstreamTransportSpend || 0) * EMISSION_FACTORS.procurement * 12;
  const cat11 = s3.usePhaseEmissions || 0;
  const cat12 = (s3.endOfLifeTonnes || 0) * EMISSION_FACTORS.waste * 1000;
  const cat13 = s3.leasedAssetsEmissions || 0;
  const cat14 = s3.franchiseEmissions || 0;
  const cat15 = s3.investmentEmissions || 0;

  scope3 = cat1 + cat2 + cat3 + cat4 + cat5 + cat6 + cat7 + cat9 + cat11 + cat12 + cat13 + cat14 + cat15;

  const totalKg = scope1 + scope2 + scope3;
  const totalTonnes = totalKg / 1000;
  const perEmployeeTonnes = totalTonnes / Math.max(data.totalEmployees, 1);

  // Benchmark
  const benchmark = INDUSTRY_BENCHMARKS[data.sector] || INDUSTRY_BENCHMARKS.manufacturing;
  let benchmarkStatus: 'excellent' | 'good' | 'average' | 'high' = 'average';
  if (perEmployeeTonnes <= benchmark.low) benchmarkStatus = 'excellent';
  else if (perEmployeeTonnes <= benchmark.avg) benchmarkStatus = 'good';
  else if (perEmployeeTonnes > benchmark.high) benchmarkStatus = 'high';

  // Renewable metrics
  const totalElectricity = data.facilities.reduce((sum, f) => sum + (f.electricityKwh || 0), 0);
  const renewablePct = totalElectricity > 0 ? (grandTotalRenewableKwh / totalElectricity) * 100 : 0;
  const renewableOffsetTonnes = (grandTotalRenewableKwh * EMISSION_FACTORS.electricity) / 1000;

  // Chart data
  const chartData = [
    { name: 'Scope 1', value: scope1 / 1000, fill: 'hsl(var(--chart-1))' },
    { name: 'Scope 2', value: scope2 / 1000, fill: 'hsl(var(--chart-2))' },
    { name: 'Scope 3', value: scope3 / 1000, fill: 'hsl(var(--chart-3))' },
  ];

  const scope3ChartData = [
    { name: 'Purchased Goods', value: cat1 / 1000, fill: 'hsl(var(--chart-1))' },
    { name: 'Business Travel', value: cat6 / 1000, fill: 'hsl(var(--chart-2))' },
    { name: 'Commuting', value: cat7 / 1000, fill: 'hsl(var(--chart-3))' },
    { name: 'Waste', value: cat5 / 1000, fill: 'hsl(var(--chart-4))' },
  ].filter((d) => d.value > 0);

  // Reduction opportunities
  const reductionOpportunities = [
    { category: 'Energy Efficiency', suggestion: 'Upgrade to LED lighting and efficient HVAC', potentialSavings: scope2 * 0.15 / 1000 },
    { category: 'Renewable Energy', suggestion: 'Increase on-site solar or purchase RECs', potentialSavings: scope2 * 0.4 / 1000 },
    { category: 'Supply Chain', suggestion: 'Engage suppliers on emissions reduction', potentialSavings: cat1 * 0.1 / 1000 },
  ].filter((o) => o.potentialSavings > 0);

  return {
    rawKg: { scope1, scope2, scope3, total: totalKg },
    tonnes: { scope1: scope1 / 1000, scope2: scope2 / 1000, scope3: scope3 / 1000, total: totalTonnes },
    dashboard: {
      perEmployeeTonnes,
      revenueIntensity: totalTonnes / Math.max(data.annualRevenue, 1),
      floorAreaIntensity: totalFloorArea > 0 ? totalTonnes / totalFloorArea : 0,
      scope3Pct: totalKg > 0 ? (scope3 / totalKg) * 100 : 0,
    },
    facilityEmissions,
    chartData,
    scope3ChartData,
    benchmark: {
      label: data.sector,
      low: benchmark.low,
      avg: benchmark.avg,
      high: benchmark.high,
      userValue: perEmployeeTonnes,
      status: benchmarkStatus,
    },
    reductionOpportunities,
    renewable: { totalKwh: grandTotalRenewableKwh, offsetTonnes: renewableOffsetTonnes, pct: renewablePct },
    equivalents: {
      drivingKm: Math.round(totalKg / 0.192),
      homesPowered: Math.round(totalTonnes / 5),
      trees: Math.round(totalTonnes * 47.6),
      flightsEquivalent: Math.round(totalTonnes / 0.9),
    },
  };
};
