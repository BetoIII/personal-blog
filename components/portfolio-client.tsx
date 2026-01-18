"use client";

import { useState } from "react";
import Link from "next/link";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import { PortfolioModal } from "@/components/portfolio-modal";

const BLUR_FADE_DELAY = 0.04;

interface Project {
  title: string;
  slug: string;
  href: string;
  dates: string;
  active: boolean;
  description: string;
  technologies: readonly string[];
  links: ReadonlyArray<{
    type: string;
    href: string;
    icon: React.ReactNode;
  }>;
  image?: string;
  video?: string;
  role?: string;
}

interface PortfolioClientProps {
  projects: Project[];
  skills: string[];
  contactEmail: string;
}

export function PortfolioClient({ projects, skills, contactEmail }: PortfolioClientProps) {
  const [selectedProject, setSelectedProject] = useState<(Project & { content?: string }) | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  const handleProjectClick = async (project: Project) => {
    setIsLoadingContent(true);
    setIsModalOpen(true);

    // Set the project data immediately
    setSelectedProject({ ...project });

    // Fetch the full content
    try {
      const response = await fetch(`/api/portfolio/${project.slug}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedProject({ ...project, content: data.content });
      } else {
        // If no content available, just show the project without content
        setSelectedProject({ ...project });
      }
    } catch (error) {
      console.error("Error fetching project content:", error);
      // Still show the project even if content fetch fails
      setSelectedProject({ ...project });
    } finally {
      setIsLoadingContent(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Delay clearing the selected project to allow exit animation
    setTimeout(() => setSelectedProject(null), 300);
  };

  return (
    <>
      <main className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden section-padding px-6 md:px-12 bg-primary text-primary-foreground">
          <div className="mx-auto w-full max-w-7xl relative z-10">
            <BlurFade delay={BLUR_FADE_DELAY}>
              <div className="inline-block mb-6 px-5 py-2 thick-border border-primary-foreground bg-primary-foreground text-primary">
                <span className="text-sm font-medium uppercase tracking-wider">Portfolio</span>
              </div>
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY * 2}>
              <h1 className="mb-8 text-primary-foreground">Selected Works</h1>
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY * 3}>
              <p className="text-xl md:text-2xl font-light text-primary-foreground/90 max-w-3xl leading-relaxed">
                A curated collection of projects showcasing my expertise in full-stack development,
                UI/UX design, and building scalable web applications.
              </p>
            </BlurFade>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-1/3 h-full bg-accent opacity-20 -z-0 transform translate-x-1/3 rotate-12"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-foreground opacity-10 -z-0 transform -translate-x-1/4"></div>
        </section>

        {/* Featured Projects */}
        <section className="section-padding px-6 md:px-12 bg-background">
          <div className="mx-auto w-full max-w-7xl">
            <BlurFade delay={BLUR_FADE_DELAY * 4}>
              <div className="mb-16">
                <div className="flex items-center gap-4 mb-6">
                  <h2>Featured Projects</h2>
                  <div className="flex-1 h-1 bg-primary"></div>
                </div>
                <p className="text-lg text-muted-foreground max-w-2xl">
                  Highlighting my most significant contributions and innovative solutions.
                </p>
              </div>
            </BlurFade>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {projects.slice(0, 2).map((project, id) => (
                <BlurFade key={project.title} delay={BLUR_FADE_DELAY * 5 + id * 0.15}>
                  <div className="relative group">
                    {project.active && (
                      <div className="absolute -top-4 -right-4 z-10 px-4 py-2 thick-border bg-accent text-accent-foreground">
                        <span className="text-xs font-medium uppercase tracking-wider">Active</span>
                      </div>
                    )}
                    <ProjectCard
                      title={project.title}
                      description={project.description}
                      dates={project.dates}
                      tags={project.technologies}
                      image={project.image}
                      video={project.video}
                      links={project.links}
                      onClick={() => handleProjectClick(project)}
                    />
                  </div>
                </BlurFade>
              ))}
            </div>
          </div>
        </section>

        {/* All Projects */}
        {projects.length > 2 && (
          <section className="section-padding px-6 md:px-12 bg-muted">
            <div className="mx-auto w-full max-w-7xl">
              <BlurFade delay={BLUR_FADE_DELAY * 7}>
                <div className="mb-16">
                  <div className="flex items-center gap-4 mb-6">
                    <h2>More Projects</h2>
                    <div className="flex-1 h-1 bg-accent"></div>
                  </div>
                  <p className="text-lg text-muted-foreground max-w-2xl">
                    Additional projects and experiments that showcase my versatility.
                  </p>
                </div>
              </BlurFade>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.slice(2).map((project, id) => (
                  <BlurFade key={project.title} delay={BLUR_FADE_DELAY * 8 + id * 0.15}>
                    <ProjectCard
                      title={project.title}
                      description={project.description}
                      dates={project.dates}
                      tags={project.technologies}
                      image={project.image}
                      video={project.video}
                      links={project.links}
                      onClick={() => handleProjectClick(project)}
                    />
                  </BlurFade>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Skills & Technologies */}
        <section className="section-padding px-6 md:px-12 bg-background relative overflow-hidden">
          <div className="mx-auto w-full max-w-7xl relative z-10">
            <BlurFade delay={BLUR_FADE_DELAY * 10}>
              <div className="text-center mb-12">
                <h2 className="mb-6">Technologies & Skills</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  A comprehensive toolkit for building modern web applications.
                </p>
              </div>
            </BlurFade>

            <BlurFade delay={BLUR_FADE_DELAY * 11}>
              <div className="thick-border bg-muted p-8 md:p-12">
                <div className="flex flex-wrap gap-3 justify-center">
                  {skills.map((skill, id) => (
                    <BlurFade key={skill} delay={BLUR_FADE_DELAY * 12 + id * 0.05}>
                      <Badge className="text-base px-5 py-3 thick-border bg-background text-foreground border-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 cursor-default font-medium">
                        {skill}
                      </Badge>
                    </BlurFade>
                  ))}
                </div>
              </div>
            </BlurFade>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/4 right-0 w-1/3 h-1/3 bg-secondary opacity-30 -z-0 transform translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-accent opacity-10 -z-0"></div>
        </section>

        {/* CTA Section */}
        <section className="section-padding px-6 md:px-12 bg-foreground text-background">
          <div className="mx-auto w-full max-w-7xl">
            <BlurFade delay={BLUR_FADE_DELAY * 13}>
              <div className="text-center">
                <h2 className="mb-6 text-background">Let's Build Something Together</h2>
                <p className="text-xl text-background/80 max-w-2xl mx-auto mb-10">
                  Interested in working together? I'm always open to discussing new projects,
                  creative ideas, or opportunities to be part of your vision.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <a
                    href={`mailto:${contactEmail}`}
                    className="thick-border border-background bg-background text-foreground px-8 py-4 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 font-medium uppercase text-sm tracking-wider"
                  >
                    Get in Touch
                  </a>
                  <Link
                    href="/#work"
                    className="thick-border border-background bg-transparent text-background px-8 py-4 hover:bg-background hover:text-foreground transition-all duration-300 font-medium uppercase text-sm tracking-wider"
                  >
                    View Experience
                  </Link>
                </div>
              </div>
            </BlurFade>
          </div>
        </section>
      </main>

      {/* Portfolio Modal */}
      <PortfolioModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        project={selectedProject}
      />
    </>
  );
}
