const { Material, MaterialPurchase, User, AttendanceRecord, Attendance, Notification, Subject } = require('../models');
const { Op } = require('sequelize');
const { RecoveryAssignment, Task } = require('../models');

// Claimable tokens: 10 per week for students with > 75% attendance in that week
const claimWeeklyTokens = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can claim attendance tokens' });
    }

    // 1. Check if tokens were already claimed in the last 7 days
    if (user.lastTokenClaim) {
      const daysSinceClaim = (new Date() - new Date(user.lastTokenClaim)) / (1000 * 60 * 60 * 24);
      if (daysSinceClaim < 7) {
        const daysRemaining = Math.max(1, Math.ceil(7 - daysSinceClaim));
        return res.status(400).json({
          message: `You have already claimed this week's tokens! You can claim again in ${daysRemaining} day${daysRemaining > 1 ? 's' : ''}.`
        });
      }
    }

    // 2. Determine "IN THAT WEEK" attendance window (past 7 days)
    const now = new Date();
    const sevenDaysAgo = new Date(now);
    sevenDaysAgo.setDate(now.getDate() - 7);
    const sevenDaysAgoStr = sevenDaysAgo.toISOString().split('T')[0];

    // Query records for sessions marked in the last 7 days
    let weeklyRecords = await AttendanceRecord.findAll({
      where: { studentId: user.id },
      include: [{
        model: Attendance,
        where: {
          date: { [Op.gte]: sevenDaysAgoStr }
        },
        required: true
      }]
    });

    // If no sessions were marked in the last 7 days (e.g. holidays or historical demo database records),
    // look up the student's most recent attendance cohort to calculate their latest weekly performance
    if (weeklyRecords.length === 0) {
      const allStudentRecords = await AttendanceRecord.findAll({
        where: { studentId: user.id },
        include: [{ model: Attendance, required: true }],
        order: [[Attendance, 'date', 'DESC']]
      });

      if (allStudentRecords.length === 0) {
        return res.status(400).json({
          message: 'No attendance records found yet to evaluate your weekly eligibility. Attend classes to start earning tokens!'
        });
      }

      const latestDateStr = allStudentRecords[0].Attendance.date;
      const latestDate = new Date(latestDateStr);
      const weekBeforeLatest = new Date(latestDate);
      weekBeforeLatest.setDate(latestDate.getDate() - 7);
      const weekBeforeLatestStr = weekBeforeLatest.toISOString().split('T')[0];

      weeklyRecords = allStudentRecords.filter(r => r.Attendance && r.Attendance.date >= weekBeforeLatestStr);
      if (weeklyRecords.length === 0) {
        weeklyRecords = allStudentRecords.slice(0, 10);
      }
    }

    // Count present / attended sessions
    let presentCount = 0;
    weeklyRecords.forEach(r => {
      if (r.status === 'present' || r.status === 'late' || r.status === 'excused' || r.status === 'duty') {
        presentCount++;
      }
    });

    const totalSessions = weeklyRecords.length;
    const weeklyPercentage = Math.round((presentCount / totalSessions) * 100);

    // Strictly enforce GREATER THAN 75% attendance in that week
    // If student's attendance falls to 70% (or <= 75%), DO NOT grant tokens!
    if (weeklyPercentage <= 75) {
      return res.status(400).json({
        message: `Your attendance in that week is ${weeklyPercentage}% (${presentCount}/${totalSessions} classes). You need greater than 75% weekly attendance to claim tokens. If attendance drops to 70%, no tokens are granted. Attend more classes to qualify!`
      });
    }

    // Award 10 tokens per week
    user.tokens = (user.tokens || 0) + 10;
    user.lastTokenClaim = new Date();
    await user.save();

    res.status(200).json({
      message: `🎉 Successfully claimed 10 weekly tokens! (Weekly attendance: ${weeklyPercentage}%). Maintain >75% attendance next week to claim again!`,
      tokens: user.tokens,
      weeklyAttendance: weeklyPercentage
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMarketplaceMaterials = async (req, res) => {
  try {
    const materials = await Material.findAll({
      where: { price: { [Op.gt]: 0 } },
      include: [{ model: User, as: 'Uploader', attributes: ['name', 'course'] }]
    });

    const purchases = await MaterialPurchase.findAll({
      where: { studentId: req.user.id }
    });
    const purchasedIds = purchases.map(p => p.materialId);

    const formatted = materials.map(m => ({
      ...m.toJSON(),
      purchased: purchasedIds.includes(m.id)
    }));

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const purchaseMaterial = async (req, res) => {
  try {
    const { purchaseType = 'lifetime', couponCode } = req.body;
    const material = await Material.findByPk(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });

    const user = await User.findByPk(req.user.id);

    const alreadyPurchased = await MaterialPurchase.findOne({
      where: { studentId: user.id, materialId: material.id }
    });
    if (alreadyPurchased) return res.status(400).json({ message: 'You already own or have active access to this material' });

    // Effective price calculation with rental and coupons
    let effectivePrice = material.price;
    if (couponCode === 'KIWISTUDY20') effectivePrice = Math.ceil(effectivePrice * 0.8);
    if (couponCode === 'CAFEFREE10') effectivePrice = Math.ceil(effectivePrice * 0.9);

    if (purchaseType === 'rental') {
      effectivePrice = Math.max(15, Math.ceil(effectivePrice * 0.4)); // 40% for 3-day rental, minimum 15 tokens
    }

    if ((user.tokens || 0) < effectivePrice) {
      return res.status(400).json({
        message: `Insufficient tokens! This item requires ${effectivePrice} tokens (you have ${user.tokens || 0} tokens). Attend more classes each week (>75% attendance) to earn 10 tokens per week!`
      });
    }

    user.tokens -= effectivePrice;
    await user.save();

    await MaterialPurchase.create({
      studentId: user.id,
      materialId: material.id
    });

    // Optionally reward uploader (80% cut)
    if (material.uploaderId) {
      const uploader = await User.findByPk(material.uploaderId);
      if (uploader) {
        uploader.tokens = (uploader.tokens || 0) + Math.floor(effectivePrice * 0.8);
        await uploader.save();
      }
    }

    res.status(200).json({
      message: purchaseType === 'rental' ? '3-Day note lease unlocked successfully!' : 'Notes unlocked permanently!',
      tokens: user.tokens
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const uploadPremiumNotes = async (req, res) => {
  try {
    const { title, price, description, subjectId, itemType } = req.body;
    let { contentUrl } = req.body;
    
    // If a file was uploaded via multer
    if (req.file) {
      contentUrl = `http://localhost:5000/uploads/notes/${req.file.filename}`;
    }

    // Minimum price of 25 tokens to align with 10 tokens/week attendance economy
    const notePrice = Math.max(25, Number(price) || 40);

    const mat = await Material.create({
      title,
      contentUrl,
      price: notePrice,
      description,
      subjectId: subjectId || null,
      itemType: itemType || 'notes',
      uploaderId: req.user.id,
      date: new Date()
    });

    if (subjectId) {
      const subject = await Subject.findByPk(subjectId);
      if (subject) {
        const students = await User.findAll({ where: { classId: subject.classId, role: 'student' } });
        const notifications = students.map(s => ({
          userId: s.id,
          title: 'New Material Available',
          message: `New ${itemType || 'notes'} "${title}" for ${subject.name} is available in Marketplace.`,
          type: 'info'
        }));
        await Notification.bulkCreate(notifications);

        const tasks = students.map(s => ({
          studentId: s.id,
          title: `Review New Material: ${title} (${subject.name})`,
          dueDate: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
          type: 'note'
        }));
        await Task.bulkCreate(tasks);
      }
    }

    res.status(201).json(mat);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { claimWeeklyTokens, getMarketplaceMaterials, purchaseMaterial, uploadPremiumNotes };
