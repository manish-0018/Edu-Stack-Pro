const { Timetable, Class, Subject, User } = require('../models');

const getTimetable = async (req, res) => {
  try {
    let whereClause = {};
    if (req.user.role === 'student') {
      const student = await User.findByPk(req.user.id);
      if (!student.classId) {
        return res.status(200).json([]);
      }
      whereClause.classId = student.classId;
    } else if (req.user.role === 'teacher') {
      whereClause.teacherId = req.user.id;
    }
    // Admin sees all in their college only, or can filter by classId
    if (req.query.classId) {
      whereClause.classId = req.query.classId;
    }

    // College isolation via Class join
    const classWhere = { collegeId: req.user.collegeId };

    const timetable = await Timetable.findAll({
      where: whereClause,
      include: [
        { model: Class, where: classWhere, attributes: ['name', 'semester'], required: true },
        { model: Subject, attributes: ['name', 'code', 'type'] },
        { model: User, as: 'Teacher', attributes: ['name'] }
      ],
      order: [['dayOfWeek', 'ASC'], ['startTime', 'ASC']]
    });

    res.status(200).json(timetable);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createTimetableSlot = async (req, res) => {
  try {
    const { classId, subjectId, teacherId, dayOfWeek, startTime, endTime, roomNumber } = req.body;
    
    const slot = await Timetable.create({
      classId,
      subjectId,
      teacherId,
      dayOfWeek,
      startTime,
      endTime,
      roomNumber
    });

    res.status(201).json(slot);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteTimetableSlot = async (req, res) => {
  try {
    const slot = await Timetable.findByPk(req.params.id);
    if (!slot) throw new Error('Slot not found');
    
    await slot.destroy();
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getTimetable, createTimetableSlot, deleteTimetableSlot };
