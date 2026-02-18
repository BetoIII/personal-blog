"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Link2, Linkedin } from "lucide-react";

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.74l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  className?: string;
  postUrl?: string;
  postTitle?: string;
}

export function TableOfContents({
  className,
  postUrl,
  postTitle,
}: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const headingElements = document.querySelectorAll("h2, h3");
    const headingsArray: Heading[] = [];

    headingElements.forEach((element) => {
      if (element.id) {
        headingsArray.push({
          id: element.id,
          text: element.textContent || "",
          level: parseInt(element.tagName.charAt(1)),
        });
      }
    });

    setHeadings(headingsArray);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      () => {
        const headingPositions = headings.map((heading) => {
          const element = document.getElementById(heading.id);
          return {
            id: heading.id,
            top: element ? element.getBoundingClientRect().top : Infinity,
          };
        });

        let activeHeading = headingPositions.find(
          (heading) => heading.top >= 0 && heading.top <= 100
        );

        if (!activeHeading) {
          const headingsAbove = headingPositions
            .filter((heading) => heading.top < 0)
            .sort((a, b) => b.top - a.top);

          activeHeading = headingsAbove[0];
        }

        if (!activeHeading) {
          const headingsBelow = headingPositions
            .filter((heading) => heading.top > 100)
            .sort((a, b) => a.top - b.top);

          activeHeading = headingsBelow[0];
        }

        if (activeHeading && activeHeading.id !== activeId) {
          setActiveId(activeHeading.id);
        }
      },
      {
        root: null,
        rootMargin: "-100px",
        threshold: 0,
      }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    const handleScroll = () => {
      const headingPositions = headings.map((heading) => {
        const element = document.getElementById(heading.id);
        return {
          id: heading.id,
          top: element ? element.getBoundingClientRect().top : Infinity,
        };
      });

      let activeHeading = headingPositions.find(
        (heading) => heading.top >= -50 && heading.top <= 100
      );

      if (!activeHeading) {
        const headingsAbove = headingPositions
          .filter((heading) => heading.top < -50)
          .sort((a, b) => b.top - a.top);

        activeHeading = headingsAbove[0];
      }

      if (activeHeading && activeHeading.id !== activeId) {
        setActiveId(activeHeading.id);
      }
    };

    let scrollTimeout: NodeJS.Timeout;
    const throttledScroll = () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(handleScroll, 10);
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });

    handleScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", throttledScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [headings, activeId]);

  const handleHeadingClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    window.history.pushState({}, "", `#${id}`);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  const getShareUrl = () =>
    postUrl || (typeof window !== "undefined" ? window.location.href : "");
  const getShareTitle = () =>
    postTitle || (typeof window !== "undefined" ? document.title : "");

  const handleCopyLink = async () => {
    const url = getShareUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(getShareUrl())}&text=${encodeURIComponent(getShareTitle())}`;
    window.open(url, "_blank", "noopener,noreferrer,width=550,height=420");
  };

  const handleLinkedInShare = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(getShareUrl())}`;
    window.open(url, "_blank", "noopener,noreferrer,width=600,height=600");
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* INDEX Section */}
      {headings.length > 0 && (
        <div>
          <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-3">
            Index
          </p>
          <nav aria-label="Table of contents">
            <ul className="space-y-2">
              {headings.map((heading) => (
                <li key={heading.id} className={heading.level === 3 ? "pl-3" : ""}>
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => handleHeadingClick(e, heading.id)}
                    title={heading.text}
                    className={cn(
                      "block text-sm transition-colors hover:text-foreground truncate",
                      activeId === heading.id
                        ? "text-foreground font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      {headings.length > 0 && <div className="border-t border-border" />}

      {/* SHARE ARTICLE Section */}
      <div>
        <p className="text-xs font-semibold tracking-[0.15em] uppercase text-muted-foreground mb-3">
          Share Article
        </p>
        <div className="flex items-center gap-1">
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title={copied ? "Copied!" : "Copy link"}
            aria-label="Copy link to article"
          >
            <Link2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleTwitterShare}
            className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Share on X (Twitter)"
            aria-label="Share on X"
          >
            <XIcon className="w-5 h-5" />
          </button>
          <button
            onClick={handleLinkedInShare}
            className="p-2 rounded-md hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            title="Share on LinkedIn"
            aria-label="Share on LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
