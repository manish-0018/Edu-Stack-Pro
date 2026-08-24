const { CompanyListing, PlacementApplication, User } = require('../models');

// Get all company listings
const getCompanyListings = async (req, res) => {
  try {
    // Seed default companies if database is empty
    const count = await CompanyListing.count();
    if (count === 0) {
      await CompanyListing.bulkCreate([
        {
          name: 'Google',
          position: 'Software Engineer Intern',
          type: 'internship',
          package: '₹1,00,000 / month',
          criteria: 'Currently enrolled in BCA, B.Tech or equivalent. CGPA >= 8.0. No active backlogs.',
          description: 'Join the Google Engineering team to build next-generation applications. You will work on real-world projects and collaborate with senior engineers.',
          steps: '1. Resume Shortlisting\n2. Online Coding Assessment (2 questions, 90 mins)\n3. Technical Interview (Data Structures & Algorithms)\n4. Go/No-Go Review',
          deadline: '2026-09-30'
        },
        {
          name: 'Microsoft',
          position: 'Associate Software Developer',
          type: 'placement',
          package: '₹18,00,000 / annum',
          criteria: 'Graduating students of BCA/MCA/B.Tech. CGPA >= 7.5. Strong foundation in OOP and system design.',
          description: 'Full-time software engineering role at Microsoft. Design, build and maintain scalable cloud services on Azure.',
          steps: '1. CV Screening\n2. Codility Test\n3. System Design Round\n4. HR and Culture Fit Round',
          deadline: '2026-10-15'
        },
        {
          name: 'TCS (Tata Consultancy Services)',
          position: 'Ninja Developer',
          type: 'placement',
          package: '₹4,50,000 / annum',
          criteria: 'Open to all BCA, BSc, and MCA students. Minimum 60% in 10th, 12th, and graduation.',
          description: 'Entry-level full-time development role under TCS National Qualifier Test (NQT). Excellent opportunity to start your IT career.',
          steps: '1. TCS NQT Exam (Aptitude & Coding)\n2. Technical & Managerial Interview\n3. HR Onboarding',
          deadline: '2026-08-30'
        },
        {
          name: 'Wipro',
          position: 'Elite Project Engineer',
          type: 'placement',
          package: '₹4,00,000 / annum',
          criteria: 'BCA or BSc Computer Science graduates. CGPA >= 6.0.',
          description: 'Work on cutting-edge enterprise projects at Wipro. Training and certification included.',
          steps: '1. Aptitude + Written Communication Test\n2. Technical Interview\n3. HR Round',
          deadline: '2026-08-20'
        },
        {
          name: 'Infosys',
          position: 'Systems Engineer',
          type: 'placement',
          package: '₹4,20,000 / annum',
          criteria: 'BCA, MCA, and MSc graduates. 65% aggregate or above.',
          description: 'Solve real-world business problems by engineering cloud, AI, and big data solutions.',
          steps: '1. Infosys Certification Exam\n2. Technical round\n3. HR Interview',
          deadline: '2026-09-10'
        },
        {
          name: 'KIIT R&D Lab',
          position: 'Research Intern',
          type: 'internship',
          package: '₹15,000 / month',
          criteria: 'Open to KIIT students of any year. Passion for machine learning and academic research.',
          description: 'Conduct literature reviews and assist professors in writing research papers on artificial intelligence and agentic workflows.',
          steps: '1. SOP Round\n2. Interview with Research Directors',
          deadline: '2026-07-31'
        }
      ]);
    }

    const listings = await CompanyListing.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(listings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Create a new company listing (Admin only)
const createCompanyListing = async (req, res) => {
  try {
    const { name, position, type, package: pkg, criteria, description, steps, deadline } = req.body;
    if (!name || !position || !pkg) throw new Error('Company name, position, and package/stipend are required');
    const newListing = await CompanyListing.create({
      name,
      position,
      type,
      package: pkg,
      criteria,
      description,
      steps,
      deadline
    });
    res.status(201).json(newListing);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update student resume URL (Student only)
const updateResumeUrl = async (req, res) => {
  try {
    const { resumeUrl } = req.body;
    if (!resumeUrl) throw new Error('Resume URL is required');

    const user = await User.findByPk(req.user.id);
    if (!user) throw new Error('User not found');

    await user.update({ resumeUrl });
    res.status(200).json({ message: 'Resume updated successfully', resumeUrl });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Apply to a company listing (Student only)
const applyToListing = async (req, res) => {
  try {
    const { submissionText } = req.body;
    const companyListingId = req.params.id;

    // Check if user has uploaded resume
    const user = await User.findByPk(req.user.id);
    if (!user.resumeUrl) {
      throw new Error('Please add your resume link in the placement portal before applying');
    }

    // Check if already applied
    const existingApp = await PlacementApplication.findOne({
      where: { studentId: req.user.id, companyListingId }
    });
    if (existingApp) {
      throw new Error('You have already applied to this company');
    }

    const application = await PlacementApplication.create({
      studentId: req.user.id,
      companyListingId,
      submissionText
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all applications (Student sees their own; Admin/Teacher sees all)
const getApplications = async (req, res) => {
  try {
    let whereClause = {};
    if (req.user.role === 'student') {
      whereClause.studentId = req.user.id;
    }

    const applications = await PlacementApplication.findAll({
      where: whereClause,
      include: [
        { model: CompanyListing, as: 'Company' },
        { model: User, as: 'Student', attributes: ['name', 'email', 'resumeUrl'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(applications);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update application status (Admin/Teacher only)
const updateApplicationStatus = async (req, res) => {
  try {
    const { status, submissionText } = req.body;
    const application = await PlacementApplication.findByPk(req.params.id);
    if (!application) throw new Error('Application not found');

    const updateData = {};
    if (status) updateData.status = status;
    if (submissionText !== undefined) updateData.submissionText = submissionText;

    await application.update(updateData);
    res.status(200).json(application);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// AI Resume Fit Matcher (Student only)
const matchResumeWithAI = async (req, res) => {
  try {
    const { resumeText, companyListingId } = req.body;
    if (!resumeText) throw new Error('Resume text is required');
    if (!companyListingId) throw new Error('Company listing ID is required');

    const listing = await CompanyListing.findByPk(companyListingId);
    if (!listing) throw new Error('Company listing not found');

    const jobDescription = `${listing.position}. Requirements: ${listing.criteria}. Job Description: ${listing.description}`;

    const axios = require('axios');
    const mlUrl = process.env.ML_SERVICE_URL || 'https://backend-ml-production-50d2.up.railway.app';
    const mlRes = await axios.post(`${mlUrl}/match_resume`, {
      resume_text: resumeText,
      job_description: jobDescription
    }, { timeout: 12000 });

    res.status(200).json(mlRes.data);
  } catch (error) {
    res.status(200).json({
      match_score: 65.0,
      matching_skills: ["JAVASCRIPT", "SQL", "HTML", "CSS"],
      missing_skills: ["PYTHON", "REACT", "DOCKER"],
      feedback: "Good match. You have foundational skills. Brushing up on the missing skills will improve your fit for this role. (Local fallback match)"
    });
  }
};

// AI Career Planner Roadmap (Student only)
const generateRoadmapWithAI = async (req, res) => {
  try {
    const { careerGoal } = req.body;
    if (!careerGoal) throw new Error('Career goal is required');

    const { Mark } = require('../models');
    const marks = await Mark.findAll({ where: { studentId: req.user.id } });
    let totalMarks = 0;
    let counts = 0;
    marks.forEach(m => {
      let avg = 0;
      let items = 0;
      if (m.midSem !== null) { avg += (m.midSem * 2); items++; }
      if (m.endSem !== null) { avg += (m.endSem * 2); items++; }
      if (items > 0) {
        totalMarks += (avg / items);
        counts++;
      }
    });
    const gradesAverage = counts > 0 ? (totalMarks / counts) : 75.0;

    const axios = require('axios');
    const mlUrl = process.env.ML_SERVICE_URL || 'https://backend-ml-production-50d2.up.railway.app';
    const mlRes = await axios.post(`${mlUrl}/generate_roadmap`, {
      career_goal: careerGoal,
      grades_average: gradesAverage
    }, { timeout: 12000 });

    res.status(200).json(mlRes.data);
  } catch (error) {
    res.status(200).json({
      recommended_role: "Full Stack Web Developer",
      fit_reason: "Your target goal highlights solid baseline skills, matching well with Web Development tracks. (Local fallback match)",
      roadmap: [
        { week: 1, topic: "Advanced JavaScript & ES6+", resources: ["MDN JavaScript Guide", "JavaScript.info"] },
        { week: 2, topic: "React.js State Management & Hooks", resources: ["Official React Docs", "Scrimba React Course"] },
        { week: 3, topic: "Tailwind CSS & Responsive Layouts", resources: ["TailwindCSS Docs", "Refactoring UI"] },
        { week: 4, topic: "Node.js & Express REST APIs", resources: ["Express.js Documentation", "FreeCodeCamp Backend Guide"] },
        { week: 5, topic: "Databases (MongoDB / PostgreSQL)", resources: ["MongoDB University", "Postgres Tutorial"] },
        { week: 6, topic: "Git, GitHub & Deployment (Vercel/Render)", resources: ["GitHub Learning Lab", "Netlify Deployment Guide"] },
        { week: 7, topic: "Testing (Jest / React Testing Library)", resources: ["Testing Library Guide", "Jest Crash Course"] },
        { week: 8, topic: "Portfolio Building & Mock Interviews", resources: ["LeetCode Easy Problems", "FrontEnd Mentor Projects"] }
      ]
    });
  }
};

module.exports = {
  getCompanyListings,
  createCompanyListing,
  updateResumeUrl,
  applyToListing,
  getApplications,
  updateApplicationStatus,
  matchResumeWithAI,
  generateRoadmapWithAI
};
