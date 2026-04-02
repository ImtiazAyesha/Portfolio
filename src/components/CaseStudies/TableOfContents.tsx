"use client";

import { useEffect, useState } from "react";

interface Heading {
  text: string;
  id: string;
  level: string;
}

export default function TableOfContents({ headings }: { headings: Heading[] }) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const handleScroll = () => {
      let current = "";
      for (const heading of headings) {
         // Using standard DOM querying since this is rendered from portable text
        const el = document.getElementById(heading.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // Detect if heading has passed the upper part of viewport
          if (rect.top <= 250) {
            current = heading.id;
          }
        }
      }
      
      // Set the active id (will be empty if we haven't scrolled to any heading yet)
      setActiveId(current);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    // Trigger on mount
    handleScroll(); 
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [headings]);

  return (
    <aside className="sticky top-32 hidden lg:flex flex-col gap-6 border-l border-[#e6e6e6] pl-6 pr-4 max-h-[75vh] overflow-y-auto overflow-x-hidden mb-16 hide-scrollbar">
      <h3 className="font-space font-black uppercase tracking-tight text-[#111111] text-xs">
        On this page
      </h3>
      {headings.length > 0 ? (
        <ul className="flex flex-col gap-4 relative">
          {headings.map((heading) => {
            const isActive = activeId === heading.id;
            return (
              <li 
                key={heading.id} 
                className={`transition-all duration-300 ${heading.level === 'h3' ? 'pl-4' : heading.level === 'h4' ? 'pl-8' : ''}`}
              >
                <a 
                  href={`#${heading.id}`} 
                  className={`text-sm font-medium transition-all duration-300 line-clamp-2 block ${isActive ? 'text-[#3bd6c6] scale-[1.02] translate-x-1' : 'text-[#777777] hover:text-[#3bd6c6]'}`}
                >
                  {heading.text}
                </a>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-xs text-[#888888] italic">Reading directly...</p>
      )}
    </aside>
  );
}
