require('dotenv').config();
const { User, Class, College, Subject } = require('./models');

async function run() {
  try {
    const users = await User.findAll();
    console.log('\n--- USERS ---');
    users.forEach(u => console.log(`Name: ${u.name} | Role: ${u.role} | Email: ${u.email} | ClassId: ${u.classId}`));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
