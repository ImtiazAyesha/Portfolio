import { client } from "@/sanity/lib/client";
import Link from "next/link";

export const metadata = {
  title: 'Case Studies | Hassan Portfolio',
  description: 'A deep dive into my recent projects and case studies.',
};

export default async function CaseStudiesPage() {
  const posts = await client.fetch(`*[_type == "post"] | order(_createdAt asc) {
    title,
    "slug": slug.current,
    "categoryName": categories[0]->title,
    "categoryDesc": categories[0]->description,
    "mainImageUrl": mainImage.asset->url
  }`);

  if (!posts || posts.length === 0) {
    return (
      <main className="min-h-screen bg-[#fafafa] flex flex-col items-center justify-center">
        <p className="font-space text-[#111111]/40 text-sm uppercase tracking-widest">No case studies published yet.</p>
      </main>
    );
  }

  return (
    <main className="bg-[#fafafa] pt-32 xl:pt-40 pb-48 min-h-screen">
      
      {/* ── Header Flow ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 mb-16">
        <p className="text-[#3bd6c6] uppercase tracking-[0.3em] text-[10px] font-semibold font-space mb-2">
          Selected Work
        </p>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <h1 className="font-space font-black text-5xl md:text-[5rem] uppercase tracking-tighter text-[#111111] leading-none">
            Case Studies
          </h1>
          <div className="hidden md:flex flex-col items-end mb-2">
            <span className="font-space text-4xl md:text-5xl font-black text-[#111111] leading-none tabular-nums">
              {String(posts.length).padStart(2, "0")}
            </span>
            <span className="text-[#888888] font-space font-medium text-[10px] tracking-widest uppercase mt-2">
              Total Projects
            </span>
          </div>
        </div>
      </div>

      {/* ── Standard CSS Grid ── */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {posts.map((post: any, i: number) => (
          <Link
            key={post.slug}
            href={`/case-studies/${post.slug}`}
            className="group relative flex flex-col justify-end w-full min-h-[500px] lg:min-h-[600px] xl:min-h-[650px] rounded-[2rem] overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.2)] bg-[#0E0E0E]"
          >
            {/* Background Image with Hover Scale */}
            {post.mainImageUrl && (
              <div className="absolute inset-0 w-full h-full transform transition-transform duration-700 ease-out group-hover:scale-105">
                <img
                  src={post.mainImageUrl}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                {/* Cinematic Gradients for extreme contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10" />
              </div>
            )}

            {/* No-image fallback grain */}
            {!post.mainImageUrl && (
              <div className="absolute inset-0 opacity-[0.035]"
                style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: "200px" }} />
            )}

            {/* Card Content Base */}
            <div className="relative z-10 p-8 md:p-12 w-full md:max-w-[90%]">
              
              <p className="font-space text-white/50 text-[11px] uppercase tracking-[0.3em] mb-4 font-medium">
                {String(i + 1).padStart(2, "0")} — {String(posts.length).padStart(2, "0")}
              </p>

              {/* Category Badge */}
              {post.categoryName && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] md:text-xs font-semibold uppercase tracking-widest mb-6 bg-white/10 text-white border border-white/10 backdrop-blur-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3bd6c6] shadow-[0_0_8px_rgba(59,214,198,0.8)]" />
                  {post.categoryName}
                </div>
              )}

              {/* Title */}
              <h2 className="font-space font-black uppercase tracking-tighter leading-[0.9] text-white text-4xl md:text-5xl lg:text-[4rem] mb-6 group-hover:text-[#3bd6c6] transition-colors duration-300">
                {post.title}
              </h2>

              {/* Description */}
              {post.categoryDesc && (
                <p className="text-white/70 text-sm md:text-base leading-relaxed mb-10 max-w-sm line-clamp-3">
                  {post.categoryDesc}
                </p>
              )}

              {/* Read button pill */}
              <div className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full font-space font-bold text-xs md:text-sm uppercase tracking-wider transition-all duration-300 bg-white text-[#111111] group-hover:bg-[#3bd6c6] group-hover:text-[#111111]">
                Read Case Study
                <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>

            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
