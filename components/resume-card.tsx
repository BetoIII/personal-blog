"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import React from "react";

interface ResumeCardProps {
  logoUrl: string;
  altText: string;
  title: string;
  subtitle?: string;
  href?: string;
  badges?: readonly string[];
  period: string;
  description?: string;
}

export const ResumeCard = ({
  logoUrl,
  altText,
  title,
  subtitle,
  href,
  badges,
  period,
  description,
}: ResumeCardProps) => {
  return (
    <Link
      href={href || "#"}
      className="block cursor-pointer group"
      target={href ? "_blank" : undefined}
    >
      <Card className="flex thick-border bg-card hover-lift transition-all duration-300">
        <div className="flex-none p-6">
          <Avatar className="thick-border size-16 bg-muted">
            <AvatarImage
              src={logoUrl}
              alt={altText}
              className="object-contain"
            />
            <AvatarFallback className="font-serif text-xl">{altText[0]}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-grow items-center flex-col">
          <CardHeader className="p-6">
            <div className="flex items-start justify-between gap-x-4 mb-2">
              <h3 className="inline-flex items-center justify-center font-serif text-2xl font-medium leading-tight group-hover:text-primary transition-colors">
                {title}
                <ChevronRightIcon
                  className={cn(
                    "size-5 ml-2 translate-x-0 transform opacity-0 transition-all duration-300 ease-out group-hover:translate-x-1 group-hover:opacity-100",
                    !href && "hidden"
                  )}
                />
              </h3>
              <div className="text-sm tabular-nums text-muted-foreground text-right whitespace-nowrap font-mono font-bold">
                {period}
              </div>
            </div>
            {subtitle && <div className="font-sans text-base font-medium mb-3 text-xl">{subtitle}</div>}
            {badges && badges.length > 0 && (
              <div className="flex gap-2 mb-3">
                {badges.map((badge, index) => (
                  <Badge
                    variant="secondary"
                    className="text-xs"
                    key={index}
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            )}
            {description && (
              <div className="mt-2 text-base leading-relaxed">{description}</div>
            )}
          </CardHeader>
        </div>
      </Card>
    </Link>
  );
};
