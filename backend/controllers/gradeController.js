const { Mark, Subject, User } = require('../models');

// Predict Grades and SGPA
const predictSGPA = async (req, res) => {
  try {
    const { estimates } = req.body; // Array of { subjectId, midSem, quiz, assignment, expectedEndSem }
    if (!estimates || !Array.isArray(estimates)) {
      throw new Error('Invalid estimates input');
    }

    // Fetch student to get classId
    const student = await User.findByPk(req.user.id);
    if (!student || !student.classId) {
      throw new Error('Student class not found');
    }

    // Fetch ALL subjects (theory + lab) for the student's class
    const subjects = await Subject.findAll({
      where: { classId: student.classId }
    });

    // Fetch student's real internal marks from DB
    const marks = await Mark.findAll({
      where: { studentId: req.user.id }
    });

    let totalCredits = 0;
    let totalWeightedPoints = 0;
    const predictions = [];

    for (const subject of subjects) {
      const isLab = subject.type === 'lab';
      const estimate = estimates.find(e => e.subjectId === subject.id);
      const mark = marks.find(m => m.subjectId === subject.id);

      if (isLab) {
        // Lab/Practical: Quiz (max 10) + Practical Work/Assignment (max 40) = 50 total
        // No end-sem exam for lab subjects — internals ARE the final score
        const quiz = (estimate && estimate.quiz !== undefined && estimate.quiz !== '')
          ? Number(estimate.quiz)
          : (mark && mark.quiz !== null ? mark.quiz : 8);

        const assignment = (estimate && estimate.assignment !== undefined && estimate.assignment !== '')
          ? Number(estimate.assignment)
          : (mark && mark.assignment !== null ? mark.assignment : 32);

        const internalsTotal = quiz + assignment;
        // Lab total is out of 50 — scale to 100 for grading
        const totalScore = Math.min(100, internalsTotal * 2);

        // KIIT Grading Scheme
        let grade = 'F';
        let gradePoint = 2;
        if (totalScore >= 90) { grade = 'O'; gradePoint = 10; }
        else if (totalScore >= 80) { grade = 'E'; gradePoint = 9; }
        else if (totalScore >= 70) { grade = 'A'; gradePoint = 8; }
        else if (totalScore >= 60) { grade = 'B'; gradePoint = 7; }
        else if (totalScore >= 50) { grade = 'C'; gradePoint = 6; }
        else if (totalScore >= 40) { grade = 'D'; gradePoint = 5; }

        const credits = subject.credits || 1;
        totalCredits += credits;
        totalWeightedPoints += (gradePoint * credits);

        predictions.push({
          subjectId: subject.id,
          name: subject.name,
          code: subject.code,
          type: 'lab',
          credits,
          internalsTotal,
          expectedEndSem: 0,
          totalScore,
          grade,
          gradePoint
        });
      } else {
        // Theory: Mid-Sem (max 20) + Quiz (max 10) + Assignment (max 20) = 50 internals
        const midSem = (estimate && estimate.midSem !== undefined && estimate.midSem !== '')
          ? Number(estimate.midSem)
          : (mark && mark.midSem !== null ? mark.midSem : 16);

        const quiz = (estimate && estimate.quiz !== undefined && estimate.quiz !== '')
          ? Number(estimate.quiz)
          : (mark && mark.quiz !== null ? mark.quiz : 8);

        const assignment = (estimate && estimate.assignment !== undefined && estimate.assignment !== '')
          ? Number(estimate.assignment)
          : (mark && mark.assignment !== null ? mark.assignment : 16);

        const expectedEndSem = (estimate && estimate.expectedEndSem !== undefined && estimate.expectedEndSem !== '')
          ? Number(estimate.expectedEndSem)
          : 0;

        const internalsTotal = midSem + quiz + assignment;
        const totalScore = Math.min(100, internalsTotal + expectedEndSem);

        // KIIT Grading Scheme
        let grade = 'F';
        let gradePoint = 2;
        if (totalScore >= 90) { grade = 'O'; gradePoint = 10; }
        else if (totalScore >= 80) { grade = 'E'; gradePoint = 9; }
        else if (totalScore >= 70) { grade = 'A'; gradePoint = 8; }
        else if (totalScore >= 60) { grade = 'B'; gradePoint = 7; }
        else if (totalScore >= 50) { grade = 'C'; gradePoint = 6; }
        else if (totalScore >= 40) { grade = 'D'; gradePoint = 5; }

        const credits = subject.credits || 3;
        totalCredits += credits;
        totalWeightedPoints += (gradePoint * credits);

        predictions.push({
          subjectId: subject.id,
          name: subject.name,
          code: subject.code,
          type: 'theory',
          credits,
          internalsTotal,
          expectedEndSem,
          totalScore,
          grade,
          gradePoint
        });
      }
    }

    const predictedSGPA = totalCredits === 0 ? 0.0 : (totalWeightedPoints / totalCredits).toFixed(2);

    res.status(200).json({
      predictions,
      totalCredits,
      predictedSGPA
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { predictSGPA };
