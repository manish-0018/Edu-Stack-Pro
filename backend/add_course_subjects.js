require('dotenv').config();
const { sequelize } = require('./config/db');
sequelize.query('ALTER TABLE "Subjects" ADD COLUMN "course" VARCHAR(255);')
  .then(() => { console.log('Column added'); process.exit(0); })
  .catch(e => { console.error(e); process.exit(1); });
