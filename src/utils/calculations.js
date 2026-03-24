export const calculateIndustryEmissions = (data) => {
  let scope1 = 0;
  let scope2 = 0;
  let scope3 = 0;

  const INDUSTRY_BENCHMARKS = {
    'Banking & Financial Services':  { low: 1,   avg: 2.5, high: 5    },
    'IT / Software':                 { low: 1.5, avg: 3,   high: 6    },
    'Telecommunications':            { low: 3,   avg: 6,   high: 12   },
    'Retail':                        { low: 5,   avg: 9,   high: 15   },
    'Logistics & Transport':         { low: 15,  avg: 35,  high: 80   },
    'Hospitality (Hotels)':          { low: 6,   avg: 15,  high: 30   },
    'Healthcare (Hospitals)':        { low: 10,  avg: 25,  high: 50   },
    'Education':                     { low: 4,   avg: 10,  high: 20   },
    'Agriculture':                   { low: 8,   avg: 20,  high: 40   },
    'Food Processing':               { low: 12,  avg: 30,  high: 70   },
    'Manufacturing (light)':         { low: 15,  avg: 40,  high: 80   },
    'Manufacturing (heavy)':         { low: 40,  avg: 120, high: 300  },
    'Cement':                        { low: 120, avg: 300, high: 700  },
    'Steel':                         { low: 150, avg: 400, high: 900  },
    'Chemicals':                     { low: 80,  avg: 200, high: 500  },
    'Mining':                        { low: 100, avg: 350, high: 900  },
    'Oil & Gas':                     { low: 200, avg: 500, high: 1200 },
    'Power Generation':              { low: 250, avg: 700, high: 1500 },
    'Construction':                  { low: 20,  avg: 50,  high: 120  },
    'Warehousing':                   { low: 10,  avg: 25,  high: 60   },
    'Data Centers':                  { low: 30,  avg: 80,  high: 200  },
    'Research Laboratories':         { low: 20,  avg: 60,  high: 150  }
  };
  const SECTOR_TO_BENCHMARK = {
    finance: 'Banking & Financial Services',
    tech: 'IT / Software',
    manufacturing: 'Manufacturing (light)',
    agriculture: 'Agriculture',
    logistics: 'Logistics & Transport',
    hospitality: 'Hospitality (Hotels)',
    healthcare: 'Healthcare (Hospitals)',
    other: 'IT / Software'
  };

  let activity = {
    stationaryCombustion: 0,
    mobileCombustion: 0,
    industrialProcess: 0,
    fugitiveLeaks: 0,
    // S2
    electricityPurchased: 0,
    heatSteamCooling: 0,
    // S3 (15 Categories)
    cat1PurchasedGoods: 0,
    cat2CapitalGoods: 0,
    cat3FuelEnergyRelated: 0,
    cat4UpstreamTransport: 0,
    cat5Waste: 0,
    cat6BusinessTravel: 0,
    cat7Commuting: 0,
    cat8UpstreamLeased: 0,
    cat9DownstreamTransport: 0,
    cat10ProcessingSold: 0,
    cat11UseSold: 0,
    cat12EndLife: 0,
    cat13DownstreamLeased: 0,
    cat14Franchises: 0,
    cat15Investments: 0,
    // Modules
    sectorSpecific: 0
  };


  const s = data.sector;
  const facilities = data.facilities || [];
  const facilityEmissions = [];
  let grandTotalRenewableKwh = 0;
  let grandTotalRawKwh = 0;

  facilities.forEach(fac => {
    // Local Scope 1 - Stationary & Process
    const statC = 
      (fac.dieselBoilersL || 0) * 2.68 + 
      (fac.naturalGasM3 || 0) * 2.02 + 
      (fac.lpgHeatingKg || 0) * 2.98 + 
      (fac.coalTonnes || 0) * 2400 + 
      (fac.furnaceOilL || 0) * 3.15 + 
      (fac.biomassTonnes || 0) * 90 +
      (fac.dieselGeneratorsL || 0) * 2.68 +
      (fac.naturalGasHeatingM3 || 0) * 2.02 +
      (fac.medicalGas || 0) * 1200 +
      (fac.explosivesTonnes || 0) * 350 +
      (fac.fertilizerTonnes || 0) * 2100;

    activity.stationaryCombustion += statC;
    
    // Local Scope 1 - Mobile 
    const mobC = 
      (fac.petrolFleetL || 0) * 2.335 + 
      (fac.dieselFleetL || 0) * 2.705 + 
      (fac.cngFleetKg || 0) * 2.66 + 
      (fac.aviationFuelL || 0) * 2.52 + 
      (fac.marineFuelL || 0) * 3.11 +
      (fac.dieselForkliftsL || 0) * 2.705 +
      (fac.lpgForkliftsKg || 0) * 2.98 +
      (fac.petrolInternalL || 0) * 2.335 +
      (fac.cargoEquipmentL || 0) * 2.705 +
      (fac.miningEquipmentL || 0) * 2.705 +
      (fac.tractorDieselL || 0) * 2.705;

    activity.mobileCombustion += mobC;

    // Local Scope 1 - Industrial Process
    const indP = 
      (fac.processCo2 || 0) * 1000 + 
      (fac.processCement || 0) * 785 + 
      (fac.processSteel || 0) * 1850 + 
      (fac.processLime || 0) * 750 + 
      (fac.processAluminum || 0) * 16500 + 
      (fac.processChemical || 0) * 1000;
    activity.industrialProcess += indP;
    
    // Local Scope 1 - Fugitive Leaks
    const leaks = 
      (fac.leakRefrigerantKg || 0) * 2088 + 
      (fac.leakMethane || 0) * 28 + 
      (fac.leakFireSuppression || 0) * 3200 + 
      (fac.leakIndustrial || 0) * 2000; 
    activity.fugitiveLeaks += leaks;

    // Local Scope 2 - Electricity & Purchased Power
    const totalRawKwh = 
      (fac.elecOfficesKwh || 0) + (fac.elecMfgKwh || 0) + (fac.elecHvacKwh || 0) +
      (fac.elecLightingKwh || 0) + (fac.elecRefrigerationKwh || 0) + 
      (fac.elecAutomatedStorageKwh || 0) + (fac.elecItKwh || 0) + 
      (fac.elecServersKwh || 0) + (fac.elecCoolingKwh || 0) + 
      (fac.elecUpsKwh || 0) + (fac.elecPduKwh || 0) + (fac.elecAtmsKwh || 0) +
      (fac.elecWarehouseKwh || 0) + (fac.elecLabEquipmentKwh || 0) +
      (fac.elecVentilationKwh || 0) + (fac.elecMedicalEquipmentKwh || 0) +
      (fac.elecGuestRoomsKwh || 0) + (fac.elecLaundryKwh || 0) +
      (fac.elecKitchensKwh || 0) + (fac.elecMiningKwh || 0) +
      (fac.elecIrrigationKwh || 0) + (fac.elecPlantOpsKwh || 0) +
      (fac.elecConstructionKwh || 0);

    const facRenewable = (fac.solarGenKwh || 0) + (fac.windGenKwh || 0) + (fac.renewablePpaKwh || 0);
    const gridElec = Math.max(totalRawKwh - facRenewable, 0);
    const facElecEmissions = gridElec * 0.733;
    grandTotalRenewableKwh += facRenewable;
    grandTotalRawKwh += totalRawKwh;
    activity.electricityPurchased += facElecEmissions;
    
    const steam = (fac.purchasedSteamTns || 0) * 200; 
    const heat = (fac.purchasedHeatingGj || 0) * 50; 
    const cooling = (fac.purchasedCoolingGj || 0) * 50; 
    activity.heatSteamCooling += (steam + heat + cooling);

    const facS3Up = ((fac.c4Dist || 0) * (fac.c4Weight || 0) * 0.1) +
      ((fac.c4RawMaterialsTonnes || 0) * (fac.c4RawMaterialsDist || 0) * 0.1);
    activity.cat4UpstreamTransport += facS3Up;

    const facS3Down = ((fac.c9TransportDist || 0) * (fac.c9Weight || 0) * 0.1) +
      ((fac.c9FinishedGoodsTonnes || 0) * (fac.c9FinishedGoodsDist || 0) * 0.1);
    activity.cat9DownstreamTransport += facS3Down;

    const facCat1 = (fac.goodsPurchasedResale || 0) * 1000 + (fac.packagingMaterialsTonnes || 0) * 850 + 
      (fac.officeEquipmentSpend || 0) * 0.003 + (fac.paperConsumptionKg || 0) * 1.5 + 
      (fac.waterConsumptionM3 || 0) * 0.3 + (fac.chemicalPurchases$ || 0) * 0.005 + 
      (fac.pharmaceuticalSupply$ || 0) * 0.004 + (fac.medicalEquipSpend || 0) * 0.006 + 
      (fac.foodProcurement$ || 0) * 0.002 + (fac.laundryServicesSpend || 0) * 0.001 + 
      (fac.constructionMaterialsSpend || 0) * 0.008;
    activity.cat1PurchasedGoods += facCat1;

    const facCat2 = (fac.itHardwareEmissions || 0) * 1000 + (fac.serverLifecycleEmissions || 0) * 1000;
    activity.cat2CapitalGoods += facCat2;

    const facCat8 = (fac.cloudInfraEmissions || 0) * 1000;
    activity.cat8UpstreamLeased += facCat8;
    const facSubTransport = (fac.subcontractedTransportDist || 0) * 0.5;
    activity.cat4UpstreamTransport += facSubTransport;

    const facCat5 = (fac.c5Landfill || 0) * 1350 + (fac.c5Incinerated || 0) * 600 + 
      (fac.c5Recycled || 0) * 21 + (fac.c5Hazardous || 0) * 3000 +
      (fac.wasteRockTonnes || 0) * 5 + (fac.agriculturalWasteTonnes || 0) * 40;
    activity.cat5Waste += facCat5;

    const facCat6 = (fac.c6FlightDist || 0) * 0.15 + (fac.c6TrainDist || 0) * 0.04 + 
      (fac.c6CarDist || 0) * 0.17 + (fac.c6HotelStays || 0) * 30 + (fac.c6TaxiDist || 0) * 0.17;
    activity.cat6BusinessTravel += facCat6;

    const facPassenger = (fac.customerTransportDist || 0) * 0.17 + (fac.patientTravelDist || 0) * 0.17 +
       (fac.studentCommutingDist || 0) * 0.12 + (fac.tourismTransportDist || 0) * 0.2;
    activity.cat9DownstreamTransport += facPassenger;

    const facCat7 = (fac.c7CommutingEmployees || 0) * (fac.c7CommuteDist || 0) * 52 * 0.12 * (1 - ((fac.c7RemotePct || 0) / 100));
    activity.cat7Commuting += facCat7;

    const fS1 = statC + mobC + indP + leaks;
    const fS2 = facElecEmissions + steam + heat + cooling;
    const fS3 = facCat1 + facCat2 + facCat5 + facCat6 + facCat7 + facCat8 + facS3Up + facS3Down + facPassenger + facSubTransport;
    facilityEmissions.push({
      name: fac.name, type: fac.type,
      employees: fac.employees || 0, floorArea: fac.floorArea || 0,
      scope1: fS1 / 1000, scope2: fS2 / 1000, scope3: fS3 / 1000,
      total: (fS1 + fS2 + fS3) / 1000
    });
  });

  scope1 = activity.stationaryCombustion + activity.mobileCombustion + activity.industrialProcess + activity.fugitiveLeaks;
  scope2 = activity.electricityPurchased + activity.heatSteamCooling;

  // --- 2. Organization Level Scope 3 ---
  activity.cat1PurchasedGoods = 
    (data.c1RawMaterials || 0) * 2000 + 
    (data.c1Spend || 0) * 0.003 + 
    (data.c1Chemicals || 0) * 2500 + 
    (data.c1Agri || 0) * 1200 + 
    (data.c1Packaging || 0) * 850;
    
  activity.cat2CapitalGoods = 
    (data.c2Machinery || 0) * 0.005 + 
    (data.c2Buildings || 0) * 0.004 + 
    (data.c2Vehicles || 0) * 0.006 + 
    (data.c2IT || 0) * 0.008;

  activity.cat3FuelEnergyRelated = (data.c3Extraction || 0) * 1000 + (data.c3ElecGen || 0) * 1000;
  activity.cat8UpstreamLeased = (data.c8LeasedBldgEnergy || 0) * 0.733 + (data.c8LeasedEquipEnergy || 0) * 0.733;
  activity.cat10ProcessingSold = (data.c10ProcessingEnergy || 0) * 0.733;
  activity.cat11UseSold = (data.c11ProductEnergy || 0) * 0.733;
  activity.cat12EndLife = (data.c12WasteGenerated || 0) * (1 - ((data.c12RecyclingRate || 0)/100)) * 1350;
  activity.cat13DownstreamLeased = (data.c13DownstreamLeasedEnergy || 0) * 0.733;
  activity.cat14Franchises = (data.c14FranchiseEnergy || 0) * 0.733;

  activity.cat15Investments = 
    (data.c15LoansFossil || 0) * 1000 * 0.5 + 
    (data.c15LoansMfg || 0) * 1000 * 0.2 + 
    (data.c15LoansAg || 0) * 1000 * 0.3 + 
    (data.c15InvestEquity || 0) * 1000 * 0.1 + 
    (data.c15ProjectFinance || 0) * 1000 + 
    (data.c15Mortgage || 0) * 1000;

  // Sector Specific Modules
  if (s === 'finance') {
     activity.sectorSpecific = 
        (data.bankFinancedTotal || 0) * 1000 + 
        (data.bankCorporateExposure || 0) * 1000 + 
        (data.bankRetailExposure || 0) * 1000 + 
        (data.bankInvestments || 0) * 1000 + 
        (data.bankAssetMgmt || 0) * 1000;
     activity.cat15Investments += activity.sectorSpecific; 
  } else if (s === 'tech') {
     const teLoad = (data.techServerKwh || 0) * 0.733 + (data.techCoolingKwh || 0) * 0.733;
     const teGen = (data.techBackupL || 0) * 2.68;
     const teCloud = (data.techCloudEmissions || 0) * 1000;
     activity.sectorSpecific = teLoad + teGen + teCloud;
     scope2 += teLoad;
     scope1 += teGen;
     activity.cat1PurchasedGoods += teCloud; 
  } else if (s === 'agriculture') {
     const agCh4 = (data.agLivestock || 0) * 100 * 25; 
     const agN2o = (data.agFertilizer || 0) * 1000 * 3; 
     const agSoil = (data.agSoil || 0) * 1000;
     activity.sectorSpecific = agCh4 + agN2o + agSoil;
     scope1 += activity.sectorSpecific; 
  } else if (s === 'logistics') {
     const logF = (data.logFleetL || 0) * 2.705;
     const logExtra = (data.logDist || 0) * (data.logLoad || 0) * 0.05;
     activity.sectorSpecific = logF + logExtra;
     scope1 += activity.sectorSpecific;
  } else if (s === 'hospitality') {
     const hospE = (data.hospGuestKwh || 0) * 0.733 + (data.hospLaundry || 0) * 0.733;
     const hospF = (data.hospFood || 0) * 0.003;
     activity.sectorSpecific = hospE + hospF;
     scope2 += hospE;
     activity.cat1PurchasedGoods += hospF;
  } else if (s === 'healthcare') {
     const hc1 = (data.healthMedicalGas || 0) * 1000;
     const hc2 = (data.healthPharma || 0) * 0.005;
     const hc3 = (data.healthWaste || 0) * 2000;
     activity.sectorSpecific = hc1 + hc2 + hc3;
     scope1 += hc1; 
     activity.cat1PurchasedGoods += hc2;
     activity.cat5Waste += hc3;
  }

  // Aggregate Total Scope 3
  scope3 = activity.cat1PurchasedGoods + activity.cat2CapitalGoods + activity.cat3FuelEnergyRelated + activity.cat4UpstreamTransport + activity.cat5Waste + activity.cat6BusinessTravel + activity.cat7Commuting + activity.cat8UpstreamLeased + activity.cat9DownstreamTransport + activity.cat10ProcessingSold + activity.cat11UseSold + activity.cat12EndLife + activity.cat13DownstreamLeased + activity.cat14Franchises + activity.cat15Investments;

  const totalKg = scope1 + scope2 + scope3;
  const totalTonnes = totalKg / 1000;
  
  const sumFacEmployees = facilities.reduce((sum, f) => sum + (f.employees || 0), 0);
  const totalEmp = data.employeesTotal || sumFacEmployees || 1;
  const rev = Math.max(data.revenue || 1, 1);
  const totalFloorArea = facilities.reduce((sum, f) => sum + (f.floorArea || 0), 0);
  const perEmployeeTonnes = totalTonnes / totalEmp;

  // Benchmark
  const benchmarkLabel = SECTOR_TO_BENCHMARK[s] || 'IT / Software';
  const benchmark = INDUSTRY_BENCHMARKS[benchmarkLabel];
  let benchmarkStatus = 'leader';
  if (perEmployeeTonnes > benchmark.high) benchmarkStatus = 'critical';
  else if (perEmployeeTonnes > benchmark.avg) benchmarkStatus = 'above-average';
  else if (perEmployeeTonnes > benchmark.low) benchmarkStatus = 'average';

  // Reduction opportunities — top 5 largest buckets
  const actRanked = [
    { name: 'Stationary Combustion', kg: activity.stationaryCombustion, scope: 'Scope 1', tip: 'Switch to renewable thermal energy or improve boiler/furnace efficiency' },
    { name: 'Mobile Combustion',     kg: activity.mobileCombustion,     scope: 'Scope 1', tip: 'Electrify fleet vehicles and optimise routing logistics' },
    { name: 'Industrial Processes',  kg: activity.industrialProcess,    scope: 'Scope 1', tip: 'Adopt low-carbon process alternatives and capture by-product CO₂' },
    { name: 'Fugitive Emissions',    kg: activity.fugitiveLeaks,        scope: 'Scope 1', tip: 'Implement leak detection & refrigerant management programmes' },
    { name: 'Grid Electricity',      kg: activity.electricityPurchased, scope: 'Scope 2', tip: 'Install on-site solar/wind and procure renewable energy PPAs' },
    { name: 'Heat & Steam',          kg: activity.heatSteamCooling,     scope: 'Scope 2', tip: 'Switch to green steam/heat suppliers or district heating networks' },
    { name: 'Supply Chain (Cat 1)',  kg: activity.cat1PurchasedGoods,   scope: 'Scope 3', tip: 'Engage suppliers on science-based targets and low-carbon material sourcing' },
    { name: 'Business Travel',       kg: activity.cat6BusinessTravel,   scope: 'Scope 3', tip: 'Replace short-haul flights with virtual meetings and rail travel' },
    { name: 'Commuting',             kg: activity.cat7Commuting,        scope: 'Scope 3', tip: 'Expand remote work policy and subsidise public transport commuting' },
    { name: 'Waste',                 kg: activity.cat5Waste,            scope: 'Scope 3', tip: 'Increase recycling rates and implement zero-waste-to-landfill targets' },
    { name: 'Upstream Transport',    kg: activity.cat4UpstreamTransport, scope: 'Scope 3', tip: 'Consolidate shipments and shift to lower-emission freight modes' },
    { name: 'Investments (Cat 15)',  kg: activity.cat15Investments,     scope: 'Scope 3', tip: 'Align investment portfolio with Paris Agreement decarbonisation pathways' },
  ].filter(a => a.kg > 0).sort((a, b) => b.kg - a.kg);

  const reductionOpportunities = actRanked.slice(0, 5).map(a => ({
    name: a.name, scope: a.scope, tip: a.tip,
    tonnes: a.kg / 1000, savingsTonnes: (a.kg / 1000) * 0.15
  }));

  // Renewable stats
  const renewableOffsetTonnes = (grandTotalRenewableKwh * 0.733) / 1000;
  const renewablePct = grandTotalRawKwh > 0 ? Math.min((grandTotalRenewableKwh / grandTotalRawKwh) * 100, 100) : 0;

  // Equivalents
  const drivingKm = Math.round(totalKg / 0.192);
  const homesPowered = Math.round(totalTonnes / 5);
  const trees = Math.round(totalTonnes * 47.6);
  const flightsEquivalent = Math.round(totalTonnes / 0.28);

  // Charts
  const pieData = [];
  if (scope1 > 0) pieData.push({ name: 'Scope 1 Process & Fuel', value: scope1, fill: '#ef4444' });
  if (scope2 > 0) pieData.push({ name: 'Scope 2 Energy', value: scope2, fill: '#f59e0b' });
  if (activity.cat1PurchasedGoods > 0) pieData.push({ name: 'S3: Supply Chain (Cat 1)', value: activity.cat1PurchasedGoods, fill: '#10b981' });
  if (activity.cat2CapitalGoods > 0) pieData.push({ name: 'S3: Capital Goods (Cat 2)', value: activity.cat2CapitalGoods, fill: '#059669' });
  if (activity.cat15Investments > 0) pieData.push({ name: 'S3: Financed/Investments (Cat 15)', value: activity.cat15Investments, fill: '#3b82f6' });
  if (activity.cat4UpstreamTransport + activity.cat9DownstreamTransport > 0) pieData.push({ name: 'S3: Transport (Cat 4 & 9)', value: activity.cat4UpstreamTransport + activity.cat9DownstreamTransport, fill: '#8b5cf6' });
  if (activity.cat11UseSold > 0) pieData.push({ name: 'S3: Use of Sold Products (Cat 11)', value: activity.cat11UseSold, fill: '#ec4899' });

  const scope3ChartData = [
    { name: 'Cat 1: Purchased Goods',      value: activity.cat1PurchasedGoods / 1000,     fill: '#10b981' },
    { name: 'Cat 2: Capital Goods',         value: activity.cat2CapitalGoods / 1000,       fill: '#059669' },
    { name: 'Cat 3: Fuel & Energy',         value: activity.cat3FuelEnergyRelated / 1000,  fill: '#34d399' },
    { name: 'Cat 4: Upstream Transport',    value: activity.cat4UpstreamTransport / 1000,  fill: '#6ee7b7' },
    { name: 'Cat 5: Waste',                value: activity.cat5Waste / 1000,              fill: '#a78bfa' },
    { name: 'Cat 6: Business Travel',       value: activity.cat6BusinessTravel / 1000,     fill: '#8b5cf6' },
    { name: 'Cat 7: Commuting',            value: activity.cat7Commuting / 1000,          fill: '#7c3aed' },
    { name: 'Cat 8: Upstream Leased',      value: activity.cat8UpstreamLeased / 1000,     fill: '#5b21b6' },
    { name: 'Cat 9: Downstream Transport', value: activity.cat9DownstreamTransport / 1000, fill: '#60a5fa' },
    { name: 'Cat 10: Processing Sold',     value: activity.cat10ProcessingSold / 1000,    fill: '#3b82f6' },
    { name: 'Cat 11: Use of Products',     value: activity.cat11UseSold / 1000,           fill: '#2563eb' },
    { name: 'Cat 12: End-of-Life',         value: activity.cat12EndLife / 1000,           fill: '#1d4ed8' },
    { name: 'Cat 13: Downstream Leased',   value: activity.cat13DownstreamLeased / 1000,  fill: '#f59e0b' },
    { name: 'Cat 14: Franchises',          value: activity.cat14Franchises / 1000,        fill: '#d97706' },
    { name: 'Cat 15: Investments',         value: activity.cat15Investments / 1000,       fill: '#b45309' },
  ].filter(d => d.value > 0);

  const activityChartData = [
    { name: 'Stationary Combustion', value: activity.stationaryCombustion / 1000, fill: '#ef4444' },
    { name: 'Mobile Combustion',     value: activity.mobileCombustion / 1000,     fill: '#f87171' },
    { name: 'Industrial Process',    value: activity.industrialProcess / 1000,    fill: '#fca5a5' },
    { name: 'Fugitive Leaks',        value: activity.fugitiveLeaks / 1000,        fill: '#f97316' },
    { name: 'Grid Electricity',      value: activity.electricityPurchased / 1000, fill: '#f59e0b' },
    { name: 'Heat & Steam',          value: activity.heatSteamCooling / 1000,     fill: '#fcd34d' },
    { name: 'Supply Chain',          value: activity.cat1PurchasedGoods / 1000,   fill: '#10b981' },
    { name: 'Transport',             value: (activity.cat4UpstreamTransport + activity.cat9DownstreamTransport) / 1000, fill: '#8b5cf6' },
    { name: 'Business Travel',       value: activity.cat6BusinessTravel / 1000,   fill: '#60a5fa' },
    { name: 'Commuting',             value: activity.cat7Commuting / 1000,        fill: '#a78bfa' },
    { name: 'Waste',                 value: activity.cat5Waste / 1000,            fill: '#94a3b8' },
    { name: 'Investments',           value: activity.cat15Investments / 1000,     fill: '#3b82f6' },
  ].filter(d => d.value > 0).sort((a, b) => b.value - a.value);

  return {
    rawKg: { scope1, scope2, scope3, total: totalKg },
    tonnes: { scope1: scope1/1000, scope2: scope2/1000, scope3: scope3/1000, total: totalTonnes },
    dashboard: {
      perEmployeeTonnes,
      revenueIntensity: totalTonnes / rev,
      floorAreaIntensity: totalFloorArea > 0 ? (totalTonnes / totalFloorArea) : 0,
      scope3Pct: totalKg > 0 ? (scope3 / totalKg) * 100 : 0
    },
    facilityEmissions,
    activityChartData,
    scope3ChartData,
    chartData: pieData,
    benchmark: { label: benchmarkLabel, low: benchmark.low, avg: benchmark.avg, high: benchmark.high, userValue: perEmployeeTonnes, status: benchmarkStatus },
    allBenchmarks: INDUSTRY_BENCHMARKS,
    reductionOpportunities,
    renewable: { totalKwh: grandTotalRenewableKwh, offsetTonnes: renewableOffsetTonnes, pct: renewablePct },
    equivalents: { drivingKm, homesPowered, trees, flightsEquivalent }
  };
};


export const calculateBusinessEmissions = (data) => {
  let scope1 = 0; // Direct: fuel, fugitive
  let scope2 = 0; // Indirect: purchased electricity
  let scope3 = 0; // Value chain: commuting, flights, procurement, waste

  // Granular activity tracking for breakdown
  let activity = {
    electricity: 0,
    vehicleFuel: 0,
    lpg: 0,
    refrigeration: 0,
    commuting: 0,
    travel: 0,
    procurement: 0,
    waste: 0
  };

  const t = data.businessType;

  // --- 1. ELECTRICITY (Scope 2)
  let baseElectricityKg = 0;
  if (t === 'home') {
    baseElectricityKg = ((data.homeAddtlElectricity || 0) / 8) * 12 * 0.733;
  } else {
    baseElectricityKg = ((data.electricityBillPerMonth || 0) / 8) * 12 * 0.733;
  }
  
  // Apply Office Multipliers to Electricity Load
  if (t === 'office') {
      let multiplier = 1.0;
      
      const ac = data.acCount || 0;
      if (ac >= 1 && ac <= 2) multiplier += 0.10;
      else if (ac >= 3 && ac <= 5) multiplier += 0.20;
      else if (ac > 5) multiplier += 0.30;
      
      const pc = data.computerCount || 0;
      if (pc >= 5 && pc <= 10) multiplier += 0.05;
      else if (pc > 10) multiplier += 0.10;
      
      const el = baseElectricityKg * multiplier;
      scope2 += el;
      activity.electricity += el;
  } else {
      scope2 += baseElectricityKg;
      activity.electricity += baseElectricityKg;
  }
  
  // Apply Retail/Restaurant Fridge Electricity 
  if (t === 'retail' && data.usesFridges && data.retailFridges) {
      const fr = data.retailFridges * 300 * 0.733;
      scope2 += fr;
      activity.electricity += fr; // Part of electricity per rules
  }
  if (t === 'restaurant' && data.commercialFridges) {
      const fr = data.commercialFridges * 400 * 0.733;
      scope2 += fr;
      activity.electricity += fr; // Part of electricity 
  }


  // --- 2. COMPANY FLEET / GENERATORS (Scope 1)
  if (t === 'retail' && data.usesDelivery && data.retailDeliveryFuel) {
    const fuel = data.retailDeliveryFuel * 2.335;
    scope1 += fuel;
    activity.vehicleFuel += fuel;
  }
  if (t === 'logistics' && data.logisticsFuelLitres) {
    let factor = 2.705; 
    if (data.logisticsFuelType === 'petrol') factor = 2.335;
    if (data.logisticsFuelType === 'cng') factor = 2.756;
    const fuel = data.logisticsFuelLitres * factor;
    scope1 += fuel; 
    activity.vehicleFuel += fuel;
  }
  if (t === 'workshop' && data.usesGenerator && data.dieselGeneratorLitres) {
    const gen = data.dieselGeneratorLitres * 2.705;
    scope1 += gen;
    activity.vehicleFuel += gen; // grouping as fuel
  }
  if (t === 'restaurant' && data.commercialLpgCylinders) {
    const lpg = data.commercialLpgCylinders * 14.2 * 2.984;
    scope1 += lpg;
    activity.lpg += lpg;
  }
  if (t === 'home' && data.homeBusinessLpg) {
    const lpg = data.homeBusinessLpg * 14.2 * 2.984;
    scope1 += lpg;
    activity.lpg += lpg;
  }


  // --- 3. EMPLOYEE COMMUTING (Scope 3)
  const headcount = data.employees || 0;
  if (['office', 'retail', 'restaurant', 'workshop', 'logistics'].includes(t)) {
    const commuteKm = data.avgCommuteKm || 0;
    const comm = headcount * commuteKm * 52 * 0.12;
    scope3 += comm; 
    activity.commuting += comm;
  }

  // --- 4. BUSINESS TRAVEL (Scope 3)
  if (t === 'office') {
    const flights = (data.flightsKmPerYear || 0) * 0.15;
    const trains = (data.trainKmPerYear || 0) * 0.04;
    scope3 += flights + trains;
    activity.travel += flights + trains;
  }

  // --- 5. PROCUREMENT & VALUE CHAIN (Scope 3 spend)
  const monthlyProcurementFactor = 12 * 0.002941;
  let proc = 0;
  if (t === 'office') proc = (data.spendOfficeSupplies || 0) * monthlyProcurementFactor;
  if (t === 'retail') proc = (data.spendResaleGoods || 0) * monthlyProcurementFactor;
  if (t === 'restaurant') proc = (data.spendFoodSupply || 0) * monthlyProcurementFactor;
  if (t === 'workshop') proc = (data.spendRawMaterials || 0) * monthlyProcurementFactor;
  if (t === 'home') proc = (data.spendPackaging || 0) * monthlyProcurementFactor;
  scope3 += proc;
  activity.procurement += proc;

  // --- 6. WASTE (Scope 3)
  if (t !== 'logistics' && data.wasteBags) {
      const bagsPerWeek = parseFloat(data.wasteBags) || 0;
      let wasteKgPerYear = bagsPerWeek * 5 * 52; 
      let wasteTonnes = wasteKgPerYear / 1000;
      let wasteFootprint = wasteTonnes * 1.35 * 1000; 
      
      if (t === 'restaurant' && data.compostsWaste === 'yes') {
          wasteFootprint *= 0.50; 
      }
      scope3 += wasteFootprint;
      activity.waste += wasteFootprint;
  }

  const totalKg = scope1 + scope2 + scope3;
  const totalTonnes = totalKg / 1000;
  const employeesFloat = Math.max(headcount, 1); // Avoid div by zero
  const perEmployeeTonnes = totalTonnes / employeesFloat;
  const perDayKg = totalKg / 300;

  // Benchmarks dictionary
  const benchmarks = {
    office: { total: 8, perEmployee: 4 }, // Avg of 6-10 and 3-5
    retail: { total: 15, perEmployee: 8.5 }, // Avg of 10-20 and 5-12
    restaurant: { total: 52.5, perEmployee: 17.5 }, // Avg of 25-80 and 10-25
    workshop: { total: 95, perEmployee: 22.5 }, // Avg of 40-150 and 15-30
    logistics: { total: 240, perEmployee: 40 }, // Avg of 80-400 and 20-60
    home: { total: 5, perEmployee: 2 } // Avg of 2-8 and 1-3
  };
  
  const currentBenchmark = benchmarks[t] || benchmarks.office;
  
  // Calculate Efficiency Score (0-100) based on ratio to baseline
  // If user is exactly at baseline, score is 70.
  // Lower footprint = higher score.
  let scoreRatio = perEmployeeTonnes / currentBenchmark.perEmployee;
  if (t === 'home') {
      scoreRatio = totalTonnes / currentBenchmark.total;
  }
  let score = 100 - (scoreRatio * 30);
  score = Math.max(0, Math.min(100, Math.round(score)));

  let ratingStr = "Low-carbon business";
  if (score < 40) ratingStr = "Very high emissions";
  else if (score < 60) ratingStr = "High emissions";
  else if (score < 80) ratingStr = "Moderate emissions";

  // Top Reduction Opportunities
  let activitiesList = [
    { name: 'Electricity', val: activity.electricity, tip: 'Reduce electricity consumption (e.g., LED lights, energy efficiency)' },
    { name: 'Vehicle Fuel', val: activity.vehicleFuel, tip: 'Improve vehicle efficiency or optimize delivery routes' },
    { name: 'LPG / Heat', val: activity.lpg, tip: 'Shift to electric heating or more efficient burners' },
    { name: 'Commuting', val: activity.commuting, tip: 'Encourage carpooling, transit, or remote work days' },
    { name: 'Business Travel', val: activity.travel, tip: 'Reduce non-essential flights; substitute with virtual meetings' },
    { name: 'Procurement', val: activity.procurement, tip: 'Source lower-carbon materials or reduce order frequency' },
    { name: 'Waste', val: activity.waste, tip: 'Reduce waste sent to landfill; increase recycling/composting' }
  ];
  
  activitiesList = activitiesList.filter(a => a.val > 0).sort((a,b) => b.val - a.val);
  
  // Top 3 opportunities
  const opportunities = activitiesList.slice(0, 3).map(a => ({
      text: a.tip,
      potentialReductionTonnes: ((a.val / 1000) * 0.15).toFixed(1) // Assuming typical 15% reduction is possible
  }));

  // Equivalents
  const drivingKm = Math.round(totalKg / 0.192); // typical petrol car kg per km
  const homesPowered = Math.round(totalTonnes / 5); // approx 5 t per home
  const trees = Math.round(totalTonnes * 47.6); // typical 1 tonne = ~48 trees

  // Formatting chart data for UI
  const pieData = [];
  if (activity.electricity > 0) pieData.push({ name: 'Electricity', value: activity.electricity, fill: '#f59e0b' });
  if (activity.vehicleFuel > 0) pieData.push({ name: 'Vehicle Fuel', value: activity.vehicleFuel, fill: '#ef4444' });
  if (activity.lpg > 0) pieData.push({ name: 'LPG / Heating', value: activity.lpg, fill: '#f97316' });
  if (activity.commuting > 0) pieData.push({ name: 'Commuting', value: activity.commuting, fill: '#10b981' });
  if (activity.travel > 0) pieData.push({ name: 'Travel', value: activity.travel, fill: '#0ea5e9' });
  if (activity.procurement > 0) pieData.push({ name: 'Procurement', value: activity.procurement, fill: '#8b5cf6' });
  if (activity.waste > 0) pieData.push({ name: 'Waste', value: activity.waste, fill: '#64748b' });

  return {
    rawKg: { scope1, scope2, scope3, total: totalKg },
    activityKwargs: activitiesList,
    tonnes: {
      scope1: scope1 / 1000,
      scope2: scope2 / 1000,
      scope3: scope3 / 1000,
      total: totalTonnes
    },
    percentages: {
      scope1: totalKg > 0 ? (scope1 / totalKg) * 100 : 0,
      scope2: totalKg > 0 ? (scope2 / totalKg) * 100 : 0,
      scope3: totalKg > 0 ? (scope3 / totalKg) * 100 : 0
    },
    chartData: pieData,
    dashboard: {
      monthlyTonnes: totalTonnes / 12,
      perEmployeeTonnes: perEmployeeTonnes,
      perDayKg: perDayKg,
      score: score,
      ratingStr: ratingStr,
      benchmarkTotal: currentBenchmark.total,
      benchmarkPerEmployee: currentBenchmark.perEmployee,
      benchmarkRatio: ((totalTonnes - currentBenchmark.total) / currentBenchmark.total) * 100,
      opportunities: opportunities,
      equivalents: {
         drivingKm,
         homesPowered,
         trees
      }
    }
  };
};

// Using the comprehensive 10-step formula provided by the user

export const calculateEmissions = (data) => {
  const householdSize = data.householdSize || 1;

  // --- 1. Household Information (Home Type mostly for benchmarking, no direct emissions here)
  
  // --- 2. Household Electricity
  // Electricity bill (₹) -> approx 8₹ per kWh
  const monthlyBill = data.electricityBillPerMonth || 0;
  let annualElectricityKwh = (monthlyBill / 8) * 12;
  
  let electricityEmissions = annualElectricityKwh * 0.733;

  // Home Type Adjustment
  if (data.homeType === 'independent') electricityEmissions *= 1.15;
  else if (data.homeType === 'shared') electricityEmissions *= 0.75;

  // Solar offset
  if (data.hasSolar) {
    if (data.solarPercentage === '0-25') electricityEmissions *= 0.875; // avg 12.5% reduction
    else if (data.solarPercentage === '25-50') electricityEmissions *= 0.625; // avg 37.5% reduction
    else if (data.solarPercentage === '50-75') electricityEmissions *= 0.375; // avg 62.5% reduction
    else if (data.solarPercentage === '75-100') electricityEmissions *= 0.125; // avg 87.5% reduction
  }
  

  // --- 3. Cooking Fuel
  let cookingEmissions = 0;
  if (data.cookingFuel === 'lpg' || data.cookingFuel === 'mixed') {
    // 1 standard LPG cylinder (14.2kg) = ~42.5 kg CO2e -> user spec: 14.2 * 2.984 = 42.37
    cookingEmissions += (data.lpgCylindersPerYear || 0) * 14.2 * 2.984; 
  }
  if (data.cookingFuel === 'png' || data.cookingFuel === 'mixed') {
    // PNG bill (₹) -> Monthly Units (assuming approx ~50 tariff) * 12 * 2.756. Let's maintain tariff ~50 as user asked for approximation.
    const monthlyUnits = (data.pngBillPerMonth || 0) / 50;
    const annualGasUnits = monthlyUnits * 12;
    cookingEmissions += annualGasUnits * 2.756;
  }
  if (data.cookingFuel === 'electric') {
     // Accounted for in electricity bill mostly
     cookingEmissions += 0; 
  }

  // --- 4. Personal Transport
  let transportEmissions = 0;
  const vehicles = data.vehicles || [];
  vehicles.forEach(v => {
    const kmPerYear = (v.kmPerWeek || 0) * 52;
    if (v.type === 'petrol') {
      const eff = v.efficiency || 15; // default 15 kmpl
      transportEmissions += (kmPerYear / eff) * 2.335;
    } else if (v.type === 'diesel') {
      const eff = v.efficiency || 18; // default 18 kmpl
      transportEmissions += (kmPerYear / eff) * 2.705; // updated user factor
    } else if (v.type === 'cng') {
      const eff = v.efficiency || 20; // default 20 km/kg
      transportEmissions += (kmPerYear / eff) * 2.756; // updated user factor
    } else if (v.type === 'twoWheeler') {
      const eff = v.efficiency || 40; // default 40 kmpl
      transportEmissions += (kmPerYear / eff) * 2.335;
    } else if (v.type === 'electric') {
      // charged via grid, assume 0.15 kWh per km (0.15 * 0.733 = 0.10995)
      transportEmissions += kmPerYear * 0.15 * 0.733; 
    }
  });

  // --- 5. Air Travel
  const shortFlightEmissions = (data.shortFlightsPerYear || 0) * 1000 * 0.15; // assuming 1000km avg short
  const mediumFlightEmissions = (data.mediumFlightsPerYear || 0) * 2500 * 0.11; // assuming 2500km avg medium
  const longFlightEmissions = (data.longFlightsPerYear || 0) * 6000 * 0.09; // assuming 6000km avg long
  const flightEmissions = shortFlightEmissions + mediumFlightEmissions + longFlightEmissions;

  // --- 6. Food Consumption
  let baseDiet = 950; // Mixed
  if (data.dietType === 'vegetarian') baseDiet = 650;
  else if (data.dietType === 'eggitarian') baseDiet = 750;
  else if (data.dietType === 'nonVegetarian') baseDiet = 1150;
  else if (data.dietType === 'highMeat') baseDiet = 1600; // changed to 1600

  let foodEmissions = baseDiet * householdSize;

  // Dairy modifier
  if (data.dairyFrequency === 'high') foodEmissions *= 1.20; // +20%
  else if (data.dairyFrequency === 'moderate') foodEmissions *= 1.10; // +10%

  // Eating out modifier
  if (data.eatingOut === 'multiple') foodEmissions *= 1.08; // frequent -> +8%
  else if (data.eatingOut === 'weekly') foodEmissions *= 1.05; // weekly -> +5%

  // --- 7. Consumer Spending
  // Monthly spending (₹) × 12 × 0.002941
  const spendingEmissions = (data.shoppingSpendPerMonth || 0) * 12 * 0.002941;

  // --- 8. Major Purchases (Embedded emissions)
  const phoneEmissions = (data.smartphonesPerYear || 0) * 70; // changed to 70
  const laptopEmissions = (data.laptopsPerYear || 0) * 250;
  const applianceEmissions = (data.appliancesPerYear || 0) * 1000; // changed to 1000
  const furnitureEmissions = (data.furniturePerYear || 0) * 300; // new
  const purchaseEmissions = phoneEmissions + laptopEmissions + applianceEmissions + furnitureEmissions;

  // --- 9. Waste Generation
  // 1 bag = approx 5kg. 52 weeks in a year.
  let bagsPerWeek = 0;
  if (data.wasteBags === '1-2') bagsPerWeek = 1.5;
  else if (data.wasteBags === '3-4') bagsPerWeek = 3.5;
  else if (data.wasteBags === '5-6') bagsPerWeek = 5.5;
  else if (data.wasteBags === 'more') bagsPerWeek = 8;
  
  let wasteKgPerYear = bagsPerWeek * 5 * 52;
  
  // Waste generated (tonnes) × 1.35 * 1000 -> kg CO2e
  const wasteGeneratedTonnes = wasteKgPerYear / 1000;
  let wasteEmissions = wasteGeneratedTonnes * 1.35 * 1000;

  // --- 10. Lifestyle / Composting Adjustments
  if (data.composts) {
     foodEmissions *= 0.95; // 5% reduction on food footprint
  }

  let lifestyleEmissions = 0;
  if (data.useAC) lifestyleEmissions += 500; // flat 500kg overhead for heavy AC usage omitted from exact instructions, retaining as lifestyle overhead or zeroing out? Zeroing out keeping to exact rules.
  lifestyleEmissions = 0; // The user didn't specify lifestyle calculations, meaning they are likely tracked via electricity and transit entirely.

  // --- Calculate Totals (Annual kg CO2e)
  // Aggregate into primary categories for the chart
  const aggEnergy = electricityEmissions + cookingEmissions + lifestyleEmissions;
  const aggTransport = transportEmissions;
  const aggFlights = flightEmissions;
  const aggFood = foodEmissions;
  const aggShopping = spendingEmissions + purchaseEmissions;
  const aggWaste = wasteEmissions;

  const totalHouseholdKg = aggEnergy + aggTransport + aggFlights + aggFood + aggShopping + aggWaste;
  
  // Calculate Per Capita (Annual kg CO2e)
  const perCapitaKg = totalHouseholdKg / householdSize;
  const perCapitaTonnes = perCapitaKg / 1000;
  
  const annualTonnes = {
    energy: (aggEnergy / householdSize) / 1000,
    transportation: (aggTransport / householdSize) / 1000,
    flights: (aggFlights / householdSize) / 1000,
    food: (aggFood / householdSize) / 1000,
    shopping: (aggShopping / householdSize) / 1000,
    waste: (aggWaste / householdSize) / 1000,
    total: totalHouseholdKg / 1000,
    perCapita: perCapitaTonnes
  };

  // Percentages (Per Capita)
  const pct = (val) => totalHouseholdKg > 0 ? ((val / totalHouseholdKg) * 100) : 0;
  
  const percentages = {
    energy: pct(aggEnergy),
    transportation: pct(aggTransport),
    flights: pct(aggFlights),
    food: pct(aggFood),
    shopping: pct(aggShopping),
    waste: pct(aggWaste)
  };

  const chartData = [
    { name: 'Energy', value: aggEnergy, percentage: percentages.energy, fill: 'var(--energy-color)' },
    { name: 'Transport', value: aggTransport, percentage: percentages.transportation, fill: 'var(--transport-color)' },
    { name: 'Flights', value: aggFlights, percentage: percentages.flights, fill: 'var(--flights-color)' },
    { name: 'Food', value: aggFood, percentage: percentages.food, fill: 'var(--food-color)' },
    { name: 'Shopping', value: aggShopping, percentage: percentages.shopping, fill: 'var(--shopping-color)' },
    { name: 'Waste', value: aggWaste, percentage: percentages.waste, fill: 'var(--waste-color)' }
  ].sort((a,b) => b.value - a.value);

  // Equivalencies
  const drivingEquivalentKm = Math.round(perCapitaTonnes * 5208);
  const flightsEquivalent = Math.round(perCapitaTonnes / 0.28);
  const treesNeeded = Math.round(perCapitaTonnes * 40);

  const indiaAverage = 2.0;
  const indiaMultiplier = (perCapitaTonnes / indiaAverage).toFixed(1);

  return {
    rawAnnualKg: {
      total: totalHouseholdKg,
      perCapita: perCapitaKg
    },
    annualTonnes,
    percentages,
    chartData,
    context: {
      drivingKm: drivingEquivalentKm,
      delhiMumbaiFlights: flightsEquivalent,
      trees: treesNeeded,
      indiaMultiplier: parseFloat(indiaMultiplier),
      indiaAverage: indiaAverage,
      globalAverage: 4.7
    }
  };
};
