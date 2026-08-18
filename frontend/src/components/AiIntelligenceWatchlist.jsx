import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Brain, User, AlertTriangle, RefreshCw, ChevronRight, BarChart, Settings, Mail, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { toast } from 'react-toastify';

const AiIntelligenceWatchlist = ({ user }) => {
  if (!user) return null;

  const [activeTab, setActiveTab] = useState('watchlist');
  const [watchlist, setWatchlist] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);

  const fetchWatchlist = async () => {
    try {
      const res = await axios.get('/api/ai/watchlist');
      setWatchlist(res.data);
    } catch (err) {
      console.error('Failed to fetch AI watchlist', err);
    }
  };

  const fetchMetrics = async () => {
    try {
      const res = await axios.get('/api/ai/metrics');
      setMetrics(res.data);
    } catch (err) {
      console.error('Failed to fetch ML metrics', err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchWatchlist();
      if (user.role === 'admin') {
        await fetchMetrics();
      }
      setLoading(false);
    };
    init();
  }, [user.role]);

  const handleRetrain = async () => {
    setRetraining(true);
    const toastId = toast.loading('Training ML models in background...');
    try {
      const res = await axios.post('/api/ai/retrain');
      setMetrics(res.data.metrics);
      toast.update(toastId, { render: 'AI Model retrained and updated successfully!', type: 'success', isLoading: false, autoClose: 4000 });
      await fetchWatchlist();
    } catch (err) {
      toast.update(toastId, { render: 'Failed to retrain model.', type: 'error', isLoading: false, autoClose: 4000 });
    } finally {
      setRetraining(false);
    }
  };

  const handleContactStudent = async (studentId, email) => {
    const toastId = toast.loading('Sending academic advice notice...');
    try {
      // Simulate sending warning notification/email
      await axios.post(`/api/notifications`, {
        userId: studentId,
        title: '📆 Academic Advising Invitation',
        message: 'Your course analytics indicate some academic gaps. Please schedule an advising slot with your mentor.',
        type: 'alert'
      });
      toast.update(toastId, { render: `Academic advisor notification sent to ${email}`, type: 'success', isLoading: false, autoClose: 4000 });
    } catch (err) {
      toast.update(toastId, { render: 'Failed to send advising notice.', type: 'error', isLoading: false, autoClose: 4000 });
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading AI Intelligence portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
      {/* Header bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-indigo-900/30">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl">
            <Brain className="w-6 h-6 text-indigo-300" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">AI Campus Intelligence Watchlist</h3>
            <p className="text-xs text-indigo-200">Early Academic Risk detection powered by local Random Forest models</p>
          </div>
        </div>
        {user.role === 'admin' && (
          <div className="flex bg-white/10 rounded-lg p-0.5 border border-white/10 text-xs">
            <button
              onClick={() => setActiveTab('watchlist')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${activeTab === 'watchlist' ? 'bg-white text-slate-950 shadow-sm' : 'text-gray-300 hover:text-white'}`}
            >
              Watchlist
            </button>
            <button
              onClick={() => setActiveTab('model')}
              className={`px-3 py-1.5 rounded-md font-bold transition-all ${activeTab === 'model' ? 'bg-white text-slate-950 shadow-sm' : 'text-gray-300 hover:text-white'}`}
            >
              Model Pipeline
            </button>
          </div>
        )}
      </div>

      {activeTab === 'watchlist' ? (
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">
              Students Needing Academic Attention ({watchlist.length})
            </h4>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-full font-semibold">
                🔴 {watchlist.filter(w => w.riskLevel === 'HIGH').length} High Risk
              </span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-100 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 rounded-full font-semibold">
                🟡 {watchlist.filter(w => w.riskLevel === 'MODERATE').length} Moderate
              </span>
            </div>
          </div>

          {watchlist.length === 0 ? (
            <div className="py-12 text-center text-gray-400">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-2" />
              <p className="text-sm font-semibold">All clear! No students are currently flagged as academic risks.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {watchlist.map((student, i) => (
                <div 
                  key={i} 
                  className={`border rounded-xl p-5 transition-shadow hover:shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 ${
                    student.riskLevel === 'HIGH' 
                      ? 'bg-red-50/30 dark:bg-red-950/5 border-red-100 dark:border-red-950/30' 
                      : 'bg-amber-50/30 dark:bg-amber-950/5 border-amber-100 dark:border-amber-950/30'
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    <div className={`p-3 rounded-full shrink-0 ${
                      student.riskLevel === 'HIGH' ? 'bg-red-100 dark:bg-red-950/30 text-red-500' : 'bg-amber-100 dark:bg-amber-950/30 text-amber-500'
                    }`}>
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h5 className="font-bold text-gray-900 dark:text-white">{student.studentName}</h5>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                          student.riskLevel === 'HIGH' ? 'bg-red-500 text-white' : 'bg-amber-500 text-slate-900'
                        }`}>
                          {student.riskLevel}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                        Course: <span className="font-semibold text-gray-700 dark:text-gray-300">{student.course}</span> | 
                        Predicted Term Grade: <span className="font-semibold text-gray-700 dark:text-gray-300">{student.predictedGrade}%</span>
                      </p>
                      {student.explanation && student.explanation.length > 0 && (
                        <div className="space-y-1 bg-white/40 dark:bg-dark-bg/20 p-2.5 rounded-lg border border-gray-100 dark:border-dark-border/20">
                          {student.explanation.map((exp, expIdx) => (
                            <div key={expIdx} className="text-[11px] text-gray-600 dark:text-gray-300 flex items-start gap-1">
                              <span className="text-gray-400 shrink-0">•</span>
                              <span>{exp}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 self-stretch lg:self-center justify-end">
                    <button
                      onClick={() => handleContactStudent(student.studentId, student.email)}
                      className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm hover:shadow"
                    >
                      <Mail className="w-4 h-4" /> Notify Advisor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="p-6">
          {metrics && (
            <div className="space-y-6">
              {/* Metrics Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 dark:bg-dark-bg/30 p-4 rounded-xl border border-slate-100 dark:border-dark-border/30">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Regression MAE</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-white">
                    {metrics.regression?.mae?.toFixed(2)}%
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-dark-bg/30 p-4 rounded-xl border border-slate-100 dark:border-dark-border/30">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Classifier Accuracy</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-white">
                    {Math.round(metrics.classification?.accuracy * 100)}%
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-dark-bg/30 p-4 rounded-xl border border-slate-100 dark:border-dark-border/30">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">F1-Score</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-white">
                    {metrics.classification?.f1_score?.toFixed(3)}
                  </span>
                </div>
                <div className="bg-slate-50 dark:bg-dark-bg/30 p-4 rounded-xl border border-slate-100 dark:border-dark-border/30">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">Training Samples</span>
                  <span className="text-2xl font-black text-slate-800 dark:text-white">
                    {metrics.dataset_size}
                  </span>
                </div>
              </div>

              {/* Feature Importance List */}
              <div className="bg-slate-50 dark:bg-dark-bg/30 p-5 rounded-xl border border-slate-100 dark:border-dark-border/30">
                <h5 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                  <BarChart className="w-4 h-4 text-indigo-500" /> Relative Feature Importances (Random Forest Model)
                </h5>
                <div className="space-y-3.5">
                  {Object.entries(metrics.feature_importances || {})
                    .sort((a, b) => b[1] - a[1])
                    .map(([feature, val], i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span className="text-gray-600 dark:text-gray-300 capitalize">
                            {feature.replace('_', ' ')}
                          </span>
                          <span className="text-indigo-600 dark:text-indigo-400">
                            {(val * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-dark-bg h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${val * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Model Actions */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-950/30 rounded-xl">
                <div className="flex items-start gap-2.5">
                  <Settings className="w-5 h-5 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-xs font-bold text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-0.5">
                      Model Pipeline Versioning
                    </h5>
                    <p className="text-[11px] text-indigo-700 dark:text-indigo-400/90 leading-relaxed">
                      Models are automatically updated in memory when retraining completes. Last retrained: {metrics.training_date}.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleRetrain}
                  disabled={retraining}
                  className="w-full sm:w-auto flex-shrink-0 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow"
                >
                  <RefreshCw className={`w-4 h-4 ${retraining ? 'animate-spin' : ''}`} />
                  {retraining ? 'Retraining...' : 'Trigger Pipeline Retrain'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AiIntelligenceWatchlist;
