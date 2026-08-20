const { Client } = require('pg');

async function testQuery() {
  const client = new Client({
    connectionString: "postgresql://postgres:SOgJxTeQBkacQLtSxliQCyodnnFUxrOu@altaria.proxy.rlwy.net:22969/railway",
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log("Connected to production database.");

    // Select from MentorshipSessions joining Student and Mentor from Users
    const res = await client.query(`
      SELECT 
        s.id, 
        s.notes, 
        s.status, 
        s."meetingLink", 
        s."meetingDate",
        stu.name as student_name, 
        men.name as mentor_name
      FROM "MentorshipSessions" s
      JOIN "Users" stu ON s."studentId" = stu.id
      JOIN "Users" men ON s."mentorId" = men.id
      LIMIT 5
    `);
    console.log("Query succeeded! Result:", res.rows);
  } catch (err) {
    console.error("Query failed with error:", err.message);
  } finally {
    await client.end();
  }
}

testQuery();
