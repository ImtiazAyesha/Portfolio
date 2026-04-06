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

      // Primary text hides UP rapidly and securely before swap
      scrollTl.to(".hero-scroll-primary", {
        y: -100,
        opacity: 0,
        duration: 0.3,
        ease: "power2.in",
      }, 0);

      // Secondary black text smartly glides up after primary vanishes
      scrollTl.to(".hero-scroll-secondary", {
        y: 0,
        opacity: 1,
        duration: 0.4,
        ease: "power2.out",
      }, 0.35);

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
        <div className="absolute inset-0 z-[35] w-full h-full flex items-start pt-[35vh] sm:pt-0 sm:items-center justify-center pointer-events-none overflow-hidden">
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
            <div className="absolute top-[24%] sm:top-[20%] w-full left-0 sm:w-auto sm:left-6 lg:left-12 z-50 pointer-events-auto flex justify-center sm:block">
              <div className="relative w-full sm:w-max min-w-[200px]">
                {/* Primary text that fades OUT */}
                <div className="hero-scroll-primary">
                  <p ref={greetingRef} className="font-sans text-xl sm:text-2xl lg:text-3xl text-[#111111] font-medium leading-[1.3] drop-shadow-sm mix-blend-multiply opacity-90 text-center sm:text-left">
                    Hey, I'm<br />
                  </p>
                </div>
                {/* Secondary text that fades IN */}
                <div className="hero-scroll-secondary absolute top-0 left-0 w-full sm:w-max opacity-0 translate-y-6">
                  <p className="font-sans text-xl sm:text-2xl lg:text-3xl text-[#111111] font-medium leading-[1.3] text-center sm:text-left whitespace-nowrap">
                    Scroll down.
                  </p>
                </div>
              </div>
            </div>

            {/* Bottom Right / Center (Mobile) Text */}
            <div className="absolute top-[54%] sm:top-auto w-full left-0 sm:w-auto sm:left-auto sm:bottom-[5%] sm:right-6 lg:bottom-[8%] lg:right-12 xl:right-16 z-50 pointer-events-auto flex justify-center sm:block px-6 sm:px-0">
              <div className="relative min-h-[100px] w-full flex justify-center sm:block">
                {/* Primary text that fades OUT */}
                <div className="hero-scroll-primary">
                  <h2 ref={subheadlineRef} className="font-sans text-lg sm:text-xl lg:text-2xl text-[#111111] font-medium leading-[1.35] drop-shadow-sm mix-blend-multiply opacity-90 max-w-[300px] lg:max-w-[360px] text-center sm:text-right">
                    A hybrid creative engineer specializing in AI infrastructure & motion-rich web apps.
                  </h2>
                </div>
                {/* Secondary text that fades IN */}
                <div className="hero-scroll-secondary absolute top-0 sm:right-0 w-full opacity-0 translate-y-6 flex justify-center sm:justify-end">
                  <h2 className="font-sans text-lg sm:text-xl lg:text-2xl text-[#111111] font-medium leading-[1.35] max-w-[300px] lg:max-w-[360px] text-center sm:text-right">
                    To explore the creative timeline.
                  </h2>
                </div>
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
