# MagicUI Blog

A modern, responsive blog built with Next.js 15, Fumadocs MDX, and Tailwind CSS. Beautiful interface for displaying articles, tutorials, and insights about React and modern web development.

## ✨ Features

- 🎨 **Modern Design** - Clean, responsive interface
- 📝 **MDX Support** - Write blog posts in MDX with full component support
- 🔌 **Notion Integration** - Use Notion as CMS for blog and portfolio
- 🌙 **Dark Mode** - Built-in dark/light theme toggle
- 🏷️ **Tags & Categories** - Organize content with tags
- ⭐ **Featured Posts** - Highlight your best articles
- 💼 **Portfolio Section** - Showcase your projects from Notion
- 📱 **Mobile Responsive** - Perfect on all devices
- 🚀 **Fast Performance** - Optimized with Next.js 15

## 🚀 Getting Started

```bash
# Clone the repository
git clone <repo-url>
cd blog-template

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## 🔌 Notion Integration

This blog supports two Notion integrations:

### Blog Posts (Notion CMS)
Connect your Notion database to manage blog posts dynamically.

**Setup:**
1. See `SETUP.md` for blog Notion integration
2. Test: `pnpm test:notion`

### Portfolio (Notion CMS)
Manage your portfolio projects in a separate Notion workspace.

**Setup:**
1. See `SETUP_SUMMARY.md` or `PORTFOLIO_QUICKSTART.md` for portfolio setup
2. Test: `pnpm test:portfolio`

Both integrations work independently - they can be in different Notion workspaces!

## ✍️ Adding Blog Posts

### Option 1: Notion (Recommended)
Add posts directly to your Notion database. Changes appear automatically!

### Option 2: MDX Files
Create a new MDX file in `blog/content/` with format `your-post-title.mdx`:

````mdx
---
title: "Your Blog Post Title"
description: "A brief description of your post"
date: "2024-12-01"
tags: ["React", "Next.js", "Tutorial"]
featured: true
readTime: "10 min read"
author: "Your Name"
---

Your blog post content here...

## Markdown Support

You can use all standard Markdown features plus MDX components.

```tsx
// Code syntax highlighting works great!
export default function Component() {
  return <div>Hello World!</div>;
}
```
````

## 🎨 Customization

### Adding New Tags/Categories

Simply add them to your blog post frontmatter. The system automatically generates tag pages.

### Featured Posts

Set `featured: true` in your blog post frontmatter to highlight it on the homepage (you can create a dedicated feature section in the home page).

### Styling

The project uses Tailwind CSS with a custom design system. Modify styles in:

- `app/globals.css` - Global styles
- Individual component files - Component-specific styles

### For Authors

Add your author details to the `lib/authors.ts` file.

```tsx
// lib/authors.ts
export const authors: Record<string, Author> = {
  dillion: {
    name: "Dillion Verma",
    position: "Software Engineer",
    avatar: "/authors/dillion.png",
  },
  arghya: {
    name: "Arghya Das",
    position: "Design System Engineer",
    avatar: "/authors/arghya.png",
  },
  // Add your author details here
  yourname: {
    name: "Your Full Name",
    position: "Your Position/Title",
    avatar: "/authors/your-avatar.png",
  },
} as const;
```

Then reference your author in blog posts using the key (e.g., `author: "yourname"`).

## 📖 Technologies Used

- **Next.js 15** - React framework with App Router
- **Notion API** - Headless CMS for blog and portfolio
- **Fumadocs MDX** - MDX processing and components
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type-safe JavaScript
- **Geist Font** - Modern typography

## 🧪 Testing & Scripts

```bash
# Test blog Notion connection
pnpm test:notion

# Test portfolio Notion connection
pnpm test:portfolio

# Development server
pnpm dev

# Production build
pnpm build
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
