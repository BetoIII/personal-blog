# Notion Image URL Refresh Strategy

## The Problem
Notion file URLs are temporary signed AWS S3 URLs that expire after ~1 hour. Portfolio cover images stop loading when these URLs expire.

## Solution 1: Next.js ISR (Incremental Static Regeneration) - FREE ✅
**Currently Implemented**

Next.js ISR automatically regenerates pages at a specified interval when they receive traffic.

- `app/page.tsx` and `app/portfolio/page.tsx` have `export const revalidate = 1800` (30 minutes)
- When a user visits the page, Next.js checks if 30 minutes have passed
- If yes, it regenerates the page in the background with fresh Notion URLs
- Completely free on Vercel

**Pros:**
- 100% free
- No external dependencies
- Automatic on any page visit
- Built into Next.js

**Cons:**
- Only refreshes when someone visits the page
- If no traffic for >1 hour, images may expire

## Solution 2: Free External Cron Services - FREE ✅
**Use if you want guaranteed refresh without traffic**

Use a free cron service to ping your refresh endpoint every 30 minutes:

### Option A: [cron-job.org](https://cron-job.org) (Free)
1. Sign up at https://cron-job.org
2. Create a new cron job:
   - URL: `https://yourdomain.com/api/portfolio/refresh`
   - Schedule: `*/30 * * * *` (every 30 minutes)
3. Enable the job

### Option B: [EasyCron](https://www.easycron.com) (Free tier: 1 job)
1. Sign up at https://www.easycron.com/user/register
2. Create cron job:
   - URL: `https://yourdomain.com/api/portfolio/refresh`
   - Cron Expression: `*/30 * * * *`

### Option C: [UptimeRobot](https://uptimerobot.com) (Free)
1. Sign up at https://uptimerobot.com
2. Add a monitor:
   - Monitor Type: HTTP(s)
   - URL: `https://yourdomain.com/api/portfolio/refresh`
   - Monitoring Interval: 30 minutes (select from dropdown)
3. This pings your endpoint every 30 minutes

**Pros:**
- Guaranteed refresh even without traffic
- Set-and-forget solution
- Multiple free options

**Cons:**
- Requires external service signup
- Dependent on third-party reliability

## Solution 3: GitHub Actions - FREE ✅
**Use if you prefer GitHub-based automation**

Create `.github/workflows/refresh-portfolio.yml`:

```yaml
name: Refresh Portfolio Images

on:
  schedule:
    - cron: '*/30 * * * *'  # Every 30 minutes
  workflow_dispatch:  # Allow manual trigger

jobs:
  refresh:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger Portfolio Refresh
        run: |
          curl -X POST https://yourdomain.com/api/portfolio/refresh
```

**Pros:**
- 100% free
- Runs on GitHub infrastructure
- Version controlled
- Can trigger manually from GitHub UI

**Cons:**
- Requires GitHub repo
- 5-minute minimum interval (GitHub Actions limitation)

## Solution 4: Re-host Images (Permanent Fix) - FREE
**Best long-term solution**

Download Notion images and host them in your repo or on a free CDN:

1. Fetch images from Notion
2. Upload to:
   - `/public` folder in your repo
   - Free CDN like Cloudinary (free tier: 25GB storage, 25GB bandwidth/month)
   - ImgBB (free unlimited storage with account)
   - Cloudflare Images (paid but cheap: $5/month for 100k images)

3. Update `lib/notion-portfolio.ts` to use your hosted URLs

**Pros:**
- Images never expire
- Faster load times (no Notion redirect)
- No dependencies on Notion CDN

**Cons:**
- Manual update process when changing images in Notion
- Uses your storage/bandwidth

## Current Implementation

**Active:** Next.js ISR (Solution 1)
- `revalidate = 1800` on portfolio pages
- 30-minute cache on Notion data (`lib/portfolio-source.ts`)
- Manual refresh available at `/api/portfolio/refresh`

## Recommended Approach

1. **Start with ISR** (current setup) - works well for sites with regular traffic
2. **Add free external cron** (Solution 2) if you want guaranteed refresh
3. **Consider re-hosting** (Solution 4) for production sites with high traffic

## Manual Refresh

You can always manually refresh by visiting:
`https://yourdomain.com/api/portfolio/refresh`

Or by clearing the cache programmatically in your code:
```typescript
import { clearCache } from '@/lib/portfolio-source';
clearCache();
```
