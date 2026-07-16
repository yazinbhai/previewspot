"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Play, Sparkles, Zap, DollarSign, Camera, Network } from "lucide-react";

export default function Solution() {
    const features = [
        {
            icon: <Play className="w-8 h-8 text-[#00E5FF]" />,
            title: "Scripted for Performance",
            description: "Data-backed hooks and psychological triggers designed to maximize watch time and conversion."
        },
        {
            icon: <Camera className="w-8 h-8 text-[#00E5FF]" />,
            title: "UGC-Style Realism",
            description: "Authentic, native-feeling content that bypasses ad fatigue and builds instant trust."
        },
        {
            icon: <Sparkles className="w-8 h-8 text-[#8B5CF6]" />,
            title: "AI-Generated Visuals",
            description: "Cinematic B-roll, dynamic text animations, and hyper-realistic AI avatars tailored to your brand."
        },
        {
            icon: <Zap className="w-8 h-8 text-[#8B5CF6]" />,
            title: "Fast Turnaround",
            description: "From brief to final render in a fraction of the time of traditional agencies."
        },
        {
            icon: <DollarSign className="w-8 h-8 text-[#00E5FF]" />,
            title: "Budget-Friendly",
            description: "Agency-quality production at a startup-friendly price point. Zero hidden fees."
        },
        {
            icon: <Network className="w-8 h-8 text-[#00E5FF]" />,
            title: "Advanced Generation Architectures",
            description: "We leverage advanced generation architectures for fluid motion—to ensure your brand's visuals are pristine, native, and conversion-ready."
        }
    ];

    return (
        <section className="py-32 bg-[#0B0B0F] relative z-10">
            <div className="container mx-auto px-4">
                <div className="text-center mb-20">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="text-4xl md:text-6xl font-cinematic font-bold mb-6"
                    >
                        The <span className="text-gradient">Engine</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 max-w-2xl mx-auto text-lg"
                    >
                        Everything you need to scale your user acquisition, packed into one seamless process.
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-20">
                    {features.map((feature, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                            className="glassmorphism p-8 rounded-2xl relative overflow-hidden group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="relative z-10">
                                <div className="mb-6 p-4 rounded-xl bg-black/40 inline-block">
                                    {feature.icon}
                                </div>
                                <h3 className="text-2xl font-bold font-cinematic mb-3 text-white/90">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="flex justify-center"
                >
                    <Button
                        variant="secondary"
                        size="lg"
                        href="#booking-section"
                    >
                        Book Free Strategy Call
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
