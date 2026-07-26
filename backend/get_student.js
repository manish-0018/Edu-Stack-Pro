const { User } = require('./models');
const bcrypt = require('bcryptjs');

const getStudentAccount = async () => {
  try {
    const student = await User.findOne({ where: { role: 'student' } });
    if (student) {
      console.log('Found Student Email:', student.email);
      
      // Let's force reset their password to "password123" for testing
      const salt = await bcrypt.genSalt(10);
      student.password = await bcrypt.hash('password123', salt);
      await student.save();
      
      console.log('Password reset to: password123');
    } else {
      console.log('No student accounts found in the database. Please register a new student account.');
    }
  } catch (error) {
    console.error(error);
  } finally {
    process.exit();
  }
};

getStudentAccount();
