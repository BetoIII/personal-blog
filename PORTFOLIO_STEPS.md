# Portfolio Notion Setup - Step by Step

Follow these exact steps to connect your portfolio database:

## 📍 Your Database Information

- **Database URL**: https://betoiii.notion.site/437124ca982d4a78af1fc316d5fe0d34?v=673c49f8db684f10bc860a156c173016
- **Database ID**: `437124ca982d4a78af1fc316d5fe0d34`

---

## Step 1: Create Integration (5 minutes)

1. **Open Notion Integrations Page**
   ```
   https://www.notion.so/my-integrations
   ```

2. **Click "+ New integration"**

3. **Fill in the form:**
   - **Name**: `Portfolio Integration` (or any name you like)
   - **Associated workspace**: ⚠️ **IMPORTANT**: Select the workspace where your portfolio database lives
   - **Type**: Internal integration
   - **Capabilities**: Default settings are fine

4. **Click "Submit"**

5. **Copy the "Internal Integration Token"**
   - It looks like: `secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - Keep this safe, you'll need it in Step 3

---

## Step 2: Connect Integration to Database (2 minutes)

1. **Open your portfolio database in Notion:**
   ```
   https://betoiii.notion.site/437124ca982d4a78af1fc316d5fe0d34
   ```

2. **Click the ••• menu** (three dots in top-right corner)

3. **Select "Connections"**

4. **Click "Add connections"**

5. **Find and select** your "Portfolio Integration"

6. **Click "Confirm"**

✅ Your integration now has access to your database!

---

## Step 3: Add Environment Variables (2 minutes)

1. **Open your project** in your code editor

2. **Create or edit `.env.local`** in the project root

3. **Add these lines:**
   ```bash
   # Portfolio Notion Integration
   NOTION_PORTFOLIO_TOKEN=secret_paste_your_token_from_step_1_here
   NOTION_PORTFOLIO_DATABASE_ID=437124ca982d4a78af1fc316d5fe0d34
   ```

4. **Replace** `secret_paste_your_token_from_step_1_here` with the actual token you copied in Step 1

5. **Save the file**

⚠️ **Important Notes:**
- Keep your existing `NOTION_TOKEN` and `NOTION_DATABASE_ID` (for blog)
- The `.env.local` file should NOT be committed to git
- Restart your dev server after creating/editing this file

---

## Step 4: Test Connection (1 minute)

1. **Open your terminal** in the project directory

2. **Run the test command:**
   ```bash
   pnpm test:portfolio
   ```

3. **Expected output:**
   ```
   🎉 SUCCESS! Your Portfolio Notion integration is working!
   ```

4. **If you see errors**, the script will tell you exactly what's wrong and how to fix it

---

## Step 5: Setup Database Properties (5 minutes)

Your Notion database should have these properties. **Add any that are missing:**

### Core Properties (Required)

| Property Name | Property Type | Example Value |
|--------------|---------------|---------------|
| **Name** | Title | "Personal Blog" |
| **Description** | Rich Text | "A modern blog built with Next.js..." |
| **Technologies** | Multi-select | Next.js, TypeScript, Tailwind |
| **Dates** | Rich Text | "Jan 2024 - Present" |

### Optional Properties (Recommended)

| Property Name | Property Type | Example Value |
|--------------|---------------|---------------|
| Active | Checkbox | ✓ |
| Featured | Checkbox | ✓ |
| Website | URL | https://yourproject.com |
| GitHub | URL | https://github.com/you/project |
| Thumbnail | URL or Files | (paste URL or upload image) |
| Video | URL | https://youtube.com/... |
| Order | Number | 1 |

### How to Add Properties in Notion:

1. Open your database
2. Click the "+" button in the property row
3. Choose the property type
4. Name it according to the table above

---

## Step 6: Add Your Projects (10 minutes)

Add your portfolio projects to the database. **Example project:**

| Field | Value |
|-------|-------|
| **Name** | "E-commerce Platform" |
| **Description** | "A full-stack e-commerce solution with React, Node.js, and Stripe integration. Features include user authentication, product management, and real-time inventory tracking." |
| **Technologies** | React, Node.js, PostgreSQL, Stripe, AWS |
| **Dates** | "Mar 2024 - Present" |
| **Active** | ✓ (checked) |
| **Featured** | ✓ (checked) |
| **Website** | https://myecommerce.com |
| **GitHub** | https://github.com/you/ecommerce |
| **Order** | 1 |

**Tips:**
- Add 2-3 projects initially to test
- Mark 1-2 as "Featured" for the featured section
- Use "Order" to control display sequence (1, 2, 3...)
- Projects without a number in "Order" will appear after numbered ones

---

## Step 7: Launch! (1 minute)

1. **Start your development server:**
   ```bash
   pnpm dev
   ```

2. **Open in browser:**
   ```
   http://localhost:3000/portfolio
   ```

3. **You should see your projects!** 🎉

---

## ✅ Verification Checklist

- [ ] Created Notion integration
- [ ] Connected integration to database
- [ ] Added environment variables to `.env.local`
- [ ] Test script shows "SUCCESS"
- [ ] Database has required properties
- [ ] Added at least one project
- [ ] Dev server running
- [ ] Portfolio page shows Notion projects

---

## 🐛 Troubleshooting

### "Environment variables not set"
➡️ Make sure you created `.env.local` in the project root
➡️ Restart your terminal/dev server

### "unauthorized" error
➡️ Check you created the integration in the **correct workspace**
➡️ Copy the token again and paste it in `.env.local`

### "object_not_found" error
➡️ Make sure you completed Step 2 (connecting integration to database)
➡️ The database URL must be accessible from your workspace

### Projects not appearing on the site
➡️ Check the terminal for error messages
➡️ Make sure database has at least one project
➡️ Verify property names match the recommended schema
➡️ Restart dev server

### Cache issues (changes not showing)
➡️ Wait 60 seconds (data is cached)
➡️ Or restart dev server for immediate refresh

---

## 📚 Additional Resources

- **Detailed Guide**: See `PORTFOLIO_NOTION_SETUP.md`
- **Quick Reference**: See `PORTFOLIO_QUICKSTART.md`
- **Complete Summary**: See `SETUP_SUMMARY.md`

---

## 🎯 Next Steps After Setup

1. **Add more projects** to your Notion database
2. **Customize the UI** in `app/portfolio/page.tsx`
3. **Add project detail pages** (optional - create `app/portfolio/[slug]/page.tsx`)
4. **Deploy your site** to Vercel/Netlify
5. **Update projects in Notion** - changes appear automatically!

---

**Need Help?** 

Run the diagnostic script:
```bash
pnpm test:portfolio
```

It will tell you exactly what's wrong and how to fix it! 🔍

---

**Estimated Total Time**: 20-30 minutes

You've got this! 🚀
