"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  Trash2, 
  Play, 
  X, 
  Plus, 
  Lock, 
  Unlock, 
  Loader2,
  Edit,
  ExternalLink,
  ShieldCheck,
  LogOut,
  Video,
  Film
} from "lucide-react";

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
    
    if (clean.includes("ibb.co/") && !clean.includes("i.ibb.co/")) {
        const code = clean.split("ibb.co/")[1]?.split("/")[0]?.split("?")[0];
        if (code) return `https://i.ibb.co/${code}/image.jpg`;
    }

    if (clean.includes("postimg.cc/") && !clean.includes("i.postimg.cc/")) {
        const code = clean.split("postimg.cc/")[1]?.split("/")[0]?.split("?")[0];
        if (code) return `https://i.postimg.cc/${code}/image.png`;
    }

    if (clean.includes("imgur.com/") && !clean.includes("i.imgur.com/")) {
        const code = clean.split("imgur.com/")[1]?.split("/")[0]?.split("?")[0];
        if (code) return `https://i.imgur.com/${code}.jpg`;
    }

    return clean;
};

export default function AdminPage() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);

    const [items, setItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeLightbox, setActiveLightbox] = useState<any | null>(null);

    // Form state
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [uploadTitle, setUploadTitle] = useState("");
    const [youtubeUrl, setYoutubeUrl] = useState("");
    const [thumbnailUrl, setThumbnailUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState("");
    const [editingItemId, setEditingItemId] = useState<string | null>(null);

    // Check stored password on mount
    useEffect(() => {
        const storedPass = sessionStorage.getItem("previewspot_admin_pass");
        if (storedPass) {
            verifyStoredPassword(storedPass);
        } else {
            setIsLoading(false);
        }
    }, []);

    const verifyStoredPassword = async (pass: string) => {
        setIsVerifying(true);
        try {
            const res = await fetch("/api/work/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: pass }),
            });
            if (res.ok) {
                setAdminPassword(pass);
                setIsAuthenticated(true);
                fetchItems();
            } else {
                sessionStorage.removeItem("previewspot_admin_pass");
            }
        } catch (err) {
            console.error("Auto login failed", err);
        } finally {
            setIsVerifying(false);
            setIsLoading(false);
        }
    };

    const fetchItems = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/work?t=${Date.now()}`);
            if (res.ok) {
                const data = await res.json();
                setItems(data);
            }
        } catch (err) {
            console.error("Failed to fetch work items:", err);
        } finally {
            setIsLoading(false);
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
                sessionStorage.setItem("previewspot_admin_pass", loginPassword);
                setIsAuthenticated(true);
                fetchItems();
            } else {
                setLoginError("Incorrect admin passcode. Please try again.");
            }
        } catch (err) {
            setLoginError("Connection error. Verification failed.");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem("previewspot_admin_pass");
        setAdminPassword("");
        setIsAuthenticated(false);
        setLoginPassword("");
    };

    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!uploadTitle.trim()) {
            setUploadError("Please enter a video title.");
            return;
        }

        if (!youtubeUrl.trim()) {
            setUploadError("Please enter a YouTube or Instagram Reel link.");
            return;
        }

        setIsUploading(true);
        setUploadError("");

        try {
            const formattedThumbnail = formatDirectImageUrl(thumbnailUrl);
            const method = editingItemId ? "PUT" : "POST";
            const body = editingItemId 
                ? JSON.stringify({ id: editingItemId, title: uploadTitle, url: youtubeUrl, thumbnailUrl: formattedThumbnail })
                : JSON.stringify({ title: uploadTitle, url: youtubeUrl, thumbnailUrl: formattedThumbnail });

            const res = await fetch("/api/work", {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "x-admin-password": adminPassword || "1996",
                },
                body,
            });

            if (res.ok) {
                setUploadTitle("");
                setYoutubeUrl("");
                setThumbnailUrl("");
                setEditingItemId(null);
                setIsUploadOpen(false);
                fetchItems();
            } else {
                const errorData = await res.json();
                setUploadError(errorData.error || (editingItemId ? "Failed to update video." : "Failed to add video."));
            }
        } catch (err) {
            setUploadError("Network error. Action failed.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleEdit = (item: any) => {
        setUploadTitle(item.title);
        setYoutubeUrl(item.url);
        setThumbnailUrl(item.thumbnailUrl || "");
        setEditingItemId(item.id);
        setUploadError("");
        setIsUploadOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this video from the showcase? This action is permanent.")) {
            return;
        }

        try {
            const res = await fetch("/api/work", {
                method: "DELETE",
                headers: { 
                    "Content-Type": "application/json",
                    "x-admin-password": adminPassword || "1996",
                },
                body: JSON.stringify({ id }),
            });

            if (res.ok) {
                fetchItems();
            } else {
                const data = await res.json().catch(() => ({}));
                alert(data.error || "Failed to delete video.");
            }
        } catch (err) {
            console.error("Delete video failed:", err);
            alert("Network error. Action failed.");
        }
    };

    const openAddModal = () => {
        setEditingItemId(null);
        setUploadTitle("");
        setYoutubeUrl("");
        setThumbnailUrl("");
        setUploadError("");
        setIsUploadOpen(true);
    };

    if (isLoading && !isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#0B0B0F] flex items-center justify-center text-white">
                <Loader2 className="w-8 h-8 animate-spin text-[#FF0033]" />
            </div>
        );
    }

    // Login Form Screen
    if (!isAuthenticated) {
        return (
            <main className="min-h-screen bg-[#0B0B0F] text-white flex flex-col justify-center items-center p-6 relative overflow-hidden">
                {/* Subtle Background Glows */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF0033]/15 rounded-full blur-[120px] pointer-events-none" />
                <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-[#FF9900]/10 rounded-full blur-[100px] pointer-events-none" />

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-gradient-to-b from-white/10 to-white/5 border border-white/15 rounded-3xl p-8 shadow-2xl backdrop-blur-xl relative z-10"
                >
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-[#FF0033] to-[#FF9900] p-0.5 flex items-center justify-center shadow-lg shadow-[#FF0033]/30">
                            <div className="w-full h-full bg-[#0B0B0F] rounded-[14px] flex items-center justify-center">
                                <Lock className="w-7 h-7 text-white" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-cinematic font-bold text-white tracking-wide">
                            Previewspot Admin
                        </h1>
                        <p className="text-xs text-gray-400 mt-2">
                            Enter your admin passcode to manage &quot;The Work&quot; video showcase
                        </p>
                    </div>

                    <form onSubmit={handleLoginSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="passcode" className="block text-xs font-semibold uppercase tracking-wider text-gray-300 mb-2">
                                Admin Passcode
                            </label>
                            <input
                                id="passcode"
                                type="password"
                                required
                                autoFocus
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                placeholder="Enter admin passcode"
                                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#FF0033] text-white placeholder-gray-500 transition-colors text-sm"
                            />
                        </div>

                        {loginError && (
                            <div className="text-xs font-semibold text-red-400 bg-red-950/40 p-3.5 rounded-xl border border-red-800/40 animate-pulse">
                                {loginError}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isVerifying || !loginPassword}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#FF0033] via-[#FF3355] to-[#FF9900] text-white font-bold text-sm tracking-wide uppercase transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_20px_rgba(255,0,51,0.4)] disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                        >
                            {isVerifying ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span>Verifying...</span>
                                </>
                            ) : (
                                <>
                                    <Unlock className="w-4 h-4" />
                                    <span>Access Portal</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-white/10 pt-4">
                        <a 
                            href="/" 
                            className="text-xs text-gray-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
                        >
                            <span>Return to previewspotfilms.com</span>
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                </motion.div>
            </main>
        );
    }

    // Authenticated Admin Dashboard
    return (
        <main className="min-h-screen bg-[#0B0B0F] text-white pt-24 pb-20 relative">
            {/* Top Navigation Bar */}
            <div className="border-b border-white/10 bg-[#0B0B0F]/90 backdrop-blur-md fixed top-0 inset-x-0 z-40 py-4 px-6 md:px-12 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <a href="/" className="flex items-center gap-2 group">
                        <img src="/logo.png" alt="Previewspot Logo" className="h-8 w-auto object-contain" />
                    </a>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#FF0033]/20 border border-[#FF0033]/40 text-[#FF3355] flex items-center gap-1.5">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Admin Portal</span>
                    </span>
                </div>

                <div className="flex items-center gap-4">
                    <a
                        href="/"
                        target="_blank"
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
                    >
                        <span>View Live Site</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                        onClick={handleLogout}
                        className="text-xs px-4 py-2 rounded-full border border-white/15 hover:bg-white/10 text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Logout</span>
                    </button>
                </div>
            </div>

            {/* Admin Header & Main Content */}
            <div className="container mx-auto px-6 md:px-12 mt-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/10 mb-10">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-cinematic font-bold text-white flex items-center gap-3">
                            <Film className="w-8 h-8 text-[#FF0033]" />
                            <span>The Work <span className="text-gradient">Manager</span></span>
                        </h1>
                        <p className="text-sm text-gray-400 mt-2">
                            Add, update, or remove videos displayed in &quot;The Work&quot; showcase section on the main website.
                        </p>
                    </div>

                    <button
                        onClick={openAddModal}
                        className="px-6 py-3 rounded-full bg-gradient-to-r from-[#FF0033] via-[#FF3355] to-[#FF9900] text-white font-bold text-xs tracking-wider uppercase transition-all duration-300 hover:opacity-90 hover:shadow-[0_0_20px_rgba(255,0,51,0.5)] flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Plus className="w-4 h-4" />
                        <span>Add New Video</span>
                    </button>
                </div>

                {/* Videos Showcase Grid */}
                {isLoading ? (
                    <div className="py-24 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-[#FF0033] mx-auto mb-3" />
                        <p className="text-xs text-gray-400">Loading videos from database...</p>
                    </div>
                ) : items.length === 0 ? (
                    <div className="py-20 text-center border border-white/10 rounded-3xl bg-white/5 backdrop-blur-sm max-w-2xl mx-auto">
                        <Video className="w-12 h-12 text-white/30 mx-auto mb-4" />
                        <h3 className="text-xl font-cinematic font-bold text-white mb-2">No Videos Found</h3>
                        <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                            Your showcase is currently empty. Click the button below to add your first video creative.
                        </p>
                        <button
                            onClick={openAddModal}
                            className="px-6 py-2.5 rounded-full bg-white text-black font-bold text-xs uppercase tracking-wider hover:bg-gray-200 transition-colors inline-flex items-center gap-2 cursor-pointer"
                        >
                            <Plus className="w-4 h-4" />
                            <span>Add First Video</span>
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="bg-gradient-to-b from-white/10 to-white/5 border border-white/10 rounded-2xl overflow-hidden group relative flex flex-col justify-between"
                            >
                                {/* Media Card Container */}
                                <div 
                                    className="aspect-video bg-black relative cursor-pointer overflow-hidden"
                                    onClick={() => setActiveLightbox(item)}
                                >
                                    {item.thumbnailUrl ? (
                                        <img
                                            src={formatDirectImageUrl(item.thumbnailUrl)}
                                            className="w-full h-full object-cover opacity-75 group-hover:opacity-95 transition-opacity duration-300"
                                            alt={item.title}
                                        />
                                    ) : getYoutubeId(item.url) ? (
                                        <img
                                            src={`https://img.youtube.com/vi/${getYoutubeId(item.url)}/hqdefault.jpg`}
                                            className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300"
                                            alt={item.title}
                                        />
                                    ) : getInstagramId(item.url) ? (
                                        <iframe
                                            src={`https://www.instagram.com/p/${getInstagramId(item.url)}/embed/`}
                                            className="w-full h-full border-0 pointer-events-none opacity-80"
                                            scrolling="no"
                                        />
                                    ) : (
                                        <video
                                            src={item.url}
                                            className="w-full h-full object-cover opacity-70"
                                            muted
                                        />
                                    )}

                                    {/* Play preview icon */}
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <div className="w-12 h-12 rounded-full bg-[#FF0033]/40 backdrop-blur-md flex items-center justify-center border border-[#FF0033]/50">
                                            <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                                        </div>
                                    </div>

                                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-[10px] uppercase font-semibold text-gray-300 px-2.5 py-1 rounded-md border border-white/10">
                                        {getYoutubeId(item.url) ? "YouTube" : getInstagramId(item.url) ? "Instagram Reel" : "Direct Video"}
                                    </div>
                                </div>

                                {/* Content Details */}
                                <div className="p-5 flex-1 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-white text-base font-cinematic font-bold line-clamp-2 mb-1">
                                            {item.title}
                                        </h3>
                                        <p className="text-[11px] text-gray-400 truncate mb-4">
                                            {item.url}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                        <span className="text-[11px] text-gray-500">{item.date}</span>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="px-3 py-1.5 bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 hover:text-white rounded-lg text-xs font-semibold border border-blue-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                                <span>Edit</span>
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600/40 text-red-400 hover:text-white rounded-lg text-xs font-semibold border border-red-500/30 transition-colors flex items-center gap-1.5 cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                                <span>Delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal for Add / Edit Video */}
            <AnimatePresence>
                {isUploadOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6"
                        onClick={() => setIsUploadOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-[#0B0B0F] border border-white/15 rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Modal Header */}
                            <div className="px-8 py-6 border-b border-white/10 flex items-center justify-between bg-black text-white">
                                <h3 className="text-xl font-cinematic font-bold flex items-center gap-2">
                                    <Upload className="w-5 h-5 text-[#FF0033]" />
                                    <span>{editingItemId ? "Edit Video Creative" : "Add New Video Creative"}</span>
                                </h3>
                                <button
                                    onClick={() => setIsUploadOpen(false)}
                                    className="p-1.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white rounded-lg transition-all cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Form */}
                            <form onSubmit={handleUploadSubmit} className="p-8 space-y-6">
                                {/* Title */}
                                <div className="space-y-2">
                                    <label htmlFor="admin-title" className="text-xs uppercase font-semibold text-gray-300 tracking-wider">
                                        Video Title
                                    </label>
                                    <input
                                        id="admin-title"
                                        type="text"
                                        required
                                        value={uploadTitle}
                                        onChange={(e) => setUploadTitle(e.target.value)}
                                        placeholder="e.g. Premium Brand Instagram Reel Creative"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#FF0033] text-white text-sm transition-colors"
                                    />
                                </div>

                                {/* Link */}
                                <div className="space-y-2">
                                    <label htmlFor="admin-url" className="text-xs uppercase font-semibold text-gray-300 tracking-wider">
                                        Video Link (YouTube or Instagram Reel)
                                    </label>
                                    <input
                                        id="admin-url"
                                        type="text"
                                        required
                                        value={youtubeUrl}
                                        onChange={(e) => setYoutubeUrl(e.target.value)}
                                        placeholder="e.g. https://www.instagram.com/reel/... or https://youtube.com/watch?v=..."
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#FF0033] text-white text-sm transition-colors"
                                    />
                                    <p className="text-[11px] text-gray-400">
                                        Paste any public YouTube Video/Short link or Instagram Reel URL.
                                    </p>
                                </div>

                                {/* Thumbnail */}
                                <div className="space-y-2">
                                    <label htmlFor="admin-thumbnail" className="text-xs uppercase font-semibold text-gray-300 tracking-wider flex items-center justify-between">
                                        <span>Thumbnail Image Link</span>
                                        <span className="text-[10px] text-gray-400 font-normal lowercase">(optional)</span>
                                    </label>
                                    <input
                                        id="admin-thumbnail"
                                        type="text"
                                        value={thumbnailUrl}
                                        onChange={(e) => setThumbnailUrl(e.target.value)}
                                        placeholder="e.g. https://i.ibb.co/... or image URL"
                                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:outline-none focus:border-[#FF0033] text-white text-sm transition-colors"
                                    />
                                    <p className="text-[11px] text-gray-400">
                                        Custom preview image for card. If left empty, default YouTube or Instagram thumbnail is used.
                                    </p>
                                </div>

                                {uploadError && (
                                    <div className="text-xs font-semibold text-red-400 bg-red-950/40 p-3 rounded-xl border border-red-800/40 animate-pulse">
                                        {uploadError}
                                    </div>
                                )}

                                <div className="flex gap-4 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setIsUploadOpen(false)}
                                        disabled={isUploading}
                                        className="flex-1 py-3 border border-white/10 hover:border-white/25 hover:bg-white/5 rounded-xl text-gray-300 font-semibold transition-colors disabled:opacity-50 cursor-pointer text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUploading || !uploadTitle || !youtubeUrl}
                                        className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#FF0033] via-[#FF3355] to-[#FF9900] text-white font-bold text-sm tracking-wider uppercase flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 disabled:opacity-50"
                                    >
                                        {isUploading ? (
                                            <>
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                <span>{editingItemId ? "Saving..." : "Adding..."}</span>
                                            </>
                                        ) : (
                                            <span>{editingItemId ? "Save Changes" : "Publish Video"}</span>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Video Lightbox Player Modal inside Admin */}
            <AnimatePresence>
                {activeLightbox && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-6"
                        onClick={() => setActiveLightbox(null)}
                    >
                        <button
                            onClick={() => setActiveLightbox(null)}
                            className="absolute top-6 right-6 p-3 bg-white/5 hover:bg-white/10 rounded-full text-white border border-white/10 hover:border-white/20 transition-all z-50 cursor-pointer"
                        >
                            <X className="w-6 h-6" />
                        </button>

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
        </main>
    );
}
