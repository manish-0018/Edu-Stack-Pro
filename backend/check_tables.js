const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres:SOgJxTeQBkacQLtSxliQCyodnnFUxrOu@altaria.proxy.rlwy.net:22969/railway",
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  try {
    // Get all table names
    const tablesRes = await client.query(`
      SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename
    `);
    console.log('Tables:', tablesRes.rows.map(r => r.tablename));

    // Check the specific class row
    const classRes = await client.query(`
      SELECT * FROM "Classes" WHERE id = '313e3a8d-6380-4331-818c-383eaea7eefa'
    `);
    console.log('Class row:', classRes.rows);
  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await client.end();
  }
}

run();
