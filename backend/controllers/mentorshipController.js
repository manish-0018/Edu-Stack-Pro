const { MentorshipSlot, User } = require('../models');
const { Op } = require('sequelize');

const getAvailableSlots = async (req, res) => {
  try {
    const slots = await MentorshipSlot.findAll({
      where: { status: 'open', endTime: { [Op.gt]: new Date() } },
      include: [{ model: User, as: 'Mentor', attributes: ['id', 'name', 'course', 'email'] }]
    });
    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMySlots = async (req, res) => {
  try {
    const slots = await MentorshipSlot.findAll({
      where: { menteeId: req.user.id, endTime: { [Op.gt]: new Date() } },
      include: [{ model: User, as: 'Mentor', attributes: ['id', 'name', 'email'] }]
    });
    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyOfferedSlots = async (req, res) => {
  try {
    const slots = await MentorshipSlot.findAll({
      where: { mentorId: req.user.id, endTime: { [Op.gt]: new Date() } },
      include: [{ model: User, as: 'Mentee', attributes: ['id', 'name', 'email'] }]
    });
    res.status(200).json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createSlot = async (req, res) => {
  try {
    const { startTime, endTime, topic, meetingLink } = req.body;
    const slot = await MentorshipSlot.create({
      mentorId: req.user.id,
      startTime,
      endTime,
      topic,
      meetingLink
    });
    res.status(201).json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const bookSlot = async (req, res) => {
  try {
    const slot = await MentorshipSlot.findByPk(req.params.id);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    if (slot.status !== 'open') return res.status(400).json({ message: 'Slot is already booked' });

    slot.menteeId = req.user.id;
    slot.status = 'booked';
    await slot.save();
    res.status(200).json(slot);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const matchMentors = async (req, res) => {
  try {
    const { GoogleGenerativeAI } = require("@google/generative-ai");
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      return res.status(400).json({ message: 'AI Engine Offline. Please add your Gemini API Key.' });
    }
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });

    const student = await User.findByPk(req.user.id);
    const mentors = await User.findAll({ where: { role: 'admin' }, attributes: ['id', 'name', 'course', 'email'] }); // Assume admins/teachers act as mentors for this demo, or specifically 'mentor' role. 

    const prompt = `
Match this student to the 3 best mentors based on their course and needs.
Student: ${student.name}, Course: ${student.course || 'Unknown'}
Available Mentors: ${JSON.stringify(mentors.map(m => ({ id: m.id, name: m.name, course: m.course })))}
Return JSON:
{
  "matches": [
    { "mentorId": "id", "reason": "Why this is a good match", "matchScore": 95 }
  ]
}
`;
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    const jsonResponse = JSON.parse(text);

    // Map mentor objects back to the response
    const hydratedMatches = jsonResponse.matches.map(match => {
      const mentor = mentors.find(m => m.id === match.mentorId);
      return { ...match, mentor };
    }).filter(m => m.mentor); // Ensure mentor exists

    res.status(200).json({ matches: hydratedMatches });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAvailableSlots, getMySlots, getMyOfferedSlots, createSlot, bookSlot, matchMentors };
