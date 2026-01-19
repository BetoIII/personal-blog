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

export interface BlobCache {
  [projectSlug: string]: BlobCacheEntry;
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

    // Remove from cache
    delete cache[projectSlug];
    await saveBlobCache(cache);

    console.log(`Cleared cache for ${projectSlug}`);
  } catch (error) {
    console.error(`Error clearing cache for ${projectSlug}:`, error);
  }
}
