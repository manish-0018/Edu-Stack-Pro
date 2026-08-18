import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { 
  HeartHandshake, Users, MessageSquare, BookOpen, Clock, Star,
  Search, Plus, Check, Play, MessageCircle, Radio, Lock, Brain, RefreshCw
} from 'lucide-react';
import AdBanner from '../components/AdBanner';

const StudyBuddies = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1on1'); // 1on1, groups, forums
  const [subjects, setSubjects] = useState([]);
  
  // Data States
  const [myRequests, setMyRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [groups, setGroups] = useState([]);
  const [pastGroups, setPastGroups] = useState([]);
  const [forums, setForums] = useState([]);
  const [globalQuery, setGlobalQuery] = useState('');
  const [globalMatches, setGlobalMatches] = useState([]);
  const [searchingPeers, setSearchingPeers] = useState(false);
  const [studyGuides, setStudyGuides] = useState([]);
  const [aiMatches, setAiMatches] = useState([]);
  const [matchingBuddies, setMatchingBuddies] = useState(false);

  // Modals / Forms
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ subjectId: '', title: '', description: '', scheduledTime: '', targetColleges: [] });
  const [colleges, setColleges] = useState([]);
  const [scopeType, setScopeType] = useState('global');
  
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedNotesGroup, setSelectedNotesGroup] = useState(null);

  const [showForumModal, setShowForumModal] = useState(false);
  const [newPost, setNewPost] = useState({ subjectId: '', title: '', content: '' });

  // AI Team Builder States
  const [projects, setProjects] = useState([]);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [newProject, setNewProject] = useState({ title: '', description: '', requiredSkills: '', maxTeamSize: 4 });
  const [creatingProject, setCreatingProject] = useState(false);
  const [matchingProject, setMatchingProject] = useState(null);
  const [matchedPeers, setMatchedPeers] = useState([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [projectInvites, setProjectInvites] = useState([]);

  const fetchStudyGuides = async () => {
    try {
      const res = await axios.get('/api/collaboration/study-guides');
      setStudyGuides(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchColleges();
    if (activeTab === '1on1') fetch1on1();
    if (activeTab === 'groups') fetchGroups();
    if (activeTab === 'forums') fetchForums();
    if (activeTab === 'global-peers') setGlobalMatches([]);
    if (activeTab === 'study-guides') fetchStudyGuides();
    if (activeTab === 'team-builder') fetchProjectsAndInvites();
    if (activeTab === 'ai-matches') handleRunAIPeerMatch();
  }, [activeTab]);

  const fetchProjectsAndInvites = async () => {
    try {
      const [projRes, inviteRes] = await Promise.all([
        axios.get('/api/collaboration/projects'),
        axios.get('/api/collaboration/projects/invites')
      ]);
      setProjects(projRes.data);
      setProjectInvites(inviteRes.data);
    } catch (err) {
      toast.error('Failed to load team builder projects');
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setCreatingProject(true);
    try {
      await axios.post('/api/collaboration/projects', newProject);
      toast.success('Project vacancy created successfully!');
      setShowProjectModal(false);
      setNewProject({ title: '', description: '', requiredSkills: '', maxTeamSize: 4 });
      fetchProjectsAndInvites();
    } catch (err) {
      toast.error('Failed to create project listing');
    } finally {
      setCreatingProject(false);
    }
  };

  const handleRunAIMatch = async (proj) => {
    setMatchingProject(proj);
    setLoadingMatches(true);
    setMatchedPeers([]);
    try {
      const res = await axios.post(`/api/collaboration/projects/${proj.id}/match`);
      setMatchedPeers(res.data);
      if (res.data.length === 0) {
        toast.info('No classmate matches found with fitting skills.');
      } else {
        toast.success(`Found ${res.data.length} potential peer matches!`);
      }
    } catch (err) {
      toast.error('AI Matching failed');
    } finally {
      setLoadingMatches(false);
    }
  };

  const handleSendProjectInvite = async (inviteeId) => {
    try {
      await axios.post(`/api/collaboration/projects/${matchingProject.id}/invite`, { inviteeId });
      toast.success('AI team invite sent successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send invite');
    }
  };

  const handleRespondToInvite = async (inviteId, status) => {
    try {
      await axios.put(`/api/collaboration/projects/invites/${inviteId}`, { status });
      toast.success(`Invitation ${status} successfully!`);
      fetchProjectsAndInvites();
    } catch (err) {
      toast.error('Failed to respond to invitation');
    }
  };

  const fetchColleges = async () => {
    try {
      const res = await axios.get('/api/auth/colleges');
      setColleges(res.data);
    } catch (err) { }
  };

  const fetchSubjects = async () => {
    try {
      const res = await axios.get('/api/subjects');
      setSubjects(res.data);
    } catch (err) { }
  };

  const fetch1on1 = async () => {
    try {
      const [myRes, incRes] = await Promise.all([
        axios.get('/api/study/me'),
        axios.get('/api/study/incoming')
      ]);
      setMyRequests(myRes.data);
      setIncomingRequests(incRes.data);
    } catch (err) { }
  };

  const fetchGroups = async () => {
    try {
      const res = await axios.get('/api/collaboration/groups');
      setGroups(res.data);
      const pastRes = await axios.get('/api/collaboration/groups/past');
      setPastGroups(pastRes.data);
    } catch (err) { }
  };

  const fetchForums = async () => {
    try {
      const res = await axios.get('/api/collaboration/forums');
      setForums(res.data);
    } catch (err) { }
  };

  // --- Actions 1on1 ---
  const requestBuddy = async () => {
    if (!selectedSubject) return toast.error('Please select a subject');
    setLoading(true);
    try {
      await axios.post('/api/study/request', { subjectId: selectedSubject });
      toast.success('Study buddy requested! We are finding the best match.');
      setSelectedSubject('');
      fetch1on1();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error requesting buddy');
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async (id) => {
    try {
      await axios.put(`/api/study/${id}/accept`);
      toast.success('Request accepted! You can now enter the workspace.');
      fetch1on1();
    } catch (err) {
      toast.error('Failed to accept request');
    }
  };

  // --- Actions Groups ---
  const createGroup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/collaboration/groups', newGroup);
      toast.success('Study Group created!');
      setShowGroupModal(false);
      setNewGroup({ subjectId: '', title: '', description: '', scheduledTime: '', targetColleges: [] });
      setScopeType('global');
      fetchGroups();
    } catch (err) {
      toast.error('Failed to create group');
    }
  };

  const rsvpGroup = async (id) => {
    try {
      const res = await axios.post(`/api/collaboration/groups/${id}/rsvp`);
      toast.success(res.data.message);
      fetchGroups();
    } catch (err) {
      toast.error('Failed to RSVP');
    }
  };

  // --- Actions Forums ---
  const createPost = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/collaboration/forums', newPost);
      toast.success('Question posted!');
      setShowForumModal(false);
      setNewPost({ subjectId: '', title: '', content: '' });
      fetchForums();
    } catch (err) {
      toast.error('Failed to post question');
    }
  };

  const handleSearchGlobalPeers = async () => {
    if (!globalQuery) return;
    setSearchingPeers(true);
    try {
      const res = await axios.get(`/api/study/global-peers?query=${encodeURIComponent(globalQuery)}`);
      setGlobalMatches(res.data);
      if (res.data.length === 0) {
        toast.info('No topic masters found for this query yet.');
      }
    } catch (err) {
      toast.error('Failed to search global topic masters.');
    } finally {
      setSearchingPeers(false);
    }
  };

  const handleRunAIPeerMatch = async () => {
    setMatchingBuddies(true);
    const toastId = toast.loading('Calculating classmate compatibility scores...');
    try {
      const res = await axios.get('/api/ai/matches');
      setAiMatches(res.data);
      toast.update(toastId, { render: `Found ${res.data.length} matches!`, type: 'success', isLoading: false, autoClose: 4000 });
    } catch (err) {
      toast.update(toastId, { render: 'Failed to calculate compatibility scores.', type: 'error', isLoading: false, autoClose: 4000 });
    } finally {
      setMatchingBuddies(false);
    }
  };

  const requestDirectBuddy = async (tutorId) => {
    try {
      await axios.post('/api/study/request', { tutorId });
      toast.success('Study request sent successfully!');
      fetch1on1();
      setActiveTab('1on1');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request buddy.');
    }
  };

  const renderPremiumLock = (featureName, description) => (
    <div className="py-16 px-6 text-center bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border shadow-xl max-w-xl mx-auto my-8">
      <div className="w-16 h-16 bg-amber-50 dark:bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-100 dark:border-amber-500/20">
        <Lock className="w-8 h-8 text-amber-500 animate-pulse" />
      </div>
      <h2 className="text-2xl font-black text-gray-900 dark:text-white">
        {featureName} is Premium!
      </h2>
      <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium text-sm">
        {description} Unlock this and other premium features with a One-Time Semester Pass!
      </p>
      <button
        onClick={() => navigate('/upgrade')}
        className="mt-6 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold rounded-xl transition-all shadow-md shadow-orange-500/20"
      >
        Unlock with Semester Pass
      </button>
    </div>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 rounded-full border border-white/20 mb-4 backdrop-blur-sm">
            <Users className="w-4 h-4 text-blue-200" />
            <span className="text-xs font-bold uppercase tracking-wider text-blue-100">Collaboration Hub</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3">Study Buddies & Forums</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Connect with peers, join group study sessions, or ask questions in subject-specific forums. 
            All paired with an interactive virtual whiteboard workspace.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-b border-gray-200 dark:border-dark-border pb-4">
        {[
          { id: '1on1', label: '1-on-1 Tutoring', icon: <HeartHandshake className="w-4 h-4" />, premium: true },
          { id: 'groups', label: 'Group Study Rooms', icon: <Users className="w-4 h-4" /> },
          { id: 'ai-matches', label: 'AI Study Matcher', icon: <Brain className="w-4 h-4" /> },
          { id: 'global-peers', label: 'Global Peer Finder', icon: <Search className="w-4 h-4" />, premium: true },
          { id: 'study-guides', label: 'AI Study Guides', icon: <BookOpen className="w-4 h-4" />, premium: true },
          { id: 'team-builder', label: 'AI Team Builder', icon: <Users className="w-4 h-4" />, premium: true }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${
              activeTab === tab.id 
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-card border border-transparent'
            }`}
          >
            {tab.icon} 
            <span>{tab.label}</span>
            {tab.premium && (
              <span className="text-[8px] bg-amber-500 text-white font-extrabold px-1.5 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-0.5 shadow-sm">
                👑 Plus
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ======================= */}
      {/* 1-on-1 TAB              */}
      {/* ======================= */}
      {activeTab === '1on1' && (
        !(user?.isPremium || user?.role === 'teacher' || user?.role === 'admin') ? (
          renderPremiumLock("1-on-1 Tutoring", "Directly match with top-scoring class mentors for personal learning support.")
        ) : (
          <div className="space-y-8">
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border p-6 max-w-xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Request a Tutor</h2>
            <div className="flex gap-3">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">Select a subject...</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
              </select>
              <button
                onClick={requestBuddy}
                disabled={loading || !selectedSubject}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
              >
                {loading ? 'Finding Match...' : <><Search className="w-5 h-5" /> Find Match</>}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* My Requests */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <BookOpen className="w-5 h-5" /> My Learning Requests
              </h3>
              <div className="space-y-4">
                {myRequests.map(req => (
                  <div key={req.id} className="bg-white dark:bg-dark-card p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-lg">{req.Subject?.name}</h4>
                      <span className={`px-2 py-1 text-xs font-bold rounded-lg ${req.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                        {req.status}
                      </span>
                    </div>
                    {req.status === 'accepted' ? (
                      <div className="mt-3">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Tutor: <span className="font-semibold text-gray-900 dark:text-white">{req.Tutor?.name}</span></p>
                        <button 
                          onClick={() => navigate(`/workspace/request/${req.id}`)}
                          className="mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                        >
                          <Play className="w-4 h-4 fill-current" /> Enter Workspace
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-2 flex items-center gap-2"><Clock className="w-4 h-4" /> Waiting for a peer to accept...</p>
                    )}
                  </div>
                ))}
                {myRequests.length === 0 && <p className="text-gray-500 text-sm">No requests made yet.</p>}
              </div>
            </div>

            {/* Incoming Requests */}
            <div>
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <HeartHandshake className="w-5 h-5" /> Requests to Tutor
              </h3>
              <div className="space-y-4">
                {incomingRequests.map(req => (
                  <div key={req.id} className="bg-white dark:bg-dark-card p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
                    <h4 className="font-bold text-lg mb-1">{req.Subject?.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Requester: <span className="font-semibold text-gray-900 dark:text-white">{req.Requester?.name}</span></p>
                    <div className="flex gap-2">
                      <button onClick={() => acceptRequest(req.id)} className="flex-1 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl font-bold flex items-center justify-center gap-1">
                        <Check className="w-4 h-4" /> Accept
                      </button>
                    </div>
                  </div>
                ))}
                {incomingRequests.length === 0 && <p className="text-gray-500 text-sm">No incoming requests to tutor.</p>}
              </div>
            </div>
          </div>
        </div>
      )
    )}

      {/* ======================= */}
      {/* GROUPS TAB                */}
      {/* ======================= */}
      {activeTab === 'groups' && (
        <div className="space-y-6">
          <AdBanner />
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Study Groups</h2>
            <button onClick={() => setShowGroupModal(true)} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2">
              <Plus className="w-4 h-4" /> Create Group
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groups.map(group => {
              const isParticipant = group.StudyGroupParticipants?.some(p => p.studentId === user.id);
              return (
                <div key={group.id} className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex flex-col h-full">
                    <div className="mb-4 flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md uppercase">{group.Subject?.code}</span>
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full border border-red-100 dark:border-red-500/20 shadow-sm">
                        <span className="flex items-center gap-1 animate-pulse">
                          <Radio className="w-3 h-3" /> LIVE
                        </span>
                        {group.watchingCount > 0 && (
                          <span className="ml-1 px-1.5 py-0.5 bg-red-500 text-white rounded text-[8px] font-extrabold tracking-wider uppercase flex items-center gap-0.5 shadow-sm">
                            👁️ {group.watchingCount} watching
                          </span>
                        )}
                      </div>
                    </div>
                  <h3 className="text-xl font-bold mb-2">{group.title}</h3>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-grow">{group.description}</p>
                  
                  <div className="text-xs text-gray-600 dark:text-gray-400 mb-4 space-y-1">
                    <p className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" /> {group.scheduledTime ? format(new Date(group.scheduledTime), 'PPp') : 'TBD'}</p>
                    <p className="flex items-center gap-2"><Users className="w-3.5 h-3.5" /> {group.StudyGroupParticipants?.length} going (Hosted by {group.Creator?.name})</p>
                  </div>
                  
                  <div className="flex gap-2 mt-auto">
                    <button 
                      onClick={() => rsvpGroup(group.id)} 
                      className={`flex-1 py-2 font-bold rounded-xl transition-colors ${isParticipant ? 'bg-gray-100 text-gray-700 hover:bg-red-50 hover:text-red-600' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                    >
                      {isParticipant ? 'Cancel RSVP' : 'RSVP'}
                    </button>
                    {isParticipant && (
                      <button 
                        onClick={() => navigate(`/workspace/group/${group.id}`, { state: { creatorId: group.creatorId } })}
                        className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl flex items-center justify-center gap-1"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> Join
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
            {groups.length === 0 && (
              <div className="col-span-full py-12 text-center text-gray-500 bg-white dark:bg-dark-card rounded-2xl border border-dashed">
                No active study groups right now. Create one to gather your peers!
              </div>
            )}
          </div>

          {/* PAST SESSIONS & NOTES */}
          {pastGroups.length > 0 && (
            <div className="mt-12 border-t border-gray-200 dark:border-dark-border pt-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Past Sessions & Notes</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pastGroups.map(group => (
                  <div key={group.id} className="bg-gray-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-gray-100 dark:border-dark-border flex flex-col">
                    <div className="mb-2 flex justify-between items-start">
                      <span className="text-xs font-bold text-gray-500 uppercase">{group.Subject?.code}</span>
                      <span className="text-xs font-bold bg-green-100 text-green-800 px-2 py-0.5 rounded">Completed</span>
                    </div>
                    <h3 className="text-lg font-bold mb-1 text-gray-700 dark:text-gray-300">{group.title}</h3>
                    <p className="text-xs text-gray-500 mb-4 flex items-center gap-2"><Users className="w-3.5 h-3.5" /> Hosted by {group.Creator?.name}</p>
                    
                    <button 
                      onClick={() => {
                        setSelectedNotesGroup(group);
                        setShowNotesModal(true);
                      }}
                      className="mt-auto w-full py-2 bg-white dark:bg-dark-card hover:bg-gray-100 border border-gray-200 dark:border-slate-700 text-gray-800 dark:text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                    >
                      <BookOpen className="w-4 h-4" /> View Notes
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ======================= */}
      {/* GLOBAL PEER FINDER TAB  */}
      {/* ======================= */}
      {activeTab === 'global-peers' && (
        !(user?.isPremium || user?.role === 'teacher' || user?.role === 'admin') ? (
          renderPremiumLock("Global Peer Finder", "Find and match with verified topic experts from external partner universities.")
        ) : (
          <div className="space-y-6">
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border p-6 max-w-2xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Find Global Topic Masters</h2>
            <p className="text-sm text-gray-500 mb-4">Search across all colleges to find peers who have mastered specific topics (e.g. DSA, Python, ML).</p>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Search topic or skill (e.g. DSA, Python)..."
                value={globalQuery}
                onChange={(e) => setGlobalQuery(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                onClick={handleSearchGlobalPeers}
                disabled={searchingPeers || !globalQuery}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl transition-colors flex items-center gap-2"
              >
                {searchingPeers ? 'Searching...' : <><Search className="w-5 h-5" /> Search Peers</>}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {globalMatches.map(match => (
              <div key={match.id} className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white">{match.User?.name}</h4>
                      <p className="text-xs text-gray-400 font-semibold">{match.User?.College?.name || 'Edu Stack Pro Partner College'}</p>
                    </div>
                    <span className="flex items-center gap-1 text-xs text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-100 dark:border-amber-900/30">
                      <Star className="w-3 h-3 fill-current" /> {match.rating || '5.0'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3">Course: <span className="font-bold text-gray-700 dark:text-gray-300">{match.User?.course || 'Computer Science'}</span></p>
                  <div className="mb-4">
                    <p className="text-xs font-bold text-gray-400 mb-1.5 uppercase tracking-wider">Expertise Topics</p>
                    <div className="flex flex-wrap gap-1">
                      {match.expertise.split(',').map((skill, index) => (
                        <span key={index} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                          {skill.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => requestDirectBuddy(match.User?.id)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-blue-100 dark:shadow-none"
                >
                  <HeartHandshake className="w-4 h-4" /> Request Study Buddy
                </button>
              </div>
            ))}
            {globalMatches.length === 0 && !searchingPeers && (
              <div className="col-span-full py-16 text-center text-gray-400 bg-white dark:bg-dark-card rounded-2xl border border-dashed">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">Search to find verified student mentors across the global college network.</p>
              </div>
            )}
          </div>
        </div>
      )
    )}

      {activeTab === 'ai-matches' && (
        <div className="space-y-6 text-left">
          <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white border border-indigo-900/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Brain className="w-6 h-6 text-indigo-400" /> AI Study Buddy Matcher
              </h2>
              <p className="text-xs text-indigo-200 mt-1 max-w-xl">
                Our FastAPI intelligence engine matches you with classmates in your college based on complementary skills, course alignment, subject strengths, and study availability overlap.
              </p>
            </div>
            <button
              onClick={handleRunAIPeerMatch}
              disabled={matchingBuddies}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 self-start md:self-center"
            >
              <RefreshCw className={`w-4 h-4 ${matchingBuddies ? 'animate-spin' : ''}`} />
              {matchingBuddies ? 'Matching...' : 'Re-Run AI Matching'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aiMatches.map(match => (
              <div key={match.id} className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex flex-col justify-between hover:shadow-md transition-shadow">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-lg text-gray-900 dark:text-white">{match.name}</h4>
                      <span className="text-[10px] bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-extrabold px-2 py-0.5 rounded uppercase tracking-wider inline-block mt-1">
                        {match.compatibility_score}% Compatibility
                      </span>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Overlap Factors</p>
                    <div className="space-y-1.5 bg-slate-50 dark:bg-dark-bg/40 p-3 rounded-xl border border-slate-100 dark:border-dark-border/20">
                      {match.reasons.map((reason, index) => (
                        <div key={index} className="text-[11px] text-gray-600 dark:text-gray-300 flex items-start gap-1">
                          <span className="text-indigo-500 shrink-0">•</span>
                          <span>{reason}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => requestDirectBuddy(match.id)}
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow"
                >
                  <HeartHandshake className="w-4 h-4" /> Connect Study Buddy
                </button>
              </div>
            ))}
            {aiMatches.length === 0 && !matchingBuddies && (
              <div className="col-span-full py-16 text-center text-gray-400 bg-white dark:bg-dark-card rounded-2xl border border-dashed">
                <Brain className="w-12 h-12 mx-auto mb-3 text-indigo-400" />
                <p className="text-sm font-semibold">No high-compatibility study buddies found in your college yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'study-guides' && (
        !(user?.isPremium || user?.role === 'teacher' || user?.role === 'admin') ? (
          renderPremiumLock("AI Study Guides", "Access automated summaries and chat logs generated from your recorded collaborative study sessions.")
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {studyGuides.length === 0 && (
              <div className="col-span-full py-16 text-center text-gray-400 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm font-semibold">
                📂 No AI study guides recorded yet. Join a workspace and start recording!
              </div>
            )}
            {studyGuides.map(guide => (
              <div key={guide.id} className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-black text-lg text-gray-900 dark:text-white leading-tight">{guide.title}</h3>
                    <span className="text-[10px] text-gray-400 font-bold bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full shrink-0">
                      {new Date(guide.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="space-y-4 mt-4">
                    <div>
                      <span className="text-[10px] font-extrabold text-indigo-500 uppercase block tracking-wider">AI Generated Summary</span>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 leading-relaxed whitespace-pre-line bg-gray-50 dark:bg-slate-800/40 p-3 rounded-xl border border-gray-100 dark:border-slate-800/40 font-medium">
                        {guide.summary}
                      </p>
                    </div>

                    {guide.transcript && (
                      <div>
                        <span className="text-[10px] font-extrabold text-slate-400 uppercase block tracking-wider">Live Chat Log Transcript</span>
                        <details className="mt-1 cursor-pointer">
                          <summary className="text-[10px] text-slate-500 font-bold hover:text-indigo-500 transition-colors">Show full transcript</summary>
                          <pre className="text-[10px] text-gray-500 bg-gray-50 dark:bg-slate-800/20 p-3 rounded-xl border mt-1 max-h-40 overflow-y-auto whitespace-pre-wrap font-mono">
                            {guide.transcript}
                          </pre>
                        </details>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === 'team-builder' && (
        !(user?.isPremium || user?.role === 'teacher' || user?.role === 'admin') ? (
          renderPremiumLock("AI Team Builder", "Access classmate matching and automated recruiting suggestions for project teams and hackathons.")
        ) : (
          <div className="space-y-8 text-left">
            {/* Project invites section */}
            {projectInvites.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-6 rounded-3xl">
                <h3 className="text-lg font-black text-amber-800 dark:text-amber-400 mb-4 flex items-center gap-2">
                  🚀 Project Team Invitations ({projectInvites.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectInvites.map(invite => (
                    <div key={invite.id} className="bg-white dark:bg-dark-card p-5 rounded-2xl shadow-sm border flex flex-col justify-between">
                      <div>
                        <h4 className="font-bold text-base">{invite.ProjectPosting?.title}</h4>
                        <p className="text-xs text-gray-500 mt-1">{invite.ProjectPosting?.description}</p>
                        <p className="text-[10px] text-gray-400 mt-2 font-bold">Created by: {invite.ProjectPosting?.Creator?.name}</p>
                        <p className="text-[10px] text-indigo-500 mt-1 font-bold">Skills Needed: {invite.ProjectPosting?.requiredSkills}</p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => handleRespondToInvite(invite.id, 'accepted')}
                          className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleRespondToInvite(invite.id, 'rejected')}
                          className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Active Project Vacancies</h3>
                <p className="text-xs text-gray-500 mt-1">Form custom teams and match with compatible classmates using AI.</p>
              </div>
              <button
                onClick={() => setShowProjectModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10"
              >
                + Post Project Vacancy
              </button>
            </div>

            {/* Active Projects List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.length === 0 && (
                <div className="col-span-full py-16 text-center text-gray-400 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border font-semibold">
                  📂 No active project vacancies listed. Be the first to post one!
                </div>
              )}
              {projects.map(proj => {
                const isMine = proj.creatorId === user.id;
                return (
                  <div key={proj.id} className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-black text-base text-gray-900 dark:text-white leading-tight">{proj.title}</h4>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${isMine ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/20' : 'bg-gray-100 text-gray-700 dark:bg-slate-800 dark:text-gray-300'}`}>
                          {isMine ? 'My Project' : 'Open Vacancy'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-3 mt-2">{proj.description}</p>
                      
                      <div className="mt-4 space-y-2">
                        <div>
                          <span className="text-[9px] text-gray-400 font-extrabold uppercase block tracking-wider">Required Skills</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {proj.requiredSkills.split(',').map((s, idx) => (
                              <span key={idx} className="text-[10px] bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-bold border dark:border-slate-700">
                                {s.trim()}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between text-[10px] text-gray-400 font-bold pt-2 border-t dark:border-slate-800">
                          <span>Max Team Size: {proj.maxTeamSize}</span>
                          <span>Posted by: {proj.Creator?.name}</span>
                        </div>
                      </div>
                    </div>

                    {isMine && (
                      <button
                        onClick={() => handleRunAIMatch(proj)}
                        className="w-full mt-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5"
                      >
                        ⚡ AI Peer Skill Matcher
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Matcher Results Block */}
            {matchingProject && (
              <div className="bg-slate-50 dark:bg-slate-900/30 p-8 rounded-3xl border dark:border-slate-800 mt-8 relative">
                <button 
                  onClick={() => setMatchingProject(null)}
                  className="absolute top-6 right-6 text-xs text-gray-400 hover:text-gray-600 font-bold"
                >
                  Close Matcher
                </button>
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  🧠 AI Skill Matches for: <span className="text-indigo-600 dark:text-indigo-400">"{matchingProject.title}"</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">AI scans student mentor portfolios and rates their match compatibility.</p>

                {loadingMatches ? (
                  <div className="py-12 text-center text-xs text-gray-400 font-bold animate-pulse">Running AI skill matching scans across class portfolios...</div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {matchedPeers.length === 0 && (
                      <div className="col-span-full py-12 text-center text-xs text-gray-400 italic">No fitting peer matches found with matching skills.</div>
                    )}
                    {matchedPeers.map(peer => (
                      <div key={peer.id} className="bg-white dark:bg-dark-card p-5 rounded-2xl border dark:border-slate-800 shadow-sm flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-bold text-sm text-gray-900 dark:text-white">{peer.name}</h4>
                              <p className="text-[10px] text-gray-400 font-bold">{peer.course}</p>
                            </div>
                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/50 shrink-0">
                              {peer.matchScore}% Match
                            </span>
                          </div>
                          
                          <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-2 bg-indigo-50/40 dark:bg-indigo-950/10 p-2.5 rounded-xl border border-indigo-50 dark:border-slate-800">
                            💡 {peer.matchExplanation}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold mt-2 truncate">Expertise: {peer.expertise}</p>
                        </div>
                        <button
                          onClick={() => handleSendProjectInvite(peer.id)}
                          className="w-full mt-4 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700 text-white rounded-lg text-xs font-bold"
                        >
                          Send Project Invite
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      )}

      {/* Create Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-800">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-2xl font-bold">Post Project Vacancy</h2>
            </div>
            <form onSubmit={handleCreateProject} className="p-6 space-y-4 text-left">
              <div>
                <label className="block text-sm font-bold mb-1">Project Title</label>
                <input 
                  required
                  type="text"
                  value={newProject.title}
                  onChange={e => setNewProject({...newProject, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                  placeholder="e.g. Chatbot App"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Description</label>
                <textarea 
                  required
                  value={newProject.description}
                  onChange={e => setNewProject({...newProject, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                  placeholder="What is this project about?"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Required Skills (Comma separated)</label>
                <input 
                  required
                  type="text"
                  value={newProject.requiredSkills}
                  onChange={e => setNewProject({...newProject, requiredSkills: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                  placeholder="e.g. React, Python, SQL"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Max Team Size</label>
                <input 
                  required
                  type="number"
                  min="2"
                  max="10"
                  value={newProject.maxTeamSize}
                  onChange={e => setNewProject({...newProject, maxTeamSize: Number(e.target.value)})}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none text-xs"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowProjectModal(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-colors text-xs">
                  Cancel
                </button>
                <button type="submit" disabled={creatingProject} className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors text-xs disabled:opacity-50">
                  {creatingProject ? 'Posting...' : 'Create Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showGroupModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-800">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-2xl font-bold">Create Study Group</h2>
            </div>
            <form onSubmit={createGroup} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold mb-1">Subject</label>
                <select 
                  required
                  value={newGroup.subjectId}
                  onChange={e => setNewGroup({...newGroup, subjectId: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Topic / Title</label>
                <input 
                  required
                  type="text"
                  value={newGroup.title}
                  onChange={e => setNewGroup({...newGroup, title: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Midterm Prep"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Description</label>
                <textarea 
                  value={newGroup.description}
                  onChange={e => setNewGroup({...newGroup, description: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="What will you cover?"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-1">Campus Scoping</label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {[
                    { id: 'global', label: '🌐 All Colleges' },
                    { id: 'local', label: '🏫 My College' },
                    { id: 'custom', label: '🤝 Custom List' }
                  ].map(scope => (
                    <button
                      key={scope.id}
                      type="button"
                      onClick={() => {
                        setScopeType(scope.id);
                        if (scope.id === 'global') {
                          setNewGroup({ ...newGroup, targetColleges: [] });
                        } else if (scope.id === 'local') {
                          setNewGroup({ ...newGroup, targetColleges: [user.collegeId] });
                        }
                      }}
                      className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                        scopeType === scope.id
                          ? 'bg-blue-50 border-blue-300 text-blue-600 dark:bg-blue-950/40 dark:border-blue-900'
                          : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 dark:bg-slate-800 dark:border-slate-700 dark:text-gray-400'
                      }`}
                    >
                      {scope.label}
                    </button>
                  ))}
                </div>

                {scopeType === 'custom' && (
                  <div className="p-3 bg-gray-50 dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-800 max-h-36 overflow-y-auto space-y-1.5 custom-scrollbar mb-3">
                    {colleges.map(c => {
                      const isChecked = newGroup.targetColleges?.includes(c.id);
                      return (
                        <label key={c.id} className="flex items-center gap-2 text-xs cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 p-1.5 rounded-lg">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              const updated = isChecked
                                ? newGroup.targetColleges.filter(id => id !== c.id)
                                : [...(newGroup.targetColleges || []), c.id];
                              setNewGroup({ ...newGroup, targetColleges: updated });
                            }}
                            className="rounded text-blue-600 focus:ring-blue-500"
                          />
                          <span className="font-semibold text-gray-700 dark:text-gray-300">{c.name}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-bold mb-1">Date & Time</label>
                <input 
                  type="datetime-local"
                  required
                  value={newGroup.scheduledTime}
                  onChange={e => setNewGroup({...newGroup, scheduledTime: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowGroupModal(false)} className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors">
                  Create Group
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Notes Modal */}
      {showNotesModal && selectedNotesGroup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-800">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">{selectedNotesGroup.title} - Notes</h2>
                <p className="text-sm text-gray-500 mt-1">{selectedNotesGroup.Subject?.name}</p>
              </div>
              <button onClick={() => setShowNotesModal(false)} className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 rounded-xl font-bold">
                Close
              </button>
            </div>
            <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-gray-50 dark:bg-black/20">
              {!selectedNotesGroup.notesData ? (
                <div className="text-center py-12 text-gray-500 italic">No notes were saved for this session.</div>
              ) : selectedNotesGroup.notesData.type === 'image' ? (
                <img src={selectedNotesGroup.notesData.content} alt="Session Board" className="w-full h-auto rounded-lg shadow-sm bg-white" />
              ) : (
                <pre className="whitespace-pre-wrap font-mono text-sm bg-white dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700">
                  {selectedNotesGroup.notesData.content}
                </pre>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyBuddies;
