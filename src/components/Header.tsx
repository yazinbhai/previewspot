"use client";

import { useState, useEffect } from "react";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 30) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrolled 
                ? "bg-[#0B0B0F]/85 backdrop-blur-md border-b border-white/5 py-4 shadow-lg shadow-black/20" 
                : "bg-transparent py-6"
        }`}>
            <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
                {/* Logo Image in Top Left */}
                <a 
                    href="#" 
                    className="flex items-center gap-3 transition-transform duration-300 hover:scale-102 cursor-pointer"
                >
                    <img
                        src="/logo.png"
                        alt="Previewspot Logo"
                        className="h-10 sm:h-12 md:h-14 w-auto object-contain select-none"
                    />
                </a>

                {/* Right Navigation & CTA */}
                <div className="flex items-center gap-8">
                    <nav className="hidden md:flex items-center gap-8 text-xs uppercase tracking-widest font-cinematic font-bold">
                        <a 
                            href="#work-section" 
                            className="text-white/60 hover:text-[#00E5FF] transition-colors cursor-pointer"
                        >
                            Work
                        </a>
                        <a 
                            href="#process-section" 
                            className="text-white/60 hover:text-[#00E5FF] transition-colors cursor-pointer"
                        >
                            Process
                        </a>
                        <a 
                            href="#pricing-section" 
                            className="text-white/60 hover:text-[#00E5FF] transition-colors cursor-pointer"
                        >
                            Pricing
                        </a>
                    </nav>

                    <a
                        href="#booking-section"
                        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] text-white font-bold text-[10px] sm:text-xs tracking-wider uppercase transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)]"
                    >
                        Book A Call
                    </a>
                </div>
            </div>
        </header>
    );
}
