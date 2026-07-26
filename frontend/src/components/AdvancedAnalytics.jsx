import React from 'react';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { TrendingUp, BarChart2 } from 'lucide-react';

const AdvancedAnalytics = ({ stats }) => {
  if (!stats) return null;

  // Prepare data for Radar Chart (Marks / Strengths)
  const marksData = (stats.marks || []).map(m => {
    const total = (m.midSem || 0) + (m.quiz || 0) + (m.assignment || 0);
    return {
      subject: m.Subject?.code || 'Sub',
      score: total,
      fullMark: 50 // assuming 20 + 10 + 20
    };
  });

  // Prepare data for Bar Chart (Attendance by Subject)
  const attendanceData = (stats.subjectWiseStats || []).map(s => ({
    name: s.code,
    percentage: s.percentage,
    attended: s.attended,
    total: s.total
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Subject Strengths Radar */}
      <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
          <TrendingUp className="text-indigo-600 w-5 h-5" />
          Subject Strengths (Internals)
        </h3>
        <div className="h-72 w-full">
          {marksData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={marksData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#6b7280', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 50]} tick={{ fill: '#9ca3af', fontSize: 10 }} />
                <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">No marks recorded yet</div>
          )}
        </div>
      </div>

      {/* Attendance by Subject Bar */}
      <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
          <BarChart2 className="text-purple-600 w-5 h-5" />
          Attendance per Subject
        </h3>
        <div className="h-72 w-full">
          {attendanceData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={attendanceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} axisLine={false} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(value) => [`${value}%`, 'Attendance']}
                />
                <Bar dataKey="percentage" fill="#a855f7" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">No attendance data</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdvancedAnalytics;
