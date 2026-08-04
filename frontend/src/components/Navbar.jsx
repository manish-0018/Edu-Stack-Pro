import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, Sun, Moon, User as UserIcon, LogOut, Bell, Check, Palette, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { generateResume } from '../utils/generateResume';

const Navbar = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode, theme, changeTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  useEffect(() => {
    const fetchNotifs = async () => {
      try {
        const res = await axios.get('/api/notifications');
        setNotifications(res.data);
      } catch (err) {}
    };
    if (user) {
      fetchNotifs();
      const interval = setInterval(fetchNotifs, 30000); // poll every 30s
      return () => clearInterval(interval);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {}
  };

  const handleMarkAllAsRead = async () => {
    try {
      await axios.put('/api/notifications/readAll');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    } catch (err) {}
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between w-full px-4 py-4 bg-white dark:bg-dark-card shadow-sm border-b border-gray-200 dark:border-dark-border transition-colors duration-200">
      <div className="flex items-center gap-4">
        <button
          className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 lg:hidden"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-primary-600">
          Edu Stack Pro
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            )}
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 w-80 py-2 mt-2 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-xl shadow-xl z-50">
              <div className="flex items-center justify-between px-4 pb-2 border-b border-gray-100 dark:border-dark-border">
                <h3 className="font-bold text-gray-900 dark:text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllAsRead} className="text-xs text-primary-600 hover:underline">Mark all read</button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-gray-500">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={`p-4 border-b border-gray-50 dark:border-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${!n.isRead ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}>
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <p className={`text-sm font-semibold ${
                            n.type === 'success' ? 'text-green-600' :
                            n.type === 'alert' ? 'text-red-600' : 'text-gray-900 dark:text-white'
                          }`}>{n.title}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{n.message}</p>
                          <p className="text-[10px] text-gray-400 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                        </div>
                        {!n.isRead && (
                          <button onClick={() => handleMarkAsRead(n.id)} className="text-primary-600 p-1 hover:bg-primary-100 rounded-full">
                            <Check className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Theme Selector */}
        <div className="relative">
          <button
            onClick={() => setThemeOpen(!themeOpen)}
            className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Palette className="w-5 h-5" />
          </button>
          
          {themeOpen && (
            <div className="absolute right-0 w-32 py-2 mt-2 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-xl shadow-xl z-50">
              <div className="px-3 pb-2 mb-2 border-b border-gray-100 dark:border-dark-border text-xs font-bold text-gray-500">Theme</div>
              {['indigo', 'rose', 'emerald', 'amber'].map(t => (
                <button
                  key={t}
                  onClick={() => { changeTheme(t); setThemeOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm capitalize hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2 ${theme === t ? 'font-bold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}
                >
                  <div className={`w-3 h-3 rounded-full ${
                    t === 'indigo' ? 'bg-indigo-500' :
                    t === 'rose' ? 'bg-rose-500' :
                    t === 'emerald' ? 'bg-emerald-500' : 'bg-amber-500'
                  }`} />
                  {t}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={toggleDarkMode}
          className="p-2 text-gray-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </button>

        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white shadow-md">
              <UserIcon className="w-4 h-4" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
                {user?.isPremium && <span className="text-amber-500" title="Premium Semester Pass Active">👑</span>}
                <span className={user?.isPremium ? 'text-amber-500 dark:text-amber-400 font-extrabold' : ''}>{user?.name}</span>
              </p>
              <p className="text-[10px] font-bold text-primary-500 uppercase">
                {user?.isPremium ? 'Premium ' : ''}{user?.role} {user?.course && `• ${user.course}`}
              </p>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 w-48 py-2 mt-2 bg-white dark:bg-dark-card border border-gray-100 dark:border-dark-border rounded-lg shadow-xl">
              {user?.role === 'student' && (
                <button
                  onClick={() => { generateResume(); setDropdownOpen(false); }}
                  className="flex items-center w-full gap-2 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <FileText className="w-4 h-4 text-indigo-500" />
                  Download Resume
                </button>
              )}
              <button
                onClick={logout}
                className="flex items-center w-full gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
