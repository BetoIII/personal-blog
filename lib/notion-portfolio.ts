/* eslint-disable @typescript-eslint/no-explicit-any */
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";

// Initialize Notion client for PORTFOLIO (separate workspace)
const portfolioNotion = new Client({
  auth: process.env.NOTION_PORTFOLIO_TOKEN,
});

const portfolioN2m = new NotionToMarkdown({ notionClient: portfolioNotion });

// Your Portfolio Notion database ID
const PORTFOLIO_DATABASE_ID = process.env.NOTION_PORTFOLIO_DATABASE_ID || "";

export interface NotionPortfolioProject {
  id: string;
  slug: string;
  title: string;
  description: string;
  dates: string;
  active: boolean;
  technologies: string[];
  thumbnail?: string;
  video?: string;
  links: Array<{
    type: string;
    url: string;
  }>;
  role?: string;
  featured?: boolean;
  order?: number;
}

// Helper function to extract plain text from rich text
function getPlainText(richText: any[]): string {
  if (!richText || richText.length === 0) return "";
  return richText.map((text) => text.plain_text).join("");
}

// Helper function to get multi-select values
function getMultiSelect(property: any): string[] {
  if (!property || property.type !== "multi_select") return [];
  return property.multi_select.map((item: any) => item.name);
}

// Helper function to get select value
function getSelect(property: any): string {
  if (!property || property.type !== "select") return "";
  return property.select?.name || "";
}

// Helper function to get checkbox value
function getCheckbox(property: any): boolean {
  if (!property || property.type !== "checkbox") return false;
  return property.checkbox;
}

// Helper function to get URL value
function getUrl(property: any): string {
  if (!property || property.type !== "url") return "";
  return property.url || "";
}

// Helper function to get files
function getFiles(property: any): string {
  if (!property || property.type !== "files") return "";
  if (property.files.length === 0) return "";
  const file = property.files[0];
  if (file.type === "external") {
    return file.external.url;
  } else if (file.type === "file") {
    return file.file.url;
  }
  return "";
}

// Helper function to get page icon
function getPageIcon(page: PageObjectResponse): string {
  if (!page.icon) return "";
  
  if (page.icon.type === "external") {
    return page.icon.external.url;
  } else if (page.icon.type === "file") {
    return page.icon.file.url;
  } else if (page.icon.type === "emoji") {
    // Return emoji as-is (you could use it as text or convert to image)
    return page.icon.emoji;
  }
  
  return "";
}

// Helper function to get page cover
function getPageCover(page: PageObjectResponse): string {
  if (!page.cover) return "";
  
  if (page.cover.type === "external") {
    return page.cover.external.url;
  } else if (page.cover.type === "file") {
    return page.cover.file.url;
  }
  
  return "";
}

// Helper function to get title
function getTitle(property: any): string {
  if (!property || property.type !== "title") return "";
  return getPlainText(property.title);
}

// Helper function to get rich text
function getRichText(property: any): string {
  if (!property || property.type !== "rich_text") return "";
  return getPlainText(property.rich_text);
}

// Helper function to get number
function getNumber(property: any): number {
  if (!property || property.type !== "number") return 0;
  return property.number || 0;
}

// Helper function to create slug from title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Helper function to parse links from a text field
function parseLinks(linksText: string): Array<{ type: string; url: string }> {
  if (!linksText) return [];
  
  const links: Array<{ type: string; url: string }> = [];
  const lines = linksText.split('\n');
  
  for (const line of lines) {
    const match = line.match(/^(.*?):\s*(.+)$/);
    if (match) {
      links.push({
        type: match[1].trim(),
        url: match[2].trim(),
      });
    }
  }
  
  return links;
}

// Transform Notion page to PortfolioProject
function transformNotionPageToProject(page: PageObjectResponse): NotionPortfolioProject {
  const properties = page.properties;

  // Get title - try multiple property names
  const title = getTitle(properties.Name) || getTitle(properties.Title) || getTitle(properties.Project);

  // Get description
  const description = getRichText(properties.Description) || getRichText(properties.Summary) || "";

  // Get role - could be select or rich text
  const role = getSelect(properties.Role) ||
               getSelect(properties["Beto's Role"]) ||
               getRichText(properties.Role) ||
               getRichText(properties["Beto's Role"]) ||
               "";

  // Get dates - could be a text field or date range
  const dates = getRichText(properties.Dates) || 
                getRichText(properties.Timeline) || 
                getRichText(properties.Period) || "";

  // Get active status
  const active = getCheckbox(properties.Active) || 
                 getCheckbox(properties["In Progress"]) ||
                 getSelect(properties.Status) === "Active";

  // Get technologies/tech stack
  const technologies = getMultiSelect(properties.Technologies) || 
                       getMultiSelect(properties["Tech Stack"]) ||
                       getMultiSelect(properties.Tags) ||
                       [];

  // Get thumbnail/cover image - prioritize page cover, then page icon, then custom properties
  const thumbnail = getPageCover(page) ||
                   getPageIcon(page) ||
                   getUrl(properties.Thumbnail) || 
                   getFiles(properties.Image) ||
                   getFiles(properties.Cover) ||
                   "";

  // Get video URL
  const video = getUrl(properties.Video) || 
                getUrl(properties.Demo) ||
                "";

  // Get links - can be a rich text field with format "Type: URL"
  const linksText = getRichText(properties.Links) || "";
  const links = parseLinks(linksText);
  
  // Also check for specific link fields
  const websiteUrl = getUrl(properties.Website) || getUrl(properties.URL);
  const githubUrl = getUrl(properties.GitHub) || getUrl(properties.Source);
  
  if (websiteUrl && !links.find(l => l.type === "Website")) {
    links.push({ type: "Website", url: websiteUrl });
  }
  if (githubUrl && !links.find(l => l.type === "Source")) {
    links.push({ type: "Source", url: githubUrl });
  }

  // Get featured status
  const featured = getCheckbox(properties.Featured) || false;

  // Get order for sorting
  const order = getNumber(properties.Order) || getNumber(properties.Sort) || 0;

  // Create slug from title
  const slug = createSlug(title);

  return {
    id: page.id,
    slug,
    title,
    description,
    dates,
    active,
    technologies,
    thumbnail,
    video,
    links,
    role,
    featured,
    order,
  };
}

// Get all portfolio projects
export async function getAllProjects(): Promise<NotionPortfolioProject[]> {
  try {
    // Query without sorting initially (to avoid errors if Order property doesn't exist)
    const response: QueryDatabaseResponse = await portfolioNotion.databases.query({
      database_id: PORTFOLIO_DATABASE_ID,
    });

    const projects = response.results
      .filter((page): page is PageObjectResponse => "properties" in page)
      .map(transformNotionPageToProject);
    
    console.log(`Fetched ${projects.length} projects from Notion Portfolio`);
    
    // Sort by order (if set), then by featured status, then by title
    return projects.sort((a, b) => {
      // If both have order numbers, sort by order
      if (a.order !== 0 && b.order !== 0 && a.order !== b.order) {
        return a.order - b.order;
      }
      // Featured items first
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      // Then alphabetically by title
      return a.title.localeCompare(b.title);
    });
  } catch (error) {
    console.error("Error fetching projects from Notion:", error);
    return [];
  }
}

// Get a single project by slug
export async function getProjectBySlug(
  slug: string
): Promise<NotionPortfolioProject | null> {
  try {
    const allProjects = await getAllProjects();
    const project = allProjects.find((p) => p.slug === slug);
    return project || null;
  } catch (error) {
    console.error("Error fetching project from Notion:", error);
    return null;
  }
}

// Get project content as markdown (for project detail pages)
export async function getProjectContent(pageId: string): Promise<string> {
  try {
    const mdblocks = await portfolioN2m.pageToMarkdown(pageId);
    const mdString = portfolioN2m.toMarkdownString(mdblocks);
    return mdString.parent;
  } catch (error) {
    console.error("Error fetching project content:", error);
    return "";
  }
}

// Get all unique technologies
export async function getAllTechnologies(): Promise<string[]> {
  const projects = await getAllProjects();
  const techs = new Set<string>();
  projects.forEach((project) => {
    project.technologies.forEach((tech) => techs.add(tech));
  });
  return Array.from(techs).sort();
}

// Get featured projects only
export async function getFeaturedProjects(): Promise<NotionPortfolioProject[]> {
  const allProjects = await getAllProjects();
  return allProjects.filter((project) => project.featured);
}
