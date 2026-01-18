#!/usr/bin/env node
/**
 * Test Notion Connection
 * Run this to verify your NOTION_TOKEN and NOTION_DATABASE_ID are correct
 */

require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

const token = process.env.NOTION_TOKEN;
const databaseId = process.env.NOTION_DATABASE_ID;

console.log('\n🔍 Notion Connection Test\n');
console.log('━'.repeat(50));

// Check environment variables
console.log('\n1️⃣  Checking environment variables...');
if (!token) {
  console.error('❌ NOTION_TOKEN is not set in .env.local');
  process.exit(1);
}
console.log('✅ NOTION_TOKEN is set:', token.substring(0, 10) + '...');

if (!databaseId) {
  console.error('❌ NOTION_DATABASE_ID is not set in .env.local');
  process.exit(1);
}
console.log('✅ NOTION_DATABASE_ID is set:', databaseId);

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
    console.log('\n3️⃣  Attempting to access database...');
    const database = await notion.databases.retrieve({
      database_id: databaseId,
    });
    console.log('✅ Database found:', database.title[0]?.plain_text || 'Untitled');

    // Test 3: Query the database
    console.log('\n4️⃣  Querying database for posts...');
    const response = await notion.databases.query({
      database_id: databaseId,
      page_size: 5,
    });

    console.log(`✅ Found ${response.results.length} items in database`);
    
    if (response.results.length > 0) {
      console.log('\n📄 Sample posts:');
      response.results.forEach((page, index) => {
        if ('properties' in page) {
          const title = page.properties.Title?.title?.[0]?.plain_text || 
                       page.properties.Name?.title?.[0]?.plain_text || 
                       'Untitled';
          const status = page.properties.Status?.status?.name || 
                        page.properties.Status?.select?.name || 
                        'No status';
          console.log(`   ${index + 1}. "${title}" - Status: ${status}`);
        }
      });
    }

    console.log('\n━'.repeat(50));
    console.log('🎉 SUCCESS! Your Notion integration is working!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.code === 'unauthorized') {
      console.error('\n💡 Fix: Check your NOTION_TOKEN');
      console.error('   1. Go to https://www.notion.so/my-integrations');
      console.error('   2. Copy the Internal Integration Token');
      console.error('   3. Update NOTION_TOKEN in .env.local');
    } else if (error.code === 'object_not_found') {
      console.error('\n💡 Fix: Connect your integration to the database');
      console.error('   1. Open your database in Notion');
      console.error('   2. Click ••• → Connections → Add connections');
      console.error('   3. Select your integration');
      console.error('\n   Database URL:');
      console.error(`   https://www.notion.so/${databaseId.replace(/-/g, '')}`);
    } else if (error.code === 'validation_error') {
      console.error('\n💡 Fix: Check your NOTION_DATABASE_ID format');
      console.error('   It should be in one of these formats:');
      console.error('   - With dashes: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
      console.error('   - Without: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    }
    
    console.error('\n━'.repeat(50));
    process.exit(1);
  }
})();
