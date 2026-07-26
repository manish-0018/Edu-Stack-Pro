import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Briefcase, Plus, X, Search, MapPin, Clock, Tag, ExternalLink, Send, Filter, CheckCircle } from 'lucide-react';

const typeColors = {
  fulltime: 'bg-blue-100 text-blue-700',
  internship: 'bg-green-100 text-green-700',
  parttime: 'bg-orange-100 text-orange-700',
  contract: 'bg-purple-100 text-purple-700',
};

const statusColors = {
  applied: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-yellow-100 text-yellow-700',
  rejected: 'bg-red-100 text-red-700',
  hired: 'bg-green-100 text-green-700',
};

const JobBoard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';
  const [jobs, setJobs] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [applyModal, setApplyModal] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [tab, setTab] = useState('browse');
  const [form, setForm] = useState({ title: '', company: '', description: '', location: '', salary: '', type: 'fulltime', deadline: '', skills: '', applyLink: '' });

  useEffect(() => { fetchJobs(); if (isStudent) fetchMyApplications(); }, []);

  const fetchJobs = async () => { try { const r = await axios.get('/api/jobs'); setJobs(r.data); } catch {} };
  const fetchMyApplications = async () => { try { const r = await axios.get('/api/jobs/my-applications'); setMyApplications(r.data); } catch {} };

  const createJob = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/jobs', { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) });
      toast.success('Job posted!');
      setShowCreate(false);
      fetchJobs();
    } catch (err) { toast.error('Failed to post job'); }
  };

  const applyToJob = async (jobId) => {
    try {
      await axios.post(`/api/jobs/${jobId}/apply`, { coverLetter });
      toast.success('Applied successfully!');
      setApplyModal(null);
      setCoverLetter('');
      fetchMyApplications();
      fetchJobs();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to apply'); }
  };

  const hasApplied = (jobId) => myApplications.some(a => a.jobPostId === jobId);

  const filtered = jobs.filter(j => {
    const q = search.toLowerCase();
    return (!search || j.title?.toLowerCase().includes(q) || j.company?.toLowerCase().includes(q)) &&
           (!typeFilter || j.type === typeFilter);
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black mb-1 flex items-center gap-3"><Briefcase className="w-8 h-8 text-yellow-400" />Job Board</h1>
          <p className="opacity-70">Campus placements and internship opportunities.</p>
        </div>
        <div className="flex gap-3">
          {isStudent && (
            <button onClick={() => setTab(tab === 'my' ? 'browse' : 'my')}
              className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm flex items-center gap-2">
              <CheckCircle className="w-4 h-4" /> My Applications ({myApplications.length})
            </button>
          )}
          {(isAdmin || isTeacher) && (
            <button onClick={() => setShowCreate(true)} className="px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-slate-900 rounded-xl font-bold flex items-center gap-2">
              <Plus className="w-5 h-5" /> Post Job
            </button>
          )}
        </div>
      </div>

      {tab === 'my' && isStudent ? (
        <div className="space-y-3">
          <h2 className="text-xl font-black text-gray-900 dark:text-white">My Applications</h2>
          {myApplications.length === 0 && <div className="py-12 text-center text-gray-400 bg-white dark:bg-dark-card rounded-3xl border border-dashed">No applications yet.</div>}
          {myApplications.map(a => (
            <div key={a.id} className="bg-white dark:bg-dark-card p-5 rounded-2xl border border-gray-100 dark:border-dark-border flex justify-between items-center shadow-sm">
              <div>
                <p className="font-bold text-gray-900 dark:text-white">{a.Job?.title}</p>
                <p className="text-sm text-gray-500">{a.Job?.company} • {a.Job?.type}</p>
              </div>
              <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${statusColors[a.status]}`}>{a.status.charAt(0).toUpperCase() + a.status.slice(1)}</span>
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search jobs, companies..."
                className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl outline-none focus:ring-2 focus:ring-slate-500" />
            </div>
            <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
              className="md:w-44 px-4 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl outline-none">
              <option value="">All Types</option>
              <option value="fulltime">Full-time</option>
              <option value="internship">Internship</option>
              <option value="parttime">Part-time</option>
              <option value="contract">Contract</option>
            </select>
          </div>

          {/* Jobs Grid */}
          <div className="grid gap-4">
            {filtered.length === 0 && (
              <div className="py-20 text-center text-gray-400 bg-white dark:bg-dark-card rounded-3xl border border-dashed border-gray-200">
                <Briefcase className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-lg">No jobs found.</p>
              </div>
            )}
            {filtered.map(job => (
              <div key={job.id} className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-black text-slate-700 dark:text-slate-200 text-xl shrink-0">
                        {job.company?.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-0.5">{job.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 font-medium">{job.company}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{job.description}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className={`text-xs px-3 py-1 rounded-full font-bold ${typeColors[job.type]}`}>{job.type}</span>
                      {job.location && <span className="text-xs bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 px-3 py-1 rounded-full font-medium flex items-center gap-1"><MapPin className="w-3 h-3" />{job.location}</span>}
                      {job.salary && <span className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-medium">💰 {job.salary}</span>}
                      {job.deadline && <span className="text-xs bg-red-50 text-red-600 px-3 py-1 rounded-full font-medium flex items-center gap-1"><Clock className="w-3 h-3" />Due {format(new Date(job.deadline), 'dd MMM')}</span>}
                    </div>
                    {job.skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
                        {job.skills.map(s => <span key={s} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded-md">{s}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-2 min-w-[140px]">
                    {isStudent && (
                      hasApplied(job.id)
                        ? <span className="px-4 py-2.5 bg-green-50 text-green-700 rounded-xl text-sm font-bold text-center flex items-center justify-center gap-1.5"><CheckCircle className="w-4 h-4" />Applied</span>
                        : <button onClick={() => setApplyModal(job)} className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-slate-900 rounded-xl text-sm font-bold flex items-center justify-center gap-2">
                            <Send className="w-4 h-4" /> Apply
                          </button>
                    )}
                    {job.applyLink && (
                      <a href={job.applyLink} target="_blank" rel="noreferrer" className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium flex items-center justify-center gap-2">
                        <ExternalLink className="w-4 h-4" /> Apply Link
                      </a>
                    )}
                    <p className="text-xs text-center text-gray-400">{job.JobApplications?.length || 0} applicants</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Apply Modal */}
      {applyModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl w-full max-w-md shadow-2xl border dark:border-slate-800">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-black">Apply — {applyModal.title}</h2>
              <button onClick={() => setApplyModal(null)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">{applyModal.company} • {applyModal.type}</p>
            <textarea placeholder="Cover letter (optional)..." rows={5} value={coverLetter} onChange={e => setCoverLetter(e.target.value)}
              className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-slate-500 mb-4" />
            <div className="flex justify-end gap-3">
              <button onClick={() => setApplyModal(null)} className="px-5 py-2 font-bold text-gray-500">Cancel</button>
              <button onClick={() => applyToJob(applyModal.id)} className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl flex items-center gap-2">
                <Send className="w-4 h-4" /> Submit Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Job Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl w-full max-w-lg shadow-2xl border dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black">Post a Job</h2>
              <button onClick={() => setShowCreate(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <form onSubmit={createJob} className="space-y-3">
              <input required placeholder="Job Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-slate-500" />
              <input required placeholder="Company Name" value={form.company} onChange={e => setForm({...form, company: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-slate-500" />
              <textarea required placeholder="Job Description" rows={4} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-slate-500" />
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})}
                  className="px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-slate-500" />
                <input placeholder="Salary (e.g. 8-12 LPA)" value={form.salary} onChange={e => setForm({...form, salary: e.target.value})}
                  className="px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-slate-500" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                  className="px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700">
                  <option value="fulltime">Full-time</option>
                  <option value="internship">Internship</option>
                  <option value="parttime">Part-time</option>
                  <option value="contract">Contract</option>
                </select>
                <input type="datetime-local" value={form.deadline} onChange={e => setForm({...form, deadline: e.target.value})}
                  className="px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-slate-500" />
              </div>
              <input placeholder="Required Skills (comma-separated)" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-slate-500" />
              <input placeholder="External Apply Link (optional)" value={form.applyLink} onChange={e => setForm({...form, applyLink: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-slate-500" />
              <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-800">
                <button type="button" onClick={() => setShowCreate(false)} className="px-5 py-2 font-bold text-gray-500">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl">Post Job</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobBoard;
