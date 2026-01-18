"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import { MarkdownRenderer } from "@/components/markdown-renderer";

interface PortfolioModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: {
    title: string;
    description: string;
    dates: string;
    active: boolean;
    technologies: readonly string[];
    image?: string;
    video?: string;
    links: ReadonlyArray<{
      type: string;
      href: string;
      icon?: React.ReactNode;
    }>;
    role?: string;
    content?: string;
  } | null;
}

export function PortfolioModal({ isOpen, onClose, project }: PortfolioModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Reset scroll position when project changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTop = 0;
    }
  }, [project]);

  if (!isOpen || !project) return null;

  const isEmoji = project.image && project.image.length <= 4 && !project.image.startsWith("http");
  const isImageUrl = project.image && project.image.startsWith("http");

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-md"
        style={{
          animation: "fadeIn 0.2s ease-out",
        }}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative w-full h-[95vh] sm:h-[90vh] sm:max-w-5xl bg-background thick-border shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          animation: "slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-20 p-3 thick-border bg-background hover:bg-foreground hover:text-background transition-all duration-300 group"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Content */}
        <div ref={contentRef} className="h-full overflow-y-auto">
          {/* Hero Image */}
          {project.video && (
            <div className="relative w-full h-80 md:h-96 bg-muted">
              <video
                src={project.video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          )}
          {!project.video && isImageUrl && (
            <div className="relative w-full h-80 md:h-96 bg-muted">
              <Image
                src={project.image!}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
          {!project.video && isEmoji && (
            <div className="w-full h-80 md:h-96 bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <div className="text-9xl">{project.image}</div>
            </div>
          )}
          {!project.video && !project.image && (
            <div className="w-full h-80 md:h-96 bg-secondary flex items-center justify-center">
              <div className="text-9xl font-serif text-muted-foreground opacity-20">
                {project.title.charAt(0)}
              </div>
            </div>
          )}

          {/* Content Area */}
          <div className="px-8 md:px-16 py-12 max-w-4xl mx-auto">
            {/* Status Badge */}
            {project.active && (
              <div className="inline-block mb-6 px-4 py-2 thick-border bg-accent text-accent-foreground">
                <span className="text-xs font-medium uppercase tracking-wider">Active Project</span>
              </div>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium mb-6 leading-tight">
              {project.title}
            </h1>

            {/* Properties Section - Notion Style */}
            <div className="mb-12 space-y-6 pb-8 border-b border-border">
              {/* Description Property */}
              <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider pt-1">
                  Description
                </div>
                <div className="text-base text-foreground leading-relaxed">
                  {project.description}
                </div>
              </div>

              {/* Beto's Role Property */}
              {project.role && (
                <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider pt-1">
                    Beto&apos;s Role
                  </div>
                  <div className="text-base text-foreground">
                    {project.role}
                  </div>
                </div>
              )}

              {/* GitHub Repo Property */}
              {project.links.find(l => l.type.toLowerCase().includes("github") || l.type.toLowerCase().includes("source")) && (
                <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider pt-1">
                    Github Repo
                  </div>
                  <a
                    href={project.links.find(l => l.type.toLowerCase().includes("github") || l.type.toLowerCase().includes("source"))?.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-base text-primary hover:underline flex items-center gap-2"
                  >
                    <Icons.github className="size-4" />
                    {project.links.find(l => l.type.toLowerCase().includes("github") || l.type.toLowerCase().includes("source"))?.href.replace("https://", "").replace("http://", "")}
                  </a>
                </div>
              )}

              {/* Website Property */}
              {project.links.find(l => l.type.toLowerCase().includes("website") || l.type.toLowerCase().includes("demo") || l.type.toLowerCase().includes("live")) && (
                <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider pt-1">
                    Website
                  </div>
                  <a
                    href={project.links.find(l => l.type.toLowerCase().includes("website") || l.type.toLowerCase().includes("demo") || l.type.toLowerCase().includes("live"))?.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="text-base text-primary hover:underline flex items-center gap-2"
                  >
                    <Icons.globe className="size-4" />
                    {project.links.find(l => l.type.toLowerCase().includes("website") || l.type.toLowerCase().includes("demo") || l.type.toLowerCase().includes("live"))?.href.replace("https://", "").replace("http://", "")}
                  </a>
                </div>
              )}

              {/* Technologies Property */}
              {project.technologies.length > 0 && (
                <div className="grid grid-cols-[140px_1fr] gap-4 items-start">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider pt-1">
                    Technologies
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech) => (
                      <Badge
                        key={tech}
                        variant="secondary"
                        className="px-3 py-1 text-xs"
                      >
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Markdown Content */}
            {project.content && (
              <div className="prose prose-lg max-w-none">
                <MarkdownRenderer content={project.content} />
              </div>
            )}

            {/* Empty state if no content */}
            {!project.content && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground italic">
                  No additional content available for this project.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
