"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const productsData = [
  {
    title: "AI Search Engine Version 2.0",
    description: "Reinventing document retrieval with pure generative embeddings.",
    image: "/images/products/product_banner_1_1775044347485.png",
    link: "#"
  },
  {
    title: "Vision Edge Architecture",
    description: "Deploying high-performance models to incredibly constrained devices.",
    image: "/images/products/product_banner_2_1775044363001.png",
    link: "#"
  },
  {
    title: "Neural Interface Sandbox",
    description: "Interactive real-time visualizations for complex vector spaces.",
    image: "/images/products/product_banner_3_1775044378823.png",
    link: "#"
  },
  {
    title: "Evren Core Platform",
    description: "The flagship enterprise dashboard unifying all AI ops in one hub.",
    image: "/images/products/product_banner_4_1775044406569.png",
    link: "#"
  }
];

export default function FeaturedProducts() {
  const sectionRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // ── Smooth Dark Theme Transition ──
      // Transition section background to obsidian
      gsap.to(sectionRef.current, {
        backgroundColor: "#050505",
        duration: 1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%", // Starts transitioning when top of section is 60% down the viewport
          end: "top 20%",   // Finishes transition when it reaches 20%
          scrub: true,
        }
      });

      // Transition main heading to white
      gsap.to(".theme-heading", {
        color: "#FAFAFA",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "top 20%",
          scrub: true,
        }
      });

      // Transition descriptive text to light gray
      gsap.to(".theme-paragraph", {
        color: "#888888",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
          end: "top 20%",
          scrub: true,
        }
      });

      // ── Staggered Grid Entrance Parallax ──
      gsap.fromTo(".product-card-wrap", 
        { y: 120, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1.4,
          ease: "power4.out",
          clearProps: "opacity,transform", // Clears inline styles so Tailwind hover classes work
          scrollTrigger: {
            trigger: ".products-grid",
            start: "top 90%", // Trigger slightly earlier to ensure it fires
          }
        }
      );

      // ── Custom Spotlight Follow Logic ──
      const section = sectionRef.current;
      const spotlight = spotlightRef.current;

      if (section && spotlight) {
        // Initialize spotlight centered on mouse but hidden
        gsap.set(spotlight, { xPercent: -50, yPercent: -50 });

        const onMouseMove = (e: MouseEvent) => {
          const rect = section.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          gsap.to(spotlight, {
            x,
            y,
            duration: 0.6,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const onMouseEnter = () => gsap.to(spotlight, { opacity: 1, duration: 0.5 });
        const onMouseLeave = () => gsap.to(spotlight, { opacity: 0, duration: 0.5 });

        section.addEventListener("mousemove", onMouseMove);
        section.addEventListener("mouseenter", onMouseEnter);
        section.addEventListener("mouseleave", onMouseLeave);

        return () => {
          section.removeEventListener("mousemove", onMouseMove);
          section.removeEventListener("mouseenter", onMouseEnter);
          section.removeEventListener("mouseleave", onMouseLeave);
        };
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      ref={sectionRef} 
      id="products" 
      // Begins with light theme to match preceding sections smoothly
      className="relative z-20 bg-[#FAFAFA] py-24 md:py-36 overflow-hidden min-h-screen"
    >
      {/* ── Cinematics: Film Grain & Vignette ── */}
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
        .film-overlay {
          pointer-events: none;
          position: absolute;
          inset: -100%;
          width: 300%;
          height: 300%;
          z-index: 1;
          opacity: 0.08;
          mix-blend-mode: overlay;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          animation: film-noise 0.25s infinite steps(2);
        }
      `}} />
      <div className="film-overlay" />

      {/* ── Spotlight Element ── */}
      <div 
        ref={spotlightRef}
        className="absolute top-0 left-0 w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] rounded-full pointer-events-none z-0 mix-blend-screen opacity-0"
        style={{
          background: "radial-gradient(circle, rgba(129,216,208,0.12) 0%, rgba(129,216,208,0.05) 40%, rgba(129,216,208,0) 70%)",
        }}
      />

      <div className="px-6 md:px-12 max-w-[100rem] mx-auto w-full relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8 mb-4">
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="block w-12 h-px bg-[#81D8D0]" />
            <span className="font-space text-sm font-bold uppercase tracking-[0.2em] text-[#81D8D0]">
              Featured Work
            </span>
          </div>
          <h2 className="theme-heading font-space text-5xl md:text-7xl lg:text-[6rem] font-black uppercase tracking-tighter text-[#111111] leading-[0.9]">
            Selected<br />Products.
          </h2>
        </div>
        <p className="theme-paragraph max-w-md text-[#555555] text-xl font-medium leading-relaxed pb-4">
          A showcase of platforms, products, and deep-tech architectures crafted for the modern AI ecosystem.
        </p>
      </div>

      {/* ── Staggered Asymmetric Grid ── */}
      <div className="products-grid grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-x-12 md:gap-y-24 mt-16 px-6 md:px-12 max-w-[65rem] mx-auto relative z-10 w-full">
        {productsData.map((product, index) => {
          const isHovered = hoveredIndex === index;
          const isOtherHovered = hoveredIndex !== null && hoveredIndex !== index;
          // Offset the right column to create the staggering (subtler offset)
          const offsetClass = index % 2 !== 0 ? 'md:mt-24' : '';
          
          return (
            <div 
              key={index}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`product-card-wrap relative group w-full ${offsetClass} transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer mx-auto max-w-[26rem]
                ${isOtherHovered ? 'opacity-20 blur-sm scale-[0.97]' : 'opacity-100 blur-0 scale-100'}
              `}
            >
              {/* Image Card Container */}
              <div className="relative w-full aspect-[4/5] bg-[#111111] overflow-hidden rounded-[1.2rem] border border-[#222222] shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                
                {/* Main Image */}
                <Image 
                  src={product.image} 
                  alt={product.title}
                  fill
                  className={`object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${isHovered ? 'scale-110' : 'scale-100'}`}
                  sizes="(max-width: 768px) 100vw, 26rem"
                  priority={index < 2}
                />

                {/* Subdued Gradient Overlay (Darkens on Hover) */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity duration-700" />

                {/* Spotlight Text Clip-Path Reveal Overlay */}
                <div className={`absolute inset-0 bg-[#050505]/70 backdrop-blur-sm flex flex-col items-center justify-center pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
                  {/* Top line sliding down */}
                  <div className="overflow-hidden">
                    <span 
                      className={`block font-space text-2xl sm:text-4xl font-black uppercase tracking-[0.1em] text-[#FAFAFA] transition-transform duration-700 delay-100 ease-[cubic-bezier(0.16,1,0.3,1)] ${isHovered ? 'translate-y-0' : 'translate-y-[120%]'}`}
                    >
                      View
                    </span>
                  </div>
                  {/* Bottom line sliding up */}
                  <div className="overflow-hidden mt-1 sm:mt-2">
                    <span 
                      className={`block font-space text-2xl sm:text-4xl font-black uppercase tracking-[0.1em] text-[#81D8D0] transition-transform duration-700 delay-150 ease-[cubic-bezier(0.16,1,0.3,1)] ${isHovered ? 'translate-y-0' : '-translate-y-[120%]'}`}
                    >
                      Product
                    </span>
                  </div>
                </div>
              </div>

              {/* Text Below Card */}
              <div className="mt-6 relative z-10 pl-2">
                <h3 className="font-space text-2xl md:text-3xl font-bold text-[#FAFAFA] leading-[1.1] mb-2 tracking-tight group-hover:text-[#81D8D0] transition-colors duration-500 will-change-transform">
                  {product.title}
                </h3>
                <p className="text-[#888888] text-base leading-relaxed font-medium transition-colors duration-500 group-hover:text-[#cccccc]">
                  {product.description}
                </p>
              </div>

              {/* Accent Line Expand on Hover */}
              <div className="absolute -bottom-5 left-2 h-[2px] bg-[#81D8D0] w-0 group-hover:w-12 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]" />
            </div>
          );
        })}
      </div>
    </section>
  );
}
