import Hero from "@/components/sections/Hero";
import Problem from "@/components/sections/Problem";
import Shift from "@/components/sections/Shift";
import Solution from "@/components/sections/Solution";
import Process from "@/components/sections/Process";
import Proof from "@/components/sections/Proof";
import Pricing from "@/components/sections/Pricing";
import Booking from "@/components/sections/Booking";

export default function Home() {
  return (
    <main className="bg-[#0B0B0F] min-h-screen text-white overflow-hidden selection:bg-[#00E5FF]/30">
      <Hero />
      <Problem />
      <Shift />
      <Solution />
      <Process />
      <Proof />
      <Pricing />
      <Booking />

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 bg-black text-center text-sm text-gray-500 font-cinematic uppercase tracking-widest">
        <p>© {new Date().getFullYear()} Previewspot. All rights reserved.</p>
      </footer>
    </main>
  );
}
