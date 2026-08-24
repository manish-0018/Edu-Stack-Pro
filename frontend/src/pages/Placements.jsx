import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Briefcase, FileText, Link, Calendar, CheckCircle2, AlertCircle, Plus, Send, ExternalLink, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Placements = () => {
  const { user } = useAuth();
  const [listings, setListings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeSaving, setResumeSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modals & Forms
  const [showListingModal, setShowListingModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [applying, setApplying] = useState(false);

  // New Listing Form State
  const [newListing, setNewListing] = useState({
    name: '',
    position: '',
    type: 'placement',
    package: '',
    criteria: '',
    description: '',
    steps: '',
    deadline: ''
  });
  const [savingListing, setSavingListing] = useState(false);

  // AI Resume Scorer States
  const [matchListingId, setMatchListingId] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [matchLoading, setMatchLoading] = useState(false);
  const [matchResult, setMatchResult] = useState(null);

  const handleAIMatch = async (e) => {
    e.preventDefault();
    if (!matchListingId) {
      toast.error('Please select a company drive');
      return;
    }
    if (!resumeText.trim()) {
      toast.error('Please paste your resume text');
      return;
    }
    setMatchLoading(true);
    try {
      const res = await axios.post('/api/placements/match-resume', {
        resumeText,
        companyListingId: matchListingId
      });
      setMatchResult(res.data);
      toast.success('AI Resume Scoring Complete!');
    } catch (err) {
      toast.error('Failed to analyze resume');
    } finally {
      setMatchLoading(false);
    }
  };

  // AI Career Planner Roadmap States & Handler
  const [careerGoal, setCareerGoal] = useState('');
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmapResult, setRoadmapResult] = useState(null);

  const handleGenerateRoadmap = async (e) => {
    e.preventDefault();
    if (!careerGoal.trim()) {
      toast.error('Please enter your career goal');
      return;
    }
    setRoadmapLoading(true);
    try {
      const res = await axios.post('/api/placements/generate-roadmap', {
        careerGoal
      });
      setRoadmapResult(res.data);
      toast.success('AI Career Learning Roadmap Generated!');
    } catch (err) {
      toast.error('Failed to generate learning roadmap');
    } finally {
      setRoadmapLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [listRes, appRes] = await Promise.all([
        axios.get('/api/placements'),
        axios.get('/api/placements/applications')
      ]);
      setListings(listRes.data);
      setApplications(appRes.data);

      if (user.role === 'student') {
        // Fetch current student's details to get their resumeUrl
        const profileRes = await axios.get('/api/auth/me');
        setResumeUrl(profileRes.data.resumeUrl || '');
      }
    } catch (err) {
      toast.error('Failed to load portal data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSaveResume = async (e) => {
    e.preventDefault();
    if (!resumeUrl) {
      toast.error('Please enter a valid URL');
      return;
    }
    setResumeSaving(true);
    try {
      await axios.put('/api/placements/resume', { resumeUrl });
      toast.success('Resume link saved successfully!');
    } catch (err) {
      toast.error('Failed to save resume link');
    } finally {
      setResumeSaving(false);
    }
  };

  const handleCreateListing = async (e) => {
    e.preventDefault();
    setSavingListing(true);
    try {
      const res = await axios.post('/api/placements', newListing);
      setListings([res.data, ...listings]);
      setShowListingModal(false);
      setNewListing({
        name: '',
        position: '',
        type: 'placement',
        package: '',
        criteria: '',
        description: '',
        steps: '',
        deadline: ''
      });
      toast.success('Hiring drive listing created!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setSavingListing(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!resumeUrl) {
      toast.error('Please add your resume link first!');
      return;
    }
    setApplying(true);
    try {
      const res = await axios.post(`/api/placements/${selectedListing.id}/apply`, { submissionText });
      // Fetch fresh applications
      const appRes = await axios.get('/api/placements/applications');
      setApplications(appRes.data);
      setShowApplyModal(false);
      setSubmissionText('');
      toast.success(`Successfully applied to ${selectedListing.name}!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit application');
    } finally {
      setApplying(false);
    }
  };

  const handleUpdateAppStatus = async (appId, status, note = '') => {
    try {
      const res = await axios.put(`/api/placements/applications/${appId}`, { status, submissionText: note });
      setApplications(applications.map(a => a.id === appId ? { ...a, status: res.data.status, submissionText: res.data.submissionText } : a));
      toast.success(`Application status updated to ${status}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-primary-600 animate-spin" />
        <span className="ml-2 font-medium text-gray-500">Loading placement details...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-primary-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-primary-500/20">
        <h1 className="text-2xl md:text-3xl font-extrabold flex items-center gap-3">
          <Briefcase className="w-8 h-8" /> Internship & Placement Portal
        </h1>
        <p className="mt-2 text-primary-100 max-w-2xl text-sm md:text-base">
          Apply for placement drives and exclusive internship opportunities. Standard attendance restrictions have been waived to maximize student participation.
        </p>
      </div>

      {/* Student Resume Section */}
      {user.role === 'student' && (
        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <FileText className="text-primary-500 w-5 h-5" /> Professional Resume Upload
          </h2>
          <p className="text-xs text-gray-400 mb-4">
            Add a shared Google Drive or OneDrive link to your PDF resume. Companies will access this link to evaluate your qualification and call you for further exam steps.
          </p>
          <form onSubmit={handleSaveResume} className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="url"
                placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                className="w-full pl-9 pr-4 py-2.5 border border-gray-300 dark:border-dark-border rounded-xl dark:bg-dark-bg focus:ring-2 focus:ring-primary-500 focus:outline-none text-sm"
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              disabled={resumeSaving}
              className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold transition-colors disabled:opacity-50 text-sm"
            >
              {resumeSaving ? 'Saving...' : 'Save Link'}
            </button>
          </form>
          {resumeUrl && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Resume synchronized! 
              <a href={resumeUrl} target="_blank" rel="noreferrer" className="text-primary-500 underline flex items-center gap-0.5 ml-1">
                Verify Link <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Main Grid: Listings & Applications */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Listings (Left / Span 2) */}
        <div className="xl:col-span-2 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Active Hiring Drives</h2>
            {user.role === 'admin' && (
              <button
                onClick={() => setShowListingModal(true)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-primary-500/10"
              >
                <Plus className="w-4 h-4" /> Add Company Drive
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {listings.map((l) => {
              const hasApplied = applications.some(a => a.companyListingId === l.id);
              const appliedRecord = applications.find(a => a.companyListingId === l.id);

              return (
                <div
                  key={l.id}
                  className="bg-white dark:bg-dark-card p-6 rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group"
                >
                  <div>
                    {/* Badge */}
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {l.name}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        l.type === 'internship' ? 'bg-orange-50 text-orange-600 dark:bg-orange-950/20 dark:text-orange-400' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/20 dark:text-indigo-400'
                      }`}>
                        {l.type}
                      </span>
                    </div>

                    <div className="text-sm font-bold text-primary-500 mb-1">{l.position}</div>
                    <div className="text-xs text-gray-400 font-medium mb-3 flex items-center gap-1">
                      💰 Package / Stipend: <span className="text-gray-600 dark:text-gray-300 font-bold">{l.package}</span>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                      {l.description}
                    </p>

                    {/* Criteria Box */}
                    {l.criteria && (
                      <div className="bg-gray-50 dark:bg-dark-bg p-3 rounded-xl border border-gray-100 dark:border-dark-border text-[11px] mb-4">
                        <strong className="text-gray-700 dark:text-gray-300 block mb-0.5">Eligibility Criteria:</strong>
                        <span className="text-gray-500 dark:text-gray-400">{l.criteria}</span>
                      </div>
                    )}

                    {/* Steps / Exam Details */}
                    {l.steps && (
                      <div className="text-[11px] mb-4 text-gray-500 dark:text-gray-400">
                        <strong className="text-gray-700 dark:text-gray-300 block mb-1">Selection Steps:</strong>
                        <div className="whitespace-pre-line pl-1 border-l-2 border-primary-400/40">{l.steps}</div>
                      </div>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-50 dark:border-gray-800 flex items-center justify-between gap-2 mt-4 text-[11px] text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Apply by: {l.deadline || 'N/A'}
                    </span>

                    {user.role === 'student' ? (
                      hasApplied ? (
                        <span className={`px-3 py-1 rounded-lg font-bold capitalize ${
                          appliedRecord.status === 'selected' ? 'bg-green-50 text-green-700 dark:bg-green-950/20' :
                          appliedRecord.status === 'rejected' ? 'bg-red-50 text-red-700 dark:bg-red-950/20' :
                          'bg-blue-50 text-blue-700 dark:bg-blue-950/20'
                        }`}>
                          ✓ {appliedRecord.status}
                        </span>
                      ) : (
                        <button
                          onClick={() => {
                            setSelectedListing(l);
                            setShowApplyModal(true);
                          }}
                          className="px-4 py-1.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold transition-colors shadow-sm"
                        >
                          Apply Now
                        </button>
                      )
                    ) : null}
                  </div>
                </div>
              );
            })}

            {listings.length === 0 && (
              <p className="text-sm text-gray-400 py-8 text-center col-span-2">No active drives posted currently.</p>
            )}
          </div>
        </div>

        {/* Applications / Admin View (Right / Span 1) */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {user.role === 'student' ? 'My Submissions' : 'Applications Console'}
          </h2>

          {user.role === 'student' ? (
            <>
              {/* AI Resume Fit Matcher Card */}
              <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm space-y-4 mb-6">
                <div>
                  <span className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-lg mb-2 inline-block">✨ Powered by AI</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Resume Fit Matcher</h3>
                  <p className="text-xs text-gray-400">Score your resume skills against active hiring drives to optimize your placement preparation.</p>
                </div>

                <form onSubmit={handleAIMatch} className="space-y-3">
                  <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1">Select Hiring Drive</label>
                    <select
                      required
                      value={matchListingId}
                      onChange={e => setMatchListingId(e.target.value)}
                      className="w-full px-3 py-2.5 border border-gray-200 dark:border-dark-border rounded-xl bg-gray-50 dark:bg-dark-bg text-sm text-gray-900 dark:text-white focus:ring-primary-500 focus:outline-none"
                    >
                      <option value="" className="text-gray-900 dark:text-white">Choose Company Drive...</option>
                      {listings.map(l => (
                        <option key={l.id} value={l.id} className="text-gray-900 dark:text-white">{l.name} - {l.position}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1">Paste Resume Text</label>
                    <textarea
                      required
                      rows="4"
                      value={resumeText}
                      onChange={e => setResumeText(e.target.value)}
                      placeholder="Paste skills, past projects, work history, or education details..."
                      className="w-full px-3 py-2 border border-gray-200 dark:border-dark-border rounded-xl bg-gray-50 dark:bg-dark-bg text-sm text-gray-900 dark:text-white focus:ring-primary-500 focus:outline-none placeholder-gray-400"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={matchLoading}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors disabled:opacity-50"
                  >
                    {matchLoading ? 'Analyzing Alignment...' : 'Analyze Resume Fit'}
                  </button>
                </form>

                {matchResult && (
                  <div className="bg-indigo-50/50 dark:bg-indigo-950/20 p-5 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30 space-y-3">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-xl shrink-0">
                        {matchResult.match_score}%
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">AI Alignment Score</h4>
                        <p className="text-[11px] text-gray-400">{matchResult.feedback}</p>
                      </div>
                    </div>

                    {matchResult.matching_skills?.length > 0 && (
                      <div>
                        <strong className="text-[10px] uppercase text-emerald-600 dark:text-emerald-400 block mb-1">Matching Skills:</strong>
                        <div className="flex flex-wrap gap-1.5">
                          {matchResult.matching_skills.map(s => (
                            <span key={s} className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-[10px] px-2 py-0.5 rounded font-bold">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {matchResult.missing_skills?.length > 0 && (
                      <div>
                        <strong className="text-[10px] uppercase text-orange-600 dark:text-orange-400 block mb-1">Recommended Skills to Add:</strong>
                        <div className="flex flex-wrap gap-1.5">
                          {matchResult.missing_skills.map(s => (
                            <span key={s} className="bg-orange-50 dark:bg-orange-950/30 text-orange-700 dark:text-orange-400 text-[10px] px-2 py-0.5 rounded font-bold">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* AI Career Planner & Roadmap Card */}
              <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm space-y-4 mb-6">
                <div>
                  <span className="bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-lg mb-2 inline-block">✨ Powered by AI</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Career Planner & Roadmap</h3>
                  <p className="text-xs text-gray-400">Generate a custom week-by-week preparation roadmap and job role recommendation from your credentials.</p>
                </div>

                {!roadmapResult ? (
                  <form onSubmit={handleGenerateRoadmap} className="space-y-3">
                    <div>
                      <label className="text-xs font-bold text-gray-500 block mb-1">What is your target career goal?</label>
                      <input
                        required
                        type="text"
                        value={careerGoal}
                        onChange={e => setCareerGoal(e.target.value)}
                        placeholder="e.g. Full Stack Dev, Web Dev, Software Engineer..."
                        className="w-full px-3 py-2.5 border border-gray-200 dark:border-dark-border rounded-xl bg-gray-50 dark:bg-dark-bg text-sm text-gray-900 dark:text-white focus:ring-primary-500 focus:outline-none placeholder-gray-400"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={roadmapLoading}
                      className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm shadow-md transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {roadmapLoading ? 'Analyzing & Building Roadmap...' : '🎯 Generate AI Learning Roadmap'}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-2xl border border-indigo-100/50 dark:border-indigo-900/30">
                      <span className="text-[10px] uppercase bg-indigo-600 text-white font-extrabold px-2 py-0.5 rounded mb-1.5 inline-block">RECOMMENDED PATHWAY</span>
                      <h4 className="font-extrabold text-gray-900 dark:text-white text-md mb-1">{roadmapResult.recommended_role}</h4>
                      <p className="text-xs text-gray-500 leading-relaxed">{roadmapResult.fit_reason}</p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <strong className="text-xs uppercase text-gray-400 block border-b pb-1">8-Week Preparation Checklist:</strong>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                        {roadmapResult.roadmap?.map((item, idx) => (
                          <div key={idx} className="flex gap-3 p-3 bg-gray-50 dark:bg-dark-bg/40 rounded-xl border border-gray-100 dark:border-dark-border/40 text-xs">
                            <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-black shrink-0">W{item.week}</div>
                            <div className="space-y-1.5 flex-1">
                              <h5 className="font-bold text-gray-900 dark:text-white">{item.topic}</h5>
                              <div className="flex flex-wrap gap-2 text-[10px]">
                                {item.resources?.map((r, ri) => (
                                  <span key={ri} className="bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded font-medium">{r}</span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => setRoadmapResult(null)}
                      className="w-full py-2 border border-gray-200 dark:border-dark-border text-gray-500 dark:text-gray-400 text-xs font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-dark-bg"
                    >
                      Clear & Regenerate
                    </button>
                  </div>
                )}
              </div>

              <div className="overflow-x-auto pb-4">
                <div className="flex gap-4 min-w-[800px]">
                  {['applied', 'exam_scheduled', 'interview_round', 'selected', 'rejected'].map(status => (
                    <div key={status} className="flex-1 bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-gray-100 dark:border-dark-border">
                      <h3 className="font-bold text-sm uppercase tracking-wider mb-4 flex items-center justify-between text-gray-500">
                        {status.replace('_', ' ')}
                        <span className="bg-white dark:bg-dark-bg px-2 py-0.5 rounded-full text-xs">
                          {applications.filter(a => a.status === status).length}
                        </span>
                      </h3>
                      
                      <div className="space-y-3">
                        {applications.filter(a => a.status === status).map(app => (
                          <div key={app.id} className="bg-white dark:bg-dark-card p-3 rounded-xl border border-gray-100 dark:border-dark-border shadow-sm hover:shadow-md transition-shadow">
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">{app.Company?.name}</h4>
                            <p className="text-xs text-primary-500 font-medium mb-2">{app.Company?.position}</p>
                            
                            {app.submissionText && (
                              <div className="bg-gray-50 dark:bg-dark-bg p-2 rounded text-[10px] text-gray-500 italic mb-2 line-clamp-2">
                                {app.submissionText}
                              </div>
                            )}
                            
                            <div className="text-[10px] text-gray-400 mt-2">
                              {new Date(app.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Admin/Teacher Dashboard List */
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white dark:bg-dark-card p-4 rounded-xl border border-gray-100 dark:border-dark-border shadow-sm space-y-3"
                >
                  <div>
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-sm text-gray-900 dark:text-white">
                        {app.Student?.name}
                      </span>
                      <a
                        href={app.Student?.resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-primary-500 font-bold hover:underline flex items-center gap-0.5 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded"
                      >
                        Resume <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                    <div className="text-[10px] text-gray-400">{app.Student?.email}</div>
                  </div>

                  <div className="bg-gray-50 dark:bg-dark-bg p-2.5 rounded-lg text-xs space-y-1">
                    <div>
                      Company: <strong>{app.Company?.name}</strong>
                    </div>
                    <div>
                      Post: <strong>{app.Company?.position}</strong> ({app.Company?.type})
                    </div>
                    {app.submissionText && (
                      <div className="text-[10px] text-gray-400 italic mt-1">
                        Student Note: "{app.submissionText}"
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1.5">
                    <select
                      className={`text-xs px-2 py-1.5 border rounded-lg font-medium outline-none flex-1 dark:bg-dark-bg ${
                        app.status === 'selected' ? 'bg-green-50 text-green-700' :
                        app.status === 'rejected' ? 'bg-red-50 text-red-700' :
                        'bg-gray-50 text-gray-700'
                      }`}
                      value={app.status}
                      onChange={(e) => handleUpdateAppStatus(app.id, e.target.value, app.submissionText)}
                    >
                      <option value="applied">Applied</option>
                      <option value="exam_scheduled">Exam Scheduled</option>
                      <option value="interview_round">Interview Round</option>
                      <option value="selected">Selected</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                </div>
              ))}

              {applications.length === 0 && (
                <div className="p-8 text-center text-gray-400 bg-white dark:bg-dark-card rounded-xl border border-gray-100 dark:border-dark-border">
                  No applications received yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Company Listing Modal */}
      {showListingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl w-full max-w-lg border border-gray-100 dark:border-dark-border max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Post New Company Drive</h2>
            <form onSubmit={handleCreateListing} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-gray-500">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Amazon"
                    className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-dark-bg dark:border-dark-border"
                    value={newListing.name}
                    onChange={(e) => setNewListing({ ...newListing, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-gray-500">Role / Position</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SDE Intern"
                    className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-dark-bg dark:border-dark-border"
                    value={newListing.position}
                    onChange={(e) => setNewListing({ ...newListing, position: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-gray-500">Stipend / Package</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹60,000/mo or ₹12 LPA"
                    className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-dark-bg dark:border-dark-border"
                    value={newListing.package}
                    onChange={(e) => setNewListing({ ...newListing, package: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-gray-500">Type</label>
                  <select
                    className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-dark-bg dark:border-dark-border"
                    value={newListing.type}
                    onChange={(e) => setNewListing({ ...newListing, type: e.target.value })}
                  >
                    <option value="placement">Full-Time Placement</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-gray-500">Eligibility / Criteria</label>
                <input
                  type="text"
                  placeholder="e.g. BCA/MCA, CGPA >= 7.0, No Backlogs"
                  className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-dark-bg dark:border-dark-border"
                  value={newListing.criteria}
                  onChange={(e) => setNewListing({ ...newListing, criteria: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-gray-500">Hiring Stages / Exam Steps</label>
                <textarea
                  rows="2"
                  placeholder="e.g. 1. Aptitude Round&#10;2. Tech Round&#10;3. HR Discussion"
                  className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-dark-bg dark:border-dark-border"
                  value={newListing.steps}
                  onChange={(e) => setNewListing({ ...newListing, steps: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-gray-500">Job Description</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Hiring details and scope of work..."
                  className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-dark-bg dark:border-dark-border"
                  value={newListing.description}
                  onChange={(e) => setNewListing({ ...newListing, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-gray-500">Deadline</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-dark-bg dark:border-dark-border"
                    value={newListing.deadline}
                    onChange={(e) => setNewListing({ ...newListing, deadline: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowListingModal(false)}
                  className="px-4 py-2 text-xs border rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingListing}
                  className="px-5 py-2 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold"
                >
                  {savingListing ? 'Posting...' : 'Create Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Apply Modal */}
      {showApplyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl w-full max-w-md border border-gray-100 dark:border-dark-border">
            <h2 className="text-xl font-bold mb-2">Apply for {selectedListing?.name}</h2>
            <p className="text-xs text-gray-400 mb-4">
              Your professional resume link <strong>({resumeUrl})</strong> will be submitted to {selectedListing?.name}'s recruiting database.
            </p>

            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold mb-1 uppercase tracking-wider text-gray-500">
                  Cover Note / CGPA / Additional Details (Optional)
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. CGPA: 8.5. Completed AWS certification. Ready for the online coding exam."
                  className="w-full px-3 py-2 text-sm border rounded-lg dark:bg-dark-bg dark:border-dark-border"
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowApplyModal(false)}
                  className="px-4 py-2 text-xs border rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={applying}
                  className="px-5 py-2 text-xs bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold flex items-center gap-1"
                >
                  <Send className="w-3.5 h-3.5" /> {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Placements;
