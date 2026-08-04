import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Save, Loader2, AlertCircle, Play, Square, RefreshCw, CheckCircle2, QrCode } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { QRCodeSVG } from 'qrcode.react';
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

  // Smart Session States
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionOtp, setSessionOtp] = useState('');
  const [sessionQrToken, setSessionQrToken] = useState('');
  const [rotationLoading, setRotationLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);

  // References
  const socketRef = useRef(null);
  const rotationIntervalRef = useRef(null);

  // Geolocation states
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState(false);
  const [gpsVerified, setGpsVerified] = useState(false);
  const [simulateGps, setSimulateGps] = useState(true); // Default to true for ease of testing
  const [distance, setDistance] = useState(0);
  const [classroomLat, setClassroomLat] = useState(20.3533);
  const [classroomLon, setClassroomLon] = useState(85.8266);
  const [updatingLocation, setUpdatingLocation] = useState(false);

  // Calculate distance between classroom and teacher
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  const verifyLocation = (isSimulated = simulateGps) => {
    console.log("verifyLocation called: isSimulated =", isSimulated, "classroomLat =", classroomLat, "classroomLon =", classroomLon);
    if (isSimulated) {
      console.log("verifyLocation: Simulating GPS verification.");
      setGpsVerified(true);
      setDistance(12); // Simulated inside range
      setGpsError(false);
      return;
    }

    setGpsLoading(true);
    setGpsError(false);

    if (!navigator.geolocation) {
      setGpsError(true);
      setGpsLoading(false);
      toast.error('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const dist = calculateDistance(latitude, longitude, classroomLat, classroomLon);
        setDistance(dist);
        
        if (dist <= 100) {
          setGpsVerified(true);
        } else {
          setGpsVerified(false);
          toast.warning(`Too far from class location: ${Math.round(dist)}m away.`);
        }
        setGpsLoading(false);
      },
      (err) => {
        console.error("GPS fetch error", err);
        setGpsError(true);
        setGpsLoading(false);
        setGpsVerified(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    if (selectedClass) {
      verifyLocation(simulateGps);
    }
  }, [selectedClass, simulateGps, classroomLat, classroomLon]);

  const handleUpdateClassroomLocation = async () => {
    if (!selectedClass) {
      toast.error('Please select a class first.');
      return;
    }
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }
    
    setUpdatingLocation(true);
    const toastId = toast.loading('Fetching your current GPS coordinates...');
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await axios.put(`/api/classes/${selectedClass}`, {
            latitude,
            longitude
          });
          
          setClasses(prev => prev.map(c => c.id === selectedClass ? { ...c, latitude, longitude } : c));
          setClassroomLat(latitude);
          setClassroomLon(longitude);
          
          toast.update(toastId, { render: 'Classroom location updated to your current coordinates!', type: 'success', isLoading: false, autoClose: 3000 });
        } catch (err) {
          console.error(err);
          toast.update(toastId, { render: 'Failed to update classroom location in database.', type: 'error', isLoading: false, autoClose: 3000 });
        } finally {
          setUpdatingLocation(false);
        }
      },
      (err) => {
        console.error(err);
        toast.update(toastId, { render: 'Failed to access GPS. Please check permission settings.', type: 'error', isLoading: false, autoClose: 3000 });
        setUpdatingLocation(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const playSuccessSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      console.error(e);
    }
  };

  // Socket Connection Setup
  useEffect(() => {
    if (selectedClass) {
      const socketHost = window.location.hostname === 'localhost' 
        ? 'http://localhost:5000' 
        : `${window.location.protocol}//${window.location.hostname}:5000`;
      
      // Connect socket
      const socket = io(socketHost);
      socketRef.current = socket;

      socket.on('connect', () => {
        console.log("WebSocket connected to backend.");
        socket.emit('join_session', selectedClass);
      });

      socket.on('student_checked_in', (data) => {
        console.log("Student checked in live:", data);
        playSuccessSound();
        setAttendanceData(prev => ({ ...prev, [data.studentId]: 'present' }));
        toast.success(`Check-In Verified: ${data.name}!`, { autoClose: 2000 });
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [selectedClass]);

  // Initial Data Fetch
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [classRes, subRes] = await Promise.all([
          axios.get('/api/classes'),
          axios.get('/api/subjects')
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

  // Fetch students and check active session
  useEffect(() => {
    const fetchClassDetails = async () => {
      if (!selectedClass) {
        setStudents([]);
        return;
      }
      try {
        // Fetch class students
        const studentRes = await axios.get(`/api/users?role=student&classId=${selectedClass}`);
        setStudents(studentRes.data);

        // Initialize attendance values
        const initialData = {};
        studentRes.data.forEach(s => { initialData[s.id] = 'absent'; }); // Default to absent for QR check-ins
        setAttendanceData(initialData);

        // Check if class has an active session
        const matchedClass = classes.find(c => c.id === selectedClass);
        if (matchedClass) {
          setClassroomLat(matchedClass.latitude || 20.3533);
          setClassroomLon(matchedClass.longitude || 85.8266);
          
          if (matchedClass.isSessionActive) {
            setIsSessionActive(true);
            setSessionOtp(matchedClass.activeOtp || '');
            setSessionQrToken(matchedClass.activeQrToken || '');
            startRotationInterval();
          } else {
            setIsSessionActive(false);
            stopRotationInterval();
          }
        }
      } catch (err) {
        toast.error('Failed to load class details');
      }
    };
    fetchClassDetails();
  }, [selectedClass, classes]);

  // Interval handlers for rotation
  const startRotationInterval = () => {
    if (rotationIntervalRef.current) clearInterval(rotationIntervalRef.current);
    rotationIntervalRef.current = setInterval(async () => {
      try {
        setRotationLoading(true);
        const res = await axios.post(`/api/classes/${selectedClass}/rotate-codes`);
        setSessionOtp(res.data.activeOtp);
        setSessionQrToken(res.data.activeQrToken);
      } catch (e) {
        console.error("Failed to rotate session codes", e);
      } finally {
        setRotationLoading(false);
      }
    }, 10000); // Rotate codes every 10 seconds
  };

  const stopRotationInterval = () => {
    if (rotationIntervalRef.current) {
      clearInterval(rotationIntervalRef.current);
      rotationIntervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => {
      stopRotationInterval();
    };
  }, []);

  const handleStartSmartSession = async () => {
    if (!selectedClass || !selectedSubject || !date) {
      toast.error('Please select class, subject, and date first.');
      return;
    }
    if (!gpsVerified && !simulateGps) {
      toast.error('Classroom GPS lock check failed. You must be in location bounds to start.');
      return;
    }

    setSessionLoading(true);
    try {
      const res = await axios.post(`/api/classes/${selectedClass}/start-session`, {
        subjectId: selectedSubject,
        date
      });
      setSessionOtp(res.data.activeOtp);
      setSessionQrToken(res.data.activeQrToken);
      setIsSessionActive(true);
      startRotationInterval();
      toast.success('Dynamic QR & OTP Session active!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to start attendance session');
    } finally {
      setSessionLoading(false);
    }
  };

  const handleStopSmartSession = async () => {
    setSessionLoading(true);
    stopRotationInterval();
    try {
      await axios.post(`/api/classes/${selectedClass}/end-session`, {
        subjectId: selectedSubject,
        date
      });
      setIsSessionActive(false);
      toast.success('Session stopped. Absent students compiled and notified successfully.');
    } catch (err) {
      toast.error('Failed to close session cleanly.');
    } finally {
      setSessionLoading(false);
    }
  };

  const handleSaveAttendance = async () => {
    if (isSessionActive) {
      // End session first
      await handleStopSmartSession();
    }

    // Standard manual save submission fallback
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
      toast.success('Attendance records saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save attendance');
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

  // Checked-in counter
  const checkedInCount = Object.values(attendanceData).filter(v => v === 'present').length;

  if (loading) return <div className="p-6 text-gray-500">Loading Mark Attendance panel...</div>;

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

      {selectedClass && (
        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className={`p-2.5 rounded-xl self-start sm:self-auto ${gpsVerified ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600' : 'bg-red-100 dark:bg-red-900/20 text-red-600'}`}>
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                📍 Classroom Lock: {gpsVerified ? 'VERIFIED' : 'OUTSIDE BOUNDS'}
                {gpsLoading && <span className="text-[10px] text-yellow-500 font-semibold animate-pulse">(checking...)</span>}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Current distance to classroom: <span className="font-semibold">{distance > 1000 ? `${(distance/1000).toFixed(2)} km` : `${Math.round(distance)} meters`}</span>. Allowed range: <span className="font-semibold">100m</span>.
              </p>
              <div className="text-[10px] text-gray-400 dark:text-gray-500 font-medium mt-1">
                Target coordinates: <span className="font-bold text-indigo-500">{classroomLat.toFixed(6)}, {classroomLon.toFixed(6)}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleUpdateClassroomLocation}
              disabled={updatingLocation}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/30 dark:hover:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-bold rounded-lg text-xs transition-colors border border-indigo-100 dark:border-indigo-900/50"
            >
              {updatingLocation ? 'Updating...' : '📍 Lock GPS to this room'}
            </button>
            <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800/50 px-3 py-1.5 rounded-xl border border-gray-100 dark:border-dark-border text-xs">
              <span className="text-gray-500 dark:text-gray-400 font-medium">🧪 Simulate GPS</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={simulateGps} 
                  onChange={(e) => {
                    const val = e.target.checked;
                    setSimulateGps(val);
                    if (selectedClass) {
                      verifyLocation(val);
                    }
                  }} 
                />
                <div className="w-9 h-5 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
              </label>
            </div>
          </div>
        </div>
      )}

      {students.length > 0 && (
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
          
          {/* Header Card with Session Toggle */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-dark-border flex items-center justify-between flex-wrap gap-3">
            <h2 className="text-md font-bold text-gray-900 dark:text-white">Smart Check-In Panel</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-semibold bg-gray-100 dark:bg-gray-900 px-3 py-1.5 rounded-lg border border-gray-200/50 dark:border-dark-border/40">
                Checked-In: <strong className="text-teal-600 dark:text-teal-400">{checkedInCount}</strong> / {students.length}
              </span>
              
              {!isSessionActive ? (
                <button
                  type="button"
                  onClick={handleStartSmartSession}
                  disabled={sessionLoading || !selectedClass || !selectedSubject}
                  className="px-4 py-2 text-white bg-teal-600 hover:bg-teal-700 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-teal-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {sessionLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Play className="w-3.5 h-3.5" />
                  )}
                  Start Smart Session
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopSmartSession}
                  disabled={sessionLoading}
                  className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 font-bold rounded-xl text-xs flex items-center gap-2 shadow-md shadow-red-500/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  {sessionLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Square className="w-3.5 h-3.5" />
                  )}
                  Stop Check-In Session
                </button>
              )}
            </div>
          </div>

          {/* Smart Check-In Display (QR & OTP Board) */}
          {isSessionActive && (
            <div className="p-8 border-b border-gray-100 dark:border-dark-border bg-gradient-to-tr from-gray-50 via-teal-50/20 to-indigo-50/20 dark:from-dark-card dark:via-teal-950/10 dark:to-indigo-950/10 flex flex-col md:flex-row items-center justify-around gap-8">
              
              {/* OTP Pad */}
              <div className="flex flex-col items-center justify-center bg-white dark:bg-dark-bg p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-md w-60">
                <div className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-3">4-Digit Passcode</div>
                <div className="text-5xl font-black text-indigo-600 dark:text-indigo-400 tracking-wider flex items-center gap-1.5 animate-pulse">
                  {sessionOtp.split('').map((char, i) => (
                    <span key={i} className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl border border-indigo-100 dark:border-indigo-900/50">{char}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-4 text-[10px] text-gray-500 font-semibold">
                  <RefreshCw className={`w-3.5 h-3.5 text-teal-500 ${rotationLoading ? 'animate-spin' : ''}`} />
                  Rotates every 10s
                </div>
              </div>

              {/* QR Code */}
              <div className="flex flex-col items-center justify-center bg-white dark:bg-dark-bg p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-md w-60">
                <div className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-3">Scan to Check-In</div>
                <div className="p-3 bg-white rounded-2xl border-2 border-gray-100 dark:border-dark-border flex items-center justify-center">
                  <QRCodeSVG 
                    value={JSON.stringify({ classId: selectedClass, qrToken: sessionQrToken, subjectId: selectedSubject, date })} 
                    size={130}
                    level="H"
                    includeMargin={false}
                  />
                </div>
                <div className="flex items-center gap-1.5 mt-3 text-[10px] text-teal-600 dark:text-teal-400 font-bold uppercase tracking-wider">
                  <QrCode className="w-3.5 h-3.5" />
                  Dynamic QR Code
                </div>
              </div>
            </div>
          )}

          {/* Student Roster Table */}
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
                  <td className="p-4 flex items-center gap-2.5">
                    {attendanceData[s.id] === 'present' && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    )}
                    {s.name}
                  </td>
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
            <button onClick={handleSaveAttendance} className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2">
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
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
              >
                {materialSaving ? 'Sharing...' : 'Share with Students'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default MarkAttendance;
