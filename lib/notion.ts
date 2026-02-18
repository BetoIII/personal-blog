/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";
import {
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

// Custom transformer for code blocks to handle nested backticks
// (e.g. CLAUDE.md content containing ``` inside a Notion code block)
n2m.setCustomTransformer("code", async (block: any) => {
  const { code } = block as any;
  if (!code) return "";

  const language = (code.language || "").replace(/\s+/g, "");
  const text = (code.rich_text || [])
    .map((rt: any) => rt.plain_text)
    .join("");

  // Find the longest backtick sequence in the content and use one more
  // to ensure the fence can never be broken by the content
  const backtickMatches = text.match(/`+/g) || [];
  const maxBacktickLen = backtickMatches.reduce(
    (max: number, s: string) => Math.max(max, s.length),
    2
  );
  const fence = "`".repeat(Math.max(3, maxBacktickLen + 1));

  return `${fence}${language}\n${text}\n${fence}`;
});

// Custom transformer for embed blocks (Spotify, YouTube, etc.)
n2m.setCustomTransformer("embed", async (block: any) => {
  const { embed } = block as any;

  if (!embed?.url) {
    return "";
  }

  const url = embed.url;

  // Handle Spotify embeds
  if (url.includes("spotify.com")) {
    // Convert Spotify URLs to embed format
    // Example: https://open.spotify.com/playlist/xyz -> https://open.spotify.com/embed/playlist/xyz
    let embedUrl = url;

    // If it's already an embed URL, use it as is
    if (!url.includes("/embed/")) {
      embedUrl = url.replace("open.spotify.com/", "open.spotify.com/embed/");
    }

    // Return markdown with special syntax that we'll parse in the renderer
    return `[spotify-embed](${embedUrl})`;
  }

  // Handle YouTube embeds
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    let videoId = "";

    if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0];
    } else if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1]?.split("&")[0];
    }

    if (videoId) {
      return `[youtube-embed](https://www.youtube.com/embed/${videoId})`;
    }
  }

  // For other embeds, just return the URL
  return `[embed](${url})`;
});

// Your Notion database ID
const DATABASE_ID = process.env.NOTION_DATABASE_ID || "";
if (!DATABASE_ID) {
  throw new Error("NOTION_DATABASE_ID environment variable is not set");
}

export interface NotionBlogPost {
  id: string;
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
  featured?: boolean;
  thumbnail?: string;
  author?: string;
  authorImage?: string;
  readTime?: string;
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

// Helper function to get people
function getPeople(property: any): string {
  if (!property || property.type !== "people") return "";
  if (property.people.length === 0) return "";
  return property.people[0].name || "";
}

// Helper function to get status
function getStatus(property: any): string {
  if (!property || property.type !== "status") return "";
  return property.status?.name || "";
}

// Helper function to get date value
function getDate(property: any): string {
  if (!property || property.type !== "date") return "";
  return property.date?.start || "";
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

// Helper function to get title
function getTitle(property: any): string {
  if (!property || property.type !== "title") return "";
  return getPlainText(property.title);
}

// Helper function to create slug from title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Transform Notion page to BlogPost
function transformNotionPageToPost(page: PageObjectResponse): NotionBlogPost {
  const properties = page.properties;

  // Get title - try both "Title" and "Name" properties
  const title = getTitle(properties.Title) || getTitle(properties.Name);

  // Get status - check multiple possible property names and values
  const status = getStatus(properties.Status) || getSelect(properties.Status);
  const publishedValues = ["Published", "Live", "Done", "published", "live", "done"];
  
  // If no status field exists, consider posts published by default
  // Otherwise check if status is in the published values
  const hasStatusField = properties.Status !== undefined;
  const published = hasStatusField ? publishedValues.includes(status) : true;

  // Create slug from title if no slug property exists
  const slug = createSlug(title);

  // Get tags from both Tags (multi-select) and Category (select)
  const tags: string[] = [];
  if (properties.Tags) {
    tags.push(...getMultiSelect(properties.Tags));
  }
  const category = getSelect(properties.Category);
  if (category) {
    tags.push(category);
  }

  // Get date - try multiple property names
  const date = getDate(properties["Published Date"]) || 
               getDate(properties["Date"]) || 
               getDate(properties["Created"]) ||
               page.created_time;

  return {
    id: page.id,
    slug: slug,
    title: title,
    description: "", // No description field, will use excerpt from content
    date: date,
    tags: Array.from(new Set(tags)), // Deduplicate tags
    published: published,
    featured: false, // No featured field in your database
    thumbnail: getUrl(properties["Featured Image"]) || getFiles(properties["Cover"]) || getFiles(properties["Image"]),
    author: getPeople(properties.Author) || getPeople(properties["Created by"]),
    authorImage: "", // No author image field
    readTime: "", // No read time field, could calculate from content
  };
}

// Get all published blog posts
export async function getAllPosts(): Promise<NotionBlogPost[]> {
  try {
    const response: QueryDatabaseResponse = await notion.databases.query({
      database_id: DATABASE_ID,
      sorts: [
        {
          property: "Published Date",
          direction: "descending",
        },
      ],
    });

    // Filter by status and map to blog posts
    const allPosts = response.results
      .filter((page): page is PageObjectResponse => "properties" in page)
      .map(transformNotionPageToPost);
    
    // Debug logging (can be removed in production)
    console.log(`Fetched ${allPosts.length} total posts from Notion`);
    console.log(`Posts statuses:`, allPosts.map(p => ({ title: p.title, published: p.published })));
    
    return allPosts.filter((post) => post.published); // Filter for published posts only
  } catch (error) {
    console.error("Error fetching posts from Notion:", error);
    return [];
  }
}

// Get a single post by slug
export async function getPostBySlug(
  slug: string
): Promise<NotionBlogPost | null> {
  try {
    // Since we don't have a Slug field, we need to fetch all posts and find by generated slug
    const allPosts = await getAllPosts();
    const post = allPosts.find((p) => p.slug === slug);
    return post || null;
  } catch (error) {
    console.error("Error fetching post from Notion:", error);
    return null;
  }
}

// Get page content as markdown
export async function getPageContent(pageId: string): Promise<string> {
  try {
    const mdblocks = await n2m.pageToMarkdown(pageId);
    const mdString = n2m.toMarkdownString(mdblocks);
    return mdString.parent;
  } catch (error) {
    console.error("Error fetching page content:", error);
    return "";
  }
}

// Get all unique tags
export async function getAllTags(): Promise<string[]> {
  const posts = await getAllPosts();
  const tags = new Set<string>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}
