import { getAllProjects, getProjectBySlug, getProjectContent, NotionPortfolioProject, getFeaturedProjects } from "./notion-portfolio";

export interface PortfolioProjectData {
  title: string;
  description: string;
  dates: string;
  active: boolean;
  technologies: string[];
  image?: string;
  video?: string;
  links: Array<{
    type: string;
    href: string;
    icon?: React.ReactNode;
  }>;
  featured?: boolean;
}

export interface PortfolioProject {
  slug: string;
  href: string;
  data: PortfolioProjectData;
}

// Transform NotionPortfolioProject to PortfolioProject format
function transformToPortfolioProject(project: NotionPortfolioProject): PortfolioProject {
  return {
    slug: project.slug,
    href: `/portfolio/${project.slug}`,
    data: {
      title: project.title,
      description: project.description,
      dates: project.dates,
      active: project.active,
      technologies: project.technologies,
      image: project.thumbnail,
      video: project.video,
      links: project.links.map(link => ({
        type: link.type,
        href: link.url,
      })),
      featured: project.featured,
    },
  };
}

// Portfolio source compatible with the app
export const notionPortfolioSource = {
  // Get all portfolio projects
  getProjects: async (): Promise<PortfolioProject[]> => {
    const projects = await getAllProjects();
    return projects.map(transformToPortfolioProject);
  },

  // Get featured projects only
  getFeaturedProjects: async (): Promise<PortfolioProject[]> => {
    const projects = await getFeaturedProjects();
    return projects.map(transformToPortfolioProject);
  },

  // Get a single project by slug
  getProject: async (slug: string): Promise<(PortfolioProject & { content: string }) | null> => {
    const project = await getProjectBySlug(slug);

    if (!project) return null;

    const content = await getProjectContent(project.id);

    return {
      slug: project.slug,
      href: `/portfolio/${project.slug}`,
      data: {
        title: project.title,
        description: project.description,
        dates: project.dates,
        active: project.active,
        technologies: project.technologies,
        image: project.thumbnail,
        video: project.video,
        links: project.links.map(link => ({
          type: link.type,
          href: link.url,
        })),
        featured: project.featured,
      },
      content,
    };
  },
};

// Cache for portfolio projects (revalidate every 60 seconds)
let cachedProjects: PortfolioProject[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000; // 60 seconds

export async function getCachedProjects(): Promise<PortfolioProject[]> {
  const now = Date.now();

  if (cachedProjects && now - lastFetchTime < CACHE_DURATION) {
    return cachedProjects;
  }

  cachedProjects = await notionPortfolioSource.getProjects();
  lastFetchTime = now;

  return cachedProjects;
}

export function clearCache() {
  cachedProjects = null;
  lastFetchTime = 0;
}
