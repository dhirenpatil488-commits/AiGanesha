import React, { useState } from 'react';
import LandingScreen from './components/LandingScreen';
import HouseholdCalculator from './components/calculators/household-calculator';
import BusinessCalculator from './components/calculators/business-calculator';
import IndustryCalculator from './components/calculators/industry-calculator';
import PlatformHome from './components/PlatformHome';
import { NerdProvider } from './lib/NerdModeContext';
import PerformancePanel from './components/NerdMode/PerformancePanel';
import InspectorOverlay from './components/NerdMode/InspectorOverlay';

// Pages where the performance panel should be hidden
const CALCULATOR_PAGES = ['household', 'business', 'industry'];

const App = () => {
    // Lifted to App level so PerformancePanel can react to route changes
    const [pathState, setPathState] = useState('home');

    const handleNavigate = (path) => setPathState(path);
    const handleBack = () => setPathState('landing');

    const renderPage = () => {
        if (pathState === 'home') return <PlatformHome onNavigate={handleNavigate} />;
        if (pathState === 'landing') return <LandingScreen onSelect={handleNavigate} onBackToPlatform={() => setPathState('home')} />;
        if (pathState === 'household') return <HouseholdCalculator onBack={handleBack} />;
        if (pathState === 'business') return <BusinessCalculator onBack={handleBack} />;
        if (pathState === 'industry') return <IndustryCalculator onBack={handleBack} />;
        return <PlatformHome onNavigate={handleNavigate} />;
    };

    const isInsideCalculator = CALCULATOR_PAGES.includes(pathState);

    return (
        <NerdProvider>
            <div className="min-h-screen relative">
                {renderPage()}

                {/* Global Overlays — panel hidden when inside a calculator */}
                {!isInsideCalculator && <PerformancePanel />}
                <InspectorOverlay />
            </div>
        </NerdProvider>
    );
};

export default App;
