"use client";

import { useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { NeuralNetwork } from "@/components/WebGLBackground";
import { motion, useScroll, useTransform } from "framer-motion";

export default function Shift() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    });

    const opacity = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.8], [0, 1, 1, 0]);
    const scale = useTransform(scrollYProgress, [0.2, 0.8], [0.8, 1.2]);
    const textY = useTransform(scrollYProgress, [0.2, 0.5], [100, 0]);

    return (
        <section ref={containerRef} className="relative h-[200vh] bg-[#0B0B0F]">
            <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">

                {/* WebGL Background */}
                <motion.div style={{ opacity, scale }} className="absolute inset-0 z-0">
                    <Canvas camera={{ position: [0, 0, 20], fov: 45 }}>
                        <ambientLight intensity={0.5} />
                        <NeuralNetwork />
                    </Canvas>
                    {/* Radial gradient overlay for blending */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0B0B0F_70%)] pointer-events-none" />
                </motion.div>

                {/* Content */}
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <motion.h2
                        style={{ opacity, y: textY }}
                        className="text-5xl md:text-7xl lg:text-8xl font-cinematic font-bold tracking-tight"
                    >
                        <span className="text-white">AI is rewriting how</span>
                        <br />
                        <span className="text-gradient">ads are made.</span>
                    </motion.h2>
                </div>
            </div>
        </section>
    );
}
