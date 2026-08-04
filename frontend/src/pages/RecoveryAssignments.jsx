import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { 
  Award, 
  BookOpen, 
  Check, 
  FileText, 
  Plus, 
  Send, 
  X, 
  Clock, 
  AlertCircle, 
  RefreshCcw, 
  Calendar, 
  Sliders, 
  Paperclip, 
  MessageSquare,
  CreditCard,
  UserCheck,
  CheckSquare
} from 'lucide-react';

const RecoveryAssignments = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals state
  const [showCondonationModal, setShowCondonationModal] = useState(false);
  const [showRemedialModal, setShowRemedialModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  // Active UI tab: 'remedial' or 'condonation'
  const [activeSubTab, setActiveSubTab] = useState('remedial');
  
  const [selectedSession, setSelectedSession] = useState(null);
  const [reviewStatus, setReviewStatus] = useState('approved');
  const [feedbackText, setFeedbackText] = useState('');

  // Student Condonation Request Form State
  const [condonationForm, setCondonationForm] = useState({
    subjectId: '',
    title: '',
    description: '',
    absenceReason: 'Medical Leave',
    absenceDate: new Date().toISOString().split('T')[0],
    hoursMissed: '2',
    documentUrl: '',
    feePaid: '10.00'
  });

  // Teacher Remedial Class Scheduler Form State
  const [remedialForm, setRemedialForm] = useState({
    studentId: '',
    subjectId: '',
    title: '',
    description: '',
    absenceDate: new Date().toISOString().split('T')[0],
    hoursMissed: '2'
  });

  const fetchData = async () => {
    try {
      const sessRes = await axios.get('/api/recovery');
      setSessions(sessRes.data);

      if (user.role === 'student') {
        const subRes = await axios.get('/api/subjects');
        setSubjects(subRes.data);
      } else {
        const subRes = await axios.get('/api/subjects');
        setSubjects(subRes.data);
        const usersRes = await axios.get('/api/users');
        setStudents(usersRes.data.filter(u => u.role === 'student'));
      }
    } catch (err) {
      toast.error('Failed to load recovery details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateCondonation = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...condonationForm,
        sessionType: 'Condonation Petition',
        hoursMissed: parseInt(condonationForm.hoursMissed),
        feePaid: parseFloat(condonationForm.feePaid)
      };
      await axios.post('/api/recovery', payload);
      setShowCondonationModal(false);
      setCondonationForm({ 
        subjectId: '', 
        title: '', 
        description: '', 
        absenceReason: 'Medical Leave', 
        absenceDate: new Date().toISOString().split('T')[0],
        hoursMissed: '2',
        documentUrl: '',
        feePaid: '10.00'
      });
      toast.success('Condonation petition submitted successfully for Dean auditing.');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit petition');
    }
  };

  const handleCreateRemedial = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...remedialForm,
        sessionType: 'Remedial Class',
        hoursMissed: parseInt(remedialForm.hoursMissed)
      };
      await axios.post('/api/recovery', payload);
      setShowRemedialModal(false);
      setRemedialForm({ 
        studentId: '',
        subjectId: '',
        title: '',
        description: '',
        absenceDate: new Date().toISOString().split('T')[0],
        hoursMissed: '2'
      });
      toast.success('Remedial class session scheduled successfully!');
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to schedule remedial session');
    }
  };

  const handleUpdateRemedialStatus = async (sessionId, rStatus) => {
    try {
      await axios.put(`/api/recovery/${sessionId}/status`, { remedialStatus: rStatus });
      toast.success(`Session status marked as ${rStatus}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleOpenReview = (session, status) => {
    setSelectedSession(session);
    setReviewStatus(status);
    setFeedbackText('');
    setShowReviewModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/recovery/${selectedSession.id}/status`, { 
        status: reviewStatus,
        reviewFeedback: feedbackText
      });
      setShowReviewModal(false);
      setFeedbackText('');
      toast.success(`Condonation petition marked as ${reviewStatus}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to audit petition');
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved': return { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: <Award className="w-3.5 h-3.5" />, label: 'Approved (Dean Condoned)' };
      case 'rejected': return { color: 'bg-red-100 text-red-800 border-red-200', icon: <X className="w-3.5 h-3.5" />, label: 'Rejected' };
      default: return { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: <Clock className="w-3.5 h-3.5" />, label: 'Dean Auditing' };
    }
  };

  const filteredSessions = sessions.filter(s => s.sessionType === 'Remedial Class');

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading Remediation Dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Professional Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl text-indigo-500" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/10 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl text-emerald-500" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 mb-4 backdrop-blur-sm">
              <RefreshCcw className="w-4 h-4 text-indigo-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-100">Academic Remediation Portal</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">Recovery & Remedial Registry</h1>
            <p className="text-slate-300 text-sm md:text-base leading-relaxed">
              {user.role === 'student' 
                ? "Attend scheduled remedial Saturday make-up sessions or submit a formal Dean's Condonation petition for marginal shortages."
                : "Schedule Saturday remedial tutorial classes or audit official condonation petitions and vouchers."}
            </p>
          </div>
          
          <div className="flex gap-3 whitespace-nowrap">
            {user.role === 'teacher' && (
              <button
                onClick={() => setShowRemedialModal(true)}
                className="px-6 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl flex items-center gap-2 font-bold transition-all shadow-lg shadow-indigo-500/20 transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" /> Schedule Saturday Remedial
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSessions.map((sess) => {
          const status = getStatusConfig(sess.status);
          return (
            <div
              key={sess.id}
              className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex flex-col justify-between overflow-hidden group hover:shadow-md transition-all duration-200"
            >
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                    {sess.Subject?.code}
                  </span>
                  
                  {sess.sessionType === 'Condonation Petition' ? (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${status.color}`}>
                      {status.icon} {status.label}
                    </span>
                  ) : (
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 border ${
                      sess.remedialStatus === 'Attended'
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : sess.remedialStatus === 'Absent'
                        ? 'bg-red-100 text-red-800 border-red-200'
                        : sess.remedialStatus === 'Checked-In'
                        ? 'bg-amber-100 text-amber-800 border-amber-200 animate-pulse'
                        : 'bg-blue-100 text-blue-800 border-blue-200'
                    }`}>
                      <UserCheck className="w-3.5 h-3.5" /> {sess.remedialStatus === 'Checked-In' ? 'Checked-In (Pending)' : sess.remedialStatus}
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {sess.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 font-medium leading-relaxed">
                    {sess.description}
                  </p>
                </div>

                {/* Specific Session Properties */}
                <div className="p-3 bg-gray-50 dark:bg-slate-800/40 rounded-xl space-y-2 border border-gray-100 dark:border-slate-800/40 text-xs">
                  {sess.sessionType === 'Condonation Petition' ? (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-medium">Petition Type:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{sess.absenceReason}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-medium">Absence Date:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{sess.absenceDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-medium">Condonation Fee:</span>
                        <span className="font-bold text-emerald-600">${parseFloat(sess.feePaid).toFixed(2)}</span>
                      </div>
                      {sess.documentUrl && (
                        <div className="flex justify-between pt-1.5 border-t border-gray-100 dark:border-slate-800/50">
                          <span className="text-gray-400 font-medium">Voucher Reference:</span>
                          <span className="font-bold text-indigo-500 hover:underline flex items-center gap-1 cursor-pointer">
                            <Paperclip className="w-3 h-3" /> {sess.documentUrl}
                          </span>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-medium">Class Type:</span>
                        <span className="font-bold text-indigo-600">Extra Tutorial Session</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-medium">Scheduled Date:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{sess.absenceDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400 font-medium">Duration:</span>
                        <span className="font-bold text-slate-700 dark:text-slate-300">{sess.hoursMissed} Hour(s)</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Credit boost notification inside the card */}
                {((sess.status === 'approved' && sess.sessionType === 'Condonation Petition') ||
                  (sess.remedialStatus === 'Attended' && sess.sessionType === 'Remedial Class')) && (
                  <div className="mt-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/30 p-2.5 rounded-xl flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-400">
                      Credit Granted: +{sess.hoursMissed} lectures successfully credited to your profile!
                    </span>
                  </div>
                )}

                {user.role !== 'student' && (
                  <div className="flex items-center gap-3 pt-3 border-t border-gray-50 dark:border-dark-border text-xs">
                    <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold shrink-0">
                      {sess.Student?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white leading-none">{sess.Student?.name}</p>
                      <p className="text-[10px] text-gray-400 mt-0.5">{sess.Student?.email}</p>
                    </div>
                  </div>
                )}

                {/* Audit remarks feedback banner */}
                {sess.reviewFeedback && (
                  <div className={`p-3 rounded-xl border text-xs flex gap-2 ${
                    sess.status === 'approved' 
                      ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800 dark:bg-emerald-950/10 dark:border-emerald-900/30 dark:text-emerald-400'
                      : 'bg-rose-50/50 border-rose-100 text-rose-800 dark:bg-rose-950/10 dark:border-rose-900/30 dark:text-rose-400'
                  }`}>
                    <MessageSquare className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold uppercase text-[9px] block tracking-wider mb-0.5">Dean Audit Notes</span>
                      <p className="font-medium leading-relaxed">"{sess.reviewFeedback}"</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Panels */}
              <div className="p-4 bg-gray-50/50 dark:bg-dark-bg/50 border-t border-gray-100 dark:border-dark-border">
                {/* Student marking remedial status */}
                {user.role === 'student' && sess.sessionType === 'Remedial Class' && sess.remedialStatus === 'Scheduled' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateRemedialStatus(sess.id, 'Checked-In')}
                      className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all"
                    >
                      Check-In (Remedial Session)
                    </button>
                  </div>
                )}

                {/* Teacher/Admin auditing remedial attendance */}
                {user.role !== 'student' && sess.sessionType === 'Remedial Class' && (sess.remedialStatus === 'Scheduled' || sess.remedialStatus === 'Checked-In') && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateRemedialStatus(sess.id, 'Attended')}
                      className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      Verify Attendance
                    </button>
                    <button
                      onClick={() => handleUpdateRemedialStatus(sess.id, 'Absent')}
                      className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      Mark Absent
                    </button>
                  </div>
                )}

                {user.role !== 'student' && sess.sessionType === 'Remedial Class' && sess.remedialStatus !== 'Scheduled' && sess.remedialStatus !== 'Checked-In' && (
                  <div className="py-1.5 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    Remedial Log: {sess.remedialStatus}
                  </div>
                )}

                {/* Dean auditing Condonation Petition - Restricted to Admin Role only */}
                {user.role === 'admin' && sess.sessionType === 'Condonation Petition' && sess.status === 'pending' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleOpenReview(sess, 'approved')}
                      className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-transform transform hover:scale-[1.02]"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve Condonation
                    </button>
                    <button
                      onClick={() => handleOpenReview(sess, 'rejected')}
                      className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-transform transform hover:scale-[1.02]"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                )}

                {/* Non-actionable states placeholders */}
                {((user.role === 'student' && sess.sessionType === 'Condonation Petition') ||
                  (user.role === 'student' && sess.sessionType === 'Remedial Class' && sess.remedialStatus !== 'Scheduled') ||
                  (user.role !== 'student' && sess.sessionType === 'Condonation Petition' && sess.status !== 'pending')) && (
                  <div className="py-1.5 text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {sess.sessionType === 'Condonation Petition' 
                      ? 'Dean Audit Processed' 
                      : sess.remedialStatus === 'Checked-In'
                      ? '⏳ Checked-In (Awaiting Verification)'
                      : 'Remedial Session Logged'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filteredSessions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 border-8 border-white dark:border-dark-card shadow-sm">
            <BookOpen className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Session Logs Found</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm text-sm">
            {user.role === 'student' 
              ? `You do not have any logs in the ${activeSubTab} section. Keep your attendance above the mandatory 75% limit!` 
              : `There are no scheduled items in the ${activeSubTab} section to manage.`}
          </p>
        </div>
      )}

      {/* Condonation Request Modal (Student) */}
      {showCondonationModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl w-full max-w-xl border border-gray-100 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Condonation Petition</h2>
              </div>
              <button onClick={() => setShowCondonationModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleCreateCondonation} className="space-y-4 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Subject</label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm font-semibold"
                    value={condonationForm.subjectId}
                    onChange={(e) => setCondonationForm({ ...condonationForm, subjectId: e.target.value })}
                  >
                    <option value="">Select subject...</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Absence Condonation Reason</label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm font-semibold"
                    value={condonationForm.absenceReason}
                    onChange={(e) => setCondonationForm({ ...condonationForm, absenceReason: e.target.value })}
                  >
                    <option value="Medical Leave">Medical Condonation (Leave)</option>
                    <option value="OD (Official College Duty)">OD (Official University Duty)</option>
                    <option value="Hackathon / Tech Rep">Hackathon / Technical Rep</option>
                    <option value="Family Emergency">Family Emergency</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Date of Absence</label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm"
                    value={condonationForm.absenceDate}
                    onChange={(e) => setCondonationForm({ ...condonationForm, absenceDate: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Lectures Missed</label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm font-semibold"
                    value={condonationForm.hoursMissed}
                    onChange={(e) => setCondonationForm({ ...condonationForm, hoursMissed: e.target.value })}
                  >
                    <option value="1">1 Hour</option>
                    <option value="2">2 Hours</option>
                    <option value="3">3 Hours</option>
                    <option value="4">4 Hours</option>
                    <option value="5">5 Hours</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Condonation Fee Voucher ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm font-bold text-indigo-600"
                    value={condonationForm.feePaid}
                    onChange={(e) => setCondonationForm({ ...condonationForm, feePaid: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Voucher Reference / Bank Receipt</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="e.g. medical_proof_410.pdf, trans_receipt.png"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm"
                      value={condonationForm.documentUrl}
                      onChange={(e) => setCondonationForm({ ...condonationForm, documentUrl: e.target.value })}
                    />
                    <Paperclip className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Voucher / Transaction ID</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. TXN-9830217482"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm font-mono font-bold"
                  value={condonationForm.title}
                  onChange={(e) => setCondonationForm({ ...condonationForm, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Petition Explanation Details</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide details about your absence and explain the attached condonation slip."
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm custom-scrollbar"
                  value={condonationForm.description}
                  onChange={(e) => setCondonationForm({ ...condonationForm, description: e.target.value })}
                />
              </div>

              <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl text-xs text-blue-600 dark:text-blue-400 font-bold flex gap-2 items-center">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Audited condonation petitions will restore +{condonationForm.hoursMissed} hours back into your subject attendance registers.</span>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowCondonationModal(false)} className="px-5 py-2.5 font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-transform transform hover:-translate-y-0.5 shadow-md shadow-indigo-500/30">
                  Submit Petition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Remedial Class Schedule Modal (Teacher) */}
      {showRemedialModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl w-full max-w-xl border border-gray-100 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">Schedule Remedial Tutorial</h2>
              </div>
              <button onClick={() => setShowRemedialModal(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <form onSubmit={handleCreateRemedial} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Select Student</label>
                <select
                  required
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm font-semibold"
                  value={remedialForm.studentId}
                  onChange={(e) => setRemedialForm({ ...remedialForm, studentId: e.target.value })}
                >
                  <option value="">Select a student...</option>
                  {students.map(st => (
                    <option key={st.id} value={st.id}>{st.name} ({st.email})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Subject</label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm font-semibold"
                    value={remedialForm.subjectId}
                    onChange={(e) => setRemedialForm({ ...remedialForm, subjectId: e.target.value })}
                  >
                    <option value="">Select subject...</option>
                    {subjects.map(s => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Duration (Hours)</label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm font-semibold"
                    value={remedialForm.hoursMissed}
                    onChange={(e) => setRemedialForm({ ...remedialForm, hoursMissed: e.target.value })}
                  >
                    <option value="1">1 Hour Make-up</option>
                    <option value="2">2 Hours Make-up</option>
                    <option value="3">3 Hours Make-up</option>
                    <option value="4">4 Hours Make-up</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Scheduled Session Date</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm"
                  value={remedialForm.absenceDate}
                  onChange={(e) => setRemedialForm({ ...remedialForm, absenceDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Remedial Title / Topic</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Maths Tutorial Make-up Room IV"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm"
                  value={remedialForm.title}
                  onChange={(e) => setRemedialForm({ ...remedialForm, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Remedial Description & Syllabus Tasks</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Specify what curriculum topics the student must review or complete during this session."
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm custom-scrollbar"
                  value={remedialForm.description}
                  onChange={(e) => setRemedialForm({ ...remedialForm, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowRemedialModal(false)} className="px-5 py-2.5 font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-transform transform hover:-translate-y-0.5 shadow-md shadow-indigo-500/30">
                  Schedule Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dean Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl w-full max-w-lg border border-gray-100 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-2 text-left">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${reviewStatus === 'approved' ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-rose-100 dark:bg-rose-900/50'}`}>
                {reviewStatus === 'approved' ? <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" /> : <X className="w-5 h-5 text-rose-600 dark:text-rose-400" />}
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                {reviewStatus === 'approved' ? 'Approve Condonation' : 'Reject Condonation'}
              </h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium text-left">
              Submit formal audit remarks/decisions for the student condonation petition.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-5 text-left">
              {selectedSession?.feePaid && (
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/40 text-xs space-y-1">
                  <span className="font-bold text-gray-400 uppercase tracking-wider block mb-1">Financial & Document Audit</span>
                  <div className="flex justify-between"><span className="text-gray-400">Transaction ID:</span> <span className="font-mono font-bold">{selectedSession.title}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Fee Audited:</span> <span className="font-bold text-emerald-600">${parseFloat(selectedSession.feePaid).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Receipt Voucher:</span> <span className="font-bold text-indigo-600">{selectedSession.documentUrl}</span></div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1.5">Dean Audit Comments / Feedback</label>
                <textarea
                  required
                  rows={4}
                  placeholder={reviewStatus === 'approved' ? "e.g. Transaction verified. Condonation approved for missed hours." : "e.g. Rejected due to invalid bank transaction slip reference."}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none text-sm custom-scrollbar"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowReviewModal(false)} className="px-5 py-2.5 font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`px-5 py-2.5 text-white font-bold rounded-xl transition-transform transform hover:-translate-y-0.5 shadow-md ${reviewStatus === 'approved' ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/30' : 'bg-rose-600 hover:bg-rose-700 shadow-rose-500/30'}`}
                >
                  Submit Audit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecoveryAssignments;
