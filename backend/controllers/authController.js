const { User, Class, College, CourseRollConfig } = require('../models');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, role, classId, course, parentEmail, collegeId, accessCode } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please add all required fields');
    }

    // Role Verification Key to prevent students from registering as Admin, Teacher or Mentor
    if (role === 'admin' || role === 'teacher' || role === 'mentor') {
      if (!collegeId) {
        res.status(400);
        throw new Error('Please select a college to register as staff.');
      }
      const college = await College.findByPk(collegeId);
      if (!college) {
        res.status(404);
        throw new Error('Selected college not found.');
      }
      const masterLicense = process.env.PLATFORM_LICENSE_KEY || 'EDUSTACK-LICENSE-2026';
      if (accessCode !== college.secretKey && accessCode !== masterLicense) {
        res.status(401);
        throw new Error(`Invalid Secret Access Code for ${college.name}.`);
      }
    }

    // Check if user exists
    const userExists = await User.findOne({ where: { email } });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    // Create user
    const userData = {
      name,
      email,
      password,
      role: role || 'student', // Default to student
      course: course || null,
      collegeId: collegeId || null
    };

    if (classId) {
      userData.classId = classId;
    }

    // Automatic non-colliding sequential roll number generator
    if (userData.role === 'student' && userData.course && userData.collegeId) {
      let rollConfig = await CourseRollConfig.findOne({
        where: { course: userData.course, collegeId: userData.collegeId }
      });
      if (rollConfig) {
        const nextRoll = rollConfig.currentRollNo + 1;
        userData.rollNo = nextRoll;
        await rollConfig.update({ currentRollNo: nextRoll });
      } else {
        const maxConfig = await CourseRollConfig.findOne({
          order: [['currentRollNo', 'DESC']]
        });
        const startRoll = maxConfig ? (maxConfig.currentRollNo + 1000) : 2601001;
        await CourseRollConfig.create({
          course: userData.course,
          collegeId: userData.collegeId,
          startRollNo: startRoll,
          currentRollNo: startRoll
        });
        userData.rollNo = startRoll;
      }
    }

    const user = await User.create(userData);

    // If a parent email is supplied and the new user is a student, just store it
if (parentEmail && user.role === 'student') {
  // Update student's parentEmail field
  user.parentEmail = parentEmail;
  await user.save();
}

    if (user) {
      const fullUser = await User.findByPk(user.id, {
        include: [{ model: College, as: 'College', attributes: ['name', 'latitude', 'longitude'] }]
      });
      res.status(201).json({
        id: fullUser.id,
        name: fullUser.name,
        email: fullUser.email,
        role: fullUser.role,
        classId: fullUser.classId,
        course: fullUser.course,
        rollNo: fullUser.rollNo,
        collegeId: fullUser.collegeId,
        College: fullUser.College,
        token: generateToken(fullUser.id),
      });
    } else {
      res.status(400);
      throw new Error('Invalid user data');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ where: { email } });

    if (user && (await user.matchPassword(password))) {
      const fullUser = await User.findByPk(user.id, {
        include: [{ model: College, as: 'College', attributes: ['name', 'latitude', 'longitude'] }]
      });
      res.json({
        id: fullUser.id,
        name: fullUser.name,
        email: fullUser.email,
        role: fullUser.role,
        classId: fullUser.classId,
        course: fullUser.course,
        rollNo: fullUser.rollNo,
        collegeId: fullUser.collegeId,
        College: fullUser.College,
        token: generateToken(fullUser.id),
      });
    } else {
      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user data
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: College, as: 'College', attributes: ['name', 'latitude', 'longitude'] }]
    });
    res.status(200).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Reset password (Forgot Password)
// @route   POST /api/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
  try {
    const { email, role, verificationValue, newPassword } = req.body;

    if (!email || !role || !verificationValue || !newPassword) {
      return res.status(400).json({ message: 'Please add all required fields' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Find user
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role !== role) {
      return res.status(400).json({ message: 'User role mismatch' });
    }

    // Verify identity
    if (role === 'student') {
      if (!user.parentEmail || user.parentEmail.toLowerCase() !== verificationValue.toLowerCase()) {
        return res.status(400).json({ message: 'Parent email verification failed' });
      }
    } else if (role === 'admin') {
      const adminKey = process.env.ADMIN_RESET_KEY || 'EDU-ADMIN-RESET-2026';
      if (verificationValue !== adminKey) {
        return res.status(400).json({ message: 'Invalid Admin Master Reset Key' });
      }
    } else if (role === 'teacher') {
      const teacherKey = process.env.TEACHER_RESET_KEY || 'EDU-TEACHER-RESET-2026';
      if (verificationValue !== teacherKey) {
        return res.status(400).json({ message: 'Invalid Teacher Master Reset Key' });
      }
    }

    // Update password (hooks will auto-hash it on save)
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password reset successful. You can now login.' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all colleges (auto-seed if empty)
// @route   GET /api/auth/colleges
// @access  Public
const getColleges = async (req, res) => {
  try {
    let colleges = await College.findAll();
    if (colleges.length === 0) {
      await College.create({ name: 'Apex Engineering College', secretKey: 'APEX-STAFF-2026' });
      await College.create({ name: 'Nexus Institute of Technology', secretKey: 'NEXUS-STAFF-2026' });
      colleges = await College.findAll();
    }
    res.status(200).json(colleges);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new college tenant
// @route   POST /api/auth/colleges
// @access  Public
const createCollege = async (req, res) => {
  try {
    const { name, secretKey, licenseKey } = req.body;
    if (!name || !secretKey || !licenseKey) {
      res.status(400);
      throw new Error('Please add college name, secret staff key, and master license key.');
    }

    // Verify Master Platform License Key
    const masterLicense = process.env.PLATFORM_LICENSE_KEY || 'EDUSTACK-LICENSE-2026';
    if (licenseKey !== masterLicense) {
      res.status(401);
      throw new Error('Invalid Master Platform License Key. Access denied.');
    }

    const collegeExists = await College.findOne({ where: { name } });
    if (collegeExists) {
      res.status(400);
      throw new Error('College already exists on this platform.');
    }

    const college = await College.create({ name, secretKey });
    res.status(201).json(college);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a college tenant (e.g. settings or GPS coordinates)
// @route   PUT /api/auth/colleges/:id
// @access  Private
const updateCollege = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude, midSemStartDate, midSemEndDate, isMidSemAdmitCardEnabled, endSemStartDate, endSemEndDate, isEndSemAdmitCardEnabled } = req.body;

    const college = await College.findByPk(id);
    if (!college) {
      res.status(404);
      throw new Error('College not found');
    }

    await college.update({
      latitude: latitude !== undefined ? latitude : college.latitude,
      longitude: longitude !== undefined ? longitude : college.longitude,
      midSemStartDate: midSemStartDate !== undefined ? midSemStartDate : college.midSemStartDate,
      midSemEndDate: midSemEndDate !== undefined ? midSemEndDate : college.midSemEndDate,
      isMidSemAdmitCardEnabled: isMidSemAdmitCardEnabled !== undefined ? isMidSemAdmitCardEnabled : college.isMidSemAdmitCardEnabled,
      endSemStartDate: endSemStartDate !== undefined ? endSemStartDate : college.endSemStartDate,
      endSemEndDate: endSemEndDate !== undefined ? endSemEndDate : college.endSemEndDate,
      isEndSemAdmitCardEnabled: isEndSemAdmitCardEnabled !== undefined ? isEndSemAdmitCardEnabled : college.isEndSemAdmitCardEnabled
    });

    res.status(200).json(college);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  resetPassword,
  getColleges,
  createCollege,
  updateCollege
};

