import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

// ── Tiny chart components (no extra library needed) ────────────────────────
const ProgressBar = ({ value, max = 100, color = '#6366f1', label, sublabel }) => {
  const pct = Math.min(Math.max((value / max) * 100, 0), 100);
  return (
    <div className="mb-3">
      {(label || sublabel) && (
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-gray-700">{label}</span>
          <span className="text-gray-500">{sublabel}</span>
        </div>
      )}
      <div className="w-full bg-gray-200 rounded-full h-3">
        <div
          className="h-3 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  );
};

const RiskBadge = ({ level }) => {
  const styles = {
    HIGH: 'bg-red-100 text-red-700 border-red-300',
    MODERATE: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    LOW: 'bg-green-100 text-green-700 border-green-300'
  };
  const icons = { HIGH: '🔴', MODERATE: '🟡', LOW: '🟢' };
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border ${styles[level] || 'bg-gray-100 text-gray-600 border-gray-300'}`}>
      {icons[level] || '⚪'} {level}
    </span>
  );
};

const SubjectBar = ({ subject, level, color, composite, breakdown }) => {
  const colors = { Weak: '#ef4444', Average: '#f59e0b', Strong: '#10b981' };
  const bg = colors[level] || '#6366f1';
  return (
    <div className="p-4 border rounded-xl mb-3 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-gray-800">{subject}</span>
        <span className="text-xs font-bold px-2 py-1 rounded-full text-white" style={{ backgroundColor: bg }}>{level}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
        <div className="h-2 rounded-full" style={{ width: `${composite}%`, backgroundColor: bg }} />
      </div>
      <div className="flex text-xs text-gray-500 gap-4">
        <span>MidSem: <strong>{breakdown?.mid_sem_pct ?? '—'}%</strong></span>
        <span>Assignment: <strong>{breakdown?.assignment_pct ?? '—'}%</strong></span>
        <span>Quiz: <strong>{breakdown?.quiz_pct ?? '—'}%</strong></span>
      </div>
    </div>
  );
};

const InfoCard = ({ title, icon, children, className = '' }) => (
  <div className={`bg-white rounded-2xl shadow-sm border p-5 ${className}`}>
    <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2 text-base">
      <span>{icon}</span>{title}
    </h3>
    {children}
  </div>
);

// ── Main Component ──────────────────────────────────────────────────────────
export default function AIInsights() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [insights, setInsights] = useState(null);
  const [studyPlan, setStudyPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [planLoading, setPlanLoading] = useState(false);
  const [error, setError] = useState(null);
  const [examDays, setExamDays] = useState(30);
  const [dailyHours, setDailyHours] = useState(3);
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', text: `👋 Hi ${user?.name || 'Student'}! I'm your AI Campus Assistant. Ask me about your attendance, marks, academic risk, or study recommendations.` }
  ]);
  const [chatLoading, setChatLoading] = useState(false);

  useEffect(() => {
    fetchInsights();
  }, []);

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/ai/insights');
      setInsights(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load AI insights.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudyPlan = async () => {
    setPlanLoading(true);
    try {
      const res = await axios.get(`/api/ai/study-plan?exam_days_remaining=${examDays}&daily_hours_available=${dailyHours}`);
      setStudyPlan(res.data);
    } catch (err) {
      setStudyPlan({ error: 'Could not generate study plan. Please try again.' });
    } finally {
      setPlanLoading(false);
    }
  };

  const sendChat = async () => {
    if (!chatInput.trim()) return;
    const userMsg = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setChatLoading(true);
    try {
      const res = await axios.post('/api/ai/ask', { prompt: userMsg });
      setChatMessages(prev => [...prev, { role: 'assistant', text: res.data.response }]);
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', text: '⚠️ Assistant temporarily unavailable. Please try again.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', label: '📊 Overview', },
    { id: 'risk', label: '⚠️ Risk Analysis' },
    { id: 'subjects', label: '📚 Subjects' },
    { id: 'recommendations', label: '💡 Recommendations' },
    { id: 'plan', label: '📅 Study Plan' },
    { id: 'assistant', label: '🤖 AI Assistant' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Loading your AI insights…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Could not load AI Insights</h2>
        <p className="text-gray-500 mb-4">{error}</p>
        <button onClick={fetchInsights} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  const pred = insights?.prediction;
  const attRisk = insights?.attendanceRisk;
  const weakSubs = insights?.weakSubjects;
  const recs = insights?.recommendations || [];
  const features = insights?.features || {};

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          🤖 My AI Insights
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Powered by EduStack Pro Intelligence Engine · Random Forest ML Model
        </p>
        {!insights?.hasRealData && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
            ⚠️ <strong>Limited Data:</strong> Some predictions may be incomplete. Add attendance records, marks, and assignment submissions for accurate AI analysis.
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap mb-6 border-b pb-2">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === t.id ? 'bg-indigo-600 text-white shadow' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Prediction Card */}
          <InfoCard title="Performance Prediction" icon="🎯">
            {pred?.insufficient_data ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-2">📋</div>
                <p className="text-gray-500 text-sm">{pred.message}</p>
                <p className="text-xs text-gray-400 mt-2">Required: {pred.required?.join(', ')}</p>
              </div>
            ) : pred ? (
              <>
                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-indigo-600">{pred.predicted_grade_pct?.toFixed(1)}%</div>
                  <div className="text-gray-500 text-sm mt-1">Predicted Final Grade</div>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-600">Academic Risk</span>
                  <RiskBadge level={pred.risk_level} />
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Model Confidence</span>
                    <span>{Math.round((pred.confidence_score || 0) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="h-2 rounded-full bg-indigo-500" style={{ width: `${(pred.confidence_score || 0) * 100}%` }} />
                  </div>
                </div>
                <p className="text-xs text-gray-400 italic mt-2">{pred.model_note}</p>
              </>
            ) : (
              <p className="text-gray-400 text-sm text-center py-4">Prediction unavailable</p>
            )}
          </InfoCard>

          {/* Current Stats Card */}
          <InfoCard title="Your Current Stats" icon="📈">
            <ProgressBar value={features.attendance_pct || 0} label="Attendance" sublabel={`${Math.round(features.attendance_pct || 0)}%`} color={features.attendance_pct >= 75 ? '#10b981' : '#ef4444'} />
            <ProgressBar value={(features.assignment_completion_rate || 0) * 100} label="Assignment Completion" sublabel={`${Math.round((features.assignment_completion_rate || 0) * 100)}%`} color="#6366f1" />
            <ProgressBar value={features.mid_sem_score || 0} label="Mid-Semester Score" sublabel={`${Math.round(features.mid_sem_score || 0)}%`} color={features.mid_sem_score >= 60 ? '#f59e0b' : '#ef4444'} />
            <ProgressBar value={features.average_quiz_marks || 0} label="Quiz Performance" sublabel={`${Math.round(features.average_quiz_marks || 0)}%`} color="#8b5cf6" />
          </InfoCard>

          {/* Risk Probabilities */}
          {pred?.risk_probabilities && (
            <InfoCard title="Risk Probability Distribution" icon="📉">
              <ProgressBar value={pred.risk_probabilities.LOW * 100} label="LOW Risk" sublabel={`${Math.round(pred.risk_probabilities.LOW * 100)}%`} color="#10b981" />
              <ProgressBar value={pred.risk_probabilities.MODERATE * 100} label="MODERATE Risk" sublabel={`${Math.round(pred.risk_probabilities.MODERATE * 100)}%`} color="#f59e0b" />
              <ProgressBar value={pred.risk_probabilities.HIGH * 100} label="HIGH Risk" sublabel={`${Math.round(pred.risk_probabilities.HIGH * 100)}%`} color="#ef4444" />
              <p className="text-xs text-gray-400 mt-2">* Probabilities from Random Forest classifier's <code>predict_proba()</code></p>
            </InfoCard>
          )}

          {/* Explanation */}
          {pred?.explanation?.length > 0 && (
            <InfoCard title="AI Explanation" icon="🧠">
              <ul className="space-y-2">
                {pred.explanation.map((exp, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-700">
                    <span className="text-indigo-500 mt-0.5 flex-shrink-0">→</span>
                    <span>{exp}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-400 mt-3 italic">Explanations derived from feature importance rankings of the trained Random Forest model.</p>
            </InfoCard>
          )}
        </div>
      )}

      {/* ── RISK TAB ── */}
      {activeTab === 'risk' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Academic Risk */}
          <InfoCard title="Academic Risk Assessment" icon="🎓" className="md:col-span-1">
            {pred?.insufficient_data ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-2">📋</div>
                <p className="text-gray-500 text-sm">Insufficient academic data for risk assessment.</p>
              </div>
            ) : pred ? (
              <>
                <div className="text-center mb-5">
                  <RiskBadge level={pred.risk_level} />
                  <div className="text-3xl font-bold mt-3 text-gray-800">{Math.round((pred.confidence_score || 0) * 100)}%</div>
                  <div className="text-sm text-gray-500">Model Confidence</div>
                </div>
                <h4 className="text-sm font-semibold text-gray-600 mb-2">Contributing Factors:</h4>
                {pred.explanation?.map((exp, i) => (
                  <div key={i} className="flex gap-2 text-sm text-gray-700 mb-2 p-2 bg-gray-50 rounded-lg">
                    <span>⚡</span><span>{exp}</span>
                  </div>
                ))}
                {pred.risk_level === 'HIGH' && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    <strong>⚠️ Recommended Action:</strong> Speak with your mentor or teacher immediately. Improve attendance and complete pending assignments.
                  </div>
                )}
                {pred.risk_level === 'MODERATE' && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-yellow-700 text-sm">
                    <strong>💡 Recommended Action:</strong> Focus on weak subjects and maintain consistent attendance. Review the Study Plan tab.
                  </div>
                )}
              </>
            ) : null}
          </InfoCard>

          {/* Attendance Risk */}
          <InfoCard title="Attendance Risk Projection" icon="📆">
            {attRisk?.insufficient_data ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-2">📋</div>
                <p className="text-gray-500 text-sm">{attRisk.message}</p>
              </div>
            ) : attRisk ? (
              <>
                <div className="text-center mb-4">
                  <div className={`text-4xl font-bold ${attRisk.current_pct >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                    {attRisk.current_pct?.toFixed(1)}%
                  </div>
                  <div className="text-gray-500 text-sm">Current Attendance</div>
                </div>
                <RiskBadge level={attRisk.risk_level} />
                <div className="mt-4 space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>Classes Attended</span>
                    <strong>{attRisk.classes_attended} / {attRisk.classes_total}</strong>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span>Projected Attendance</span>
                    <strong>{attRisk.projected_pct?.toFixed(1)}%</strong>
                  </div>
                  {attRisk.classes_needed_to_reach_threshold > 0 && (
                    <div className="flex justify-between p-2 bg-red-50 rounded text-red-700">
                      <span>Extra Classes Needed</span>
                      <strong>{attRisk.classes_needed_to_reach_threshold}</strong>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-3 italic">Method: {attRisk.method}</p>
                <p className="text-sm text-gray-600 mt-2">{attRisk.message}</p>
              </>
            ) : (
              <p className="text-gray-400 text-sm text-center py-4">Attendance risk data unavailable</p>
            )}
          </InfoCard>
        </div>
      )}

      {/* ── SUBJECTS TAB ── */}
      {activeTab === 'subjects' && (
        <div>
          {weakSubs?.insufficient_data ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Subject Data Yet</h3>
              <p className="text-gray-500">{weakSubs.message}</p>
            </div>
          ) : weakSubs?.profiles?.length > 0 ? (
            <>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-red-50 rounded-xl">
                  <div className="text-2xl font-bold text-red-600">{weakSubs.summary?.weak || 0}</div>
                  <div className="text-sm text-red-700">Weak Subjects</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-xl">
                  <div className="text-2xl font-bold text-yellow-600">{weakSubs.summary?.average || 0}</div>
                  <div className="text-sm text-yellow-700">Average</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-xl">
                  <div className="text-2xl font-bold text-green-600">{weakSubs.summary?.strong || 0}</div>
                  <div className="text-sm text-green-700">Strong Subjects</div>
                </div>
              </div>
              <p className="text-xs text-gray-400 mb-4 italic">Method: {weakSubs.method} · Composite = MidSem(45%) + Assignment(35%) + Quiz(20%)</p>
              {weakSubs.profiles.map((p, i) => (
                <SubjectBar key={i} {...p} />
              ))}
            </>
          ) : (
            <div className="text-center py-12 text-gray-500">No subject data available yet.</div>
          )}
        </div>
      )}

      {/* ── RECOMMENDATIONS TAB ── */}
      {activeTab === 'recommendations' && (
        <div>
          {recs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Recommendations Yet</h3>
              <p className="text-gray-500">Recommendations are generated when the AI identifies weak subjects. Run your AI prediction first.</p>
              <button
                onClick={fetchInsights}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
              >
                Refresh AI Analysis
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {recs.map((rec, i) => (
                <div key={i} className={`p-4 rounded-xl border-l-4 ${i === 0 ? 'border-red-500 bg-red-50' : i === 1 ? 'border-yellow-500 bg-yellow-50' : 'border-blue-500 bg-blue-50'}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-gray-800">{rec.subjectName}</h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white border text-gray-600">
                      Priority {rec.priority === 1 ? 'HIGH' : rec.priority === 2 ? 'MEDIUM' : 'LOW'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{rec.reason}</p>
                  {rec.recommendedResources?.length > 0 && (
                    <div>
                      <p className="text-xs font-semibold text-gray-600 mb-1">Recommended Resources:</p>
                      <ul className="space-y-1">
                        {rec.recommendedResources.map((r, j) => (
                          <li key={j} className="text-xs text-indigo-700">
                            {r.url ? <a href={r.url} target="_blank" rel="noreferrer" className="underline hover:text-indigo-900">📎 {r.title}</a> : <span>📎 {r.title}</span>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── STUDY PLAN TAB ── */}
      {activeTab === 'plan' && (
        <div>
          <InfoCard title="Generate Your Study Plan" icon="📅" className="mb-5">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Days Until Exam</label>
                <input
                  type="number" min="1" max="120" value={examDays}
                  onChange={e => setExamDays(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">Daily Study Hours</label>
                <input
                  type="number" min="0.5" max="12" step="0.5" value={dailyHours}
                  onChange={e => setDailyHours(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                />
              </div>
            </div>
            <button
              onClick={fetchStudyPlan}
              disabled={planLoading}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm font-medium"
            >
              {planLoading ? '⏳ Generating…' : '✨ Generate AI Study Plan'}
            </button>
          </InfoCard>

          {studyPlan?.error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{studyPlan.error}</div>
          )}

          {studyPlan && !studyPlan.error && (
            <>
              <p className="text-xs text-gray-400 italic mb-3">Method: {studyPlan.method} · {studyPlan.note}</p>

              {/* Priorities */}
              {studyPlan.priorities?.length > 0 && (
                <InfoCard title="Study Priorities" icon="🎯" className="mb-4">
                  <ol className="space-y-2">
                    {studyPlan.priorities.map((p, i) => (
                      <li key={i} className="flex gap-3 text-sm text-gray-700">
                        <span className="w-6 h-6 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                        {p}
                      </li>
                    ))}
                  </ol>
                </InfoCard>
              )}

              {/* Daily Plan */}
              {studyPlan.daily_plan?.length > 0 && (
                <InfoCard title="7-Day Study Schedule" icon="📆">
                  <div className="space-y-3">
                    {studyPlan.daily_plan.map((day, i) => (
                      <div key={i} className="p-3 border rounded-xl">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-gray-700">{day.day}</span>
                          <span className="text-xs text-gray-500">{day.total_hours}h total</span>
                        </div>
                        <div className="space-y-1">
                          {day.tasks?.map((task, j) => (
                            <div key={j} className={`flex gap-2 text-xs p-2 rounded ${task.type === 'weak_subject' ? 'bg-red-50 text-red-700' : task.type === 'assignment' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
                              <span className="font-medium">[{task.time_block}]</span>
                              <span>{task.activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </InfoCard>
              )}

              {/* Revision Topics */}
              {studyPlan.revision_topics?.length > 0 && (
                <InfoCard title="Recommended Revision Topics" icon="📝" className="mt-4">
                  {studyPlan.revision_topics.map((rt, i) => (
                    <div key={i} className="mb-3">
                      <h4 className="font-semibold text-gray-700 text-sm mb-1">{rt.subject}</h4>
                      <ul className="flex flex-wrap gap-2">
                        {rt.recommended_topics?.map((topic, j) => (
                          <li key={j} className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs border border-indigo-200">{topic}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </InfoCard>
              )}
            </>
          )}
        </div>
      )}

      {/* ── AI ASSISTANT TAB ── */}
      {activeTab === 'assistant' && (
        <div className="flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto space-y-3 p-4 bg-gray-50 rounded-xl mb-4 border">
            {chatMessages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white border text-gray-700 shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="bg-white border px-4 py-2 rounded-2xl text-gray-500 text-sm flex gap-1">
                  <span className="animate-bounce">●</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.15s' }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.3s' }}>●</span>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendChat()}
              placeholder="Ask about your attendance, marks, risk, or study tips…"
              className="flex-1 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              onClick={sendChat}
              disabled={chatLoading || !chatInput.trim()}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-colors text-sm"
            >
              Send
            </button>
          </div>
          <p className="text-xs text-gray-400 mt-2 text-center">AI responses use your actual campus data. Your data stays within your college only.</p>
        </div>
      )}
    </div>
  );
}
