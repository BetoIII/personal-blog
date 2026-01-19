import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BlurFadeText } from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ResumeCard } from "@/components/resume-card";
import { ProjectCard } from "@/components/project-card";
import { DATA } from "@/lib/portfolio-data";
import { getCachedPosts } from "@/lib/blog-source";
import { getCachedProjects } from "@/lib/portfolio-source";
import { Icons } from "@/components/icons";
import { HomePageStructuredData } from "@/components/structured-data";
import Markdown from "react-markdown";

const BLUR_FADE_DELAY = 0.04;

export const revalidate = 1800; // Revalidate every 30 minutes (ISR)

const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

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

export default async function Page() {
  const allPages = await getCachedPosts();
  const sortedBlogs = allPages.sort((a, b) => {
    const dateA = new Date(a.data.date).getTime();
    const dateB = new Date(b.data.date).getTime();
    return dateB - dateA;
  });

  // Get the 3 latest blog posts
  const latestBlogs = sortedBlogs.slice(0, 3);

  // Fetch projects from Notion
  const notionProjects = await getCachedProjects();

  // Use Notion projects if available, otherwise fall back to hardcoded data
  const projects = notionProjects.length > 0
    ? notionProjects.slice(0, 2).map(p => ({
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
    : DATA.projects.slice(0, 2);

  // Extract all unique skills from all Notion projects
  const allSkills = new Set<string>();
  notionProjects.forEach(project => {
    project.data.technologies.forEach(tech => allSkills.add(tech));
  });
  const skills = Array.from(allSkills).sort();

  return (
    <main className="flex flex-col min-h-screen">
      <HomePageStructuredData />
      <section id="hero" className="relative overflow-hidden section-padding px-6 md:px-12">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 relative z-10">
              <BlurFade delay={BLUR_FADE_DELAY}>
                <div className="inline-block mb-4 px-4 py-2 thick-border bg-primary text-primary-foreground">
                  <span className="text-sm font-medium uppercase tracking-wider">GTM & AI Advisor</span>
                </div>
              </BlurFade>
              <BlurFadeText
                delay={BLUR_FADE_DELAY * 2}
                className="mb-6"
                yOffset={12}
                text={`Hi, I'm ${DATA.name.split(" ")[0]}`}
              />
              <BlurFade delay={BLUR_FADE_DELAY * 3}>
                <p className="text-xl md:text-2xl font-light text-muted-foreground max-w-2xl leading-relaxed">
                  {DATA.description}
                </p>
              </BlurFade>
              <BlurFade delay={BLUR_FADE_DELAY * 4}>
                <div className="my-12 flex flex-wrap gap-4">
                  <a
                    href="#contact"
                    className="thick-border bg-primary text-primary-foreground px-8 py-4 hover:bg-foreground hover:text-background transition-all duration-300 font-medium uppercase text-sm tracking-wider"
                  >
                    Get in Touch
                  </a>
                  <a
                    href="#work"
                    className="thick-border bg-background text-foreground px-8 py-4 hover:bg-foreground hover:text-background transition-all duration-300 font-medium uppercase text-sm tracking-wider"
                  >
                    View Work
                  </a>
                </div>
              </BlurFade>
            </div>
            <div className="lg:col-span-4 relative">
              <BlurFade delay={BLUR_FADE_DELAY * 2}>
                <div className="relative">
                  <div className="absolute -top-6 -left-6 w-full h-full thick-border bg-accent -z-10"></div>
                  <Avatar className="w-full h-auto aspect-square thick-border">
                    <AvatarImage alt={DATA.name} src={DATA.avatarUrl} className="object-cover" />
                    <AvatarFallback className="text-6xl">{DATA.initials}</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-4 -right-4 bg-primary text-primary-foreground thick-border px-6 py-3">
                    <span className="font-serif text-2xl font-semibold">{DATA.initials}</span>
                  </div>
                </div>
              </BlurFade>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/3 h-full bg-secondary opacity-30 -z-10 transform translate-x-1/2"></div>
      </section>

      <section id="about" className="section-padding px-6 md:px-12 bg-muted relative">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-4">
              <BlurFade delay={BLUR_FADE_DELAY * 5}>
                <div className="sticky top-8">
                  <h2 className="mb-4">About</h2>
                  <div className="w-24 h-1 bg-primary"></div>
                </div>
              </BlurFade>
            </div>
            <div className="lg:col-span-8">
              <BlurFade delay={BLUR_FADE_DELAY * 6}>
                <div className="thick-border bg-background p-8 md:p-12">
                  <Markdown className="text-justify prose prose-lg text-lg max-w-full text-pretty font-sans text-foreground prose-headings:font-serif prose-headings:text-foreground prose-p:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
                    {DATA.summary}
                  </Markdown>
                </div>
              </BlurFade>
            </div>
          </div>
        </div>
      </section>

      <section id="work" className="section-padding px-6 md:px-12 relative overflow-hidden">
        <div className="mx-auto w-full max-w-7xl">
          <BlurFade delay={BLUR_FADE_DELAY * 7}>
            <div className="mb-16">
              <h2 className="mb-4">Work Experience</h2>
              <div className="w-32 h-1 bg-primary"></div>
            </div>
          </BlurFade>
          <div className="space-y-8">
            {DATA.work.map((work, id) => (
              <BlurFade
                key={work.company}
                delay={BLUR_FADE_DELAY * 8 + id * 0.1}
              >
                <ResumeCard
                  logoUrl={work.logoUrl}
                  altText={work.company}
                  title={work.company}
                  subtitle={work.title}
                  href={work.href}
                  badges={work.badges}
                  period={`${work.start} - ${work.end ?? "Present"}`}
                  description={work.description}
                />
              </BlurFade>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-accent opacity-10 -z-10"></div>
      </section>

      <section id="education" className="section-padding px-6 md:px-12 bg-muted">
        <div className="mx-auto w-full max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <BlurFade delay={BLUR_FADE_DELAY * 10}>
                <div className="mb-8">
                  <h2 className="mb-4">Education</h2>
                  <div className="w-24 h-1 bg-primary"></div>
                </div>
              </BlurFade>
              <div className="space-y-6">
                {DATA.education.map((education, id) => (
                  <BlurFade
                    key={education.school}
                    delay={BLUR_FADE_DELAY * 11 + id * 0.1}
                  >
                    <ResumeCard
                      href={education.href}
                      logoUrl={education.logoUrl}
                      altText={education.school}
                      title={education.school}
                      subtitle={education.degree}
                      period={`${education.start} - ${education.end}`}
                    />
                  </BlurFade>
                ))}
              </div>
            </div>
            <div className="lg:col-span-4">
              <BlurFade delay={BLUR_FADE_DELAY * 10}>
                <div className="mb-8">
                  <h2 className="mb-4">Skills</h2>
                  <div className="w-24 h-1 bg-primary"></div>
                </div>
              </BlurFade>
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, id) => (
                  <BlurFade key={skill} delay={BLUR_FADE_DELAY * 12 + id * 0.05}>
                    <Badge className="text-base px-4 py-2">{skill}</Badge>
                  </BlurFade>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="projects" className="section-padding px-6 md:px-12 relative">
        <div className="mx-auto w-full max-w-7xl">
          <BlurFade delay={BLUR_FADE_DELAY * 13}>
            <div className="text-center mb-16">
              <h2 className="mb-6">Check out my latest work</h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                I&apos;ve worked on a variety of projects, from simple
                websites to complex web applications. Here are a few of my
                favorites.
              </p>
            </div>
          </BlurFade>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {projects.map((project, id) => (
              <BlurFade
                key={project.title}
                delay={BLUR_FADE_DELAY * 14 + id * 0.15}
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

          <BlurFade delay={BLUR_FADE_DELAY * 15}>
            <div className="flex justify-center mt-16">
              <Link
                href="/portfolio"
                className="thick-border bg-primary text-primary-foreground px-8 py-4 hover:bg-foreground hover:text-background transition-all duration-300 font-medium uppercase text-sm tracking-wider inline-block"
              >
                View Portfolio →
              </Link>
            </div>
          </BlurFade>
        </div>
        <div className="absolute top-1/2 right-0 w-1/3 h-1/3 bg-secondary opacity-20 -z-10 transform translate-x-1/3"></div>
      </section>

      <section id="blog" className="section-padding px-6 md:px-12 bg-muted">
        <div className="mx-auto w-full max-w-7xl">
          <BlurFade delay={BLUR_FADE_DELAY * 15}>
            <div className="text-center mb-16">
              <h2 className="mb-6">I like to write things</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Thoughts, ideas, and insights from my journey in tech.
              </p>
            </div>
          </BlurFade>

          <Suspense fallback={<div className="text-center text-muted-foreground">Loading articles...</div>}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {latestBlogs.map((blog, id) => {
                const date = new Date(blog.data.date);
                const formattedDate = formatDate(date);

                return (
                  <BlurFade
                    key={blog.url}
                    delay={BLUR_FADE_DELAY * 16 + id * 0.1}
                  >
                    <Link
                      href={blog.url}
                      className="group block thick-border bg-background hover-lift h-full flex flex-col"
                    >
                      {blog.data.thumbnail && (
                        <div className="relative w-full h-48 overflow-hidden">
                          <Image
                            src={blog.data.thumbnail}
                            alt={blog.data.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        </div>
                      )}
                      <div className="p-6 flex flex-col flex-1">
                        <time className="block text-xs text-muted-foreground mb-2 uppercase tracking-wider">
                          {formattedDate}
                        </time>
                        <h3 className="text-xl font-serif font-medium mb-2 group-hover:text-primary transition-colors">
                          {blog.data.title}
                        </h3>
                        <p className="text-muted-foreground text-sm flex-1">
                          {blog.data.description}
                        </p>
                        <div className="mt-4 text-sm font-medium uppercase tracking-wider group-hover:translate-x-2 transition-transform">
                          Read More →
                        </div>
                      </div>
                    </Link>
                  </BlurFade>
                );
              })}
            </div>
          </Suspense>

          <BlurFade delay={BLUR_FADE_DELAY * 17}>
            <div className="flex justify-center mt-12">
              <Link
                href="/blog"
                className="thick-border bg-primary text-primary-foreground px-8 py-4 hover:bg-foreground hover:text-background transition-all duration-300 font-medium uppercase text-sm tracking-wider inline-block"
              >
                View all posts →
              </Link>
            </div>
          </BlurFade>
        </div>
      </section>

      <section id="contact" className="section-padding px-6 md:px-12 relative overflow-hidden">
        <div className="mx-auto w-full max-w-7xl">
          <BlurFade delay={BLUR_FADE_DELAY * 18}>
            <div className="thick-border bg-primary text-primary-foreground p-12 md:p-20 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-20 rounded-full transform translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-foreground opacity-10 rounded-full transform -translate-x-1/2 translate-y-1/2"></div>
              <div className="relative z-10">
                <h2 className="mb-6 text-primary-foreground">Get in Touch</h2>
                <p className="mx-auto max-w-2xl text-xl text-primary-foreground/90 mb-8">
                  Want to chat? Feel free to reach out via email or connect
                  with me on social media.
                </p>
                <div className="flex flex-row gap-4 justify-center mb-8">
                  {Object.entries(DATA.contact.social)
                    .filter(([, social]) => social.navbar)
                    .map(([name, social]) => (
                      <Link
                        key={name}
                        href={social.url}
                        target="_blank"
                        className="size-14 flex items-center justify-center thick-border border-primary-foreground bg-transparent hover:bg-primary-foreground hover:text-primary transition-all duration-300"
                        aria-label={name}
                      >
                        <social.icon className="size-6" />
                      </Link>
                    ))}
                </div>
                <a
                  href={`mailto:${DATA.contact.email}`}
                  className="inline-block thick-border border-primary-foreground bg-primary-foreground text-primary px-8 py-4 hover:bg-transparent hover:text-primary-foreground transition-all duration-300 font-medium uppercase text-sm tracking-wider"
                >
                  Send an Email
                </a>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>
    </main>
  );
}
