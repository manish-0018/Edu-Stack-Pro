import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, BookOpen, Calendar, GraduationCap, AlertTriangle } from 'lucide-react';
import { toast } from 'react-toastify';

const GuardianDashboard = () => {
  const { user } = useAuth();
  const [student, setStudent] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/users/guardian/student');
        setStudent(res.data.student);
        setAttendanceStats(res.data.attendanceStats);
        setMarks(res.data.marks);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to load student data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-primary-500" />
          Guardian Portal
        </h1>
        <p className="text-gray-500 dark:text-gray-400">Welcome, {user?.name}. Monitor your ward's progress.</p>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-20 text-gray-500">Loading student data...</div>
      ) : student ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Student Info Card */}
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border col-span-1 lg:col-span-3 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex justify-center items-center font-bold text-2xl">
                {student.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{student.name}</h2>
                <p className="text-gray-500 flex items-center gap-2"><GraduationCap className="w-4 h-4"/> Course: {student.course}</p>
              </div>
            </div>
          </div>

          {/* Attendance Overview */}
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border lg:col-span-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-500" />
                Attendance
              </h2>
            </div>
            
            <div className="flex flex-col items-center justify-center py-6">
              <div className={`text-5xl font-black mb-2 ${
                attendanceStats?.attendancePercentage >= 75 ? 'text-emerald-500' : 'text-rose-500'
              }`}>
                {attendanceStats?.attendancePercentage}%
              </div>
              <p className="text-gray-500">Overall Attendance</p>
            </div>

            {attendanceStats?.attendancePercentage < 75 && (
              <div className="mt-4 p-4 bg-rose-50 border border-rose-100 rounded-xl flex gap-3 text-rose-700">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm font-medium">Warning: Attendance is below the 75% required threshold.</p>
              </div>
            )}
            
            <div className="mt-6 flex justify-between text-sm text-gray-500 px-4">
              <div className="text-center">
                <p className="font-bold text-gray-900 dark:text-white text-xl">{attendanceStats?.attendedClasses}</p>
                <p>Classes Attended</p>
              </div>
              <div className="text-center">
                <p className="font-bold text-gray-900 dark:text-white text-xl">{attendanceStats?.totalClasses}</p>
                <p>Total Classes</p>
              </div>
            </div>
          </div>

          {/* Academic Performance */}
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                Recent Grades
              </h2>
            </div>
            
            <div className="space-y-4">
              {marks.length === 0 ? (
                <p className="text-gray-500 text-center py-10">No grades posted yet.</p>
              ) : (
                marks.map(mark => (
                  <div key={mark.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-slate-800/50 rounded-xl border border-gray-100 dark:border-dark-border">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white">{mark.Subject?.name}</h4>
                      <p className="text-sm text-gray-500 capitalize">{mark.examType}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {mark.score} <span className="text-sm text-gray-400 font-normal">/ {mark.maxScore}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {Math.round((mark.score / mark.maxScore) * 100)}%
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      ) : (
        <div className="bg-white dark:bg-dark-card p-10 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border text-center">
          <ShieldCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Student Linked</h2>
          <p className="text-gray-500">Please ensure the student has registered your email address as their Parent/Guardian.</p>
        </div>
      )}
    </div>
  );
};

export default GuardianDashboard;
