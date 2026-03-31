"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });

      tl.from(headingRef.current, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
      })
      .from(textRef.current, {
        y: 30,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
      }, "-=0.8")
      .from(".stat-item", {
        x: -20,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power4.out"
      }, "-=0.6");
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative bg-[#FAFAFA] py-20 md:py-32 px-6 md:px-12 z-20">
      <div className="mx-auto max-w-[80rem] flex flex-col lg:flex-row gap-16 lg:gap-24 lg:items-center">
        
        {/* Left Column: Text Content */}
        <div className="lg:w-3/5">
          <div className="flex items-center gap-3 mb-8">
            <span className="block w-5 h-px bg-[#81D8D0]" />
            <span className="font-space text-xs font-bold uppercase tracking-[0.2em] text-[#81D8D0]">
              Introduction
            </span>
          </div>
          
          <h2 ref={headingRef} className="font-space text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#111111] mb-8 leading-[1.05]">
            Engineer by craft,<br/>
            <span className="text-[#81D8D0]">thinker by nature.</span>
          </h2>
          
          <p ref={textRef} className="text-xl md:text-2xl text-[#555555] leading-relaxed max-w-2xl font-medium">
            I'm Hassan — an AI/ML Engineer specialising in deep learning, NLP, and intelligent systems. I love turning complex research into products that actually ship and change the way people interact with technology.
          </p>
        </div>

        {/* Right Column: Stats Bento */}
        <div ref={statsRef} className="lg:w-2/5 flex flex-col sm:flex-row lg:flex-col gap-8 md:gap-12 w-full">
          <div className="stat-item flex flex-col border-l-4 border-[#E5E5E5] pl-6 transition-colors duration-500 hover:border-[#81D8D0]">
            <span className="font-space font-black text-6xl text-[#111111] tracking-tighter">
              15<span className="text-[#81D8D0]">+</span>
            </span>
            <span className="font-space text-sm font-bold uppercase tracking-[0.2em] text-[#888888] mt-2">
              Projects Shipped
            </span>
          </div>

          <div className="stat-item flex flex-col border-l-4 border-[#E5E5E5] pl-6 transition-colors duration-500 hover:border-[#81D8D0]">
            <span className="font-space font-black text-6xl text-[#111111] tracking-tighter">
              100<span className="text-[#81D8D0]">%</span>
            </span>
            <span className="font-space text-sm font-bold uppercase tracking-[0.2em] text-[#888888] mt-2">
              Satisfaction Rate
            </span>
          </div>

          <div className="stat-item flex flex-col border-l-4 border-[#E5E5E5] pl-6 transition-colors duration-500 hover:border-[#81D8D0]">
            <span className="font-space font-black text-6xl text-[#111111] tracking-tighter">
              3<span className="text-[#81D8D0]">+</span>
            </span>
            <span className="font-space text-sm font-bold uppercase tracking-[0.2em] text-[#888888] mt-2">
              Years in Research
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
