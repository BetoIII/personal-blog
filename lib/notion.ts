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

// Your Notion database ID
const DATABASE_ID = process.env.NOTION_DATABASE_ID || "";

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

// Transform Notion page to BlogPost
function transformNotionPageToPost(page: PageObjectResponse): NotionBlogPost {
  const properties = page.properties;

  return {
    id: page.id,
    slug: getPlainText((properties.Slug as any)?.rich_text || []) || page.id,
    title: getTitle(properties.Name || properties.Title || properties.Page),
    description:
      getPlainText((properties.Description as any)?.rich_text || []) || "",
    date: getDate(properties.Date) || page.created_time,
    tags: getMultiSelect(properties.Tags),
    published: getCheckbox(properties.Published),
    featured: getCheckbox(properties.Featured),
    thumbnail: getFiles(properties.Thumbnail),
    author: getPlainText((properties.Author as any)?.rich_text || []),
    authorImage: getFiles(properties.AuthorImage),
    readTime: getPlainText((properties.ReadTime as any)?.rich_text || []),
  };
}

// Get all published blog posts
export async function getAllPosts(): Promise<NotionBlogPost[]> {
  try {
    const response: QueryDatabaseResponse = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    return response.results
      .filter((page): page is PageObjectResponse => "properties" in page)
      .map(transformNotionPageToPost);
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
    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      filter: {
        and: [
          {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
          {
            property: "Slug",
            rich_text: {
              equals: slug,
            },
          },
        ],
      },
    });

    if (response.results.length === 0) return null;

    const page = response.results[0] as PageObjectResponse;
    return transformNotionPageToPost(page);
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
