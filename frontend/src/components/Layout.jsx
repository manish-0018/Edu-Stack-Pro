import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../context/ThemeContext';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { darkMode } = useTheme();

  return (
    <div className={`flex h-screen overflow-hidden bg-slate-50 dark:bg-dark-bg text-slate-900 dark:text-dark-text relative selection:bg-indigo-500 selection:text-white`}>
      {/* Ambient background glow accents for modern glassmorphism depth */}
      <div className="fixed top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/[0.04] dark:bg-indigo-600/[0.07] rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="fixed bottom-10 left-1/3 w-[450px] h-[450px] bg-purple-500/[0.03] dark:bg-purple-600/[0.06] rounded-full blur-3xl pointer-events-none -z-0" />
      <div className="fixed top-1/2 right-10 w-[350px] h-[350px] bg-cyan-500/[0.03] dark:bg-cyan-500/[0.04] rounded-full blur-3xl pointer-events-none -z-0" />

      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <div className="relative z-10 flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        <main className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      
      <ToastContainer position="bottom-right" theme={darkMode ? 'dark' : 'light'} />
    </div>
  );
};

export default Layout;
