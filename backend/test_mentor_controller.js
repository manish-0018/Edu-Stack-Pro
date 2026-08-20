const { getMentees, getAttendanceShortages, getMenteesLeaves, getMentorshipSessions } = require('./controllers/mentorController');
const { User } = require('./models');

async function test() {
  try {
    const user = await User.findOne({ where: { email: 'aryan1@gmail.com' } });
    if (!user) {
      console.log("Arya user not found!");
      return;
    }
    console.log("Mock User:", {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      course: user.course,
      collegeId: user.collegeId
    });
    
    const req = { user: user };
    
    const makeRes = (name) => ({
      status: function(code) {
        console.log(`[${name}] Status:`, code);
        return this;
      },
      json: function(data) {
        console.log(`[${name}] JSON:`, data);
      }
    });

    console.log("\n--- Testing getMentees ---");
    try {
      await getMentees(req, makeRes("getMentees"));
    } catch (e) {
      console.error("getMentees critical error:", e);
    }

    console.log("\n--- Testing getAttendanceShortages ---");
    try {
      await getAttendanceShortages(req, makeRes("getAttendanceShortages"));
    } catch (e) {
      console.error("getAttendanceShortages critical error:", e);
    }

    console.log("\n--- Testing getMenteesLeaves ---");
    try {
      await getMenteesLeaves(req, makeRes("getMenteesLeaves"));
    } catch (e) {
      console.error("getMenteesLeaves critical error:", e);
    }

    console.log("\n--- Testing getMentorshipSessions ---");
    try {
      await getMentorshipSessions(req, makeRes("getMentorshipSessions"));
    } catch (e) {
      console.error("getMentorshipSessions critical error:", e);
    }

  } catch (err) {
    console.error("Test execution failed:", err);
  } finally {
    process.exit(0);
  }
}

test();
