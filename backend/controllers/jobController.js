const { JobPost, JobApplication, User } = require('../models');
const { Op } = require('sequelize');

// @desc Create job post (admin/teacher)
const createJob = async (req, res) => {
  try {
    const { title, company, description, location, salary, type, deadline, skills, applyLink } = req.body;
    const job = await JobPost.create({
      title, company, description, location, salary,
      type: type || 'fulltime',
      postedById: req.user.id,
      deadline: deadline || null,
      skills: skills || [],
      applyLink: applyLink || null
    });
    res.status(201).json(job);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Get all jobs (filterable)
const getJobs = async (req, res) => {
  try {
    const { type, skill, search } = req.query;
    let where = { isActive: true };
    if (type) where.type = type;

    const jobs = await JobPost.findAll({
      where,
      include: [
        { model: User, as: 'PostedBy', attributes: ['name'] },
        { model: JobApplication, required: false }
      ],
      order: [['createdAt', 'DESC']]
    });

    let result = jobs;
    if (skill) {
      result = jobs.filter(j => (j.skills || []).some(s => s.toLowerCase().includes(skill.toLowerCase())));
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(j =>
        j.title?.toLowerCase().includes(q) ||
        j.company?.toLowerCase().includes(q) ||
        j.description?.toLowerCase().includes(q)
      );
    }

    res.status(200).json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Apply to a job (student)
const applyToJob = async (req, res) => {
  try {
    const { id: jobPostId } = req.params;
    const { coverLetter } = req.body;

    const existing = await JobApplication.findOne({ where: { jobPostId, studentId: req.user.id } });
    if (existing) return res.status(400).json({ message: 'Already applied to this job' });

    const application = await JobApplication.create({ jobPostId, studentId: req.user.id, coverLetter });
    res.status(201).json(application);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Update application status (admin/teacher)
const updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const application = await JobApplication.findByPk(id);
    if (!application) return res.status(404).json({ message: 'Application not found' });
    application.status = status;
    await application.save();
    res.status(200).json(application);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Get my applications (student)
const getMyApplications = async (req, res) => {
  try {
    const applications = await JobApplication.findAll({
      where: { studentId: req.user.id },
      include: [{ model: JobPost, as: 'Job', attributes: ['title', 'company', 'type', 'location'] }]
    });
    res.status(200).json(applications);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Get applications for a job (admin)
const getJobApplications = async (req, res) => {
  try {
    const applications = await JobApplication.findAll({
      where: { jobPostId: req.params.id },
      include: [{ model: User, as: 'Student', attributes: ['name', 'email', 'course'] }]
    });
    res.status(200).json(applications);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc Delete job (admin)
const deleteJob = async (req, res) => {
  try {
    const job = await JobPost.findByPk(req.params.id);
    if (!job) return res.status(404).json({ message: 'Not found' });
    await job.destroy();
    res.status(200).json({ id: req.params.id });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { createJob, getJobs, applyToJob, updateApplicationStatus, getMyApplications, getJobApplications, deleteJob };
