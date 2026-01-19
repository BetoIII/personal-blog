import { put, list, del } from '@vercel/blob';
import fs from 'fs/promises';
import path from 'path';

// Path to store blob URL mappings
const BLOB_CACHE_FILE = path.join(process.cwd(), 'data', 'blob-cache.json');

export interface BlobCacheEntry {
  notionUrl: string;
  blobUrl: string;
  uploadedAt: string;
  projectSlug: string;
}

export interface ContentImageCache {
  notionUrl: string;
  blobUrl: string;
  uploadedAt: string;
}

export interface BlobCache {
  [projectSlug: string]: BlobCacheEntry & {
    contentImages?: ContentImageCache[];
  };
}

// Load blob cache from file
export async function loadBlobCache(): Promise<BlobCache> {
  try {
    const data = await fs.readFile(BLOB_CACHE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet, return empty cache
    return {};
  }
}

// Save blob cache to file
export async function saveBlobCache(cache: BlobCache): Promise<void> {
  try {
    // Ensure data directory exists
    await fs.mkdir(path.dirname(BLOB_CACHE_FILE), { recursive: true });
    await fs.writeFile(BLOB_CACHE_FILE, JSON.stringify(cache, null, 2));
  } catch (error) {
    console.error('Error saving blob cache:', error);
  }
}

// Upload image from Notion URL to Vercel Blob
export async function uploadImageToBlob(
  notionImageUrl: string,
  projectSlug: string
): Promise<string | null> {
  try {
    // Skip if URL is empty or invalid
    if (!notionImageUrl || !notionImageUrl.startsWith('http')) {
      return null;
    }

    // Download image from Notion
    console.log(`Downloading image for ${projectSlug}...`);
    const response = await fetch(notionImageUrl);

    if (!response.ok) {
      console.error(`Failed to download image for ${projectSlug}: ${response.statusText}`);
      return null;
    }

    const blob = await response.blob();

    // Determine file extension from content type
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const extension = contentType.split('/')[1]?.split(';')[0] || 'jpg';

    // Upload to Vercel Blob
    console.log(`Uploading to Vercel Blob: portfolio/${projectSlug}.${extension}`);
    const { url } = await put(`portfolio/${projectSlug}.${extension}`, blob, {
      access: 'public',
      addRandomSuffix: false,
      contentType,
    });

    console.log(`✓ Uploaded ${projectSlug} to ${url}`);
    return url;
  } catch (error) {
    console.error(`Error uploading image for ${projectSlug}:`, error);
    return null;
  }
}

// Sync a single project's image to blob storage
export async function syncProjectImage(
  projectSlug: string,
  notionImageUrl: string
): Promise<string | null> {
  try {
    // Load existing cache
    const cache = await loadBlobCache();

    // Check if we already have this image cached
    const cached = cache[projectSlug];
    if (cached && cached.blobUrl) {
      console.log(`Using cached blob URL for ${projectSlug}`);
      return cached.blobUrl;
    }

    // Upload new image
    const blobUrl = await uploadImageToBlob(notionImageUrl, projectSlug);

    if (!blobUrl) {
      return null;
    }

    // Update cache
    cache[projectSlug] = {
      notionUrl: notionImageUrl,
      blobUrl,
      uploadedAt: new Date().toISOString(),
      projectSlug,
    };

    await saveBlobCache(cache);
    return blobUrl;
  } catch (error) {
    console.error(`Error syncing project image for ${projectSlug}:`, error);
    return null;
  }
}

// Get blob URL for a project (from cache)
export async function getBlobUrl(projectSlug: string): Promise<string | null> {
  try {
    const cache = await loadBlobCache();
    return cache[projectSlug]?.blobUrl || null;
  } catch (error) {
    return null;
  }
}

// List all blobs in storage
export async function listAllBlobs() {
  try {
    const { blobs } = await list();
    return blobs;
  } catch (error) {
    console.error('Error listing blobs:', error);
    return [];
  }
}

// Delete a blob from storage
export async function deleteBlob(url: string) {
  try {
    await del(url);
    console.log(`Deleted blob: ${url}`);
  } catch (error) {
    console.error('Error deleting blob:', error);
  }
}

// Clear blob cache for a specific project
export async function clearProjectCache(projectSlug: string) {
  try {
    const cache = await loadBlobCache();
    const entry = cache[projectSlug];

    if (entry?.blobUrl) {
      // Delete from blob storage
      await deleteBlob(entry.blobUrl);
    }

    // Delete content images
    if (entry?.contentImages) {
      for (const img of entry.contentImages) {
        await deleteBlob(img.blobUrl);
      }
    }

    // Remove from cache
    delete cache[projectSlug];
    await saveBlobCache(cache);

    console.log(`Cleared cache for ${projectSlug}`);
  } catch (error) {
    console.error(`Error clearing cache for ${projectSlug}:`, error);
  }
}

// Extract image URLs from markdown content
export function extractImageUrls(markdown: string): string[] {
  const imageUrls: string[] = [];

  // Match markdown images: ![alt](url)
  const markdownImageRegex = /!\[.*?\]\((https?:\/\/[^)]+)\)/g;
  let match;

  while ((match = markdownImageRegex.exec(markdown)) !== null) {
    const url = match[1];
    // Only process Notion/AWS S3 URLs (not already cached blob URLs)
    if (url.includes('amazonaws.com') || url.includes('notion.so')) {
      imageUrls.push(url);
    }
  }

  return imageUrls;
}

// Upload a content image to blob storage
async function uploadContentImage(
  imageUrl: string,
  projectSlug: string,
  index: number
): Promise<string | null> {
  try {
    console.log(`Downloading content image ${index} for ${projectSlug}...`);
    const response = await fetch(imageUrl);

    if (!response.ok) {
      console.error(`Failed to download content image: ${response.statusText}`);
      return null;
    }

    const blob = await response.blob();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const extension = contentType.split('/')[1]?.split(';')[0] || 'jpg';

    // Upload with index to make unique
    const blobPath = `portfolio/${projectSlug}/content-${index}.${extension}`;
    console.log(`Uploading to Vercel Blob: ${blobPath}`);

    const { url } = await put(blobPath, blob, {
      access: 'public',
      addRandomSuffix: false,
      contentType,
    });

    console.log(`✓ Uploaded content image ${index} to ${url}`);
    return url;
  } catch (error) {
    console.error(`Error uploading content image ${index}:`, error);
    return null;
  }
}

// Process markdown content: upload images and replace URLs
export async function processContentImages(
  markdown: string,
  projectSlug: string
): Promise<string> {
  try {
    // Load cache
    const cache = await loadBlobCache();
    const projectCache = cache[projectSlug] || { contentImages: [] };

    // Extract all image URLs from markdown
    const imageUrls = extractImageUrls(markdown);

    if (imageUrls.length === 0) {
      console.log(`No images found in content for ${projectSlug}`);
      return markdown;
    }

    console.log(`Found ${imageUrls.length} images in ${projectSlug} content`);

    // Process each image
    let processedMarkdown = markdown;
    const contentImages: ContentImageCache[] = projectCache.contentImages || [];

    for (let i = 0; i < imageUrls.length; i++) {
      const notionUrl = imageUrls[i];

      // Check if already cached
      const cached = contentImages.find(img => img.notionUrl === notionUrl);
      let blobUrl: string | null;

      if (cached) {
        console.log(`Using cached blob URL for content image ${i}`);
        blobUrl = cached.blobUrl;
      } else {
        // Upload new image
        blobUrl = await uploadContentImage(notionUrl, projectSlug, i);

        if (blobUrl) {
          // Add to cache
          contentImages.push({
            notionUrl,
            blobUrl,
            uploadedAt: new Date().toISOString(),
          });
        }
      }

      // Replace URL in markdown
      if (blobUrl) {
        processedMarkdown = processedMarkdown.replace(notionUrl, blobUrl);
      }
    }

    // Update cache
    cache[projectSlug] = {
      ...projectCache,
      contentImages,
      projectSlug,
      notionUrl: projectCache.notionUrl || '',
      blobUrl: projectCache.blobUrl || '',
      uploadedAt: projectCache.uploadedAt || new Date().toISOString(),
    };

    await saveBlobCache(cache);

    return processedMarkdown;
  } catch (error) {
    console.error(`Error processing content images for ${projectSlug}:`, error);
    return markdown; // Return original on error
  }
}
