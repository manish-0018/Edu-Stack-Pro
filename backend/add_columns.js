const { Client } = require('pg');

async function run() {
  const client = new Client({
    connectionString: "postgresql://postgres:SOgJxTeQBkacQLtSxliQCyodnnFUxrOu@altaria.proxy.rlwy.net:22969/railway",
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to DB successfully.");

    // Alter table MentorshipSessions to add meetingLink and meetingDate
    console.log("Adding columns to MentorshipSessions...");
    await client.query(`
      ALTER TABLE "MentorshipSessions" 
      ADD COLUMN IF NOT EXISTS "meetingLink" VARCHAR(255),
      ADD COLUMN IF NOT EXISTS "meetingDate" TIMESTAMP WITH TIME ZONE;
    `);
    console.log("Columns added successfully.");

    // Let's also check if aryan1@gmail.com is set to role = 'mentor' in production!
    const res = await client.query(`SELECT id, name, email, role, course, "collegeId" FROM "Users" WHERE email = 'aryan1@gmail.com'`);
    console.log("Arya's current record in production DB:", res.rows);

    if (res.rows[0] && res.rows[0].role !== 'mentor') {
      console.log("Arya is not a mentor! Updating to mentor...");
      await client.query(`UPDATE "Users" SET role = 'mentor', course = 'BTech CSE' WHERE email = 'aryan1@gmail.com'`);
      console.log("Arya role updated to mentor.");
    }

  } catch (err) {
    console.error("DB Error:", err);
  } finally {
    await client.end();
  }
}

run();
