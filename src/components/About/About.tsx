"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const watermarkRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initialize 3D perspective to enable actual Z-depth foreshortening
      gsap.set(sectionRef.current, { perspective: 1200 });

      // ── ENTRANCE "FLY-IN" SCRUB ────────────────────────────────
      gsap.set(watermarkRef.current, { opacity: 0, scale: 0.85, z: -400 });
      gsap.set(introRef.current, { opacity: 0, filter: "blur(12px)", z: -300, y: 50 });
      gsap.set(headingRef.current, { opacity: 0, filter: "blur(16px)", z: -150, y: 80 });
      gsap.set(textRef.current, { opacity: 0, filter: "blur(12px)", z: -50, y: 40 });
      gsap.set(".stat-item", { opacity: 0, filter: "blur(20px)", z: 150, y: 120 });
      if (lineRef.current) gsap.set(lineRef.current, { scaleY: 0, transformOrigin: "top center" });

      const enterTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          end: "center center",
          scrub: 1.5, 
        }
      });

      // Background watermark surfaces from deep Z
      enterTl.to(watermarkRef.current, { opacity: 0.04, scale: 1, z: 0, duration: 1 }, 0);

      // Spine Line drawing down
      if (lineRef.current) {
         enterTl.to(lineRef.current, { scaleY: 1, duration: 1 }, 0);
      }

      // Left column pieces come into focus at different rates
      enterTl.to(introRef.current, { opacity: 1, filter: "blur(0px)", z: 0, y: 0, duration: 0.8 }, 0.1);
      enterTl.to(headingRef.current, { opacity: 1, filter: "blur(0px)", z: 0, y: 0, duration: 0.9 }, 0.15);
      enterTl.to(textRef.current, { opacity: 1, filter: "blur(0px)", z: 0, y: 0, duration: 0.8 }, 0.25);

      // Foreground stats slam into focus
      enterTl.to(".stat-item", {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        z: 0,
        duration: 0.9,
        stagger: 0.15
      }, 0.3);

      // ── CONTINUOUS PARALLAX (Y- DRIFT) ───────────────────────────
      const driftTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true, 
        }
      });
      
      driftTl.to(watermarkRef.current, { yPercent: -10 }, 0); 
      driftTl.to(introRef.current, { yPercent: 4 }, 0);
      driftTl.to(headingRef.current, { yPercent: 8 }, 0);
      driftTl.to(textRef.current, { yPercent: 12 }, 0); 
      driftTl.to(statsRef.current, { yPercent: 20 }, 0); 

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="about" 
      className="relative bg-[#FAFAFA] py-24 md:py-36 px-6 md:px-12 z-20 overflow-hidden"
    >
      {/* ── CINEMATIC TEXTURES ── */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes film-noise {
          0%, 100% { transform: translate(0, 0); }
          10% { transform: translate(-2%, -2%); }
          20% { transform: translate(-4%, 2%); }
          30% { transform: translate(2%, -4%); }
          40% { transform: translate(-2%, 6%); }
          50% { transform: translate(-4%, 2%); }
          60% { transform: translate(6%, 0); }
          70% { transform: translate(0, 6%); }
          80% { transform: translate(2%, 2%); }
          90% { transform: translate(-4%, 4%); }
        }
        .film-grain-overlay {
          pointer-events: none;
          position: absolute;
          inset: -100%;
          width: 300%;
          height: 300%;
          z-index: 50;
          opacity: 0.15;
          mix-blend-mode: multiply;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          animation: film-noise 0.3s infinite steps(2);
        }
        .vignette-overlay {
          pointer-events: none;
          position: absolute;
          inset: 0;
          z-index: 40;
          background: radial-gradient(circle, rgba(0,0,0,0) 40%, rgba(0,0,0,0.06) 100%);
          box-shadow: inset 0 0 100px rgba(0,0,0,0.04);
        }
      `}} />

      <div className="film-grain-overlay" />
      <div className="vignette-overlay" />

      {/* ── GHOST WATERMARK (FAR-PLANE) ── */}
      <div 
        ref={watermarkRef} 
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 overflow-hidden"
      >
        <h2 className="font-space text-[clamp(8rem,18vw,26rem)] font-black text-[#111111] opacity-[0.04] whitespace-nowrap leading-none tracking-tighter mix-blend-multiply">
          ENGINEER
        </h2>
      </div>

      <div className="mx-auto max-w-[85rem] flex flex-col lg:flex-row gap-16 lg:gap-24 lg:items-center relative z-10 w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
        
        {/* ── MAGAZINE SPINE (Left Edge on Desktop) ── */}
        {/* <div ref={introRef} className="hidden lg:flex absolute -left-8 xl:-left-12 top-0 bottom-0 w-16 flex-col items-center justify-start pt-10">
          <div className="font-space text-[10px] font-bold uppercase tracking-[0.4em] text-[#81D8D0] -rotate-90 whitespace-nowrap opacity-80 mt-16">
            01 — Introduction
          </div>
          <div ref={lineRef} className="w-px h-64 bg-gradient-to-b from-[#81D8D0] to-transparent mt-24 opacity-40" />
        </div> */}

        {/* ── LEFT COLUMN: EDITORIAL TEXT ── */}
        <div className="lg:w-7/12 relative pl-0 lg:pl-10">
          
          {/* Mobile Introduction Label (Hidden on Desktop) */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <span className="block w-5 h-px bg-[#81D8D0]" />
            <span className="font-space text-xs font-bold uppercase tracking-[0.2em] text-[#81D8D0]">
              Introduction
            </span>
          </div>
          
          {/* Staggered Heading */}
          <h2 ref={headingRef} className="font-space text-[clamp(3.2rem,5.5vw,5.5rem)] font-black uppercase tracking-tighter text-[#111111] mb-12 leading-[0.95] flex flex-col">
            <span className="block">Engineer by craft,</span>
            <span className="block text-[#81D8D0] lg:ml-16 mt-2">thinker by nature.</span>
          </h2>
          
          {/* Pull-quote Style Paragraph */}
          <p ref={textRef} className="text-[1.15rem] md:text-[1.35rem] text-[#555555] leading-[1.65] max-w-2xl font-medium relative">
            <span className="hidden md:block absolute -left-8 top-1 text-5xl text-[#E5E5E5] font-serif leading-none opacity-60">"</span>
            I'm Hassan — an AI/ML Engineer specialising in deep learning, NLP, and intelligent systems. 
            <br/><br/>
            I love turning complex research into products that actually ship and change the way people interact with technology.
          </p>
        </div>

        {/* ── RIGHT COLUMN: GLASS BENTO STATS ── */}
        <div ref={statsRef} className="lg:w-5/12 flex flex-col sm:flex-row lg:flex-col gap-6 w-full relative z-20">
          
          {/* Stat 1 */}
          <div className="stat-item group relative overflow-hidden rounded-[1.5rem] bg-[#ffffff]/60 border border-[#ffffff] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-500 hover:shadow-[0_8px_40px_rgba(129,216,208,0.15)] hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#81D8D0] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="font-space font-black text-6xl md:text-7xl text-[#111111] tracking-tighter block mb-2 leading-none">
              15<span className="text-[#81D8D0]">+</span>
            </span>
            <span className="font-space text-[12px] font-bold uppercase tracking-[0.2em] text-[#888888]">
              Projects Shipped
            </span>
          </div>

          {/* Stat 2 - Staggered alignment */}
          <div className="stat-item group relative overflow-hidden rounded-[1.5rem] bg-[#ffffff]/60 border border-[#ffffff] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-500 hover:shadow-[0_8px_40px_rgba(129,216,208,0.15)] hover:-translate-y-1 lg:ml-12">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#81D8D0] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="font-space font-black text-6xl md:text-7xl text-[#111111] tracking-tighter block mb-2 leading-none">
              100<span className="text-[#81D8D0]">%</span>
            </span>
            <span className="font-space text-[12px] font-bold uppercase tracking-[0.2em] text-[#888888]">
              Satisfaction Rate
            </span>
          </div>

          {/* Stat 3 */}
          <div className="stat-item group relative overflow-hidden rounded-[1.5rem] bg-[#ffffff]/60 border border-[#ffffff] p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-xl transition-all duration-500 hover:shadow-[0_8px_40px_rgba(129,216,208,0.15)] hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-[#81D8D0] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            <span className="font-space font-black text-6xl md:text-7xl text-[#111111] tracking-tighter block mb-2 leading-none">
              3<span className="text-[#81D8D0]">+</span>
            </span>
            <span className="font-space text-[12px] font-bold uppercase tracking-[0.2em] text-[#888888]">
              Years in Research
            </span>
          </div>

        </div>

      </div>
    </section>
  );
}
