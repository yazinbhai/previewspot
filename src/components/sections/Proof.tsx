"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Play, 
  X
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const logos = [
    "JINTAS", "GINTAK", "CHAIRMEN", "ELEMENTS OF CINEMA", "KAPDA CLUB",
    "JINTAS", "GINTAK", "CHAIRMEN", "ELEMENTS OF CINEMA", "KAPDA CLUB"
];

const getYoutubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const getInstagramId = (url: string) => {
    if (!url) return null;
    const regExp = /(?:instagram\.com\/(?:p|reel|reels)\/)([\w-]+)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
};

const formatDirectImageUrl = (url: string) => {
    if (!url) return "";
    let clean = url.trim();
    
    // ImgBB viewer link conversion (e.g. https://ibb.co/CODE)
    if (clean.includes("ibb.co/") && !clean.includes("i.ibb.co/")) {
        const code = clean.split("ibb.co/")[1]?.split("/")[0]?.split("?")[0];
        if (code) return `https://i.ibb.co/${code}/image.jpg`;
    }

    // PostImg viewer link conversion (e.g. https://postimg.cc/CODE)
    if (clean.includes("postimg.cc/") && !clean.includes("i.postimg.cc/")) {
        const code = clean.split("postimg.cc/")[1]?.split("/")[0]?.split("?")[0];
        if (code) return `https://i.postimg.cc/${code}/image.png`;
    }

    // Imgur viewer link conversion (e.g. https://imgur.com/CODE)
    if (clean.includes("imgur.com/") && !clean.includes("i.imgur.com/")) {
        const code = clean.split("imgur.com/")[1]?.split("/")[0]?.split("?")[0];
        if (code) return `https://i.imgur.com/${code}.jpg`;
    }

    return clean;
};

const testimonials = [
    { quote: "Our CPA dropped by 40% after switching to their AI creatives. Insane.", author: "Founder, DTC Brand" },
    { quote: "Finally, an agency that understands performance over vanity metrics.", author: "CMO, SaaS Startup" },
];

export default function Proof() {
    const [items, setItems] = useState<any[]>([]);
    const [activeLightbox, setActiveLightbox] = useState<any | null>(null);

    // Fetch work items
    const fetchItems = async () => {
        try {
            const res = await fetch(`/api/work?t=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (err) {
            console.error("Failed to fetch work items:", err);
        }
    };

    useEffect(() => {
        fetchItems();
    }, []);

    return (
        <section id="proof-section" className="py-32 bg-[#0B0B0F] relative overflow-hidden">

            {/* Logos Marquee */}
            <div className="mb-32 relative flex overflow-x-hidden border-y border-white/10 py-10">
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#0B0B0F] to-transparent z-10" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#0B0B0F] to-transparent z-10" />

                <motion.div
                    animate={{ x: ["0%", "-50%"] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="flex whitespace-nowrap gap-20 px-10 items-center justify-around w-max"
                >
                    {logos.map((logo, idx) => (
                        <span key={idx} className="text-3xl font-cinematic font-bold text-white/30 tracking-widest uppercase">
                            {logo}
                        </span>
                    ))}
                </motion.div>
            </div>

            <div className="container mx-auto px-4">

                {/* Video Grid */}
                <div id="work-section" className="scroll-mt-32 mb-32">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-cinematic font-bold text-white">
                                The <span className="text-gradient">Work</span>
                            </h2>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {items.map((item, idx) => (
                            <motion.div
                                key={item.id || idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="aspect-video bg-gradient-to-br from-white/5 to-white/10 rounded-2xl relative overflow-hidden group cursor-pointer border border-white/10"
                                onClick={() => setActiveLightbox(item)}
                            >
                                {/* Video Player Card */}
                                <div className="absolute inset-0 bg-black flex items-center justify-center">
                                    {item.thumbnailUrl ? (
                                        <img
                                            src={formatDirectImageUrl(item.thumbnailUrl)}
                                            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                                            alt={item.title}
                                        />
                                    ) : getYoutubeId(item.url) ? (
                                        <img
                                            src={`https://img.youtube.com/vi/${getYoutubeId(item.url)}/hqdefault.jpg`}
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                                            alt={item.title}
                                        />
                                    ) : getInstagramId(item.url) ? (
                                        <iframe
                                            src={`https://www.instagram.com/p/${getInstagramId(item.url)}/embed/`}
                                            className="w-full h-full border-0 pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity"
                                            scrolling="no"
                                        />
                                    ) : (
                                        <video
                                            src={item.url}
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                                            muted
                                            playsInline
                                            loop
                                            onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                                            onMouseLeave={(e) => e.currentTarget.pause()}
                                        />
                                    )}
                                </div>

                                {/* Custom Glow & Play Overlay */}
                                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-14 h-14 rounded-full bg-[#FF0033]/20 hover:bg-[#FF0033]/40 backdrop-blur-md flex items-center justify-center border border-[#FF0033]/30 transition-transform duration-300 group-hover:scale-110">
                                        <Play className="w-5 h-5 text-white fill-white ml-1" />
                                    </div>
                                </div>

                                {/* Bottom Info Banner */}
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4 md:p-6 flex flex-col justify-end">
                                    <h3 className="text-white text-xs md:text-sm font-cinematic font-bold tracking-wide line-clamp-1">
                                        {item.title}
                                    </h3>
                                    <span className="text-[10px] text-gray-400 mt-0.5">{item.date}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {items.length === 0 && (
                        <div className="py-24 text-center border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                            <Upload className="w-12 h-12 text-white/30 mx-auto mb-4" />
                            <h3 className="text-lg font-cinematic font-bold text-white mb-2">No Videos Available</h3>
                            <p className="text-gray-400 text-sm max-w-md mx-auto">
                                Videos uploaded via the admin portal will appear here.
                            </p>
                        </div>
                    )}
                </div>

                {/* Testimonials */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {testimonials.map((test, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="glassmorphism p-10 rounded-3xl"
                        >
                            <p className="text-2xl md:text-3xl font-cinematic text-white/90 leading-snug mb-8">
                                &quot;{test.quote}&quot;
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FF0033] via-[#FF3355] to-[#FF9900]" />
                                <span className="text-gray-400 font-medium tracking-wide">
                                    {test.author}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="text-center">
                    <Button
                        variant="primary"
                        size="lg"
                        href="#booking-section"
                    >
                        Book Free Strategy Call
                    </Button>
                </div>
            </div>

            {/* Video Lightbox Player Modal */}
            <AnimatePresence>
                {activeLightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6"
                        onClick={() => setActiveLightbox(null)}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setActiveLightbox(null)}
                            className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white border border-white/10 hover:border-white/20 transition-all z-50 cursor-pointer"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        {/* Modal Box */}
                        {(() => {
                            const ytId = getYoutubeId(activeLightbox.url);
                            const igId = getInstagramId(activeLightbox.url);

                            return (
                                <motion.div
                                    initial={{ scale: 0.95, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.95, y: 20 }}
                                    className={`relative w-full bg-transparent rounded-2xl overflow-hidden flex flex-col items-center transition-all duration-300 ${
                                        igId ? "max-w-md max-h-[85vh]" : "max-w-4xl max-h-[85vh]"
                                    }`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className={`w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 ${
                                        igId ? "aspect-[9/16] max-h-[70vh]" : "aspect-video max-h-[70vh]"
                                    }`}>
                                        {ytId ? (
                                            <iframe
                                                src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                                                className="w-full h-full border-0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        ) : igId ? (
                                            <iframe
                                                src={`https://www.instagram.com/p/${igId}/embed/`}
                                                className="w-full h-full border-0"
                                                allowFullScreen
                                            />
                                        ) : (
                                            <video
                                                src={activeLightbox.url}
                                                className="w-full h-full object-contain"
                                                controls
                                                autoPlay
                                                playsInline
                                            />
                                        )}
                                    </div>

                                    {/* Title & Metadata */}
                                    <div className="w-full text-center mt-6 text-white px-4">
                                        <p className="text-[#FF9900] text-xs font-semibold uppercase tracking-wider mb-2">
                                            Ad Creative &bull; {activeLightbox.date}
                                        </p>
                                        <h3 className="text-xl font-cinematic font-bold">{activeLightbox.title}</h3>
                                    </div>
                                </motion.div>
                            );
                        })()}
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}

