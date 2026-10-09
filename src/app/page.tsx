import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import Shift from "@/components/sections/Shift";
import Solution from "@/components/sections/Solution";
import Process from "@/components/sections/Process";
import Proof from "@/components/sections/Proof";
import Pricing from "@/components/sections/Pricing";
import FAQ from "@/components/sections/FAQ";
import Booking from "@/components/sections/Booking";

export default function Home() {
  return (
    <main className="bg-[#0B0B0F] min-h-screen text-white overflow-hidden selection:bg-[#FF0033]/30">
      <Hero />
      <Problem />
      <Shift />
      <Solution />
      <Process />
      <Proof />
      <Pricing />
      <FAQ />
      <Booking />

      {/* Footer */}
      <footer className="py-12 border-t border-white/10 bg-black text-center text-sm text-gray-400 font-cinematic uppercase tracking-widest">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
          <p>© {new Date().getFullYear()} Previewspot. All rights reserved.</p>
          <div className="flex items-center gap-6 text-xs text-gray-500">
            <a href="/llms.txt" target="_blank" className="hover:text-white transition-colors">
              LLMs.txt
            </a>
            <span>•</span>
            <a href="/llms-full.txt" target="_blank" className="hover:text-white transition-colors">
              AI Context
            </a>
            <span>•</span>
            <a href="/sitemap.xml" target="_blank" className="hover:text-white transition-colors">
              Sitemap
            </a>
            <span>•</span>
            <a href="#faq-section" className="hover:text-white transition-colors">
              FAQ
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
