import { DATA } from "@/lib/portfolio-data";
import { getCachedProjects } from "@/lib/portfolio-source";
import { Icons } from "@/components/icons";
import { PortfolioClient } from "@/components/portfolio-client";

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
        slug: p.slug,
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
        role: p.data.role || "",
      }))
    : DATA.projects.map((p, idx) => ({
        ...p,
        slug: `project-${idx}`,
      }));

  return (
    <PortfolioClient
      projects={projects}
      skills={DATA.skills}
      contactEmail={DATA.contact.email}
    />
  );
}
