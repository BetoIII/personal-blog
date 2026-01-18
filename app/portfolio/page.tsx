import Link from "next/link";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { Badge } from "@/components/ui/badge";
import { DATA } from "@/lib/portfolio-data";
import { getCachedProjects } from "@/lib/portfolio-source";
import { Icons } from "@/components/icons";

const BLUR_FADE_DELAY = 0.04;

// Helper function to get icon for link type
function getLinkIcon(type: string) {
  const typeLower = type.toLowerCase();
  if (typeLower.includes("github") || typeLower.includes("source")) {
    return <Icons.github className="size-3" />;
  }
  if (typeLower.includes("website") || typeLower.includes("demo") || typeLower.includes("live")) {
    return <Icons.globe className="size-3" />;
  }
  return <Icons.globe className="size-3" />;
}

export default async function PortfolioPage() {
  // Fetch projects from Notion
  const notionProjects = await getCachedProjects();
  
  // Use Notion projects if available, otherwise fall back to hardcoded data
  const projects = notionProjects.length > 0 
    ? notionProjects.map(p => ({
        title: p.data.title,
        href: p.data.links.find(l => l.type.toLowerCase().includes("website"))?.href || p.data.links[0]?.href || "#",
        dates: p.data.dates,
        active: p.data.active,
        description: p.data.description,
        technologies: p.data.technologies,
        links: p.data.links.map(link => ({
          type: link.type,
          href: link.href,
          icon: getLinkIcon(link.type),
        })),
        image: p.data.image || "",
        video: p.data.video || "",
      }))
    : DATA.projects;

  return (
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
            <h1 className="mb-8 text-primary-foreground">
              Selected Works
            </h1>
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
              <BlurFade
                key={project.title}
                delay={BLUR_FADE_DELAY * 5 + id * 0.15}
              >
                <div className="relative group">
                  {project.active && (
                    <div className="absolute -top-4 -right-4 z-10 px-4 py-2 thick-border bg-accent text-accent-foreground">
                      <span className="text-xs font-medium uppercase tracking-wider">Active</span>
                    </div>
                  )}
                  <ProjectCard
                    href={project.href}
                    title={project.title}
                    description={project.description}
                    dates={project.dates}
                    tags={project.technologies}
                    image={project.image}
                    video={project.video}
                    links={project.links}
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
                <BlurFade
                  key={project.title}
                  delay={BLUR_FADE_DELAY * 8 + id * 0.15}
                >
                  <ProjectCard
                    href={project.href}
                    title={project.title}
                    description={project.description}
                    dates={project.dates}
                    tags={project.technologies}
                    image={project.image}
                    video={project.video}
                    links={project.links}
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
                {DATA.skills.map((skill, id) => (
                  <BlurFade key={skill} delay={BLUR_FADE_DELAY * 12 + id * 0.05}>
                    <Badge className="text-base px-5 py-3 thick-border bg-background hover:bg-primary hover:text-primary-foreground transition-all duration-300 cursor-default">
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
                  href={`mailto:${DATA.contact.email}`}
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
  );
}
