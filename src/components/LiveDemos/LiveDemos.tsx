"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  video: string;
  role: string;
}

const projectsData: Project[] = [
  {
    id: 1,
    title: "Neural Expanding",
    category: "Infrastructure",
    role: "Lead Architect",
    description: "A dynamic growth system adapting to user data flows in real-time, providing infinite scalability and resilient load balancing.",
    video: "/demos/Expanding.mp4",
  },
  {
    id: 2,
    title: "Human Crafted",
    category: "Interface",
    role: "Frontend Engineer",
    description: "A delicate balance between algorithmic precision and human-centered design.",
    video: "/demos/Human Crafted.mp4",
  },
  {
    id: 3,
    title: "Intelligence",
    category: "Machine Learning",
    role: "ML Researcher",
    description: "Deep learning protocols mapped to intuitive visual node graphs.",
    video: "/demos/Intelligence.mp4",
  },
  {
    id: 4,
    title: "Knowledge Base",
    category: "Data Systems",
    role: "Full Stack Developer",
    description: "A retrieval augmented generation engine designed to surface insights.",
    video: "/demos/Knowledge.mp4",
  },
  {
    id: 5,
    title: "Partnership",
    category: "Ecosystem",
    role: "Technical Lead",
    description: "Collaborative AI pipelines designed for robust integrations.",
    video: "/demos/Partnership.mp4",
  }
];

export default function LiveDemos() {
  const [activeData, setActiveData] = useState<{ project: Project; rect: DOMRect } | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const containerRef = useRef<HTMLElement>(null);

  // Modal Layout Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  // ── Full-Screen FLIP Modal Logic (On Click) ──
  const openProject = (project: Project, event: React.MouseEvent<HTMLDivElement>) => {
    const cardEl = event.currentTarget.closest('[data-bento-card]');
    if (cardEl) {
      const rect = cardEl.getBoundingClientRect();
      setActiveData({ project, rect });
    }
  };

  const closeProject = () => {
    if (tlRef.current) tlRef.current.reverse();
  };

  useEffect(() => {
    if (!activeData || !videoRef.current || !panelRef.current || !closeRef.current) return;

    const isMobile = window.innerWidth < 768;
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onReverseComplete: () => {
        setActiveData(null);
        document.body.style.overflow = "";
      },
    });
    tlRef.current = tl;

    gsap.set(videoRef.current, {
      top: activeData.rect.top,
      left: activeData.rect.left,
      width: activeData.rect.width,
      height: activeData.rect.height,
      borderRadius: "1.5rem",
      objectFit: "cover",
    });

    gsap.set(panelRef.current, {
      xPercent: isMobile ? 0 : 100,
      yPercent: isMobile ? 100 : 0,
      width: isMobile ? "100vw" : "35vw",
      height: isMobile ? "45dvh" : "100dvh",
      bottom: isMobile ? 0 : "auto",
      top: isMobile ? "auto" : 0,
      right: 0,
      position: "absolute",
    });

    gsap.set(".modal-stagger", { y: 30, opacity: 0 });
    gsap.set(closeRef.current, { scale: 0.5, opacity: 0, rotation: -90 });

    tl.to(videoRef.current, {
      top: 0, left: 0,
      width: isMobile ? "100vw" : "65vw",
      height: isMobile ? "55dvh" : "100dvh",
      borderRadius: 0,
      duration: 1.2,
      ease: "power4.inOut",
    }, "start");

    tl.to(panelRef.current, { xPercent: 0, yPercent: 0, duration: 1.2, ease: "power4.inOut" }, "start");
    tl.to(".modal-stagger", { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: "power3.out" }, "start+=0.7");
    tl.to(closeRef.current, { scale: 1, opacity: 1, rotation: 0, duration: 0.6, ease: "back.out(1.5)" }, "start+=1.0");

    return () => { tl.kill(); }
  }, [activeData]);


  return (
    <>
      <section id="demos" ref={containerRef} className="relative z-20 bg-[#FAFAFA] pt-32 pb-48 overflow-hidden">
        
        <div className="w-full max-w-[90rem] mx-auto px-6 md:px-12 mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-8 h-px bg-[#81D8D0]" />
              <span className="font-space text-xs font-bold uppercase tracking-[0.2em] text-[#81D8D0]">
                Live Previews
              </span>
            </div>
            <h2 className="font-space text-5xl md:text-7xl font-black uppercase tracking-tighter text-[#111111]">
              Demos.
            </h2>
          </div>
          <p className="max-w-sm text-[#555555] text-lg font-medium pb-2">
            Interactive case studies showcasing complex animations, state management, and real-time operations.
          </p>
        </div>

        <div className="w-full max-w-[90rem] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 md:gap-6 w-full mt-8 h-auto min-h-[600px] md:h-[600px] lg:h-[700px] relative">
            {projectsData.map((project, index) => {
              const isFeature = index === 0;
              const isHovered = hoveredIndex === index;
              
              return (
                <div 
                  key={project.id}
                  data-bento-card
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`relative rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group bg-[#111111] shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-transform duration-500 will-change-transform hover:shadow-[0_30px_60px_rgba(0,0,0,0.15)]
                    ${isFeature ? 'md:col-span-2 md:row-span-2 z-10' : 'col-span-1 row-span-1 aspect-square md:aspect-auto z-0'}
                  `}
                >
                  <video
                    src={`${project.video}#t=0.001`}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)]
                      ${isHovered ? 'opacity-100 scale-100 filter-none' : 'opacity-60 scale-[1.02] filter grayscale-[40%]'}
                    `}
                  />
                  
                  <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-[1s]
                    ${isHovered ? 'from-[#050505] via-[#050505]/40 to-transparent opacity-90' : 'from-[#111111] via-[#111111]/20 to-transparent opacity-80'}
                  `} />

                  <div className={`absolute left-0 bottom-0 flex flex-col justify-end w-full h-full pointer-events-none transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)]
                    ${isFeature ? 'p-8 md:p-12' : 'p-6 items-start'}
                  `}>
                    <span className={`block font-space font-bold uppercase tracking-[0.2em] transition-all duration-500
                      ${isHovered ? 'text-[#81D8D0] mb-3' : 'text-[#81D8D0]/70 mb-2'}
                      ${isFeature ? 'text-xs md:text-sm' : 'text-[10px] sm:text-xs'}
                    `}>
                      {project.category}
                    </span>
                    
                    <h3 className={`font-space font-black uppercase tracking-tighter text-[#FAFAFA] transition-all duration-500
                      ${isHovered ? 'text-white' : 'text-white/80'}
                      ${isFeature ? 'text-4xl md:text-5xl lg:text-6xl mb-4 leading-tight' : 'text-xl sm:text-2xl leading-[1.1] truncate w-full pr-4'}
                    `}>
                      {project.title}
                    </h3>

                    <div className={`overflow-hidden transition-all duration-[1s] ease-[cubic-bezier(0.16,1,0.3,1)]
                       ${isHovered ? 'max-h-[300px] opacity-100 transform translate-y-0' : 'max-h-0 opacity-0 transform translate-y-4'}
                    `}>
                       {isFeature && <div className="h-[2px] bg-white/20 w-16 mb-4" />}
                       
                       <p className={`text-[#cccccc] mb-8 font-medium leading-relaxed drop-shadow-md
                          ${isFeature ? 'max-w-sm text-sm md:text-base' : 'text-xs line-clamp-2 mt-2 truncate w-full whitespace-normal opacity-0 md:opacity-100 hidden sm:block'}
                       `}>
                         {project.description}
                       </p>
                       
                       <div 
                         onClick={(e) => openProject(project, e)}
                         className="inline-flex items-center gap-3 bg-[#FAFAFA]/10 backdrop-blur-md border border-white/20 text-[#FAFAFA] px-5 py-2.5 rounded-full font-space font-bold uppercase tracking-widest text-[10px] sm:text-xs shadow-lg hover:bg-white hover:text-black transition-colors pointer-events-auto cursor-pointer"
                       >
                          Play Video
                          <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                       </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {activeData && (
        <div className="fixed inset-0 z-[100] pointer-events-auto">
          <video
            ref={videoRef}
            src={activeData.project.video}
            autoPlay
            muted
            loop
            playsInline
            className="absolute object-cover z-[101]"
          />

          <div
            ref={panelRef}
            className="bg-[#111111] z-[102] flex flex-col justify-center p-8 md:p-16 lg:p-24 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] overflow-y-auto hide-scrollbar"
          >
            <button
              ref={closeRef}
              onClick={closeProject}
              className="absolute top-6 right-6 md:top-12 md:right-12 w-14 h-14 bg-[#333333] hover:bg-[#FAFAFA] text-[#FAFAFA] hover:text-[#111111] border border-[#555555] rounded-full flex items-center justify-center transition-colors duration-300 z-50 cursor-pointer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="max-w-lg">
              <span className="modal-stagger block font-space text-xs md:text-sm font-bold uppercase tracking-[0.2em] text-[#81D8D0] mb-4">
                {activeData.project.category}
              </span>
              <h2 className="modal-stagger font-space text-4xl md:text-6xl font-black uppercase tracking-tighter text-[#FAFAFA] leading-[0.9] mb-8">
                {activeData.project.title}
              </h2>
              
              <div className="modal-stagger flex flex-col gap-2 mb-10">
                <span className="text-[#555555] font-space text-sm uppercase tracking-widest font-bold">Role</span>
                <span className="text-[#A0A0A0] text-lg font-medium">{activeData.project.role}</span>
              </div>

              <div className="modal-stagger w-12 h-px bg-[#333333] mb-10" />

              <p className="modal-stagger text-[#A0A0A0] text-lg md:text-xl leading-relaxed mb-12">
                {activeData.project.description}
              </p>

              <button className="modal-stagger group relative inline-flex items-center gap-4 bg-[#81D8D0] hover:bg-[#6BCFC5] text-[#111111] px-8 py-4 rounded-full font-space font-bold uppercase tracking-wider text-sm transition-colors duration-300 overflow-hidden">
                <span className="relative z-10">View Case Study</span>
                <span className="relative z-10 w-8 h-8 rounded-full bg-[#111111]/10 flex items-center justify-center group-hover:translate-x-1 transition-transform duration-300">
                  <svg className="w-4 h-4 -rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
