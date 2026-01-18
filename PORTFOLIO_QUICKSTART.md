# Portfolio Notion Integration - Quick Start

Follow these steps to connect your Notion portfolio database:

## Step 1: Create Notion Integration

1. Visit: https://www.notion.so/my-integrations
2. Click "New integration"
3. Name it "Portfolio Integration"
4. Select your portfolio workspace
5. Copy the token

## Step 2: Add to .env.local

Create/update `.env.local` in your project root:

```bash
NOTION_PORTFOLIO_TOKEN=secret_your_token_here
NOTION_PORTFOLIO_DATABASE_ID=437124ca982d4a78af1fc316d5fe0d34
```

## Step 3: Connect to Database

1. Open your portfolio database: https://betoiii.notion.site/437124ca982d4a78af1fc316d5fe0d34
2. Click ••• → Connections → Add connections
3. Select "Portfolio Integration"

## Step 4: Test Connection

```bash
pnpm test:portfolio
```

You should see: 🎉 SUCCESS!

## Step 5: Run Your Site

```bash
pnpm dev
```

Visit http://localhost:3000/portfolio

---

**Need help?** See [PORTFOLIO_NOTION_SETUP.md](./PORTFOLIO_NOTION_SETUP.md) for detailed instructions.

## Database Schema Quick Reference

Recommended properties in your Notion database:

- **Name** (Title) - Project name
- **Description** (Rich Text) - Project description  
- **Technologies** (Multi-select) - Tech stack
- **Dates** (Rich Text) - e.g., "Jan 2024 - Present"
- **Active** (Checkbox) - Currently active?
- **Featured** (Checkbox) - Featured project?
- **Website** (URL) - Project URL
- **GitHub** (URL) - Source code
- **Thumbnail** (URL/Files) - Project image
- **Order** (Number) - Display order

## Test Commands

```bash
# Test portfolio connection
pnpm test:portfolio

# Test blog connection  
pnpm test:notion

# Run development server
pnpm dev
```
