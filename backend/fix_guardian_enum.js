const { sequelize } = require('./config/db');
(async () => {
  try {
    await sequelize.query("ALTER TYPE \"enum_Users_role\" ADD VALUE 'guardian';");
    console.log("ENUM updated");
  } catch(e) {
    console.error(e.message);
  }
  process.exit();
})();
