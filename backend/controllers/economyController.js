const { Material, MaterialPurchase, User, AttendanceRecord, Attendance, Notification, Subject } = require('../models');
const { Op } = require('sequelize');
const { RecoveryAssignment, Task } = require('../models');

const claimWeeklyTokens = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user.role !== 'student') return res.status(403).json({ message: 'Only students can claim tokens' });

    // Check if claimed in last 7 days
    if (user.lastTokenClaim) {
      const daysSinceClaim = (new Date() - new Date(user.lastTokenClaim)) / (1000 * 60 * 60 * 24);
      if (daysSinceClaim < 7) {
        return res.status(400).json({ message: 'You have already claimed tokens this week. Come back later!' });
      }
    }

    const records = await AttendanceRecord.findAll({ where: { studentId: user.id } });
    if (records.length === 0) return res.status(400).json({ message: 'No attendance records found yet to calculate health.' });

    let presentCount = 0;
    records.forEach(r => {
      if (r.status === 'present' || r.status === 'late' || r.status === 'excused' || r.status === 'duty') {
        presentCount++;
      }
    });

    // Add recovery boosts
    const approvedAssignments = await RecoveryAssignment.findAll({
      where: { studentId: user.id, status: 'approved' }
    });
    
    let boostCount = 0;
    approvedAssignments.forEach(ass => {
      boostCount += ass.boostCount;
    });

    const totalAttended = Math.min(records.length, presentCount + boostCount);
    const attendancePercentage = (totalAttended / records.length) * 100;

    if (attendancePercentage < 85) {
      return res.status(400).json({ message: `Your attendance is ${Math.round(attendancePercentage)}%. You need at least 85% to claim weekly tokens!` });
    }

    // Award tokens (double if premium)
    const claimAmount = user.isPremium ? 100 : 50;
    user.tokens = (user.tokens || 0) + claimAmount;
    user.lastTokenClaim = new Date();
    await user.save();

    res.status(200).json({ 
      message: `Successfully claimed ${claimAmount} Edu Stack Pro Tokens!${user.isPremium ? ' (2x Premium Multiplier Active!)' : ''}`, 
      tokens: user.tokens 
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
      where: {
        studentId: req.user.id,
        [Op.or]: [
          { leaseExpiresAt: null },
          { leaseExpiresAt: { [Op.gt]: new Date() } }
        ]
      }
    });

    const formatted = materials.map(m => {
      const p = purchases.find(p => p.materialId === m.id);
      return {
        ...m.toJSON(),
        purchased: !!p,
        purchaseType: p ? p.purchaseType : null,
        leaseExpiresAt: p ? p.leaseExpiresAt : null
      };
    });

    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const purchaseMaterial = async (req, res) => {
  try {
    const { couponCode, purchaseType } = req.body;
    const material = await Material.findByPk(req.params.id);
    if (!material) return res.status(404).json({ message: 'Material not found' });

    const user = await User.findByPk(req.user.id);

    const activePurchase = await MaterialPurchase.findOne({
      where: {
        studentId: user.id,
        materialId: material.id,
        [Op.or]: [
          { leaseExpiresAt: null },
          { leaseExpiresAt: { [Op.gt]: new Date() } }
        ]
      }
    });
    if (activePurchase) {
      return res.status(400).json({ message: 'You already have active access to this material' });
    }

    let basePrice = material.price;
    if (couponCode) {
      const code = couponCode.trim().toUpperCase();
      if (code === 'KIWISTUDY20') {
        basePrice = Math.ceil(material.price * 0.8);
      } else if (code === 'CAFEFREE10') {
        basePrice = Math.ceil(material.price * 0.9);
      }
    }

    let finalPrice = basePrice;
    const isRental = purchaseType === 'rental';
    if (isRental) {
      finalPrice = Math.ceil(basePrice * 0.3); // 30% of normal price
    }

    if ((user.tokens || 0) < finalPrice) {
      return res.status(400).json({ message: 'Insufficient tokens' });
    }

    user.tokens -= finalPrice;
    await user.save();

    await MaterialPurchase.create({
      studentId: user.id,
      materialId: material.id,
      purchaseType: isRental ? 'rental' : 'lifetime',
      leaseExpiresAt: isRental ? new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000) : null
    });

    // Reward uploader
    if (material.uploaderId) {
      const uploader = await User.findByPk(material.uploaderId);
      if (uploader) {
        uploader.tokens = (uploader.tokens || 0) + Math.floor(finalPrice * 0.8);
        await uploader.save();
      }
    }

    res.status(200).json({ message: 'Purchase successful', tokens: user.tokens });
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

    const mat = await Material.create({
      title,
      contentUrl,
      price,
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
          message: `New ${itemType || 'notes'} "${title}" for ${subject.name} is available.`,
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
