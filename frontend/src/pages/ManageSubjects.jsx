import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Trash2, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


const ManageSubjects = () => {
  const { user } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newSubject, setNewSubject] = useState({ name: '', code: '', classId: '', teacherId: '', type: 'theory', credits: 3, course: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [subRes, classRes, teacherRes] = await Promise.all([
          axios.get('/api/subjects'),
          axios.get('/api/classes'),
          axios.get('/api/users?role=teacher')
        ]);
        setSubjects(subRes.data);
        setClasses(classRes.data);
        setTeachers(teacherRes.data);
      } catch (err) {
        toast.error('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/subjects', newSubject);
      const createdSubject = {
        ...res.data,
        Class: classes.find(c => c.id === res.data.classId),
        Teacher: teachers.find(t => t.id === res.data.teacherId)
      };
      setSubjects([...subjects, createdSubject]);
      setNewSubject({ name: '', code: '', classId: '', teacherId: '', type: 'theory', credits: 3, course: '' });
      toast.success('Subject created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create subject');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete subject "${name}"? This action is irreversible and will remove all associated attendance logs and internal marks records.`)) {
      try {
        await axios.delete(`/api/subjects/${id}`);
        setSubjects(subjects.filter((s) => s.id !== id));
        toast.success(`Subject "${name}" has been successfully deleted.`);
      } catch (err) {
        toast.error('Failed to delete subject');
      }
    }
  };

  const handleUpdateCourse = async (id, course) => {
    try {
      const res = await axios.put(`/api/subjects/${id}`, { course });
      setSubjects(subjects.map(s => s.id === id ? { ...s, course: res.data.course } : s));
      toast.success('Subject course updated');
    } catch (err) {
      toast.error('Failed to update course');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {user.role === 'teacher' ? 'Subject Directory' : 'Manage Subjects'}
        </h1>
      </div>

      {user.role === 'admin' && (
        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-7 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Subject Name</label>
              <input type="text" required className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg" value={newSubject.name} onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Code</label>
              <input type="text" required className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg" value={newSubject.code} onChange={(e) => setNewSubject({ ...newSubject, code: e.target.value })} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Class</label>
              <select required className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg" value={newSubject.classId} onChange={(e) => setNewSubject({ ...newSubject, classId: e.target.value })}>
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Course</label>
              <select required className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg" value={newSubject.course} onChange={(e) => setNewSubject({ ...newSubject, course: e.target.value })}>
                <option value="">Select Course</option>
                <option value="BCA">BCA</option>
                <option value="BSc Computer Science">BSc Computer Science</option>
                <option value="BTech CSE">BTech CSE</option>
                <option value="BTech Mechanical">BTech Mechanical</option>
                <option value="BBA">BBA</option>
                <option value="MBA">MBA</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Teacher</label>
              <select required className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg" value={newSubject.teacherId} onChange={(e) => setNewSubject({ ...newSubject, teacherId: e.target.value })}>
                <option value="">Select Teacher</option>
                {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select required className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg" value={newSubject.type} onChange={(e) => setNewSubject({ ...newSubject, type: e.target.value })}>
                <option value="theory">Theory</option>
                <option value="lab">Lab (Practical)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Credits</label>
              <input type="number" required min="1" max="10" className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg" value={newSubject.credits} onChange={(e) => setNewSubject({ ...newSubject, credits: Number(e.target.value) })} />
            </div>
            <div className="md:col-span-7 flex justify-end mt-2">
              <button type="submit" className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2 h-10">
                <Plus className="w-5 h-5" /> Add Subject
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-dark-border">
              <th className="p-4 font-medium">Code</th>
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Course</th>
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium text-center">Credits</th>
              <th className="p-4 font-medium">Class</th>
              <th className="p-4 font-medium">Teacher</th>
              {user.role === 'admin' && <th className="p-4 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {subjects.map((s) => (
              <tr key={s.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="p-4 font-medium">{s.code}</td>
                <td className="p-4">{s.name}</td>
                <td className="p-4">
                  {user.role === 'admin' ? (
                    <select
                      className="px-2 py-1 border rounded-lg dark:bg-dark-bg dark:border-dark-border text-xs normal-case font-semibold"
                      value={s.course || ''}
                      onChange={(e) => handleUpdateCourse(s.id, e.target.value)}
                    >
                      <option value="">No Course</option>
                      <option value="BCA">BCA</option>
                      <option value="BSc Computer Science">BSc Computer Science</option>
                      <option value="BTech CSE">BTech CSE</option>
                      <option value="BTech Mechanical">BTech Mechanical</option>
                      <option value="BBA">BBA</option>
                      <option value="MBA">MBA</option>
                    </select>
                  ) : (
                    <span className="font-semibold text-xs text-gray-500 uppercase">{s.course || 'N/A'}</span>
                  )}
                </td>
                <td className="p-4 capitalize">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${s.type === 'lab' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {s.type}
                  </span>
                </td>
                <td className="p-4 text-center font-bold">{s.credits}</td>
                <td className="p-4">{s.Class?.name}</td>
                <td className="p-4">{s.Teacher?.name}</td>
                {user.role === 'admin' && (
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(s.id, s.name)} className="text-red-500 hover:text-red-700 p-2">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageSubjects;
