const { Opportunity, TeamRequest, User } = require('../models');

const getOpportunities = async (req, res) => {
  try {
    const opps = await Opportunity.findAll({
      include: [{ model: User, as: 'PostedBy', attributes: ['id', 'name', 'course', 'role'] }],
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json(opps);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createOpportunity = async (req, res) => {
  try {
    const { title, description, type, link, deadline } = req.body;
    const opp = await Opportunity.create({
      title, description, type, link, deadline, postedById: req.user.id
    });
    res.status(201).json(opp);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getTeamRequests = async (req, res) => {
  try {
    const requests = await TeamRequest.findAll({
      where: { opportunityId: req.params.id },
      include: [{ model: User, as: 'Student', attributes: ['id', 'name', 'course', 'email'] }]
    });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createTeamRequest = async (req, res) => {
  try {
    const { message } = req.body;
    const reqs = await TeamRequest.create({
      opportunityId: req.params.id,
      studentId: req.user.id,
      message
    });
    res.status(201).json(reqs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getOpportunities, createOpportunity, getTeamRequests, createTeamRequest };
