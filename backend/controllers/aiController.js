const { GoogleGenerativeAI } = require("@google/generative-ai");
const { Mark, AttendanceRecord, Subject, User } = require('../models');

const generateResponse = async (req, res) => {
  try {
    const { prompt, context } = req.body;
    
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      return res.status(200).json({
        response: "🤖 **AI Tutor is currently offline!**\n\nTo activate the AI Smart Tutor, please add your Google Gemini API key to the backend `.env` file as `GEMINI_API_KEY`."
      });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let fullPrompt = prompt;
    if (context) {
      fullPrompt = `Context/Topic: ${context}\n\nStudent's Question: ${prompt}\n\nPlease act as a helpful, expert tutor. Break down complex topics simply. Format your answer beautifully in Markdown.`;
    }

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ response: text });
  } catch (error) {
    console.error("AI Error:", error);
    res.status(500).json({ message: "Failed to generate AI response. Ensure your API key is valid." });
  }
};

const predictAcademicFuture = async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY_HERE') {
      return res.status(200).json({
        prediction: "AI Engine Offline. Please add your Gemini API Key.",
        atRisk: [],
        strategy: "Focus on attending your classes regularly."
      });
    }
    // Determine which student to run prediction for
    let studentId;
    if (req.user && req.user.id) {
      studentId = req.user.id;
    } else if (req.query.studentId) {
      studentId = req.query.studentId;
    } else {
      // Fallback to first student in the DB (for demo/testing)
      const firstStudent = await User.findOne({ where: { role: 'student' } });
      if (!firstStudent) {
        return res.status(404).json({ message: 'No student data found.' });
      }
      studentId = firstStudent.id;
    }

    // Fetch student's marks and attendance
    const marks = await Mark.findAll({
      where: { studentId },
      include: [{ model: Subject, attributes: ['name'] }]
    });

    const attendanceRecords = await AttendanceRecord.findAll({
      where: { studentId },
      include: [{ model: require('../models').Attendance, include: [{ model: Subject, attributes: ['name'] }] }]
    });

    // Calculate subject-wise stats to feed to AI
    const stats = {};
    marks.forEach(m => {
      const sub = m.Subject.name;
      if(!stats[sub]) stats[sub] = { marks: [], totalAttended: 0, totalClasses: 0 };
      stats[sub].marks.push({ type: m.examType, score: m.score, max: m.maxScore });
    });

    attendanceRecords.forEach(ar => {
      if (!ar.Attendance || !ar.Attendance.Subject) return;
      const sub = ar.Attendance.Subject.name;
      if(!stats[sub]) stats[sub] = { marks: [], totalAttended: 0, totalClasses: 0 };
      stats[sub].totalClasses++;
      if (['present', 'late', 'excused', 'duty'].includes(ar.status)) {
        stats[sub].totalAttended++;
      }
    });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", generationConfig: { responseMimeType: "application/json" } });

    const prompt = `
You are the Edu Stack Pro Predictive Academic Engine. Analyze the following student data and predict their academic trajectory.
Data:
${JSON.stringify(stats, null, 2)}

Return a valid JSON response matching this schema:
{
  "prediction": "A 2-sentence highly personalized prediction of their final semester performance based on their data. Mention specific subjects.",
  "atRisk": ["subject_name_1", "subject_name_2"],
  "strategy": "A 2-sentence actionable study strategy for them to improve."
}
If they have no data, predict that they are starting fresh and have a bright future.
`;

    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    const jsonResponse = JSON.parse(text);

    res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("AI Prediction Error:", error);
    res.status(500).json({ message: "Failed to run predictions." });
  }
};

module.exports = { generateResponse, predictAcademicFuture };
