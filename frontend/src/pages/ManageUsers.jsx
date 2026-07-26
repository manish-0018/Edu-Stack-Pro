import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Trash2, Save, Loader2, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ManageUsers = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState(user.role === 'teacher' ? 'student' : '');
  const [editEmails, setEditEmails] = useState({}); // Stores temporary text updates for parent emails

  // Student details modal state
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentStatsLoading, setStudentStatsLoading] = useState(false);

  const fetchStudentDetails = async (studentId) => {
    setStudentStatsLoading(true);
    try {
      const res = await axios.get(`/api/dashboard/student/${studentId}`);
      setSelectedStudent(res.data);
    } catch (err) {
      toast.error('Failed to load student details');
    } finally {
      setStudentStatsLoading(false);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [userRes, classRes] = await Promise.all([
        axios.get(`/api/users${roleFilter ? `?role=${roleFilter}` : ''}`),
        axios.get('/api/classes')
      ]);
      setUsers(userRes.data);
      setClasses(classRes.data);

      // Pre-fill edit emails state
      const emails = {};
      userRes.data.forEach(u => {
        emails[u.id] = u.parentEmail || '';
      });
      setEditEmails(emails);
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [roleFilter]);

  const handleClassChange = async (userId, classId) => {
    try {
      const res = await axios.put(`/api/users/${userId}`, { classId });
      setUsers(users.map(u => u.id === userId ? res.data : u));
      toast.success('Student class updated');
    } catch (err) {
      toast.error('Failed to update student class');
    }
  };

  const handleParentEmailSave = async (userId) => {
    try {
      const parentEmail = editEmails[userId];
      const res = await axios.put(`/api/users/${userId}`, { parentEmail });
      setUsers(users.map(u => u.id === userId ? res.data : u));
      toast.success('Parent email saved');
    } catch (err) {
      toast.error('Failed to update parent email');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete the user account for "${name}"? This action is irreversible and will remove all associated attendance logs and academic records from the database.`)) {
      try {
        await axios.delete(`/api/users/${id}`);
        toast.success(`User account for "${name}" has been successfully deleted.`);
        setUsers(users.filter((user) => user.id !== id));
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-primary-600 animate-spin" />
        <span className="ml-2 font-medium text-gray-500">Loading student directory...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {user.role === 'teacher' ? 'Student Directory' : 'Manage Users'}
        </h1>
        {user.role === 'admin' && (
          <div className="flex gap-4">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-2 border rounded-lg dark:bg-dark-bg dark:border-dark-border"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="teacher">Teacher</option>
              <option value="student">Student</option>
            </select>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-dark-border">
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Name</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Email</th>
                {user.role === 'admin' && <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Role</th>}
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Class</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Course</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300 text-center">Theory Attendance</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300 text-center">Lab Attendance</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300 text-center">Overall</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Parent's Email Address</th>
                {user.role === 'admin' && <th className="p-4 font-medium text-gray-600 dark:text-gray-300 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 text-sm">
                  <td className="p-4 font-medium">
                    {u.role === 'student' ? (
                      <button
                        onClick={() => fetchStudentDetails(u.id)}
                        className="text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300 hover:underline font-bold text-left transition-colors"
                      >
                        {u.name}
                      </button>
                    ) : (
                      u.name
                    )}
                  </td>
                  <td className="p-4 text-gray-500">{u.email}</td>
                  {user.role === 'admin' && (
                    <td className="p-4 capitalize">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        u.role === 'admin' ? 'bg-red-100 text-red-700' :
                        u.role === 'teacher' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                  )}
                  <td className="p-4 text-gray-500">
                    {u.role === 'student' ? (
                      user.role === 'admin' ? (
                        <select
                          className="px-2 py-1 border rounded-lg dark:bg-dark-bg dark:border-dark-border text-sm"
                          value={u.classId || ''}
                          onChange={(e) => handleClassChange(u.id, e.target.value)}
                        >
                          <option value="">No Class</option>
                          {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      ) : (
                        u.Class?.name || 'N/A'
                      )
                    ) : (
                      <span className="text-gray-400 text-sm">N/A</span>
                    )}
                  </td>
                  <td className="p-4 text-gray-500 text-xs font-semibold uppercase">
                    {u.role === 'student' ? (u.course || 'N/A') : <span className="text-gray-400 text-sm font-normal normal-case">N/A</span>}
                  </td>
                  
                  {/* Theory Attendance Column */}
                  <td className="p-4 text-center">
                    {u.role === 'student' ? (
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${u.theoryPercentage >= 75 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.theoryPercentage !== undefined ? `${u.theoryPercentage}% (${u.theoryRatio})` : '0%'}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">N/A</span>
                    )}
                  </td>

                  {/* Lab Attendance Column */}
                  <td className="p-4 text-center">
                    {u.role === 'student' ? (
                      <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${u.labPercentage >= 60 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {u.labPercentage !== undefined ? `${u.labPercentage}% (${u.labRatio})` : '0%'}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">N/A</span>
                    )}
                  </td>

                  {/* Overall Attendance Column */}
                  <td className="p-4 text-center font-bold text-gray-700 dark:text-gray-300">
                    {u.role === 'student' ? (
                      u.attendancePercentage !== undefined ? `${u.attendancePercentage}%` : '0%'
                    ) : (
                      <span className="text-gray-400 text-sm font-normal">N/A</span>
                    )}
                  </td>

                  <td className="p-4">
                    {u.role === 'student' ? (
                      user.role === 'admin' ? (
                        <div className="flex gap-2 items-center">
                          <input
                            type="email"
                            placeholder="parent@example.com"
                            className="px-2 py-1 border rounded-lg dark:bg-dark-bg dark:border-dark-border text-sm flex-1 min-w-[150px]"
                            value={editEmails[u.id] || ''}
                            onChange={(e) => setEditEmails({ ...editEmails, [u.id]: e.target.value })}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleParentEmailSave(u.id);
                            }}
                          />
                          <button
                            onClick={() => handleParentEmailSave(u.id)}
                            className="text-primary-600 hover:text-primary-700 p-1.5 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                            title="Save Parent Email"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        u.parentEmail || 'Not Registered'
                      )
                    ) : (
                      <span className="text-gray-400 text-sm">N/A</span>
                    )}
                  </td>
                  {user.role === 'admin' && (
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDelete(u.id, u.name)}
                        className="text-red-500 hover:text-red-700 p-2"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {users.length === 0 && (
          <div className="p-8 text-center text-gray-500">No users found.</div>
        )}
      </div>

      {/* Detailed Student Attendance Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl w-full max-w-2xl border border-gray-100 dark:border-dark-border shadow-xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 text-left">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detailed Attendance Report</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Student: <strong className="text-gray-700 dark:text-gray-200">{selectedStudent.student?.name}</strong> • {selectedStudent.student?.email}
                  {selectedStudent.student?.course && (
                    <span className="block mt-1">
                      Course: <strong className="text-gray-700 dark:text-gray-200">{selectedStudent.student.course}</strong>
                    </span>
                  )}
                </p>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-bold bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg transition-colors"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 text-center">
              <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-100 dark:border-dark-border">
                <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Theory Attendance</span>
                <span className={`text-xl font-bold ${selectedStudent.theoryPercentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedStudent.theoryPercentage}%
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  ({selectedStudent.theoryAttended}/{selectedStudent.theoryTotal} classes)
                </span>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-100 dark:border-dark-border">
                <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Lab Attendance</span>
                <span className={`text-xl font-bold ${selectedStudent.labPercentage >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedStudent.labPercentage}%
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  ({selectedStudent.labAttended}/{selectedStudent.labTotal} classes)
                </span>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-100 dark:border-dark-border">
                <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Overall Attendance</span>
                <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {selectedStudent.attendancePercentage}%
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  ({selectedStudent.theoryAttended + selectedStudent.labAttended}/{selectedStudent.theoryTotal + selectedStudent.labTotal} classes)
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800 text-gray-500 font-bold">
                    <th className="pb-2">Subject Name (Code)</th>
                    <th className="pb-2 text-center">Type</th>
                    <th className="pb-2 text-center">Attended/Held</th>
                    <th className="pb-2 text-center">Percentage</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStudent.subjects?.map((sub) => {
                    const threshold = sub.type === 'lab' ? 60 : 75;
                    const isSafe = sub.percentage >= threshold;
                    return (
                      <tr key={sub.id} className="border-b border-gray-50 dark:border-gray-800/30 last:border-0 text-gray-700 dark:text-gray-300">
                        <td className="py-3 font-semibold">{sub.name} ({sub.code})</td>
                        <td className="py-3 text-center capitalize">{sub.type}</td>
                        <td className="py-3 text-center font-medium">{sub.attended}/{sub.total}</td>
                        <td className="py-3 text-center font-bold">{sub.percentage}%</td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${isSafe ? 'bg-green-50 text-green-700 dark:bg-green-950/20' : 'bg-red-50 text-red-700 dark:bg-red-950/20'}`}>
                            {isSafe ? 'Safe' : 'Defaulter'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                  {(!selectedStudent.subjects || selectedStudent.subjects.length === 0) && (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-400">No subjects or attendance records found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
