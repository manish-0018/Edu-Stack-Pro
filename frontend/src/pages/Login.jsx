import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { 
  Mail, 
  Lock, 
  LogIn, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  Cpu, 
  Wifi, 
  QrCode, 
  ArrowRight,
  GraduationCap,
  Briefcase,
  KeyRound,
  UserCheck
} from 'lucide-react';

const DEMO_ACCOUNTS = [
  {
    role: 'student',
    title: 'Student Pass',
    name: 'VIRAT KOHLI',
    id: 'ROLL: 2603003',
    dept: 'Computer Science & Eng',
    email: 'cheeku@gmail.com',
    password: 'password123',
    icon: GraduationCap,
    gradient: 'from-indigo-500 via-purple-500 to-pink-500',
    chipBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
  },
  {
    role: 'teacher',
    title: 'Faculty Pass',
    name: 'DR. KRISHNA SINGH',
    id: 'ID: FAC-8841',
    dept: 'School of Technology',
    email: 'krishnasingh@gmail.com',
    password: 'password123',
    icon: Briefcase,
    gradient: 'from-emerald-500 via-teal-500 to-cyan-500',
    chipBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
  },
  {
    role: 'admin',
    title: 'Admin Key',
    name: 'DEV NARAYAN (ADMIN)',
    id: 'ID: ROOT-001',
    dept: 'Campus Directorate',
    email: 'admin@test.com',
    password: 'password123',
    icon: KeyRound,
    gradient: 'from-amber-500 via-orange-500 to-red-500',
    chipBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40'
  },
  {
    role: 'mentor',
    title: 'Mentor Pass',
    name: 'ARYA KUMARI',
    id: 'ID: MTR-104',
    dept: 'Student Welfare & Guidance',
    email: 'arya1@gmail.com',
    password: 'password123',
    icon: UserCheck,
    gradient: 'from-pink-500 via-rose-500 to-purple-500',
    chipBg: 'bg-pink-500/20 text-pink-300 border-pink-500/40'
  }
];

const Login = () => {
  const [email, setEmail] = useState('cheeku@gmail.com');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState(DEMO_ACCOUNTS[0]);
  
  // 3D Tilt State
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const cardRef = useRef(null);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    if (!cardRef.current || window.innerWidth < 768) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;
    setRotate({ x: rotateX, y: rotateY });

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;
    setGlare({ x: glareX, y: glareY, opacity: 0.35 });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setGlare(prev => ({ ...prev, opacity: 0 }));
  };

  const handleSelectDemo = (demo) => {
    setEmail(demo.email);
    setPassword(demo.password);
    setSelectedDemo(demo);
    toast.info(`Switched to ${demo.title} (${demo.name})`, { autoClose: 2000 });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('NFC Identity Verified! Entering Campus Portal...');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-white flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 relative overflow-hidden select-none">
      
      {/* Ambient Cosmic Glow Backdrops */}
      <div className="fixed -top-40 -left-40 w-[600px] h-[600px] bg-indigo-600/[0.12] rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed -bottom-40 -right-40 w-[600px] h-[600px] bg-purple-600/[0.12] rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-cyan-600/[0.04] rounded-full blur-[160px] pointer-events-none" />

      {/* Header Branding */}
      <div className="text-center mb-6 relative z-10 max-w-lg">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
          <span>EduStack Pro • Next-Gen Smart Campus</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-slate-200 to-indigo-300">
          Digital Campus ID Pass
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          Tilt with cursor to inspect security foil. Select a pass or enter credentials.
        </p>

        {/* 1-Click Demo Pass Switcher Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
          {DEMO_ACCOUNTS.map((demo) => {
            const Icon = demo.icon;
            const isSelected = selectedDemo.role === demo.role;
            return (
              <button
                key={demo.role}
                type="button"
                onClick={() => handleSelectDemo(demo)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 border ${
                  isSelected
                    ? `${demo.chipBg} shadow-lg shadow-indigo-500/20 scale-105 ring-1 ring-white/30`
                    : 'bg-slate-900/80 text-slate-400 border-white/[0.08] hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{demo.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3D Holographic Card Container */}
      <div 
        className="w-full max-w-lg relative z-10 [perspective:1200px]"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={cardRef}
          style={{
            transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
            transition: rotate.x === 0 && rotate.y === 0 ? 'transform 0.5s ease-out' : 'transform 0.08s ease-out'
          }}
          className="relative rounded-[32px] p-6 sm:p-8 bg-gradient-to-br from-slate-900/90 via-[#111726]/90 to-slate-950/95 border border-white/[0.12] shadow-2xl backdrop-blur-2xl overflow-hidden group [transform-style:preserve-3d]"
        >
          
          {/* Iridescent Holographic Foil Sheen Layer */}
          <div 
            className="pointer-events-none absolute inset-0 rounded-[32px] transition-opacity duration-300"
            style={{
              background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.22) 0%, rgba(99,102,241,0.18) 25%, rgba(236,72,153,0.12) 50%, transparent 80%)`,
              opacity: glare.opacity
            }}
          />

          {/* Lanyard Clip Slot */}
          <div className="w-16 h-2.5 bg-slate-800/80 rounded-full mx-auto mb-6 border border-white/20 shadow-inner flex items-center justify-center">
            <div className="w-8 h-1 bg-slate-950 rounded-full" />
          </div>

          {/* Pass Header: Institution & Contactless NFC */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.08] relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 flex items-center justify-center text-white font-extrabold text-xl shadow-lg shadow-indigo-500/30 ring-1 ring-white/25">
                🏛️
              </div>
              <div>
                <h2 className="text-sm font-black tracking-wider uppercase text-white leading-tight">
                  KIIT UNIVERSITY
                </h2>
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1 mt-0.5">
                  <span>Smart Campus ID</span>
                  <span>•</span>
                  <span className="text-emerald-400">Online</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Wifi className="w-5 h-5 text-indigo-400/80 rotate-90" />
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                <Cpu className="w-4 h-4 text-amber-400" />
              </div>
            </div>
          </div>

          {/* Pass Identity Badge Section */}
          <div className="my-5 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.08] flex items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${selectedDemo.gradient} flex items-center justify-center text-white font-black text-lg shadow-md ring-2 ring-white/20`}>
                {selectedDemo.name.charAt(0)}
              </div>
              <div>
                <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">
                  {selectedDemo.id}
                </div>
                <div className="text-sm sm:text-base font-extrabold text-white tracking-tight">
                  {selectedDemo.name}
                </div>
                <div className="text-[11px] text-indigo-300 font-medium">
                  {selectedDemo.dept}
                </div>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-end">
              <div className="p-1.5 rounded-xl bg-white/10 border border-white/15">
                <QrCode className="w-7 h-7 text-white/90" />
              </div>
              <span className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-widest">NFC VERIFIED</span>
            </div>
          </div>

          {/* Login Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Campus Email / Access Key
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-900/60 border border-white/[0.1] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all backdrop-blur-md"
                  placeholder="student@kiit.ac.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Security Passcode
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition"
                >
                  Forgot passcode?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="w-full pl-10 pr-11 py-2.5 bg-slate-900/60 border border-white/[0.1] rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all backdrop-blur-md"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            {/* Submit Button (Biometric / NFC Smart Touch) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full relative group overflow-hidden rounded-2xl p-[1px] font-bold text-xs sm:text-sm shadow-xl shadow-indigo-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse group-hover:opacity-100 transition-opacity" />
                <div className="relative px-6 py-3 rounded-2xl bg-slate-950/80 hover:bg-slate-950/60 backdrop-blur-xl text-white flex items-center justify-center gap-2 transition">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                  <span>{loading ? 'Verifying NFC Credentials...' : 'Authenticate & Enter Campus'}</span>
                  <ArrowRight className="w-4 h-4 text-indigo-400 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </div>
          </form>

          {/* Footer Card Info */}
          <div className="mt-5 pt-4 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400">
            <span>Powered by EduStack Pro</span>
            <Link 
              to="/register" 
              className="font-bold text-indigo-400 hover:text-indigo-300 hover:underline"
            >
              Register Institution →
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;
