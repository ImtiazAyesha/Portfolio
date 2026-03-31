"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

// ── Toggle this to hide/show the "Available for work" badge ──
const IS_AVAILABLE = true;

export default function Footer() {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const socialRef   = useRef<HTMLDivElement>(null);

  /* ── 1. Word-by-word clipPath headline reveal (IntersectionObserver) ── */
  useEffect(() => {
    const h2 = headlineRef.current;
    if (!h2) return;

    // Collect every <span data-word> we rendered
    const words = Array.from(h2.querySelectorAll<HTMLElement>("[data-word]"));

    // Set starting state
    gsap.set(words, {
      clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)",
      y: "110%",
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          gsap.to(words, {
            clipPath: "polygon(0 0%, 100% 0%, 100% 100%, 0 100%)",
            y: "0%",
            stagger: 0.12,
            duration: 1,
            ease: "power4.out",
          });
          observer.disconnect();
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(h2);
    return () => observer.disconnect();
  }, []);

  /* ── 4. Social links stagger via IntersectionObserver + CSS class ── */
  useEffect(() => {
    const el = socialRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          el.classList.add("footer-socials-in-view");
          observer.disconnect();
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      id="contact"
      className="relative z-20 bg-[#111111] px-6 md:px-12 py-12 md:py-24 border-t border-[#333333] text-[#FAFAFA]"
    >
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-start md:items-end gap-16">

        {/* ── Left column: headline + email CTA ── */}
        <div className="flex flex-col gap-8 max-w-2xl">

          {/* 1. Headline — each word wrapped for clip reveal */}
          <h2
            ref={headlineRef}
            className="font-space text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none"
          >
            {/* Line 1 */}
            <span className="inline-flex flex-wrap gap-x-[0.25em] overflow-hidden">
              {["Let's", "build"].map((w) => (
                <span key={w} data-word className="inline-block">
                  {w}
                </span>
              ))}
            </span>
            <br />
            {/* Line 2 — teal colour kept */}
            <span className="inline-flex flex-wrap gap-x-[0.25em] overflow-hidden text-[#81D8D0]">
              {["The", "Future."].map((w) => (
                <span key={w} data-word className="inline-block">
                  {w}
                </span>
              ))}
            </span>
          </h2>

          {/* 2. Email CTA with animated underline */}
          <a
            href="mailto:hello@example.com"
            className="footer-email-link group inline-flex items-center gap-4 text-xl md:text-3xl font-medium hover:text-[#81D8D0] transition-colors w-max"
          >
            <span className="relative pb-1">
              Reach out via email
            </span>
            <svg
              className="w-6 h-6 transition-transform group-hover:translate-x-2 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>

        {/* ── Right column: badge + socials + copyright ── */}
        <div className="flex flex-col md:items-end gap-6">

          {/* 3. Availability badge */}
          {IS_AVAILABLE && (
            <div className="inline-flex items-center gap-2 rounded-full border border-[#333333] px-4 py-1.5 text-xs font-semibold text-[#A0A0A0]">
              <span className="animate-pulse w-1.5 h-1.5 rounded-full bg-[#81D8D0] flex-shrink-0" />
              Available for work
            </div>
          )}

          {/* 4. Social links — stagger via CSS + IntersectionObserver class */}
          <div
            ref={socialRef}
            className="flex gap-6 font-medium text-[#A0A0A0] md:justify-end footer-socials"
          >
            <a href="#" className="footer-social-link hover:text-[#FAFAFA] transition-colors" style={{ "--delay": "0ms" } as React.CSSProperties}>
              LinkedIn
            </a>
            <a href="#" className="footer-social-link hover:text-[#FAFAFA] transition-colors" style={{ "--delay": "80ms" } as React.CSSProperties}>
              GitHub
            </a>
            <a href="#" className="footer-social-link hover:text-[#FAFAFA] transition-colors" style={{ "--delay": "160ms" } as React.CSSProperties}>
              Twitter
            </a>
          </div>

          {/* 5. Two-column copyright bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-2 md:gap-6 mt-2">
            <p className="text-[#555555] text-sm">
              &copy; {new Date().getFullYear()} Hassan. All rights reserved.
            </p>
            <p className="text-[#333333] text-xs">
              Built with Next.js · GSAP · Tailwind
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}
