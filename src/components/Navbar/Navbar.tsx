"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const logoLettersRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Intersection Observer for active nav section
    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 0.5,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    const sectionIds = ["expertise", "projects", "experience", "contact"];
    const sections = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    sections.forEach((section) => {
      if (section) sectionObserver.observe(section);
    });

    return () => {
      sections.forEach((section) => {
        if (section) sectionObserver.unobserve(section);
      });
    };
  }, []);

  const handleLogoEnter = () => {
    gsap.fromTo(
      logoLettersRef.current,
      { yPercent: -4 },
      { yPercent: 0, duration: 0.3, stagger: 0.04, ease: "back.out(3)", overwrite: "auto" }
    );
  };

  const closeMobileMenu = () => setIsMobileOpen(false);

  const logoText = "HASSAN";

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 border-b ${scrolled
            ? "bg-[#FAFAFA]/95 backdrop-blur-lg border-[#E5E5E5] py-4 shadow-sm"
            : "bg-transparent border-transparent py-6 md:py-8"
          }`}
      >
        <div className="mx-auto max-w-[90rem] px-6 lg:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="group flex items-center gap-2"
            onMouseEnter={handleLogoEnter}
          >
            <span className="flex font-space text-2xl font-black text-[#111111] tracking-tighter">
              {logoText.split("").map((char, index) => (
                <span
                  key={index}
                  ref={(el) => { logoLettersRef.current[index] = el; }}
                  className="inline-block"
                >
                  {char}
                </span>
              ))}
            </span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#81D8D0]" />
          </Link>

          {/* Centre nav links */}
          <div className="hidden md:flex items-center gap-7">
            {["Expertise", "Projects", "Experience"].map((item) => {
              const elementId = item.toLowerCase();
              const isActive = activeSection === elementId;
              return (
                <Link
                  key={item}
                  href={`#${elementId}`}
                  className="relative flex flex-col items-center group"
                >
                  <span className={`text-sm font-medium transition-colors ${isActive ? "text-[#111111]" : "text-[#333333] group-hover:text-[#111111]"
                    }`}>
                    {item}
                  </span>
                  {/* Active Indicator Dot */}
                  <span
                    className={`absolute -bottom-[10px] w-1 h-1 rounded-full bg-[#81D8D0] transition-transform duration-300 origin-center ${isActive ? "scale-100" : "scale-0"
                      }`}
                  />
                </Link>
              );
            })}
            <div className="relative flex flex-col items-center group">
              <Link
                href="#contact"
                className="rounded-full bg-[#111111] px-6 py-2.5 text-sm font-semibold text-[#FAFAFA] transition-all hover:bg-[#333333] hover:scale-105 active:scale-95"
              >
                Let's Talk
              </Link>
              <span
                className={`absolute -bottom-3 w-1 h-1 rounded-full bg-[#81D8D0] transition-transform duration-300 origin-center ${activeSection === "contact" ? "scale-100" : "scale-0"
                  }`}
              />
            </div>
          </div>

          {/* Mobile Nav Toggle */}
          <button
            className="relative md:hidden flex flex-col items-center justify-center w-8 h-8 z-[60] focus:outline-none"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            aria-label="Toggle mobile menu"
          >
            <span className={`block absolute h-0.5 w-6 bg-[#111111] transition-transform duration-300 ease-in-out ${isMobileOpen ? 'rotate-45' : '-translate-y-1.5'}`} />
            <span className={`block absolute h-0.5 w-6 bg-[#111111] transition-opacity duration-300 ease-in-out ${isMobileOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`block absolute h-0.5 w-6 bg-[#111111] transition-transform duration-300 ease-in-out ${isMobileOpen ? '-rotate-45' : 'translate-y-1.5'}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 z-[55] md:hidden transition-opacity duration-300 ${isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
      >
        <div
          className="absolute inset-0 bg-[#FAFAFA]/95 backdrop-blur-lg"
          onClick={closeMobileMenu}
        />

        {/* Drawer Menu */}
        <div
          className={`absolute top-0 right-0 w-full sm:w-[80%] max-w-sm h-full bg-[#FAFAFA] border-l border-[#E5E5E5]/50 flex flex-col justify-center px-12 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] ${isMobileOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          <div className="flex flex-col gap-10">
            {["Expertise", "Projects", "Experience", "Contact"].map((item) => (
              <Link
                key={item}
                href={`#${item.toLowerCase()}`}
                onClick={closeMobileMenu}
                className="font-space text-3xl font-black uppercase text-[#111111] hover:text-[#81D8D0] transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
