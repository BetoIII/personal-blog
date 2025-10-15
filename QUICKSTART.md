# Quick Start Guide

## 🚀 Get Started in 5 Minutes

### 1. Get Your Notion Credentials

**Create Integration:**
1. Visit https://www.notion.so/my-integrations
2. Click "+ New integration"
3. Name it "Personal Blog"
4. Copy the **Integration Token**

**Connect Database:**
1. Open your database: https://www.notion.so/betoiii/2826ede4d6f381bf83fde4b75e4c902f
2. Click "..." → "Add connections"
3. Select your integration

### 2. Configure Environment

```bash
# Create environment file
cp .env.example .env.local

# Edit .env.local and add your token:
NOTION_TOKEN=secret_xxxxxxxxxxxxx
```

### 3. Install & Run

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit http://localhost:3000 🎉

## 📝 Create Your First Post

1. Open https://www.notion.so/betoiii/2826ede4d6f381bf83fde4b75e4c902f
2. Click "+ New" to create a page
3. Fill in:
   - **Title**: My First Post
   - **Published Date**: Today's date
   - **Status**: Set to "Published" (or "Live" or "Done")
   - **Tags**: Add a few tags
   - **Category**: Select a category
   - **Author**: Select yourself
4. Write your content in the page body
5. Refresh your blog!

Note: The slug is auto-generated from the title (e.g., "My First Post" → "my-first-post")

## 🌐 Deploy to Production

### Vercel Deployment

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin your-repo-url
git push -u origin main
```

Then:
1. Go to https://vercel.com
2. Import your repository
3. Add environment variables:
   - `NOTION_TOKEN`
   - `NOTION_DATABASE_ID=2826ede4d6f381bf83fde4b75e4c902f`
   - `NEXT_PUBLIC_SITE_URL=https://betoiii.com`
4. Deploy!

### Custom Domain (Cloudflare)

1. In Vercel: Settings → Domains → Add `betoiii.com`
2. Copy the DNS records Vercel provides
3. In Cloudflare: Add those DNS records
4. Wait 5-60 minutes for propagation

## 🎨 Quick Customizations

**Change Blog Title:**
- Edit `app/page.tsx` line 85

**Change Site Name:**
- Edit `lib/site.ts`

**Update Site URL:**
- Edit `.env.local` for development
- Update Vercel environment variable for production

## 📊 Notion Database Properties

Your Notion database has these properties:
- ✅ **Title** (Title) - Blog post title
- ✅ **Published Date** (Date) - Publication date
- ✅ **Status** (Status) - Set to "Published", "Live", or "Done"
- ✅ **Tags** (Multi-select) - Post tags
- ✅ **Category** (Select) - Post category
- 🖼️ **Featured Image** (URL) - Thumbnail image URL
- 👤 **Author** (People) - Post author

Slugs are auto-generated from titles!

## 🛠️ Common Commands

```bash
# Development
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint code
pnpm lint
```

## 💡 Tips

- Blog posts are cached for 60 seconds to improve performance
- Only posts with `Published` checked will appear on your blog
- Use markdown in your Notion pages for formatting
- Images from Notion will work automatically
- Changes to Notion will appear after the cache expires (60 seconds)

## ❓ Need Help?

See `SETUP.md` for detailed documentation and troubleshooting.
