"use client";

import { motion } from "framer-motion";
import { HelpCircle, ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQItem {
    question: string;
    answer: string;
}

const faqs: FAQItem[] = [
    {
        question: "What is Previewspot and how does it work?",
        answer: "Previewspot is an AI-powered performance creative agency. We produce high-converting video ads, UGC-style reels, and performance scripts for DTC and SaaS brands by combining data-backed hooks with generative AI visual synthesis."
    },
    {
        question: "How fast can I expect to receive my ad creatives?",
        answer: "We deliver initial creative concepts and renders in a fraction of the time required by traditional video agencies—often within 48 to 72 hours of receiving your brand brief."
    },
    {
        question: "What ad platforms are Previewspot video ads formatted for?",
        answer: "All video creatives are delivered in multiple aspect ratios: 9:16 (Instagram Reels, Meta Ads, TikTok), 1:1 (Square Feed Ads), and 16:9 (YouTube Ads), pre-formatted for direct upload into Meta Ads Manager or Google Ads."
    },
    {
        question: "Why choose AI performance creatives over traditional video agencies?",
        answer: "Traditional video agencies charge exorbitant rates for studios, actors, and production crews while taking weeks to deliver single ads. Previewspot provides agency-level visual quality, unlimited revisions, and fast hook iterations at startup-friendly pricing."
    },
    {
        question: "Do I own the rights to the created video ads?",
        answer: "Yes, 100%. You receive complete, unencumbered ownership of all final video ad files, scripts, and creative concepts with zero recurring licensing fees or usage limitations."
    },
    {
        question: "How do we get started on our first campaign?",
        answer: "Simply book a free 30-minute strategy call on our site. We'll discuss your target customer, brand USPs, current ad performance, and map out a custom creative strategy for your brand."
    }
];

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section id="faq-section" className="py-32 bg-[#0B0B0F] relative z-10 border-t border-white/5">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-cinematic uppercase tracking-widest text-[#FF0033] mb-4"
                    >
                        <HelpCircle className="w-4 h-4" />
                        <span>Got Questions?</span>
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-6xl font-cinematic font-bold text-white mb-6"
                    >
                        Frequently Asked <span className="text-gradient">Questions</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 max-w-2xl mx-auto text-lg"
                    >
                        Everything you need to know about our AI creative engine, production process, and ownership.
                    </motion.p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => {
                        const isOpen = openIndex === idx;
                        return (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.05 }}
                                className="glassmorphism rounded-2xl border border-white/10 overflow-hidden transition-all duration-300 hover:border-white/20"
                            >
                                <button
                                    onClick={() => toggleFAQ(idx)}
                                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-lg md:text-xl text-white/90 hover:text-white transition-colors cursor-pointer"
                                    aria-expanded={isOpen}
                                >
                                    <span>{faq.question}</span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-[#FF0033] transition-transform duration-300 flex-shrink-0 ${
                                            isOpen ? "rotate-180" : ""
                                        }`}
                                    />
                                </button>
                                {isOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="px-6 pb-6 text-gray-400 leading-relaxed text-base"
                                    >
                                        <p>{faq.answer}</p>
                                    </motion.div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
