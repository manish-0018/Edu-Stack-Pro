import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { Award, BookOpen, Check, FileText, Plus, Send, X, Clock, AlertCircle, RefreshCcw } from 'lucide-react';

const RecoveryAssignments = () => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  
  const [newRequest, setNewRequest] = useState({
    subjectId: '',
    title: '',
    description: ''
  });

  const [submissionText, setSubmissionText] = useState('');

  const fetchData = async () => {
    try {
      const assRes = await axios.get('/api/recovery');
      setAssignments(assRes.data);

      if (user.role === 'student') {
        const subRes = await axios.get('/api/subjects');
        setSubjects(subRes.data);
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

  const handleCreateRequest = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/recovery', newRequest);
      setAssignments([res.data, ...assignments]);
      setShowModal(false);
      setNewRequest({ subjectId: '', title: '', description: '' });
      toast.success('Recovery assignment request submitted!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    }
  };

  const handleSubmitWork = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/api/recovery/${selectedAssignment.id}/submit`, { submissionText });
      setAssignments(assignments.map(a => a.id === selectedAssignment.id ? res.data : a));
      setShowSubmissionModal(false);
      setSubmissionText('');
      toast.success('Your work has been submitted for review!');
    } catch (err) {
      toast.error('Failed to submit work');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await axios.put(`/api/recovery/${id}/status`, { status });
      setAssignments(assignments.map(a => a.id === id ? { ...a, status: res.data.status } : a));
      toast.success(`Assignment marked as ${status}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">Loading Recovery Console...</p>
      </div>
    );
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case 'approved': return { color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: <Award className="w-3.5 h-3.5" />, label: 'Approved' };
      case 'rejected': return { color: 'bg-red-100 text-red-800 border-red-200', icon: <X className="w-3.5 h-3.5" />, label: 'Rejected' };
      case 'submitted': return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <FileText className="w-3.5 h-3.5" />, label: 'Under Review' };
      default: return { color: 'bg-amber-100 text-amber-800 border-amber-200', icon: <Clock className="w-3.5 h-3.5" />, label: 'Pending' };
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Professional Hero Section */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/20 rounded-full translate-y-1/3 -translate-x-1/3 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 mb-4 backdrop-blur-sm">
              <RefreshCcw className="w-4 h-4 text-indigo-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-100">Attendance Recovery</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-3 tracking-tight">Recovery Console</h1>
            <p className="text-slate-300 text-lg">
              {user.role === 'student' 
                ? "Missed classes? Submit extra-credit tasks to recover your attendance percentages and get back on track."
                : "Manage and review student extra-credit tasks to grant attendance recovery."}
            </p>
          </div>
          
          {user.role === 'student' && (
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3.5 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl flex items-center gap-2 font-bold transition-all shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:shadow-[0_0_25px_rgba(99,102,241,0.6)] whitespace-nowrap transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" /> Request Task
            </button>
          )}
        </div>
      </div>

      {/* Assignments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {assignments.map((ass) => {
          const status = getStatusConfig(ass.status);
          return (
            <div
              key={ass.id}
              className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex flex-col justify-between overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-5">
                  <span className="text-xs font-black text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-wider border border-slate-200 dark:border-slate-700">
                    {ass.Subject?.code}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize flex items-center gap-1.5 border ${status.color}`}>
                    {status.icon} {status.label}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                  {ass.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-5 line-clamp-3 leading-relaxed">
                  {ass.description}
                </p>
                
                {user.role !== 'student' && (
                  <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-50 dark:border-dark-border">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold text-xs">
                      {ass.Student?.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">{ass.Student?.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{ass.Student?.email}</p>
                    </div>
                  </div>
                )}

                {ass.submissionText && (
                  <div className="mt-4 bg-slate-50 dark:bg-dark-bg p-4 rounded-xl text-sm border border-slate-100 dark:border-dark-border">
                    <strong className="text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-2 text-xs uppercase tracking-wider">
                      <FileText className="w-3.5 h-3.5" /> Submission
                    </strong>
                    <p className="text-slate-600 dark:text-slate-400 max-h-24 overflow-y-auto custom-scrollbar italic">"{ass.submissionText}"</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50/50 dark:bg-dark-bg/50 border-t border-gray-100 dark:border-dark-border">
                {user.role === 'student' && ass.status === 'pending' && (
                  <button
                    onClick={() => {
                      setSelectedAssignment(ass);
                      setShowSubmissionModal(true);
                    }}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm"
                  >
                    <Send className="w-4 h-4" /> Submit Work
                  </button>
                )}

                {user.role === 'student' && ass.status === 'approved' && (
                  <div className="flex items-center justify-center gap-2 text-sm font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 py-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900/50">
                    <Award className="w-5 h-5" /> Credits Awarded (+{ass.boostCount})
                  </div>
                )}

                {user.role !== 'student' && ass.status === 'submitted' && (
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleUpdateStatus(ass.id, 'approved')}
                      className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-transform transform hover:scale-105 shadow-sm shadow-emerald-500/20"
                    >
                      <Check className="w-4 h-4" /> Approve
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(ass.id, 'rejected')}
                      className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2 transition-transform transform hover:scale-105 shadow-sm shadow-red-500/20"
                    >
                      <X className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
                
                {/* Visual placeholder for empty action area */}
                {((user.role === 'student' && ['submitted', 'rejected'].includes(ass.status)) || 
                  (user.role !== 'student' && ass.status !== 'submitted')) && (
                  <div className="py-2.5 text-center text-xs font-medium text-gray-400 uppercase tracking-widest">
                    {user.role === 'student' ? 'Awaiting Review' : 'No Action Required'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {assignments.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm">
          <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 border-8 border-white dark:border-dark-card shadow-sm">
            <BookOpen className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No Assignments Yet</h3>
          <p className="text-gray-500 dark:text-gray-400 max-w-sm">
            {user.role === 'student' 
              ? "You haven't requested any attendance recovery tasks. Keep your attendance above the threshold!" 
              : "There are no pending recovery assignments for you to review at this time."}
          </p>
        </div>
      )}

      {/* Request Task Modal (Student) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl w-full max-w-lg border border-gray-100 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                <Plus className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Request Task</h2>
            </div>
            
            <form onSubmit={handleCreateRequest} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
                <select
                  required
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  value={newRequest.subjectId}
                  onChange={(e) => setNewRequest({ ...newRequest, subjectId: e.target.value })}
                >
                  <option value="">Select subject...</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Topic / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DSA Stack Implementation Notes"
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
                  value={newRequest.title}
                  onChange={(e) => setNewRequest({ ...newRequest, title: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Explanation / Request Reason</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Explain why you missed class and what you will study/submit to recover credit."
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none custom-scrollbar"
                  value={newRequest.description}
                  onChange={(e) => setNewRequest({ ...newRequest, description: e.target.value })}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-gray-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2.5 font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-transform transform hover:-translate-y-0.5 shadow-md shadow-indigo-500/30">
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submission Modal (Student) */}
      {showSubmissionModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl w-full max-w-lg border border-gray-100 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center">
                <Send className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Submit Work</h2>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 font-medium">
              Enter your written solution or paste a link to your slides/solution documentation for the instructor to review.
            </p>
            
            <form onSubmit={handleSubmitWork} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5">Your Submission</label>
                <textarea
                  required
                  rows={6}
                  placeholder="Type your notes summary or solution links here..."
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all outline-none custom-scrollbar"
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 mt-2 border-t border-gray-100 dark:border-slate-800">
                <button type="button" onClick={() => setShowSubmissionModal(false)} className="px-5 py-2.5 font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-transform transform hover:-translate-y-0.5 shadow-md shadow-emerald-500/30">
                  Submit Work
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
