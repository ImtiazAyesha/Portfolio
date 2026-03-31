"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const projectsData = [
  {
    title: "Neural Search Initiative",
    category: "AI Architecture",
    description: "An incredibly fast document retrieval engine leveraging state-of-the-art vector embeddings to search through millions of enterprise documents.",
    year: "2025"
  },
  {
    title: "Evren Interface",
    category: "Web Application",
    description: "A gorgeous, high-performance administrative dashboard built with Next.js, featuring real-time collaborative editing and smooth GSAP transitions.",
    year: "2024"
  },
  {
    title: "Vision Core Pipeline",
    category: "Machine Learning",
    description: "Scalable computer vision pipeline trained on millions of parameters, reducing model latency by 45% for real-time edge devices.",
    year: "2024"
  }
];

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);
  // Store refs to arrow circle divs for magnetic effect
  const arrowRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Existing scroll reveal
      gsap.from(".project-row", {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        }
      });

      // Horizontal rule scaleX reveal (enhancement 3)
      if (borderRef.current) {
        gsap.from(borderRef.current, {
          scaleX: 0,
          transformOrigin: "left center",
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          }
        });
      }
    }, sectionRef);

    // GSAP magnetic effect per row (enhancement 2)
    const rows = sectionRef.current?.querySelectorAll<HTMLElement>(".project-row");
    const cleanupFns: (() => void)[] = [];

    rows?.forEach((row, i) => {
      const circle = arrowRefs.current[i];
      if (!circle) return;

      const onMouseMove = (e: MouseEvent) => {
        const rect = circle.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = Math.max(-8, Math.min(8, (e.clientX - cx) * 0.35));
        const dy = Math.max(-8, Math.min(8, (e.clientY - cy) * 0.35));
        gsap.to(circle, { x: dx, y: dy, duration: 0.3, ease: "power2.out" });
      };

      const onMouseLeave = () => {
        gsap.to(circle, { x: 0, y: 0, duration: 0.3, ease: "power2.out" });
      };

      row.addEventListener("mousemove", onMouseMove);
      row.addEventListener("mouseleave", onMouseLeave);

      cleanupFns.push(() => {
        row.removeEventListener("mousemove", onMouseMove);
        row.removeEventListener("mouseleave", onMouseLeave);
      });
    });

    return () => {
      ctx.revert();
      cleanupFns.forEach(fn => fn());
    };
  }, []);

  return (
    <>
      {/* Bridge div — must match the Experience section bg (#FAFAFA) so the rounded-t corners are invisible */}
      <div
        aria-hidden="true"
        className="relative z-10 bg-[#FAFAFA] h-20 pointer-events-none"
      />

      <section
        id="projects"
        ref={sectionRef}
        className="relative z-20 bg-[#111111] py-24 md:py-40 px-6 md:px-12 text-[#FAFAFA] rounded-t-[3rem] md:rounded-t-[5rem] overflow-hidden -mt-20 md:-mt-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <h2 className="font-space text-4xl md:text-7xl font-black uppercase tracking-tighter">
              Selected<br />Work.
            </h2>
            <p className="max-w-sm text-[#A0A0A0] text-lg font-medium">
              A curated collection of impactful AI models and highly polished web experiences.
            </p>
          </div>

          <div className="flex flex-col">
            {/* Enhancement 3: animated border-t */}
            <div
              ref={borderRef}
              className="border-t border-[#333333]"
              style={{ transformOrigin: "left center" }}
            />

            {projectsData.map((project, index) => (
              <div
                key={index}
                className="project-row group flex flex-col md:flex-row md:items-center justify-between border-b border-[#333333] py-10 md:py-16 gap-6 cursor-pointer transition-colors hover:bg-[#1A1A1A] px-4 -mx-4 rounded-xl"
              >
                <div className="flex flex-col gap-2 md:w-1/3">
                  {/* Enhancement 1: row counter + divider + category */}
                  <div className="inline-flex items-center">
                    <span className="font-space text-[#333333] text-sm font-medium mr-4 tabular-nums">
                      0{index + 1}
                    </span>
                    <span className="border-l border-[#333333] pl-4 text-[#81D8D0] font-space text-sm font-bold uppercase tracking-wider transition-transform duration-300 ease-out -translate-x-1 group-hover:translate-x-0 opacity-60 group-hover:opacity-100">
                      {project.category}
                    </span>
                  </div>
                  <h3 className="font-space text-3xl md:text-5xl font-bold tracking-tight group-hover:text-[#FAFAFA] text-[#E5E5E5] transition-colors">
                    {project.title}
                  </h3>
                </div>

                <div className="md:w-1/3">
                  <p className="text-[#A0A0A0] text-lg leading-relaxed">{project.description}</p>
                </div>

                <div className="flex items-center justify-between md:w-1/6 md:justify-end">
                  <span className="text-[#555555] font-space font-medium text-xl">{project.year}</span>
                  {/* Enhancement 2: magnetic arrow circle (ref stored for GSAP) */}
                  <div
                    ref={el => { arrowRefs.current[index] = el; }}
                    className="w-12 h-12 rounded-full border border-[#333333] flex items-center justify-center group-hover:bg-[#FAFAFA] group-hover:text-[#111111] group-hover:border-[#FAFAFA] transition-all duration-300 group-hover:scale-110"
                  >
                    <svg className="w-5 h-5 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
