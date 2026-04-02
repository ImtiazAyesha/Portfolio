import { client } from "@/sanity/lib/client";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import Link from "next/link";
import React from "react";
import TableOfContents from "@/src/components/CaseStudies/TableOfContents";

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const query = `*[_type in ["post", "caseStudy"] && slug.current == $slug][0]{
    title,
    "slug": slug.current,
    "authorName": author->name,
    "categoryName": categories[0]->title,
    "mainImageUrl": mainImage.asset->url,
    body,
    publishedAt
  }`;

  const post = await client.fetch(query, { slug });

  if (!post) {
    return notFound();
  }

  // Extract headings for Table of Contents
  const headings = post.body
    ?.filter((block: any) => block._type === "block" && /^h[234]$/.test(block.style))
    .map((block: any) => {
      const text = block.children?.map((child: any) => child.text).join("") || "";
      const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      return { text, id, level: block.style };
    }) || [];

  const ptComponents = {
    block: {
      h2: ({ children, value }: any) => {
        const text = value.children?.map((c: any) => c.text).join("") || "";
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        return <h2 id={id} className="scroll-mt-32 font-bold font-space uppercase tracking-tight text-[#111111] mt-12 mb-6">{children}</h2>;
      },
      h3: ({ children, value }: any) => {
        const text = value.children?.map((c: any) => c.text).join("") || "";
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        return <h3 id={id} className="scroll-mt-32 font-semibold font-space text-2xl text-[#111111] mt-8 mb-4">{children}</h3>;
      },
      h4: ({ children, value }: any) => {
        const text = value.children?.map((c: any) => c.text).join("") || "";
        const id = text.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
        return <h4 id={id} className="scroll-mt-32 font-semibold font-space text-xl text-[#111111] mt-6 mb-3">{children}</h4>;
      },
      normal: ({ children }: any) => (
        <p className="text-[#555555] leading-relaxed mb-6 text-lg">{children}</p>
      ),
      blockquote: ({ children }: any) => (
        <blockquote className="border-l-4 border-[#3bd6c6] pl-6 italic text-[#777777] my-8 text-xl font-medium">{children}</blockquote>
      ),
    },
    list: {
      bullet: ({ children }: any) => <ul className="list-disc pl-6 mb-6 text-[#555555] space-y-3 marker:text-[#3bd6c6]">{children}</ul>,
      number: ({ children }: any) => <ol className="list-decimal pl-6 mb-6 text-[#555555] space-y-3 marker:text-[#3bd6c6]">{children}</ol>,
    },
    listItem: {
      bullet: ({ children }: any) => <li className="pl-2">{children}</li>,
      number: ({ children }: any) => <li className="pl-2">{children}</li>,
    },
    marks: {
      strong: ({ children }: any) => <strong className="font-semibold text-[#111111]">{children}</strong>,
      link: ({ children, value }: any) => (
        <a href={value?.href} className="text-[#3bd6c6] hover:underline hover:text-[#111111] transition-colors" target={value?.blank ? "_blank" : undefined}>
          {children}
        </a>
      ),
    },
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] pt-32 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        <Link href="/case-studies" className="text-[#555555] hover:text-[#111111] transition-colors mb-12 inline-flex items-center gap-2 text-sm font-medium">
          ← Back to Case Studies
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-12 lg:gap-24 items-start">
          
          {/* LEFT SIDEBAR: Table of Contents */}
          <TableOfContents headings={headings as any} />

          {/* RIGHT COLUMN: Article Content */}
          <article className="max-w-3xl w-full">
            {/* Metadata Breadcrumbs */}
            <div className="flex items-center gap-3 text-sm mb-8 text-[#555555] font-medium">
              {post.categoryName && (
                <span className="bg-[#111111] text-[#FAFAFA] px-3 py-1 rounded-full text-xs uppercase tracking-wider font-space">
                  {post.categoryName}
                </span>
              )}
              {post.authorName && (
                <>
                  <span className="text-[#cccccc]">•</span>
                  <span>By <span className="text-[#111111]">{post.authorName}</span></span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-[4rem] font-space font-black text-[#111111] uppercase tracking-tighter mb-12 leading-[1.05]">
              {post.title}
            </h1>

            {/* Main Image */}
            {post.mainImageUrl && (
              <div className="w-full aspect-[16/9] bg-[#f0f0f0] rounded-2xl md:rounded-[2rem] overflow-hidden mb-16 border border-[#e6e6e6] shadow-sm">
                <img src={post.mainImageUrl} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* The Prose Body - Typography plugin injected here safely */}
            <div className="prose prose-lg prose-zinc max-w-none text-[#555555]">
               <PortableText value={post.body} components={ptComponents} />
            </div>
            
          </article>
        </div>
      </div>
    </main>
  );
}
