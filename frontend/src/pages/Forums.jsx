import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { MessageSquare, ThumbsUp, CheckCircle, Plus, X, Tag, Search, Filter } from 'lucide-react';

const tagColors = {
  doubt: 'bg-red-100 text-red-700',
  resource: 'bg-blue-100 text-blue-700',
  'exam-prep': 'bg-purple-100 text-purple-700',
  discussion: 'bg-green-100 text-green-700',
  announcement: 'bg-orange-100 text-orange-700',
};

const Forums = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [forums, setForums] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newPost, setNewPost] = useState({ subjectId: '', title: '', content: '', tag: 'doubt' });
  const [replyMap, setReplyMap] = useState({});
  const [search, setSearch] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [solvedFilter, setSolvedFilter] = useState('');
  const [expanded, setExpanded] = useState({});

  useEffect(() => { fetchSubjects(); fetchForums(); }, []);

  const fetchSubjects = async () => { try { const r = await axios.get('/api/subjects'); setSubjects(r.data); } catch {} };
  const fetchForums = async () => { try { const r = await axios.get('/api/collaboration/forums'); setForums(r.data); } catch {} };

  const createPost = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/collaboration/forums', newPost);
      toast.success('Question posted!');
      setShowModal(false);
      setNewPost({ subjectId: '', title: '', content: '', tag: 'doubt' });
      fetchForums();
    } catch { toast.error('Failed to post'); }
  };

  const reply = async (postId) => {
    const content = replyMap[postId];
    if (!content?.trim()) return;
    try {
      await axios.post(`/api/collaboration/forums/${postId}/reply`, { content });
      setReplyMap(p => ({ ...p, [postId]: '' }));
      fetchForums();
    } catch {}
  };

  const upvote = async (postId) => {
    try { await axios.put(`/api/collaboration/forums/${postId}/upvote`); fetchForums(); } catch {}
  };

  const markSolved = async (postId) => {
    try { await axios.put(`/api/collaboration/forums/${postId}/solve`); fetchForums(); } catch {}
  };

  const markAnswer = async (postId, replyId) => {
    try { await axios.put(`/api/collaboration/forums/${postId}/replies/${replyId}/answer`); fetchForums(); } catch {}
  };

  const deletePost = async (postId) => {
    try { await axios.delete(`/api/collaboration/forums/${postId}`); fetchForums(); toast.success('Deleted'); } catch {}
  };

  const filtered = forums.filter(p => {
    const q = search.toLowerCase();
    const matchSearch = !search || p.title?.toLowerCase().includes(q) || p.content?.toLowerCase().includes(q) || p.Author?.name?.toLowerCase().includes(q);
    const matchTag = !tagFilter || p.tag === tagFilter;
    const matchSolved = !solvedFilter || (solvedFilter === 'solved' ? p.isSolved : !p.isSolved);
    return matchSearch && matchTag && matchSolved;
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-dark-card p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1 flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-indigo-500" /> Subject Forums
          </h1>
          <p className="text-gray-500">Ask questions, share insights, discuss with peers.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 dark:shadow-none">
          <Plus className="w-5 h-5" /> Ask a Question
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search questions..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <select value={tagFilter} onChange={e => setTagFilter(e.target.value)}
          className="md:w-36 px-4 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl outline-none">
          <option value="">All Tags</option>
          {['doubt','resource','exam-prep','discussion','announcement'].map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={solvedFilter} onChange={e => setSolvedFilter(e.target.value)}
          className="md:w-36 px-4 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl outline-none">
          <option value="">All Status</option>
          <option value="solved">Solved</option>
          <option value="unsolved">Unsolved</option>
        </select>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {filtered.length === 0 && (
          <div className="py-20 text-center text-gray-400 bg-white dark:bg-dark-card rounded-3xl border border-dashed border-gray-200">
            <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg">No questions found.</p>
          </div>
        )}
        {filtered.map(post => (
          <div key={post.id} className={`bg-white dark:bg-dark-card rounded-2xl shadow-sm border transition-all ${post.isSolved ? 'border-green-200 dark:border-green-900/40' : 'border-gray-100 dark:border-dark-border'}`}>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold shrink-0 text-lg">
                  {post.Author?.name?.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{post.title}</h3>
                    <div className="flex items-center gap-2 shrink-0">
                      {post.isSolved && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" />Solved</span>}
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${tagColors[post.tag] || 'bg-gray-100 text-gray-600'}`}>{post.tag}</span>
                      <span className="text-xs bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">{post.Subject?.code}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mb-3">By {post.Author?.name} • {format(new Date(post.createdAt), 'MMM d, h:mm a')}</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4">{post.content}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mb-4">
                    <button onClick={() => upvote(post.id)} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
                      <ThumbsUp className="w-4 h-4" /> {post.upvotes || 0}
                    </button>
                    <button onClick={() => setExpanded(p => ({ ...p, [post.id]: !p[post.id] }))} className="text-xs text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium transition-colors">
                      <MessageSquare className="w-4 h-4 inline mr-1" />{post.ForumReplies?.length || 0} replies
                    </button>
                    {(post.userId === user?.id || user?.role === 'admin' || user?.role === 'teacher') && (
                      <button onClick={() => markSolved(post.id)} className={`text-xs font-medium transition-colors ${post.isSolved ? 'text-green-600 hover:text-red-500' : 'text-gray-500 hover:text-green-600'}`}>
                        <CheckCircle className="w-4 h-4 inline mr-1" />{post.isSolved ? 'Unmark Solved' : 'Mark Solved'}
                      </button>
                    )}
                    {(post.userId === user?.id || user?.role === 'admin') && (
                      <button onClick={() => deletePost(post.id)} className="text-xs text-gray-400 hover:text-red-500 transition-colors ml-auto">Delete</button>
                    )}
                  </div>

                  {/* Replies */}
                  {(expanded[post.id] || post.ForumReplies?.length > 0) && (
                    <div className="pl-4 border-l-2 border-indigo-100 dark:border-indigo-900/30 space-y-3 mb-4">
                      {post.ForumReplies?.map(reply => (
                        <div key={reply.id} className={`text-sm p-3 rounded-xl ${reply.isAnswer ? 'bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800' : 'bg-gray-50 dark:bg-slate-800/50'}`}>
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-gray-900 dark:text-white mr-2">{reply.Author?.name}:</span>
                            {reply.isAnswer && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-bold">✓ Best Answer</span>}
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mt-1">{reply.content}</p>
                          {(user?.role === 'teacher' || user?.role === 'admin' || post.userId === user?.id) && (
                            <button onClick={() => markAnswer(post.id, reply.id)} className="text-xs text-gray-400 hover:text-green-600 mt-1 transition-colors">
                              {reply.isAnswer ? 'Unmark Answer' : '✓ Mark as Answer'}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Reply Input */}
                  <div className="flex gap-2">
                    <input type="text" placeholder="Write a reply..." value={replyMap[post.id] || ''}
                      onChange={e => setReplyMap(p => ({ ...p, [post.id]: e.target.value }))}
                      onKeyDown={e => e.key === 'Enter' && reply(post.id)}
                      className="flex-1 px-4 py-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-xl dark:bg-slate-800 outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-slate-900/50" />
                    <button onClick={() => reply(post.id)} className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-xl font-bold">Reply</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Post Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl w-full max-w-lg border border-gray-100 dark:border-slate-800 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black">Ask a Question</h2>
              <button onClick={() => setShowModal(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <form onSubmit={createPost} className="space-y-4">
              <select required value={newPost.subjectId} onChange={e => setNewPost({...newPost, subjectId: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700">
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="Question Title" value={newPost.title} onChange={e => setNewPost({...newPost, title: e.target.value})}
                  className="col-span-2 px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" />
                <select value={newPost.tag} onChange={e => setNewPost({...newPost, tag: e.target.value})}
                  className="px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700">
                  <option value="doubt">Doubt</option>
                  <option value="resource">Resource</option>
                  <option value="exam-prep">Exam Prep</option>
                  <option value="discussion">Discussion</option>
                  <option value="announcement">Announcement</option>
                </select>
              </div>
              <textarea required placeholder="Explain your question in detail..." rows={5}
                value={newPost.content} onChange={e => setNewPost({...newPost, content: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" />
              <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-800">
                <button type="button" onClick={() => setShowModal(false)} className="px-5 py-2 font-bold text-gray-500">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl">Post Question</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forums;
