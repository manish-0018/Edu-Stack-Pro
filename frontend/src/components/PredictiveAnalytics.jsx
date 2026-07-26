import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Brain, TrendingUp, AlertTriangle, Lightbulb, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const PredictiveAnalytics = () => {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const res = await axios.get('/api/ai/predict');
        setPrediction(res.data);
      } catch (err) {
        toast.error('Failed to load AI prediction');
      } finally {
        setLoading(false);
      }
    };
    fetchPrediction();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border p-6 flex items-center justify-center min-h-[200px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">AI is analyzing your trajectory...</p>
        </div>
      </div>
    );
  }

  if (!prediction) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl shadow-lg border border-indigo-500/20 p-6 relative overflow-hidden group h-full">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
      
      <div className="flex items-center gap-3 mb-6 relative z-10">
        <div className="p-2 bg-indigo-500/20 rounded-xl">
          <Brain className="w-6 h-6 text-indigo-300" />
        </div>
        <h3 className="text-lg font-bold text-white">AI Future Predictor</h3>
      </div>

      <div className="space-y-4 relative z-10">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 flex gap-4 items-start">
          <TrendingUp className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Trajectory</h4>
            <p className="text-sm text-gray-200 leading-relaxed">{prediction.prediction}</p>
          </div>
        </div>

        {prediction.atRisk && prediction.atRisk.length > 0 && (
          <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 flex gap-4 items-start">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-1">At Risk</h4>
              <p className="text-sm text-rose-200/90 leading-relaxed">
                Watch out for {prediction.atRisk.join(', ')}. Your stats show a potential drop here.
              </p>
            </div>
          </div>
        )}

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-4 items-start">
          <Lightbulb className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Strategy</h4>
            <p className="text-sm text-amber-200/90 leading-relaxed">{prediction.strategy}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictiveAnalytics;
