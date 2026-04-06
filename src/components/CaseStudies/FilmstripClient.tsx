"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Post {
  title: string;
  slug: string;
  categoryName: string | null;
  categoryDesc: string | null;
  mainImageUrl: string | null;
}

const CARD_THEMES = [
  { bg: "#0E0E0E", text: "text-white",     meta: "text-white/50",     badge: "bg-white/10 text-white/80",  btn: "bg-white text-[#111111] hover:bg-[#3bd6c6]" },
  { bg: "#F0F0EE", text: "text-[#111111]", meta: "text-[#888888]",    badge: "bg-black/5 text-[#444444]",  btn: "bg-[#111111] text-white hover:bg-[#3bd6c6] hover:text-[#111111]" },
  { bg: "#3bd6c6", text: "text-[#111111]", meta: "text-[#111111]/60", badge: "bg-black/10 text-[#111111]", btn: "bg-[#111111] text-white hover:bg-white" },
  { bg: "#1a1a2e", text: "text-white",     meta: "text-white/50",     badge: "bg-white/10 text-white/80",  btn: "bg-[#3bd6c6] text-[#111111] hover:bg-white" },
  { bg: "#2d2d2d", text: "text-white",     meta: "text-white/50",     badge: "bg-white/10 text-white/80",  btn: "bg-white text-[#111111] hover:bg-[#3bd6c6]" },
];

export default function FilmstripClient({ posts }: { posts: Post[] }) {
  const sectionRef  = useRef<HTMLElement>(null);   // tall scroll-space section
  const stickyRef   = useRef<HTMLDivElement>(null); // sticky 100vh container
  const trackRef    = useRef<HTMLDivElement>(null); // the sliding flex row
  const progressRef = useRef<HTMLDivElement>(null);
  const counterRef  = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const sticky  = stickyRef.current;
    const track   = trackRef.current;
    if (!section || !sticky || !track) return;

    // Total pixels the track must slide to show the last card
    const getShift = () => track.scrollWidth - window.innerWidth;

    /* ── Single ScrollTrigger watching the OUTER tall section ── */
    const st = ScrollTrigger.create({
      trigger: section,        // the tall element that creates scroll space
      start: "top top",
      end: "bottom bottom",    // scroll for full height of outer section
      scrub: 1,
      onUpdate(self) {
        // Translate track horizontally based on scroll progress
        gsap.set(track, { x: -getShift() * self.progress });

        // Progress bar
        if (progressRef.current) {
          progressRef.current.style.width = `${self.progress * 100}%`;
        }
        // Card counter
        if (counterRef.current) {
          const idx = Math.min(
            Math.floor(self.progress * posts.length) + 1,
            posts.length
          );
          counterRef.current.textContent = String(idx).padStart(2, "0");
        }
      },
    });

    /* ── Title clip reveals (fire once when card scrolls into horizontal view) ── */
    gsap.utils.toArray<HTMLElement>(".fs-title-wrap").forEach((wrap) => {
      const title = wrap.querySelector<HTMLElement>(".fs-title");
      if (!title) return;
      gsap.fromTo(
        title,
        { yPercent: 110, clipPath: "polygon(0 100%,100% 100%,100% 100%,0 100%)" },
        {
          yPercent: 0,
          clipPath: "polygon(0 0%,100% 0%,100% 100%,0 100%)",
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: wrap.closest(".fs-card"),
            containerAnimation: st.animation ?? undefined,
            start: "left 85%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    /* ── Meta fade-ups ── */
    gsap.utils.toArray<HTMLElement>(".fs-meta").forEach((m) => {
      gsap.fromTo(
        m,
        { opacity: 0, y: 18 },
        {
          opacity: 1, y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: m.closest(".fs-card"),
            containerAnimation: st.animation ?? undefined,
            start: "left 75%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    ScrollTrigger.refresh();

    return () => {
      st.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, [posts.length]);

  return (
    <main className="bg-[#fafafa] pt-32 xl:pt-40 pb-20 min-h-screen">
      
      {/* ── Normal Header Flow ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-16">
        <p className="text-[#3bd6c6] uppercase tracking-[0.3em] text-[10px] font-semibold font-space mb-2">
          Selected Work
        </p>
        <div className="flex flex-row items-end justify-between gap-4 sm:gap-6 mt-4">
          <h1 className="font-corpta font-medium text-[clamp(2.5rem,8vw,5rem)] uppercase tracking-tighter text-[#111111] leading-none">
            Case Studies
          </h1>
          <div className="flex flex-col items-end mb-1 md:mb-2">
            <span className="font-space text-3xl md:text-5xl font-black text-[#111111] leading-none tabular-nums">
              <span ref={counterRef}>01</span>
            </span>
            <span className="text-[#888888] font-space font-medium text-[10px] md:text-xs tabular-nums mt-1">
              / {String(posts.length).padStart(2, "0")}
            </span>
          </div>
        </div>
      </div>

      {/* ── Tall wrapper creates scroll space ── */}
      <section
        ref={sectionRef}
        style={{ height: `${posts.length * 85}dvh` }}
        className="relative w-full"
      >
        {/* ── Sticky container (Height is dynamic dvh) ── */}
        <div
          ref={stickyRef}
          className="sticky top-[10dvh] md:top-[12dvh] w-full h-[75dvh] flex items-center overflow-hidden"
        >
          {/* Progress bar anchored to bottom of slider */}
          <div className="absolute bottom-0 left-0 right-0 z-40 h-[2px] bg-[#e6e6e6]">
            <div ref={progressRef} className="h-full bg-[#3bd6c6] w-0 transition-none" />
          </div>

          <div
            ref={trackRef}
            className="flex gap-8 px-6 md:px-12 items-center h-full pb-8"
            style={{ width: "max-content", willChange: "transform" }}
          >
            {posts.map((post, i) => {
              const theme = CARD_THEMES[i % CARD_THEMES.length];

              return (
                <div
                  key={post.slug}
                  className="fs-card relative flex-shrink-0 w-[90vw] md:w-[70vw] lg:w-[60vw] h-full max-h-[650px] rounded-[2rem] overflow-hidden shadow-2xl"
                  style={{ backgroundColor: theme.bg }}
                >
                  {/* Parallax image inside rounded card */}
                  {post.mainImageUrl && (
                    <div
                      className="fs-img absolute inset-0 h-full w-[120%] -left-[10%]"
                    >
                      <img
                        src={post.mainImageUrl}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                    </div>
                  )}

                  {!post.mainImageUrl && (
                    <div className="absolute inset-0 opacity-[0.035]"
                      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "200px" }} />
                  )}

                  {/* Card Content */}
                  <div className="absolute bottom-12 left-8 md:left-16 right-8 md:right-auto md:max-w-[45vw] z-10">
                    <p className={`fs-meta ${theme.meta} font-space text-[10px] uppercase tracking-[0.3em] mb-3`}>
                      {String(i + 1).padStart(2, "0")} — {String(posts.length).padStart(2, "0")}
                    </p>

                    {post.categoryName && (
                      <div className={`fs-meta inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider mb-5 ${theme.badge}`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#3bd6c6]" />
                        {post.categoryName}
                      </div>
                    )}

                    <div className="fs-title-wrap overflow-hidden mb-5">
                      <h2 className={`fs-title font-space font-black uppercase tracking-tighter leading-[0.88] ${theme.text}`}
                        style={{ fontSize: "clamp(2rem, 5vw, 4.5rem)" }}>
                        {post.title}
                      </h2>
                    </div>

                    {post.categoryDesc && (
                      <p className={`fs-meta text-sm md:text-base leading-relaxed mb-8 max-w-md ${theme.meta}`}>
                        {post.categoryDesc}
                      </p>
                    )}

                    <Link
                      href={`/case-studies/${post.slug}`}
                      className={`fs-meta inline-flex items-center gap-3 px-8 py-4 rounded-full font-space font-semibold text-sm uppercase tracking-wider transition-all duration-300 shadow-xl hover:-translate-y-1 ${theme.btn}`}
                    >
                      Read Case Study
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
