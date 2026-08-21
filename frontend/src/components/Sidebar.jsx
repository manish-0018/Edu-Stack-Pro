import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  BookOpen, 
  CheckSquare, 
  CalendarDays,
  FileText,
  BarChart3,
  Award,
  Briefcase,
  CalendarClock,
  X,
  Compass,
  Store,
  Users2,
  HeartHandshake,
  MessageSquare,
  PenTool,
  Library as LibraryIcon,
  ClipboardList,
  Brain,
  UserSquare2,
  Megaphone,
  Download,
  Sparkles
} from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user } = useAuth();
  const role = user?.role || 'student';
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBtn, setShowInstallBtn] = useState(() => {
    return !window.matchMedia('(display-mode: standalone)').matches;
  });

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBtn(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowInstallBtn(false);
      }
    } else {
      toast.info(
        "To install: Click the browser menu or share icon and select 'Add to Home Screen' or 'Install App'.",
        { autoClose: 7000 }
      );
    }
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard />, path: '/dashboard', roles: ['admin', 'teacher', 'student', 'mentor'] },
    { name: 'Users', icon: <Users />, path: '/users', roles: ['admin', 'teacher'] },
    { name: 'Classes', icon: <GraduationCap />, path: '/classes', roles: ['admin', 'teacher'] },
    { name: 'Subjects', icon: <BookOpen />, path: '/subjects', roles: ['admin', 'teacher'] },
    { name: 'Mark Attendance', icon: <CheckSquare />, path: '/attendance/mark', roles: ['teacher'] },
    { name: 'View Attendance', icon: <CalendarDays />, path: '/attendance/view', roles: ['admin', 'teacher', 'student', 'mentor'] },
    { name: 'Leave Requests', icon: <FileText />, path: '/leave', roles: ['admin', 'teacher', 'student', 'mentor'] },
    { name: 'Manage Marks', icon: <BarChart3 />, path: '/marks', roles: ['teacher'] },
    { name: 'Assignments', icon: <ClipboardList />, path: '/assignments', roles: ['admin', 'teacher', 'student'] },
    { name: 'Quizzes', icon: <Brain />, path: '/quizzes', roles: ['admin', 'teacher', 'student'] },
    { name: 'Announcements', icon: <Megaphone />, path: '/announcements', roles: ['admin', 'teacher', 'student'] },
    { name: 'Subject Forums', icon: <MessageSquare />, path: '/forums', roles: ['admin', 'student', 'teacher'] },
    { name: 'My Portfolio', icon: <UserSquare2 />, path: '/portfolio', roles: ['student'] },
    { name: 'Placements', icon: <Briefcase />, path: '/placements', roles: ['admin', 'teacher', 'student'] },
    { name: 'Mentorship', icon: <Users2 />, path: '/mentorship', roles: ['admin', 'student'] },
    { name: 'Study Buddies', icon: <HeartHandshake />, path: '/buddies', roles: ['student'] },
    { name: 'Resource Hub', icon: <PenTool />, path: '/resources', roles: ['admin', 'student', 'teacher'] },
    { name: 'Opportunities', icon: <Compass />, path: '/opportunities', roles: ['admin', 'student'] },
    { name: 'Campus Marketplace', icon: <Store />, path: '/store', roles: ['admin', 'student', 'teacher'] },
    { name: 'Smart Library', icon: <LibraryIcon />, path: '/library', roles: ['admin', 'student', 'teacher', 'guardian'] },
    { name: 'Upgrade to Plus', icon: <Sparkles className="text-amber-500 animate-pulse" />, path: '/upgrade', roles: ['student', 'teacher', 'admin'] }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/50 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-dark-card border-r border-gray-200 dark:border-dark-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col border-b border-gray-200 dark:border-dark-border">
          <div className="flex items-center justify-between px-6 py-5">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-500/30">
                E
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-primary-600 dark:from-primary-400 dark:to-primary-400 leading-none">
                  EduStack Pro
                </span>
                {user?.College?.name && (
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-black mt-1 truncate max-w-[140px]" title={user.College.name}>
                    {user.College.name}
                  </span>
                )}
              </div>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500">
              <X className="w-6 h-6" />
            </button>
          </div>
          
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-140px)]">
          {showInstallBtn && (
            <button
              onClick={handleInstallClick}
              className="w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold transition-all duration-200 shadow-md shadow-indigo-500/20 group scale-100 hover:scale-[1.02]"
            >
              <Download className="w-5 h-5 animate-bounce group-hover:animate-none" />
              <span>Install Web App</span>
            </button>
          )}
          {menuItems.filter(item => item.roles.includes(role)).map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive
                    ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-medium'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-bg hover:text-gray-900 dark:hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-primary-600 dark:text-primary-400' : ''}`}>
                    {item.icon}
                  </span>
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="absolute left-0 w-1 h-8 bg-primary-500 rounded-r-full" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
