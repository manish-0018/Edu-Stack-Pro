require('dotenv').config();
const { sequelize } = require('../config/db');
const { User } = require('../models');

(async () => {
  try {
    await sequelize.authenticate();
    const userId = process.env.USER_ID;
    let user;
    if (userId) {
      user = await User.findByPk(userId);
    } else {
      user = await User.findOne({ where: { name: 'John' } });
    }
    if (!user) {
      console.log('Target user not found.');
      process.exit(0);
    }
    await user.update({ parentEmail: null });
    console.log(`Removed parentEmail for user John (ID: ${user.id}).`);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
})();
