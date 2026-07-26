const { Holiday } = require('../models');

const getHolidays = async (req, res) => {
  try {
    const holidays = await Holiday.findAll({
      order: [['date', 'ASC']]
    });
    res.status(200).json(holidays);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createHoliday = async (req, res) => {
  try {
    const { title, date, type } = req.body;
    const holiday = await Holiday.create({ title, date, type });
    res.status(201).json(holiday);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteHoliday = async (req, res) => {
  try {
    const holiday = await Holiday.findByPk(req.params.id);
    if (!holiday) return res.status(404).json({ message: 'Holiday not found' });
    
    await holiday.destroy();
    res.status(200).json({ message: 'Holiday deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getHolidays, createHoliday, deleteHoliday };
