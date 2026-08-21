import { useState, useEffect } from 'react';
import axios from 'axios';

const MetricBox = ({ title, value, type = 'default' }) => {
  const isGood = type === 'pct' ? value >= 80 : value <= 5;
  const color = type === 'pct' 
    ? (value >= 90 ? 'text-green-600' : value >= 75 ? 'text-indigo-600' : 'text-amber-600')
    : (value <= 3 ? 'text-green-600' : 'text-amber-600');
  
  return (
    <div className="bg-white p-4 rounded-xl border">
      <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">{title}</div>
      <div className={`text-2xl font-bold ${color}`}>
        {typeof value === 'number' ? (type === 'pct' ? `${(value * 100).toFixed(1)}%` : value.toFixed(3)) : value ?? '—'}
      </div>
    </div>
  );
};

export default function AIModelDashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [retraining, setRetraining] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/api/ai/metrics');
      setMetrics(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load model metrics. Make sure the ML service is online.');
    } finally {
      setLoading(false);
    }
  };

  const handleRetrain = async () => {
    setRetraining(true);
    setMessage(null);
    setError(null);
    try {
      const res = await axios.post('/api/ai/retrain');
      setMetrics(res.data.metrics);
      setMessage(res.data.message || 'Model retraining completed successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Retraining failed. Please try again.');
    } finally {
      setRetraining(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] flex-col gap-4">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 text-sm">Retrieving model metrics from ML service…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-xl mx-auto text-center">
        <div className="text-6xl mb-4">🤖</div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">ML Service Connection Offline</h2>
        <p className="text-gray-500 mb-4">{error}</p>
        <button onClick={fetchMetrics} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Retry Connection
        </button>
      </div>
    );
  }

  // Sort feature importances
  const sortedImportances = metrics?.feature_importances 
    ? Object.entries(metrics.feature_importances).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            🧠 Model Performance
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            System developers/admins ML monitoring dashboard.
          </p>
        </div>
        <button
          onClick={handleRetrain}
          disabled={retraining}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-all font-medium text-sm flex items-center gap-2 shadow"
        >
          {retraining ? '⏳ Retraining Model…' : '🔄 Trigger Retrain'}
        </button>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm font-medium">
          ✅ {message}
        </div>
      )}

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl border">
          <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Model Name</div>
          <div className="text-lg font-bold text-gray-800 truncate">{metrics?.model_name || 'RandomForest'}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Dataset Size</div>
          <div className="text-2xl font-bold text-indigo-600">{metrics?.dataset_size}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Training Date</div>
          <div className="text-sm font-bold text-gray-700">{metrics?.training_date}</div>
        </div>
        <div className="bg-white p-4 rounded-xl border">
          <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Features</div>
          <div className="text-2xl font-bold text-indigo-600">{metrics?.features_used?.length}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Regression Metrics */}
        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <h3 className="font-semibold text-gray-800 text-base mb-4 flex items-center gap-2">
            🎯 Grade Prediction (Regression)
          </h3>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <MetricBox title="MAE (Error)" value={metrics?.regression?.mae} />
            <MetricBox title="RMSE" value={metrics?.regression?.rmse} />
            <MetricBox title="R² Score" value={metrics?.regression?.r2_score} />
          </div>
          <p className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg border">
            <strong>R² Score:</strong> Indicates how well the features predict final grade variance. Closer to 1.0 is better. Current MAE shows prediction accuracy is within +/- {metrics?.regression?.mae?.toFixed(2)}%.
          </p>
        </div>

        {/* Classification Metrics */}
        <div className="bg-white p-5 rounded-2xl border shadow-sm">
          <h3 className="font-semibold text-gray-800 text-base mb-4 flex items-center gap-2">
            ⚠️ Risk Assessment (Classification)
          </h3>
          <div className="grid grid-cols-4 gap-2 mb-4">
            <MetricBox title="Accuracy" value={metrics?.classification?.accuracy} type="pct" />
            <MetricBox title="Precision" value={metrics?.classification?.precision} type="pct" />
            <MetricBox title="Recall" value={metrics?.classification?.recall} type="pct" />
            <MetricBox title="F1-Score" value={metrics?.classification?.f1_score} type="pct" />
          </div>
          <p className="text-xs text-gray-500 bg-gray-50 p-2.5 rounded-lg border">
            <strong>F1-Score:</strong> Macro-average of low/moderate/high risk classes. Accuracy shows correct classification rate. Currently running with high precision/recall balance.
          </p>
        </div>

        {/* Feature Importance */}
        <div className="bg-white p-5 rounded-2xl border shadow-sm md:col-span-2">
          <h3 className="font-semibold text-gray-800 text-base mb-4 flex items-center gap-2">
            📊 Feature Importances
          </h3>
          <div className="space-y-4">
            {sortedImportances.map(([feature, weight], i) => (
              <div key={i}>
                <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1 capitalize">
                  <span>{feature.replace('_', ' ')}</span>
                  <span>{(weight * 100).toFixed(2)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-indigo-500 transition-all duration-1000"
                    style={{ width: `${weight * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-4 italic text-center">
            * Higher percentage indicates the feature has a larger influence on grade and risk predictions in the model.
          </p>
        </div>
      </div>
    </div>
  );
}
