import React, { useState } from 'react';
import LandingScreen from './components/LandingScreen';
import HouseholdCalculator from './components/calculators/household-calculator';
import BusinessCalculator from './components/calculators/business-calculator';
import IndustryCalculator from './components/calculators/industry-calculator';
import IntroSequence from './components/IntroSequence';
import PlatformHome from './components/PlatformHome';
import { NerdProvider } from './lib/NerdModeContext';
import PerformancePanel from './components/NerdMode/PerformancePanel';
import InspectorOverlay from './components/NerdMode/InspectorOverlay';

// Pages where the performance panel should be hidden
const CALCULATOR_PAGES = ['household', 'business', 'industry'];

const App = () => {
    // Map pathState directly to URL hash to support native browser back/swipe gestures
    const [pathState, setPathState] = useState(() => {
        const hash = window.location.hash.replace('#', '');
        return hash || 'home';
    });

    React.useEffect(() => {
        const handlePopState = () => {
            const hash = window.location.hash.replace('#', '');
            setPathState(hash || 'home');
        };

        window.addEventListener('popstate', handlePopState);
        if (!window.location.hash) {
            window.history.replaceState(null, '', '#home');
        }
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    React.useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" });
    }, [pathState]);

    const handleNavigate = (path) => {
        if (pathState !== path) {
            setPathState(path);
            window.history.pushState(null, '', `#${path}`);
        }
    };

    const handleBack = () => {
        const hash = window.location.hash.replace('#', '');
        if (hash === 'landing' || hash === 'home' || hash === 'intro') {
            window.history.back();
        } else {
            // If exiting a calculator, go explicitly to landing via history
            handleNavigate('landing');
        }
    };

    const renderPage = () => {
        if (pathState === 'home') return <IntroSequence onNavigate={() => handleNavigate('intro')} />;
        if (pathState === 'intro') return <PlatformHome onNavigate={() => handleNavigate('landing')} onBack={() => setPathState('home')} />;
        if (pathState === 'landing') return <LandingScreen onSelect={handleNavigate} onBackToPlatform={() => setPathState('intro')} />;
        if (pathState === 'household') return <HouseholdCalculator onBack={handleBack} />;
        if (pathState === 'business') return <BusinessCalculator onBack={handleBack} />;
        if (pathState === 'industry') return <IndustryCalculator onBack={handleBack} />;
        return <PlatformHome onNavigate={handleNavigate} />;
    };

    return (
        <NerdProvider>
            <div className="min-h-screen relative w-full overflow-clip flex flex-col">
                {/* Global Grid Overlay (680px 2-column, hidden on mobile) */}
                <div className="absolute inset-0 pointer-events-none z-0 flex justify-center w-full">
                    <div className="hidden sm:grid grid-cols-2 w-full max-w-[680px] border-x border-dotted border-white/15 h-full opacity-60">
                        <div className="border-r border-dotted border-white/15 h-full" />
                        <div className="h-full" />
                    </div>
                </div>

                <div className="relative z-10 w-full flex-grow">
                    {renderPage()}
                </div>

                {/* Global Overlays */}
                {pathState === 'intro' && <PerformancePanel />}
                {(pathState === 'landing' || pathState === 'intro') && <InspectorOverlay />}
            </div>
        </NerdProvider>
    );
};

export default App;
