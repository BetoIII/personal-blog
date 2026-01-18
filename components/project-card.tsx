"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

interface ProjectCardProps {
  title: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  image?: string;
  video?: string;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
  onClick?: () => void;
}

export function ProjectCard({
  title,
  href,
  description,
  dates,
  tags,
  image,
  video,
  links,
  className,
  onClick,
}: ProjectCardProps) {
  // Check if image is an emoji (single character or emoji sequence)
  const isEmoji = image && image.length <= 4 && !image.startsWith('http');
  const isImageUrl = image && image.startsWith('http');

  const CardWrapper = onClick ? "button" : "div";
  const cardWrapperProps = onClick
    ? { onClick, type: "button" as const }
    : {};

  const ImageContainer = (!onClick && href) ? Link : "div";
  const imageContainerProps = (!onClick && href)
    ? { href, target: "_blank" }
    : {};

  return (
    <CardWrapper
      {...cardWrapperProps}
      className={cn(
        "w-full text-left",
        onClick && "cursor-pointer p-0 border-0 normal-case"
      )}
      style={onClick ? { textTransform: 'none', letterSpacing: 'normal' } : undefined}
    >
      <Card
        className={cn(
          "flex flex-col overflow-hidden thick-border hover-lift h-full group bg-card",
          className
        )}
      >
        <ImageContainer
          {...imageContainerProps}
          className={cn("block relative overflow-hidden w-full", !onClick && href && "cursor-pointer")}
        >
        {video && (
          <video
            src={video}
            autoPlay
            loop
            muted
            playsInline
            className="pointer-events-none mx-auto h-64 w-full object-cover object-top transition-transform duration-500 group-hover:scale-110"
          />
        )}
        {isImageUrl && (
          <Image
            src={image}
            alt={title}
            width={500}
            height={300}
            className="h-64 w-full overflow-hidden object-cover object-top transition-transform duration-500 group-hover:scale-110"
          />
        )}
        {isEmoji && (
          <div className="h-64 w-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <div className="text-9xl">
              {image}
            </div>
          </div>
        )}
        {!image && !video && (
          <div className="h-64 w-full bg-secondary flex items-center justify-center">
            <div className="text-6xl font-serif text-muted-foreground opacity-20">
              {title.charAt(0)}
            </div>
          </div>
        )}
        </ImageContainer>
        <CardHeader className="p-6">
        <div className="space-y-2">
          <time className="font-mono text-xs text-muted-foreground uppercase tracking-wider">{dates}</time>
          <CardTitle className="text-2xl font-serif font-medium group-hover:text-primary transition-colors">{title}</CardTitle>
          <div className="hidden font-sans text-xs underline print:visible">
            {href?.replace("https://", "").replace("www.", "").replace("/", "")}
          </div>
          <CardDescription className="text-base text-muted-foreground leading-relaxed">
            {description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col px-6 pb-6">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags?.map((tag) => (
              <Badge
                className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border-2 border-foreground bg-background text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                key={tag}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {links && links.length > 0 && (
          <div className="flex flex-row flex-wrap items-start gap-2">
            {links?.map((link, idx) => (
              <Link
                href={link?.href}
                key={idx}
                target="_blank"
                onClick={(e) => e.stopPropagation()}
              >
                <Badge className="flex gap-2 px-3 py-2 text-xs hover:bg-primary hover:text-primary-foreground transition-colors">
                  {link.icon}
                  {link.type}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
      </Card>
    </CardWrapper>
  );
}
