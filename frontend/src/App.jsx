import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import GuardianDashboard from './pages/GuardianDashboard';
import ManageUsers from './pages/ManageUsers';
import ManageClasses from './pages/ManageClasses';
import ManageSubjects from './pages/ManageSubjects';
import MarkAttendance from './pages/MarkAttendance';
import ViewAttendance from './pages/ViewAttendance';
import LeaveRequests from './pages/LeaveRequests';
import ManageMarks from './pages/ManageMarks';
import RecoveryAssignments from './pages/RecoveryAssignments';
import Placements from './pages/Placements';
import Mentorship from './pages/Mentorship';
import Opportunities from './pages/Opportunities';
import NotesMarketplace from './pages/NotesMarketplace';
import StudyBuddies from './pages/StudyBuddies';
import Workspace from './pages/Workspace';
import Forums from './pages/Forums';
import ResourceHub from './pages/ResourceHub';
import Library from './pages/Library';
import Assignments from './pages/Assignments';
import Quizzes from './pages/Quizzes';
import Portfolio from './pages/Portfolio';
import Announcements from './pages/Announcements';
import MentorDashboard from './pages/MentorDashboard';
import PremiumUpgrade from './pages/PremiumUpgrade';
import StudentAdvising from './pages/StudentAdvising';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/dashboard" />;
  return children;
};

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/dashboard" />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/dashboard" />} />
          <Route path="dashboard" element={
            <ProtectedRoute>
              {user?.role === 'guardian' ? (
                <GuardianDashboard />
              ) : user?.role === 'mentor' ? (
                <MentorDashboard />
              ) : (
                <Dashboard />
              )}
            </ProtectedRoute>
          } />
          <Route path="users" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><ManageUsers /></ProtectedRoute>} />
          <Route path="classes" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><ManageClasses /></ProtectedRoute>} />
          <Route path="subjects" element={<ProtectedRoute allowedRoles={['admin', 'teacher']}><ManageSubjects /></ProtectedRoute>} />
          <Route path="attendance/mark" element={<ProtectedRoute allowedRoles={['teacher']}><MarkAttendance /></ProtectedRoute>} />
          <Route path="attendance/view" element={<ProtectedRoute><ViewAttendance /></ProtectedRoute>} />
          <Route path="leave" element={<ProtectedRoute><LeaveRequests /></ProtectedRoute>} />
          <Route path="marks" element={<ProtectedRoute allowedRoles={['teacher']}><ManageMarks /></ProtectedRoute>} />
          <Route path="recovery" element={<ProtectedRoute><RecoveryAssignments /></ProtectedRoute>} />
          <Route path="placements" element={<ProtectedRoute><Placements /></ProtectedRoute>} />
          <Route path="mentorship" element={<ProtectedRoute allowedRoles={['admin', 'student']}><Mentorship /></ProtectedRoute>} />
          <Route path="opportunities" element={<ProtectedRoute allowedRoles={['admin', 'student']}><Opportunities /></ProtectedRoute>} />
          <Route path="store" element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}><NotesMarketplace /></ProtectedRoute>} />
          <Route path="buddies" element={<ProtectedRoute allowedRoles={['student']}><StudyBuddies /></ProtectedRoute>} />
          <Route path="forums" element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}><Forums /></ProtectedRoute>} />
          <Route path="resources" element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}><ResourceHub /></ProtectedRoute>} />
          <Route path="library" element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'guardian']}><Library /></ProtectedRoute>} />
          <Route path="workspace/:type/:id" element={<ProtectedRoute><Workspace /></ProtectedRoute>} />
          <Route path="assignments" element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}><Assignments /></ProtectedRoute>} />
          <Route path="quizzes" element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'student']}><Quizzes /></ProtectedRoute>} />
          <Route path="portfolio" element={<ProtectedRoute allowedRoles={['student']}><Portfolio /></ProtectedRoute>} />
          <Route path="announcements" element={<ProtectedRoute allowedRoles={['admin', 'teacher', 'student', 'mentor']}><Announcements /></ProtectedRoute>} />
          <Route path="advising" element={<ProtectedRoute allowedRoles={['student']}><StudentAdvising /></ProtectedRoute>} />
          <Route path="upgrade" element={<ProtectedRoute><PremiumUpgrade /></ProtectedRoute>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
