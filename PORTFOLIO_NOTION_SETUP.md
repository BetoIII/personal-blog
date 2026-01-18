# Portfolio Notion Integration Setup

This guide will help you connect your Notion portfolio database to your personal blog site.

## Overview

Your blog already uses Notion for blog posts. Now we're adding a **second Notion integration** for your portfolio projects because they're in a **different Notion workspace**.

## Prerequisites

- Access to your Notion portfolio workspace
- The portfolio database URL: `https://betoiii.notion.site/437124ca982d4a78af1fc316d5fe0d34`

## Step 1: Create a Notion Integration

Since your portfolio is in a different workspace from your blog, you need to create a separate integration.

1. Go to https://www.notion.so/my-integrations
2. Click **"+ New integration"**
3. Fill in the details:
   - **Name**: "Portfolio Integration" (or any name you prefer)
   - **Associated workspace**: Select the workspace where your portfolio database lives
   - **Type**: Internal integration
4. Click **"Submit"**
5. Copy the **"Internal Integration Token"** - you'll need this in Step 3

## Step 2: Extract Your Database ID

Your portfolio database URL is:
```
https://betoiii.notion.site/437124ca982d4a78af1fc316d5fe0d34?v=673c49f8db684f10bc860a156c173016
```

The Database ID is the part between the last `/` and the `?`:
```
437124ca982d4a78af1fc316d5fe0d34
```

You can also add dashes to format it (both formats work):
```
437124ca-982d-4a78-af1f-c316d5fe0d34
```

## Step 3: Add Environment Variables

Create or update your `.env.local` file in the project root with these new variables:

```bash
# Existing blog variables (keep these)
NOTION_TOKEN=your_blog_token_here
NOTION_DATABASE_ID=your_blog_database_id_here

# New portfolio variables (add these)
NOTION_PORTFOLIO_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_PORTFOLIO_DATABASE_ID=437124ca982d4a78af1fc316d5fe0d34
```

Replace `NOTION_PORTFOLIO_TOKEN` with the token you copied in Step 1.

## Step 4: Connect Integration to Database

The integration needs permission to access your database:

1. Open your portfolio database in Notion
2. Click the **•••** (three dots) menu in the top-right
3. Select **"Connections"** → **"Add connections"**
4. Find and select your "Portfolio Integration"
5. Click **"Confirm"**

## Step 5: Setup Your Database Schema

Your Notion database should have the following properties for best results:

### Required Properties

| Property Name | Type | Description | Example |
|--------------|------|-------------|---------|
| **Name** or **Title** | Title | Project name | "E-commerce Platform" |
| **Description** | Rich Text | Project description | "A full-stack e-commerce..." |
| **Technologies** | Multi-select | Tech stack | React, Node.js, MongoDB |
| **Dates** | Rich Text | Timeline | "Jan 2024 - Present" |

### Optional Properties

| Property Name | Type | Description | Example |
|--------------|------|-------------|---------|
| **Active** | Checkbox | Is project active? | ✓ |
| **Featured** | Checkbox | Featured project? | ✓ |
| **Links** | Rich Text | Project links (see format below) | "Website: https://..." |
| **Website** | URL | Project website | https://example.com |
| **GitHub** | URL | Source code | https://github.com/... |
| **Thumbnail** | URL or Files | Project image | URL or upload |
| **Video** | URL | Demo video | https://youtube.com/... |
| **Order** | Number | Display order | 1, 2, 3... |

### Links Format

If using the **Links** property (Rich Text), format each link on a separate line:

```
Website: https://example.com
GitHub: https://github.com/username/repo
Demo: https://demo.example.com
```

The code will parse this format automatically.

### Alternative Property Names

The integration is flexible and will check for alternative property names:

- **Title field**: Name, Title, or Project
- **Technologies**: Technologies, Tech Stack, or Tags
- **Description**: Description or Summary
- **Dates**: Dates, Timeline, or Period
- **Active**: Active or In Progress
- **Image**: Thumbnail, Image, or Cover

## Step 6: Test the Connection

Run the test script to verify everything is working:

```bash
node scripts/test-portfolio-notion-connection.js
```

This will:
- ✅ Check if your environment variables are set
- ✅ Test authentication with Notion
- ✅ Verify database access
- ✅ Show your database properties
- ✅ Display sample projects
- ✅ Provide property mapping guidance

## Step 7: Run Your Development Server

```bash
pnpm dev
```

Visit `http://localhost:3000/portfolio` to see your projects!

## Troubleshooting

### Error: "unauthorized"

**Problem**: Your integration token is invalid or not set.

**Solution**: 
1. Check that `NOTION_PORTFOLIO_TOKEN` is set in `.env.local`
2. Verify you're using the correct token from the integration you created
3. Make sure you created the integration in the RIGHT workspace (where your portfolio lives)

### Error: "object_not_found"

**Problem**: The integration doesn't have access to your database.

**Solution**:
1. Open your database in Notion
2. Click ••• → Connections → Add connections
3. Select your portfolio integration
4. If you don't see your integration, you might have created it in the wrong workspace

### Error: "validation_error"

**Problem**: The database ID format is incorrect.

**Solution**:
1. Double-check you copied the right part of the URL
2. The ID should be 32 characters (with or without dashes)
3. From your URL `...site/437124ca982d4a78af1fc316d5fe0d34?v=...`
4. Extract: `437124ca982d4a78af1fc316d5fe0d34`

### Projects Not Showing Up

**Possible causes**:

1. **No projects in database**: Add some projects to your Notion database
2. **Check Order property**: Projects are sorted by the "Order" property (if it exists)
3. **Check console**: Run `pnpm dev` and check the terminal for error messages
4. **Restart dev server**: Sometimes you need to restart after adding `.env.local`

### Cache Issues

The portfolio data is cached for 60 seconds. If you update Notion and don't see changes:

1. Wait 60 seconds, or
2. Restart your dev server

## Example Database Setup

Here's a quick example of how to set up one project in your Notion database:

| Field | Value |
|-------|-------|
| **Name** | "Personal Blog" |
| **Description** | "A modern blog built with Next.js and Notion as CMS" |
| **Technologies** | Next.js, TypeScript, Tailwind CSS, Notion API |
| **Dates** | "Dec 2023 - Present" |
| **Active** | ✓ |
| **Featured** | ✓ |
| **Website** | https://yoursite.com |
| **GitHub** | https://github.com/you/blog |
| **Order** | 1 |

## How It Works

1. **Two Separate Integrations**: Your blog and portfolio use different Notion tokens because they're in different workspaces
2. **Data Fetching**: The app fetches from Notion when the portfolio page loads
3. **Caching**: Results are cached for 60 seconds to improve performance
4. **Fallback**: If Notion data can't be fetched, the app falls back to the hardcoded data in `lib/portfolio-data.tsx`

## Files Created

- `lib/notion-portfolio.ts` - Notion client and data fetching for portfolio
- `lib/portfolio-source.ts` - Data transformation and caching
- `scripts/test-portfolio-notion-connection.js` - Test script
- Updated `app/portfolio/page.tsx` - Now fetches from Notion

## Next Steps

1. Set up your database properties in Notion
2. Add your portfolio projects
3. Run the test script to verify
4. Deploy! Your portfolio will automatically pull from Notion

## Questions?

If you run into issues:
1. Run the test script for detailed diagnostics
2. Check the terminal output when running `pnpm dev`
3. Verify all environment variables are set correctly
4. Make sure the integration is connected to your database in Notion

---

Happy coding! 🚀
