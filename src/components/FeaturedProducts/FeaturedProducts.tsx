"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Product {
  id: number;
  title: string;
  category: string;
  role: string;
  description: string;
  image: string;
  link: string;
}

const productsData: Product[] = [
  {
    id: 1,
    title: "AI Search Engine Version 2.0",
    category: "Search & Discovery",
    role: "Product Architect",
    description: "Reinventing document retrieval with pure generative embeddings, allowing for semantic search capabilities that understand context beyond keywords.",
    image: "/images/products/product_banner_1_1775044347485.png",
    link: "#"
  },
  {
    id: 2,
    title: "Vision Edge Architecture",
    category: "Computer Vision",
    role: "Lead Engineer",
    description: "Deploying high-performance models to incredibly constrained devices, optimizing for latency and power efficiency without sacrificing accuracy.",
    image: "/images/products/product_banner_2_1775044363001.png",
    link: "#"
  },
  {
    id: 3,
    title: "Neural Interface Sandbox",
    category: "UI Architecture",
    role: "Frontend Specialist",
    description: "Interactive real-time visualizations for complex vector spaces, enabling researchers to explore multi-dimensional data intuitively.",
    image: "/images/products/product_banner_3_1775044378823.png",
    link: "#"
  },
  {
    id: 4,
    title: "Evren Core Platform",
    category: "Enterprise AI",
    role: "System Designer",
    description: "The flagship enterprise dashboard unifying all AI ops in one hub, providing a centralized control plane for model monitoring and management.",
    image: "/images/products/product_banner_4_1775044406569.png",
    link: "#"
  }
];


export default function FeaturedProducts() {
  const sectionRef = useRef<HTMLElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeDot, setActiveDot] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [activeData, setActiveData] = useState<{ product: Product; rect: DOMRect } | null>(null);
  
  // Modal Layout Refs
  const imageRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const openProduct = (product: Product, event: React.MouseEvent) => {
    const wrapper = (event.currentTarget as HTMLElement).closest('.product-card-wrap');
    const imageContainer = wrapper?.querySelector('[data-product-card]');
    if (imageContainer) {
      const rect = imageContainer.getBoundingClientRect();
      setActiveData({ product, rect });
    }
  };

  const closeProduct = () => {
    if (tlRef.current) tlRef.current.reverse();
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollLeft = e.currentTarget.scrollLeft;
    const itemWidth = e.currentTarget.scrollWidth / productsData.length;
    const index = Math.round(scrollLeft / itemWidth);
    if (index !== activeDot && index >= 0 && index < productsData.length) {
      setActiveDot(index);
    }
  };

  useEffect(() => {
    if (!activeData || !imageRef.current || !panelRef.current || !closeRef.current) return;

    const isMobile = window.innerWidth < 768;
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onReverseComplete: () => {
        setActiveData(null);
        document.body.style.overflow = "";
      },
    });
    tlRef.current = tl;

    gsap.set(imageRef.current, {
      top: activeData.rect.top,
      left: activeData.rect.left,
      width: activeData.rect.width,
      height: activeData.rect.height,
      borderRadius: "1.2rem",
    });

    gsap.set(panelRef.current, {
      xPercent: isMobile ? 0 : 100,
      yPercent: isMobile ? 100 : 0,
      width: isMobile ? "100vw" : "35vw",
      height: "100dvh",
      bottom: isMobile ? 0 : "auto",
      top: isMobile ? 0 : 0,
      right: 0,
      position: "fixed",
    });

    gsap.set(".modal-stagger", { y: 30, opacity: 0 });
    gsap.set(closeRef.current, { scale: 0.5, opacity: 0, rotation: -90 });

    tl.to(imageRef.current, {
      top: isMobile ? activeData.rect.top : 0, 
      left: isMobile ? activeData.rect.left : 0,
      width: isMobile ? activeData.rect.width : "65vw",
      height: isMobile ? activeData.rect.height : "100dvh",
      borderRadius: 0,
      autoAlpha: isMobile ? 0 : 1,
      duration: 1.1,
      ease: "power4.inOut",
    }, "start");

    tl.to(panelRef.current, { xPercent: 0, yPercent: 0, duration: 1.1, ease: "power4.inOut" }, "start");
    tl.to(".modal-stagger", { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "start+=0.7");
    tl.to(closeRef.current, { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: "back.out(1.5)" }, "start+=1.0");

    return () => { tl.kill(); }
  }, [activeData]);

  const scrollToDot = (index: number) => {
    setActiveDot(index);
    if (scrollContainerRef.current) {
      const items = scrollContainerRef.current.children;
      if (items[index]) {
        items[index].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }
  };

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
        .hide-scroll::-webkit-scrollbar { display: none; }
        .hide-scroll { -ms-overflow-style: none; scrollbar-width: none; }
        
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
          <h2 className="theme-heading font-corpta text-5xl md:text-7xl lg:text-[6rem] font-medium uppercase tracking-tighter text-[#111111] leading-[0.9]">
            Selected<br />Products.
          </h2>
        </div>
        <p className="theme-paragraph max-w-md text-[#555555] text-xl font-medium leading-relaxed pb-4">
          A showcase of platforms, products, and deep-tech architectures crafted for the modern AI ecosystem.
        </p>
      </div>

      {/* ── Staggered Asymmetric Grid (Mobile Horizontal Swipe) ── */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="products-grid hide-scroll flex overflow-x-auto snap-x snap-mandatory md:grid md:grid-cols-2 gap-6 md:gap-x-12 md:gap-y-24 mt-16 px-6 md:px-12 max-w-[65rem] mx-auto relative z-10 w-full pb-10"
      >
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
              onClick={(e) => {
                if (window.innerWidth < 768) {
                  openProduct(product, e);
                }
              }}
              className={`product-card-wrap snap-center shrink-0 relative group w-[85vw] sm:w-[350px] md:w-full ${offsetClass} transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer mx-auto max-w-[26rem]
                ${isOtherHovered ? 'md:opacity-20 md:blur-sm md:scale-[0.97]' : 'opacity-100 blur-0 scale-100'}
              `}
            >
              {/* Image Card Container */}
              <div 
                data-product-card
                className="relative w-full aspect-[4/5] bg-[#111111] overflow-hidden rounded-[1.2rem] border border-[#222222] shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              >
                
                {/* Main Image */}
                <Image 
                  src={product.image} 
                  alt={product.title}
                  fill
                  className={`object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform ${isHovered ? 'scale-110' : 'scale-100'}`}
                  sizes="(max-width: 768px) 100vw, 26rem"
                  priority={index < 2}
                />

                {/* Smooth Dark Gradient Overlay (Rises on Hover) */}
                <div className={`absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent pointer-events-none transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isHovered ? 'opacity-100' : 'opacity-0'}`} />

                {/* Bottom-Anchored CTA Pill */}
                <div className={`absolute inset-x-0 bottom-0 pb-8 px-6 flex justify-center items-end pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] z-10 ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                   <div 
                     onClick={(e) => openProduct(product, e)}
                     className="inline-flex items-center gap-3 bg-[#333333]/90 hover:bg-[#444444] backdrop-blur-md border border-white/10 text-[#FAFAFA] px-7 py-3.5 rounded-full font-space font-bold uppercase tracking-widest text-[11px] shadow-2xl transition-colors duration-300 pointer-events-auto cursor-pointer"
                   >
                     View Product
                     <svg className="w-4 h-4 text-[#81D8D0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                     </svg>
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

      {/* ── Mobile Navigation Dots ── */}
      <div className="flex md:hidden justify-center items-center gap-3 mt-2 mb-8 relative z-20">
        {productsData.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToDot(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              activeDot === i ? 'w-8 h-2 bg-[#81D8D0]' : 'w-2 h-2 bg-[#555555]'
            }`}
          />
        ))}
      </div>

      {activeData && (
        <div className="fixed inset-0 z-[100] pointer-events-auto">
          {/* Highest Layer Global Close Button */}
          <button
            ref={closeRef}
            onClick={closeProduct}
            className="absolute z-[110] top-6 right-6 md:top-12 md:right-12 w-12 h-12 md:w-14 md:h-14 bg-[#333333]/90 backdrop-blur-md hover:bg-[#FAFAFA] text-[#FAFAFA] hover:text-[#111111] rounded-full flex items-center justify-center transition-colors duration-300 cursor-pointer shadow-xl border border-white/10"
          >
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            ref={imageRef}
            className="absolute z-[105] overflow-hidden bg-[#111111]"
          >
            <Image 
              src={activeData.product.image}
              alt={activeData.product.title}
              fill
              priority
              className="object-cover"
            />
          </div>

          <div
            ref={panelRef}
            className="bg-[#111111] z-[102] flex flex-col items-start justify-start md:justify-center w-full min-h-screen px-6 pt-24 pb-12 md:p-16 lg:p-24 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] overflow-y-auto hide-scrollbar"
          >
            {/* ── Unified Responsive Content Layout ── */}
            <div className="w-full max-w-lg">
              <span className="modal-stagger block font-space text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#81D8D0] mb-3 md:mb-4">
                {activeData.product.category}
              </span>
              <h2 className="modal-stagger font-space text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-[#FAFAFA] leading-[0.9] mb-6 md:mb-8">
                {activeData.product.title}
              </h2>
              
              {/* ── Inline Mobile Image Flow ── */}
              <div className="md:hidden modal-stagger relative w-full aspect-video rounded-2xl overflow-hidden mb-8 shadow-2xl border border-[#222222]">
                <Image 
                  src={activeData.product.image}
                  alt={activeData.product.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="modal-stagger flex flex-col gap-1 md:gap-2 mb-8 md:mb-10">
                <span className="text-[#555555] font-space text-xs md:text-sm uppercase tracking-widest font-bold">Role</span>
                <span className="text-[#A0A0A0] text-base md:text-lg font-medium">{activeData.product.role}</span>
              </div>

              <div className="modal-stagger w-12 h-px bg-[#333333] mb-8 md:mb-10" />

              <p className="modal-stagger text-[#A0A0A0] text-base md:text-xl leading-relaxed mb-10 md:mb-12">
                {activeData.product.description}
              </p>

              <button className="modal-stagger group relative inline-flex items-center gap-4 bg-[#81D8D0] hover:bg-[#6BCFC5] text-[#111111] px-6 py-3.5 md:px-8 md:py-4 rounded-full font-space font-bold uppercase tracking-wider text-xs md:text-sm transition-colors duration-300 overflow-hidden">
                <span className="relative z-10">Explore Project</span>
                <span className="relative z-10 w-7 h-7 md:w-8 md:h-8 rounded-full bg-[#111111]/10 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
                  <svg className="w-3.5 h-3.5 md:w-4 md:h-4 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
