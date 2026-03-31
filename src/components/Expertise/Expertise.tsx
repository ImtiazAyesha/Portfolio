"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const expertiseData = [
  {
    title: "AI/ML Engineering",
    description: "Designing, training, and deploying scalable deep learning models and intelligent pipelines for complex enterprise solutions.",
    tags: ["PyTorch", "TensorFlow", "Transformers", "LLMs"],
  },
  {
    title: "Web Experiences",
    description: "Crafting highly performant, accessible, and motion-rich user interfaces with modern React frameworks and WebGL.",
    tags: ["Next.js", "React", "Three.js", "GSAP"],
  },
  {
    title: "System Architecture",
    description: "Building resilient microservices and deploying highly available infrastructure tailored for data-intensive applications.",
    tags: ["AWS", "Docker", "Kubernetes", "PostgreSQL"],
  }
];

export default function Expertise() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const headingWordsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const subtitleRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const cleanupFns: Array<() => void> = [];
    cardsRef.current.forEach(card => {
      if (!card) return;
      const handleMouseMove = (e: MouseEvent) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
      };
      card.addEventListener('mousemove', handleMouseMove);
      cleanupFns.push(() => card.removeEventListener('mousemove', handleMouseMove));
    });
    return () => {
      cleanupFns.forEach(fn => fn());
    };
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        }
      });

      tl.fromTo(headingWordsRef.current, {
        yPercent: 100,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)"
      }, {
        yPercent: 0,
        clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
        stagger: 0.1,
        duration: 1,
        ease: "power3.out"
      }, 0)
      .from(subtitleRef.current, {
        opacity: 0,
        y: 20,
        duration: 1,
        ease: "power3.out"
      }, 0.3)
      .from(cardsRef.current, {
        y: 60,
        opacity: 0,
        stagger: 0.15,
        duration: 1,
        ease: "power3.out",
      }, 0.5);

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section id="expertise" ref={sectionRef} className="relative z-40 bg-[#FAFAFA] py-24 md:py-40 px-6 md:px-12">
      <div className="relative z-50 mx-auto max-w-7xl">
        <div className="mb-16 md:mb-24">
          <h2 className="font-space text-4xl md:text-7xl font-black text-[#111111] uppercase tracking-tighter">
            <span className="overflow-hidden inline-block"><span ref={(el) => { headingWordsRef.current[0] = el; }} className="inline-block">Areas</span></span>{" "}
            <span className="overflow-hidden inline-block"><span ref={(el) => { headingWordsRef.current[1] = el; }} className="inline-block">of</span></span><br />
            <span className="overflow-hidden inline-block"><span ref={(el) => { headingWordsRef.current[2] = el; }} className="inline-block pb-2 -mb-2">Intelligence.</span></span>
          </h2>
          <p ref={subtitleRef} className="mt-6 max-w-2xl text-lg md:text-xl text-[#555555]">
            Bridging the gap between cutting-edge artificial intelligence models and high-end interactive web applications.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {expertiseData.map((item, index) => (
            <div 
              key={item.title} 
              ref={(el) => { cardsRef.current[index] = el; }}
              className="h-full flex flex-col"
            >
              <div className="card-spotlight flex-1 group relative rounded-3xl border border-[#E5E5E5] bg-white p-8 md:p-10 transition-all duration-500 hover:shadow-2xl hover:shadow-[#81D8D0]/20 hover:-translate-y-2">
                <div className="relative z-10 w-full h-full">
                  <div className="absolute -top-4 -right-2 font-space text-xs font-bold text-[#E5E5E5] pointer-events-none select-none">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <h3 className="font-space text-2xl font-bold text-[#111111] mb-4">{item.title}</h3>
                  <p className="text-[#555555] mb-8 leading-relaxed">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {item.tags.map(tag => (
                      <span key={tag} className="rounded-full bg-[#FAFAFA] border border-[#E5E5E5] px-3 py-1 text-xs font-semibold text-[#333333] transition-colors duration-200 hover:border-[#81D8D0] hover:text-[#81D8D0]">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
