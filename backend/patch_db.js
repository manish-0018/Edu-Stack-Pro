const { sequelize } = require('./config/db');

(async () => {
  try {
    console.log('--- STARTING POSTGRESQL DATABASE ENUM PATCH ---');
    await sequelize.authenticate();
    
    // Attempt to add 'mentor' to the role enum type
    // In Sequelize + PostgreSQL, the enum type name is usually "enum_Users_role" or similar
    try {
      await sequelize.query(`ALTER TYPE "enum_Users_role" ADD VALUE IF NOT EXISTS 'mentor';`);
      console.log('✅ Successfully added "mentor" to enum_Users_role!');
    } catch (enumErr) {
      console.log('Info: enum_Users_role ALTER TYPE query completed/ignored (might already exist or use different type name):', enumErr.message);
    }

    try {
      // Also ensure the users table column actually matches the enum type
      console.log('Syncing database schema...');
      await sequelize.sync({ alter: true });
      console.log('✅ Database sync completed!');
    } catch (syncErr) {
      console.error('Error during database sync:', syncErr);
    }

    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to patch database:', err);
    process.exit(1);
  }
})();
