import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Users, 
  AlertTriangle, 
  Calendar, 
  Check, 
  X, 
  FileText, 
  Plus, 
  Mail, 
  ChevronRight, 
  Loader2, 
  CheckCircle,
  MessageSquare,
  BookOpen
} from 'lucide-react';
import { toast } from 'react-toastify';

const MentorDashboard = () => {
  const [mentees, setMentees] = useState([]);
  const [attendanceShortages, setAttendanceShortages] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('mentees');

  // Counseling form state
  const [selectedStudent, setSelectedStudent] = useState('');
  const [notes, setNotes] = useState('');
  const [actionItems, setActionItems] = useState('');
  const [sessionStatus, setSessionStatus] = useState('completed');
  const [submittingSession, setSubmittingSession] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [menteesRes, shortageRes, leavesRes, sessionsRes] = await Promise.all([
        axios.get('/api/mentor/students'),
        axios.get('/api/mentor/shortage'),
        axios.get('/api/mentor/leaves'),
        axios.get('/api/mentor/sessions')
      ]);

      setMentees(menteesRes.data);
      setAttendanceShortages(shortageRes.data);
      setLeaves(leavesRes.data);
      setSessions(sessionsRes.data);
    } catch (err) {
      toast.error('Failed to load mentor dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateLeave = async (id, status) => {
    const toastId = toast.loading(`Updating leave status to ${status}...`);
    try {
      await axios.put(`/api/mentor/leaves/${id}`, { status });
      toast.update(toastId, { render: `Leave request ${status} successfully!`, type: 'success', isLoading: false, autoClose: 3000 });
      // Refresh
      const leavesRes = await axios.get('/api/mentor/leaves');
      setLeaves(leavesRes.data);
      // Refresh mentees & shortages (in case attendance changed)
      const [menteesRes, shortageRes] = await Promise.all([
        axios.get('/api/mentor/students'),
        axios.get('/api/mentor/shortage')
      ]);
      setMentees(menteesRes.data);
      setAttendanceShortages(shortageRes.data);
    } catch (err) {
      toast.update(toastId, { render: 'Failed to update leave request.', type: 'error', isLoading: false, autoClose: 3000 });
    }
  };

  const handleSendWarning = async (studentId, email) => {
    const toastId = toast.loading(`Sending warning to ${email}...`);
    try {
      await axios.post('/api/notifications', {
        userId: studentId,
        title: '⚠️ Attendance Shortage Alert',
        message: 'Your overall attendance is currently below 75%. Please meet your course mentor immediately to avoid examination debarment.',
        type: 'alert'
      });
      toast.update(toastId, { render: 'Attendance shortage warning sent!', type: 'success', isLoading: false, autoClose: 3000 });
    } catch (err) {
      toast.update(toastId, { render: 'Failed to send warning.', type: 'error', isLoading: false, autoClose: 3000 });
    }
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !notes) {
      toast.error('Please select a student and provide counseling notes.');
      return;
    }

    setSubmittingSession(true);
    try {
      const res = await axios.post('/api/mentor/sessions', {
        studentId: selectedStudent,
        notes,
        actionItems,
        status: sessionStatus
      });
      toast.success('Mentorship counseling session logged successfully!');
      
      // Reset form
      setSelectedStudent('');
      setNotes('');
      setActionItems('');
      setSessionStatus('completed');

      // Refresh sessions
      const sessionsRes = await axios.get('/api/mentor/sessions');
      setSessions(sessionsRes.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to log counseling session');
    } finally {
      setSubmittingSession(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Loading Mentor Portal...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Portal Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl text-white shadow-xl border border-indigo-950/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
              <Users className="w-8 h-8 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Mentor Advising Portal</h2>
              <p className="text-sm text-indigo-200 mt-1">
                Strict course boundaries activated. Manage student attendance alerts, leaves, and advising logs.
              </p>
            </div>
          </div>
          <div className="flex gap-3 text-xs shrink-0">
            <span className="px-3.5 py-1.5 bg-white/10 rounded-xl border border-white/10 font-bold">
              Students: {mentees.length}
            </span>
            <span className="px-3.5 py-1.5 bg-rose-500/20 text-rose-300 rounded-xl border border-rose-500/30 font-bold">
              Shortages: {attendanceShortages.length}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-gray-200 dark:border-dark-border gap-2">
        <button
          onClick={() => setActiveTab('mentees')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'mentees'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          }`}
        >
          My Mentees ({mentees.length})
        </button>
        <button
          onClick={() => setActiveTab('shortage')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'shortage'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          }`}
        >
          Attendance Alerts ({attendanceShortages.length})
        </button>
        <button
          onClick={() => setActiveTab('leaves')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'leaves'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          }`}
        >
          Leave Desk ({leaves.length})
        </button>
        <button
          onClick={() => setActiveTab('sessions')}
          className={`px-5 py-3 text-sm font-semibold border-b-2 transition-all ${
            activeTab === 'sessions'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          }`}
        >
          Advising Sessions ({sessions.length})
        </button>
      </div>

      {/* Main Tab Views */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 shadow-sm">
        
        {/* TAB 1: MENTEES LIST */}
        {activeTab === 'mentees' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Registered Course Students</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-dark-border text-gray-400 text-xs font-bold uppercase">
                    <th className="py-3 px-4">Roll No</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Attendance</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-border/40">
                  {mentees.map((mentee) => (
                    <tr key={mentee.id} className="hover:bg-gray-50/50 dark:hover:bg-dark-bg/20">
                      <td className="py-3.5 px-4 font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">
                        {mentee.rollNo || 'N/A'}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">{mentee.name}</td>
                      <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400">{mentee.email}</td>
                      <td className="py-3.5 px-4 font-semibold text-gray-500">{mentee.course}</td>
                      <td className="py-3.5 px-4 font-black text-sm">
                        <span className={mentee.attendancePercentage >= 75 ? 'text-green-500' : 'text-rose-500'}>
                          {mentee.attendancePercentage}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        {mentee.attendancePercentage >= 75 ? (
                          <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full uppercase">Eligible</span>
                        ) : (
                          <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 text-[10px] font-bold rounded-full uppercase">Shortage</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: ATTENDANCE SHORTAGES */}
        {activeTab === 'shortage' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="text-rose-500 w-5 h-5 animate-pulse" />
              Students Below 75% Attendance Requirement
            </h3>
            {attendanceShortages.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold">Excellent! No students have attendance shortage.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {attendanceShortages.map((student) => (
                  <div key={student.id} className="border border-rose-100 dark:border-rose-950/20 bg-rose-50/10 dark:bg-rose-950/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900 dark:text-white">{student.name}</h4>
                        <span className="text-[10px] font-mono bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded font-bold">
                          Roll: {student.rollNo || 'N/A'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        Email: {student.email} | Current Attendance: <strong className="text-rose-500">{student.attendancePercentage}%</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => handleSendWarning(student.id, student.email)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                    >
                      <Mail className="w-3.5 h-3.5" /> Send Shortage Alert
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: LEAVE DESK */}
        {activeTab === 'leaves' && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Leave Requests Awaiting Review</h3>
            {leaves.length === 0 ? (
              <div className="py-12 text-center text-gray-400">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
                <p className="text-sm font-semibold">No pending leave requests to process.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {leaves.map((leave) => (
                  <div key={leave.id} className="border border-gray-100 dark:border-dark-border/40 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 dark:text-white">{leave.Student?.name}</h4>
                          <span className="text-[10px] bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded uppercase font-bold">
                            {leave.type} Leave
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Roll: {leave.Student?.rollNo} | Program: {leave.Student?.course}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateLeave(leave.id, 'approved')}
                          className="p-1.5 bg-green-500/10 hover:bg-green-500 text-green-600 hover:text-white rounded-lg transition-all"
                          title="Approve Leave"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateLeave(leave.id, 'rejected')}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white rounded-lg transition-all"
                          title="Reject Leave"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-dark-bg/25 p-3.5 rounded-xl border border-gray-100 dark:border-dark-border/10 text-xs text-gray-600 dark:text-gray-300">
                      <div className="font-bold text-gray-400 uppercase tracking-wider mb-1">Reason:</div>
                      {leave.reason}
                    </div>
                    <div className="flex flex-wrap items-center justify-between text-xs text-gray-400 gap-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Dates: {new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}</span>
                      </div>
                      {leave.certificateUrl && (
                        <a
                          href={leave.certificateUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-indigo-500 font-bold hover:underline flex items-center gap-1"
                        >
                          <BookOpen className="w-3.5 h-3.5" /> View Medical Certificate
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: MENTORSHIP SESSION LOGS & ENTRY FORM */}
        {activeTab === 'sessions' && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Left side: Logging Form */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <Plus className="w-5 h-5 text-indigo-500" />
                Log Counseling Session
              </h3>
              
              <form onSubmit={handleAddSession} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Select Student</label>
                  <select
                    value={selectedStudent}
                    onChange={(e) => setSelectedStudent(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="">-- Choose student --</option>
                    {mentees.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.rollNo || 'N/A'})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Discussion Notes</label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Discussed academic performance, reasons for leave request/attendance deficit, etc."
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Action Items / Advice</label>
                  <textarea
                    rows={2}
                    value={actionItems}
                    onChange={(e) => setActionItems(e.target.value)}
                    placeholder="E.g., Attend make-up classes, submit pending assignments."
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-indigo-500 transition-colors resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Status</label>
                    <select
                      value={sessionStatus}
                      onChange={(e) => setSessionStatus(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-indigo-500 transition-colors"
                    >
                      <option value="completed">Completed</option>
                      <option value="scheduled">Scheduled</option>
                      <option value="follow-up">Follow-Up Required</option>
                    </select>
                  </div>
                  
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={submittingSession}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-xl text-xs font-bold tracking-wide transition-all shadow-md"
                    >
                      {submittingSession ? 'Saving...' : 'Save Advising Log'}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Right side: Session List */}
            <div className="lg:col-span-3 space-y-4 border-t lg:border-t-0 lg:border-l border-gray-150 dark:border-dark-border lg:pl-8 pt-6 lg:pt-0">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5">
                <FileText className="w-5 h-5 text-indigo-500" />
                Past Counseling Logs
              </h3>
              
              {sessions.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-xs">No counseling logs have been saved yet.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {sessions.map((sess) => (
                    <div key={sess.id} className="border border-gray-100 dark:border-dark-border/40 rounded-xl p-4 bg-gray-50/30 space-y-3 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">
                            Student: {sess.Student?.name}
                          </h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            Roll: {sess.Student?.rollNo} | Date: {new Date(sess.sessionDate).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-2 py-0.5 rounded font-extrabold uppercase text-[9px] ${
                          sess.status === 'completed' 
                            ? 'bg-green-500/10 text-green-500' 
                            : sess.status === 'follow-up' 
                            ? 'bg-amber-500/10 text-amber-500' 
                            : 'bg-indigo-500/10 text-indigo-500'
                        }`}>
                          {sess.status}
                        </span>
                      </div>
                      
                      <div className="text-gray-600 dark:text-gray-300 bg-white dark:bg-dark-bg p-2.5 rounded border border-gray-100 dark:border-dark-border/10 leading-relaxed">
                        {sess.notes}
                      </div>

                      {sess.actionItems && (
                        <div className="text-gray-500 dark:text-gray-400 pl-2 border-l-2 border-amber-400">
                          <strong className="text-slate-800 dark:text-slate-200">Advice:</strong> {sess.actionItems}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MentorDashboard;
