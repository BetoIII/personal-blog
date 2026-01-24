"use client";

import { useRouter } from "next/navigation";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";

const BLUR_FADE_DELAY = 0.04;

interface Project {
  title: string;
  slug: string;
  href: string;
  dates: string;
  active: boolean;
  description: string;
  technologies: readonly string[];
  links: readonly {
    type: string;
    href: string;
    icon: React.ReactNode;
  }[];
  image?: string;
  video?: string;
}

interface HomeProjectsSectionProps {
  projects: Project[];
}

export function HomeProjectsSection({ projects }: HomeProjectsSectionProps) {
  const router = useRouter();

  const handleProjectClick = (slug: string) => {
    router.push(`/portfolio?project=${slug}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {projects.map((project, id) => (
        <BlurFade
          key={project.title}
          delay={BLUR_FADE_DELAY * 14 + id * 0.15}
        >
          <ProjectCard
            title={project.title}
            description={project.description}
            dates={project.dates}
            tags={project.technologies}
            image={project.image}
            video={project.video}
            links={project.links}
            onClick={() => handleProjectClick(project.slug)}
          />
        </BlurFade>
      ))}
    </div>
  );
}
