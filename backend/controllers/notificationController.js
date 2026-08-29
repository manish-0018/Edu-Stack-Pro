const { Notification } = require('../models');

const getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 50
    });
    res.status(200).json(notifications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByPk(req.params.id);
    if (!notification || notification.userId !== req.user.id) {
      throw new Error('Notification not found');
    }
    await notification.update({ isRead: true });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId: req.user.id, isRead: false } }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createNotification = async (req, res) => {
  try {
    const { userId, title, message, type } = req.body;
    
    // Only allow teachers, admins, and mentors to send notifications
    if (req.user.role !== 'teacher' && req.user.role !== 'admin' && req.user.role !== 'mentor') {
      return res.status(403).json({ message: 'Access denied. Only teachers, mentors, or admins can send notifications.' });
    }

    const notification = await Notification.create({
      userId,
      title,
      message,
      type: type || 'info',
      isRead: false
    });

    res.status(201).json(notification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getMyNotifications, markAsRead, markAllAsRead, createNotification };
