import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Save, ShieldAlert, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const MarkAttendance = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceData, setAttendanceData] = useState({}); // { studentId: 'present' }
  const [loading, setLoading] = useState(true);
  const [materialTitle, setMaterialTitle] = useState('');
  const [materialUrl, setMaterialUrl] = useState('');
  const [materialSaving, setMaterialSaving] = useState(false);

  // Geofenced Session States
  const [isSmartActive, setIsSmartActive] = useState(false);
  const [otp, setOtp] = useState('');
  const [expiresIn, setExpiresIn] = useState(15);
  const [checkedInStudents, setCheckedInStudents] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [classRes, subRes] = await Promise.all([
          axios.get('/api/classes'),
          axios.get('/api/subjects') // Backend filters by teacher automatically
        ]);
        setClasses(classRes.data);
        setSubjects(subRes.data);
      } catch (err) {
        toast.error('Failed to load classes or subjects');
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Socket.io check-in listener
  useEffect(() => {
    let socketClient;
    if (isSmartActive && selectedClass) {
      socketClient = io(axios.defaults.baseURL || window.location.origin);
      
      socketClient.on('connect', () => {
        socketClient.emit('join_session', selectedClass);
      });

      socketClient.on('student_checked_in', (data) => {
        setCheckedInStudents(prev => {
          if (prev.some(s => s.id === data.studentId)) return prev;
          return [...prev, { id: data.studentId, name: data.name, email: data.email }];
        });
        
        // Auto-mark present in UI list
        setAttendanceData(prev => ({
          ...prev,
          [data.studentId]: 'present'
        }));
        
        toast.success(`${data.name} checked in successfully!`);
      });
    }
    return () => {
      if (socketClient) {
        socketClient.disconnect();
      }
    };
  }, [isSmartActive, selectedClass]);

  // Code rotation timer countdown
  useEffect(() => {
    let timer;
    if (isSmartActive) {
      timer = setInterval(() => {
        setExpiresIn(prev => {
          if (prev <= 1) {
            handleRotateCodes();
            return 15;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isSmartActive, selectedClass]);

  const handleStartSmartSession = async () => {
    if (!selectedClass || !selectedSubject) {
      toast.error('Please select a class and subject first');
      return;
    }
    try {
      const res = await axios.post(`/api/classes/${selectedClass}/start-session`, {
        subjectId: selectedSubject,
        date,
        latitude: user.College?.latitude || 20.3533,
        longitude: user.College?.longitude || 85.8266,
        enableLocationLock: true
      });
      setOtp(res.data.activeOtp);
      setExpiresIn(15);
      setCheckedInStudents([]);
      setIsSmartActive(true);
      toast.success('Smart Check-In Session started!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start Smart Session');
    }
  };

  const handleRotateCodes = async () => {
    if (!selectedClass) return;
    try {
      const res = await axios.post(`/api/classes/${selectedClass}/rotate-codes`);
      setOtp(res.data.activeOtp);
      setExpiresIn(15);
    } catch (err) {
      console.error('Failed to rotate session codes', err);
    }
  };

  const handleEndSmartSession = async () => {
    if (!selectedClass) return;
    try {
      await axios.post(`/api/classes/${selectedClass}/end-session`, {
        subjectId: selectedSubject,
        date
      });
      setIsSmartActive(false);
      setOtp('');
      toast.info('Smart Check-In Session closed.');
    } catch (err) {
      toast.error('Failed to close Smart Session');
    }
  };

  // Fetch students when a class is selected
  useEffect(() => {
    const fetchStudents = async () => {
      if (!selectedClass) {
        setStudents([]);
        return;
      }
      try {
        const res = await axios.get(`/api/users?role=student&classId=${selectedClass}`);
        setStudents(res.data);
        // Initialize attendance to present for everyone
        const initialData = {};
        res.data.forEach(s => { initialData[s.id] = 'present'; });
        setAttendanceData(initialData);
      } catch (err) {
        toast.error('Failed to load students');
      }
    };
    fetchStudents();
  }, [selectedClass]);

  const handleSubmit = async () => {
    if (!selectedClass || !selectedSubject || !date) {
      toast.error('Please select class, subject, and date');
      return;
    }

    const records = students.map(s => ({
      studentId: s.id,
      status: attendanceData[s.id]
    }));

    try {
      await axios.post('/api/attendance', {
        classId: selectedClass,
        subjectId: selectedSubject,
        date,
        records
      });
      toast.success('Attendance marked successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark attendance');
    }
  };

  const handlePostMaterial = async (e) => {
    e.preventDefault();
    if (!selectedSubject || !materialTitle || !materialUrl) {
      toast.error('Please fill in all material fields');
      return;
    }

    setMaterialSaving(true);
    try {
      await axios.post('/api/materials', {
        subjectId: selectedSubject,
        title: materialTitle,
        contentUrl: materialUrl,
        date: date
      });
      toast.success('Lecture materials shared successfully!');
      setMaterialTitle('');
      setMaterialUrl('');
    } catch (err) {
      toast.error('Failed to post lecture materials');
    } finally {
      setMaterialSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mark Attendance</h1>

      <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Date</label>
          <input type="date" className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-dark-border" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Subject</label>
          <select className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-dark-border" value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)}>
            <option value="">Select Subject</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name} ({s.code})</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Class</label>
          <select className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-dark-border" value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)}>
            <option value="">Select Class</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
      </div>

      {/* ── Smart Geofenced Check-In Panel ── */}
      {selectedClass && selectedSubject && (
        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
          {!isSmartActive ? (
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-teal-600 dark:text-teal-400" />
                  Smart GPS Geofenced Check-In
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Open a live 15-second rotating OTP check-in session. Students can check in on their own dashboard if they are within 5m of the campus target coordinates.
                </p>
              </div>
              <button
                type="button"
                onClick={handleStartSmartSession}
                className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow shadow-teal-500/10 whitespace-nowrap self-stretch md:self-auto text-center"
              >
                Start Smart Session
              </button>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-teal-500 to-indigo-600 text-white p-5 rounded-xl relative overflow-hidden">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                <div>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    📍 Smart Check-In Session Active
                    <span className="px-2 py-0.5 bg-white/20 text-white text-[9px] font-bold rounded-full uppercase tracking-widest animate-pulse">Live</span>
                  </h3>
                  <p className="text-xs text-teal-100 mt-1 max-w-md">
                    Students can check in using the 4-digit code below. Ensure they are within 5 meters of the campus target coordinates.
                  </p>
                  
                  {/* Active Code Display */}
                  <div className="mt-4 flex items-center gap-3">
                    <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                      <span className="text-[10px] text-teal-200 block uppercase font-bold tracking-wider">Access Code</span>
                      <span className="text-2xl font-black font-mono tracking-widest">{otp || '----'}</span>
                    </div>
                    <div className="bg-white/10 px-4 py-2 rounded-xl border border-white/20">
                      <span className="text-[10px] text-teal-200 block uppercase font-bold tracking-wider">Expires In</span>
                      <span className="text-2xl font-black font-mono">{expiresIn}s</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 w-full md:w-auto">
                  <button
                    type="button"
                    onClick={handleRotateCodes}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-xs font-bold transition-all text-center"
                  >
                    Force Rotate Code
                  </button>
                  <button
                    type="button"
                    onClick={handleEndSmartSession}
                    className="px-4 py-2 bg-white text-red-600 hover:bg-red-50 rounded-xl text-xs font-bold transition-all shadow text-center"
                  >
                    End Check-In Session
                  </button>
                </div>
              </div>
              
              {/* Live Checked-In Students List */}
              <div className="mt-5 border-t border-white/10 pt-4">
                <h4 className="text-xs uppercase font-bold tracking-wider text-teal-200 mb-2">
                  Live Check-Ins ({checkedInStudents.length})
                </h4>
                {checkedInStudents.length === 0 ? (
                  <p className="text-xs text-teal-100 italic">Waiting for students to check in...</p>
                ) : (
                  <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto pr-2">
                    {checkedInStudents.map(student => (
                      <span key={student.id} className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 animate-pulse">
                        ✅ {student.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {students.length > 0 && (
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-dark-border">
                <th className="p-4 font-medium">Student Name</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="p-4">{s.name}</td>
                  <td className="p-4 text-gray-500">{s.email}</td>
                  <td className="p-4 text-center">
                    <select
                      className={`px-3 py-1 border rounded-lg font-medium outline-none ${
                        attendanceData[s.id] === 'present' ? 'bg-green-50 text-green-700 border-green-200' :
                        attendanceData[s.id] === 'absent' ? 'bg-red-50 text-red-700 border-red-200' :
                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}
                      value={attendanceData[s.id]}
                      onChange={(e) => setAttendanceData({ ...attendanceData, [s.id]: e.target.value })}
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                      <option value="late">Late</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 bg-gray-50 dark:bg-gray-800 flex justify-end">
            <button onClick={handleSubmit} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2">
              <Save className="w-5 h-5" /> Save Attendance
            </button>
          </div>
        </div>
      )}

      {selectedSubject && (
        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border mt-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Share Class Materials (Optional)</h3>
          <p className="text-sm text-gray-500 mb-4">Post slides, notes, or links for students to catch up on today's lecture.</p>
          <form onSubmit={handlePostMaterial} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Material Title</label>
              <input
                type="text"
                placeholder="e.g. Lecture Slides - Introduction"
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg"
                value={materialTitle}
                onChange={(e) => setMaterialTitle(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Drive / Slide URL</label>
              <input
                type="url"
                placeholder="https://drive.google.com/..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg"
                value={materialUrl}
                onChange={(e) => setMaterialUrl(e.target.value)}
              />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                disabled={materialSaving}
                className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {materialSaving ? 'Sharing...' : 'Post Lecture Notes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;
