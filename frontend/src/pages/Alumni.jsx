import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { GraduationCap, Search, BadgeCheck, ExternalLink, Plus, X, MapPin, Building2 } from 'lucide-react';

const Alumni = () => {
  const { user } = useAuth();
  const [alumni, setAlumni] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [search, setSearch] = useState('');
  const [skillFilter, setSkillFilter] = useState('');
  const [form, setForm] = useState({ graduationYear: '', batch: '', company: '', designation: '', location: '', linkedIn: '', bio: '', skills: '' });

  useEffect(() => { fetchAlumni(); fetchMyProfile(); }, []);

  const fetchAlumni = async () => { try { const r = await axios.get('/api/alumni'); setAlumni(r.data); } catch {} };
  const fetchMyProfile = async () => { try { const r = await axios.get('/api/alumni/me'); if (r.data) { setMyProfile(r.data); setForm({ ...r.data, skills: (r.data.skills || []).join(', ') }); } } catch {} };

  const saveProfile = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/alumni/me', { ...form, skills: form.skills.split(',').map(s => s.trim()).filter(Boolean) });
      toast.success('Profile saved!');
      setShowEdit(false);
      fetchAlumni();
      fetchMyProfile();
    } catch (err) { toast.error('Failed to save'); }
  };

  const verify = async (id) => {
    try { await axios.put(`/api/alumni/${id}/verify`); fetchAlumni(); toast.success('Verification toggled'); } catch {}
  };

  const filtered = alumni.filter(a => {
    const q = search.toLowerCase();
    const match = !search || a.User?.name?.toLowerCase().includes(q) || a.company?.toLowerCase().includes(q) || a.designation?.toLowerCase().includes(q);
    const skillMatch = !skillFilter || (a.skills || []).some(s => s.toLowerCase().includes(skillFilter.toLowerCase()));
    return match && skillMatch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black mb-1 flex items-center gap-3"><GraduationCap className="w-8 h-8" />Alumni Network</h1>
          <p className="opacity-80">Connect with graduates from your institution.</p>
        </div>
        <button onClick={() => setShowEdit(true)} className="px-6 py-3 bg-white text-indigo-700 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-50 shadow">
          <Plus className="w-5 h-5" /> {myProfile ? 'Edit My Profile' : 'Join Network'}
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, company or role..."
            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <input value={skillFilter} onChange={e => setSkillFilter(e.target.value)} placeholder="Filter by skill..."
          className="md:w-48 px-4 py-3 bg-white dark:bg-dark-card border border-gray-200 dark:border-dark-border rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      {/* Alumni Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 && (
          <div className="col-span-3 py-20 text-center text-gray-400 bg-white dark:bg-dark-card rounded-3xl border border-dashed border-gray-200">
            <GraduationCap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg">No alumni found.</p>
          </div>
        )}
        {filtered.map(a => (
          <div key={a.id} className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-400 to-purple-500 text-white flex items-center justify-center font-black text-xl">
                  {a.User?.name?.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="font-bold text-gray-900 dark:text-white">{a.User?.name}</p>
                    {a.isVerified && <BadgeCheck className="w-4 h-4 text-blue-500" />}
                  </div>
                  <p className="text-xs text-gray-500">{a.User?.course} • Batch {a.batch || a.graduationYear}</p>
                </div>
              </div>
              {user?.role === 'admin' && (
                <button onClick={() => verify(a.id)} className={`text-xs px-2 py-1 rounded-lg font-bold ${a.isVerified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {a.isVerified ? '✓ Verified' : 'Verify'}
                </button>
              )}
            </div>
            {a.company && (
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 mb-1">
                <Building2 className="w-4 h-4 text-indigo-400" /> {a.designation} @ {a.company}
              </div>
            )}
            {a.location && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                <MapPin className="w-4 h-4" /> {a.location}
              </div>
            )}
            {a.bio && <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">{a.bio}</p>}
            {a.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-3">
                {a.skills.slice(0, 4).map(s => (
                  <span key={s} className="text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400 px-2 py-0.5 rounded-full">{s}</span>
                ))}
                {a.skills.length > 4 && <span className="text-xs text-gray-400">+{a.skills.length - 4} more</span>}
              </div>
            )}
            {a.linkedIn && (
              <a href={a.linkedIn} target="_blank" rel="noreferrer"
                className="text-sm text-indigo-600 hover:underline flex items-center gap-1 font-medium">
                <ExternalLink className="w-3.5 h-3.5" /> LinkedIn
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEdit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl w-full max-w-lg shadow-2xl border dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black">Alumni Profile</h2>
              <button onClick={() => setShowEdit(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input placeholder="Graduation Year" type="number" value={form.graduationYear} onChange={e => setForm({...form, graduationYear: e.target.value})}
                  className="px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" />
                <input placeholder="Batch (e.g. 2020-24)" value={form.batch} onChange={e => setForm({...form, batch: e.target.value})}
                  className="px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <input placeholder="Company" value={form.company} onChange={e => setForm({...form, company: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" />
              <input placeholder="Designation / Role" value={form.designation} onChange={e => setForm({...form, designation: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" />
              <input placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" />
              <input placeholder="LinkedIn URL" value={form.linkedIn} onChange={e => setForm({...form, linkedIn: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" />
              <textarea placeholder="Bio" rows={3} value={form.bio} onChange={e => setForm({...form, bio: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" />
              <input placeholder="Skills (comma-separated: React, Node.js, Python)" value={form.skills} onChange={e => setForm({...form, skills: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-indigo-500" />
              <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-800">
                <button type="button" onClick={() => setShowEdit(false)} className="px-5 py-2 font-bold text-gray-500">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alumni;
