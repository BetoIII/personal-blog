# Portfolio Notion Integration - Setup Summary

## What Was Created

I've set up a complete Notion integration for your portfolio, separate from your existing blog integration. Here's what was added:

### New Files Created

1. **`lib/notion-portfolio.ts`**
   - Notion client configured for your portfolio workspace
   - Functions to fetch portfolio projects from Notion
   - Flexible property mapping to handle various database schemas
   - Supports all common project fields (title, description, technologies, links, etc.)

2. **`lib/portfolio-source.ts`**
   - Data transformation layer
   - Caching mechanism (60-second cache)
   - Converts Notion data to the format your app expects

3. **`scripts/test-portfolio-notion-connection.js`**
   - Diagnostic tool to test your Notion connection
   - Shows your database properties and sample projects
   - Provides detailed error messages and fixes

4. **`PORTFOLIO_NOTION_SETUP.md`**
   - Comprehensive setup guide
   - Troubleshooting section
   - Database schema recommendations

5. **`PORTFOLIO_QUICKSTART.md`**
   - Quick reference for getting started
   - Essential commands and steps

### Updated Files

1. **`app/portfolio/page.tsx`**
   - Now fetches projects from Notion
   - Falls back to hardcoded data if Notion is unavailable
   - Automatically maps link icons (GitHub, Website, etc.)

2. **`package.json`**
   - Added `pnpm test:portfolio` script
   - Added `pnpm test:notion` script (for blog)

## Your Notion Database

From your URL, I extracted:
- **Database ID**: `437124ca982d4a78af1fc316d5fe0d34`
- **Database URL**: https://betoiii.notion.site/437124ca982d4a78af1fc316d5fe0d34

## Next Steps - What YOU Need To Do

### 1. Create a Notion Integration

Since your portfolio is in a **different workspace** from your blog, you need a **separate integration token**.

🔗 Go to: https://www.notion.so/my-integrations

Steps:
1. Click **"+ New integration"**
2. Name: "Portfolio Integration" (or any name)
3. **Important**: Select the workspace where your **portfolio** database lives
4. Click "Submit"
5. **Copy the token** - you'll need it next

### 2. Create .env.local File

Create a file called `.env.local` in your project root (if it doesn't exist) and add:

```bash
# Your existing blog variables (you should already have these)
NOTION_TOKEN=your_existing_blog_token
NOTION_DATABASE_ID=your_existing_blog_database_id

# NEW: Add these for portfolio
NOTION_PORTFOLIO_TOKEN=secret_paste_your_token_here
NOTION_PORTFOLIO_DATABASE_ID=437124ca982d4a78af1fc316d5fe0d34
```

Replace `secret_paste_your_token_here` with the token you copied in step 1.

### 3. Connect Integration to Your Database

The integration needs permission to access your database:

1. Open your portfolio database in Notion
2. Click the **•••** menu (top right)
3. Go to **Connections** → **Add connections**
4. Select your "Portfolio Integration"
5. Click "Confirm"

### 4. Test the Connection

Run this command to verify everything works:

```bash
pnpm test:portfolio
```

Expected output:
```
🎉 SUCCESS! Your Portfolio Notion integration is working!
```

If you see errors, the script will tell you exactly what to fix.

### 5. Setup Your Database Properties

Your Notion database should have these properties (use the exact names or the code will map alternatives):

**Recommended Setup:**

| Property | Type | Example |
|----------|------|---------|
| Name | Title | "E-commerce Platform" |
| Description | Rich Text | "A full-stack shopping platform built with..." |
| Technologies | Multi-select | React, Node.js, PostgreSQL |
| Dates | Rich Text | "Jan 2024 - Present" |
| Active | Checkbox | ✓ (checked if currently working on it) |
| Featured | Checkbox | ✓ (for featured projects) |
| Website | URL | https://example.com |
| GitHub | URL | https://github.com/user/repo |
| Thumbnail | URL or Files | (upload an image or paste URL) |
| Order | Number | 1, 2, 3... (display order) |

**Optional but supported:**
- Video (URL) - Demo video
- Links (Rich Text) - Format: "Type: URL" on separate lines

### 6. Add Your Projects

Add your portfolio projects to the Notion database with the properties above.

### 7. Run Your Site

```bash
pnpm dev
```

Visit: http://localhost:3000/portfolio

You should see your projects from Notion!

## How It Works

```
┌─────────────────┐
│  Notion DB      │ (Portfolio workspace)
│  Portfolio      │
└────────┬────────┘
         │
         │ API Call (uses NOTION_PORTFOLIO_TOKEN)
         │
         ▼
┌─────────────────┐
│ notion-portfolio│.ts (Fetches data)
│ portfolio-source│.ts (Transforms & caches)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ portfolio/page  │.tsx (Displays on website)
└─────────────────┘
```

## Two Separate Integrations

Your blog and portfolio use **different** Notion tokens because they're in **different workspaces**:

| Integration | Token Env Var | Database Env Var | Workspace |
|-------------|---------------|------------------|-----------|
| Blog | `NOTION_TOKEN` | `NOTION_DATABASE_ID` | Blog workspace |
| Portfolio | `NOTION_PORTFOLIO_TOKEN` | `NOTION_PORTFOLIO_DATABASE_ID` | Portfolio workspace |

This is **normal and required** when your databases are in different Notion workspaces.

## Troubleshooting

### "NOTION_PORTFOLIO_TOKEN is not set"

➡️ Create `.env.local` file with your token

### "unauthorized" error

➡️ Make sure you created the integration in the **correct workspace** (where your portfolio lives)

### "object_not_found" error  

➡️ Connect the integration to your database (Step 3 above)

### Projects not showing up

➡️ Check:
1. Database has projects
2. Properties are named correctly
3. Restart dev server after adding `.env.local`
4. Check terminal for error messages

### Need more help?

- Read `PORTFOLIO_NOTION_SETUP.md` for detailed guide
- Run `pnpm test:portfolio` for diagnostics
- Check console output when running `pnpm dev`

## Test Commands

```bash
# Test portfolio connection
pnpm test:portfolio

# Test blog connection
pnpm test:notion

# Start dev server
pnpm dev

# Build for production
pnpm build
```

## Database Schema Flexibility

The code is flexible and checks for alternative property names:

- **Title**: Looks for "Name", "Title", or "Project"
- **Tech**: Looks for "Technologies", "Tech Stack", or "Tags"  
- **Description**: Looks for "Description" or "Summary"
- **Timeline**: Looks for "Dates", "Timeline", or "Period"

So if your database uses slightly different names, it should still work!

## What's Next?

Once you complete the 7 steps above, your portfolio will:
- ✅ Automatically pull projects from Notion
- ✅ Update when you edit your Notion database
- ✅ Cache results for better performance
- ✅ Fall back to hardcoded data if Notion is unavailable
- ✅ Display projects with your existing beautiful UI

---

**Ready to get started?** Follow the "Next Steps" section above! 🚀
