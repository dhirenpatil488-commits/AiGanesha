import React, { useState, useEffect, useRef } from 'react';
import { useNerdMode } from '@/lib/NerdModeContext';

export default function PerformancePanel() {
    const { isNerdMode } = useNerdMode();
    const [metrics, setMetrics] = useState({
        fps: 0,
        connection: 'Unknown',
        downlink: 'Unknown',
        domNodes: 0,
        requests: 0,
        timeSinceLoad: '0s'
    });

    // Drag state
    const panelRef = useRef(null);
    const [pos, setPos] = useState({ x: null, y: null }); // null = use default position (top-right)
    const dragging = useRef(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    const onPointerDown = (e) => {
        dragging.current = true;
        const rect = panelRef.current.getBoundingClientRect();
        // Store panel size at drag start for clamping
        dragOffset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
            w: rect.width,
            h: rect.height,
        };
        panelRef.current.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
        if (!dragging.current) return;
        const { x: ox, y: oy, w, h } = dragOffset.current;
        // Clamp so panel never goes outside the viewport
        const newX = Math.min(Math.max(0, e.clientX - ox), window.innerWidth - w);
        const newY = Math.min(Math.max(0, e.clientY - oy), window.innerHeight - h);
        setPos({ x: newX, y: newY });
    };

    const onPointerUp = () => {
        dragging.current = false;
    };

    useEffect(() => {
        if (!isNerdMode) return;

        let frameCount = 0;
        let lastTime = performance.now();
        let animationFrameId;
        const loadTime = performance.timing.navigationStart;

        const updateMetrics = () => {
            const now = performance.now();
            frameCount++;

            if (now >= lastTime + 1000) {
                const fps = Math.round((frameCount * 1000) / (now - lastTime));
                const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
                const effectiveType = connection ? connection.effectiveType : 'Unknown';
                const downlinkText = connection && connection.downlink
                    ? `${connection.downlink} Mbps · ${connection.rtt} ms`
                    : 'Unknown';
                const domNodes = document.getElementsByTagName('*').length;
                const requests = performance.getEntriesByType('resource').length;
                const secondsSinceLoad = Math.floor((Date.now() - loadTime) / 1000);
                const timeString = secondsSinceLoad > 60
                    ? `${Math.floor(secondsSinceLoad / 60)}m ${secondsSinceLoad % 60}s`
                    : `${secondsSinceLoad}s`;

                setMetrics({ fps, connection: effectiveType.toUpperCase(), downlink: downlinkText, domNodes, requests, timeSinceLoad: timeString });
                frameCount = 0;
                lastTime = now;
            }

            animationFrameId = requestAnimationFrame(updateMetrics);
        };

        animationFrameId = requestAnimationFrame(updateMetrics);
        return () => cancelAnimationFrame(animationFrameId);
    }, [isNerdMode]);

    if (!isNerdMode) return null;

    const posStyle = pos.x !== null
        ? { left: pos.x, top: pos.y, right: 'auto', bottom: 'auto' }
        : { top: 80, right: 24 };

    return (
        <div
            ref={panelRef}
            // nerd-mode-element → InspectorOverlay ignores this panel entirely (no tooltip popup)
            className="nerd-mode-element fixed z-[9999] bg-[#111111]/90 backdrop-blur-md border border-[#333] rounded-lg p-5 min-w-[300px] font-mono text-xs shadow-2xl select-none"
            style={{ ...posStyle, cursor: dragging.current ? 'grabbing' : 'grab' }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
        >
            <div className="nerd-mode-element flex justify-between items-center mb-4 pb-2 border-b border-[#333]">
                <span className="text-[#555] text-[10px] uppercase tracking-widest">sys · perf</span>
                <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#f4a261]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#e9c46a]"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-[#2a9d8f]"></div>
                </div>
            </div>

            <div className="nerd-mode-element space-y-3">
                <MetricRow label="FPS" value={metrics.fps} />
                <MetricRow label="Connection" value={metrics.connection} />
                <MetricRow label="Downlink" value={metrics.downlink} />
                <MetricRow label="DOM nodes" value={metrics.domNodes} />
                <MetricRow label="Requests" value={metrics.requests} />
                <MetricRow label="Time since load" value={metrics.timeSinceLoad} />
            </div>
        </div>
    );
}

function MetricRow({ label, value }) {
    return (
        <div className="nerd-mode-element flex justify-between items-center text-[#cfd2d6]">
            <span className="text-[#8e949e]">{label}</span>
            <span className="font-semibold text-white tracking-wider">{value}</span>
        </div>
    );
}
