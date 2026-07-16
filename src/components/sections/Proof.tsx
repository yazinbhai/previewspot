"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Trash2, 
  Play, 
  X, 
  Plus, 
  Lock, 
  Unlock, 
  Loader2 
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

const testimonials = [
    { quote: "Our CPA dropped by 40% after switching to their AI creatives. Insane.", author: "Founder, DTC Brand" },
    { quote: "Finally, an agency that understands performance over vanity metrics.", author: "CMO, SaaS Startup" },
];

export default function Proof() {
    const [items, setItems] = useState<any[]>([]);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [activeLightbox, setActiveLightbox] = useState<any | null>(null);
    
    // Password Protection State
    const [adminPassword, setAdminPassword] = useState("");
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    
    // Upload form state
    const [uploadTitle, setUploadTitle] = useState("");
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");

    // Fetch work items
    const fetchItems = async () => {
        try {
            const res = await fetch("/api/work");
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

    const handleAdminToggle = () => {
        if (isAdmin) {
            setIsAdmin(false);
            setAdminPassword("");
        } else {
            setLoginPassword("");
            setLoginError("");
            setIsLoginOpen(true);
        }
    };

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifying(true);
        setLoginError("");

        try {
            const res = await fetch("/api/work/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: loginPassword }),
            });

            if (res.ok) {
                setAdminPassword(loginPassword);
                setIsAdmin(true);
                setIsLoginOpen(false);
            } else {
                setLoginError("Incorrect passcode. Please try again.");
            }
        } catch (err) {
            setLoginError("Connection error. Verification failed.");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const youtubeId = getYoutubeId(youtubeUrl);
        if (!youtubeId) {
            setUploadError("Please enter a valid YouTube or YouTube Shorts URL.");
            return;
        }

        setIsUploading(true);
        setUploadError("");

        try {
            const res = await fetch("/api/work", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-password": adminPassword,
                },
                body: JSON.stringify({
                    title: uploadTitle,
                    url: youtubeUrl,
                }),
            });

            if (res.ok) {
                setUploadTitle("");
                setYoutubeUrl("");
                setIsUploadOpen(false);
                fetchItems();
            } else {
                const errorData = await res.json();
                setUploadError(errorData.error || "Failed to add YouTube video. Please try again.");
            }
        } catch (err) {
            setUploadError("Network error. Action failed.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        
        if (!confirm("Are you sure you want to delete this video? This action is permanent.")) {
            return;
        }

        try {
            const res = await fetch("/api/work", {
                method: "DELETE",
                headers: { 
                    "Content-Type": "application/json",
                    "x-admin-password": adminPassword,
                },
                body: JSON.stringify({ id }),
            });

            if (res.ok) {
                fetchItems();
            } else {
                alert("Failed to delete video.");
            }
        } catch (err) {
            console.error("Delete video failed:", err);
        }
    };

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

                        {/* Admin Action Bar */}
                        <div className="flex items-center gap-3">
                            <button
                                onClick={handleAdminToggle}
                                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-xs uppercase tracking-wider font-cinematic font-bold transition-all cursor-pointer ${
                                    isAdmin
                                        ? "bg-white border-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                                        : "bg-transparent border-white/20 text-white/70 hover:border-white/50"
                                }`}
                            >
                                {isAdmin ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                <span>{isAdmin ? "Admin On" : "Admin Mode"}</span>
                            </button>

                            {isAdmin && (
                                <Button
                                    variant="secondary"
                                    onClick={() => setIsUploadOpen(true)}
                                    className="rounded-full flex items-center gap-2 cursor-pointer text-xs py-2.5 px-6"
                                >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Upload Video</span>
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
                        {items.map((item, idx) => (
                            <motion.div
                                key={item.id || idx}
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                whileHover={{ scale: 1.02 }}
                                className="aspect-[9/16] bg-gradient-to-br from-white/5 to-white/10 rounded-2xl relative overflow-hidden group cursor-pointer border border-white/10"
                                onClick={() => setActiveLightbox(item)}
                            >
                                {/* Video Player Card */}
                                <div className="absolute inset-0 bg-black flex items-center justify-center">
                                    {getYoutubeId(item.url) ? (
                                        <img
                                            src={`https://img.youtube.com/vi/${getYoutubeId(item.url)}/hqdefault.jpg`}
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                                            alt={item.title}
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
                                    <div className="w-14 h-14 rounded-full bg-[#00E5FF]/20 hover:bg-[#00E5FF]/40 backdrop-blur-md flex items-center justify-center border border-[#00E5FF]/30 transition-transform duration-300 group-hover:scale-110">
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

                                {/* Admin Delete Control */}
                                {isAdmin && (
                                    <button
                                        onClick={(e) => handleDelete(item.id, e)}
                                        className="absolute top-4 right-4 z-20 p-2 bg-red-600/90 text-white rounded-full hover:bg-red-700 transition-colors shadow-md border border-red-500/20 cursor-pointer"
                                        title="Delete Video"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                )}
                            </motion.div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {items.length === 0 && (
                        <div className="py-24 text-center border border-white/10 rounded-2xl bg-white/5 backdrop-blur-sm">
                            <Upload className="w-12 h-12 text-white/30 mx-auto mb-4" />
                            <h3 className="text-lg font-cinematic font-bold text-white mb-2">No Videos Available</h3>
                            <p className="text-gray-400 text-sm max-w-md mx-auto">
                                Enable admin mode and upload vertical videos to build your dynamic work showcase.
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
                                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00E5FF] to-[#8B5CF6]" />
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
                            const isShort = activeLightbox.url.includes("shorts") || activeLightbox.url.includes("/shorts/");
                            const isVertical = !ytId || isShort;

                            return (
                                <motion.div
                                    initial={{ scale: 0.95, y: 20 }}
                                    animate={{ scale: 1, y: 0 }}
                                    exit={{ scale: 0.95, y: 20 }}
                                    className={`relative w-full bg-transparent rounded-2xl overflow-hidden flex flex-col items-center transition-all duration-300 ${
                                        isVertical ? "max-w-lg max-h-[85vh]" : "max-w-4xl max-h-[85vh]"
                                    }`}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className={`w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 ${
                                        isVertical ? "aspect-[9/16] max-h-[70vh]" : "aspect-video max-h-[70vh]"
                                    }`}>
                                        {ytId ? (
                                            <iframe
                                                src={`https://www.youtube.com/embed/${ytId}?autoplay=1`}
                                                className="w-full h-full border-0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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
                                        <p className="text-[#00E5FF] text-xs font-semibold uppercase tracking-wider mb-2">
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

            {/* Upload Video Modal */}
            <AnimatePresence>
                {isUploadOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
                        onClick={() => setIsUploadOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#0B0B0F] border border-white/10 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between bg-black text-white">
                                <h3 className="text-xl font-cinematic font-bold flex items-center gap-2">
                                    <Upload className="w-5 h-5 text-[#00E5FF]" />
                                    <span>Add YouTube Ad Video</span>
                                </h3>
                                <button
                                    onClick={() => setIsUploadOpen(false)}
                                    className="p-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition-all cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleUploadSubmit} className="p-8 space-y-6">
                                {/* Title */}
                                <div className="space-y-2">
                                    <label htmlFor="title" className="text-sm font-semibold text-gray-300">
                                        Video Title
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        required
                                        value={uploadTitle}
                                        onChange={(e) => setUploadTitle(e.target.value)}
                                        placeholder="e.g. E-Commerce Fashion Reel Ad"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#00E5FF]/50 text-white transition-colors"
                                    />
                                </div>

                                {/* YouTube URL */}
                                <div className="space-y-2">
                                    <label htmlFor="youtubeUrl" className="text-sm font-semibold text-gray-300">
                                        YouTube Link
                                    </label>
                                    <input
                                        id="youtubeUrl"
                                        type="url"
                                        required
                                        value={youtubeUrl}
                                        onChange={(e) => setYoutubeUrl(e.target.value)}
                                        placeholder="e.g. https://www.youtube.com/watch?v=... or https://youtube.com/shorts/..."
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#00E5FF]/50 text-white transition-colors"
                                    />
                                </div>

                                {/* Error Message */}
                                {uploadError && (
                                    <p className="text-xs font-semibold text-red-400 bg-red-950/20 p-3 rounded-lg border border-red-900/30 animate-pulse">
                                        {uploadError}
                                    </p>
                                )}

                                {/* Submit Action */}
                                <div className="flex gap-4 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsUploadOpen(false)}
                                        disabled={isUploading}
                                        className="flex-1 py-3 border border-white/10 hover:border-white/25 hover:bg-white/5 rounded-xl text-gray-300 font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUploading || !youtubeUrl}
                                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] text-white font-semibold flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 disabled:opacity-50"
                                    >
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin text-white" />
                                                <span>Adding...</span>
                                            </>
                                        ) : (
                                            <span>Add Video</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Admin Passcode Modal */}
            <AnimatePresence>
                {isLoginOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
                        onClick={() => setIsLoginOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#0B0B0F] border border-white/10 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black text-white">
                                <h3 className="text-lg font-cinematic font-bold flex items-center gap-2">
                                    <Lock className="w-4 h-4 text-[#00E5FF]" />
                                    <span>Admin Access</span>
                                </h3>
                                <button
                                    onClick={() => setIsLoginOpen(false)}
                                    className="p-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition-all cursor-pointer"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="admin-pass" className="text-sm font-semibold text-gray-300">
                                        Enter Admin Passcode
                                    </label>
                                    <input
                                        id="admin-pass"
                                        type="password"
                                        required
                                        autoFocus
                                        value={loginPassword}
                                        onChange={(e) => setLoginPassword(e.target.value)}
                                        placeholder="Enter passcode"
                                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#00E5FF]/50 text-white transition-colors"
                                    />
                                </div>

                                {loginError && (
                                    <p className="text-xs font-semibold text-red-400 bg-red-950/20 p-2.5 rounded-lg border border-red-900/30 animate-pulse">
                                        {loginError}
                                    </p>
                                )}

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsLoginOpen(false)}
                                        disabled={isVerifying}
                                        className="flex-1 py-2.5 border border-white/10 hover:border-white/25 hover:bg-white/5 rounded-xl text-gray-300 text-sm font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isVerifying || !loginPassword}
                                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] text-white text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 disabled:opacity-50"
                                    >
                                        {isVerifying ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                                                <span>Verifying...</span>
                                            </>
                                        ) : (
                                            <span>Access</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
