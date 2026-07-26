import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { User, BarChart2, BookOpen, Briefcase, Trophy, CheckSquare, TrendingUp, Calendar } from 'lucide-react';

const Portfolio = () => {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPortfolio(); }, []);

  const fetchPortfolio = async () => {
    try {
      const r = await axios.get('/api/portfolio/me');
      setPortfolio(r.data);
    } catch {} finally { setLoading(false); }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full" /></div>;
  if (!portfolio) return <div className="text-center py-20 text-gray-400">No portfolio data available.</div>;

  const { user: u, academics, attendance, placements, opportunities, achievements } = portfolio;
  const gpa = academics.overallAverage;
  const gpaColor = gpa >= 75 ? 'text-green-600' : gpa >= 50 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 rounded-3xl text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-4xl font-black">
            {u.name?.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-black mb-1">{u.name}</h1>
            <p className="opacity-80">{u.email}</p>
            <p className="opacity-80">{u.course} • {u.role?.charAt(0).toUpperCase() + u.role?.slice(1)}</p>
          </div>
          <div className="text-center bg-white/10 rounded-2xl px-6 py-4">
            <p className="text-4xl font-black">{gpa}%</p>
            <p className="text-sm opacity-75">Overall Average</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Attendance', value: `${attendance.attendancePercentage}%`, icon: <Calendar className="w-5 h-5" />, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400' },
          { label: 'Classes Attended', value: `${attendance.attendedClasses}/${attendance.totalClasses}`, icon: <CheckSquare className="w-5 h-5" />, color: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400' },
          { label: 'Companies Applied', value: placements.total, icon: <Briefcase className="w-5 h-5" />, color: 'bg-violet-50 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400' },
          { label: 'Tasks Completed', value: achievements.completedTasks, icon: <Trophy className="w-5 h-5" />, color: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400' },
        ].map(s => (
          <div key={s.label} className={`${s.color} p-5 rounded-2xl`}>
            <div className="flex items-center gap-2 mb-2">{s.icon}<span className="text-sm font-medium">{s.label}</span></div>
            <p className="text-2xl font-black">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Academics */}
      <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm">
        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-500" />Academic Performance</h2>
        {academics.subjectSummary.length === 0 && <p className="text-gray-400 text-sm">No marks recorded yet.</p>}
        <div className="space-y-3">
          {academics.subjectSummary.map(sub => {
            const pct = Math.round((sub.average / sub.maxMarks) * 100);
            return (
              <div key={sub.subject}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">{sub.subject}</span>
                  <span className={`text-sm font-black ${pct >= 75 ? 'text-green-600' : pct >= 50 ? 'text-yellow-600' : 'text-red-500'}`}>{sub.average}/{sub.maxMarks}</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${pct >= 75 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Placements */}
      {placements.list.length > 0 && (
        <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm">
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Briefcase className="w-5 h-5 text-violet-500" />Placement Applications</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {placements.list.map(p => (
              <div key={p.id} className="p-4 bg-violet-50 dark:bg-violet-900/10 rounded-2xl">
                <p className="font-bold text-gray-900 dark:text-white">{p.Company?.name}</p>
                <p className="text-sm text-gray-500">{p.Company?.position} • {p.Company?.package} LPA</p>
                <span className={`text-xs mt-2 inline-block px-2 py-0.5 rounded-full font-bold ${p.status === 'selected' ? 'bg-green-100 text-green-700' : p.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>{p.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Opportunities */}
      {opportunities.list.length > 0 && (
        <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm">
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-emerald-500" />Activities & Opportunities</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {opportunities.list.map(o => (
              <div key={o.id} className="p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-2xl">
                <p className="font-bold text-gray-900 dark:text-white">{o.Opportunity?.title}</p>
                <p className="text-sm text-gray-500">{o.Opportunity?.type}</p>
                <span className="text-xs mt-1 inline-block px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-bold">{o.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Tasks */}
      {achievements.completedTasks > 0 && (
        <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm">
          <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-yellow-500" />Completed Tasks</h2>
          <div className="grid md:grid-cols-2 gap-3">
            {achievements.tasks.slice(0, 6).map(t => (
              <div key={t.id} className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl flex items-center gap-3">
                <CheckSquare className="w-4 h-4 text-yellow-600 shrink-0" />
                <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{t.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
