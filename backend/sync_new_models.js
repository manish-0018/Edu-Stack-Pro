require('dotenv').config();
const { sequelize } = require('./config/db');
require('./models'); // Load all models

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database synced with alter: true');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error syncing database:', err);
    process.exit(1);
  });
