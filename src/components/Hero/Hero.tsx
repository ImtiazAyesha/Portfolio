"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Hero refs
  const heroContentRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLParagraphElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const bgTextRef = useRef<HTMLHeadingElement>(null);
  const subheadlineRef = useRef<HTMLHeadingElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const leftTextRef = useRef<HTMLDivElement>(null);
  const rightTextRef = useRef<HTMLDivElement>(null);
  const leftWatermarkRef = useRef<HTMLDivElement>(null);
  const rightWatermarkRef = useRef<HTMLDivElement>(null);
  const baseLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const validLetters = lettersRef.current.filter(Boolean);
      const introTl = gsap.timeline();

      if (greetingRef.current) gsap.set(greetingRef.current, { yPercent: 100 });
      if (validLetters.length > 0) gsap.set(validLetters, { yPercent: 100, opacity: 0 });
      gsap.set([subheadlineRef.current], { autoAlpha: 0, y: 20 });
      const isMobile = window.innerWidth < 640;
      const baseClip = isMobile
        ? "polygon(50.6% 0%, 100% 0%, 100% 100%, 50.6% 100%)"
        : "polygon(50.6% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 55%, 50.6% 55%)";

      if (baseLayerRef.current) gsap.set(baseLayerRef.current, { autoAlpha: 0, y: 30, clipPath: baseClip, webkitClipPath: baseClip });
      if (overlayRef.current) gsap.set(overlayRef.current, { autoAlpha: 0, y: 30, clipPath: "polygon(0% 0%, 50.6% 0%, 50.6% 100%, 0% 100%)", webkitClipPath: "polygon(0% 0%, 50.6% 0%, 50.6% 100%, 0% 100%)" });

      if (greetingRef.current) {
        introTl.to(greetingRef.current, { yPercent: 0, duration: 1.2, ease: "power4.out" });
      }

      if (validLetters.length > 0) {
        introTl.to(validLetters, {
          yPercent: 0,
          opacity: 1,
          duration: 1.5,
          ease: "power4.out",
          stagger: 0.1,
        }, "-=0.9");
      }

      introTl.to([baseLayerRef.current, overlayRef.current], {
        autoAlpha: 1,
        y: 0,
        duration: 1.5,
        ease: "power4.out",
      }, "-=1.2");

      introTl.to([subheadlineRef.current], {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      }, "-=1.2");

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleMouseMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (window.innerWidth < 640) return;

    let clientX = 0;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }

    const { innerWidth } = window;
    const xPercentage = (clientX / innerWidth) * 100;
    const maskPercentage = 100 - xPercentage;

    // Image mask animation exclusively on overlay (Coder)
    gsap.to(overlayRef.current, {
      clipPath: `polygon(0% 0%, ${maskPercentage}% 0%, ${maskPercentage}% 100%, 0% 100%)`,
      webkitClipPath: `polygon(0% 0%, ${maskPercentage}% 0%, ${maskPercentage}% 100%, 0% 100%)`,
      duration: 0.4,
      ease: "power2.out",
      overwrite: "auto",
    });

    // L-Shape mask for Psychology to hide the sketch hands on the left, but keep the hoodie.
    if (baseLayerRef.current) {
      gsap.to(baseLayerRef.current, {
        clipPath: `polygon(${maskPercentage}% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 55%, ${maskPercentage}% 55%)`,
        webkitClipPath: `polygon(${maskPercentage}% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 55%, ${maskPercentage}% 55%)`,
        duration: 0.4,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    // Subtle parallax image shift (inverse to mouse position)
    const normalizedX = (clientX / innerWidth) * 2 - 1; // -1 to 1
    const maxShift = 100; // pixels
    if (imageContainerRef.current) {
      gsap.to(imageContainerRef.current, {
        x: normalizedX * -maxShift,
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto",
      });
    }

    // Content fade animation based on cursor side
    let leftOp = 1;
    let rightOp = 1;
    let leftWmOp = 0.12;
    let rightWmOp = 0.12;

    if (xPercentage < 45) { // Hovering Left
      leftOp = 1;
      rightOp = 0;
      leftWmOp = 0.25;
      rightWmOp = 0;
    } else if (xPercentage > 55) { // Hovering Right
      leftOp = 0;
      rightOp = 1;
      leftWmOp = 0;
      rightWmOp = 0.25;
    }

    if (innerWidth >= 640) {
      if (leftTextRef.current) gsap.to(leftTextRef.current, { opacity: leftOp, duration: 0.4, ease: "power2.out", overwrite: "auto" });
      if (rightTextRef.current) gsap.to(rightTextRef.current, { opacity: rightOp, duration: 0.4, ease: "power2.out", overwrite: "auto" });
      if (leftWatermarkRef.current) gsap.to(leftWatermarkRef.current, { opacity: leftWmOp, duration: 0.4, ease: "power2.out", overwrite: "auto" });
      if (rightWatermarkRef.current) gsap.to(rightWatermarkRef.current, { opacity: rightWmOp, duration: 0.4, ease: "power2.out", overwrite: "auto" });
    }
  };

  const handleMouseLeave = () => {
    if (window.innerWidth < 640) return;

    // Reset image mask
    gsap.to(overlayRef.current, {
      clipPath: "polygon(0% 0%, 50.6% 0%, 50.6% 100%, 0% 100%)",
      webkitClipPath: "polygon(0% 0%, 50.6% 0%, 50.6% 100%, 0% 100%)",
      duration: 0.5,
      ease: "power2.out",
      overwrite: "auto",
    });

    if (baseLayerRef.current) {
      gsap.to(baseLayerRef.current, {
        clipPath: "polygon(50.6% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 55%, 50.6% 55%)",
        webkitClipPath: "polygon(50.6% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 55%, 50.6% 55%)",
        duration: 0.5,
        ease: "power2.out",
        overwrite: "auto",
      });
    }

    // Reset parallax image shift
    if (imageContainerRef.current) {
      gsap.to(imageContainerRef.current, {
        x: 0,
        duration: 0.8,
        ease: "power3.out",
        overwrite: "auto",
      });
    }

    // Reset content opacity only on desktop
    if (window.innerWidth >= 640) {
      if (leftTextRef.current) gsap.to(leftTextRef.current, { opacity: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" });
      if (rightTextRef.current) gsap.to(rightTextRef.current, { opacity: 1, duration: 0.5, ease: "power2.out", overwrite: "auto" });
      if (leftWatermarkRef.current) gsap.to(leftWatermarkRef.current, { opacity: 0.12, duration: 0.5, ease: "power2.out", overwrite: "auto" });
      if (rightWatermarkRef.current) gsap.to(rightWatermarkRef.current, { opacity: 0.12, duration: 0.5, ease: "power2.out", overwrite: "auto" });
    }
  };

  const title = "HASSAN";

  return (
    <div className="w-full relative">
      <section
        id="hero"
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseLeave}
        className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#ffffff] touch-pan-y"
      >
        {/* ======================= */}
        {/* BACKGROUND TEXT         */}
        {/* ======================= */}
        <div className="hidden absolute inset-0 z-[35] w-full h-full flex items-start pt-[35vh] sm:pt-0 sm:items-center justify-center pointer-events-none overflow-hidden">
          <h1 ref={bgTextRef} className="font-corpta flex text-[20vw] md:text-[clamp(8rem,19vw,28rem)] font-medium leading-none tracking-tighter text-[#111111] uppercase whitespace-nowrap opacity-[0.25] md:opacity-[0.15]">
            {title.split("").map((char, index) => (
              <span
                key={index}
                ref={(el) => { if (el) lettersRef.current[index] = el; }}
                className="inline-block"
              >
                {char}
              </span>
            ))}
          </h1>
        </div>

        {/* ======================= */}
        {/* THE CENTER IMAGE        */}
        {/* ======================= */}
        <div
          ref={imageContainerRef}
          className="absolute inset-x-0 bottom-0 z-[40] flex justify-center h-[85vh] pointer-events-none"
        >
          {/* Base Layer: Creative / Psychology (Full Body) */}
          <div ref={baseLayerRef} className="absolute inset-0 w-full h-full max-sm:[clip-path:polygon(50.6%_0%,100%_0%,100%_100%,50.6%_100%)] max-sm:[--webkit-clip-path:polygon(50.6%_0%,100%_0%,100%_100%,50.6%_100%)] sm:[clip-path:polygon(50.6%_0%,100%_0%,100%_100%,0%_100%,0%_55%,50.6%_55%)] sm:[--webkit-clip-path:polygon(50.6%_0%,100%_0%,100%_100%,0%_100%,0%_55%,50.6%_55%)]">
            <Image
              src="/hero/Psychology.png"
              alt="Hassan - Creative"
              fill
              priority
              sizes="100vw"
              className="object-contain object-bottom"
            />
            {/* Right Side: Strategy / Psychology Watermark (Attached to Right Shoulder) */}
            <div ref={rightWatermarkRef} className="absolute bottom-[25vh] sm:bottom-[8vh] left-[52%] sm:left-[calc(50%+12vh)] lg:left-[calc(50%+15vh)] text-[#111] opacity-[0.12] font-sans font-bold text-[10px] sm:text-lg lg:text-xl leading-[1.5] sm:leading-[1.8] whitespace-pre select-none tracking-widest text-left">
              {`SYSTEMS THINKING
COGNITIVE_LOAD
product.strategy()
<AGI_ALIGNMENT>`}
            </div>
          </div>

          {/* Overlay Layer: Logic / Coder (Head Only, Masked on Left) */}
          <div
            ref={overlayRef}
            className="absolute inset-0 w-full h-full"
            style={{
              clipPath: 'polygon(0% 0%, 50.6% 0%, 50.6% 100%, 0% 100%)',
              WebkitClipPath: 'polygon(0% 0%, 50.6% 0%, 50.6% 100%, 0% 100%)'
            }}
          >
            <Image
              src="/hero/Coder.png"
              alt="Hassan - Logic"
              fill
              priority
              sizes="100vw"
              className="object-contain object-bottom"
            />
            {/* Left Side: Technical / Code Watermark (Attached to Left Shoulder) */}
            <div ref={leftWatermarkRef} className="absolute bottom-[25vh] sm:bottom-[8vh] right-[52%] sm:right-[calc(50%+12vh)] lg:right-[calc(50%+15vh)] text-[#111] opacity-[0.12] font-mono font-medium text-[10px] sm:text-lg lg:text-xl leading-[1.5] sm:leading-[1.8] whitespace-pre select-none tracking-widest text-left">
              {`<React.FC>
{ scale: "global" }
await trainModel()
<NextJS> TypeScript
{ depth: true }`}
            </div>
          </div>
        </div>

        {/* ======================= */}
        {/* FOREGROUND CONTENT      */}
        {/* ======================= */}
        <div ref={heroContentRef} className="absolute inset-0 z-[40] w-full h-full pointer-events-none">
          <div className="relative w-full max-w-[90rem] mx-auto h-full px-6 lg:px-16 flex flex-col sm:flex-row items-center justify-start sm:justify-between pt-[18vh] sm:pt-0 pb-[10vh] sm:pb-0">

            {/* Left Box (which acts as Unified Box on Mobile) */}
            <div ref={leftTextRef} className="z-50 pointer-events-auto w-full sm:w-[48%] lg:w-auto sm:max-w-[400px] lg:max-w-[480px] flex justify-center sm:justify-start mb-auto sm:mb-0 sm:-mt-[5vh] cursor-pointer">
              <div className="hero-scroll-primary w-full text-center sm:text-left">
                <div className="overflow-hidden">
                  <h2 ref={greetingRef} className="font-corpta text-[1.8rem] sm:text-[2.2rem] md:text-[3rem] lg:text-[4rem] tracking-[-0.02em] text-[#3bd6c6] font-medium mb-3 md:mb-5 leading-none uppercase drop-shadow-md">
                    <span className="sm:hidden">&lt;AI SOLUTION ARCHITECT&gt; <span className="text-[#a0a0a0] font-light text-[1.6rem] sm:text-[2rem]">&</span><br />Psychology-led product strategist</span>
                    <span className="hidden sm:inline">&lt;AI SOLUTION ARCHITECT&gt;</span>
                  </h2>
                </div>
                <div className="overflow-hidden">
                  <p className="font-sans text-[15px] sm:text-[17px] lg:text-[19px] text-[#909090] font-light leading-[1.6] max-w-[340px] sm:max-w-[90%] lg:max-w-[320px] mx-auto sm:mx-0">
                    <span className="sm:hidden">AI Product Manager. Creating products & distractions for the post AGI world driven by Strategy, Psychology & Deep Execution.</span>
                    <span className="hidden sm:inline">Focusing on technical depth, deep execution, and constantly experimenting with what's next.</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Right Box (Hidden entirely on Mobile) */}
            <div ref={rightTextRef} className="hidden sm:flex z-50 pointer-events-auto sm:w-[48%] lg:w-auto sm:max-w-[500px] lg:max-w-none justify-end sm:-mt-[5vh] cursor-pointer lg:translate-x-4 xl:translate-x-12">
              <div ref={subheadlineRef} className="hero-scroll-primary w-full text-center sm:text-right">
                <h2 className="font-corpta text-[1.5rem] sm:text-[1.8rem] md:text-[2.2rem] lg:text-[2.4rem] xl:text-[2.7rem] tracking-[-0.02em] text-[#3bd6c6] font-medium mb-3 md:mb-5 leading-[1.05] uppercase drop-shadow-md whitespace-nowrap">
                  Psychology-led<br />Product<br />Strategist
                </h2>
                <p className="font-sans text-base sm:text-[15px] md:text-[17px] lg:text-[19px] text-[#909090] font-light leading-[1.6] max-w-[280px] md:max-w-[320px] mx-auto sm:ml-auto sm:mr-0">
                  AI Product Manager. Creating products & distractions for the post AGI world driven by Strategy + Psychology.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* ======================= */}
        {/* CLOUDS FOR TRANSITION   */}
        {/* ======================= */}
        <div className="cloud-wrapper absolute inset-0 z-[30] pointer-events-none overflow-visible">


          {/* BACK CLOUD LAYER (Depth) */}
          <div className="cloud-layer-back absolute inset-0 origin-bottom">
            {/* Base block for depth layer */}
            <div className="absolute bottom-[-10vh] left-[-10vw] right-[-10vw] h-[18vh] bg-[#e6e6e6]"></div>

            {/* Left Corner Bumps */}
            <div className="absolute rounded-full bg-[#e6e6e6] w-[50vw] h-[50vw] md:w-[20vw] md:h-[20vw] -left-[20vw] md:-left-[8vw] -bottom-[18vw] md:-bottom-[7vw]"></div>
            <div className="absolute rounded-full bg-[#e6e6e6] w-[65vw] h-[65vw] md:w-[26vw] md:h-[26vw] -left-[30vw] md:-left-[12vw] -bottom-[38vw] md:-bottom-[15vw]"></div>

            {/* Middle Bottom Bumps */}
            <div className="absolute rounded-full bg-[#e6e6e6] w-[55vw] h-[55vw] md:w-[22vw] md:h-[22vw] left-[10vw] md:left-[4vw] -bottom-[35vw] md:-bottom-[14vw]"></div>
            <div className="absolute rounded-full bg-[#e6e6e6] w-[70vw] h-[70vw] md:w-[28vw] md:h-[28vw] left-[30vw] md:left-[21vw] -bottom-[48vw] md:-bottom-[19vw]"></div>
            <div className="absolute rounded-full bg-[#e6e6e6] w-[85vw] h-[85vw] md:w-[34vw] md:h-[34vw] left-[15vw] md:left-[41vw] -bottom-[60vw] md:-bottom-[24vw]"></div>
            <div className="absolute rounded-full bg-[#e6e6e6] w-[60vw] h-[60vw] md:w-[24vw] md:h-[24vw] right-[5vw] md:right-[19vw] -bottom-[38vw] md:-bottom-[15vw]"></div>

            {/* Right Corner Bumps */}
            <div className="absolute rounded-full bg-[#e6e6e6] w-[45vw] h-[45vw] md:w-[18vw] md:h-[18vw] right-[12vw] md:right-[5vw] -bottom-[22vw] md:-bottom-[9vw]"></div>
            <div className="absolute rounded-full bg-[#e6e6e6] w-[75vw] h-[75vw] md:w-[30vw] md:h-[30vw] -right-[30vw] md:-right-[12vw] -bottom-[48vw] md:-bottom-[19vw]"></div>
            <div className="absolute rounded-full bg-[#e6e6e6] w-[55vw] h-[55vw] md:w-[22vw] md:h-[22vw] -right-[20vw] md:-right-[8vw] -bottom-[28vw] md:-bottom-[11vw]"></div>
          </div>

          {/* FRONT CLOUD LAYER */}
          <div className="cloud-layer-front absolute inset-0 origin-bottom">
            {/* Base block to strictly prevent any white gaps at the very bottom edge */}
            <div className="absolute bottom-[-10vh] left-[-10vw] right-[-10vw] h-[15vh] bg-[#f2f2f2]"></div>

            {/* Left Corner Bumps */}
            <div className="absolute rounded-full bg-[#f2f2f2] w-[45vw] h-[45vw] md:w-[18vw] md:h-[18vw] -left-[20vw] md:-left-[8vw] -bottom-[20vw] md:-bottom-[8vw]"></div>
            <div className="absolute rounded-full bg-[#f2f2f2] w-[60vw] h-[60vw] md:w-[24vw] md:h-[24vw] -left-[30vw] md:-left-[12vw] -bottom-[40vw] md:-bottom-[16vw]"></div>

            {/* Middle Bottom Bumps */}
            <div className="absolute rounded-full bg-[#f2f2f2] w-[50vw] h-[50vw] md:w-[20vw] md:h-[20vw] left-[12vw] md:left-[5vw] -bottom-[38vw] md:-bottom-[15vw]"></div>
            <div className="absolute rounded-full bg-[#f2f2f2] w-[65vw] h-[65vw] md:w-[26vw] md:h-[26vw] left-[35vw] md:left-[22vw] -bottom-[50vw] md:-bottom-[20vw]"></div>
            <div className="absolute rounded-full bg-[#f2f2f2] w-[80vw] h-[80vw] md:w-[32vw] md:h-[32vw] left-[20vw] md:left-[42vw] -bottom-[62vw] md:-bottom-[25vw]"></div>
            <div className="absolute rounded-full bg-[#f2f2f2] w-[55vw] h-[55vw] md:w-[22vw] md:h-[22vw] right-[10vw] md:right-[20vw] -bottom-[40vw] md:-bottom-[16vw]"></div>

            {/* Right Corner Bumps */}
            <div className="absolute rounded-full bg-[#f2f2f2] w-[40vw] h-[40vw] md:w-[16vw] md:h-[16vw] right-[15vw] md:right-[6vw] -bottom-[25vw] md:-bottom-[10vw]"></div>
            <div className="absolute rounded-full bg-[#f2f2f2] w-[70vw] h-[70vw] md:w-[28vw] md:h-[28vw] -right-[30vw] md:-right-[12vw] -bottom-[50vw] md:-bottom-[20vw]"></div>
            <div className="absolute rounded-full bg-[#f2f2f2] w-[50vw] h-[50vw] md:w-[20vw] md:h-[20vw] -right-[20vw] md:-right-[8vw] -bottom-[30vw] md:-bottom-[12vw]"></div>
          </div>
        </div>
      </section>
    </div>
  );
}
