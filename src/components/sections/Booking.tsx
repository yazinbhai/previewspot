"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";

export default function Booking() {
    useEffect(() => {
        const handleCalendlyEvent = (e: MessageEvent) => {
            // Listen for successful scheduling events from the Calendly iframe
            if (e.data.event && e.data.event === 'calendly.event_scheduled') {
                // Trigger Meta Pixel Schedule Event
                if (typeof window !== 'undefined' && 'fbq' in window) {
                    (window as any).fbq('track', 'Schedule');
                    console.log("Meta Pixel fired: Schedule");
                } else {
                    console.warn("Meta Pixel (fbq) not found on window. Ensure base pixel is installed.");
                }
            }
        };

        window.addEventListener('message', handleCalendlyEvent);
        return () => window.removeEventListener('message', handleCalendlyEvent);
    }, []);
    return (
        <section id="booking-section" className="py-32 bg-gradient-to-b from-black to-[#05050A] relative border-t border-white/5">
            <div className="container mx-auto px-4 max-w-5xl">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-5xl md:text-7xl font-cinematic font-bold mb-6 tracking-tight text-white"
                    >
                        Let&apos;s Create Your Next <span className="text-gradient">Winning Ad.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-400 max-w-2xl mx-auto"
                    >
                        Pick a time below for your free strategy call. We&apos;ll discuss your brand, your goals, and how our AI engine can help you scale.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="glassmorphism rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.05)] border border-white/10 h-[700px] w-full relative"
                >
                    {/* Calendly Inline Embed */}
                    <iframe
                        src="https://calendly.com/yazintazad/30min?background_color=0B0B0F&text_color=EAEAEA&primary_color=00E5FF"
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        title="Book a Discovery Call"
                        className="absolute inset-0 bg-[#0B0B0F]"
                    />
                </motion.div>

                <div className="mt-20 flex flex-col items-center justify-center text-center">
                    <p className="text-white/50 mb-4 font-cinematic uppercase tracking-widest text-xs">
                        Or reach out directly
                    </p>
                    <a href="mailto:hello@previewspotfilms.com" className="text-xl font-bold text-white hover:text-[#00E5FF] transition-colors">
                        hello@previewspotfilms.com
                    </a>
                </div>
            </div>
        </section>
    );
}
