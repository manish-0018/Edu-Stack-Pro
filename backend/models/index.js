const User = require('./User');
const Class = require('./Class');
const College = require('./College');
const Subject = require('./Subject');
const Attendance = require('./Attendance');
const AttendanceRecord = require('./AttendanceRecord');
const LeaveRequest = require('./LeaveRequest');
const Mark = require('./Mark');
const RecoveryAssignment = require('./RecoveryAssignment');
const Material = require('./Material');
const CompanyListing = require('./CompanyListing');
const PlacementApplication = require('./PlacementApplication');
const Timetable = require('./Timetable');
const Notification = require('./Notification');
const MentorshipSlot = require('./MentorshipSlot');
const Opportunity = require('./Opportunity');
const TeamRequest = require('./TeamRequest');
const MaterialPurchase = require('./MaterialPurchase');
const StudyRequest = require('./StudyRequest');
const Holiday = require('./Holiday');
const Task = require('./Task');
const Message = require('./Message');
const StudyGroup = require('./StudyGroup');
const StudyGroupParticipant = require('./StudyGroupParticipant');
const ForumPost = require('./ForumPost');
const ForumReply = require('./ForumReply');
const LibraryBook = require('./LibraryBook');
const BookCheckout = require('./BookCheckout');
const BookReview = require('./BookReview');
const Confession = require('./Confession');
const MarketplaceItem = require('./MarketplaceItem');
const PlacementInsight = require('./PlacementInsight');
const MentorProfile = require('./MentorProfile');
const PredictionLog = require('./PredictionLog');
const Assignment = require('./Assignment');
const AssignmentSubmission = require('./AssignmentSubmission');
const Quiz = require('./Quiz');
const QuizQuestion = require('./QuizQuestion');
const QuizAttempt = require('./QuizAttempt');
const AlumniProfile = require('./AlumniProfile');
const JobPost = require('./JobPost');
const JobApplication = require('./JobApplication');
const Announcement = require('./Announcement');
const Transaction = require('./Transaction');
const PrepHistory = require('./PrepHistory');
const StudyGuide = require('./StudyGuide');
const ProjectPosting = require('./ProjectPosting');
const ProjectInvite = require('./ProjectInvite');
const StudyRecommendation = require('./StudyRecommendation');
const PeerMatch = require('./PeerMatch');
const CourseRollConfig = require('./CourseRollConfig');
const MentorshipSession = require('./MentorshipSession');

// User and Class (Students belong to a Class)
Class.hasMany(User, { foreignKey: 'classId' });
User.belongsTo(Class, { foreignKey: 'classId' });

// College relationships
College.hasMany(User, { foreignKey: 'collegeId' });
User.belongsTo(College, { as: 'College', foreignKey: 'collegeId' });
College.hasMany(Announcement, { foreignKey: 'collegeId' });
Announcement.belongsTo(College, { as: 'College', foreignKey: 'collegeId' });
College.hasMany(Class, { foreignKey: 'collegeId' });
Class.belongsTo(College, { as: 'College', foreignKey: 'collegeId' });

// Subject and Class
Class.hasMany(Subject, { foreignKey: 'classId' });
Subject.belongsTo(Class, { foreignKey: 'classId' });

// Subject and Teacher (User)
User.hasMany(Subject, { foreignKey: 'teacherId' });
Subject.belongsTo(User, { as: 'Teacher', foreignKey: 'teacherId' });

// LeaveRequest and Student (User)
User.hasMany(LeaveRequest, { foreignKey: 'studentId' });
LeaveRequest.belongsTo(User, { as: 'Student', foreignKey: 'studentId' });

// LeaveRequest and Approver (User)
User.hasMany(LeaveRequest, { foreignKey: 'approvedById' });
LeaveRequest.belongsTo(User, { as: 'Approver', foreignKey: 'approvedById' });

// Attendance relationships
Class.hasMany(Attendance, { foreignKey: 'classId' });
Attendance.belongsTo(Class, { foreignKey: 'classId' });

// Subject and Attendance
Subject.hasMany(Attendance, { foreignKey: 'subjectId' });
Attendance.belongsTo(Subject, { foreignKey: 'subjectId' });

// User (Marker) and Attendance
User.hasMany(Attendance, { foreignKey: 'markedById' });
Attendance.belongsTo(User, { as: 'Marker', foreignKey: 'markedById' });

// Attendance Record relationships
Attendance.hasMany(AttendanceRecord, { foreignKey: 'attendanceId', as: 'records' });
AttendanceRecord.belongsTo(Attendance, { foreignKey: 'attendanceId' });

// Student (User) and AttendanceRecord
User.hasMany(AttendanceRecord, { foreignKey: 'studentId' });
AttendanceRecord.belongsTo(User, { as: 'Student', foreignKey: 'studentId' });

// Internal Marks relationships
User.hasMany(Mark, { foreignKey: 'studentId' });
Mark.belongsTo(User, { as: 'Student', foreignKey: 'studentId' });

// Subject and Mark
Subject.hasMany(Mark, { foreignKey: 'subjectId' });
Mark.belongsTo(Subject, { foreignKey: 'subjectId' });

// Student (User) and RecoveryAssignment
User.hasMany(RecoveryAssignment, { foreignKey: 'studentId' });
RecoveryAssignment.belongsTo(User, { as: 'Student', foreignKey: 'studentId' });

// Subject and RecoveryAssignment
Subject.hasMany(RecoveryAssignment, { foreignKey: 'subjectId' });
RecoveryAssignment.belongsTo(Subject, { foreignKey: 'subjectId' });

// Subject and Material (Notes)
Subject.hasMany(Material, { foreignKey: 'subjectId' });
Material.belongsTo(Subject, { foreignKey: 'subjectId' });

// User (Uploader) and Material
User.hasMany(Material, { foreignKey: 'uploaderId' });
Material.belongsTo(User, { as: 'Uploader', foreignKey: 'uploaderId' });

// Placement / Internship portal relationships
User.hasMany(PlacementApplication, { foreignKey: 'studentId' });
PlacementApplication.belongsTo(User, { as: 'Student', foreignKey: 'studentId' });

CompanyListing.hasMany(PlacementApplication, { foreignKey: 'companyListingId' });
PlacementApplication.belongsTo(CompanyListing, { as: 'Company', foreignKey: 'companyListingId' });

// Timetable relationships
Class.hasMany(Timetable, { foreignKey: 'classId' });
Timetable.belongsTo(Class, { foreignKey: 'classId' });
Subject.hasMany(Timetable, { foreignKey: 'subjectId' });
Timetable.belongsTo(Subject, { foreignKey: 'subjectId' });
User.hasMany(Timetable, { foreignKey: 'teacherId' });
Timetable.belongsTo(User, { as: 'Teacher', foreignKey: 'teacherId' });

// Notification relationships
User.hasMany(Notification, { foreignKey: 'userId' });
Notification.belongsTo(User, { foreignKey: 'userId' });

// Mentorship relationships
User.hasMany(MentorshipSlot, { as: 'OfferedSlots', foreignKey: 'mentorId' });
MentorshipSlot.belongsTo(User, { as: 'Mentor', foreignKey: 'mentorId' });
User.hasMany(MentorshipSlot, { as: 'BookedSlots', foreignKey: 'menteeId' });
MentorshipSlot.belongsTo(User, { as: 'Mentee', foreignKey: 'menteeId' });

// Opportunity relationships
User.hasMany(Opportunity, { foreignKey: 'postedById' });
Opportunity.belongsTo(User, { as: 'PostedBy', foreignKey: 'postedById' });

// TeamRequest relationships
Opportunity.hasMany(TeamRequest, { foreignKey: 'opportunityId' });
TeamRequest.belongsTo(Opportunity, { foreignKey: 'opportunityId' });
User.hasMany(TeamRequest, { foreignKey: 'studentId' });
TeamRequest.belongsTo(User, { as: 'Student', foreignKey: 'studentId' });

// Material Purchase relationships
User.hasMany(MaterialPurchase, { foreignKey: 'studentId' });
MaterialPurchase.belongsTo(User, { as: 'Student', foreignKey: 'studentId' });
Material.hasMany(MaterialPurchase, { foreignKey: 'materialId' });
MaterialPurchase.belongsTo(Material, { foreignKey: 'materialId' });

// StudyRequest relationships
User.hasMany(StudyRequest, { as: 'StudyRequests', foreignKey: 'requesterId' });
StudyRequest.belongsTo(User, { as: 'Requester', foreignKey: 'requesterId' });
User.hasMany(StudyRequest, { as: 'TutoringRequests', foreignKey: 'tutorId' });
StudyRequest.belongsTo(User, { as: 'Tutor', foreignKey: 'tutorId' });
Subject.hasMany(StudyRequest, { foreignKey: 'subjectId' });
StudyRequest.belongsTo(Subject, { foreignKey: 'subjectId' });

// Task relationships
User.hasMany(Task, { foreignKey: 'studentId' });
Task.belongsTo(User, { foreignKey: 'studentId' });

// Collaboration Relationships
User.hasMany(Message, { as: 'SentMessages', foreignKey: 'senderId' });
Message.belongsTo(User, { as: 'Sender', foreignKey: 'senderId' });
User.hasMany(Message, { as: 'ReceivedMessages', foreignKey: 'receiverId' });
Message.belongsTo(User, { as: 'Receiver', foreignKey: 'receiverId' });
StudyRequest.hasMany(Message, { foreignKey: 'studyRequestId' });
Message.belongsTo(StudyRequest, { foreignKey: 'studyRequestId' });
StudyGroup.hasMany(Message, { foreignKey: 'studyGroupId' });
Message.belongsTo(StudyGroup, { foreignKey: 'studyGroupId' });

User.hasMany(StudyGroup, { foreignKey: 'creatorId' });
StudyGroup.belongsTo(User, { as: 'Creator', foreignKey: 'creatorId' });
Subject.hasMany(StudyGroup, { foreignKey: 'subjectId' });
StudyGroup.belongsTo(Subject, { foreignKey: 'subjectId' });

StudyGroup.hasMany(StudyGroupParticipant, { foreignKey: 'studyGroupId' });
StudyGroupParticipant.belongsTo(StudyGroup, { foreignKey: 'studyGroupId' });
User.hasMany(StudyGroupParticipant, { foreignKey: 'studentId' });
StudyGroupParticipant.belongsTo(User, { as: 'Student', foreignKey: 'studentId' });

User.hasMany(ForumPost, { foreignKey: 'userId' });
ForumPost.belongsTo(User, { as: 'Author', foreignKey: 'userId' });
Subject.hasMany(ForumPost, { foreignKey: 'subjectId' });
ForumPost.belongsTo(Subject, { foreignKey: 'subjectId' });

ForumPost.hasMany(ForumReply, { foreignKey: 'postId' });
ForumReply.belongsTo(ForumPost, { foreignKey: 'postId' });
User.hasMany(ForumReply, { foreignKey: 'userId' });
ForumReply.belongsTo(User, { as: 'Author', foreignKey: 'userId' });

// Assignment relationships
User.hasMany(Assignment, { as: 'CreatedAssignments', foreignKey: 'teacherId' });
Assignment.belongsTo(User, { as: 'Teacher', foreignKey: 'teacherId' });
Subject.hasMany(Assignment, { foreignKey: 'subjectId' });
Assignment.belongsTo(Subject, { foreignKey: 'subjectId' });
Assignment.hasMany(AssignmentSubmission, { foreignKey: 'assignmentId' });
AssignmentSubmission.belongsTo(Assignment, { foreignKey: 'assignmentId' });
User.hasMany(AssignmentSubmission, { foreignKey: 'studentId' });
AssignmentSubmission.belongsTo(User, { as: 'Student', foreignKey: 'studentId' });

// Quiz relationships
User.hasMany(Quiz, { as: 'CreatedQuizzes', foreignKey: 'teacherId' });
Quiz.belongsTo(User, { as: 'Teacher', foreignKey: 'teacherId' });
Subject.hasMany(Quiz, { foreignKey: 'subjectId' });
Quiz.belongsTo(Subject, { foreignKey: 'subjectId' });
Quiz.hasMany(QuizQuestion, { foreignKey: 'quizId' });
QuizQuestion.belongsTo(Quiz, { foreignKey: 'quizId' });
Quiz.hasMany(QuizAttempt, { foreignKey: 'quizId' });
QuizAttempt.belongsTo(Quiz, { foreignKey: 'quizId' });
User.hasMany(QuizAttempt, { foreignKey: 'studentId' });
QuizAttempt.belongsTo(User, { as: 'Student', foreignKey: 'studentId' });

// Alumni relationships
User.hasOne(AlumniProfile, { foreignKey: 'userId' });
AlumniProfile.belongsTo(User, { as: 'User', foreignKey: 'userId' });

// MentorProfile relationships
User.hasOne(MentorProfile, { foreignKey: 'userId' });
MentorProfile.belongsTo(User, { as: 'User', foreignKey: 'userId' });

// JobPost relationships
User.hasMany(JobPost, { as: 'PostedJobs', foreignKey: 'postedById' });
JobPost.belongsTo(User, { as: 'PostedBy', foreignKey: 'postedById' });
JobPost.hasMany(JobApplication, { foreignKey: 'jobPostId' });
JobApplication.belongsTo(JobPost, { as: 'Job', foreignKey: 'jobPostId' });
User.hasMany(JobApplication, { foreignKey: 'studentId' });
JobApplication.belongsTo(User, { as: 'Student', foreignKey: 'studentId' });

// Announcement relationships
User.hasMany(Announcement, { as: 'PostedAnnouncements', foreignKey: 'postedById' });
Announcement.belongsTo(User, { as: 'PostedBy', foreignKey: 'postedById' });

// LibraryBook relationships
LibraryBook.hasMany(BookCheckout, { foreignKey: 'bookId' });
BookCheckout.belongsTo(LibraryBook, { as: 'Book', foreignKey: 'bookId' });
User.hasMany(BookCheckout, { foreignKey: 'studentId' });
BookCheckout.belongsTo(User, { as: 'Student', foreignKey: 'studentId' });

LibraryBook.hasMany(BookReview, { foreignKey: 'bookId' });
BookReview.belongsTo(LibraryBook, { foreignKey: 'bookId' });
User.hasMany(BookReview, { foreignKey: 'studentId' });
BookReview.belongsTo(User, { as: 'Student', foreignKey: 'studentId' });

// Transaction associations
User.hasMany(Transaction, { foreignKey: 'studentId' });
Transaction.belongsTo(User, { as: 'Student', foreignKey: 'studentId' });

// PrepHistory associations
User.hasMany(PrepHistory, { foreignKey: 'studentId' });
PrepHistory.belongsTo(User, { as: 'Student', foreignKey: 'studentId' });

// StudyGuide associations
User.hasMany(StudyGuide, { foreignKey: 'studentId' });
StudyGuide.belongsTo(User, { as: 'Student', foreignKey: 'studentId' });

// ProjectPosting associations
User.hasMany(ProjectPosting, { as: 'Creator', foreignKey: 'creatorId' });
ProjectPosting.belongsTo(User, { as: 'Creator', foreignKey: 'creatorId' });

// ProjectInvite associations
ProjectPosting.hasMany(ProjectInvite, { foreignKey: 'projectPostingId', onDelete: 'CASCADE' });
ProjectInvite.belongsTo(ProjectPosting, { foreignKey: 'projectPostingId' });
User.hasMany(ProjectInvite, { foreignKey: 'inviteeId' });
ProjectInvite.belongsTo(User, { as: 'Invitee', foreignKey: 'inviteeId' });

// StudyRecommendation associations
User.hasMany(StudyRecommendation, { foreignKey: 'studentId' });
StudyRecommendation.belongsTo(User, { as: 'Student', foreignKey: 'studentId' });

// PeerMatch associations
User.hasMany(PeerMatch, { foreignKey: 'studentId' });
PeerMatch.belongsTo(User, { as: 'Student', foreignKey: 'studentId' });
User.hasMany(PeerMatch, { foreignKey: 'matchedStudentId' });
PeerMatch.belongsTo(User, { as: 'MatchedStudent', foreignKey: 'matchedStudentId' });

// PredictionLog associations
User.hasMany(PredictionLog, { foreignKey: 'userId' });
PredictionLog.belongsTo(User, { as: 'Student', foreignKey: 'userId' });

// MentorshipSession associations
User.hasMany(MentorshipSession, { foreignKey: 'studentId', as: 'StudentSessions' });
User.hasMany(MentorshipSession, { foreignKey: 'mentorId', as: 'MentorSessions' });
MentorshipSession.belongsTo(User, { foreignKey: 'studentId', as: 'Student' });
MentorshipSession.belongsTo(User, { foreignKey: 'mentorId', as: 'Mentor' });

module.exports = {
  User,
  Class,
  Subject,
  Attendance,
  AttendanceRecord,
  LeaveRequest,
  Mark,
  RecoveryAssignment,
  Material,
  CompanyListing,
  PlacementApplication,
  Timetable,
  Notification,
  MentorshipSlot,
  Opportunity,
  TeamRequest,
  MaterialPurchase,
  StudyRequest,
  Holiday,
  Task,
  Message,
  StudyGroup,
  StudyGroupParticipant,
  ForumPost,
  ForumReply,
  LibraryBook,
  BookCheckout,
  Confession,
  MarketplaceItem,
  PlacementInsight,
  MentorProfile,
  PredictionLog,
  Assignment,
  AssignmentSubmission,
  Quiz,
  QuizQuestion,
  QuizAttempt,
  AlumniProfile,
  JobPost,
  JobApplication,
  Announcement,
  BookReview,
  College,
  Transaction,
  PrepHistory,
  StudyGuide,
  ProjectPosting,
  ProjectInvite,
  StudyRecommendation,
  PeerMatch,
  CourseRollConfig,
  MentorshipSession
};
