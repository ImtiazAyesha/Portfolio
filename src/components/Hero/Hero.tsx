"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 73; // frame_00.webp to frame_72.webp

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  // Hero refs
  const heroContentRef = useRef<HTMLDivElement>(null);
  const greetingRef = useRef<HTMLSpanElement>(null);
  const lettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subheadlineRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLButtonElement>(null);

  // About refs
  const aboutWrapperRef = useRef<HTMLDivElement>(null);
  const aboutHeadingRef = useRef<HTMLHeadingElement>(null);
  const aboutTextRef = useRef<HTMLParagraphElement>(null);
  const statRefs = useRef<(HTMLDivElement | null)[]>([]);

  const imagesRef = useRef<HTMLImageElement[]>([]);
  const scrollObj = useRef({ frame: 0 });
  const [isPreloaded, setIsPreloaded] = useState(false);

  // Preload Images
  useEffect(() => {
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);

    const loadImage = (index: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = document.createElement("img");
        const paddedIndex = index.toString().padStart(2, "0");
        img.src = `/Frames/frame_${paddedIndex}_delay-0.041s.webp`;
        img.onload = () => {
          images[index] = img;
          resolve(img);
        };
        img.onerror = () => {
          resolve(img); // resolve even on error to prevent blocking
        };
      });
    };

    const preloadSequence = async () => {
      const priorityCount = Math.min(5, FRAME_COUNT);
      const priorityPromises = [];
      for (let i = 0; i < priorityCount; i++) {
        priorityPromises.push(loadImage(i));
      }

      await Promise.all(priorityPromises);
      imagesRef.current = images;
      renderFrame(0);
      setIsPreloaded(true);

      const loadRest = async () => {
        const restPromises = [];
        for (let i = priorityCount; i < FRAME_COUNT; i++) {
          restPromises.push(loadImage(i));
        }
        await Promise.all(restPromises);
        imagesRef.current = images;
      };

      if (typeof window !== "undefined" && "requestIdleCallback" in window) {
        requestIdleCallback(() => { loadRest(); });
      } else {
        setTimeout(loadRest, 1);
      }
    };

    preloadSequence();
  }, []);

  const renderFrame = (index: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[index];
    if (!img) return;

    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    const imgWidth = img.width;
    const imgHeight = img.height;

    if (imgWidth === 0 || imgHeight === 0) return;

    const ratio = Math.min(canvasWidth / imgWidth, canvasHeight / imgHeight) * 1.35;
    const newWidth = imgWidth * ratio;
    const newHeight = imgHeight * ratio;

    const offsetX = (canvasWidth - newWidth) / 2;
    const offsetY = canvasHeight - newHeight + (canvasHeight * 0.15);

    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);
  };

  useEffect(() => {
    const resizeCanvas = () => {
      const canvas = canvasRef.current;
      const parent = canvas?.parentElement;
      if (canvas && parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
        renderFrame(Math.round(scrollObj.current.frame));
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const ctx = gsap.context(() => {
      const validLetters = lettersRef.current.filter(Boolean);
      const validStats = statRefs.current.filter(Boolean);

      // --- Entrance Animations (Timeline independent of scroll) ---
      const introTl = gsap.timeline();

      if (greetingRef.current) gsap.set(greetingRef.current, { yPercent: 100 });
      if (validLetters.length > 0) gsap.set(validLetters, { yPercent: 100, opacity: 0 });
      gsap.set([subheadlineRef.current, ctaRef.current], { autoAlpha: 0, y: 20 });
      
      // Set About elements hidden initially
      gsap.set([aboutHeadingRef.current, aboutTextRef.current, ...validStats], { opacity: 0, y: 50 });
      gsap.set(aboutWrapperRef.current, { autoAlpha: 0 });

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

      introTl.to([subheadlineRef.current, ctaRef.current], {
        autoAlpha: 1,
        y: 0,
        duration: 1,
        stagger: 0.1,
        ease: "power3.out",
      }, "-=1.2");

      // --- ScrollTrigger Cinematic Timeline ---
      const mainTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "+=400%",
          scrub: 0.5,
          pin: true,
        }
      });

      // Phase 1: Frame sequence (0% to 50%) -> duration length arbitary proportion
      mainTl.to(scrollObj.current, {
        frame: FRAME_COUNT - 1,
        snap: "frame",
        ease: "none",
        duration: 1, // represents 50%
        onUpdate: () => {
          renderFrame(Math.round(scrollObj.current.frame));
        },
      }, 0);

      // Phase 2: Transition (50% to 100%)
      
      // 1. Fade out giant HASSAN text and Hero UI
      mainTl.to(heroContentRef.current, {
        opacity: 0,
        duration: 0.5,
      }, 1);

      // 2. Animate canvas to the left
      mainTl.to(canvasWrapperRef.current, {
        xPercent: -60, // Move canvas visually out of the way to the left
        duration: 1, // Spans the entire phase 2
        ease: "power1.inOut"
      }, 1);

      // 3. Make the About wrapper visible (autoAlpha)
      mainTl.to(aboutWrapperRef.current, {
        autoAlpha: 1,
        duration: 0.1
      }, 1);

      // 4. Animate the 'About' content in (right side)
      mainTl.to([aboutHeadingRef.current, aboutTextRef.current, ...validStats], {
        opacity: 1,
        y: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power1.out"
      }, 1.2); // Starts slightly after canvas starts moving

    }, containerRef);

    return () => {
      ctx.revert();
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  const title = "HASSAN";

  return (
    <div className="w-full relative">
      <section
        id="story-wrapper"
        ref={containerRef}
        className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-[#f8f9fa]"
      >
        {/* ======================= */}
        {/* PHASE 1: HERO CONTENT   */}
        {/* ======================= */}
        <div ref={heroContentRef} className="absolute inset-0 z-[10] w-full h-full pointer-events-none flex justify-center">
          <div className="w-full max-w-[90rem] h-full px-6 lg:px-12 flex flex-col items-start justify-center">
            <div className="w-full lg:w-[65%]">
              <p className="font-sans text-xl sm:text-2xl lg:text-3xl text-[#111111] font-medium mb-4 pb-2 overflow-hidden">
                <span ref={greetingRef} className="inline-block">Hey, I'm</span>
              </p>
              <div className="overflow-visible w-full">
                <h1 className="font-space flex text-[clamp(5rem,12vw,16rem)] font-black leading-none tracking-tighter text-[#111111] uppercase whitespace-nowrap">
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

              <div className="mt-4 lg:mt-4 pointer-events-auto">
                <p
                  ref={subheadlineRef}
                  className="max-w-[420px] font-sans text-base sm:text-lg lg:text-xl leading-relaxed text-[#555555]"
                >
                  A hybrid creative engineer specializing in scalable AI infrastructure and high-end, motion-rich web applications.
                </p>

                <div className="mt-8 overflow-hidden flex justify-start">
                  <button
                    ref={ctaRef}
                    className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full bg-[#111111] border border-[#111111] px-8 py-4 font-sans text-base font-bold text-white transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-xl"
                  >
                    <span className="relative z-10 transition-colors duration-300">Explore Work</span>
                    <svg className="relative z-10 w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ======================= */}
        {/* THE CANVAS SUBJECT      */}
        {/* ======================= */}
        {/* Centered initially, smoothly transitions to the left in Phase 2 */}
        <div
          ref={canvasWrapperRef}
          className={`absolute inset-y-0 right-0 z-[2] flex h-full w-full lg:w-[65%] items-center justify-center pointer-events-none transition-opacity duration-1000 ease-in-out ${isPreloaded ? "opacity-100" : "opacity-0"}`}
        >
          <canvas
            ref={canvasRef}
            className="h-full w-full object-contain"
            style={{
              mixBlendMode: 'multiply',
              WebkitMaskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)',
              maskImage: 'radial-gradient(circle at center, black 60%, transparent 100%)'
            }}
          />
        </div>

        {/* ======================= */}
        {/* PHASE 2: ABOUT CONTENT  */}
        {/* ======================= */}
        <div 
          ref={aboutWrapperRef}
          className="absolute right-0 lg:right-[10%] top-0 h-full w-full px-6 lg:px-0 lg:w-[40%] flex items-center z-[15] pointer-events-none"
        >
          <div className="flex flex-col gap-10 w-full pointer-events-auto mt-24 lg:mt-0">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="block w-5 h-px bg-[#81D8D0]" />
                <span className="font-space text-xs font-bold uppercase tracking-[0.2em] text-[#81D8D0]">
                  Introduction
                </span>
              </div>
              
              <h2 ref={aboutHeadingRef} className="font-space text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-[#111111] leading-[1.05]">
                Engineer by craft,<br/>
                <span className="text-[#81D8D0]">thinker by nature.</span>
              </h2>
            </div>
            
            <p ref={aboutTextRef} className="text-lg sm:text-xl md:text-2xl text-[#555555] leading-relaxed max-w-2xl font-medium">
              I'm Hassan — an AI/ML Engineer specialising in deep learning, NLP, and intelligent systems. I love turning complex research into products that actually ship and change the way people interact with technology.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 md:gap-12 w-full mt-4">
              <div ref={(el) => { if(el) statRefs.current[0] = el; }} className="stat-item flex flex-col border-l-4 border-[#E5E5E5] pl-6 transition-colors duration-500 hover:border-[#81D8D0]">
                <span className="font-space font-black text-4xl sm:text-5xl lg:text-6xl text-[#111111] tracking-tighter">
                  15<span className="text-[#81D8D0]">+</span>
                </span>
                <span className="font-space text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#888888] mt-2">
                  Projects Shipped
                </span>
              </div>

              <div ref={(el) => { if(el) statRefs.current[1] = el; }} className="stat-item flex flex-col border-l-4 border-[#E5E5E5] pl-6 transition-colors duration-500 hover:border-[#81D8D0]">
                <span className="font-space font-black text-4xl sm:text-5xl lg:text-6xl text-[#111111] tracking-tighter">
                  100<span className="text-[#81D8D0]">%</span>
                </span>
                <span className="font-space text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#888888] mt-2">
                  Satisfaction Rate
                </span>
              </div>

              <div ref={(el) => { if(el) statRefs.current[2] = el; }} className="stat-item flex flex-col border-l-4 border-[#E5E5E5] pl-6 transition-colors duration-500 hover:border-[#81D8D0]">
                <span className="font-space font-black text-4xl sm:text-5xl lg:text-6xl text-[#111111] tracking-tighter">
                  3<span className="text-[#81D8D0]">+</span>
                </span>
                <span className="font-space text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-[#888888] mt-2">
                  Years in Research
                </span>
              </div>
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
