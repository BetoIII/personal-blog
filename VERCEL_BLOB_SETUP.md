# Vercel Blob Storage Setup Guide

## What This Does

Vercel Blob storage permanently caches your Notion portfolio images, solving the URL expiration problem. Once synced, images load from Vercel's CDN with permanent URLs that never expire.

## Setup Instructions

### 1. Enable Vercel Blob Storage

1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Select your project
3. Go to **Storage** tab
4. Click **Create Database**
5. Select **Blob** storage
6. Click **Create**

### 2. Get Your Blob Token

After creating blob storage:
1. Vercel automatically adds `BLOB_READ_WRITE_TOKEN` to your environment variables
2. No manual configuration needed!

### 3. Sync Your Images

Once deployed, sync all portfolio images to blob storage:

**Option A: Using the API (Recommended)**

```bash
# Sync all images
curl -X POST https://yourdomain.com/api/portfolio/sync-images

# Force re-sync (re-uploads even if cached)
curl -X POST "https://yourdomain.com/api/portfolio/sync-images?force=true"

# Sync a specific project
curl -X POST "https://yourdomain.com/api/portfolio/sync-images?project=cloudfix"
```

**Option B: From Browser**

Open in your browser (easier):
```
https://yourdomain.com/api/portfolio/sync-images
```

### 4. Check Sync Status

View what's currently cached:

```bash
curl https://yourdomain.com/api/portfolio/sync-images
```

Or visit in browser:
```
https://yourdomain.com/api/portfolio/sync-images
```

Returns:
```json
{
  "success": true,
  "cachedImages": 15,
  "cache": [
    {
      "projectSlug": "cloudfix",
      "blobUrl": "https://abc123.public.blob.vercel-storage.com/portfolio/cloudfix.jpg",
      "uploadedAt": "2026-01-18T22:30:00.000Z"
    }
  ]
}
```

## How It Works

### 1. Initial Sync
```
Notion (temp URLs) → Download → Vercel Blob → Permanent URLs
```

### 2. Subsequent Loads
```
Portfolio Page → Check blob-cache.json → Use permanent URL
                      ↓ (if not cached)
                  Use Notion URL (temporary)
```

### 3. Cache Structure

Images are stored at:
- **Blob Storage:** `https://[hash].public.blob.vercel-storage.com/portfolio/[slug].[ext]`
- **Local Cache:** `data/blob-cache.json`

Example `blob-cache.json`:
```json
{
  "cloudfix": {
    "notionUrl": "https://s3.amazonaws.com/...",
    "blobUrl": "https://abc123.public.blob.vercel-storage.com/portfolio/cloudfix.jpg",
    "uploadedAt": "2026-01-18T22:30:00.000Z",
    "projectSlug": "cloudfix"
  }
}
```

## Costs

### Vercel Blob Pricing
- **Free tier:** 1 GB storage, 1 GB bandwidth/month
- **Paid:** $0.15/GB storage, $0.15/GB bandwidth

### Your Usage
- ~15-20 portfolio images at 500KB each = **~10MB total**
- **Cost: $0** (well under free tier)

## Maintenance

### When to Re-sync

Re-sync when you:
1. Add new projects to Notion
2. Update project cover images
3. Want to force-refresh all images

**Manual Sync:**
```bash
curl -X POST "https://yourdomain.com/api/portfolio/sync-images?force=true"
```

### Clearing Cache

To delete a specific project's image:

```typescript
import { clearProjectCache } from '@/lib/blob-storage';
await clearProjectCache('cloudfix');
```

## Optional: Automated Sync

### Option 1: GitHub Actions (Free)

Create `.github/workflows/sync-images.yml`:

```yaml
name: Sync Portfolio Images

on:
  schedule:
    - cron: '0 0 * * 0'  # Weekly on Sunday
  workflow_dispatch:  # Manual trigger

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Sync Images to Blob Storage
        run: |
          curl -X POST https://yourdomain.com/api/portfolio/sync-images
```

### Option 2: Manual Sync (Recommended)

Just run the sync command whenever you update projects in Notion. Since images are permanent, you rarely need to sync.

## Troubleshooting

### Images still showing Notion URLs

1. Check if sync completed successfully:
   ```bash
   curl https://yourdomain.com/api/portfolio/sync-images
   ```

2. Force re-sync:
   ```bash
   curl -X POST "https://yourdomain.com/api/portfolio/sync-images?force=true"
   ```

3. Check Vercel logs for errors:
   - Go to Vercel dashboard → Your project → Logs
   - Filter for "sync-images"

### Blob storage not working

1. Verify `BLOB_READ_WRITE_TOKEN` exists:
   - Vercel dashboard → Project → Settings → Environment Variables
   - Should be automatically added when you create blob storage

2. Check if blob storage is enabled:
   - Vercel dashboard → Project → Storage tab
   - Should show "Blob" storage created

### Cache file not found

The `data/blob-cache.json` file is created automatically on first sync. If missing:

```bash
mkdir -p data
echo '{}' > data/blob-cache.json
```

## API Reference

### POST `/api/portfolio/sync-images`

Sync images to blob storage.

**Query Parameters:**
- `force=true` - Force re-upload even if cached
- `project=slug` - Sync only a specific project

**Response:**
```json
{
  "success": true,
  "message": "Synced 15/15 images",
  "results": [...],
  "stats": {
    "total": 15,
    "success": 15,
    "failed": 0
  }
}
```

### GET `/api/portfolio/sync-images`

Check sync status and view cached images.

**Response:**
```json
{
  "success": true,
  "cachedImages": 15,
  "cache": [...]
}
```

## Benefits

✅ **Images never expire** - permanent URLs
✅ **Faster loading** - served from Vercel CDN
✅ **Free forever** - well under 1GB limit
✅ **Simple maintenance** - sync when you update projects
✅ **Automatic fallback** - uses Notion URLs if blob fails

## Summary

1. Enable Vercel Blob storage in dashboard
2. Deploy your site (BLOB_READ_WRITE_TOKEN added automatically)
3. Run sync: `curl -X POST https://yourdomain.com/api/portfolio/sync-images`
4. Done! Images now load from permanent blob URLs
5. Re-sync manually whenever you update projects
