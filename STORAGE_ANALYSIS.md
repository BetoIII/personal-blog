# Storage Layer Analysis for Notion Images

## Problem Recap
Notion returns temporary signed S3 URLs that expire after ~1 hour. We need permanent URLs.

## Option 1: Blob Storage (RECOMMENDED ✅)

### Services & Free Tiers:
1. **Vercel Blob** - 1 GB free, then $0.15/GB
2. **Cloudflare R2** - 10 GB free, then $0.015/GB (cheapest)
3. **Supabase Storage** - 1 GB free, then $0.021/GB

### How It Works:
```
Notion API → Download images → Upload to Blob → Store permanent URLs
```

### Implementation:
1. On project fetch, check if image exists in blob storage
2. If not, download from Notion and upload to blob
3. Save blob URL in your data (never expires)
4. Only re-sync when you update Notion

### Pros:
- ✅ **Images never expire** - permanent URLs
- ✅ **Faster loading** - served from CDN, no Notion redirect
- ✅ **Better performance** - optimized delivery
- ✅ **Cache at edge** - Cloudflare/Vercel CDN
- ✅ **Bandwidth savings** - not hitting Notion API repeatedly

### Cons:
- Storage costs after free tier (but minimal - ~10-20 project images = ~5MB)
- Need initial sync script
- Slightly more complex setup

### Cost Estimate:
- 20 portfolio images at ~500KB each = 10MB total
- **Vercel Blob:** Free (well under 1GB)
- **Cloudflare R2:** Free forever (under 10GB)
- **Realistic cost: $0/month**

### Code Example:
```typescript
import { put } from '@vercel/blob';

async function cacheNotionImage(notionUrl: string, projectSlug: string) {
  // Download from Notion
  const response = await fetch(notionUrl);
  const blob = await response.blob();

  // Upload to Vercel Blob
  const { url } = await put(`portfolio/${projectSlug}/cover.jpg`, blob, {
    access: 'public',
    addRandomSuffix: false,
  });

  return url; // Permanent URL!
}
```

---

## Option 2: Neon DB / Database (NOT RECOMMENDED ❌)

### How It Would Work:
```
Notion API → Cache response in Postgres → Serve from DB
```

### Pros:
- ✅ Fast queries for metadata
- ✅ Could store structured project data
- ✅ Free tier available (Neon: 0.5 GB)

### Cons:
- ❌ **Doesn't solve URL expiration** - storing expired URLs in DB doesn't help
- ❌ **Wrong tool** - databases aren't for binary data (images)
- ❌ **Still need refresh logic** - URLs expire regardless of where they're cached
- ❌ **Added complexity** - another service to manage
- ❌ **Slower than blob storage** - not optimized for serving files

### When Database Makes Sense:
- You have complex relational data
- Need full-text search across projects
- Want to decouple from Notion entirely
- Building a CMS on top of Notion

### For this use case:
**Not worth it** - the Notion URLs still expire, so you'd need the same refresh logic. You're just adding a database layer that doesn't solve the core problem.

---

## Option 3: Hybrid Approach (BEST FOR SCALE 🚀)

Combine blob storage + database for production apps:

```
Notion API → Process → {
  Images → Blob Storage (permanent URLs)
  Metadata → Neon DB (fast queries)
}
```

### When to use:
- Large portfolio (100+ projects)
- Need filtering/search
- Want to decouple from Notion
- Building a full CMS

### Example Architecture:
```typescript
// Notion sync job (run once per day)
async function syncNotionToStorage() {
  const projects = await fetchNotionProjects();

  for (const project of projects) {
    // 1. Upload image to blob storage
    const imageUrl = await cacheNotionImage(project.cover, project.slug);

    // 2. Store metadata in Neon
    await db.portfolio.upsert({
      where: { slug: project.slug },
      create: {
        slug: project.slug,
        title: project.title,
        description: project.description,
        imageUrl, // Permanent blob URL
        technologies: project.technologies,
      },
    });
  }
}
```

---

## Recommendation for Your Site

### Current Scale (~15-20 projects):
**Use Blob Storage Only** (Option 1)

Why:
- Solves the URL expiration problem permanently
- Free (under 1GB)
- Simple to implement
- No database needed for this scale
- Next.js ISR handles caching just fine

### Implementation Steps:
1. Install: `pnpm add @vercel/blob`
2. Create sync script to upload Notion images to Vercel Blob
3. Update `lib/notion-portfolio.ts` to return blob URLs
4. Run sync script manually when you update projects
5. Done! No more expiring URLs

### When to Add Database:
- You exceed 50+ projects
- Need complex filtering/search
- Want admin panel to manage projects
- Need analytics on project views

---

## Quick Win: Cloudflare R2 (Free Forever)

**Best free option if you want permanent storage:**

1. Sign up for Cloudflare account (free)
2. Enable R2 Storage (10 GB free forever)
3. Upload images via their dashboard or API
4. Get permanent URLs
5. Update Notion with R2 URLs

**Cost: $0 forever** (10GB free, you need ~10MB)

---

## Summary

| Solution | Solves Expiration | Cost | Complexity | Recommended |
|----------|------------------|------|------------|-------------|
| Blob Storage | ✅ Yes | Free | Low | ✅ YES |
| Database Only | ❌ No | Free | Medium | ❌ NO |
| Hybrid (Blob + DB) | ✅ Yes | Free* | High | Only at scale |
| Current ISR | ⚠️ Partially | Free | None | Current |

**Verdict: Add blob storage for permanent solution.**
