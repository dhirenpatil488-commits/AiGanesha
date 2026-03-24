import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, animate, useMotionValue, AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Globe, ShieldAlert, ArrowRight, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function IntroSequence({ onNavigate }) {
    const containerRef = useRef(null);
    const [activeFrame, setActiveFrame] = useState(1);
    const [transitions, setTransitions] = useState(0);
    const prevFrameRef = useRef(1);
    const maxEmissionsRef = useRef(0);
    
    // Core animation values for the sticky counter
    const count = useMotionValue(0);
    // Format the number to always show 2 decimal places and append text safely
    const rounded = useTransform(count, (latest) => latest.toFixed(2) + " g CO₂");

    // Master timing config for cinematic effects
    const frameConfig = {
        1: { value: 0.00, countDuration: 1, countDelay: 0, opacity: 0.6, scale: 1, blur: "blur(0px)", glow: false },
        2: { value: 0.01, countDuration: 1, countDelay: 0, opacity: 0.8, scale: [1, 1.03, 1], blur: "blur(0px)", glow: false },
        3: { value: 0.03, countDuration: 1, countDelay: 0, opacity: [0.8, 0.5, 0.8], scale: 1, blur: "blur(0px)", glow: false },
        4: { value: 0.06, countDuration: 0.5, countDelay: 0, opacity: 0.9, scale: [1, 1.05, 1], blur: ["blur(0px)", "blur(3px)", "blur(0px)"], glow: true },
        5: { value: 0.10, countDuration: 1, countDelay: 0, opacity: 0.9, scale: 1, blur: "blur(0px)", glow: false },
        6: { value: 0.15, countDuration: 1, countDelay: 0.2, opacity: 0.9, scale: 1, blur: "blur(0px)", glow: false },
        7: { value: 0.20, countDuration: 1, countDelay: 0, opacity: 1.0, scale: 1, blur: "blur(0px)", glow: false }
    };

    const { scrollYProgress } = useScroll({ container: containerRef });
    const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 0.95, 1]);

    useEffect(() => {
        if (containerRef.current) containerRef.current.scrollTo(0, 0);
    }, []);

    // Track transitions to penalize over-scrolling
    useEffect(() => {
        if (activeFrame !== prevFrameRef.current) {
            setTransitions(t => t + 1);
            prevFrameRef.current = activeFrame;
        }
    }, [activeFrame]);

    // Calculate interactive penalty based on wasted scroll events
    const penalty = Math.max(0, transitions - 6) * 0.03;

    useEffect(() => {
        const config = frameConfig[activeFrame] || frameConfig[1];
        let targetValue = config.value + penalty;
        
        // Strictly prevent emissions from decreasing when scrolling backwards
        if (targetValue < maxEmissionsRef.current) {
            targetValue = maxEmissionsRef.current + 0.01;
        }
        
        if (targetValue > maxEmissionsRef.current) {
            maxEmissionsRef.current = targetValue;
        }
        
        const controls = animate(count, targetValue, { 
            duration: config.countDuration, 
            delay: config.countDelay,
            ease: "easeOut" 
        });
        return () => controls.stop();
    }, [activeFrame, transitions, count]);

    const activeConfig = frameConfig[activeFrame] || frameConfig[1];

    let overScrollMessage = null;
    if (transitions > 6 && transitions <= 10) overScrollMessage = "It adds up.";
    else if (transitions > 10 && transitions <= 15) overScrollMessage = "You’re still adding.";
    else if (transitions > 15 && transitions <= 20) overScrollMessage = "Pause.";
    else if (transitions > 20) overScrollMessage = "Enough.";

    return (
        <motion.main 
            ref={containerRef}
            className="relative font-sans text-white selection:bg-[#4EA8DE]/30 overflow-x-hidden h-[100dvh] overflow-y-auto scroll-smooth snap-y snap-mandatory"
            style={{ backgroundColor: "#0B1C2C" }}
        >
            {/* Navigation / Logo - Sticky Top */}
            <nav className="fixed top-0 w-full z-50 p-6 mix-blend-difference pointer-events-none">
                <div className="max-w-[800px] mx-auto flex justify-between items-center pointer-events-auto">
                    {/* Empty div preserves justify-between flex layout */}
                    <div></div>
                    <Button variant="ghost" className="text-white hover:bg-white/10 uppercase tracking-widest text-xs" onClick={() => onNavigate('landing')}>
                        Enter Platform
                    </Button>
                </div>
            </nav>

            {/* Sticky Impact Indicator */}
            <div className="fixed right-6 bottom-8 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 z-50 pointer-events-none text-right">
                <div className="relative flex flex-col items-end">
                    <p className="text-[10px] sm:text-[12px] text-[#B0BEC5] uppercase tracking-widest mb-1 sm:mb-2 font-mono">Invisible impact</p>
                    <motion.div 
                        initial={false}
                        animate={{
                            opacity: activeConfig.opacity,
                            scale: activeConfig.scale,
                            filter: activeConfig.blur,
                            textShadow: activeConfig.glow ? "0px 0px 25px rgba(244,162,97,0.8)" : "0px 0px 0px rgba(244,162,97,0)",
                            color: activeConfig.glow ? "#F4A261" : "#FFFFFF"
                        }}
                        transition={{ 
                            duration: 0.6,
                            filter: { duration: 0.08, ease: "linear" }, // Micro-flash <100ms
                            opacity: { duration: activeFrame === 3 ? 0.15 : 0.6, ease: "easeInOut" }, // Quick dip
                            scale: { duration: 0.6, ease: "easeOut" } // Smooth pulse
                        }}
                        className="text-2xl sm:text-4xl font-bold font-mono tracking-tighter origin-right"
                    >
                        <motion.span>{rounded}</motion.span>
                    </motion.div>
                    
                    <AnimatePresence mode="wait">
                        {activeFrame === 1 && transitions === 0 && (
                            <motion.p 
                                key="responds"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.6, delay: 0.5 }}
                                className="absolute top-full right-0 mt-3 text-[15px] sm:text-[16px] text-[#B0BEC5] font-medium whitespace-nowrap tracking-wide"
                            >
                                <motion.span
                                    animate={{ opacity: [1, 0.1, 1] }}
                                    transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                                    className="block"
                                >
                                    It responds to you.
                                </motion.span>
                            </motion.p>
                        )}
                        {activeFrame === 5 && transitions <= 6 && (
                            <motion.p 
                                key="scale"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.6, delay: 0.4 }}
                                className="absolute top-full right-0 mt-3 text-[15px] sm:text-[16px] text-[#F4A261] font-medium whitespace-nowrap tracking-wide"
                            >
                                <motion.span
                                    animate={{ opacity: [1, 0.1, 1] }}
                                    transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                                    className="block"
                                >
                                    Now imagine this at scale
                                </motion.span>
                            </motion.p>
                        )}
                        {overScrollMessage && (
                            <motion.p 
                                key={overScrollMessage}
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                                className="absolute top-full right-0 mt-3 text-[16px] sm:text-[18px] text-[#F4A261] font-bold whitespace-nowrap tracking-wide"
                            >
                                <motion.span
                                    animate={{ opacity: [1, 0.1, 1], textShadow: ["0px 0px 0px rgba(244,162,97,0)", "0px 0px 15px rgba(244,162,97,0.8)", "0px 0px 0px rgba(244,162,97,0)"] }}
                                    transition={{ duration: 0.7, repeat: Infinity, ease: "easeInOut" }}
                                    className="block"
                                >
                                    {overScrollMessage}
                                </motion.span>
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Fixed Background Overlay Effects */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div 
                    className="absolute inset-0 bg-[#040A10]" 
                    style={{ opacity: bgOpacity }} 
                />
                {/* Subtle Grain / Noise Overlay */}
                <div 
                    className="absolute inset-0 opacity-[0.04] mix-blend-overlay" 
                    style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.85%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}
                />
            </div>

            {/* Scrollable Content Engine */}
            <div className="relative z-10 w-full max-w-[800px] mx-auto px-6">
                
                {/* 🔹 FRAME 1: HOOK (0-100vh) */}
                <section className="h-[100dvh] w-full shrink-0 flex flex-col justify-center py-[80px] snap-start snap-always">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ amount: 0.5 }}
                        onViewportEnter={() => setActiveFrame(1)}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.5 } }
                        }}
                        className="text-left"
                    >
                        <motion.h1 
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
                            }}
                            className="text-[40px] sm:text-[56px] md:text-[72px] font-bold leading-[1.1] tracking-tight mb-12 text-white"
                        >
                            Every decision you make,<br />have deep impacts
                        </motion.h1>
                        
                        <div className="space-y-6 text-[24px] sm:text-[32px] font-medium text-[#B0BEC5] ml-2">
                            <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.8, transition: { duration: 0.8 } } }} className="flex items-center gap-4">
                                <div className="h-2.5 w-2.5 rounded-full bg-[#4EA8DE] shrink-0" /> On You
                            </motion.div>
                            <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.8, transition: { duration: 0.8 } } }} className="flex items-center gap-4">
                                <div className="h-2.5 w-2.5 rounded-full bg-[#4EA8DE] shrink-0" /> On Your People
                            </motion.div>
                            <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 0.8, transition: { duration: 0.8 } } }} className="flex items-center gap-4">
                                <div className="h-2.5 w-2.5 rounded-full bg-[#4EA8DE] shrink-0" /> 
                                <span>On Your <span className="text-white underline decoration-[#F4A261] decoration-4 underline-offset-8 transition-colors duration-500">Planet</span></span>
                            </motion.div>
                        </div>
                    </motion.div>
                </section>

                {/* 🔹 FRAME 2: TENSION */}
                <section className="h-[100dvh] w-full shrink-0 flex flex-col justify-center py-[80px] snap-start snap-always">
                    <motion.div
                        initial={{ opacity: 0, y: 60 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.5 }}
                        onViewportEnter={() => setActiveFrame(2)}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="text-left"
                    >
                        <h2 className="text-[32px] sm:text-[48px] font-bold text-[#B0BEC5] leading-tight tracking-tight">
                            But most of these impacts<br />remain invisible.
                        </h2>
                    </motion.div>
                </section>

                {/* 🔹 FRAME 3: INSIGHT */}
                <section className="h-[100dvh] w-full shrink-0 flex flex-col justify-center py-[80px] snap-start snap-always">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, transformOrigin: 'left center' }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ amount: 0.5 }}
                        onViewportEnter={() => setActiveFrame(3)}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-left"
                    >
                        <h2 className="text-[32px] sm:text-[48px] leading-[1.3] text-white tracking-tight">
                            <span className="font-normal text-[#B0BEC5]">The problem isn’t intent.</span><br />
                            <span className="font-bold">
                                It’s <span className="underline decoration-[#F4A261] decoration-4 underline-offset-8">visibility</span>.
                            </span>
                        </h2>
                    </motion.div>
                </section>

                {/* 🔹 FRAME 4: PLATFORM INTRO */}
                <section className="h-[100dvh] w-full shrink-0 flex flex-col justify-center py-[80px] snap-start snap-always">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ amount: 0.5 }}
                        onViewportEnter={() => setActiveFrame(4)}
                        className="w-full flex flex-col items-start"
                    >
                        <motion.h2 
                            variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
                            className="text-[32px] sm:text-[48px] font-bold leading-tight tracking-tight text-left mb-16 text-white"
                        >
                            We’re building a <span className="text-[#4EA8DE]">system</span><br />to make impact visible
                        </motion.h2>

                        <motion.ul 
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { staggerChildren: 0.5, delayChildren: 0.4 } }
                            }}
                            className="flex flex-col items-start gap-6 ml-2"
                        >
                            {["simple", "clear", "actionable"].map((word) => (
                                <motion.li 
                                    key={word}
                                    variants={{
                                        hidden: { opacity: 0, scale: 0.9, x: -20 },
                                        visible: { opacity: 1, scale: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
                                    }}
                                    className="text-[32px] sm:text-[44px] font-medium tracking-wide text-[#B0BEC5] flex items-center gap-4"
                                >
                                    <div className="h-3 w-3 rounded-full bg-[#4EA8DE] shrink-0" />
                                    {word}
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.div>
                </section>

                {/* 🔹 FRAME 5: VISION */}
                <section className="h-[100dvh] w-full shrink-0 flex flex-col justify-center py-[80px] text-left snap-start snap-always">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.5 }}
                        onViewportEnter={() => setActiveFrame(5)}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-[700px]"
                    >
                        <h2 className="text-[32px] sm:text-[48px] font-bold leading-[1.1] text-white tracking-tight">
                            A future where every decision is informed by its impact.
                        </h2>
                    </motion.div>
                </section>

                {/* 🔹 FRAME 6: MISSION */}
                <section className="h-[100dvh] w-full shrink-0 flex flex-col justify-center py-[80px] text-left snap-start snap-always">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.5 }}
                        onViewportEnter={() => setActiveFrame(6)}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="max-w-[700px]"
                    >
                        <h2 className="text-[32px] sm:text-[48px] font-bold leading-[1.1] text-[#B0BEC5] tracking-tight">
                            Built through tools that help you measure, understand, and act.
                        </h2>
                    </motion.div>
                </section>

                {/* 🔹 FRAME 7: CTA (FINAL FRAME) */}
                <section className="h-[100dvh] w-full shrink-0 flex flex-col justify-center py-[80px] snap-start snap-always">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.5 }}
                        onViewportEnter={() => setActiveFrame(7)}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="text-left"
                    >
                        <h2 className="text-[32px] sm:text-[48px] font-bold text-white mb-12 tracking-tight">
                            Start exploring your impact with ai<span style={{ color: "#F4A261" }}>G</span>anesha
                        </h2>
                        
                        <Button 
                            onClick={() => onNavigate('landing')}
                            className="group relative overflow-hidden text-[16px] sm:text-[18px] px-10 py-8 rounded-[20px] font-bold bg-[#4EA8DE] hover:bg-[#1E3A5F] text-white transition-all duration-500 shadow-[0_0_40px_-10px_rgba(78,168,222,0.5)] hover:shadow-[0_0_60px_-10px_rgba(78,168,222,0.8)] border-none shrink-0"
                        >
                            <span className="relative z-10 flex items-center gap-3">
                                Enter Framework <ArrowRight className="h-5 w-5 group-hover:translate-x-1.5 transition-transform duration-300" />
                            </span>
                            {/* Subtle hover pulse / shimmer effect */}
                            <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-500 rounded-[20px]" />
                        </Button>
                    </motion.div>
                </section>

            </div>
        </motion.main>
    );
}
