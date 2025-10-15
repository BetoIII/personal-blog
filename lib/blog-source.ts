import { getAllPosts, getPostBySlug, getPageContent, NotionBlogPost } from "./notion";

export interface BlogData {
  title: string;
  description: string;
  date: string;
  tags?: string[];
  featured?: boolean;
  readTime?: string;
  author?: string;
  authorImage?: string;
  thumbnail?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any; // For MDX content
}

export interface BlogPage {
  url: string;
  data: BlogData;
}

// Transform NotionBlogPost to BlogPage format expected by MagicUI
function transformToBlogPage(post: NotionBlogPost): BlogPage {
  return {
    url: `/blog/${post.slug}`,
    data: {
      title: post.title,
      description: post.description,
      date: post.date,
      tags: post.tags,
      featured: post.featured,
      readTime: post.readTime,
      author: post.author,
      authorImage: post.authorImage,
      thumbnail: post.thumbnail,
    },
  };
}

// Blog source compatible with MagicUI's loader
export const notionBlogSource = {
  // Get all blog pages
  getPages: async (): Promise<BlogPage[]> => {
    const posts = await getAllPosts();
    return posts.map(transformToBlogPage);
  },

  // Get a single page by slug
  getPage: async (slugPath: string[]): Promise<(BlogPage & { content: string }) | null> => {
    const slug = slugPath[0];
    const post = await getPostBySlug(slug);

    if (!post) return null;

    const content = await getPageContent(post.id);

    return {
      url: `/blog/${post.slug}`,
      data: {
        title: post.title,
        description: post.description,
        date: post.date,
        tags: post.tags,
        featured: post.featured,
        readTime: post.readTime,
        author: post.author,
        authorImage: post.authorImage,
        thumbnail: post.thumbnail,
      },
      content,
    };
  },
};

// Cache for blog posts (revalidate every 60 seconds)
let cachedPosts: BlogPage[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 60 * 1000; // 60 seconds

export async function getCachedPosts(): Promise<BlogPage[]> {
  const now = Date.now();

  if (cachedPosts && now - lastFetchTime < CACHE_DURATION) {
    return cachedPosts;
  }

  cachedPosts = await notionBlogSource.getPages();
  lastFetchTime = now;

  return cachedPosts;
}

export function clearCache() {
  cachedPosts = null;
  lastFetchTime = 0;
}
