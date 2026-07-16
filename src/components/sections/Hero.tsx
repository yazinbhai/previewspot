"use client";

import { useRef } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
    const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

    return (
        <section ref={containerRef} className="relative h-screen w-full overflow-hidden flex items-center justify-center">
            <motion.div style={{ y, scale, opacity }} className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-black/60 z-10" />
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover z-0"
                >
                    {/* Path starts from the public folder, so / means public/ */}
                    <source src="/hero-bg.mp4" type="video/mp4" />
                </video>
            </motion.div>

            <div className="relative z-20 container mx-auto px-4 flex flex-col items-center text-center">
                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="text-5xl md:text-7xl lg:text-8xl font-cinematic font-bold tracking-tight mb-6"
                >
                    Ads That <span className="text-gradient">Stop The Scroll.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.4 }}
                    className="text-lg md:text-2xl text-gray-300 max-w-2xl mx-auto mb-10 font-light"
                >
                    AI-powered performance creatives built for Indian brands.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 0.6 }}
                    className="flex flex-col sm:flex-row gap-4 items-center"
                >
                    <Button
                        variant="secondary"
                        size="lg"
                        href="#booking-section"
                    >
                        Book Free Strategy Call
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        href="#work-section"
                    >
                        See Our Work
                    </Button>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 1 }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
            >
                <span className="text-xs uppercase tracking-[0.2em] text-white/50">Scroll</span>
                <div className="w-px h-12 bg-white/20 relative overflow-hidden">
                    <motion.div
                        animate={{ y: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 bg-white"
                    />
                </div>
            </motion.div>
        </section>
    );
}
