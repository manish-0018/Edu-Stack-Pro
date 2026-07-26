const { sequelize } = require('./config/db.js');
require('dotenv').config({ path: './.env' });

async function runMigration() {
  try {
    await sequelize.authenticate();
    console.log('Connected to DB');
    
    // Add columns if they don't exist
    await sequelize.query(`
      ALTER TABLE "StudyGroups" 
      ADD COLUMN IF NOT EXISTS "status" VARCHAR(255) DEFAULT 'active',
      ADD COLUMN IF NOT EXISTS "notesData" JSON;
    `);
    
    console.log('Migration successful: Added status and notesData to StudyGroups');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    process.exit(0);
  }
}

runMigration();
