# Personal Blog Setup Guide

This is a personal blog combining the MagicUI blog template with Notion as a headless CMS.

## Features

- Beautiful, modern UI from MagicUI blog template
- Notion as a headless CMS for easy content management
- Dark/light mode support
- Tag filtering and categorization
- Responsive design
- Markdown rendering with syntax highlighting
- Static site generation with ISR (Incremental Static Regeneration)

## Prerequisites

1. **Notion Account**: You need a Notion account and workspace
2. **Notion Integration**: Create a Notion integration at https://www.notion.so/my-integrations
3. **Notion Database**: Your blog database has the following properties:
   - `Title` (Title type) - Blog post title
   - `Published Date` (Date) - Publication date
   - `Status` (Status) - Set to "Published", "Live", or "Done" to make post visible
   - `Tags` (Multi-select) - Post tags
   - `Category` (Select) - Post category (will also appear as a tag)
   - `Featured Image` (URL) - URL to post thumbnail image
   - `Author` (People) - Post author

   Note: Slugs are auto-generated from titles. No separate slug field needed.

## Setup Steps

### 1. Configure Notion Integration

1. Go to https://www.notion.so/my-integrations
2. Click "New integration"
3. Give it a name (e.g., "Personal Blog")
4. Select your workspace
5. Copy the **Internal Integration Token**

### 2. Connect Database to Integration

1. Open your Notion database: https://www.notion.so/betoiii/2826ede4d6f381bf83fde4b75e4c902f
2. Click the "..." menu in the top right
3. Select "Add connections"
4. Find and select your integration

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and add your credentials:
   ```env
   NEXT_PUBLIC_SITE_URL=http://localhost:3000

   # Your Notion integration token
   NOTION_TOKEN=secret_your_integration_token_here

   # Your database ID is already set
   NOTION_DATABASE_ID=2826ede4d6f381bf83fde4b75e4c902f
   ```

### 4. Install Dependencies

```bash
pnpm install
```

### 5. Run Development Server

```bash
pnpm dev
```

Visit http://localhost:3000 to see your blog!

### 6. Create Your First Blog Post

1. Open your Notion database
2. Create a new page
3. Fill in all the required properties:
   - **Title**: My First Post
   - **Published Date**: Today's date
   - **Status**: Set to "Published" (or "Live" or "Done")
   - **Tags**: Add a few tags
   - **Category**: Select a category
   - **Author**: Select yourself
4. Write your content in the page (supports markdown)
5. Refresh your blog to see the new post!

Note: The slug will be automatically generated from the title (e.g., "My First Post" → "my-first-post")

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables:
   - `NOTION_TOKEN`: Your Notion integration token
   - `NOTION_DATABASE_ID`: Your database ID
   - `NEXT_PUBLIC_SITE_URL`: https://betoiii.com
5. Deploy!

### Configure Custom Domain (betoiii.com)

1. In Vercel, go to your project settings
2. Navigate to "Domains"
3. Add `betoiii.com` and `www.betoiii.com`
4. Vercel will provide DNS records

5. In Cloudflare:
   - Go to your domain's DNS settings
   - Add the DNS records provided by Vercel
   - For apex domain (betoiii.com): Add A record or CNAME (as specified by Vercel)
   - For www: Add CNAME record pointing to your Vercel deployment

6. Wait for DNS propagation (usually 5-60 minutes)

## Project Structure

```
personal-blog/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Home page (blog list)
│   └── blog/[slug]/       # Dynamic blog post pages
├── components/            # React components
│   ├── markdown-renderer.tsx  # Notion markdown renderer
│   └── ...
├── lib/                   # Utilities and libraries
│   ├── notion.ts         # Notion API integration
│   ├── blog-source.ts    # Blog data adapter
│   └── site.ts           # Site configuration
└── .env.local            # Environment variables (create this)
```

## Customization

### Change Site Branding

Edit `lib/site.ts`:
```typescript
export const siteConfig = {
  name: "Your Blog Name",
  url: "https://yourdomain.com",
  description: "Your blog description",
};
```

### Modify Blog Header

Edit `app/page.tsx` around line 84:
```tsx
<h1>Your Blog Title</h1>
<p>Your blog subtitle</p>
```

### Styling

The blog uses Tailwind CSS. You can customize:
- `tailwind.config.js` - Theme colors, fonts, etc.
- `app/globals.css` - Global styles

## Caching

The blog implements a 60-second cache for Notion API calls to improve performance and reduce API usage. You can adjust this in `lib/blog-source.ts`:

```typescript
const CACHE_DURATION = 60 * 1000; // 60 seconds
```

## Troubleshooting

### Posts not appearing?

1. Check that `Status` is set to "Published", "Live", or "Done" in Notion
2. Verify your `NOTION_TOKEN` is correct
3. Ensure the integration is connected to your database
4. Check the browser console and server logs for errors
5. Make sure the `Published Date` is set

### Build errors?

1. Make sure all environment variables are set
2. Run `pnpm install` to ensure all dependencies are installed
3. Clear Next.js cache: `rm -rf .next`

### Images not loading?

Add your image domains to `next.config.ts`:

```typescript
images: {
  domains: ['your-image-domain.com'],
}
```

## Support

For issues or questions:
- Check the Next.js docs: https://nextjs.org/docs
- Check the Notion API docs: https://developers.notion.com
- Review the MagicUI docs: https://magicui.design

## License

This project combines:
- MagicUI Blog Template
- Notion API integration
- Custom adaptations for personal use
