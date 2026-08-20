const { Client } = require('pg');

const client = new Client({
  connectionString: "postgresql://postgres:SOgJxTeQBkacQLtSxliQCyodnnFUxrOu@altaria.proxy.rlwy.net:22969/railway",
  ssl: { rejectUnauthorized: false }
});

async function run() {
  await client.connect();
  try {
    // Check which columns exist
    const colRes = await client.query(`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'Classes'
      ORDER BY column_name
    `);
    const existingCols = colRes.rows.map(r => r.column_name);
    console.log('Existing columns:', existingCols);

    const colsToAdd = [
      { name: 'isSessionActive', def: 'BOOLEAN DEFAULT FALSE' },
      { name: 'activeOtp', def: 'VARCHAR(255)' },
      { name: 'activeQrToken', def: 'VARCHAR(255)' },
      { name: 'activeOtpExpires', def: 'TIMESTAMPTZ' },
      { name: 'isLocationLocked', def: 'BOOLEAN DEFAULT FALSE' },
      { name: 'latitude', def: 'DOUBLE PRECISION' },
      { name: 'longitude', def: 'DOUBLE PRECISION' },
    ];

    for (const col of colsToAdd) {
      if (!existingCols.includes(col.name)) {
        await client.query(`ALTER TABLE "Classes" ADD COLUMN "${col.name}" ${col.def}`);
        console.log(`Added column: ${col.name}`);
      } else {
        console.log(`Column already exists: ${col.name}`);
      }
    }

    console.log('Migration complete!');
  } catch (err) {
    console.error('ERROR:', err.message);
  } finally {
    await client.end();
  }
}

run();
