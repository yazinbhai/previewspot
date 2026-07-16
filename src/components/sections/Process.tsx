"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";

if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
}

export default function Process() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const steps = [
        { number: "01", title: "The Brief", desc: "Share your product, target audience, and goals." },
        { number: "02", title: "The Script", desc: "We write conversion-optimized hooks and narratives." },
        { number: "03", title: "AI Production", desc: "Generating cinematic visuals, avatars, and voiceovers." },
        { number: "04", title: "Revisions", desc: "We refine and polish until it's perfect." },
        { number: "05", title: "Delivery", desc: "Ready-to-launch assets delivered to your drive." },
    ];

    useEffect(() => {
        let ctx = gsap.context(() => {
            const container = containerRef.current;
            if (!container) return;

            const totalWidth = container.scrollWidth - window.innerWidth;

            gsap.to(container, {
                x: -totalWidth,
                ease: "none",
                scrollTrigger: {
                    trigger: sectionRef.current,
                    pin: true,
                    scrub: 1,
                    start: "top top",
                    end: () => `+=${totalWidth}`,
                    anticipatePin: 1,
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section id="process-section" ref={sectionRef} className="h-screen bg-black overflow-hidden flex items-center relative z-20">

            <div className="absolute top-20 left-10 md:left-20 z-10">
                <h2 className="text-4xl md:text-6xl font-cinematic font-bold text-white/50">
                    How It <span className="text-white">Works</span>
                </h2>
            </div>

            <div ref={containerRef} className="flex gap-10 md:gap-32 px-[10vw] md:px-[30vw] items-center h-full will-change-transform">
                {steps.map((step, idx) => (
                    <div
                        key={idx}
                        className="w-[80vw] md:w-[40vw] flex-shrink-0 flex flex-col gap-6"
                    >
                        <div className="text-7xl md:text-9xl font-cinematic font-black text-transparent [-webkit-text-stroke:2px_rgba(255,255,255,0.1)]">
                            {step.number}
                        </div>
                        <h3 className="text-3xl md:text-5xl font-bold font-cinematic text-white">
                            {step.title}
                        </h3>
                        <p className="text-xl md:text-2xl text-gray-400">
                            {step.desc}
                        </p>

                        {/* Connection Line */}
                        {idx < steps.length - 1 && (
                            <div className="absolute top-1/2 -z-10 w-[40vw] h-px bg-white/10 hidden md:block" style={{ left: 'calc(40vw + 60px)' }} />
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
