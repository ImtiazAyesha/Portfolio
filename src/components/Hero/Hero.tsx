"use client";

import { useEffect, useRef } from "react";
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
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const validLetters = lettersRef.current.filter(Boolean);
      const introTl = gsap.timeline();

      if (greetingRef.current) gsap.set(greetingRef.current, { yPercent: 100 });
      if (validLetters.length > 0) gsap.set(validLetters, { yPercent: 100, opacity: 0 });
      gsap.set([subheadlineRef.current], { autoAlpha: 0, y: 20 });
      if (imageRef.current) gsap.set(imageRef.current, { autoAlpha: 0, scale: 0.95 });

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

      if (imageRef.current) {
        introTl.to(imageRef.current, {
          autoAlpha: 1,
          scale: 1,
          duration: 1.5,
          ease: "power4.out",
        }, "-=1.2");
      }

      introTl.to([subheadlineRef.current], {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      }, "-=1.2");

      // --- Cinematic Cloud Transition ---
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=150%", // Determines how long the user scrolls to complete the transition
          scrub: 1,
          pin: true,
        }
      });

      // Scale up the cloud layers
      // Back layer
      scrollTl.to(".cloud-layer-back", {
        scale: 15,
        duration: 1,
        ease: "power2.inOut",
        transformOrigin: "bottom center"
      }, 0);

      // Front layer scales slightly larger/faster
      scrollTl.to(".cloud-layer-front", {
        scale: 20,
        duration: 1,
        ease: "power2.inOut",
        transformOrigin: "bottom center"
      }, 0);

      // Bubbles floating up and fading
      scrollTl.to(".bubble", {
        y: -300,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power1.out",
      }, 0);

      // Background text becomes pure black as cloud covers it
      if (bgTextRef.current) {
        scrollTl.to(bgTextRef.current, {
          opacity: 1,
          duration: 1,
          ease: "power2.inOut",
        }, 0);
      }

    }, containerRef);

    return () => ctx.revert();
  }, []);

  const title = "HASSAN";

  return (
    <div className="w-full relative">
      <section
        id="hero"
        ref={containerRef}
        className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#ffffff]"
      >
        {/* ======================= */}
        {/* BACKGROUND TEXT         */}
        {/* ======================= */}
        <div className="absolute inset-0 z-[35] w-full h-full flex items-center justify-center pointer-events-none overflow-hidden">
          <h1 ref={bgTextRef} className="font-space flex text-[clamp(8rem,25vw,30rem)] font-black leading-none tracking-tighter text-[#111111] uppercase whitespace-nowrap opacity-[0.25] md:opacity-[0.15]">
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
        <div className="absolute inset-x-0 bottom-0 z-[40] flex justify-center h-[85vh] pointer-events-none">
          <img
            ref={imageRef}
            src="/Main.png"
            alt="Hassan"
            className="h-full w-auto object-contain object-bottom"
          />
        </div>

        {/* ======================= */}
        {/* FOREGROUND CONTENT      */}
        {/* ======================= */}
        <div ref={heroContentRef} className="absolute inset-0 z-[40] w-full h-full pointer-events-none">
          <div className="relative w-full max-w-[90rem] mx-auto h-full px-6 lg:px-12">

            {/* Top Left Text */}
            <div className="absolute top-[20%] left-6 lg:left-12 z-20 pointer-events-auto">
              <div className="overflow-hidden">
                <p ref={greetingRef} className="font-sans text-xl sm:text-2xl lg:text-3xl text-[#111111] font-medium leading-[1.3] drop-shadow-sm mix-blend-multiply opacity-90">
                  Hey, I'm<br />
                  {/* I'm Hassan */}
                </p>
              </div>
            </div>

            {/* Bottom Right Text */}
            <div className="absolute bottom-[2%] sm:bottom-[5%] lg:bottom-[8%] right-6 lg:right-12 xl:right-16 z-20 pointer-events-auto">
              <div className="overflow-hidden">
                <h2 ref={subheadlineRef} className="font-sans text-lg sm:text-xl lg:text-2xl text-[#111111] font-medium leading-[1.35] drop-shadow-sm mix-blend-multiply opacity-90 max-w-[260px] sm:max-w-[300px] lg:max-w-[360px]">
                  A hybrid creative engineer specializing in AI infrastructure & motion-rich web apps.
                </h2>
              </div>
            </div>

          </div>
        </div>

        {/* ======================= */}
        {/* CLOUDS FOR TRANSITION   */}
        {/* ======================= */}
        <div className="cloud-wrapper absolute inset-0 z-[30] pointer-events-none overflow-visible">

          {/* FLOATING PARTICLES */}
          <div className="particles absolute inset-0 z-[25]">
            {/* Left reference bubbles */}
            <div className="bubble absolute bottom-[12vh] left-[8vw] w-[60px] h-[60px] rounded-full bg-[#3bd6c6] shadow-[0_0_20px_#3bd6c6] opacity-90"></div>
            <div className="bubble absolute bottom-[5vh] -left-[1vw] w-[90px] h-[90px] rounded-full bg-[#3bd6c6] shadow-[0_0_30px_#3bd6c6] opacity-80"></div>
            <div className="bubble absolute bottom-[8vh] left-[13vw] w-[35px] h-[35px] rounded-full bg-[#3bd6c6] shadow-[0_0_10px_#3bd6c6] opacity-100"></div>

            {/* Right reference bubbles */}
            <div className="bubble absolute bottom-[18vh] right-[4vw] w-[45px] h-[45px] rounded-full bg-[#3bd6c6] shadow-[0_0_15px_#3bd6c6] opacity-90"></div>
            <div className="bubble absolute bottom-[8vh] -right-[1vw] w-[75px] h-[75px] rounded-full bg-[#3bd6c6] shadow-[0_0_25px_#3bd6c6] opacity-80"></div>
            <div className="bubble absolute bottom-[15vh] right-[9vw] w-[25px] h-[25px] rounded-full bg-[#3bd6c6] shadow-[0_0_10px_#3bd6c6] opacity-100"></div>
            <div className="bubble absolute bottom-[5vh] right-[14vw] w-[30px] h-[30px] rounded-full bg-[#3bd6c6] shadow-[0_0_10px_#3bd6c6] opacity-70"></div>
          </div>

          {/* BACK CLOUD LAYER (Depth) */}
          <div className="cloud-layer-back absolute inset-0 origin-bottom">
            {/* Base block for depth layer */}
            <div className="absolute bottom-[-10vh] left-[-10vw] right-[-10vw] h-[18vh] bg-[#e6e6e6]"></div>

            {/* Left Corner Bumps */}
            <div className="absolute rounded-full bg-[#e6e6e6] w-[20vw] h-[20vw] -left-[8vw] -bottom-[7vw]"></div>
            <div className="absolute rounded-full bg-[#e6e6e6] w-[26vw] h-[26vw] -left-[12vw] -bottom-[15vw]"></div>

            {/* Middle Bottom Bumps */}
            <div className="absolute rounded-full bg-[#e6e6e6] w-[22vw] h-[22vw] left-[4vw] -bottom-[14vw]"></div>
            <div className="absolute rounded-full bg-[#e6e6e6] w-[28vw] h-[28vw] left-[21vw] -bottom-[19vw]"></div>
            <div className="absolute rounded-full bg-[#e6e6e6] w-[34vw] h-[34vw] left-[41vw] -bottom-[24vw]"></div>
            <div className="absolute rounded-full bg-[#e6e6e6] w-[24vw] h-[24vw] right-[19vw] -bottom-[15vw]"></div>

            {/* Right Corner Bumps */}
            <div className="absolute rounded-full bg-[#e6e6e6] w-[18vw] h-[18vw] right-[5vw] -bottom-[9vw]"></div>
            <div className="absolute rounded-full bg-[#e6e6e6] w-[30vw] h-[30vw] -right-[12vw] -bottom-[19vw]"></div>
            <div className="absolute rounded-full bg-[#e6e6e6] w-[22vw] h-[22vw] -right-[8vw] -bottom-[11vw]"></div>
          </div>

          {/* FRONT CLOUD LAYER */}
          <div className="cloud-layer-front absolute inset-0 origin-bottom">
            {/* Base block to strictly prevent any white gaps at the very bottom edge */}
            <div className="absolute bottom-[-10vh] left-[-10vw] right-[-10vw] h-[15vh] bg-[#f2f2f2]"></div>

            {/* Left Corner Bumps */}
            <div className="absolute rounded-full bg-[#f2f2f2] w-[18vw] h-[18vw] -left-[8vw] -bottom-[8vw]"></div>
            <div className="absolute rounded-full bg-[#f2f2f2] w-[24vw] h-[24vw] -left-[12vw] -bottom-[16vw]"></div>

            {/* Middle Bottom Bumps */}
            <div className="absolute rounded-full bg-[#f2f2f2] w-[20vw] h-[20vw] left-[5vw] -bottom-[15vw]"></div>
            <div className="absolute rounded-full bg-[#f2f2f2] w-[26vw] h-[26vw] left-[22vw] -bottom-[20vw]"></div>
            <div className="absolute rounded-full bg-[#f2f2f2] w-[32vw] h-[32vw] left-[42vw] -bottom-[25vw]"></div>
            <div className="absolute rounded-full bg-[#f2f2f2] w-[22vw] h-[22vw] right-[20vw] -bottom-[16vw]"></div>

            {/* Right Corner Bumps */}
            <div className="absolute rounded-full bg-[#f2f2f2] w-[16vw] h-[16vw] right-[6vw] -bottom-[10vw]"></div>
            <div className="absolute rounded-full bg-[#f2f2f2] w-[28vw] h-[28vw] -right-[12vw] -bottom-[20vw]"></div>
            <div className="absolute rounded-full bg-[#f2f2f2] w-[20vw] h-[20vw] -right-[8vw] -bottom-[12vw]"></div>
          </div>
        </div>

      </section>
    </div>
  );
}
