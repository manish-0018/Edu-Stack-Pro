import { useState, useEffect } from 'react';
import axios from 'axios';

const RiskBadge = ({ level }) => {
  const styles = {
    HIGH: 'bg-red-100 text-red-700 border-red-300',
    MODERATE: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    LOW: 'bg-green-100 text-green-700 border-green-300'
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${styles[level] || 'bg-gray-100 text-gray-600 border-gray-300'}`}>
      {level}
    </span>
  );
};

const InfoCard = ({ title, value, sublabel, color = 'indigo' }) => {
  const colors = {
    indigo: 'text-indigo-600 bg-indigo-50',
    red: 'text-red-600 bg-red-50',
    green: 'text-green-600 bg-green-50',
    yellow: 'text-yellow-600 bg-yellow-50',
  };
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border">
      <div className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-1">{title}</div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-gray-800">{value ?? '—'}</span>
        {sublabel && <span className="text-xs text-gray-500">{sublabel}</span>}
      </div>
    </div>
  );
};

export default function AIClassInsights() {
  const [watchlist, setWatchlist] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loadingWatchlist, setLoadingWatchlist] = useState(true);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);
  const [activeTab, setActiveTab] = useState('watchlist');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWatchlist();
    fetchAnalytics();
  }, []);

  const fetchWatchlist = async () => {
    setLoadingWatchlist(true);
    try {
      const res = await axios.get('/api/ai/watchlist');
      setWatchlist(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load at-risk watchlist.');
    } finally {
      setLoadingWatchlist(false);
    }
  };

  const fetchAnalytics = async () => {
    setLoadingAnalytics(true);
    try {
      const res = await axios.get('/api/ai/class-analytics');
      setAnalytics(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          📊 AI Class Insights
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Predictive student monitoring and early-warning attention metrics.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-6 border-b pb-2">
        <button
          onClick={() => setActiveTab('watchlist')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'watchlist' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          ⚠️ At-Risk Watchlist ({watchlist.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'analytics' ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          📈 Class-wide Analytics
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* ── WATCHLIST TAB ── */}
      {activeTab === 'watchlist' && (
        <div>
          {loadingWatchlist ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : watchlist.length === 0 ? (
            <div className="bg-white rounded-2xl border p-8 text-center">
              <div className="text-4xl mb-2">🎉</div>
              <h3 className="font-semibold text-gray-800 text-lg">No Students At Risk</h3>
              <p className="text-gray-500 text-sm mt-1">All monitored students currently have stable predicted grades and attendance.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                    <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3">Student Name</th>
                        <th className="px-6 py-3">Course</th>
                        <th className="px-6 py-3">Risk Level</th>
                        <th className="px-6 py-3">Predicted Grade</th>
                        <th className="px-6 py-3">Confidence</th>
                        <th className="px-6 py-3">Key Contributing Factors</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-700 bg-white">
                      {watchlist.map((w, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-semibold text-gray-900">{w.studentName}<div className="text-xs font-normal text-gray-400">{w.email}</div></td>
                          <td className="px-6 py-4">{w.course}</td>
                          <td className="px-6 py-4"><RiskBadge level={w.riskLevel} /></td>
                          <td className="px-6 py-4 font-semibold text-indigo-600">{w.predictedGrade?.toFixed(1)}%</td>
                          <td className="px-6 py-4">{Math.round((w.confidence || 0) * 100)}%</td>
                          <td className="px-6 py-4 max-w-xs">
                            <ul className="list-disc pl-4 space-y-1 text-xs text-gray-600">
                              {w.explanation?.map((exp, i) => <li key={i}>{exp}</li>)}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Aggregated suggestions */}
              <div className="bg-white p-5 rounded-2xl border">
                <h3 className="font-semibold text-gray-800 text-base mb-3">💡 AI Suggested Interventions</h3>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <strong>For Attendance Shortfalls:</strong> Schedule a mentorship session with high-risk students to review attendance trends and issue a formal defaulter warning.
                  </div>
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl">
                    <strong>For Academic Deficits:</strong> Direct students with sub-60% predicted grades to complete target **Recovery Assignments** and practice quizzes before the upcoming examination.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ANALYTICS TAB ── */}
      {activeTab === 'analytics' && (
        <div>
          {loadingAnalytics ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : analytics ? (
            <div className="space-y-6">
              {/* Aggregated Metric Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <InfoCard title="Total Monitored" value={analytics.summary?.totalStudents} sublabel="Students" />
                <InfoCard title="Average Attendance" value={analytics.summary?.avgAttendancePct} sublabel="%" />
                <InfoCard title="Assignment Submission" value={analytics.summary?.avgAssignmentCompletionPct} sublabel="%" />
                <InfoCard title="Average MidSem" value={analytics.summary?.avgMidSemScore} sublabel="%" />
              </div>

              {/* Student table */}
              <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
                <div className="px-6 py-4 bg-gray-50 border-b">
                  <h3 className="font-semibold text-gray-800 text-sm">Class Performance Profiles</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 text-sm text-left">
                    <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      <tr>
                        <th className="px-6 py-3">Student Name</th>
                        <th className="px-6 py-3">Attendance</th>
                        <th className="px-6 py-3">Assignment Completion</th>
                        <th className="px-6 py-3">MidSem Score</th>
                        <th className="px-6 py-3">Activity Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-gray-700 bg-white">
                      {analytics.students?.map((s, idx) => (
                        <tr key={idx} className="hover:bg-gray-50">
                          <td className="px-6 py-4 font-semibold text-gray-900">{s.studentName}</td>
                          <td className="px-6 py-4">
                            <span className={s.features.attendance_pct >= 75 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                              {s.features.attendance_pct?.toFixed(1)}%
                            </span>
                          </td>
                          <td className="px-6 py-4">{(s.features.assignment_completion_rate * 100)?.toFixed(1)}%</td>
                          <td className="px-6 py-4">{s.features.mid_sem_score?.toFixed(1)}%</td>
                          <td className="px-6 py-4">
                            {s.hasRealData ? (
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-700">Insufficient Data</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-center py-6">Analytics data unavailable.</p>
          )}
        </div>
      )}
    </div>
  );
}
