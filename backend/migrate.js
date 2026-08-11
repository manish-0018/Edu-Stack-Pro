const { Client } = require('pg');
const { execFile } = require('child_process');
const path = require('path');

const connectionString = "postgresql://edustack_db_user:Rqpw6qgeAiDHwEQQ6ANi5DCPzifs2JM3@dpg-d9tfv43ncjis7396fqgg-a.oregon-postgres.render.com/edustack_db";

async function run() {
  console.log("Connecting to Render database to reset public schema (with SSL)...");
  const client = new Client({ 
    connectionString,
    ssl: { rejectUnauthorized: false }
  });
  await client.connect();
  
  console.log("Dropping and recreating public schema...");
  await client.query("DROP SCHEMA public CASCADE;");
  await client.query("CREATE SCHEMA public;");
  await client.query("GRANT ALL ON SCHEMA public TO public;");
  await client.end();
  console.log("Public schema reset successfully!");

  console.log("Restoring local database dump to Render...");
  const psqlPath = "C:\\Program Files\\PostgreSQL\\18\\bin\\psql.exe";
  const dumpFile = path.join(__dirname, "db_dump.sql");

  // Force psql to use SSL mode require
  process.env.PGSSLMODE = 'require';

  const child = execFile(psqlPath, [
    "-d", connectionString,
    "-f", dumpFile
  ]);

  child.stdout.on('data', (data) => {
    process.stdout.write(data.toString());
  });

  child.stderr.on('data', (data) => {
    process.stderr.write(data.toString());
  });

  child.on('close', (code) => {
    console.log(`psql process exited with code ${code}`);
    if (code === 0) {
      console.log("DATABASE MIGRATION COMPLETED SUCCESSFULLY!");
    } else {
      console.error("Database migration failed.");
    }
  });
}

run().catch(console.error);
