"use client";

const experienceData = [
  {
    role: "Senior AI Engineer",
    company: "Evren Intelligence",
    date: "2024 — Present",
    description:
      "Architecting large scale training grids for generative models and serving them with sub-100ms latency globally.",
    tag: "Infrastructure · LLMs",
  },
  {
    role: "ML Researcher",
    company: "Neural Labs",
    date: "2022 — 2024",
    description:
      "Published cutting edge research on transformer optimization and distilled models for consumer edges.",
    tag: "Research · Distillation",
  },
  {
    role: "Frontend Developer",
    company: "Studio Web",
    date: "2020 — 2022",
    description:
      "Built award-winning WebGL interfaces and GSAP-driven marketing sites for enterprise clients.",
    tag: "WebGL · GSAP",
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative z-20 bg-[#FAFAFA] py-24 md:py-40 px-6 md:px-12 overflow-hidden"
    >
      <div className="mx-auto max-w-[80rem]">
        {/* Header Block */}
        <div className="mb-12 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-5 h-px bg-[#81D8D0]" />
              <span className="font-space text-xs font-bold uppercase tracking-[0.2em] text-[#81D8D0]">
                Career Path
              </span>
            </div>
            <h2 className="font-space text-4xl md:text-7xl font-black uppercase tracking-tighter text-[#111111]">
              Experience.
            </h2>
          </div>
          <p className="max-w-sm text-[#555555] text-lg font-medium">
            A journey tracking the intersection of artificial intelligence and
            elite frontend engineering.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(300px,auto)] md:auto-rows-[340px]">
          
          {/* Card 1 — Feature (Spans 2 columns, 2 rows) */}
          <div className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-white border border-[#E5E5E5] p-8 md:p-14 md:col-span-2 md:row-span-2 transition-all duration-500 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1">
            
            {/* Background Graphic & Centered Watermark */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[2.5rem]">
               <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-[#81D8D0]/10 to-transparent rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150" />
               <span
                aria-hidden="true"
                className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 block font-space font-black uppercase leading-none select-none whitespace-nowrap opacity-[0.03] transition-opacity duration-500 group-hover:opacity-[0.05]"
                style={{ fontSize: "clamp(6rem, 15vw, 15rem)", letterSpacing: "-0.04em", zIndex: 0 }}
              >
                EVREN
              </span>
            </div>

            {/* Top row */}
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-auto">
              <div className="inline-flex items-center justify-center px-6 py-3 rounded-full border border-[#E5E5E5] bg-[#FAFAFA] font-space text-sm font-bold text-[#111111] shadow-sm">
                {experienceData[0].date}
              </div>
              <span className="font-space text-xs font-bold uppercase tracking-[0.2em] text-[#81D8D0]">
                {experienceData[0].tag}
              </span>
            </div>

            {/* Bottom Content */}
            <div className="relative z-10 mt-16 md:mt-auto pt-10 border-t border-[#E5E5E5]/60 flex flex-col">
              <h3 className="font-space text-4xl md:text-5xl lg:text-[3.5rem] font-black uppercase text-[#111111] leading-[0.95] tracking-tight mb-8">
                {experienceData[0].role}
              </h3>

              <div className="flex flex-col md:flex-row gap-4 md:gap-12 md:items-center">
                <span className="font-space text-xl md:text-2xl font-bold text-[#81D8D0] shrink-0">
                  {experienceData[0].company}
                </span>
                <div className="hidden md:block w-px h-10 bg-[#E5E5E5]" />
                <p className="text-[#555555] text-base md:text-lg leading-relaxed max-w-xl">
                  {experienceData[0].description}
                </p>
              </div>
            </div>
          </div>

          {/* Card 2 — Stacked Right (Span 1 col, 1 row) */}
          <div className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-[#F9F9F9] border border-[#E5E5E5] p-8 md:p-10 transition-all duration-500 hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-auto">
              <span className="font-space text-sm font-semibold text-[#888888] bg-white px-4 py-1.5 rounded-full border border-[#E5E5E5]">
                {experienceData[1].date}
              </span>
              <span className="font-space text-[9px] font-bold uppercase tracking-[0.2em] text-[#81D8D0] mt-2">
                {experienceData[1].tag}
              </span>
            </div>

            <div className="mt-12 pt-8 border-t border-[#E5E5E5]/60">
              <h3 className="font-space text-2xl font-black uppercase text-[#111111] leading-tight tracking-tight mb-2 transition-colors group-hover:text-[#81D8D0]">
                {experienceData[1].role}
              </h3>
              <span className="block font-space text-base font-bold text-[#555555] mb-4">
                {experienceData[1].company}
              </span>
              <p className="text-[#666666] text-sm md:text-base leading-relaxed line-clamp-3">
                {experienceData[1].description}
              </p>
            </div>
          </div>

          {/* Card 3 — Stacked Right (Span 1 col, 1 row) */}
          <div className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-[#F9F9F9] border border-[#E5E5E5] p-8 md:p-10 transition-all duration-500 hover:bg-white hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] hover:-translate-y-1">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-auto">
              <span className="font-space text-sm font-semibold text-[#888888] bg-white px-4 py-1.5 rounded-full border border-[#E5E5E5]">
                {experienceData[2].date}
              </span>
              <span className="font-space text-[9px] font-bold uppercase tracking-[0.2em] text-[#81D8D0] mt-2">
                {experienceData[2].tag}
              </span>
            </div>

            <div className="mt-12 pt-8 border-t border-[#E5E5E5]/60">
              <h3 className="font-space text-2xl font-black uppercase text-[#111111] leading-tight tracking-tight mb-2 transition-colors group-hover:text-[#81D8D0]">
                {experienceData[2].role}
              </h3>
              <span className="block font-space text-base font-bold text-[#555555] mb-4">
                {experienceData[2].company}
              </span>
              <p className="text-[#666666] text-sm md:text-base leading-relaxed line-clamp-3">
                {experienceData[2].description}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
