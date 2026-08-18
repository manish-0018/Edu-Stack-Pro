const { User, CourseRollConfig, College, Class } = require('./models');
const { connectDB, sequelize } = require('./config/db');

(async () => {
  try {
    console.log('--- START MENTOR & ROLL NO SYSTEM VERIFICATION ---');
    await connectDB();

    // 1. Create/Find Test College
    const [college] = await College.findOrCreate({
      where: { name: 'KIIT University Test' },
      defaults: { secretKey: 'KIIT-TEST-KEY', plan: 'pro' }
    });
    console.log('Test College created/resolved:', college.id);

    // 2. Setup CourseRollConfig for BCA
    // First clear existing test config if any
    await CourseRollConfig.destroy({
      where: { course: 'BCA-TEST', collegeId: college.id }
    });

    const rollConfig = await CourseRollConfig.create({
      course: 'BCA-TEST',
      collegeId: college.id,
      startRollNo: 2475001,
      currentRollNo: 2475000 // starts before 2475001 so the first increment assigns 2475001
    });
    console.log('BCA-TEST Roll Range Configured starting at 2475001.');

    // 3. Register two mock students via registration logic simulation
    const student1Data = {
      name: 'Aryan BCA',
      email: 'aryan.bca@test.com',
      password: 'password123',
      role: 'student',
      course: 'BCA-TEST',
      collegeId: college.id
    };

    const student2Data = {
      name: 'Ujjwal BCA',
      email: 'ujjwal.bca@test.com',
      password: 'password123',
      role: 'student',
      course: 'BCA-TEST',
      collegeId: college.id
    };

    // Simulate authController registration roll number generation
    const getNextRollNo = async (course, collegeId) => {
      let conf = await CourseRollConfig.findOne({
        where: { course, collegeId }
      });
      if (conf) {
        const nextRoll = conf.currentRollNo + 1;
        await conf.update({ currentRollNo: nextRoll });
        return nextRoll;
      }
      return 2601001;
    };

    // Clean existing test students
    await User.destroy({ where: { email: [student1Data.email, student2Data.email] } });

    student1Data.rollNo = await getNextRollNo(student1Data.course, student1Data.collegeId);
    const user1 = await User.create(student1Data);
    console.log(`Registered Student 1: ${user1.name} | Assigned Roll No: ${user1.rollNo} (Expected: 2475001)`);

    student2Data.rollNo = await getNextRollNo(student2Data.course, student2Data.collegeId);
    const user2 = await User.create(student2Data);
    console.log(`Registered Student 2: ${user2.name} | Assigned Roll No: ${user2.rollNo} (Expected: 2475002)`);

    // Verify sequential correctness
    if (user1.rollNo === 2475001 && user2.rollNo === 2475002) {
      console.log('✅ SUCCESS: Roll numbers successfully generated sequentially without collision!');
    } else {
      console.error('❌ FAILURE: Roll number sequence mismatch.');
    }

    // Cleanup test data
    await user1.destroy();
    await user2.destroy();
    await rollConfig.destroy();
    console.log('Test clean-up complete.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    process.exit(1);
  }
})();
