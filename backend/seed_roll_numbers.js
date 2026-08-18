const { User, CourseRollConfig, College } = require('./models');
const { connectDB } = require('./config/db');

(async () => {
  try {
    await connectDB();
    console.log('PostgreSQL Connected for seeding...');

    // Find all students with null roll numbers
    const students = await User.findAll({
      where: { role: 'student', rollNo: null }
    });

    console.log(`Found ${students.length} students without roll numbers.`);

    for (const student of students) {
      if (!student.course || !student.collegeId) {
        console.log(`Skipping student ${student.name} (id: ${student.id}) due to missing course or collegeId.`);
        continue;
      }

      // Lookup or create CourseRollConfig
      let rollConfig = await CourseRollConfig.findOne({
        where: { course: student.course, collegeId: student.collegeId }
      });

      if (!rollConfig) {
        // Resolve a new non-overlapping range
        const maxConfig = await CourseRollConfig.findOne({
          order: [['currentRollNo', 'DESC']]
        });
        const startRoll = maxConfig ? (maxConfig.currentRollNo + 1000) : 2601001;
        rollConfig = await CourseRollConfig.create({
          course: student.course,
          collegeId: student.collegeId,
          startRollNo: startRoll,
          currentRollNo: startRoll
        });
      }

      const nextRoll = rollConfig.currentRollNo + 1;
      await student.update({ rollNo: nextRoll });
      await rollConfig.update({ currentRollNo: nextRoll });
      console.log(`Assigned Roll No ${nextRoll} to student: ${student.name} (${student.course})`);
    }

    console.log('✅ Roll number seeding completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed with error:', err);
    process.exit(1);
  }
})();
