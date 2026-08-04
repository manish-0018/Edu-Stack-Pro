import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Megaphone, Pin, PinOff, Trash2, Plus, X, Tag } from 'lucide-react';

const categoryColors = {
  Exam: 'bg-red-100 text-red-700 border-red-200',
  Holiday: 'bg-green-100 text-green-700 border-green-200',
  Event: 'bg-blue-100 text-blue-700 border-blue-200',
  Fee: 'bg-orange-100 text-orange-700 border-orange-200',
  Result: 'bg-purple-100 text-purple-700 border-purple-200',
  General: 'bg-gray-100 text-gray-700 border-gray-200',
};

const categoryIcons = { Exam: '📝', Holiday: '🏖️', Event: '🎉', Fee: '💰', Result: '🏆', General: '📣' };

const Announcements = () => {
  const { user } = useAuth();
  const canPost = user?.role === 'admin';
  const isAdmin = user?.role === 'admin';
  const [announcements, setAnnouncements] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [form, setForm] = useState({ title: '', content: '', category: 'General', expiresAt: '', targetRole: 'all' });

  useEffect(() => { fetchAnnouncements(); }, [categoryFilter]);

  const fetchAnnouncements = async () => {
    try {
      const params = categoryFilter ? `?category=${categoryFilter}` : '';
      const r = await axios.get(`/api/announcements${params}`);
      setAnnouncements(r.data);
    } catch {}
  };

  const createAnnouncement = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/announcements', form);
      toast.success('Announcement posted!');
      setShowCreate(false);
      setForm({ title: '', content: '', category: 'General', expiresAt: '', targetRole: 'all' });
      fetchAnnouncements();
    } catch (err) { toast.error('Failed to post'); }
  };

  const togglePin = async (id) => {
    try { await axios.put(`/api/announcements/${id}/pin`); fetchAnnouncements(); } catch {}
  };

  const deleteAnn = async (id) => {
    try { await axios.delete(`/api/announcements/${id}`); toast.success('Deleted'); fetchAnnouncements(); } catch {}
  };

  const pinned = announcements.filter(a => a.isPinned);
  const regular = announcements.filter(a => !a.isPinned);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black mb-1 flex items-center gap-3"><Megaphone className="w-8 h-8" />Announcements</h1>
          <p className="opacity-80">College-wide notices, events, and updates.</p>
        </div>
        {canPost && (
          <button onClick={() => setShowCreate(true)} className="px-6 py-3 bg-white text-orange-600 rounded-xl font-bold flex items-center gap-2 hover:bg-orange-50 shadow">
            <Plus className="w-5 h-5" /> Post Notice
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {['', 'Exam', 'Holiday', 'Event', 'Fee', 'Result', 'General'].map(cat => (
          <button key={cat} onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${categoryFilter === cat ? 'bg-orange-500 text-white' : 'bg-white dark:bg-dark-card text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-dark-border hover:bg-gray-50'}`}>
            {cat ? `${categoryIcons[cat]} ${cat}` : 'All'}
          </button>
        ))}
      </div>

      {/* Pinned Announcements */}
      {pinned.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-orange-600">
            <Pin className="w-4 h-4" /> PINNED
          </div>
          {pinned.map(ann => <AnnouncementCard key={ann.id} ann={ann} isAdmin={isAdmin} canPost={canPost} onPin={togglePin} onDelete={deleteAnn} />)}
        </div>
      )}

      {/* Regular Announcements */}
      {regular.length > 0 && (
        <div className="space-y-3">
          {pinned.length > 0 && <div className="text-sm font-bold text-gray-400">RECENT</div>}
          {regular.map(ann => <AnnouncementCard key={ann.id} ann={ann} isAdmin={isAdmin} canPost={canPost} onPin={togglePin} onDelete={deleteAnn} />)}
        </div>
      )}

      {announcements.length === 0 && (
        <div className="py-20 text-center text-gray-400 bg-white dark:bg-dark-card rounded-3xl border border-dashed border-gray-200">
          <Megaphone className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg">No announcements yet.</p>
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl w-full max-w-lg shadow-2xl border dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black">New Announcement</h2>
              <button onClick={() => setShowCreate(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <form onSubmit={createAnnouncement} className="space-y-4">
              <input required placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-orange-500" />
              <textarea required placeholder="Content" rows={5} value={form.content} onChange={e => setForm({...form, content: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-orange-500" />
              <div className="grid grid-cols-2 gap-3">
                <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                  className="px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700">
                  {['Exam','Holiday','Event','Fee','Result','General'].map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <select value={form.targetRole} onChange={e => setForm({...form, targetRole: e.target.value})}
                  className="px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700">
                  <option value="all">All Users</option>
                  <option value="student">Students Only</option>
                  <option value="teacher">Teachers Only</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Expires At (optional)</label>
                <input type="datetime-local" value={form.expiresAt} onChange={e => setForm({...form, expiresAt: e.target.value})}
                  className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-orange-500" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-800">
                <button type="button" onClick={() => setShowCreate(false)} className="px-5 py-2 font-bold text-gray-500">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl">Post</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const AnnouncementCard = ({ ann, isAdmin, canPost, onPin, onDelete }) => (
  <div className={`bg-white dark:bg-dark-card rounded-2xl border shadow-sm p-6 transition-all ${ann.isPinned ? 'border-orange-200 dark:border-orange-800 bg-orange-50/30 dark:bg-orange-900/5' : 'border-gray-100 dark:border-dark-border'}`}>
    <div className="flex justify-between items-start gap-4">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          {ann.isPinned && <span className="text-xs font-black text-orange-500 flex items-center gap-1"><Pin className="w-3 h-3" />PINNED</span>}
          <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold border ${categoryColors[ann.category]}`}>
            {categoryIcons[ann.category]} {ann.category}
          </span>
          {ann.targetRole !== 'all' && <span className="text-xs bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">{ann.targetRole}s only</span>}
        </div>
        <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">{ann.title}</h3>
        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-3">{ann.content}</p>
        <div className="flex items-center gap-4 text-xs text-gray-400">
          <span>By {ann.PostedBy?.name}</span>
          <span>{format(new Date(ann.createdAt), 'dd MMM yyyy, h:mm a')}</span>
          {ann.expiresAt && <span className="text-orange-500">Expires {format(new Date(ann.expiresAt), 'dd MMM')}</span>}
        </div>
      </div>
      {(isAdmin || canPost) && (
        <div className="flex gap-2 shrink-0">
          {isAdmin && (
            <button onClick={() => onPin(ann.id)} className={`p-2 rounded-xl transition-all ${ann.isPinned ? 'bg-orange-100 text-orange-600 hover:bg-orange-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700'}`}>
              {ann.isPinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
            </button>
          )}
          <button onClick={() => onDelete(ann.id)} className="p-2 bg-red-50 hover:bg-red-100 text-red-500 rounded-xl transition-all">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  </div>
);

export default Announcements;
