import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Loader2, Award, BookOpen, ShieldAlert } from 'lucide-react';
import { toast } from 'react-toastify';

const PredictiveAnalytics = () => {
  const [prediction, setPrediction] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictionData = async () => {
      try {
        const predRes = await axios.get('/api/ai/predict');
        setPrediction(predRes.data);
        
        const recRes = await axios.get('/api/ai/recommendations');
        setRecommendations(recRes.data);
      } catch (err) {
        toast.error('Failed to load AI prediction data');
      } finally {
        setLoading(false);
      }
    };
    fetchPredictionData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border p-6 flex items-center justify-center min-h-[300px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">AI is running performance diagnostics...</p>
        </div>
      </div>
    );
  }

  if (!prediction) return null;

  const getRiskColor = (level) => {
    switch (level) {
      case 'HIGH':
        return {
          bg: 'bg-rose-500/10 border-rose-500/30',
          text: 'text-rose-400',
          badge: 'bg-rose-500 text-white'
        };
      case 'MODERATE':
        return {
          bg: 'bg-amber-500/10 border-amber-500/30',
          text: 'text-amber-400',
          badge: 'bg-amber-500 text-slate-900'
        };
      default:
        return {
          bg: 'bg-emerald-500/10 border-emerald-500/30',
          text: 'text-emerald-400',
          badge: 'bg-emerald-500 text-white'
        };
    }
  };

  const riskStyle = getRiskColor(prediction.risk_level);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 rounded-2xl shadow-lg border border-indigo-500/20 p-6 relative overflow-hidden group">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
      
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/20 rounded-xl">
            <Brain className="w-6 h-6 text-indigo-300 animate-pulse" />
          </div>
          <h3 className="text-lg font-bold text-white">AI Academic Intelligence</h3>
        </div>
        <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider ${riskStyle.badge}`}>
          {prediction.risk_level} RISK
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-6 relative z-10">
        {/* Expected Performance Card */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 flex flex-col items-center justify-center text-center">
          <Award className="w-8 h-8 text-emerald-400 mb-2" />
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Expected Term Grade</h4>
          <span className="text-4xl font-black text-white tracking-tight">{prediction.predicted_grade_pct}%</span>
          <p className="text-[10px] text-gray-500 mt-2">
            Model Confidence: {Math.round(prediction.confidence_score * 100)}%
          </p>
        </div>

        {/* Explainable Factors Card */}
        <div className={`border rounded-xl p-5 ${riskStyle.bg}`}>
          <div className="flex items-center gap-2 mb-3">
            <ShieldAlert className={`w-5 h-5 ${riskStyle.text}`} />
            <h4 className={`text-xs font-bold uppercase tracking-wider ${riskStyle.text}`}>Key Diagnostics</h4>
          </div>
          <ul className="space-y-2 text-xs text-gray-300">
            {prediction.explanation.map((exp, i) => (
              <li key={i} className="flex gap-2 items-start leading-relaxed">
                <span className={`shrink-0 ${riskStyle.text}`}>•</span>
                <span>{exp}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Personalized Study Recommender Card */}
      {recommendations.length > 0 && (
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <h4 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Your Personalized Study Priorities</h4>
          </div>
          <div className="space-y-4">
            {recommendations.slice(0, 3).map((rec, i) => (
              <div key={i} className="border-l-2 border-indigo-500 pl-4 py-1">
                <div className="flex items-center justify-between mb-1">
                  <h5 className="text-sm font-bold text-white">{rec.subjectName}</h5>
                  <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded">
                    Score: {rec.weaknessScore}%
                  </span>
                </div>
                <p className="text-xs text-gray-400 mb-2">{rec.reason}</p>
                {rec.recommendedResources && rec.recommendedResources.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {rec.recommendedResources.map((res, rIdx) => (
                      <a
                        key={rIdx}
                        href={res.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded px-2.5 py-1 text-gray-300 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        {res.title}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictiveAnalytics;
