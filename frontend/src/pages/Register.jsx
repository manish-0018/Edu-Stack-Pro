import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Mail, 
  Lock, 
  User as UserIcon, 
  ArrowRight,
  Eye,
  EyeOff,
  GraduationCap,
  Briefcase,
  KeyRound,
  UserCheck,
  Building2,
  BookOpen,
  Users
} from 'lucide-react';
import axios from 'axios';

const REGISTER_ROLES = [
  { id: 'student', label: 'Student', icon: GraduationCap },
  { id: 'teacher', label: 'Faculty', icon: Briefcase },
  { id: 'mentor', label: 'Mentor', icon: UserCheck },
  { id: 'admin', label: 'Admin', icon: KeyRound }
];

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    role: 'student', 
    classId: '', 
    parentEmail: '', 
    course: '', 
    collegeId: '', 
    accessCode: '' 
  });
  const [classes, setClasses] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Register College Modal States
  const [showCollegeModal, setShowCollegeModal] = useState(false);
  const [newCollegeName, setNewCollegeName] = useState('');
  const [newCollegeKey, setNewCollegeKey] = useState('');
  const [licenseKey, setLicenseKey] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

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

  const defaultCourses = ['BCA', 'BSc Computer Science', 'BTech CSE', 'BTech Mechanical', 'BBA', 'MBA'];
  const availableCourses = Array.from(new Set([
    ...defaultCourses,
    ...classes.map(c => c.course).filter(Boolean)
  ]));

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.collegeId) {
      toast.error('Please select a college');
      return;
    }
    if (['student', 'teacher', 'mentor', 'admin'].includes(formData.role) && !formData.course) {
      toast.error('Please select a course / department');
      return;
    }
    if ((formData.role === 'admin' || formData.role === 'teacher' || formData.role === 'mentor') && !formData.accessCode) {
      toast.error('Please enter administrative access code');
      return;
    }
    if (formData.role === 'student' && !formData.parentEmail) {
      toast.error('Please enter a parent email');
      return;
    }

    setLoading(true);
    try {
      await register(formData);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex flex-col justify-center items-center p-4 sm:p-6 py-12 relative overflow-hidden">
      
      {/* Subtle Static Ambient Background Glows */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-indigo-600/[0.08] rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-purple-600/[0.08] rounded-full blur-3xl pointer-events-none" />

      {/* Clean Static Card */}
      <div className="w-full max-w-lg bg-[#111726] border border-white/[0.08] rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-indigo-500/25 ring-1 ring-white/20 mb-3">
            E
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">
            Create Account
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Join EduStack Pro • KIIT University Smart Campus
          </p>
        </div>

        {/* Role Selector */}
        <div className="mb-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Register As
          </div>
          <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-white/[0.08]">
            {REGISTER_ROLES.map((role) => {
              const Icon = role.icon;
              const isSelected = formData.role === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setFormData({ ...formData, role: role.id })}
                  className={`py-2 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">{role.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="h-4 w-4" />
              </div>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-white/[0.1] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="e.g. John Doe"
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="h-4 w-4" />
              </div>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-white/[0.1] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="you@kiit.ac.in"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-10 pr-11 py-2.5 bg-slate-900/60 border border-white/[0.1] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Select College */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Select College
              </label>
              <button
                type="button"
                onClick={() => setShowCollegeModal(true)}
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:underline"
              >
                Register institution
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Building2 className="h-4 w-4" />
              </div>
              <select
                required
                value={formData.collegeId}
                onChange={(e) => setFormData({ ...formData, collegeId: e.target.value, classId: '' })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-white/[0.1] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              >
                <option value="" className="bg-[#111726]">Choose College...</option>
                {colleges.map((col) => (
                  <option key={col.id} value={col.id} className="bg-[#111726]">
                    {col.name?.replace(/\s*test\b/gi, '').trim()}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Course / Department */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Course / Department
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <BookOpen className="h-4 w-4" />
              </div>
              <select
                required
                value={formData.course}
                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-white/[0.1] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
              >
                <option value="" className="bg-[#111726]">Select Course...</option>
                {availableCourses.map((c) => (
                  <option key={c} value={c} className="bg-[#111726]">
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Student Specific: Parent Email */}
          {formData.role === 'student' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Parent's Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Users className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.parentEmail}
                  onChange={(e) => setFormData({ ...formData, parentEmail: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-white/[0.1] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  placeholder="parent@example.com"
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1">Used for low attendance alerts and exam eligibility updates.</p>
            </div>
          )}

          {/* Staff / Admin Specific: Administrative Access Code */}
          {(formData.role === 'admin' || formData.role === 'teacher' || formData.role === 'mentor') && (
            <div>
              <label className="block text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1.5">
                Staff / Admin Access Code
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-400">
                  <KeyRound className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  required
                  value={formData.accessCode}
                  onChange={(e) => setFormData({ ...formData, accessCode: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-amber-500/30 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
                  placeholder="Enter secret college key"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Provided by your college administration.</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-white/[0.08] text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline"
          >
            Sign in
          </Link>
        </div>

      </div>

      {/* Register College Modal */}
      {showCollegeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div className="bg-[#111726] w-full max-w-md rounded-3xl p-6 shadow-2xl border border-white/[0.1] relative">
            <h3 className="text-lg font-bold text-white mb-1">Register Your College</h3>
            <p className="text-xs text-slate-400 mb-4">
              Add your institution to EduStack Pro so campus members can register.
            </p>

            <form onSubmit={handleCreateCollege} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  College Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. KIIT University"
                  className="w-full px-3.5 py-2.5 bg-slate-900/70 border border-white/[0.1] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  value={newCollegeName}
                  onChange={(e) => setNewCollegeName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Staff Access Code
                </label>
                <input
                  type="password"
                  required
                  placeholder="Create custom verification key"
                  className="w-full px-3.5 py-2.5 bg-slate-900/70 border border-white/[0.1] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  value={newCollegeKey}
                  onChange={(e) => setNewCollegeKey(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Master License Key
                </label>
                <input
                  type="password"
                  required
                  placeholder="Enter platform license key"
                  className="w-full px-3.5 py-2.5 bg-slate-900/70 border border-white/[0.1] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                  value={licenseKey}
                  onChange={(e) => setLicenseKey(e.target.value)}
                />
              </div>

              <div className="flex gap-2.5 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setNewCollegeName('');
                    setNewCollegeKey('');
                    setLicenseKey('');
                    setShowCollegeModal(false);
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-300 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-indigo-600/30"
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
