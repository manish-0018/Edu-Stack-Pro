const express = require('express');
const router = express.Router();
const { getMyTasks, createTask, updateTaskStatus, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getMyTasks)
  .post(protect, createTask);

router.route('/:id')
  .put(protect, updateTaskStatus)
  .delete(protect, deleteTask);

module.exports = router;
