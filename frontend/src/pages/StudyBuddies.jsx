import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { 
  HeartHandshake, Users, MessageSquare, BookOpen, Clock, Star,
  Search, Plus, Check, Play, MessageCircle, Radio
} from 'lucide-react';

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

  // Modals / Forms
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');
  
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [newGroup, setNewGroup] = useState({ subjectId: '', title: '', description: '', scheduledTime: '' });
  
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedNotesGroup, setSelectedNotesGroup] = useState(null);

  const [showForumModal, setShowForumModal] = useState(false);
  const [newPost, setNewPost] = useState({ subjectId: '', title: '', content: '' });

  useEffect(() => {
    fetchSubjects();
    if (activeTab === '1on1') fetch1on1();
    if (activeTab === 'groups') fetchGroups();
    if (activeTab === 'forums') fetchForums();
    if (activeTab === 'global-peers') setGlobalMatches([]);
  }, [activeTab]);

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
      setNewGroup({ subjectId: '', title: '', description: '', scheduledTime: '' });
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
          { id: '1on1', label: '1-on-1 Tutoring', icon: <HeartHandshake className="w-4 h-4" /> },
          { id: 'groups', label: 'Group Study Rooms', icon: <Users className="w-4 h-4" /> },
          { id: 'global-peers', label: 'Global Peer Finder', icon: <Search className="w-4 h-4" /> }
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
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ======================= */}
      {/* 1-on-1 TAB              */}
      {/* ======================= */}
      {activeTab === '1on1' && (
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
      )}

      {/* ======================= */}
      {/* GROUPS TAB                */}
      {/* ======================= */}
      {activeTab === 'groups' && (
        <div className="space-y-6">
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
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 bg-red-50 dark:bg-red-500/10 px-2 py-0.5 rounded-full border border-red-100 dark:border-red-500/20 shadow-sm animate-pulse">
                        <Radio className="w-3 h-3" /> LIVE
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
