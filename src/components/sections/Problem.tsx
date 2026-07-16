"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";

export default function Problem() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const lines = [
        "Attention is expensive.",
        "Production is slow.",
        "Creative teams are overloaded."
    ];

    return (
        <section ref={containerRef} className="relative min-h-[150vh] bg-black py-40 flex flex-col justify-center">
            <div className="container mx-auto px-4 sticky top-1/2 -translate-y-1/2">
                <div className="max-w-4xl mx-auto flex flex-col gap-10">
                    {lines.map((line, index) => {
                        // Calculate specific ranges for each line so they fade in sequentially
                        const start = 0.2 + (index * 0.15);
                        const peak = start + 0.1;
                        const end = peak + 0.15;

                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const opacity = useTransform(
                            scrollYProgress,
                            [start - 0.1, peak, end, 1],
                            [0, 1, 0.3, 0]
                        );

                        // eslint-disable-next-line react-hooks/rules-of-hooks
                        const y = useTransform(
                            scrollYProgress,
                            [start - 0.1, peak],
                            [40, 0]
                        );

                        return (
                            <motion.h2
                                key={index}
                                style={{ opacity, y }}
                                className="text-4xl md:text-6xl lg:text-7xl font-cinematic font-bold tracking-tight text-white/90"
                            >
                                {line}
                            </motion.h2>
                        );
                    })}
                </div>
            </div>

            {/* Background ambient light */}
            <motion.div
                style={{
                    opacity: useTransform(scrollYProgress, [0.3, 0.5, 0.8], [0, 0.5, 0])
                }}
                className="absolute inset-0 pointer-events-none flex items-center justify-center"
            >
                <div className="w-[80vw] h-[80vw] max-w-3xl max-h-3xl bg-red-900/10 rounded-full blur-[120px]" />
            </motion.div>
        </section>
    );
}
