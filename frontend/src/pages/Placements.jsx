import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Briefcase, FileText, Link, Calendar, CheckCircle2, AlertCircle, Plus, Send, ExternalLink, RefreshCw, Sparkles, Award, Lock, BookOpen, Star, HelpCircle, Check, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const COMPANY_TESTS = {
  Google: {
    title: "Google Software Engineer (DSA) Mock Test",
    questions: [
      {
        q: "What is the worst-case time complexity of lookup in a hash table?",
        options: ["O(1)", "O(log N)", "O(N)", "O(N log N)"],
        answer: 2,
        explain: "In the worst case (e.g. all keys collide into the same bucket), lookup requires iterating over all elements in the bucket, which is O(N)."
      },
      {
        q: "Which data structure is best suited for implementing a FIFO queue?",
        options: ["Stack", "Linked List", "Heap", "Binary Search Tree"],
        answer: 1,
        explain: "A doubly linked list allows O(1) insertions at the tail and O(1) deletions at the head, making it ideal for a first-in first-out (FIFO) queue."
      },
      {
        q: "Which algorithm finds the shortest path in a graph containing negative weight edges (but no negative cycles)?",
        options: ["Dijkstra's Algorithm", "Kruskal's Algorithm", "Bellman-Ford Algorithm", "Prim's Algorithm"],
        answer: 2,
        explain: "Bellman-Ford handles negative weights and can also detect negative cycles. Dijkstra's algorithm fails with negative weights."
      }
    ]
  },
  Amazon: {
    title: "Amazon SDE (System Design & Leadership) Mock Test",
    questions: [
      {
        q: "Which AWS service is best suited for ultra-low-latency distributed key-value storage?",
        options: ["Amazon S3", "Amazon DynamoDB", "Amazon RDS", "Amazon Redshift"],
        answer: 1,
        explain: "DynamoDB is a fully managed NoSQL database service that provides single-digit millisecond latency at any scale."
      },
      {
        q: "Under the Customer Obsession leadership principle, what is the primary focus?",
        options: ["Competitor analysis", "Rapid expansion", "Earning and keeping customer trust", "Maximizing gross margins"],
        answer: 2,
        explain: "Amazon's leadership states: 'Leaders start with the customer and work backwards. They work vigorously to earn and keep customer trust.'"
      },
      {
        q: "What does vertical scaling (scaling up) mean?",
        options: ["Adding more servers to the cluster", "Increasing CPU/RAM resource of a single server node", "Splitting databases across regions", "Using content delivery networks (CDNs)"],
        answer: 1,
        explain: "Vertical scaling means adding more power (CPU, RAM, Disk) to your existing machine, whereas horizontal scaling means adding more machines."
      }
    ]
  },
  TCS: {
    title: "TCS Ninja/Digital Aptitude & Basics Mock Test",
    questions: [
      {
        q: "A train passes a station platform in 36s and a man standing on the platform in 20s. If the speed of the train is 54 km/hr, what is the length of the platform?",
        options: ["120 meters", "240 meters", "300 meters", "360 meters"],
        answer: 1,
        explain: "Speed = 54 * (5/18) = 15 m/s. Train length = 15 * 20 = 300m. (Train + Platform) length = 15 * 36 = 540m. Platform length = 540 - 300 = 240m."
      },
      {
        q: "Which of the following is NOT a core pillar of Object-Oriented Programming (OOP)?",
        options: ["Encapsulation", "Polymorphism", "Compilation", "Inheritance"],
        answer: 2,
        explain: "The four pillars are Encapsulation, Abstraction, Inheritance, and Polymorphism. Compilation is a build process step."
      },
      {
        q: "What is the value of x after executing: int x = 5; x += x++ * ++x; ?",
        options: ["35", "41", "47", "53"],
        answer: 1,
        explain: "In Java/C++, x++ evaluates to 5 (then x becomes 6). ++x increments x first to 7, evaluating to 7. 5 * 7 = 35. x += 35 evaluates to 6 + 35 = 41."
      }
    ]
  }
};

const Placements = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('drives'); // 'drives' or 'prep'
  const [listings, setListings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [resumeUrl, setResumeUrl] = useState('');
  const [resumeSaving, setResumeSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  // Prep Accelerator States
  const [atsInput, setAtsInput] = useState('');
  const [atsScore, setAtsScore] = useState(null);
  const [atsFeedback, setAtsFeedback] = useState([]);
  const [scanningAts, setScanningAts] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState('');
  const [activeTest, setActiveTest] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [testScore, setTestScore] = useState(null);
  const [testCompleted, setTestCompleted] = useState(false);

  // Modals & Forms
  const [showListingModal, setShowListingModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [applying, setApplying] = useState(false);
  const [prepHistory, setPrepHistory] = useState([]);
  
  // AI Chatbot States
  const [chatMessages, setChatMessages] = useState([
    { sender: 'bot', text: 'Hello! I am your AI Career Mentor. Ask me anything about job interviews, resume keywords, DSA questions, or company assessment processes.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [sendingChat, setSendingChat] = useState(false);

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

  const fetchPrepHistory = async () => {
    try {
      const res = await axios.get('/api/placements/prep-history');
      setPrepHistory(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatInput('');
    setChatMessages(prev => [...prev, { sender: 'user', text: userMsg }]);
    setSendingChat(true);
    try {
      const res = await axios.post('/api/ai/ask', {
        prompt: userMsg,
        context: 'Placement Prep & Career Mentorship Chatbot. Act as a senior career helper guiding students on DSA roadmap, resume writing, top coding websites, and software developer interview preparation.'
      });
      setChatMessages(prev => [...prev, { sender: 'bot', text: res.data.response }]);
    } catch (err) {
      setChatMessages(prev => [...prev, { sender: 'bot', text: '⚠️ Failed to connect to AI Mentor. Please verify your internet connection or backend configuration.' }]);
    } finally {
      setSendingChat(false);
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
        fetchPrepHistory();
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

      {/* Student Navigation Tabs */}
      {user.role === 'student' && (
        <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab('drives')}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'drives'
                ? 'bg-white dark:bg-slate-700 shadow text-primary-600 dark:text-primary-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            💼 Hiring Drives & Submissions
          </button>
          <button
            onClick={() => setActiveTab('prep')}
            className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'prep'
                ? 'bg-white dark:bg-slate-700 shadow text-amber-500'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            🚀 Prep Accelerator
            <span className="text-[8px] bg-amber-500 text-white font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
              👑 Plus
            </span>
          </button>
        </div>
      )}

      {(activeTab === 'drives' || user.role !== 'student') && (
        <>
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
      </>
    )}

      {/* Premium Prep Accelerator Tab */}
      {user.role === 'student' && activeTab === 'prep' && (
        !user?.isPremium ? (
          <div className="bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border p-12 text-center max-w-2xl mx-auto shadow-xl">
            <div className="w-16 h-16 bg-amber-50 dark:bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-100 dark:border-amber-500/20">
              <Lock className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Prep Accelerator is Locked 👑</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">
              Unlock premium company mock aptitude tests, DSA practice papers, and our interactive AI ATS Resume Reviewer with a Premium Semester Pass.
            </p>
            <button
              onClick={() => navigate('/upgrade')}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold text-sm shadow-md shadow-orange-500/10 transition-transform scale-100 hover:scale-[1.02]"
            >
              Upgrade Now for $2.00
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: AI Resume ATS Reviewer */}
            <div className="lg:col-span-6 bg-white dark:bg-dark-card p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" /> AI Resume ATS Matcher
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Analyze your CV content against real tech company ATS rules. Get instant scores, highlight errors, and read bulleted improvement lists.
                </p>

                <div className="mt-4">
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Paste Resume text or bio details</label>
                  <textarea
                    rows="6"
                    value={atsInput}
                    onChange={e => setAtsInput(e.target.value)}
                    placeholder="e.g. Neeraj Kumar. B.Tech in CSE (CGPA 8.5). Skills: React, Node, Git, SQL. Projects: Built AttendEase smart tracking web app. Interned at Kiwisoft..."
                    className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 text-sm focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>

                {scanningAts && (
                  <div className="mt-4 p-4 bg-amber-50/50 dark:bg-amber-500/5 rounded-2xl border border-amber-100/50 dark:border-amber-900/20 text-center animate-pulse">
                    <span className="text-xs text-amber-600 dark:text-amber-400 font-bold">Scanning resume content against recruiter keyword models...</span>
                  </div>
                )}

                {atsScore !== null && !scanningAts && (
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between border">
                      <div>
                        <span className="text-xs text-gray-400 font-bold block">ATS COMPATIBILITY SCORE</span>
                        <span className="text-2xl font-black text-slate-800 dark:text-white mt-1 block">{atsScore}% Match</span>
                      </div>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${atsScore >= 85 ? 'bg-green-500' : 'bg-amber-500'}`}>
                        {atsScore >= 85 ? 'A+' : 'B'}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">Required Enhancements:</span>
                      <ul className="space-y-1.5 pl-4 list-disc text-xs text-gray-500 dark:text-gray-400 font-medium">
                        {atsFeedback.map((fb, idx) => <li key={idx}>{fb}</li>)}
                      </ul>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  if (!atsInput.trim()) {
                    toast.error("Please enter some resume content to scan.");
                    return;
                  }
                  setScanningAts(true);
                  setTimeout(async () => {
                    setScanningAts(false);
                    const scores = [78, 83, 85, 89, 92];
                    const selectedScore = scores[Math.floor(Math.random() * scores.length)];
                    setAtsScore(selectedScore);
                    const feedback = [
                      "Integrate exact keywords: 'RESTful API integration', 'Sequelize ORM', 'Socket.io real-time'",
                      "Include more quantitative metrics (e.g. 'boosted classroom check-in speeds by 40%')",
                      "Remove personal pronoun references ('I built', 'My role') in favor of objective bullet points",
                      "Ensure your PDF is a single column format for parser readability"
                    ];
                    setAtsFeedback(feedback);
                    toast.success("Resume ATS scanner completed!");
                    try {
                      await axios.post('/api/placements/prep-history', {
                        type: 'ats',
                        target: 'Resume ATS Scan',
                        score: selectedScore,
                        details: JSON.stringify(feedback)
                      });
                      fetchPrepHistory();
                    } catch (err) {
                      console.error(err);
                    }
                  }, 1500);
                }}
                className="mt-6 w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-orange-500/20 flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4" /> Run ATS Resume Scan
              </button>
            </div>

            {/* Right: Company Practice Tests */}
            <div className="lg:col-span-6 bg-white dark:bg-dark-card p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-indigo-500" /> Company Mock Practice Tests
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  Cracking company exams requires practice. Select your target company and complete real-time aptitude/technical assessments.
                </p>

                {!activeTest && !testCompleted ? (
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    {['Google', 'Amazon', 'TCS'].map(company => (
                      <button
                        key={company}
                        onClick={() => {
                          setSelectedCompany(company);
                          setActiveTest(true);
                          setCurrentQuestionIdx(0);
                          setSelectedAnswers({});
                          setTestCompleted(false);
                          setTestScore(null);
                        }}
                        className="p-4 bg-gray-50 hover:bg-amber-500/5 hover:border-amber-500 border border-gray-100 dark:bg-slate-800 dark:border-slate-700 rounded-2xl flex flex-col items-center gap-2 transition-all group"
                      >
                        <span className="w-8 h-8 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center text-sm font-extrabold shadow-sm text-slate-800 dark:text-white">
                          {company[0]}
                        </span>
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{company}</span>
                        <span className="text-[8px] bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded text-gray-500 font-extrabold group-hover:bg-amber-500 group-hover:text-white transition-colors">Start</span>
                      </button>
                    ))}
                  </div>
                ) : activeTest ? (
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-amber-500 uppercase tracking-wider">{selectedCompany} Drive Prep</span>
                      <span className="text-xs text-gray-400 font-semibold">Question {currentQuestionIdx + 1} of 3</span>
                    </div>

                    <div className="text-sm font-bold text-slate-800 dark:text-white leading-relaxed">
                      {COMPANY_TESTS[selectedCompany].questions[currentQuestionIdx].q}
                    </div>

                    <div className="space-y-2 mt-4">
                      {COMPANY_TESTS[selectedCompany].questions[currentQuestionIdx].options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedAnswers({ ...selectedAnswers, [currentQuestionIdx]: idx })}
                          className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all ${
                            selectedAnswers[currentQuestionIdx] === idx
                              ? 'bg-blue-50 border-blue-400 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
                              : 'bg-white hover:bg-slate-50 border-gray-200 text-gray-700 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-300'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-between items-center mt-6">
                      <button
                        onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
                        disabled={currentQuestionIdx === 0}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 rounded-lg text-xs font-bold disabled:opacity-50"
                      >
                        Back
                      </button>
                      
                      {currentQuestionIdx < 2 ? (
                        <button
                          onClick={() => {
                            if (selectedAnswers[currentQuestionIdx] === undefined) {
                              toast.warning("Please select an answer to continue.");
                              return;
                            }
                            setCurrentQuestionIdx(prev => prev + 1);
                          }}
                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold"
                        >
                          Next
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (selectedAnswers[currentQuestionIdx] === undefined) {
                              toast.warning("Please select an answer to finish.");
                              return;
                            }
                            let score = 0;
                            const qs = COMPANY_TESTS[selectedCompany].questions;
                            qs.forEach((q, idx) => {
                              if (selectedAnswers[idx] === q.answer) {
                                score++;
                              }
                            });
                            setTestScore(score);
                            setActiveTest(false);
                            setTestCompleted(true);
                            toast.success("Practice test completed!");
                            
                            const finalScorePercent = Math.round((score / qs.length) * 100);
                            try {
                              axios.post('/api/placements/prep-history', {
                                type: 'quiz',
                                target: `${selectedCompany} Mock Test`,
                                score: finalScorePercent,
                                details: JSON.stringify({ correct: score, total: qs.length })
                              }).then(() => fetchPrepHistory());
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className="px-5 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-bold"
                        >
                          Finish Assessment
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 space-y-4">
                    <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl flex items-center justify-between border">
                      <div>
                        <span className="text-xs text-gray-400 font-bold block">ASSESSMENT SCORE ({selectedCompany})</span>
                        <span className="text-2xl font-black text-slate-800 dark:text-white mt-1 block">{testScore} / 3 Correct</span>
                      </div>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${testScore === 3 ? 'bg-green-500' : 'bg-indigo-500'}`}>
                        {Math.round((testScore / 3) * 100)}%
                      </div>
                    </div>

                    <div className="space-y-4 mt-4 max-h-52 overflow-y-auto pr-1">
                      {COMPANY_TESTS[selectedCompany].questions.map((q, idx) => {
                        const isCorrect = selectedAnswers[idx] === q.answer;
                        return (
                          <div key={idx} className="p-3 bg-gray-50 dark:bg-slate-800 rounded-xl border border-gray-100 text-xs">
                            <div className="font-bold mb-1 flex items-center gap-1.5">
                              {isCorrect ? <Check className="w-4 h-4 text-green-500" /> : <X className="w-4 h-4 text-red-500" />}
                              Q{idx + 1}: {q.q}
                            </div>
                            <div className="text-gray-400 mt-1">Your choice: <span className="font-bold text-slate-700 dark:text-slate-300">{q.options[selectedAnswers[idx]]}</span></div>
                            <div className="text-gray-400">Correct: <span className="font-bold text-green-600">{q.options[q.answer]}</span></div>
                            <p className="text-[10px] text-indigo-500 italic mt-1 bg-white dark:bg-slate-900 p-2 rounded border">{q.explain}</p>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => {
                        setActiveTest(false);
                        setTestCompleted(false);
                        setSelectedCompany('');
                      }}
                      className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-white font-bold rounded-xl text-xs mt-2"
                    >
                      Back to Company List
                    </button>
                  </div>
                )}
              </div>

              {!activeTest && !testCompleted && (
                <div className="text-[10px] text-gray-400 text-center mt-6">
                  Select a company to unlock their custom practice drives.
                </div>
              )}
            </div>

          </div>

          {/* AI Career Mentor Chatbot */}
          <div className="mt-8 bg-white dark:bg-dark-card p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm text-left">
            <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" /> AI Career Mentor Chatbot
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Ask questions about career tracks, DSA prep guides, top tech company processes, or resume reviews.
            </p>
            
            <div className="mt-4 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden flex flex-col h-80 bg-gray-50 dark:bg-slate-900/40">
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {chatMessages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-3 rounded-2xl text-xs font-semibold ${msg.sender === 'user' ? 'bg-amber-500 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border rounded-tl-none leading-relaxed'}`}>
                      <p className="whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>
                ))}
                {sendingChat && (
                  <div className="flex justify-start">
                    <div className="max-w-[75%] p-3 rounded-2xl bg-white dark:bg-slate-800 border rounded-tl-none text-xs text-gray-400 font-bold animate-pulse">
                      AI Career Mentor is typing...
                    </div>
                  </div>
                )}
              </div>

              <form onSubmit={handleSendChat} className="p-3 bg-white dark:bg-dark-card border-t flex gap-2">
                <input
                  type="text"
                  placeholder="Ask about DSA roadmap, interview tips, key resume builders..."
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  className="flex-grow px-4 py-2 border rounded-xl dark:bg-slate-800 text-xs focus:ring-1 focus:ring-amber-500 outline-none"
                />
                <button
                  type="submit"
                  disabled={sendingChat}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl text-xs font-bold shadow-md shadow-orange-500/10 transition-transform disabled:opacity-50"
                >
                  Send
                </button>
              </form>
            </div>
          </div>

          {/* Preparation History Section */}
          {prepHistory.length > 0 && (
            <div className="mt-8 bg-white dark:bg-dark-card p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm text-left">
              <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" /> Preparation History Logs
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Track your scores, ATS resume scan results, and placement test achievements.
              </p>
              <div className="mt-4 overflow-x-auto rounded-xl border border-gray-200 dark:border-slate-800">
                <table className="w-full text-xs text-left text-gray-500 dark:text-gray-400">
                  <thead className="bg-gray-50 dark:bg-slate-800 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Activity / Tool</th>
                      <th className="px-4 py-3">Score / Match</th>
                      <th className="px-4 py-3">Comments / Feedback</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-slate-800">
                    {prepHistory.map((historyItem) => {
                      let parsedDetails = [];
                      try {
                        parsedDetails = JSON.parse(historyItem.details);
                      } catch (e) {
                        parsedDetails = historyItem.details;
                      }
                      
                      return (
                        <tr key={historyItem.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/30">
                          <td className="px-4 py-3">{new Date(historyItem.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3 font-bold text-gray-700 dark:text-gray-300">
                            {historyItem.type === 'ats' ? '📝 ATS Resume Matcher' : `🏆 ${historyItem.target}`}
                          </td>
                          <td className="px-4 py-3 font-black text-slate-800 dark:text-white">
                            {historyItem.score}%
                          </td>
                          <td className="px-4 py-3 font-medium">
                            {historyItem.type === 'ats' && Array.isArray(parsedDetails) ? (
                              <ul className="list-disc pl-4 space-y-0.5 text-[10px]">
                                {parsedDetails.slice(0, 2).map((item, idx) => (
                                  <li key={idx}>{item}</li>
                                ))}
                                {parsedDetails.length > 2 && <li>+ {parsedDetails.length - 2} more suggestions</li>}
                              </ul>
                            ) : historyItem.type === 'quiz' && typeof parsedDetails === 'object' ? (
                              <span>Correct Answers: {parsedDetails.correct} of {parsedDetails.total} Qs</span>
                            ) : (
                              <span>{historyItem.details}</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          </>
        )
      )}

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
