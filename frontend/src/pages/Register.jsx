import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Mail, Lock, User as UserIcon, UserPlus } from 'lucide-react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'student', classId: '', parentEmail: '', course: '', collegeId: '', accessCode: '' });
  const [classes, setClasses] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [newCollegeName, setNewCollegeName] = useState('');
  const [newCollegeKey, setNewCollegeKey] = useState('');
  const [licenseKey, setLicenseKey] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleCreateCollege = async (e) => {
    e.preventDefault();
    if (!newCollegeName || !newCollegeKey || !licenseKey) return;
    try {
      setLoading(true);
      const res = await axios.post('/api/auth/colleges', {
        name: newCollegeName,
        secretKey: newCollegeKey,
        licenseKey: licenseKey
      });
      toast.success(`${newCollegeName} registered successfully!`);
      const colRes = await axios.get('/api/auth/colleges');
      setColleges(colRes.data);
      setFormData(prev => ({ ...prev, collegeId: res.data.id }));
      setNewCollegeName('');
      setNewCollegeKey('');
      setLicenseKey('');
      setShowCollegeModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to register college');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const res = await axios.get('/api/auth/colleges');
        setColleges(res.data);
      } catch (err) {
        console.error("Failed to load colleges", err);
      }
    };
    fetchColleges();
  }, []);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const url = formData.collegeId ? `/api/classes?collegeId=${formData.collegeId}` : '/api/classes';
        const res = await axios.get(url);
        setClasses(res.data);
      } catch (err) {
        console.error("Failed to load classes", err);
      }
    };
    fetchClasses();
  }, [formData.collegeId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.collegeId) {
      toast.error('Please select a college');
      return;
    }
    if (formData.role === 'student') {
      if (!formData.classId) {
        toast.error('Please select a class');
        return;
      }
      if (!formData.parentEmail) {
        toast.error('Please enter a parent email');
        return;
      }
    }
    setLoading(true);
    try {
      await register(formData);
      toast.success('Registration successful!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-dark-bg py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-200">
      <div className="max-w-md w-full space-y-8 bg-white dark:bg-dark-card p-8 rounded-2xl shadow-xl border border-gray-100 dark:border-dark-border">
        <div>
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-primary-500/30">
            E
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Create Account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
            Register your account in EduStack Pro
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-bg dark:text-white transition-shadow"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-bg dark:text-white transition-shadow"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="password"
                  required
                  className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-bg dark:text-white transition-shadow"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select College</label>
              <select
                required
                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-bg dark:text-white transition-shadow"
                value={formData.collegeId}
                onChange={(e) => setFormData({ ...formData, collegeId: e.target.value, classId: '' })}
              >
                <option value="">Choose College...</option>
                {colleges.map(col => (
                  <option key={col.id} value={col.id}>{col.name}</option>
                ))}
              </select>
              <div className="flex justify-end mt-1">
                <button
                  type="button"
                  onClick={() => setShowCollegeModal(true)}
                  className="text-xs font-semibold text-primary-600 hover:text-primary-800 dark:text-primary-400 hover:underline"
                >
                  Don't see your college? Register it here
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Register As</label>
              <select
                className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-bg dark:text-white transition-shadow"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="mentor">Mentor</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {(formData.role === 'admin' || formData.role === 'teacher' || formData.role === 'mentor') && (
              <div>
                <label className="block text-sm font-medium text-red-600 dark:text-red-400 mb-1">Administrative Access Code</label>
                <input
                  type="text"
                  required
                  placeholder="Enter secret college key"
                  className="appearance-none block w-full px-3 py-2 border border-red-300 dark:border-red-900/30 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-dark-bg dark:text-white transition-shadow"
                  value={formData.accessCode}
                  onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
                />
                <p className="text-[10px] text-gray-500 mt-1">Please enter your college's secret staff code (e.g., EDU-ADMIN-KEY-2026).</p>
              </div>
            )}

            {(formData.role === 'student' || formData.role === 'mentor' || formData.role === 'admin') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Course / Department</label>
                <select
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-bg dark:text-white transition-shadow"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                >
                  <option value="">Select Course</option>
                  <option value="BCA">BCA</option>
                  <option value="BSc Computer Science">BSc Computer Science</option>
                  <option value="BTech CSE">BTech CSE</option>
                  <option value="BTech Mechanical">BTech Mechanical</option>
                  <option value="BBA">BBA</option>
                  <option value="MBA">MBA</option>
                </select>
              </div>
            )}

            {formData.role === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assign Class & Section</label>
                  <select
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-bg dark:text-white transition-shadow"
                    value={formData.classId}
                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                  >
                    <option value="">Select Class & Section</option>
                    {classes
                      .filter(c => !formData.course || !c.course || c.course.toLowerCase() === formData.course.toLowerCase())
                      .map(c => (
                        <option key={c.id} value={c.id}>
                          {c.name} {(!formData.course && c.course) ? `(${c.course})` : ''}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parent's Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      required
                      className="appearance-none block w-full pl-10 px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-bg dark:text-white transition-shadow"
                      placeholder="parent@example.com"
                      value={formData.parentEmail}
                      onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-md transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                'Registering...'
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <UserPlus className="h-5 w-5 text-primary-300 group-hover:text-primary-100 transition-colors" />
                  </span>
                  Register
                </>
              )}
            </button>
          </div>
          <div className="text-sm text-center">
            <span className="text-gray-600 dark:text-gray-400">Already have an account? </span>
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400">
              Sign in
            </Link>
          </div>
        </form>
      </div>

      {/* Register College Modal */}
      {showCollegeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-dark-card w-full max-w-md rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-dark-border">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Register Your College</h3>
            <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
              Add your institution to EduStack Pro so students and teachers from your campus can sign up.
            </p>

            <form onSubmit={handleCreateCollege} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">College Name</label>
                <input
                  type="text"
                  required
                  placeholder="Enter college name"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-bg dark:text-white transition-shadow"
                  value={newCollegeName}
                  onChange={(e) => setNewCollegeName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Staff Access Code</label>
                <input
                  type="password"
                  required
                  placeholder="Create custom verification code"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-bg dark:text-white transition-shadow"
                  value={newCollegeKey}
                  onChange={(e) => setNewCollegeKey(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Master License Key</label>
                <input
                  type="password"
                  required
                  placeholder="Enter platform license key"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-bg dark:text-white transition-shadow"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setNewCollegeName('');
                    setNewCollegeKey('');
                    setLicenseKey('');
                    setShowCollegeModal(false);
                  }}
                  className="px-4 py-2 border border-gray-200 dark:border-dark-border rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-bg text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-lg text-sm font-semibold transition-all shadow-md"
                >
                  {loading ? 'Creating...' : 'Register College'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
