import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

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
