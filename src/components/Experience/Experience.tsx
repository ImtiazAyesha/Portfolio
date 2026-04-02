"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const experienceData = [
  {
    isIntro: true,
    theme: { bg: "bg-[#FAFAFA]", text: "text-[#111111]", accent: "text-[#81D8D0]" }
  },
  {
    role: "Senior AI Engineer",
    company: "Evren Intelligence",
    date: "2024 — Present",
    description:
      "Architecting large scale training grids for generative models and serving them with sub-100ms latency globally.",
    tag: "Infrastructure · LLMs",
    theme: { bg: "bg-[#111111]", text: "text-[#FAFAFA]", accent: "text-[#81D8D0]", tagStyle: "bg-[#81D8D0]/10 border-[#81D8D0]/30 text-[#81D8D0]" }
  },
  {
    role: "ML Researcher",
    company: "Neural Labs",
    date: "2022 — 2024",
    description:
      "Published cutting edge research on transformer optimization and distilled models for consumer edges.",
    tag: "Research · Distillation",
    theme: { bg: "bg-[#FAFAFA]", text: "text-[#111111]", accent: "text-[#81D8D0]", tagStyle: "bg-[#81D8D0]/10 border-[#81D8D0]/30 text-[#81D8D0]" }
  },
  {
    role: "Frontend Developer",
    company: "Studio Web",
    date: "2020 — 2022",
    description:
      "Built award-winning WebGL interfaces and GSAP-driven marketing sites for enterprise clients.",
    tag: "WebGL · GSAP",
    theme: { bg: "bg-[#81D8D0]", text: "text-[#111111]", accent: "text-[#111111]", tagStyle: "bg-[#111111]/10 border-[#111111]/20 text-[#111111]" }
  },
];

export default function Experience() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Execute purely on desktop limits, reserving performant normal-scroll for touch bounds
    if (window.innerWidth < 768) return;

    let ctx = gsap.context(() => {
      const panels = gsap.utils.toArray(".portal-layer");
      
      // Native GSAP Pinning Engine replaces pure CSS sticky avoiding any global overflow layout destruction
      const tl = gsap.timeline({
         scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            // Extend scrolling by the exact volume of portals (3 * 100vh)
            end: `+=${(panels.length - 1) * 100}%`,
            scrub: 1.2,
            pin: true,
            anticipatePin: 1
         }
      });

      panels.forEach((panel: any, i) => {
         if (i === 0) return; // Core introductory panel needs no portal induction

         const currentContent = panel.querySelector(".portal-content");
         const prevContent = (panels[i - 1] as HTMLElement).querySelector(".portal-content");

         // Build a totally synchronized frame map mapping 3 visual operations into a single continuous step
         tl.addLabel(`plunge-${i}`)
           .fromTo(panel, 
               { clipPath: "circle(0% at 50% 50%)" }, 
               { clipPath: "circle(150% at 50% 50%)", ease: "none", duration: 1 }, 
               `plunge-${i}`
           )
           .fromTo(currentContent, 
               { scale: 1.25, filter: "blur(5px)" }, 
               { scale: 1, filter: "blur(0px)", ease: "power2.out", duration: 1 }, 
               `plunge-${i}`
           )
           .to(prevContent, 
               { scale: 0.8, filter: "blur(8px)", opacity: 0, ease: "power2.in", duration: 1 }, 
               `plunge-${i}`
           );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="experience" className="relative z-20 bg-[#FAFAFA] clip-path-fix w-full">
      
      {/* MOBILE FALLBACK (Classic Layout - Preserves performance natively on touch) */}
      <div className="md:hidden flex flex-col pt-24 pb-32 px-6 gap-6 max-w-sm mx-auto">
         <div className="mb-8">
            <span className="font-space text-xs font-bold uppercase tracking-[0.2em] text-[#81D8D0] block mb-2">Career Path</span>
            <h2 className="font-space text-4xl font-black uppercase tracking-tighter text-[#111111]">Experience.</h2>
         </div>
         {experienceData.slice(1).map((exp, i) => (
            <div key={i} className="flex flex-col bg-white border border-[#E5E5E5] rounded-[2rem] p-8 shadow-sm">
               <span className="font-space text-[10px] font-bold uppercase tracking-[0.2em] text-[#81D8D0] mb-6 inline-flex px-3 py-1 bg-[#81D8D0]/10 rounded-full w-fit">
                 {exp.tag}
               </span>
               <h3 className="font-space text-3xl font-black uppercase tracking-tight text-[#111111] leading-[0.9] mb-4">
                 {exp.role}
               </h3>
               <span className="font-space font-bold text-[#A0A0A0] mb-6 text-sm">{exp.company} // {exp.date}</span>
               <p className="text-[#666666] leading-relaxed text-sm">
                 {exp.description}
               </p>
            </div>
         ))}
      </div>

      {/* DESKTOP 3D PORTAL PLUNGE (GSAP Pinned timeline bounds) */}
      <div 
         ref={sectionRef}
         className="hidden md:block relative w-full h-screen overflow-hidden bg-[#FAFAFA]"
      >
         {experienceData.map((exp: any, i: number) => (
            <div 
               key={i} 
               className={`portal-layer absolute inset-0 w-full h-full flex items-center justify-center ${exp.theme.bg}`}
               style={{ zIndex: i + 1, clipPath: i === 0 ? "none" : "circle(0% at 50% 50%)" }}
            >
                <div className="portal-content relative w-full h-full flex flex-col items-center justify-center will-change-transform">
                   {exp.isIntro ? (
                      /* INITIATION LAYER 0 */
                      <div className="max-w-[100rem] w-full px-12 xl:px-24 flex flex-col justify-center">
                         <div className="flex items-center gap-3 mb-6">
                           <span className="block w-16 h-px bg-[#81D8D0]" />
                           <span className="font-space text-lg font-bold uppercase tracking-[0.2em] text-[#81D8D0]">Career Path</span>
                         </div>
                         <h2 className="font-space text-[12vw] font-black uppercase tracking-tighter leading-[0.82] mb-12 text-[#111111]">
                           The<br/>Experience.
                         </h2>
                         <p className="max-w-3xl text-[#555555] text-3xl font-medium leading-relaxed">
                           A chronological journey tracking the intersection of artificial intelligence and elite frontend engineering. Keep natively scrolling to plunge deeply.
                         </p>
                      </div>
                   ) : (
                      /* JOB DATA LAYERS 1-3 */
                      <div className="w-full h-full max-w-[120rem] mx-auto px-12 xl:px-24 flex flex-col justify-center">
                         {/* Gargantuan Dimensional Watermark Text */}
                         <span className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-space font-black text-[clamp(8rem,18vw,24rem)] whitespace-nowrap opacity-[0.03] select-none pointer-events-none tracking-tighter ${exp.theme.text} mix-blend-normal`}>
                           {exp.company}
                         </span>

                         <div className="relative z-10 w-full flex items-center justify-between gap-12 mt-16 lg:mt-32">
                            <div className="flex flex-col gap-8 lg:gap-12 w-1/2 max-w-4xl">
                               <span className={`inline-flex px-6 py-2 rounded-full border ${exp.theme.tagStyle} font-space text-sm font-bold uppercase tracking-widest backdrop-blur-md w-fit`}>
                                  {exp.tag}
                               </span>
                               <h3 className={`font-space text-6xl xl:text-[8rem] font-black uppercase ${exp.theme.text} leading-[0.85] tracking-tighter mix-blend-normal`}>
                                  {exp.role}
                               </h3>
                            </div>
                            <div className="flex flex-col w-1/3 min-w-[300px] gap-6 max-w-lg">
                               <span className={`font-space text-2xl lg:text-3xl font-bold ${exp.theme.accent} uppercase tracking-widest opacity-90`}>
                                  {exp.date}
                               </span>
                               <span className={`font-space text-lg font-bold ${exp.theme.text} opacity-40 uppercase tracking-widest`}>
                                  {exp.company} //
                               </span>
                               <p className={`text-xl font-medium leading-relaxed ${exp.theme.text} opacity-80 mt-2`}>
                                  {exp.description}
                               </p>
                            </div>
                         </div>
                      </div>
                   )}
                </div>
            </div>
         ))}
      </div>
    </section>
  );
}
