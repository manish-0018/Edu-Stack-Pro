const { Mark, User, Subject, Class, Notification } = require('../models');

const getMarks = async (req, res) => {
  try {
    let whereClause = {};

    if (req.user.role === 'student') {
      whereClause.studentId = req.user.id;
    } else if (req.user.role === 'teacher') {
      // Find subjects taught by this teacher
      const subjects = await Subject.findAll({ where: { teacherId: req.user.id } });
      const subjectIds = subjects.map(s => s.id);
      whereClause.subjectId = subjectIds;
    }

    const marks = await Mark.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'Student', attributes: ['id', 'name', 'email'] },
        { model: Subject, include: [{ model: Class, attributes: ['name'] }] }
      ]
    });

    res.status(200).json(marks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const upsertMarks = async (req, res) => {
  try {
    const { subjectId, marks } = req.body;
    if (!subjectId || !Array.isArray(marks)) {
      throw new Error('Please provide subjectId and a marks array');
    }

    const savedMarks = [];
    for (const item of marks) {
      const { studentId, midSem, assignment, quiz } = item;
      
      // Try to find existing record
      let markRecord = await Mark.findOne({
        where: { studentId, subjectId }
      });

      if (markRecord) {
        // Update
        await markRecord.update({
          midSem: midSem !== undefined ? midSem : markRecord.midSem,
          assignment: assignment !== undefined ? assignment : markRecord.assignment,
          quiz: quiz !== undefined ? quiz : markRecord.quiz
        });
      } else {
        markRecord = await Mark.create({
          studentId,
          subjectId,
          midSem: midSem !== undefined ? midSem : null,
          assignment: assignment !== undefined ? assignment : null,
          quiz: quiz !== undefined ? quiz : null
        });
      }
      
      // Notify student
      const subject = await Subject.findByPk(subjectId);
      await Notification.create({
        userId: studentId,
        title: 'Marks Updated',
        message: `Your marks for ${subject ? subject.name : 'a subject'} have been updated by your teacher.`,
        type: 'info'
      });

      savedMarks.push(markRecord);
    }

    res.status(200).json({ message: 'Marks updated successfully', count: savedMarks.length });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getMarks, upsertMarks };
