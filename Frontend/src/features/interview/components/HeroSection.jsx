import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Sparkles, ArrowRight, Zap, Layers } from "lucide-react";

const TARGET_COMPANIES = [
  { name: "Google", symbol: "✦" },
  { name: "Meta", symbol: "∞" },
  { name: "Amazon", symbol: "▲" },
  { name: "Microsoft", symbol: "❖" },
  { name: "Netflix", symbol: "N" },
  { name: "Apple", symbol: "" },
  { name: "React 19", symbol: "⚛" },
  { name: "TypeScript", symbol: "TS" },
  { name: "Node.js", symbol: "⬡" },
  { name: "Python", symbol: "🐍" },
  { name: "MongoDB", symbol: "🍃" },
  { name: "Docker", symbol: "🐳" },
];

const HeroSection = ({ onScrollToStudio, onLoadDemoProfile }) => {
  const containerRef = useRef(null);
  const badgeRef = useRef(null);
  const headlineRef = useRef(null);
  const ctaRef = useRef(null);
  const emblemRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(badgeRef.current, {
        y: -15,
        opacity: 0,
        duration: 0.6,
      })
      .from(
        headlineRef.current,
        {
          y: 20,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.3"
      )
      .from(
        ctaRef.current,
        {
          y: 15,
          opacity: 0,
          scale: 0.96,
          duration: 0.7,
        },
        "-=0.4"
      )
      .from(
        emblemRef.current,
        {
          y: 25,
          opacity: 0,
          duration: 0.8,
        },
        "-=0.5"
      );

      // Subtle vertical floating on the emblem
      gsap.to(emblemRef.current, {
        y: -6,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative pt-12 pb-24 px-6 overflow-hidden bg-[#08080a]">
      
      {/* Symmetrical Laser Vector Lines - Red, Black & White (No Heavy Fuzzy Glow) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden z-0">
        <svg
          viewBox="0 0 1200 700"
          className="w-full h-full max-w-[1400px] object-cover opacity-80"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <linearGradient id="laserLeft" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.04" />
              <stop offset="60%" stopColor="#ef4444" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
            </linearGradient>

            <linearGradient id="laserRight" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.04" />
              <stop offset="60%" stopColor="#ef4444" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.4" />
            </linearGradient>

            <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#dc2626" stopOpacity="0.07" />
              <stop offset="60%" stopColor="#08080a" stopOpacity="0.02" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Central Subtle Ambient Vignette */}
          <circle cx="600" cy="430" r="280" fill="url(#centerGlow)" />

          {/* Left Converging Laser Line */}
          <path
            d="M 60,240 C 340,240 440,310 490,420 C 510,460 518,520 520,700"
            fill="none"
            stroke="url(#laserLeft)"
            strokeWidth="1.5"
          />

          {/* Right Converging Laser Line */}
          <path
            d="M 1140,240 C 860,240 760,310 710,420 C 690,460 682,520 680,700"
            fill="none"
            stroke="url(#laserRight)"
            strokeWidth="1.5"
          />

          {/* Fine Crisp Guide Lines */}
          <path
            d="M 120,220 C 370,220 460,290 500,420"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
          />
          <path
            d="M 1080,220 C 830,220 740,290 700,420"
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth="1"
          />
        </svg>
      </div>

      {/* Central Vertical Falling Drops Conduit */}
      <div className="center-conduit z-0">
        <div className="drop-streak" style={{ left: "25%", animationDelay: "0.2s", animationDuration: "2.8s" }} />
        <div className="drop-streak" style={{ left: "45%", animationDelay: "1.2s", animationDuration: "3.2s" }} />
        <div className="drop-streak" style={{ left: "65%", animationDelay: "0.8s", animationDuration: "2.5s" }} />
        <div className="drop-streak" style={{ left: "80%", animationDelay: "1.9s", animationDuration: "3.5s" }} />
      </div>

      {/* Main Hero Content */}
      <div className="max-w-5xl mx-auto text-center flex flex-col items-center relative z-10 pt-4">
        
        {/* Top Pill Badge */}
        <div
          ref={badgeRef}
          className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-zinc-300 text-xs font-medium shadow-sm"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
          <span>Technical Interview & Career Preparation Platform</span>
        </div>

        {/* Headline */}
        <div ref={headlineRef} className="max-w-3xl mx-auto mb-10">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.08] mb-4 text-balance">
            Interview intelligence <br />
            powered by <span className="text-red-500">PrepAI Engine.</span>
          </h1>

          <p className="text-base sm:text-lg text-zinc-400 font-normal tracking-wide text-pretty">
            Grounded in actual job descriptions & resumes. Built for engineering careers.
          </p>
        </div>

        {/* Action Buttons - Clean Red & Dark Glass */}
        <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4 mb-14 relative z-20">
          <button
            onClick={onScrollToStudio}
            aria-label="Enter Assessment Studio"
            className="px-7 py-3 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm border border-red-500/30 shadow-md transition-all active:scale-[0.98]"
          >
            <span>Enter Assessment Studio</span>
          </button>

          <button
            onClick={onLoadDemoProfile}
            aria-label="Load Sample Candidate Profile"
            className="btn-dark-glass"
          >
            <Zap size={14} className="text-red-400" />
            <span>Load Sample Profile</span>
          </button>
        </div>

        {/* Central Floating Emblem */}
        <div ref={emblemRef} className="mt-2 mb-20 relative flex flex-col items-center">
          <div
            className="w-16 h-16 rounded-2xl bg-[#0e0e13] border border-zinc-800 hover:border-red-600/60 transition-all flex items-center justify-center p-2.5 cursor-pointer shadow-lg active:scale-95"
            onClick={onScrollToStudio}
            title="Assessment Studio Nexus"
          >
            <img src="/logo.png" alt="prepAi" className="w-full h-auto object-contain" />
          </div>
          
          <div className="text-[11px] font-medium tracking-wider text-zinc-500 mt-3">
            ASSESSMENT CORE
          </div>
        </div>

        {/* Bottom Technology & Target Company Ticker */}
        <div className="w-full max-w-4xl mx-auto pt-8 border-t border-white/[0.06] relative z-10">
          <p className="text-[11px] font-mono uppercase tracking-widest text-slate-500 mb-6">
            Calibrated for Engineering Roles & Top Tech Stacks
          </p>

          <div className="marquee-container">
            <div className="marquee-content">
              {TARGET_COMPANIES.concat(TARGET_COMPANIES).map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors cursor-default whitespace-nowrap text-sm font-medium"
                >
                  <span className="text-white/60 font-mono text-base">{item.symbol}</span>
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default HeroSection;
