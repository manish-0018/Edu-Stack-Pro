import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../context/ThemeContext';
import AITutorPanel from './AITutorPanel';
import { Bot } from 'lucide-react';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const { darkMode } = useTheme();

  return (
    <div className={`flex h-screen overflow-hidden bg-gray-50 dark:bg-dark-bg text-gray-900 dark:text-dark-text`}>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      
      <ToastContainer position="bottom-right" theme={darkMode ? 'dark' : 'light'} />

      {/* Floating Global AI Campus Assistant */}
      {!aiOpen && (
        <button
          onClick={() => setAiOpen(true)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-primary-600 to-indigo-600 hover:from-primary-700 hover:to-indigo-700 text-white rounded-full shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center border border-white/10"
          title="Open AI Campus Assistant"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}
      <AITutorPanel isOpen={aiOpen} onClose={() => setAiOpen(false)} context="Global Campus Context" />
    </div>
  );
};

export default Layout;
