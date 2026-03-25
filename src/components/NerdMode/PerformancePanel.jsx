import React, { useState, useEffect, useRef } from 'react';
import { useNerdMode } from '@/lib/NerdModeContext';

// ── Constants ─────────────────────────────────────────────────────────────────
const ATMOSPHERIC_CO2_PPM = 421;
const GLOBAL_TEMP_DELTA = '+1.2 °C';
const EMISSION_RATE = 0.00002; // gCO₂ per second

function getAQICategory(aqi) {
    if (aqi <= 50) return 'Good';
    if (aqi <= 100) return 'Moderate';
    if (aqi <= 150) return 'Unhealthy';
    if (aqi <= 200) return 'Unhealthy';
    if (aqi <= 300) return 'Very Unhealthy';
    return 'Hazardous';
}

function getPlanetRisk(co2) {
    if (co2 > 400) return 'HIGH';
    if (co2 > 350) return 'MODERATE';
    return 'LOW';
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function PerformancePanel() {
    const { isNerdMode } = useNerdMode();

    const [aqi, setAqi] = useState(null);
    const [aqiCategory, setAqiCategory] = useState('');
    const [cityName, setCityName] = useState('');  // e.g. "Mumbai"
    const [timeSinceLoad, setTimeSinceLoad] = useState(0);
    const [digitalEmissions, setDigitalEmissions] = useState(0);

    const panelRef = useRef(null);
    const [pos, setPos] = useState({ x: null, y: null });
    const dragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0, w: 0, h: 0 });
    const loadTime = useRef(Date.now());

    // ── Drag ─────────────────────────────────────────────────────────────────
    const onPointerDown = (e) => {
        dragging.current = true;
        const rect = panelRef.current.getBoundingClientRect();
        dragOffset.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, w: rect.width, h: rect.height };
        panelRef.current.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e) => {
        if (!dragging.current) return;
        const { x: ox, y: oy, w, h } = dragOffset.current;
        setPos({
            x: Math.min(Math.max(0, e.clientX - ox), window.innerWidth - w),
            y: Math.min(Math.max(0, e.clientY - oy), window.innerHeight - h),
        });
    };
    const onPointerUp = () => { dragging.current = false; };

    // ── IQAir Integration ───────────────────────────────────────────────────
    useEffect(() => {
        if (!isNerdMode) return;

        async function fetchAQI() {
            try {
                // Use IQAir (AirVisual) API for high-precision city-level AQI data
                const IQAIR_KEY = '504a9605-872f-4638-839a-6d2934b03dd5';
                const response = await fetch(`https://api.airvisual.com/v2/nearest_city?key=${IQAIR_KEY}`);
                
                if (!response.ok) throw new Error(`IQAir HTTP ${response.status}`);
                
                const json = await response.json();
                
                if (json.status === 'success' && json.data) {
                    const data = json.data;
                    const city = data.city || '';
                    const aqiValue = data.current?.pollution?.aqius;

                    setCityName(city);

                    if (aqiValue != null && !isNaN(aqiValue)) {
                        setAqi(Math.round(aqiValue));
                        setAqiCategory(getAQICategory(Math.round(aqiValue)));
                    } else {
                        setAqi('—');
                        setAqiCategory('No data');
                    }
                } else {
                    throw new Error(json.data?.message || 'IQAir API failure');
                }
            } catch (err) {
                console.warn('[Climate] IQAir fetch error:', err.message);
                setAqi('—');
                setAqiCategory('Unavailable');
            }
        }

        fetchAQI();
        const id = setInterval(fetchAQI, 15 * 60 * 1000); // 15 min interval
        return () => clearInterval(id);
    }, [isNerdMode]);

    // ── Timer ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!isNerdMode) return;
        
        // Use sessionStorage so the timer persists across page refreshes and navigation
        const sessionKey = 'carbon_session_start';
        let storedStart = sessionStorage.getItem(sessionKey);
        
        if (!storedStart) {
            storedStart = Date.now().toString();
            sessionStorage.setItem(sessionKey, storedStart);
        }
        
        loadTime.current = parseInt(storedStart, 10);
        
        // Initial calc
        let initialSecs = Math.floor((Date.now() - loadTime.current) / 1000);
        // Prevent negative time if clocks skew slightly
        if (initialSecs < 0) initialSecs = 0;
        
        setTimeSinceLoad(initialSecs);
        setDigitalEmissions(initialSecs * EMISSION_RATE);

        const id = setInterval(() => {
            let s = Math.floor((Date.now() - loadTime.current) / 1000);
            if (s < 0) s = 0;
            setTimeSinceLoad(s);
            setDigitalEmissions(s * EMISSION_RATE);
        }, 1000);
        
        return () => clearInterval(id);
    }, [isNerdMode]);

    if (!isNerdMode) return null;
    if (typeof window !== 'undefined' && window.innerWidth < 768) return null; // Hide completely on mobile as requested by user

    // ── Derived ───────────────────────────────────────────────────────────────
    const planetRisk = getPlanetRisk(ATMOSPHERIC_CO2_PPM);
    const riskColor = planetRisk === 'HIGH' ? '#e76f51' : planetRisk === 'MODERATE' ? '#e9c46a' : '#2a9d8f';

    const aqiColor = aqi === null || aqi === '—' ? '#8b949e'
        : aqi <= 50 ? '#2a9d8f'
            : aqi <= 100 ? '#e9c46a'
                : '#e76f51';

    const timeStr = timeSinceLoad > 60
        ? `${Math.floor(timeSinceLoad / 60)}m ${timeSinceLoad % 60}s`
        : `${timeSinceLoad}s`;

    const emStr = digitalEmissions < 0.001
        ? `${(digitalEmissions * 1000).toFixed(5)} mg`
        : `${digitalEmissions.toFixed(5)} g`;

    const posStyle = pos.x !== null
        ? { left: pos.x, top: pos.y, right: 'auto', bottom: 'auto', transform: 'none' }
        : { top: 108, right: 48, transform: 'none' };

    // Label for AQI row: "<City> AQI" if city known, else "AQI"
    const aqiLabel = cityName ? `AQI - ${cityName}` : 'AQI';

    return (
        <div
            ref={panelRef}
            className="nerd-mode-element fixed z-[9999] select-none hidden md:block group/panel"
            style={{ ...posStyle, touchAction: 'none', cursor: dragging.current ? 'grabbing' : 'grab' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
        >
            <div
                className="nerd-mode-element border border-white/10 group-hover/panel:border-white/20 font-mono overflow-hidden transition-all duration-300"
                style={{
                    minWidth: '260px',
                    maxWidth: 'calc(100vw - 48px)',
                    boxSizing: 'border-box',
                    background: 'rgba(8,12,16,0.92)',
                    backdropFilter: 'blur(12px)',
                    boxShadow: '0 0 0 0 transparent',
                    transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 0 24px rgba(255,255,255,0.06)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 0 0 0 transparent'}
            >
                {/* ── Grip Handle ── */}
                <div className="nerd-mode-element flex items-center justify-center gap-[5px] pt-2.5 pb-1.5">
                    {[...Array(6)].map((_, i) => (
                        <div
                            key={i}
                            className="nerd-mode-element rounded-full bg-white/20 group-hover/panel:bg-white/40 transition-all duration-300"
                            style={{ width: 3, height: 3 }}
                        />
                    ))}
                </div>

                {/* ── Header ── */}
                <div className="nerd-mode-element px-4 pb-2.5 border-b border-white/8 flex items-center justify-center gap-1.5">
                    <span className="text-white/25 text-[10px] font-mono uppercase tracking-[0.18em]">SYS</span>
                    <span className="text-white/15 text-[10px]">·</span>
                    <span className="text-white/25 text-[10px] font-mono uppercase tracking-[0.18em]">CLIMATE</span>
                </div>

                {/* ── Metrics ── */}
                <div className="nerd-mode-element px-4 py-1">
                    <Row label={aqiLabel} rowBorder>
                        <span style={{ color: aqiColor, fontWeight: 600 }}>
                            {aqi !== null ? aqi : '…'}
                        </span>
                        {aqiCategory && (
                            <span className="text-white/25 text-[11px] ml-2">{aqiCategory}</span>
                        )}
                    </Row>

                    <Row label="Atmospheric CO₂" rowBorder>
                        <span className="text-white/70 font-semibold">{ATMOSPHERIC_CO2_PPM} ppm</span>
                    </Row>

                    <Row label="Global Temp Δ" rowBorder>
                        <span style={{ color: '#e76f51', fontWeight: 600, opacity: 0.8 }}>{GLOBAL_TEMP_DELTA}</span>
                    </Row>

                    <Row label="Time Since Load" rowBorder>
                        <span className="text-white/50 font-semibold">{timeStr}</span>
                    </Row>

                    <Row label="Digital Emissions" rowBorder>
                        <span className="text-white/40 font-semibold">{emStr} CO₂</span>
                    </Row>

                    <Row label="Planet Risk">
                        <span style={{ color: riskColor, fontWeight: 700, opacity: 0.85 }}>{planetRisk}</span>
                    </Row>
                </div>

                <div className="nerd-mode-element h-2" />
            </div>
        </div>
    );
}

// ── Row ───────────────────────────────────────────────────────────────────────
function Row({ label, children, rowBorder }) {
    return (
        <div
            className="nerd-mode-element flex items-center justify-between gap-6 py-[7px]"
            style={rowBorder ? { borderBottom: '1px solid rgba(255,255,255,0.06)' } : {}}
        >
            <span className="text-white/25 font-mono uppercase text-[10px] tracking-[0.12em] shrink-0">
                {label}
            </span>
            <div className="flex items-center text-[12px]">
                {children}
            </div>
        </div>
    );
}

