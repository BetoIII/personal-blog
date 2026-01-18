"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { DATA } from "@/lib/portfolio-data";
import { useState, useEffect } from "react";

export function SiteNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-background/95 backdrop-blur-md thick-border-bottom shadow-[0_8px_0_rgba(26,26,26,0.08)]"
          : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto w-full flex h-20 items-center justify-between px-6 md:px-12">
        {/* Logo/Initials */}
        <Link
          href="/"
          className="group relative"
        >
          <div className="thick-border bg-primary text-primary-foreground px-5 py-3 hover:bg-foreground hover:text-background transition-all duration-300">
            <span className="font-serif text-2xl font-semibold tracking-tight">
              {DATA.initials}
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-2 md:gap-6">
          <Link
            href="/blog"
            className={`relative group px-4 md:px-6 py-3 font-medium uppercase text-xs md:text-sm tracking-wider transition-all duration-300 ${
              pathname === "/blog"
                ? "text-primary"
                : "text-foreground hover:text-primary"
            }`}
          >
            Blog
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
          </Link>

          <Link
            href="/portfolio"
            className={`relative group px-4 md:px-6 py-3 font-medium uppercase text-xs md:text-sm tracking-wider transition-all duration-300 ${
              pathname === "/portfolio"
                ? "text-primary"
                : "text-foreground hover:text-primary"
            }`}
          >
            Portfolio
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
          </Link>

          <Link
            href="/roi-calculator"
            className={`relative group px-4 md:px-6 py-3 font-medium uppercase text-xs md:text-sm tracking-wider transition-all duration-300 ${
              pathname === "/roi-calculator"
                ? "text-primary"
                : "text-foreground hover:text-primary"
            }`}
          >
            ROI Calc
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300"></span>
          </Link>

          {/* Theme Toggle */}
          <div className="ml-2 md:ml-4">
            <ThemeToggle />
          </div>
        </nav>
      </div>
    </header>
  );
}
