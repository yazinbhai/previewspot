"use client";

import { motion } from "framer-motion";

export default function Pricing() {
    return (
        <section id="pricing-section" className="py-40 bg-black relative">
            <div className="container mx-auto px-4 max-w-4xl text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-5xl md:text-7xl font-cinematic font-bold mb-10 text-white leading-tight">
                        Premium Output.<br />
                        <span className="text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.5)]">Startup Budget.</span>
                    </h2>

                    <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed mb-12 max-w-2xl mx-auto">
                        We don&apos;t charge for expensive sets, bloated agency teams, or unnecessary overhead. You pay for pure performance and ruthless creative execution driven by AI.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" />
                            <span className="text-white/80 uppercase tracking-widest text-sm font-bold">No Hidden Fees</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6]" />
                            <span className="text-white/80 uppercase tracking-widest text-sm font-bold">Unlimited Revisions</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-[#00E5FF] shadow-[0_0_10px_#00E5FF]" />
                            <span className="text-white/80 uppercase tracking-widest text-sm font-bold">Full Ownership</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
