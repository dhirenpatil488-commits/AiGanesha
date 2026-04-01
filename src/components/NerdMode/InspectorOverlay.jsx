import React, { useState, useEffect } from 'react';
import { useNerdMode } from '@/lib/NerdModeContext';

// Tries to find a position for the tooltip that doesn't overlap the target element.
// Tries: right → left → below → above, picks first that fits on-screen.
function calcTooltipPos(rect, tooltipW, tooltipH) {
    const gap = 8;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    // Right of element
    const rightLeft = rect.right + gap;
    if (rightLeft + tooltipW <= vw) {
        const top = Math.min(Math.max(4, rect.top), vh - tooltipH - 4);
        return { left: rightLeft, top };
    }

    // Left of element
    const leftLeft = rect.left - tooltipW - gap;
    if (leftLeft >= 0) {
        const top = Math.min(Math.max(4, rect.top), vh - tooltipH - 4);
        return { left: leftLeft, top };
    }

    // Below element
    const belowTop = rect.bottom + gap;
    if (belowTop + tooltipH <= vh) {
        const left = Math.min(Math.max(4, rect.left), vw - tooltipW - 4);
        return { left, top: belowTop };
    }

    // Above element (last resort)
    const aboveTop = rect.top - tooltipH - gap;
    const left = Math.min(Math.max(4, rect.left), vw - tooltipW - 4);
    return { left, top: Math.max(4, aboveTop) };
}

export default function InspectorOverlay() {
    const { isNerdMode } = useNerdMode();
    const [hoveredElement, setHoveredElement] = useState(null);

    useEffect(() => {
        if (!isNerdMode) {
            setHoveredElement(null);
            return;
        }

        const handleMouseMove = (e) => {
            // Find the deepest element under the cursor
            const element = document.elementFromPoint(e.clientX, e.clientY);

            // Ignore our own overlays/tooltips
            if (!element || element.closest('#nerd-inspector-tooltip') || element.closest('.nerd-mode-element')) return;

            const rect = element.getBoundingClientRect();
            const vw = window.innerWidth;

            // ── Skip background/wrapper elements ──────────────────────────────
            // 1. Skip root-level tags that are just containers
            const tag = element.tagName.toLowerCase();
            if (['html', 'body'].includes(tag)) {
                setHoveredElement(null);
                return;
            }

            // 2. Skip any element whose width fills ≥85% of viewport
            //    (these are full-bleed wrappers/backgrounds, not content)
            if (rect.width >= vw * 0.85) {
                setHoveredElement(null);
                return;
            }

            // 3. Skip if cursor is outside the centered content frame
            //    The content lives in a max-w-[860px] centered container.
            //    Find that container and check horizontal bounds.
            const contentFrame = document.querySelector('[class*="max-w-"]');
            if (contentFrame) {
                const frameRect = contentFrame.getBoundingClientRect();
                if (e.clientX < frameRect.left || e.clientX > frameRect.right) {
                    setHoveredElement(null);
                    return;
                }
            }
            // ─────────────────────────────────────────────────────────────────

            setHoveredElement({
                tagName: tag,
                classes: element.className && typeof element.className === 'string' ? element.className.split(' ').filter(Boolean) : [],
                rect: {
                    top: rect.top,
                    left: rect.left,
                    right: rect.right,
                    bottom: rect.bottom,
                    width: Math.round(rect.width),
                    height: Math.round(rect.height)
                },
                computedStyle: window.getComputedStyle(element)
            });
        };

        const handleMouseLeave = () => {
            setHoveredElement(null);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, [isNerdMode]);

    if (!isNerdMode || !hoveredElement) return null;

    const { tagName, classes, rect, computedStyle } = hoveredElement;

    const TOOLTIP_W = 230;
    const TOOLTIP_H = 110;
    const { left: tooltipLeft, top: tooltipTop } = calcTooltipPos(rect, TOOLTIP_W, TOOLTIP_H);



    return (
        <>
            {/* Outline Box */}
            <div
                className="fixed pointer-events-none z-[9998] border border-blue-500 bg-blue-500/10 transition-all duration-75"
                style={{
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                }}
            />

            {/* Dimension Indicators */}
            <div
                className="fixed pointer-events-none z-[9998] border-l border-red-500 text-red-500 text-[10px] font-mono flex items-center justify-center pt-1"
                style={{
                    top: rect.top,
                    left: rect.left - 20,
                    height: rect.height,
                    writingMode: 'vertical-rl',
                    textOrientation: 'mixed'
                }}
            >
                {rect.height}px
            </div>

            <div
                className="fixed pointer-events-none z-[9998] border-b border-red-500 text-red-500 text-[10px] font-mono flex items-center justify-center pr-1 text-right"
                style={{
                    top: rect.top - 20,
                    left: rect.left,
                    width: rect.width,
                }}
            >
                {rect.width}px
            </div>


            {/* Info Tooltip — positioned relative to cursor, never overlapping the element */}
            <div
                id="nerd-inspector-tooltip"
                className="fixed pointer-events-none z-[9999] bg-[#1a1b24] text-white border border-[#2a2b36] shadow-xl p-3 rounded-md font-mono text-xs"
                style={{
                    top: tooltipTop,
                    left: tooltipLeft,
                    width: TOOLTIP_W,
                }}
            >
                <div className="mb-2">
                    <span className="text-[#62bdff] font-bold uppercase text-[10px] tracking-widest block mb-1">NAME</span>
                    <span className="text-white bg-white/10 px-1.5 py-0.5 rounded">{tagName}</span>
                    {classes.length > 0 && (
                        <span className="text-gray-400 ml-2 truncate inline-block max-w-[120px] align-bottom">
                            .{classes.slice(0, 2).join('.')}
                        </span>
                    )}
                </div>

                <div className="mb-2">
                    <span className="text-[#62bdff] font-bold uppercase text-[10px] tracking-widest block mb-1">FORMAT</span>
                    <span className="text-gray-300">
                        {tagName} / {computedStyle.display}
                    </span>
                </div>

                <div>
                    <span className="text-[#62bdff] font-bold uppercase text-[10px] tracking-widest block mb-1">DIMENSIONS</span>
                    <span className="text-gray-300">
                        {rect.width} × {rect.height}
                    </span>
                </div>
            </div>
        </>
    );
}
