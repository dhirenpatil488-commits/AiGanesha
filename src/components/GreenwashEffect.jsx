import React, { useEffect, useRef, useState } from 'react';

export default function GreenwashEffect() {
  const canvasRef = useRef(null);
  const [popup, setPopup] = useState({ visible: false, x: 0, y: 0 });
  const distanceRef = useRef(0);
  const lastPosRef = useRef({ x: null, y: null });
  const timerRef = useRef(null);
  const popupVisibleRef = useRef(false);
  const idleTimerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    // Initial resize
    resize();
    window.addEventListener('resize', resize);

    // Fade loop
    const render = () => {
      // #080C10 is the platform background color.
      // 0.01 opacity makes the bright trails linger and fade out very slowly, like wiping condensation.
      ctx.fillStyle = 'rgba(8, 12, 16, 0.01)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      animationFrameId = requestAnimationFrame(render);
    };
    render();

    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const center = window.innerWidth / 2;
      
      // Calculate active zone (margins outside the 860px max-width container)
      const isOutsideContent = Math.abs(clientX - center) > 430;

      if (!isOutsideContent) {
        lastPosRef.current = { x: null, y: null };
        return;
      }

      // Draw Wipe Effect (Medium Bright White Glow)
      const gradient = ctx.createRadialGradient(clientX, clientY, 0, clientX, clientY, 80);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(clientX, clientY, 80, 0, Math.PI * 2);
      ctx.fill();

      // Accumulate scrub distance
      const lastPos = lastPosRef.current;
      if (lastPos.x !== null && lastPos.y !== null) {
        const dx = clientX - lastPos.x;
        const dy = clientY - lastPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        distanceRef.current += dist;

        // Threshold to trigger popup (e.g., 5000 pixels scrubbed)
        if (distanceRef.current > 5000) {
          // Trigger popup
          setPopup({ visible: true, x: clientX, y: clientY });
          popupVisibleRef.current = true;
          distanceRef.current = 0; // Reset
          
          // Clear existing hide timer
          if (timerRef.current) clearTimeout(timerRef.current);
          
          // Auto-hide popup after 3 seconds and reset canvas
          timerRef.current = setTimeout(() => {
            setPopup(prev => ({ ...prev, visible: false }));
            popupVisibleRef.current = false;
            // Instantly clear the canvas back to the solid background color
            ctx.fillStyle = 'rgba(8, 12, 16, 1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
          }, 4000);
        }
      }

      // Idle Timer Reset (clears if they stop moving, without popup)
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        if (!popupVisibleRef.current) {
          ctx.fillStyle = 'rgba(8, 12, 16, 1)';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          distanceRef.current = 0;
        }
      }, 1500);

      lastPosRef.current = { x: clientX, y: clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      if (timerRef.current) clearTimeout(timerRef.current);
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  return (
    <>
      {/* ── Fixed Fading Canvas Overlay ── */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ opacity: 0.8 }}
      />
      
      {/* ── Contextual Popup ── */}
      <div
        className={`fixed z-[100] pointer-events-none transition-all duration-300 ease-out`}
        style={{
          left: Math.min(popup.x + 20, window.innerWidth - 260), // Constrain to prevent overflow
          top: popup.y + 20,
          opacity: popup.visible ? 1 : 0,
          transform: popup.visible ? 'scale(1) translateY(0)' : 'scale(0.95) translateY(10px)',
        }}
      >
        <div className="bg-[#0a0f15] border border-[#F4A261]/40 shadow-[0_0_20px_rgba(244,162,97,0.15)] px-4 py-2.5 rounded-lg flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-sm bg-[#F4A261] animate-pulse" />
          <span className="text-[12px] font-mono text-white/90 uppercase tracking-[0.1em] whitespace-nowrap">
            That's how they Greenwash
          </span>
        </div>
      </div>
    </>
  );
}
