import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { 
  HeartHandshake, Users, MessageSquare, BookOpen, Clock, Star,
  Search, Plus, Check, Play, MessageCircle, Radio, Lock, Brain, RefreshCw,
  Send, CheckCircle2, UserCheck
} from 'lucide-react';

const StudyBuddies = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1on1'); // 1on1, groups, global-peers, study-guides, team-builder
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

  // Dream Team & Study Guide States
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [generatingGuide, setGeneratingGuide] = useState(false);
  const [newGuide, setNewGuide] = useState({ subject: '', topic: '', customNotes: '' });
  const [assembledTeamData, setAssembledTeamData] = useState(null);
  const [assemblingTeam, setAssemblingTeam] = useState(false);
  const [compatModal, setCompatModal] = useState(null);
  const [applyingToProject, setApplyingToProject] = useState(false);

  // Project Discussion / Chat States
  const [activeChatProject, setActiveChatProject] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [sendingChat, setSendingChat] = useState(false);

  const fetchStudyGuides = async () => {
    try {
      const res = await axios.get('/api/collaboration/study-guides');
      setStudyGuides(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateGuide = async (e) => {
    e.preventDefault();
    setGeneratingGuide(true);
    try {
      await axios.post('/api/collaboration/study-guides/generate', newGuide);
      toast.success('AI Study Guide synthesized successfully!');
      setShowGuideModal(false);
      setNewGuide({ subject: '', topic: '', customNotes: '' });
      fetchStudyGuides();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate study guide');
    } finally {
      setGeneratingGuide(false);
    }
  };

  const handleDeleteGuide = async (guideId) => {
    try {
      await axios.delete(`/api/collaboration/study-guides/${guideId}`);
      toast.success('Study guide removed');
      fetchStudyGuides();
    } catch (err) {
      toast.error('Failed to remove study guide');
    }
  };

  const handleAutoAssembleTeam = async (proj) => {
    setAssemblingTeam(true);
    try {
      const res = await axios.post(`/api/collaboration/projects/${proj.id}/auto-assemble`);
      setAssembledTeamData(res.data);
      toast.success('AI assembled a balanced 4-member project squad!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to auto-assemble team');
    } finally {
      setAssemblingTeam(false);
    }
  };

  const handleCheckCompatibility = async (proj) => {
    try {
      const res = await axios.get(`/api/collaboration/projects/${proj.id}/compatibility`);
      setCompatModal({ project: proj, data: res.data });
    } catch (err) {
      toast.error('Failed to calculate compatibility');
    }
  };

  const handleApplyToProject = async (proj, pitch = '') => {
    setApplyingToProject(true);
    try {
      const res = await axios.post(`/api/collaboration/projects/${proj.id}/apply`, { message: pitch });
      toast.success(res.data.message || `Application sent to ${proj.Creator?.name || 'Project Lead'}!`);
      fetchProjectsAndInvites();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send application');
    } finally {
      setApplyingToProject(false);
    }
  };

  const openProjectChat = async (proj) => {
    setActiveChatProject(proj);
    setLoadingChat(true);
    try {
      const res = await axios.get(`/api/collaboration/projects/${proj.id}/messages`);
      setChatMessages(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load project discussion');
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSendProjectMessage = async (e) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || !activeChatProject) return;
    setSendingChat(true);
    try {
      const res = await axios.post(`/api/collaboration/projects/${activeChatProject.id}/messages`, {
        content: chatInput.trim()
      });
      setChatMessages(prev => [...prev, res.data]);
      setChatInput('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSendingChat(false);
    }
  };

  const handleCopyNotes = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Study guide summary copied to clipboard!');
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
    } catch (err) {
      console.error('Failed to fetch subjects', err);
    }
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

  const renderPremiumBadgeBanner = (title, description) => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 dark:from-amber-950/30 dark:via-orange-950/20 dark:to-transparent border border-amber-300 dark:border-amber-700/60 rounded-2xl mb-6 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl text-xs font-black shadow uppercase tracking-wider flex items-center gap-1.5 shrink-0">
          👑 Premium Feature
        </span>
        <div>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{title}</h4>
          <p className="text-[11px] text-gray-500 dark:text-gray-400">{description}</p>
        </div>
      </div>
      <span className="self-start sm:self-center text-[10px] font-extrabold text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-900/50 px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-700/50 uppercase tracking-wider flex items-center gap-1">
        ✓ Unlocked on this Account
      </span>
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
          <h1 className="text-3xl md:text-4xl font-black mb-3">Study Buddies</h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Connect with peers, join group study sessions, or team up for academic success. 
            All paired with an interactive virtual whiteboard workspace.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 border-b border-gray-200 dark:border-dark-border pb-4">
        {[
          { id: '1on1', label: '1-on-1 Tutoring', icon: <HeartHandshake className="w-4 h-4" />, premium: true },
          { id: 'groups', label: 'Group Study Rooms', icon: <Users className="w-4 h-4" /> },
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
              <span className="text-[9px] bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black px-2 py-0.5 rounded-md uppercase tracking-wider flex items-center gap-1 shadow-sm">
                👑 Premium
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
            {renderPremiumBadgeBanner("1-on-1 Tutoring", "Directly match with top-scoring class mentors for personal learning support.")}
          <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border p-6 max-w-xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Request a Tutor</h2>
            <div className="flex gap-3">
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">{subjects.length === 0 ? 'No subjects found' : 'Select a subject...'}</option>
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
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upcoming Study Groups</h2>
            <button onClick={() => { fetchSubjects(); setShowGroupModal(true); }} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold flex items-center gap-2">
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
            {renderPremiumBadgeBanner("Global Peer Finder", "Find and match with verified topic experts from external partner universities.")}
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

      {activeTab === 'study-guides' && (
        !(user?.isPremium || user?.role === 'teacher' || user?.role === 'admin') ? (
          renderPremiumLock("AI Study Guides", "Access automated summaries and chat logs generated from your recorded collaborative study sessions.")
        ) : (
          <div className="space-y-6 text-left">
            {renderPremiumBadgeBanner("AI Study Guides", "Access automated summaries and chat logs generated from your recorded collaborative study sessions.")}
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900/40 dark:to-indigo-950/20 p-6 rounded-3xl border border-blue-100 dark:border-slate-800">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  📚 AI Synthesized Study Guides
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Instant exam concept summaries, formula derivations, and collaborative discussion transcripts powered by AI.
                </p>
              </div>
              <button
                onClick={() => setShowGuideModal(true)}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-2 shrink-0"
              >
                ✨ Generate AI Study Guide
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {studyGuides.length === 0 && (
                <div className="col-span-full py-16 text-center text-gray-400 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm font-semibold">
                  <p className="text-base mb-3">📁 No AI study guides recorded yet.</p>
                  <button
                    onClick={() => setShowGuideModal(true)}
                    className="px-5 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-all"
                  >
                    ✨ Synthesize First AI Study Guide
                  </button>
                </div>
              )}
              {studyGuides.map(guide => (
                <div key={guide.id} className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm flex flex-col justify-between hover:border-indigo-200 dark:hover:border-indigo-900/50 transition-all">
                  <div>
                    <div className="flex justify-between items-start gap-3 mb-2">
                      <h3 className="font-black text-base text-gray-900 dark:text-white leading-tight">{guide.title}</h3>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => handleCopyNotes(guide.summary)}
                          title="Copy Summary"
                          className="p-1.5 text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 bg-gray-50 dark:bg-slate-800 rounded-lg text-xs"
                        >
                          📋
                        </button>
                        <button
                          onClick={() => handleDeleteGuide(guide.id)}
                          title="Delete Guide"
                          className="p-1.5 text-gray-400 hover:text-rose-600 bg-gray-50 dark:bg-slate-800 rounded-lg text-xs"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    
                    <span className="text-[10px] text-gray-400 font-bold bg-slate-50 dark:bg-slate-800 px-2 py-0.5 rounded-full inline-block mb-3">
                      📅 {new Date(guide.createdAt).toLocaleDateString()}
                    </span>

                    <div className="space-y-4">
                      <div>
                        <span className="text-[10px] font-extrabold text-indigo-500 uppercase block tracking-wider mb-1">
                          🧠 AI Concept & Formula Breakdown
                        </span>
                        <div className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line bg-gray-50/70 dark:bg-slate-800/40 p-4 rounded-2xl border border-gray-100 dark:border-slate-800/50 font-medium">
                          {guide.summary}
                        </div>
                      </div>

                      {guide.transcript && (
                        <div>
                          <details className="mt-1 cursor-pointer group">
                            <summary className="text-[11px] text-slate-500 dark:text-slate-400 font-bold hover:text-indigo-500 transition-colors list-none flex items-center gap-1">
                              <span>💬 View Recorded Peer Session Transcript</span>
                              <span className="text-[9px] group-open:rotate-180 transition-transform">▼</span>
                            </summary>
                            <pre className="text-[10px] text-gray-600 dark:text-gray-400 bg-slate-100/70 dark:bg-slate-900/40 p-3.5 rounded-2xl border dark:border-slate-800 mt-2 max-h-48 overflow-y-auto whitespace-pre-wrap font-mono leading-relaxed">
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
          </div>
        )
      )}

      {activeTab === 'team-builder' && (
        !(user?.isPremium || user?.role === 'teacher' || user?.role === 'admin') ? (
          renderPremiumLock("AI Team Builder", "Access classmate matching and automated recruiting suggestions for project teams and hackathons.")
        ) : (
          <div className="space-y-8 text-left">
            {renderPremiumBadgeBanner("AI Team Builder", "Access classmate matching and automated recruiting suggestions for project teams and hackathons.")}
            
            {/* Project invites & applications banner */}
            {projectInvites.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 p-6 rounded-3xl">
                <h3 className="text-lg font-black text-amber-800 dark:text-amber-400 mb-4 flex items-center gap-2">
                  🚀 Project Team Action Items ({projectInvites.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {projectInvites.map(invite => {
                    const isApplication = invite.type === 'application';
                    return (
                      <div key={invite.id} className="bg-white dark:bg-dark-card p-5 rounded-2xl shadow-sm border flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${
                              isApplication 
                                ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300' 
                                : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            }`}>
                              {isApplication ? '📥 Inbound Application' : '📩 Outbound Invitation'}
                            </span>
                          </div>
                          <h4 className="font-bold text-base text-gray-900 dark:text-white mt-1">{invite.ProjectPosting?.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{invite.ProjectPosting?.description}</p>
                          {isApplication ? (
                            <div className="mt-2 text-[11px] bg-slate-50 dark:bg-slate-800 p-2.5 rounded-xl border dark:border-slate-700">
                              <p className="font-bold text-gray-700 dark:text-gray-300">
                                Applicant: <span className="text-blue-600 dark:text-blue-400">{invite.Invitee?.name}</span> ({invite.Invitee?.course} • Roll: {invite.Invitee?.rollNo || 'N/A'})
                              </p>
                              {invite.message && (
                                <p className="text-[10px] text-gray-500 mt-1 italic">"{invite.message}"</p>
                              )}
                            </div>
                          ) : (
                            <p className="text-[10px] text-gray-400 mt-2 font-bold">
                              Invited by Team Lead: <span className="text-blue-600">{invite.ProjectPosting?.Creator?.name}</span>
                            </p>
                          )}
                          <p className="text-[10px] text-indigo-500 mt-1 font-bold">Skills Needed: {invite.ProjectPosting?.requiredSkills}</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleRespondToInvite(invite.id, 'accepted')}
                            className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                          >
                            ✓ Accept
                          </button>
                          <button
                            onClick={() => handleRespondToInvite(invite.id, 'rejected')}
                            className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-bold transition-all"
                          >
                            ✕ Decline
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Active Project Vacancies</h3>
                <p className="text-xs text-gray-500 mt-1">Form custom teams and match with compatible classmates using AI.</p>
              </div>
              <div className="flex gap-2.5">
                <button
                  onClick={() => setShowProjectModal(true)}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10"
                >
                  + Post Project Vacancy
                </button>
              </div>
            </div>

            {/* Active Projects List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.length === 0 && (
                <div className="col-span-full py-16 text-center text-gray-400 bg-white dark:bg-dark-card rounded-3xl border border-gray-100 dark:border-dark-border font-semibold">
                  📂 No active project vacancies listed. Be the first to post one!
                </div>
              )}
              {projects.map(proj => {
                const isMine = proj.creatorId === user?.id;
                const myInvite = proj.ProjectInvites?.find(inv => inv.inviteeId === user?.id);
                const isApplied = myInvite?.status === 'pending';
                const isAccepted = myInvite?.status === 'accepted';
                const isTeamMember = isMine || isAccepted;

                // Accepted squad members (excluding creator, who is lead)
                const acceptedMembers = proj.ProjectInvites?.filter(inv => inv.status === 'accepted') || [];
                // Pending applications submitted to this project (relevant for creator)
                const pendingApplications = isMine ? (proj.ProjectInvites?.filter(inv => inv.status === 'pending' && inv.type === 'application') || []) : [];
                const currentTeamCount = acceptedMembers.length + 1; // +1 for Creator
                const isTeamFull = currentTeamCount >= (proj.maxTeamSize || 4);

                return (
                  <div key={proj.id} className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm flex flex-col justify-between hover:border-blue-200 dark:hover:border-blue-900/50 transition-all">
                    <div>
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h4 className="font-black text-base text-gray-900 dark:text-white leading-tight">{proj.title}</h4>
                        <span className={`text-[9px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                          isMine 
                            ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800' 
                            : isAccepted
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800'
                              : isApplied
                                ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800'
                                : 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800'
                        }`}>
                          {isMine ? '👑 My Project (Lead)' : isAccepted ? '🎉 Team Member' : isApplied ? '✓ Applied (Pending)' : 'Open Vacancy'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-3 mt-2 leading-relaxed">{proj.description}</p>
                      
                      <div className="mt-4 space-y-3">
                        <div>
                          <span className="text-[9px] text-gray-400 font-extrabold uppercase block tracking-wider">Required Skills</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {proj.requiredSkills?.split(',').map((s, idx) => (
                              <span key={idx} className="text-[10px] bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md font-bold border dark:border-slate-700">
                                {s.trim()}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Confirmed Team Squad Roster */}
                        <div className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border dark:border-slate-800">
                          <div className="flex justify-between items-center text-[10px] font-extrabold mb-1.5">
                            <span className="text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                              👥 Team Members ({currentTeamCount}/{proj.maxTeamSize || 4})
                            </span>
                            {isTeamFull && (
                              <span className="text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded font-black text-[9px]">
                                Team Full
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {/* Project Creator / Lead */}
                            <span className="inline-flex items-center gap-1 text-[10px] bg-blue-100/70 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded-lg font-bold border border-blue-200 dark:border-blue-800">
                              👑 {proj.Creator?.name || 'Lead'} (Lead)
                            </span>
                            {/* Accepted Members */}
                            {acceptedMembers.map(m => (
                              <span key={m.id} className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-lg font-bold border border-emerald-200 dark:border-emerald-800">
                                👤 {m.Invitee?.name || 'Member'}
                              </span>
                            ))}
                            {acceptedMembers.length === 0 && (
                              <span className="text-[10px] text-gray-400 italic">No members joined yet</span>
                            )}
                          </div>
                        </div>

                        {/* Incoming Applications for Creator Review */}
                        {isMine && pendingApplications.length > 0 && (
                          <div className="p-3 bg-amber-50/70 dark:bg-amber-950/30 rounded-2xl border border-amber-200/80 dark:border-amber-900/60 space-y-2">
                            <span className="text-[10px] font-extrabold text-amber-800 dark:text-amber-400 uppercase tracking-wider block">
                              📥 Incoming Applications ({pendingApplications.length})
                            </span>
                            <div className="space-y-2 max-h-36 overflow-y-auto">
                              {pendingApplications.map(app => (
                                <div key={app.id} className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-amber-100 dark:border-slate-800 text-xs">
                                  <div className="flex justify-between items-start gap-1">
                                    <div>
                                      <strong className="text-gray-900 dark:text-white font-bold">{app.Invitee?.name}</strong>
                                      <p className="text-[9px] text-gray-400">{app.Invitee?.course} • Roll: {app.Invitee?.rollNo || 'N/A'}</p>
                                    </div>
                                    <div className="flex gap-1 shrink-0">
                                      <button
                                        onClick={() => handleRespondToInvite(app.id, 'accepted')}
                                        className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[10px] font-bold"
                                        title="Accept application"
                                      >
                                        ✓ Accept
                                      </button>
                                      <button
                                        onClick={() => handleRespondToInvite(app.id, 'rejected')}
                                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 text-gray-600 dark:text-gray-300 rounded-md text-[10px] font-bold"
                                        title="Decline application"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  </div>
                                  {app.message && (
                                    <p className="text-[10px] text-gray-500 mt-1 italic line-clamp-2">"{app.message}"</p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-5 space-y-2">
                      {/* Project Team Chat Button (for Creator + Accepted Members) */}
                      {isTeamMember && (
                        <button
                          onClick={() => openProjectChat(proj)}
                          className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-emerald-500/10 flex items-center justify-center gap-1.5"
                        >
                          💬 Project Team Discussion & Chat
                        </button>
                      )}

                      {isMine ? (
                        <>
                          <button
                            onClick={() => handleRunAIMatch(proj)}
                            className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10 flex items-center justify-center gap-1.5"
                          >
                            ⚡ AI Peer Skill Matcher
                          </button>
                          <button
                            onClick={() => handleAutoAssembleTeam(proj)}
                            disabled={assemblingTeam}
                            className="w-full py-2 bg-purple-50 dark:bg-purple-950/30 hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                          >
                            🤖 {assemblingTeam ? 'Assembling Squad...' : 'Auto-Assemble Dream Team'}
                          </button>
                        </>
                      ) : !isAccepted ? (
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleCheckCompatibility(proj)}
                            className="py-2.5 bg-indigo-50 dark:bg-indigo-950/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1"
                          >
                            ⚡ Check Match
                          </button>
                          {isApplied ? (
                            <button
                              disabled
                              className="py-2.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center justify-center gap-1 cursor-default opacity-90"
                            >
                              ✓ Applied
                            </button>
                          ) : isTeamFull ? (
                            <button
                              disabled
                              className="py-2.5 rounded-xl text-xs font-bold bg-gray-100 dark:bg-slate-800 text-gray-400 dark:text-gray-500 flex items-center justify-center gap-1 cursor-not-allowed"
                            >
                              Team Full
                            </button>
                          ) : (
                            <button
                              onClick={() => handleApplyToProject(proj)}
                              disabled={applyingToProject}
                              className="py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md shadow-blue-500/10"
                            >
                              🤝 Join Team
                            </button>
                          )}
                        </div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI Auto-Assembled Dream Team Modal / Panel */}
            {assembledTeamData && (
              <div className="bg-gradient-to-br from-purple-50 via-indigo-50/40 to-blue-50 dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 p-8 rounded-3xl border-2 border-purple-200 dark:border-purple-900/50 relative shadow-xl">
                <button 
                  onClick={() => setAssembledTeamData(null)}
                  className="absolute top-6 right-6 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 font-bold bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border"
                >
                  ✕ Close Squad
                </button>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-6">
                  <div>
                    <span className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest bg-purple-100 dark:bg-purple-950/50 px-3 py-1 rounded-full border border-purple-200 dark:border-purple-800">
                      AI Assembled Squad
                    </span>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white mt-2">
                      Dream Team for: <span className="text-purple-600 dark:text-purple-400">"{assembledTeamData.project?.title}"</span>
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{assembledTeamData.teamSynergyScore}%</span>
                    <span className="block text-[10px] font-bold text-gray-400 uppercase">Team Synergy Score</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {assembledTeamData.assembledTeam?.map((member, idx) => (
                    <div key={idx} className="bg-white dark:bg-dark-card p-5 rounded-2xl border border-purple-100 dark:border-slate-800 shadow-sm flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">{member.role}</span>
                          <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                            {member.compatibilityScore}%
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white mt-1">{member.student?.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold">{member.student?.course} (Roll: {member.student?.rollNo || 'N/A'})</p>
                        
                        <div className="flex flex-wrap gap-1 mt-2">
                          {member.targetSkills?.slice(0, 3).map((sk, sidx) => (
                            <span key={sidx} className="text-[9px] bg-slate-50 dark:bg-slate-800 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300 font-semibold border">
                              {sk}
                            </span>
                          ))}
                        </div>

                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-3 bg-purple-50/50 dark:bg-purple-950/20 p-2 rounded-xl border border-purple-100/50 dark:border-slate-800">
                          💡 {member.reason}
                        </p>
                      </div>

                      <button
                        onClick={() => handleSendProjectInvite(member.student?.id)}
                        className="w-full mt-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold shadow-sm"
                      >
                        🚀 Invite Member
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Matcher Results Block */}
            {matchingProject && (
              <div className="bg-slate-50 dark:bg-slate-900/30 p-8 rounded-3xl border dark:border-slate-800 mt-8 relative">
                <button 
                  onClick={() => setMatchingProject(null)}
                  className="absolute top-6 right-6 text-xs text-gray-400 hover:text-gray-600 font-bold bg-white dark:bg-slate-800 px-3 py-1.5 rounded-xl border"
                >
                  ✕ Close Matcher
                </button>
                <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                  🧠 AI Skill Matches for: <span className="text-indigo-600 dark:text-indigo-400">"{matchingProject.title}"</span>
                </h3>
                <p className="text-xs text-gray-400 mt-1">AI evaluates student profiles, skill synergy, and historical project contributions.</p>

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
                              <p className="text-[10px] text-gray-400 font-bold">{peer.course} (Roll: {peer.rollNo || 'N/A'})</p>
                            </div>
                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/50 shrink-0">
                              {peer.matchScore}% Match
                            </span>
                          </div>
                          
                          <p className="text-[11px] text-gray-600 dark:text-gray-400 mt-2 bg-indigo-50/40 dark:bg-indigo-950/10 p-2.5 rounded-xl border border-indigo-50 dark:border-slate-800">
                            💡 {peer.matchExplanation}
                          </p>
                          <p className="text-[10px] text-gray-400 font-bold mt-2 truncate">Skills: {peer.expertise}</p>
                        </div>
                        {matchingProject.creatorId === user?.id ? (
                          <button
                            onClick={() => handleSendProjectInvite(peer.id)}
                            className="w-full mt-4 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-primary-600 dark:hover:bg-primary-700 text-white rounded-lg text-xs font-bold transition-all shadow-sm"
                          >
                            Send Project Invite
                          </button>
                        ) : (
                          <p className="text-[10px] text-gray-400 italic text-center mt-3">Only project creator can send invites</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )
      )}

      {/* Compatibility Modal */}
      {compatModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-800 p-6 text-left space-y-4">
            <div className="flex justify-between items-center border-b pb-3 dark:border-slate-800">
              <h3 className="text-lg font-black text-gray-900 dark:text-white">Skill Compatibility Analysis</h3>
              <button onClick={() => setCompatModal(null)} className="text-gray-400 hover:text-gray-600 text-sm font-bold">✕</button>
            </div>
            <div>
              <span className="text-xs text-gray-400 font-bold">Target Project:</span>
              <h4 className="text-base font-bold text-blue-600 dark:text-blue-400">{compatModal.project?.title}</h4>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/20 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 flex justify-between items-center">
              <div>
                <span className="text-xs font-bold text-emerald-800 dark:text-emerald-300">Your AI Match Score</span>
                <p className="text-[10px] text-emerald-600">Based on your skills & coursework</p>
              </div>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{compatModal.data?.matchScore}%</span>
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block mb-1">Recommended Application Pitch</span>
              <p className="text-xs bg-gray-50 dark:bg-slate-800 p-3 rounded-xl border text-gray-700 dark:text-gray-300 font-medium">
                "{compatModal.data?.recommendedPitch}"
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => {
                  handleApplyToProject(compatModal.project, compatModal.data?.recommendedPitch);
                  setCompatModal(null);
                }}
                className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/10"
              >
                🤝 Submit Application
              </button>
              <button
                onClick={() => setCompatModal(null)}
                className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Generate AI Study Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-800">
            <div className="p-6 border-b border-gray-100 dark:border-slate-800">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                ✨ Generate AI Study Guide
              </h2>
              <p className="text-xs text-gray-400 mt-1">AI synthesizes concepts, formulas, exam tips & live peer transcripts.</p>
            </div>
            <form onSubmit={handleGenerateGuide} className="p-6 space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold mb-1 text-gray-700 dark:text-gray-300">Subject / Course</label>
                <select
                  value={newGuide.subject}
                  onChange={e => setNewGuide({ ...newGuide, subject: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none text-xs font-medium"
                >
                  <option value="">Choose a Subject (or enter custom topic)</option>
                  {subjects.map(s => (
                    <option key={s.id} value={s.name}>{s.name} ({s.code})</option>
                  ))}
                  <option value="Computer Science">Computer Science Core</option>
                  <option value="Web Technologies">Web Technologies</option>
                  <option value="Database Systems">Database Systems</option>
                  <option value="Operating Systems">Operating Systems</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-gray-700 dark:text-gray-300">Topic / Chapter Heading *</label>
                <input 
                  required
                  type="text"
                  value={newGuide.topic}
                  onChange={e => setNewGuide({ ...newGuide, topic: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none text-xs font-medium"
                  placeholder="e.g. Relational Normalization (3NF & BCNF)"
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1 text-gray-700 dark:text-gray-300">Custom Notes / Focus Areas (Optional)</label>
                <textarea 
                  value={newGuide.customNotes}
                  onChange={e => setNewGuide({ ...newGuide, customNotes: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none text-xs font-medium"
                  placeholder="Mention any specific formulas or questions you want emphasized..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowGuideModal(false)} 
                  className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl transition-colors text-xs"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={generatingGuide} 
                  className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl transition-all text-xs disabled:opacity-50 shadow-md shadow-blue-500/20"
                >
                  {generatingGuide ? '⚡ Synthesizing with AI...' : '✨ Generate Guide'}
                </button>
              </div>
            </form>
          </div>
        </div>
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
                  <option value="">{subjects.length === 0 ? 'No subjects found' : 'Select Subject'}</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
                </select>
                {subjects.length === 0 && (
                  <p className="text-xs text-amber-500 mt-1 font-medium">No subjects found for your class/course.</p>
                )}
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

      {/* Project Team Discussion / Chat Modal */}
      {activeChatProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl h-[620px] flex flex-col shadow-2xl overflow-hidden border border-gray-200 dark:border-slate-800 animate-in fade-in duration-200">
            {/* Chat Modal Header */}
            <div className="p-5 border-b border-gray-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/70 dark:bg-slate-900/90">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">💬</span>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white leading-tight">
                    {activeChatProject.title}
                  </h3>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Project Team Discussion & Collaboration</p>
              </div>
              <button
                onClick={() => {
                  setActiveChatProject(null);
                  setChatMessages([]);
                }}
                className="px-3.5 py-1.5 text-xs text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white font-bold bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 transition-colors"
              >
                ✕ Close
              </button>
            </div>

            {/* Team Roster Strip */}
            <div className="px-5 py-2.5 bg-slate-100/70 dark:bg-slate-800/50 border-b border-gray-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] custom-scrollbar">
              <span className="font-extrabold text-gray-400 uppercase tracking-wider text-[9px] shrink-0">Team:</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-900 shrink-0">
                👑 {activeChatProject.Creator?.name || 'Lead'} (Lead)
              </span>
              {activeChatProject.ProjectInvites?.filter(inv => inv.status === 'accepted').map(mem => (
                <span key={mem.id} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 shrink-0">
                  👤 {mem.Invitee?.name || 'Member'}
                </span>
              ))}
            </div>

            {/* Messages Scroll View */}
            <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-gray-50/40 dark:bg-slate-950/40 custom-scrollbar">
              {loadingChat ? (
                <div className="py-24 text-center text-xs text-gray-400 font-bold animate-pulse">
                  Loading team discussion messages...
                </div>
              ) : chatMessages.length === 0 ? (
                <div className="py-24 text-center text-gray-400">
                  <div className="text-3xl mb-2">💬</div>
                  <p className="font-bold text-sm text-gray-700 dark:text-gray-300">No discussion messages yet.</p>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                    Say hello to your project teammates! Coordinate tech stacks, assign modules, and share progress updates.
                  </p>
                </div>
              ) : (
                chatMessages.map(msg => {
                  const isMe = msg.senderId === user?.id;
                  const isLead = msg.senderId === activeChatProject.creatorId;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1">
                        <span className="text-[10px] font-bold text-gray-700 dark:text-gray-300">
                          {isMe ? 'You' : msg.Sender?.name || 'Teammate'}
                        </span>
                        <span className={`text-[8px] font-black px-1.5 py-0.5 rounded ${
                          isLead
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}>
                          {isLead ? 'Lead' : 'Member'}
                        </span>
                        <span className="text-[9px] text-gray-400">
                          {msg.createdAt ? format(new Date(msg.createdAt), 'h:mm a') : ''}
                        </span>
                      </div>
                      <div
                        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-xs font-medium leading-relaxed break-words shadow-sm ${
                          isMe
                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-sm'
                            : 'bg-white dark:bg-slate-800 text-gray-900 dark:text-white border border-gray-100 dark:border-slate-700 rounded-bl-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendProjectMessage} className="p-4 border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Talk about the project, share ideas, or post links... (Enter to send)"
                className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none text-xs"
              />
              <button
                type="submit"
                disabled={sendingChat || !chatInput.trim()}
                className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl text-xs transition-all disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-blue-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                {sendingChat ? 'Sending...' : 'Send'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyBuddies;
