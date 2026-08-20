const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: "postgresql://postgres:SOgJxTeQBkacQLtSxliQCyodnnFUxrOu@altaria.proxy.rlwy.net:22969/railway",
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to DB successfully.");

    // Alter the targetRole ENUM to add 'mentor'
    console.log("Altering enum_Announcements_targetRole...");
    try {
      await client.query(`ALTER TYPE "enum_Announcements_targetRole" ADD VALUE 'mentor'`);
      console.log("Altered enum_Announcements_targetRole successfully.");
    } catch (e) {
      if (e.message.includes('already exists')) {
        console.log("Enum value 'mentor' already exists, skipping.");
      } else {
        throw e;
      }
    }

  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await client.end();
  }
}

run();
