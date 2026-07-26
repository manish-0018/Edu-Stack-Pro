const { Task } = require('../models');

const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({
      where: { studentId: req.user.id },
      order: [['dueDate', 'ASC'], ['createdAt', 'DESC']]
    });
    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, dueDate, type } = req.body;
    const task = await Task.create({
      studentId: req.user.id,
      title,
      dueDate: dueDate || null,
      type: type || 'custom'
    });
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByPk(req.params.id);
    if (!task || task.studentId !== req.user.id) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    await task.update({ status });
    res.status(200).json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (!task || task.studentId !== req.user.id) {
      return res.status(404).json({ message: 'Task not found' });
    }
    
    await task.destroy();
    res.status(200).json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getMyTasks, createTask, updateTaskStatus, deleteTask };
