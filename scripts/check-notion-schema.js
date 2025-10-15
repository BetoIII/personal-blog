const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const DATABASE_ID = process.env.NOTION_DATABASE_ID || '2826ede4d6f381bf83fde4b75e4c902f';

async function checkSchema() {
  try {
    console.log('Fetching database schema...\n');

    const database = await notion.databases.retrieve({
      database_id: DATABASE_ID,
    });

    console.log('Database Properties:');
    console.log('===================\n');

    Object.entries(database.properties).forEach(([name, prop]) => {
      console.log(`- ${name}: ${prop.type}`);
    });

    console.log('\n\nFetching a sample page to see property values...\n');

    const response = await notion.databases.query({
      database_id: DATABASE_ID,
      page_size: 1,
    });

    if (response.results.length > 0) {
      const page = response.results[0];
      console.log('Sample Page Properties:');
      console.log('======================\n');

      Object.entries(page.properties).forEach(([name, prop]) => {
        console.log(`- ${name}: ${prop.type}`);
        if (prop.type === 'title' && prop.title.length > 0) {
          console.log(`  Value: ${prop.title[0].plain_text}`);
        }
      });
    } else {
      console.log('No pages found in database');
    }

  } catch (error) {
    console.error('Error:', error.message);
    if (error.code === 'object_not_found') {
      console.error('\nMake sure:');
      console.error('1. Your NOTION_TOKEN is correct');
      console.error('2. The integration is connected to your database');
      console.error('3. The NOTION_DATABASE_ID is correct');
    }
  }
}

checkSchema();
