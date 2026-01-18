#!/usr/bin/env node
/**
 * Test Portfolio Notion Connection
 * Run this to verify your NOTION_PORTFOLIO_TOKEN and NOTION_PORTFOLIO_DATABASE_ID are correct
 */

require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

const token = process.env.NOTION_PORTFOLIO_TOKEN;
const databaseId = process.env.NOTION_PORTFOLIO_DATABASE_ID;

console.log('\n🔍 Portfolio Notion Connection Test\n');
console.log('━'.repeat(50));

// Check environment variables
console.log('\n1️⃣  Checking environment variables...');
if (!token) {
  console.error('❌ NOTION_PORTFOLIO_TOKEN is not set in .env.local');
  console.error('\n💡 This should be a separate token from your blog token');
  console.error('   since the portfolio is in a different Notion workspace.');
  process.exit(1);
}
console.log('✅ NOTION_PORTFOLIO_TOKEN is set:', token.substring(0, 10) + '...');

if (!databaseId) {
  console.error('❌ NOTION_PORTFOLIO_DATABASE_ID is not set in .env.local');
  process.exit(1);
}
console.log('✅ NOTION_PORTFOLIO_DATABASE_ID is set:', databaseId);

// Initialize Notion client
const notion = new Client({ auth: token });

// Test connection
console.log('\n2️⃣  Testing Notion API connection...');
(async () => {
  try {
    // Test 1: Verify token works
    console.log('   Testing authentication...');
    const users = await notion.users.list({ page_size: 1 });
    console.log('✅ Authentication successful!');

    // Test 2: Try to access the database
    console.log('\n3️⃣  Attempting to access portfolio database...');
    const database = await notion.databases.retrieve({
      database_id: databaseId,
    });
    console.log('✅ Database found:', database.title[0]?.plain_text || 'Untitled');

    // Test 3: Show database properties
    console.log('\n4️⃣  Database properties:');
    const properties = Object.keys(database.properties);
    console.log('   Found', properties.length, 'properties:', properties.join(', '));

    // Test 4: Query the database
    console.log('\n5️⃣  Querying database for portfolio projects...');
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 5,
    });

    console.log(`✅ Found ${response.results.length} items in database`);
    
    if (response.results.length > 0) {
      console.log('\n📁 Sample projects:');
      response.results.forEach((page, index) => {
        if ('properties' in page) {
          const title = page.properties.Title?.title?.[0]?.plain_text || 
                       page.properties.Name?.title?.[0]?.plain_text ||
                       page.properties.Project?.title?.[0]?.plain_text ||
                       'Untitled';
          
          // Get technologies
          const technologies = page.properties.Technologies?.multi_select || 
                              page.properties['Tech Stack']?.multi_select || 
                              [];
          const techNames = technologies.map(t => t.name).join(', ');
          
          // Get active status
          const active = page.properties.Active?.checkbox || false;
          
          console.log(`   ${index + 1}. "${title}"`);
          if (techNames) console.log(`      Technologies: ${techNames}`);
          console.log(`      Active: ${active ? '✅' : '❌'}`);
        }
      });

      console.log('\n📊 Property mapping guide:');
      console.log('   Your database should have these properties:');
      console.log('   ✓ Name/Title (title) - Project name');
      console.log('   ✓ Description (rich text) - Project description');
      console.log('   ✓ Technologies (multi-select) - Tech stack tags');
      console.log('   ✓ Dates (rich text) - Timeline like "Jan 2024 - Present"');
      console.log('   ✓ Active (checkbox) - Is the project currently active?');
      console.log('   ✓ Featured (checkbox) - Should it appear in featured section?');
      console.log('   ✓ Links (rich text) - Format: "Website: https://..." on separate lines');
      console.log('   ✓ Thumbnail (URL or Files) - Project image');
      console.log('   ✓ Video (URL) - Project demo video');
      console.log('   ✓ Order (number) - Display order (optional)');
    } else {
      console.log('\n⚠️  No projects found in database.');
      console.log('   Add some projects to your Notion database to test the integration.');
    }

    console.log('\n━'.repeat(50));
    console.log('🎉 SUCCESS! Your Portfolio Notion integration is working!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.code === 'unauthorized') {
      console.error('\n💡 Fix: Check your NOTION_PORTFOLIO_TOKEN');
      console.error('   1. Go to https://www.notion.so/my-integrations');
      console.error('   2. Create a NEW integration for your portfolio workspace');
      console.error('   3. Copy the Internal Integration Token');
      console.error('   4. Update NOTION_PORTFOLIO_TOKEN in .env.local');
      console.error('\n   NOTE: Since your portfolio is in a different workspace,');
      console.error('   you need a separate integration token!');
    } else if (error.code === 'object_not_found') {
      console.error('\n💡 Fix: Connect your integration to the database');
      console.error('   1. Open your portfolio database in Notion');
      console.error('   2. Click ••• → Connections → Add connections');
      console.error('   3. Select your portfolio integration');
      console.error('\n   Database URL:');
      console.error(`   https://www.notion.so/${databaseId.replace(/-/g, '')}`);
    } else if (error.code === 'validation_error') {
      console.error('\n💡 Fix: Check your NOTION_PORTFOLIO_DATABASE_ID format');
      console.error('   Extract the ID from your database URL:');
      console.error('   URL: https://betoiii.notion.site/437124ca982d4a78af1fc316d5fe0d34');
      console.error('   ID: 437124ca982d4a78af1fc316d5fe0d34');
    }
    
    console.error('\n━'.repeat(50));
    process.exit(1);
  }
})();
