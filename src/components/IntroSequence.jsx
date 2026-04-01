import React, { useEffect, useRef, useState } from 'react';
import { useScroll, useTransform, animate, useMotionValue, AnimatePresence, motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Premium easing curve — smooth decelerate like Apple / Linear
const ease = [0.25, 0.46, 0.45, 0.94];

export default function IntroSequence({ onNavigate }) {
    const containerRef = useRef(null);
    const [activeFrame, setActiveFrame] = useState(1);
    const [transitions, setTransitions] = useState(0);
    const prevFrameRef = useRef(1);
    const maxEmissionsRef = useRef(0);

    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => latest.toFixed(2) + " g CO₂");

    const frameConfig = {
        1: { value: 0.00, countDuration: 1, countDelay: 0, opacity: 0.45, scale: 1, blur: "blur(0px)", glow: false },
        2: { value: 0.01, countDuration: 1, countDelay: 0, opacity: 0.65, scale: [1, 1.02, 1], blur: "blur(0px)", glow: false },
        3: { value: 0.03, countDuration: 1, countDelay: 0, opacity: [0.65, 0.35, 0.65], scale: 1, blur: "blur(0px)", glow: false },
        4: { value: 0.06, countDuration: 0.5, countDelay: 0, opacity: 0.85, scale: [1, 1.04, 1], blur: ["blur(0px)", "blur(2px)", "blur(0px)"], glow: true },
        5: { value: 0.10, countDuration: 1, countDelay: 0, opacity: 0.85, scale: 1, blur: "blur(0px)", glow: false },
        6: { value: 0.15, countDuration: 1, countDelay: 0.2, opacity: 0.85, scale: 1, blur: "blur(0px)", glow: false },
        7: { value: 0.20, countDuration: 1, countDelay: 0, opacity: 1.0, scale: 1, blur: "blur(0px)", glow: false }
    };

    const { scrollYProgress } = useScroll({ container: containerRef });
    const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.75, 0.92, 1]);

    useEffect(() => {
        if (containerRef.current) containerRef.current.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (activeFrame !== prevFrameRef.current) {
            setTransitions(t => t + 1);
            prevFrameRef.current = activeFrame;
        }
    }, [activeFrame]);

    const penalty = Math.max(0, transitions - 6) * 0.03;

    useEffect(() => {
        const config = frameConfig[activeFrame] || frameConfig[1];
        let targetValue = config.value + penalty;
        if (targetValue < maxEmissionsRef.current) targetValue = maxEmissionsRef.current + 0.01;
        if (targetValue > maxEmissionsRef.current) maxEmissionsRef.current = targetValue;
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
    else if (transitions > 10 && transitions <= 15) overScrollMessage = "You're still adding.";
    else if (transitions > 15 && transitions <= 20) overScrollMessage = "Pause.";
    else if (transitions > 20) overScrollMessage = "Enough.";

    return (
        <motion.main
            ref={containerRef}
            className="relative font-sans text-white selection:bg-white/10 overflow-x-hidden h-[100dvh] overflow-y-auto scroll-smooth snap-y snap-mandatory"
            style={{ backgroundColor: "#080C10" }}
        >
            {/* ── Navigation ─────────────────────────────────── */}
            <nav className="fixed top-0 w-full z-50 px-5 sm:px-8 py-4 sm:py-6 flex justify-between items-center pointer-events-none">
                {/* Wordmark — left */}
                <span className="pointer-events-auto text-[18px] sm:text-[22px] font-semibold tracking-[-0.03em] text-white/90 select-none">
                    ai<span style={{ color: "#F4A261" }}>G</span>anesha
                </span>

                {/* Skip link — right */}
                <button
                    onClick={() => onNavigate('landing')}
                    className="pointer-events-auto flex items-center gap-1.5 text-[10px] sm:text-[12px] font-mono uppercase tracking-[0.12em] text-white/40 hover:text-white/80 transition-colors duration-300 group"
                >
                    Enter Platform
                    <ArrowRight className="h-2.5 w-2.5 sm:h-3 sm:w-3 group-hover:translate-x-0.5 transition-transform duration-300" />
                </button>
            </nav>

            {/* ── CO₂ Counter — Sticky Side ─────────────────── */}
            {/* On mobile: fixed bottom-right, smaller. On desktop: mid-right */}
            <div className="fixed right-4 sm:right-[8%] top-16 sm:top-1/2 sm:-translate-y-1/2 z-50 pointer-events-none text-right">
                <div className="relative flex flex-col items-end">
                    <p className="text-[8px] sm:text-[9px] text-white/25 uppercase tracking-[0.15em] mb-0.5 sm:mb-2 font-mono">
                        Invisible impact
                    </p>
                    <motion.div
                        initial={false}
                        animate={{
                            opacity: activeConfig.opacity,
                            scale: activeConfig.scale,
                            filter: activeConfig.blur,
                            textShadow: activeConfig.glow
                                ? "0px 0px 20px rgba(244,162,97,0.6)"
                                : "0px 0px 0px rgba(244,162,97,0)",
                            color: activeConfig.glow ? "#F4A261" : "rgba(255,255,255,0.9)"
                        }}
                        transition={{
                            duration: 0.7,
                            ease,
                            filter: { duration: 0.08, ease: "linear" },
                            opacity: { duration: activeFrame === 3 ? 0.12 : 0.7, ease: "easeInOut" },
                        }}
                        className="text-[17px] sm:text-[22px] md:text-[34px] font-light font-mono tracking-[-0.04em] tabular-nums origin-right"
                    >
                        <motion.span>{rounded}</motion.span>
                    </motion.div>

                    <AnimatePresence mode="wait">
                        {activeFrame === 1 && transitions === 0 && (
                            <motion.p
                                key="responds"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.7, delay: 0.6, ease }}
                                className="absolute top-full right-0 mt-2 text-[9px] sm:text-[11px] text-white/30 font-mono whitespace-nowrap tracking-widest uppercase"
                            >
                                <motion.span
                                    animate={{ opacity: [1, 0.2, 1] }}
                                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                                    className="block"
                                >
                                    It responds to you
                                </motion.span>
                            </motion.p>
                        )}
                        {activeFrame === 5 && transitions <= 6 && (
                            <motion.p
                                key="scale"
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.7, delay: 0.4, ease }}
                                className="absolute top-full right-0 mt-2 text-[9px] sm:text-[11px] text-[#F4A261]/60 font-mono whitespace-nowrap tracking-widest uppercase"
                            >
                                <motion.span
                                    animate={{ opacity: [1, 0.2, 1] }}
                                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                                    className="block"
                                >
                                    Now imagine this at scale
                                </motion.span>
                            </motion.p>
                        )}
                        {overScrollMessage && (
                            <motion.p
                                key={overScrollMessage}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.4, ease }}
                                className="absolute top-full right-0 mt-2 text-[11px] sm:text-[13px] text-[#F4A261] font-mono whitespace-nowrap tracking-widest uppercase"
                            >
                                <motion.span
                                    animate={{
                                        opacity: [1, 0.15, 1],
                                        textShadow: ["0px 0px 0px rgba(244,162,97,0)", "0px 0px 12px rgba(244,162,97,0.6)", "0px 0px 0px rgba(244,162,97,0)"]
                                    }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                                    className="block"
                                >
                                    {overScrollMessage}
                                </motion.span>
                            </motion.p>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* ── Background Layers ──────────────────────────── */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <motion.div
                    className="absolute inset-0"
                    style={{
                        background: "radial-gradient(ellipse 80% 60% at 20% 40%, rgba(14,30,55,0.5) 0%, transparent 70%)",
                        opacity: bgOpacity
                    }}
                />
                {/* Film grain — ultra subtle */}
                <div
                    className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
                    style={{
                        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22/%3E%3C/svg%3E")'
                    }}
                />
            </div>

            {/* ── Scrollable Frames ──────────────────────────── */}
            {/* Max width 760px, generous horizontal padding on all sizes */}
            <div className="relative z-10 w-full max-w-[760px] mx-auto px-5 sm:px-8 md:px-10">

                {/* 🔹 FRAME 1: HOOK */}
                <section className="h-[100dvh] w-full shrink-0 flex flex-col justify-center py-[72px] snap-start snap-always">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ amount: 0.5 }}
                        onViewportEnter={() => setActiveFrame(1)}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: { opacity: 1, transition: { staggerChildren: 0.45 } }
                        }}
                        className="text-left"
                    >
                        <motion.h1
                            variants={{
                                hidden: { opacity: 0, y: 24 },
                                visible: { opacity: 1, y: 0, transition: { duration: 1, ease } }
                            }}
                            className="text-[30px] min-[375px]:text-[34px] sm:text-[48px] md:text-[60px] lg:text-[68px] font-semibold leading-[1.1] tracking-[-0.03em] mb-10 sm:mb-14 text-white"
                        >
                            Every decision<br />makes an impact.
                        </motion.h1>

                        <div className="space-y-4 sm:space-y-5 text-[17px] min-[375px]:text-[18px] sm:text-[22px] md:text-[26px] font-semibold text-white/40">
                            {["On You", "On Your People", "On Your Planet"].map((item, i) => (
                                <motion.div
                                    key={item}
                                    variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.8, ease } } }}
                                    className="flex items-center gap-4 sm:gap-5"
                                >
                                    <span className="text-white/20 text-[12px] sm:text-[14px] font-mono tracking-widest select-none shrink-0">—</span>
                                    <span className={i === 2 ? "text-white/70" : ""}>{item}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>

                {/* 🔹 FRAME 2: TENSION */}
                <section className="h-[100dvh] w-full shrink-0 flex flex-col justify-center py-[72px] snap-start snap-always">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.5 }}
                        onViewportEnter={() => setActiveFrame(2)}
                        transition={{ duration: 1.1, ease }}
                        className="text-left"
                    >
                        <h2 className="text-[24px] min-[375px]:text-[26px] sm:text-[38px] md:text-[44px] font-semibold leading-[1.3] tracking-[-0.02em]">
                            <span className="text-white/45">But most of these impacts</span><br />
                            <span className="text-white">remain invisible.</span>
                        </h2>
                    </motion.div>
                </section>

                {/* 🔹 FRAME 3: INSIGHT */}
                <section className="h-[100dvh] w-full shrink-0 flex flex-col justify-center py-[72px] snap-start snap-always">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.97, transformOrigin: 'left center' }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ amount: 0.5 }}
                        onViewportEnter={() => setActiveFrame(3)}
                        transition={{ duration: 0.9, ease }}
                        className="text-left"
                    >
                        <h2 className="text-[24px] min-[375px]:text-[26px] sm:text-[38px] md:text-[44px] font-semibold leading-[1.3] tracking-[-0.02em]">
                            <span className="text-white/45">What you cannot see,</span><br />
                            <span className="text-white">
                                you cannot <span className="underline decoration-[#F4A261]/60 decoration-2 underline-offset-6 sm:underline-offset-8">change</span>.
                            </span>
                        </h2>
                    </motion.div>
                </section>

                {/* 🔹 FRAME 4: PLATFORM INTRO */}
                <section className="h-[100dvh] w-full shrink-0 flex flex-col justify-center py-[72px] snap-start snap-always">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ amount: 0.5 }}
                        onViewportEnter={() => setActiveFrame(4)}
                        className="w-full flex flex-col items-start"
                    >
                        <motion.h2
                            variants={{ hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease } } }}
                            className="text-[24px] min-[375px]:text-[26px] sm:text-[38px] md:text-[44px] font-semibold leading-[1.2] tracking-[-0.03em] text-left mb-10 sm:mb-14 text-white"
                        >
                            We're building a <span style={{ color: "#4EA8DE" }}>system</span><br />to make impact visible.
                        </motion.h2>

                        <motion.ul
                            variants={{
                                hidden: { opacity: 0 },
                                visible: { opacity: 1, transition: { staggerChildren: 0.4, delayChildren: 0.3 } }
                            }}
                            className="flex flex-col items-start gap-4 sm:gap-5"
                        >
                            {["simple", "clear", "actionable"].map((word) => (
                                <motion.li
                                    key={word}
                                    variants={{
                                        hidden: { opacity: 0, x: -16 },
                                        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease } }
                                    }}
                                    className="text-[22px] min-[375px]:text-[24px] sm:text-[32px] md:text-[38px] font-semibold tracking-[-0.02em] text-white/35 flex items-center gap-4 sm:gap-5"
                                >
                                    <span className="text-white/20 text-[12px] sm:text-[14px] font-mono tracking-widest select-none shrink-0">—</span>
                                    {word}
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.div>
                </section>

                {/* 🔹 FRAME 5: VISION */}
                <section className="h-[100dvh] w-full shrink-0 flex flex-col justify-center py-[72px] text-left snap-start snap-always">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.5 }}
                        onViewportEnter={() => setActiveFrame(5)}
                        transition={{ duration: 0.9, ease }}
                        className="max-w-[560px]"
                    >
                        <h2 className="text-[24px] min-[375px]:text-[26px] sm:text-[38px] md:text-[44px] font-semibold leading-[1.2] text-white tracking-[-0.03em]">
                            A future where every decision is informed by its impact.
                        </h2>
                    </motion.div>
                </section>

                {/* 🔹 FRAME 6: MISSION */}
                <section className="h-[100dvh] w-full shrink-0 flex flex-col justify-center py-[72px] text-left snap-start snap-always">
                    <motion.div
                        initial={{ opacity: 0, y: 28 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.5 }}
                        onViewportEnter={() => setActiveFrame(6)}
                        transition={{ duration: 0.9, ease }}
                        className="max-w-[560px]"
                    >
                        <h2 className="text-[24px] min-[375px]:text-[26px] sm:text-[38px] md:text-[44px] font-semibold leading-[1.2] text-white/45 tracking-[-0.02em]">
                            Built through tools that help you measure, understand, and act.
                        </h2>
                    </motion.div>
                </section>

                {/* 🔹 FRAME 7: CTA */}
                <section className="h-[100dvh] w-full shrink-0 flex flex-col justify-center py-[72px] snap-start snap-always">
                    <motion.div
                        initial={{ opacity: 0, y: 36 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ amount: 0.5 }}
                        onViewportEnter={() => setActiveFrame(7)}
                        transition={{ duration: 1.1, delay: 0.15, ease }}
                        className="text-left"
                    >
                        <h2 className="text-[24px] min-[375px]:text-[28px] sm:text-[38px] md:text-[44px] font-semibold text-white mb-2 sm:mb-3 tracking-[-0.03em]">
                            Start with ai<span style={{ color: "#F4A261" }}>G</span>anesha
                        </h2>
                        <p className="text-[13px] sm:text-[15px] md:text-[17px] text-white/30 font-semibold mb-10 sm:mb-14 tracking-[-0.01em]">
                            Measure. Understand. Act.
                        </p>

                        {/* Ghost CTA button */}
                        <button
                            onClick={() => onNavigate('landing')}
                            className="group relative inline-flex items-center gap-3 px-6 sm:px-8 py-3.5 sm:py-4 border border-white/20 hover:border-white/50 text-[11px] sm:text-[13px] md:text-[14px] font-mono uppercase tracking-[0.12em] text-white/60 hover:text-white transition-all duration-500 overflow-hidden"
                        >
                            <span className="absolute inset-0 bg-white/[0.04] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                            <span className="relative z-10 flex items-center gap-2 sm:gap-3">
                                Enter Framework
                                <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 group-hover:translate-x-1 transition-transform duration-400" />
                            </span>
                        </button>
                    </motion.div>
                </section>

            </div>
        </motion.main>
    );
}
