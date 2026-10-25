import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight,
  GraduationCap,
  Briefcase,
  KeyRound
} from 'lucide-react';

const ROLES = [
  {
    id: 'student',
    label: 'Student',
    email: 'cheeku@gmail.com',
    password: 'password123',
    icon: GraduationCap
  },
  {
    id: 'teacher',
    label: 'Faculty',
    email: 'krishnasingh@gmail.com',
    password: 'password123',
    icon: Briefcase
  },
  {
    id: 'admin',
    label: 'Admin',
    email: 'admin@test.com',
    password: 'password123',
    icon: KeyRound
  }
];

const Login = () => {
  const [selectedRole, setSelectedRole] = useState(ROLES[0]);
  const [email, setEmail] = useState(ROLES[0].email);
  const [password, setPassword] = useState(ROLES[0].password);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSelectRole = (role) => {
    setSelectedRole(role);
    setEmail(role.email);
    setPassword(role.password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userData = await login(email, password, selectedRole.id);
      if (userData && userData.role !== selectedRole.id) {
        logout();
        const roleLabels = { student: 'Student', teacher: 'Faculty', admin: 'Admin', mentor: 'Mentor' };
        const actual = roleLabels[userData.role] || userData.role;
        toast.error(`Access Denied: This account is registered as ${actual}. Please select the ${actual} tab.`);
        return;
      }
      toast.success('Signed in successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      
      {/* Subtle Static Ambient Background Glows */}
      <div className="fixed -top-40 -left-40 w-96 h-96 bg-indigo-600/[0.08] rounded-full blur-3xl pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-96 h-96 bg-purple-600/[0.08] rounded-full blur-3xl pointer-events-none" />

      {/* Clean Static Card */}
      <div className="w-full max-w-md bg-[#111726] border border-white/[0.08] rounded-3xl p-8 shadow-2xl relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-[#FF5722] via-[#FF7A00] to-[#FFA000] flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-orange-500/30 ring-1 ring-white/20 mb-3">
            E
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center gap-2 font-brand">
            <span>Sign in to Edu<span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF5722] via-[#FF7A00] to-[#FFA000]">Stack</span></span>
            <span className="px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-md bg-gradient-to-r from-[#FF5722] to-[#FFA000] text-white shadow-sm shadow-orange-500/30">PRO</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            KIIT University Smart Campus Portal
          </p>
        </div>

        {/* Role Switcher */}
        <div className="mb-6">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Sign In As
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900/90 rounded-2xl border border-white/[0.08]">
            {ROLES.map((role) => {
              const Icon = role.icon;
              const isSelected = selectedRole.id === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => handleSelectRole(role)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{role.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-white/[0.1] rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all"
                placeholder="you@kiit.ac.in"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <Link 
                to="/forgot-password" 
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="h-4 w-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-bold text-sm rounded-xl transition shadow-lg shadow-indigo-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <span>{loading ? 'Signing in...' : `Sign In as ${selectedRole.label}`}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-6 pt-5 border-t border-white/[0.08] text-center text-xs text-slate-400">
          Need a college account?{' '}
          <Link 
            to="/register" 
            className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline"
          >
            Register Institution
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Login;
