const { sequelize } = require('./config/db');
require('./models'); // Load models

(async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("Database synced successfully with new models.");
  } catch (error) {
    console.error("Database sync error:", error);
  } finally {
    process.exit();
  }
})();
