import { useState, useEffect } from 'react';

/**
 * Returns true when the viewport width is below the given breakpoint (default 640px = Tailwind `sm`).
 * Recalculates on window resize.
 */
export function useIsMobile(breakpoint = 640) {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < breakpoint);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}
