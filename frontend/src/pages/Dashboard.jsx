import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Users, GraduationCap, BookOpen, Percent, AlertTriangle, AlertCircle, FileText, CheckSquare, Mail, Award, CheckCircle, XCircle, Brain, Download, X } from 'lucide-react';
import KanbanBoard from '../components/KanbanBoard';
import AdvancedAnalytics from '../components/AdvancedAnalytics';
import PredictiveAnalytics from '../components/PredictiveAnalytics';
import AiIntelligenceWatchlist from '../components/AiIntelligenceWatchlist';
import SmartCheckinModal from '../components/SmartCheckinModal';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { toast } from 'react-toastify';
import AdBanner from '../components/AdBanner';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StatCard = ({ title, value, subtitle, icon, color, to }) => {
  const content = (
    <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex items-center gap-4 hover:shadow-md transition-all duration-200 cursor-pointer h-full border-b-2 hover:border-b-primary-500">
      <div className={`p-4 rounded-xl ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{value}</h3>
        {subtitle && <p className="text-[10px] text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );

  return to ? <Link to={to} className="block">{content}</Link> : content;
};

const Dashboard = () => {
  const { user, updateCurrentUser } = useAuth();
  const [showCheckinModal, setShowCheckinModal] = useState(false);
  const [defaulterToEmail, setDefaulterToEmail] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [expectedMarks, setExpectedMarks] = useState({});
  const [predictedResult, setPredictedResult] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [studentStatsLoading, setStudentStatsLoading] = useState(false);

  // Admin campus location states
  const [campusLatInput, setCampusLatInput] = useState('');
  const [campusLonInput, setCampusLonInput] = useState('');
  const [locationSaving, setLocationSaving] = useState(false);

  // Admin exam parameters states
  const [examSettings, setExamSettings] = useState({
    midSemStartDate: '',
    midSemEndDate: '',
    isMidSemAdmitCardEnabled: false,
    endSemStartDate: '',
    endSemEndDate: '',
    isEndSemAdmitCardEnabled: false
  });
  const [settingsSaving, setSettingsSaving] = useState(false);

  const fetchExamSettings = async () => {
    try {
      const res = await axios.get('/api/auth/college-settings');
      setExamSettings(res.data);
    } catch (err) {
      console.error('Failed to fetch college exam settings', err);
    }
  };

  const handleSaveExamSettings = async () => {
    setSettingsSaving(true);
    try {
      await axios.put('/api/auth/college-settings', examSettings);
      toast.success('Exam schedules and admit card releases updated!');
      updateCurrentUser({
        College: {
          ...user.College,
          ...examSettings
        }
      });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update exam parameters.');
    } finally {
      setSettingsSaving(false);
    }
  };

  useEffect(() => {
    if (user?.College) {
      setCampusLatInput(user.College.latitude || '20.3533');
      setCampusLonInput(user.College.longitude || '85.8266');
    }
    if (user && user.role === 'admin') {
      fetchExamSettings();
    }
  }, [user]);

  const handleGetAdminLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser.');
      return;
    }
    const toastId = toast.loading('Querying your current GPS coordinates...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCampusLatInput(position.coords.latitude.toFixed(6));
        setCampusLonInput(position.coords.longitude.toFixed(6));
        toast.update(toastId, { render: 'GPS coordinates loaded!', type: 'success', isLoading: false, autoClose: 2000 });
      },
      (err) => {
        console.error(err);
        toast.update(toastId, { render: 'Failed to access GPS. Please verify permissions.', type: 'error', isLoading: false, autoClose: 3000 });
      },
      { enableHighAccuracy: true }
    );
  };

  const handleSaveCampusLocation = async () => {
    if (!campusLatInput || !campusLonInput) {
      toast.error('Please input valid coordinates.');
      return;
    }
    setLocationSaving(true);
    try {
      const res = await axios.put(`/api/auth/colleges/${user.collegeId}`, {
        latitude: parseFloat(campusLatInput),
        longitude: parseFloat(campusLonInput)
      });
      updateCurrentUser({
        College: {
          ...user.College,
          latitude: parseFloat(campusLatInput),
          longitude: parseFloat(campusLonInput)
        }
      });
      toast.success('Campus coordinates updated successfully! All lockers updated.');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to update campus coordinates.');
    } finally {
      setLocationSaving(false);
    }
  };

  const [showPwaPromo, setShowPwaPromo] = useState(() => {
    if (window.matchMedia('(display-mode: standalone)').matches) return false;
    return !localStorage.getItem('dismissed-pwa-promo');
  });
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  const handleInstallApp = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
        setShowPwaPromo(false);
      }
    } else {
      toast.info(
        "To install: Click the browser menu or share icon and select 'Add to Home Screen' or 'Install App'.",
        { autoClose: 7000 }
      );
    }
  };

  const handleDismissPromo = () => {
    localStorage.setItem('dismissed-pwa-promo', 'true');
    setShowPwaPromo(false);
  };

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

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/dashboard');
      setStats(res.data);
    } catch (error) {
      console.error("Failed to load dashboard stats", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePredictSGPA = async () => {
    setPredicting(true);
    try {
      // Send estimates for ALL subjects (theory + lab); backend handles each type correctly
      const estimates = (stats.marks || []).map(m => {
        const isLab = m.Subject?.type === 'lab';
        const est = expectedMarks[m.subjectId] || {};
        return {
          subjectId: m.subjectId,
          midSem: isLab ? null : (est.midSem !== undefined && est.midSem !== '' ? est.midSem : (m.midSem !== null ? m.midSem : 0)),
          quiz: est.quiz !== undefined && est.quiz !== '' ? est.quiz : (m.quiz !== null ? m.quiz : 8),
          assignment: est.assignment !== undefined && est.assignment !== '' ? est.assignment : (m.assignment !== null ? m.assignment : (isLab ? 32 : 8)),
          expectedEndSem: est.expectedEndSem !== undefined && est.expectedEndSem !== '' ? est.expectedEndSem : 0
        };
      });

      const res = await axios.post('/api/grades/predict', { estimates });
      setPredictedResult(res.data);
      toast.success('SGPA prediction calculated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to calculate SGPA prediction');
    } finally {
      setPredicting(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  useEffect(() => {
    if (stats.marks) {
      const initial = {};
      stats.marks.forEach(m => {
        initial[m.subjectId] = {
          midSem: m.midSem !== null ? m.midSem : '',
          quiz: m.quiz !== null ? m.quiz : 8,
          assignment: m.assignment !== null ? m.assignment : 8,
          expectedEndSem: ''
        };
      });
      setExpectedMarks(initial);
    }
  }, [stats.marks]);

  const getBunkCalculations = (attended, total, type) => {
    if (total === 0) return { status: 'safe', message: 'No classes held yet.' };
    const percentage = Math.round((attended / total) * 100);
    const reqPct = type === 'lab' ? 60 : 75;
    const reqDec = type === 'lab' ? 0.60 : 0.75;
    
    if (percentage >= reqPct) {
      const bunksPossible = Math.floor((attended / reqDec) - total);
      return {
        status: 'safe',
        message: bunksPossible > 0 
          ? `Safe! You can bunk the next ${bunksPossible} classes.` 
          : 'On edge! You cannot bunk any classes.'
      };
    } else {
      // (reqDec * (total + X)) = (attended + X)
      // reqDec*total + reqDec*X = attended + X
      // reqDec*total - attended = X - reqDec*X = X(1 - reqDec)
      // X = (reqDec*total - attended) / (1 - reqDec)
      const classesNeeded = Math.ceil((reqDec * total - attended) / (1 - reqDec));
      return {
        status: 'critical',
        message: `Critical! Attend the next ${classesNeeded} classes consecutively.`
      };
    }
  };

  // Exam Hall Ticket PDF generator
  const generateAdmitCard = (examType = 'theory') => {
    const doc = new jsPDF();
    
    // Header Style
    doc.setFillColor(31, 41, 55); // Dark banner
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("KALINGA INSTITUTE OF INDUSTRIAL TECHNOLOGY", 15, 18);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Deemed to be University, Bhubaneswar, Odisha, India", 15, 25);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    const titleText = examType === 'theory' 
      ? "HALL TICKET - END SEMESTER THEORY EXAMINATIONS 2024-25"
      : "HALL TICKET - END SEMESTER PRACTICAL EXAMINATIONS 2024-25";
    doc.text(titleText, 15, 34);

    // Student Info
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("STUDENT DETAILS", 15, 52);
    doc.line(15, 54, 195, 54);

    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${user.name}`, 15, 62);
    doc.text(`Roll Number: ${user.id ? user.id.slice(0, 8).toUpperCase() : 'N/A'}`, 15, 68);
    doc.text(`Program: ${user.course || 'BCA (Bachelor of Computer Applications)'}`, 15, 74);
    doc.text(`Academic Session: 2024-2025`, 15, 80);

    // Exam Subjects Table
    doc.setFont("helvetica", "bold");
    doc.text(examType === 'theory' ? "REGISTERED THEORY PAPERS" : "REGISTERED PRACTICAL/LAB PAPERS", 15, 95);
    doc.line(15, 97, 195, 97);

    const headers = [["Paper Code", "Paper Name", "Exam Type", "Invigilator Sign"]];
    const data = (stats.marks || [])
      .filter(m => m.Subject)
      .filter(m => examType === 'theory' ? m.Subject.type === 'theory' : m.Subject.type === 'lab')
      .map(m => [
        m.Subject.code || 'N/A',
        m.Subject.name,
        m.Subject.type === 'lab' ? 'Practical' : 'Theory',
        ''
      ]);

    doc.autoTable({
      head: headers,
      body: data,
      startY: 102,
      theme: 'grid',
      headStyles: { fillColor: [31, 41, 55] },
      styles: { cellPadding: 3, fontSize: 10 }
    });

    // Important Instructions
    const finalY = doc.lastAutoTable.finalY + 15;
    doc.setFont("helvetica", "bold");
    doc.text("IMPORTANT INSTRUCTIONS FOR CANDIDATES:", 15, finalY);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    
    const instructions = [
      "1. Candidates must carry this Hall Ticket and their University Identity Card to the examination hall.",
      "2. Electronic gadgets, smart watches, and mobile phones are strictly prohibited in the exam hall.",
      "3. Candidates must reach the examination venue at least 30 minutes before the scheduled start time.",
      "4. No candidate will be allowed to enter the exam hall 15 minutes after the examination has commenced."
    ];
    
    let yOffset = finalY + 6;
    instructions.forEach(ins => {
      doc.text(ins, 15, yOffset);
      yOffset += 6;
    });

    // Controller Signatures
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Dr. Veena Goswami", 15, yOffset + 20);
    doc.setFont("helvetica", "normal");
    doc.text("Head of Department", 15, yOffset + 25);

    doc.setFont("helvetica", "bold");
    doc.text("Controller of Examinations", 130, yOffset + 20);
    doc.setFont("helvetica", "normal");
    doc.text("KIIT Deemed to be University", 130, yOffset + 25);

    doc.save(`KIIT_${examType === 'theory' ? 'Theory' : 'Practical'}_HallTicket_${user.name.replace(/\s+/g, '_')}.pdf`);
  };

  const generateWarningLetter = (defaulter) => {
    const doc = new jsPDF();
    
    // Header Style
    doc.setFillColor(239, 68, 68); // Red banner
    doc.rect(0, 0, 210, 35, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("EDUSTACK ACADEMY", 15, 22);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Official Attendance Warning Notice", 15, 28);

    // Metadata
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(11);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 48);
    doc.text(`Reference No: KIIT/AMS/WARN/${new Date().getFullYear()}/${defaulter.id.slice(0,6).toUpperCase()}`, 15, 48);

    // Recipient Info
    doc.setFont("helvetica", "bold");
    doc.text("To the Parent/Guardian of:", 15, 62);
    doc.setFont("helvetica", "normal");
    doc.text(`${defaulter.name}`, 15, 68);
    doc.text(`Class: ${defaulter.className}`, 15, 74);
    doc.text(`Email: ${defaulter.email}`, 15, 80);

    // Subject
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(220, 38, 38);
    doc.text("SUBJECT: NOTICE OF ATTENDANCE DEFICITATION (BELOW 75%)", 15, 95);

    // Body
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(50, 50, 50);
    
    const bodyText = [
      `This letter is to formally notify you that your child, ${defaulter.name}, is currently falling short of the required academic attendance threshold of 75% set by the KIIT college board.`,
      "",
      `Our records show that ${defaulter.name} has attended ${defaulter.attendedClasses} out of ${defaulter.totalClasses} scheduled lecture days, bringing their current attendance average to a critical ${defaulter.attendancePercentage}%.`,
      "",
      "Per the academic regulations framework, students failing to satisfy the minimum 75% criteria will be barred from appearing in the upcoming final semester examinations.",
      "",
      "We request your immediate intervention to discuss this matter and ensure regular class attendance going forward. A minimum of 75% attendance must be maintained before the final roster is locked."
    ];

    let splitText = [];
    bodyText.forEach(line => {
      splitText = [...splitText, ...doc.splitTextToSize(line, 180)];
    });
    doc.text(splitText, 15, 108);

    // Footer Signatures
    doc.setFont("helvetica", "bold");
    doc.text("Dr. Veena Goswami", 15, 230);
    doc.setFont("helvetica", "normal");
    doc.text("Head of Department (BCA)", 15, 236);

    doc.setFont("helvetica", "bold");
    doc.text(stats?.classMentor?.name || "Hemant Kumar", 130, 230);
    doc.setFont("helvetica", "normal");
    doc.text("Class Mentor", 130, 236);

    // Bottom warning stripe
    doc.setFillColor(239, 68, 68);
    doc.rect(0, 287, 210, 10, 'F');

    doc.save(`Defaulter_Warning_${defaulter.name.replace(/\s+/g, '_')}.pdf`);
  };

  const handleSendWarningEmail = (defaulter) => {
    setDefaulterToEmail(defaulter);
  };

  const executeSendWarningEmail = async () => {
    if (!defaulterToEmail) return;
    const defaulter = defaulterToEmail;
    setDefaulterToEmail(null);
    const loadingToast = toast.loading("Sending warning notice email to parent...");
    try {
      const res = await axios.post(`/api/users/${defaulter.id}/send-warning`, {
        attendancePercentage: defaulter.attendancePercentage,
        className: defaulter.className,
        totalClasses: defaulter.totalClasses,
        attendedClasses: defaulter.attendedClasses
      });
      
      toast.update(loadingToast, {
        render: `Notice emailed successfully to ${res.data.recipient}!`,
        type: "success",
        isLoading: false,
        autoClose: 4000
      });

      if (res.data.testUrl) {
        toast.info("Opening test mail preview inbox...", { autoClose: 3000 });
        window.open(res.data.testUrl, '_blank');
      }
    } catch (err) {
      toast.update(loadingToast, {
        render: err.response?.data?.message || "Failed to send warning email",
        type: "error",
        isLoading: false,
        autoClose: 4000
      });
    }
  };

  if (loading) return (
    <div className="flex h-64 items-center justify-center gap-3 text-gray-400">
      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" />
      Loading dashboard...
    </div>
  );

  const isDark = document.documentElement.classList.contains('dark');
  const tickColor = isDark ? '#94a3b8' : '#475569';
  const gridColor = isDark ? '#334155' : '#e2e8f0';

  // ── Real Chart Data derived from actual stats ──────────────────────────────
  // Bar chart: subject-wise attendance across all students from defaulters data
  // We build a class-level distribution by bucketing students by attendance range
  const totalStudents = stats.totalStudents || 0;
  const defaultersCount = (stats.defaulters || []).length;
  const safeCount = totalStudents - defaultersCount;
  const criticalCount = (stats.defaulters || []).filter(d => d.theoryPercentage < 60).length;
  const warningCount = defaultersCount - criticalCount;

  const barData = {
    labels: ['≥ 75% (Safe)', '60–74% (Warning)', '< 60% (Critical)', 'No Data'],
    datasets: [{
      label: 'Students',
      data: [
        safeCount,
        warningCount,
        criticalCount,
        0
      ],
      backgroundColor: [
        'rgba(34, 197, 94, 0.85)',
        'rgba(234, 179, 8, 0.85)',
        'rgba(239, 68, 68, 0.85)',
        'rgba(148, 163, 184, 0.5)',
      ],
      borderRadius: 8,
      borderSkipped: false,
    }]
  };

  // Pie chart: theory vs lab defaulter breakdown
  const theoryDefaulters = (stats.defaulters || []).filter(d => d.theoryPercentage < 75).length;
  const labDefaulters = (stats.defaulters || []).filter(d => d.labPercentage < 60).length;
  const compliant = Math.max(0, totalStudents - Math.max(theoryDefaulters, labDefaulters));

  const pieData = {
    labels: ['Attendance OK', 'Theory Defaulter', 'Lab Defaulter'],
    datasets: [{
      data: [compliant, theoryDefaulters, labDefaulters],
      backgroundColor: [
        'rgba(34, 197, 94, 0.85)',
        'rgba(239, 68, 68, 0.85)',
        'rgba(168, 85, 247, 0.85)',
      ],
      borderWidth: 2,
      borderColor: isDark ? '#1e293b' : '#ffffff',
      hoverOffset: 8,
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { color: tickColor, padding: 16, font: { size: 12 } } },
      tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw} students` } }
    },
    scales: {
      x: { ticks: { color: tickColor }, grid: { display: false } },
      y: { ticks: { color: tickColor, precision: 0 }, grid: { color: gridColor }, beginAtZero: true }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom', labels: { color: tickColor, padding: 16, font: { size: 12 } } },
      tooltip: { callbacks: { label: ctx => ` ${ctx.label}: ${ctx.raw} students` } }
    }
  };

  // Determine Exam Hall Ticket Eligibility (Mid-Sem: 60%, End-Sem: 50% criteria)
  const isMidSemEligible = (stats.attendancePercentage || 0) >= 60;
  const isEndSemEligible = (stats.attendancePercentage || 0) >= 50;

  return (
    <div className="space-y-6">
      {showPwaPromo && (
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-primary-600 text-white rounded-2xl p-6 shadow-md relative overflow-hidden border border-indigo-400/20">
          <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
          <div className="absolute left-1/3 top-0 -translate-y-12 w-32 h-32 bg-indigo-400/20 rounded-full blur-xl animate-pulse" />
          <button 
            onClick={handleDismissPromo}
            className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition-all"
            title="Dismiss"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 pr-6">
            <div className="flex-shrink-0 p-3 bg-white/10 rounded-xl border border-white/20">
              <Download className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div className="flex-1">
              <h3 className="text-md font-bold text-white mb-0.5">Install Web App</h3>
              <p className="text-xs text-indigo-100 max-w-xl leading-relaxed">
                Enjoy offline capabilities, a full-screen desktop/mobile app container, and quick launch icons directly from your screen.
              </p>
            </div>
            <button
              onClick={handleInstallApp}
              className="flex-shrink-0 px-4 py-2 bg-white text-indigo-600 hover:bg-indigo-50 text-xs font-bold rounded-xl shadow transition-all hover:scale-[1.02] active:scale-[0.98] mt-2 md:mt-0"
            >
              Get standalone app
            </button>
          </div>
        </div>
      )}

      {user.role !== 'student' ? (
        <>
          {/* ── Dashboard Header ─────────────────────────────────────── */}
          <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden mb-6">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-1/2 w-40 h-40 bg-white/5 rounded-full translate-y-1/2" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                    {user?.role === 'admin' ? '🔐 Admin' : '🎓 Teacher'}
                  </span>
                  {user?.College?.name && (
                    <span className="px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">
                      🏢 {user?.College?.name}
                    </span>
                  )}
                </div>
                <h1 className="text-2xl font-bold">Welcome back, {user?.role === 'admin' ? 'Admin' : 'Sir'} 👋</h1>
                <p className="text-primary-200 text-sm mt-1">
                  {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <div className="flex flex-col gap-3">
                <div className="flex gap-3 flex-wrap">
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-center min-w-[80px]">
                    <div className="text-2xl font-black">{totalStudents}</div>
                    <div className="text-[10px] text-primary-200 font-semibold uppercase">Students</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-center min-w-[80px]">
                    <div className="text-2xl font-black text-red-300">{defaultersCount}</div>
                    <div className="text-[10px] text-primary-200 font-semibold uppercase">Defaulters</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-center min-w-[80px]">
                    <div className="text-2xl font-black text-green-300">
                      {totalStudents > 0 ? Math.round((safeCount / totalStudents) * 100) : 0}%
                    </div>
                    <div className="text-[10px] text-primary-200 font-semibold uppercase">Compliance</div>
                  </div>
                </div>
                
                {/* Download Reports Actions */}
                <div className="flex gap-2 justify-end">
                  {user?.role === 'admin' && (
                    <button 
                      onClick={async () => {
                      const loadingToast = toast.loading("Scanning and sending auto-warnings...");
                      try {
                        const res = await axios.post('/api/warnings/trigger');
                        toast.update(loadingToast, { render: res.data.message, type: "success", isLoading: false, autoClose: 4000 });
                      } catch(e) { 
                        toast.update(loadingToast, { render: e.response?.data?.message || "Failed to run auto-warnings", type: "error", isLoading: false, autoClose: 4000 }); 
                      }
                    }}
                    className="bg-red-500/80 hover:bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors backdrop-blur-md border border-white/10"
                    >
                      <AlertTriangle className="w-3.5 h-3.5" /> Auto-Warnings
                    </button>
                  )}
                  <button 
                    onClick={async () => {
                      try {
                        const res = await axios.get('/api/reports/defaulters', { responseType: 'blob' });
                        const url = window.URL.createObjectURL(new Blob([res.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'defaulters_report.csv');
                        document.body.appendChild(link);
                        link.click();
                      } catch(e) { toast.error("Download failed"); }
                    }}
                    className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors backdrop-blur-md border border-white/10"
                  >
                    <Download className="w-3.5 h-3.5" /> Defaulters CSV
                  </button>
                  <button 
                    onClick={async () => {
                      try {
                        const res = await axios.get('/api/reports/marks', { responseType: 'blob' });
                        const url = window.URL.createObjectURL(new Blob([res.data]));
                        const link = document.createElement('a');
                        link.href = url;
                        link.setAttribute('download', 'marks_report.csv');
                        document.body.appendChild(link);
                        link.click();
                      } catch(e) { toast.error("Download failed"); }
                    }}
                    className="bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors backdrop-blur-md border border-white/10"
                  >
                    <Download className="w-3.5 h-3.5" /> Marks CSV
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* ── KPI Stat Cards ───────────────────────────────────── */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCard
              title="Total Students"
              value={stats.totalStudents || 0}
              subtitle={`${defaultersCount} defaulters requiring action`}
              icon={<Users className="text-blue-600" />}
              color="bg-blue-100 dark:bg-blue-900/30"
              to="/users"
            />
            <StatCard
              title="Total Teachers"
              value={stats.totalTeachers || 0}
              subtitle="Active faculty members"
              icon={<GraduationCap className="text-purple-600" />}
              color="bg-purple-100 dark:bg-purple-900/30"
              to="/users"
            />
            <StatCard
              title="Total Classes"
              value={stats.totalClasses || 0}
              subtitle="Registered class sections"
              icon={<BookOpen className="text-green-600" />}
              color="bg-green-100 dark:bg-green-900/30"
              to="/classes"
            />
            <StatCard
              title="Total Subjects"
              value={stats.totalSubjects || 0}
              subtitle="Theory + lab subjects"
              icon={<BookOpen className="text-orange-600" />}
              color="bg-orange-100 dark:bg-orange-900/30"
              to="/subjects"
            />
          </div>

          {/* ── Campus Location Lock Panel ──────────────────── */}
          {user.role === 'teacher' && (
            <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border mt-6">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                📍 Campus Location Lock
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Configure the target coordinates of your campus academic building. The student face scanner and classroom check-in will lock to this location (limit is 5m).
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Campus Latitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    placeholder="e.g. 20.3533"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-sm"
                    value={campusLatInput}
                    onChange={(e) => setCampusLatInput(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">Campus Longitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    placeholder="e.g. 85.8266"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-sm"
                    value={campusLonInput}
                    onChange={(e) => setCampusLonInput(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleGetAdminLocation}
                    className="flex-1 px-4 py-2 border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-bg rounded-lg text-xs font-bold transition-all"
                  >
                    Get Current GPS
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveCampusLocation}
                    disabled={locationSaving}
                    className="flex-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-xs font-bold transition-all shadow shadow-primary-500/10"
                  >
                    {locationSaving ? 'Saving...' : 'Save Location'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Admin Exam Release Console ──────────────────────────── */}
          {user.role === 'admin' && (
            <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border mt-6">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                📅 Exam Scheduling & Hall Ticket Release Console
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                Schedule examination start/end dates and release hall tickets for download. Students who meet the attendance threshold can download released cards.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mid Sem Section */}
                <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-100 dark:border-dark-border space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white border-b pb-2 flex items-center justify-between">
                    <span>Mid-Semester Exams</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${examSettings.isMidSemAdmitCardEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {examSettings.isMidSemAdmitCardEnabled ? 'Released' : 'Locked'}
                    </span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Start Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-1.5 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-xs"
                        value={examSettings.midSemStartDate || ''}
                        onChange={(e) => setExamSettings({ ...examSettings, midSemStartDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">End Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-1.5 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-xs"
                        value={examSettings.midSemEndDate || ''}
                        onChange={(e) => setExamSettings({ ...examSettings, midSemEndDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-600 dark:text-gray-300 font-medium font-bold">Release Admit Cards</span>
                    <button
                      type="button"
                      onClick={() => setExamSettings({ ...examSettings, isMidSemAdmitCardEnabled: !examSettings.isMidSemAdmitCardEnabled })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        examSettings.isMidSemAdmitCardEnabled 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {examSettings.isMidSemAdmitCardEnabled ? 'Lock Admit Cards' : 'Release Admit Cards'}
                    </button>
                  </div>
                </div>

                {/* End Sem Section */}
                <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-100 dark:border-dark-border space-y-4">
                  <h4 className="text-sm font-bold text-gray-900 dark:text-white border-b pb-2 flex items-center justify-between">
                    <span>End-Semester Exams</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${examSettings.isEndSemAdmitCardEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                      {examSettings.isEndSemAdmitCardEnabled ? 'Released' : 'Locked'}
                    </span>
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">Start Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-1.5 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-xs"
                        value={examSettings.endSemStartDate || ''}
                        onChange={(e) => setExamSettings({ ...examSettings, endSemStartDate: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-semibold text-gray-500 uppercase mb-1">End Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-1.5 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-xs"
                        value={examSettings.endSemEndDate || ''}
                        onChange={(e) => setExamSettings({ ...examSettings, endSemEndDate: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-gray-600 dark:text-gray-300 font-medium font-bold">Release Admit Cards</span>
                    <button
                      type="button"
                      onClick={() => setExamSettings({ ...examSettings, isEndSemAdmitCardEnabled: !examSettings.isEndSemAdmitCardEnabled })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                        examSettings.isEndSemAdmitCardEnabled 
                          ? 'bg-red-500 hover:bg-red-600 text-white' 
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {examSettings.isEndSemAdmitCardEnabled ? 'Lock Admit Cards' : 'Release Admit Cards'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  type="button"
                  onClick={handleSaveExamSettings}
                  disabled={settingsSaving}
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-lg text-xs font-bold transition-all shadow shadow-indigo-500/20"
                >
                  {settingsSaving ? 'Saving parameters...' : 'Save Exam Parameters'}
                </button>
              </div>
            </div>
          )}

          {/* ── Charts Section ───────────────────────────────────── */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
            {/* Bar Chart — wider */}
            <div className="lg:col-span-3 bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">Attendance Health Distribution</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Student count by attendance band</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg">
                  {totalStudents} Total
                </span>
              </div>
              <Bar options={chartOptions} data={barData} />
              {/* Mini legend below */}
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="p-2 bg-green-50 dark:bg-green-900/10 rounded-xl">
                  <div className="text-lg font-black text-green-600">{safeCount}</div>
                  <div className="text-[10px] text-gray-400 font-semibold">Safe ≥75%</div>
                </div>
                <div className="p-2 bg-amber-50 dark:bg-amber-900/10 rounded-xl">
                  <div className="text-lg font-black text-amber-500">{warningCount}</div>
                  <div className="text-[10px] text-gray-400 font-semibold">Warning 60–74%</div>
                </div>
                <div className="p-2 bg-red-50 dark:bg-red-900/10 rounded-xl">
                  <div className="text-lg font-black text-red-600">{criticalCount}</div>
                  <div className="text-[10px] text-gray-400 font-semibold">Critical &lt;60%</div>
                </div>
              </div>
            </div>

            {/* Pie Chart — narrower */}
            <div className="lg:col-span-2 bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex flex-col">
              <div className="mb-5">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Defaulter Breakdown</h3>
                <p className="text-xs text-gray-400 mt-0.5">By type of attendance violation</p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <div className="w-52 h-52">
                  <Pie options={pieOptions} data={pieData} />
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block" />Compliant</span>
                  <span className="font-bold text-gray-700 dark:text-gray-200">{compliant} students</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" />Theory Defaulter</span>
                  <span className="font-bold text-gray-700 dark:text-gray-200">{theoryDefaulters} students</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block" />Lab Defaulter</span>
                  <span className="font-bold text-gray-700 dark:text-gray-200">{labDefaulters} students</span>
                </div>
              </div>
            </div>
          </div>

        
        </>
      ) : (
        // STUDENT DASHBOARD LAYOUT
        <div className="space-y-6">
          <AdBanner />
          {/* ── Student Hero Header ───────────────────────────────── */}
          <div className="bg-gradient-to-br from-primary-600 via-violet-700 to-purple-800 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
            <div className="absolute bottom-0 left-1/3 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 bg-white/20 text-white text-[10px] font-bold rounded-full uppercase tracking-widest">🎓 Student</span>
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    (stats.theoryPercentage || 0) >= 75
                      ? 'bg-green-500/30 text-green-200'
                      : 'bg-red-500/30 text-red-200'
                  }`}>
                    {(stats.theoryPercentage || 0) >= 75 ? '✓ Theory Eligible' : '⚠ Theory Defaulter'}
                  </span>
                </div>
                <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]} 👋</h1>
                <p className="text-primary-200 text-sm mt-1">
                  {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {user?.College?.name && (
                    <span className="text-primary-100 text-xs font-bold uppercase tracking-wider bg-white/10 px-2 py-1 rounded">
                      🏢 {user?.College?.name}
                    </span>
                  )}
                  {user?.course && (
                    <span className="text-primary-100 text-xs font-bold uppercase tracking-wider bg-white/10 px-2 py-1 rounded">
                      🎓 {user.course}
                    </span>
                  )}
                  {user?.rollNo && (
                    <span className="text-primary-100 text-xs font-bold uppercase tracking-wider bg-white/10 px-2 py-1 rounded">
                      🆔 Roll No: {user.rollNo}
                    </span>
                  )}
                 
                </div>


                
                {/* Gamified Badges */}
                <div className="flex gap-2 mt-4">
                  {(stats.attendancePercentage || 0) >= 90 && (
                    <div className="flex items-center gap-1 bg-yellow-400/20 text-yellow-200 px-2 py-1 rounded-md text-xs font-bold border border-yellow-400/30" title="Attendance Titan: >= 90% Attendance">
                      👑 Titan
                    </div>
                  )}

                  {(stats.attendancePercentage || 0) === 100 && (
                    <div className="flex items-center gap-1 bg-purple-400/20 text-purple-200 px-2 py-1 rounded-md text-xs font-bold border border-purple-400/30" title="Flawless: 100% Attendance">
                      💎 Flawless
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-center min-w-[80px]">
                  <div className={`text-2xl font-black ${
                    (stats.theoryPercentage || 0) >= 75 ? 'text-green-300' : 'text-red-300'
                  }`}>{stats.theoryPercentage || 0}%</div>
                  <div className="text-[10px] text-primary-200 font-semibold uppercase">Theory</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-center min-w-[80px]">
                  <div className={`text-2xl font-black ${
                    (stats.labPercentage || 0) >= 60 ? 'text-green-300' : 'text-red-300'
                  }`}>{stats.labPercentage || 0}%</div>
                  <div className="text-[10px] text-primary-200 font-semibold uppercase">Lab</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 text-center min-w-[80px]">
                  <div className="text-2xl font-black text-white">{stats.attendancePercentage || 0}%</div>
                  <div className="text-[10px] text-primary-200 font-semibold uppercase">Overall</div>
                </div>
              </div>
            </div>
          </div>

          {/* Dean's Attendance Shortage & Debarment Alert Banner */}
          {((stats.attendancePercentage || 0) < 70) && (
            <div className={`p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center gap-4 shadow-sm border-l-8 ${
              (stats.attendancePercentage || 0) < 50
                ? 'bg-red-500/10 border-red-500 dark:bg-red-950/20 text-red-700 dark:text-red-400'
                : (stats.attendancePercentage || 0) < 60
                ? 'bg-rose-500/10 border-rose-500 dark:bg-rose-950/20 text-rose-700 dark:text-rose-400'
                : 'bg-amber-500/10 border-amber-500 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400'
            }`}>
              <div className={`p-3 rounded-xl shrink-0 ${
                (stats.attendancePercentage || 0) < 60 ? 'bg-red-100 dark:bg-red-900/30 text-red-600' : 'bg-amber-100 dark:bg-amber-900/30 text-amber-600'
              }`}>
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="text-md font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  {((stats.attendancePercentage || 0) < 60) ? '🚨 EXAM DEBARMENT WARNING' : '⚠️ DEAN ATTENDANCE SHORTAGE NOTICE'}
                  <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 text-[9px] font-bold rounded-full uppercase tracking-wider animate-pulse">Critical</span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Your overall attendance is currently <strong className="text-gray-900 dark:text-white">{stats.attendancePercentage || 0}%</strong>, which is below the safe threshold of <strong>70%</strong>. 
                  {((stats.attendancePercentage || 0) < 50) ? (
                    <strong> Exams are approaching next week! You are officially DEBARRED from both Mid-Sem (req. 60%) and End-Sem (req. 50%) exams. All Hall Tickets are LOCKED.</strong>
                  ) : ((stats.attendancePercentage || 0) < 60) ? (
                    <strong> Exams are approaching next week! You are officially DEBARRED from Mid-Sem exams (req. 60%). Your Mid-Sem Hall Ticket is LOCKED.</strong>
                  ) : (
                    " Exams are approaching! You must maintain >= 60% (Mid-Sem) / 50% (End-Sem) or you will be barred from examinations."
                  )}
                </p>
              </div>
            </div>
          )}

          {/* Smart Check-In Active Session Prompt */}
          {stats.activeClass && (
            <div className="bg-gradient-to-r from-teal-500 via-cyan-500 to-indigo-600 text-white rounded-2xl p-6 shadow-md relative overflow-hidden border border-teal-400/20">
              <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
              <div className="absolute left-1/3 top-0 -translate-y-12 w-32 h-32 bg-teal-400/20 rounded-full blur-xl animate-pulse" />
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
                <div className="flex-1">
                  <h3 className="text-md font-bold text-white mb-0.5 flex items-center gap-2">
                    📍 Active Classroom Check-In
                    <span className="px-2 py-0.5 bg-white/20 text-white text-[9px] font-bold rounded-full uppercase tracking-widest animate-pulse">Live</span>
                  </h3>
                  <p className="text-xs text-teal-100 max-w-xl leading-relaxed">
                    Your attendance session for <strong>{stats.activeClass.name} ({stats.activeClass.subjectName})</strong> is currently open! Check-in now to mark yourself present.
                  </p>
                </div>
                <button
                  onClick={() => setShowCheckinModal(true)}
                  className="flex-shrink-0 px-4 py-2 bg-white text-teal-600 hover:bg-teal-50 text-xs font-bold rounded-xl shadow transition-all hover:scale-[1.02] active:scale-[0.98] mt-2 md:mt-0"
                >
                  Check In Now
                </button>
              </div>
            </div>
          )}

          {stats.gracePeriodEnds && (
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 p-5 rounded-2xl flex items-start gap-4 shadow-sm">
              <div className="p-2.5 bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-xl">
                <AlertCircle className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-md font-bold text-amber-900 dark:text-amber-300">Defaulter Grace Period Active</h3>
                <p className="text-sm text-amber-700 dark:text-amber-400 mt-1">
                  Your attendance has dropped below 75%. You have a grace period until <strong>{new Date(stats.gracePeriodEnds).toLocaleDateString()}</strong> to raise your attendance or submit Duty Leave/Medical requests before parents are automatically alerted.
                </p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            <StatCard title="Theory Attendance" value={`${stats.theoryPercentage || 0}%`} subtitle={`${stats.theoryAttended || 0} of ${stats.theoryTotal || 0} classes attended`} icon={<CheckSquare className="text-green-600" />} color="bg-green-100 dark:bg-green-900/30" to="/attendance/view" />
            <StatCard title="Lab Attendance" value={`${stats.labPercentage || 0}%`} subtitle={`${stats.labAttended || 0} of ${stats.labTotal || 0} sessions attended`} icon={<CheckSquare className="text-purple-600" />} color="bg-purple-100 dark:bg-purple-900/30" to="/attendance/view" />
            <StatCard title="Overall Attendance" value={`${stats.attendancePercentage || 0}%`} subtitle="Theory + lab combined" icon={<Percent className="text-blue-600" />} color="bg-blue-100 dark:bg-blue-900/30" to="/attendance/view" />
            <StatCard title="Total Sessions Held" value={(stats.theoryTotal || 0) + (stats.labTotal || 0)} subtitle="Across all registered subjects" icon={<BookOpen className="text-orange-600" />} color="bg-orange-100 dark:bg-orange-900/30" to="/attendance/view" />
          </div>

          {/* ── AI Attendance Predictor ───────────────────────── */}
          {stats.aiPredictor && (
            <div className="bg-gradient-to-r from-blue-50 to-primary-50 dark:from-blue-900/10 dark:to-primary-900/10 border border-blue-100 dark:border-blue-800/30 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-6 items-center">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-100 dark:bg-blue-900/40 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-400 opacity-20 animate-pulse"></div>
                <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400 relative z-10" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
                  AI Attendance Predictor
                  <span className="bg-gradient-to-r from-primary-500 to-purple-500 text-transparent bg-clip-text text-xs font-black uppercase tracking-widest px-2 py-0.5 rounded-full border border-primary-200 dark:border-primary-800">Beta</span>
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Based on your current attendance, here is your margin of safety:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
                    <div className="text-xs font-bold text-gray-400 uppercase mb-1">Theory Safe Misses</div>
                    <div className="flex items-end gap-2">
                      <span className={`text-2xl font-black ${stats.aiPredictor.theorySafeMisses > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {stats.aiPredictor.theorySafeMisses}
                      </span>
                      <span className="text-sm text-gray-500 font-medium mb-1">classes</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">If you miss {stats.aiPredictor.theorySafeMisses + 1} more class, you drop below 75%.</p>
                  </div>
                  
                  <div className="bg-white dark:bg-dark-card p-4 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border">
                    <div className="text-xs font-bold text-gray-400 uppercase mb-1">What if I miss next 3?</div>
                    <div className="flex items-end gap-2">
                      <span className="text-2xl font-black text-primary-500">
                        {stats.aiPredictor.theoryDropAfter3Misses}%
                      </span>
                      <span className="text-sm text-gray-500 font-medium mb-1">theory attd.</span>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {stats.aiPredictor.theoryDropAfter3Misses < 75 
                        ? '🚨 You will become a defaulter!'
                        : '✅ You will still be in the safe zone.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Exam Registration Lock & Hall Ticket (Feature E) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mid-Sem Exam Card */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex flex-col justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  !stats.college?.isMidSemAdmitCardEnabled
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                    : isMidSemEligible 
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-600' 
                    : 'bg-red-100 dark:bg-red-900/20 text-red-600'
                }`}>
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Mid-Sem Exam Hall Ticket</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {!stats.college?.isMidSemAdmitCardEnabled ? (
                      stats.college?.midSemStartDate ? (
                        `Exams scheduled: ${stats.college.midSemStartDate} to ${stats.college.midSemEndDate || 'N/A'}. Awaiting Release.`
                      ) : (
                        'Admit cards have not been released by the academic cell yet.'
                      )
                    ) : isMidSemEligible ? (
                      'Eligible! You have maintained overall attendance >= 60%.'
                    ) : (
                      `Debarred! Overall attendance (${stats.attendancePercentage || 0}%) is deficient. (Required: 60% for Mid-Sem)`
                    )}
                  </p>
                </div>
              </div>
              <div>
                {!stats.college?.isMidSemAdmitCardEnabled ? (
                  <button
                    disabled
                    className="w-full px-5 py-2.5 bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-not-allowed border border-dashed border-gray-300 dark:border-gray-700"
                  >
                    🔒 Awaiting Release by College
                  </button>
                ) : isMidSemEligible ? (
                  <button
                    onClick={() => generateAdmitCard('theory')}
                    className="w-full px-5 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl shadow-md text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <FileText className="w-4 h-4" /> Download Mid-Sem Admit Card
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      disabled
                      className="w-full px-5 py-2.5 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      🔒 Mid-Sem Admit Card Locked
                    </button>
                    <p className="text-[10px] text-red-500 font-bold text-center">🚨 Attendance threshold check failed. You must attend make-up classes immediately.</p>
                  </div>
                )}
              </div>
            </div>

            {/* End-Sem Exam Card */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex flex-col justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  !stats.college?.isEndSemAdmitCardEnabled
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                    : isEndSemEligible 
                    ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-600' 
                    : 'bg-red-100 dark:bg-red-900/20 text-red-600'
                }`}>
                  <Award className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">End-Sem Exam Hall Ticket</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {!stats.college?.isEndSemAdmitCardEnabled ? (
                      stats.college?.endSemStartDate ? (
                        `Exams scheduled: ${stats.college.endSemStartDate} to ${stats.college.endSemEndDate || 'N/A'}. Awaiting Release.`
                      ) : (
                        'Admit cards have not been released by the academic cell yet.'
                      )
                    ) : isEndSemEligible ? (
                      'Eligible! You have maintained overall attendance >= 50%.'
                    ) : (
                      `Debarred! Overall attendance (${stats.attendancePercentage || 0}%) is deficient. (Required: 50% for End-Sem)`
                    )}
                  </p>
                </div>
              </div>
              <div>
                {!stats.college?.isEndSemAdmitCardEnabled ? (
                  <button
                    disabled
                    className="w-full px-5 py-2.5 bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-not-allowed border border-dashed border-gray-300 dark:border-gray-700"
                  >
                    🔒 Awaiting Release by College
                  </button>
                ) : isEndSemEligible ? (
                  <button
                    onClick={() => generateAdmitCard('practical')}
                    className="w-full px-5 py-2.5 bg-gradient-to-r from-primary-600 to-violet-600 hover:from-primary-700 hover:to-violet-700 text-white rounded-xl shadow-md text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                  >
                    <FileText className="w-4 h-4" /> Download End-Sem Admit Card
                  </button>
                ) : (
                  <div className="space-y-2">
                    <button
                      disabled
                      className="w-full px-5 py-2.5 bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 cursor-not-allowed"
                    >
                      🔒 End-Sem Admit Card Locked
                    </button>
                    <p className="text-[10px] text-red-500 font-bold text-center">🚨 Attendance threshold check failed. You must attend make-up classes immediately.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Bunk Calculator (Option A) */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Subject-wise Attendance & Bunk Predictor</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-dark-border text-xs">
                      <th className="p-3 font-semibold text-gray-600 dark:text-gray-400">Subject</th>
                      <th className="p-3 font-semibold text-gray-600 dark:text-gray-400 text-center">Ratio</th>
                      <th className="p-3 font-semibold text-gray-600 dark:text-gray-400 text-center">Percentage</th>
                      <th className="p-3 font-semibold text-gray-600 dark:text-gray-400 text-right">Recommendation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats.subjectWiseStats || []).map((sub) => {
                      const reqPct = sub.type === 'lab' ? 60 : 75;
                      const bunkCalc = getBunkCalculations(sub.attended, sub.total, sub.type);
                      return (
                        <tr key={sub.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-medium text-gray-900 dark:text-white">
                            <div>{sub.name} <span className="text-xs text-gray-500 font-normal">({sub.type === 'lab' ? 'Lab' : 'Theory'})</span></div>
                            <div className="text-xs text-gray-400 font-normal">{sub.code}</div>
                          </td>
                          <td className="p-3 text-center text-gray-500">{sub.attended}/{sub.total}</td>
                          <td className="p-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                              sub.percentage >= reqPct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {sub.percentage}%
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            {bunkCalc.message}
                          </td>
                        </tr>
                      );
                    })}
                    {(stats.subjectWiseStats || []).length === 0 && (
                      <tr>
                        <td colSpan="4" className="p-4 text-center text-gray-400">No subject records available.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Internal Marks (Feature G) */}
            <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Continuous Internal Evaluation Scores</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-dark-border text-xs">
                      <th className="p-3 font-semibold text-gray-600 dark:text-gray-400">Subject</th>
                      <th className="p-3 font-semibold text-gray-600 dark:text-gray-400 text-center">Mid-Sem</th>
                      <th className="p-3 font-semibold text-gray-600 dark:text-gray-400 text-center">Quiz</th>
                      <th className="p-3 font-semibold text-gray-600 dark:text-gray-400 text-center">Assignment</th>
                      <th className="p-3 font-semibold text-gray-600 dark:text-gray-400 text-center">Total (Max 50)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(stats.marks || []).map((m) => {
                      const isLab = m.Subject?.type === 'lab';
                      const midMax = isLab ? 0 : 20;
                      const quizMax = 10;
                      const assignmentMax = isLab ? 40 : 20;
                      
                      const totalMark = (isLab ? 0 : (m.midSem || 0)) + (m.quiz || 0) + (m.assignment || 0);
                      const isEntered = (isLab ? false : m.midSem !== null) || m.quiz !== null || m.assignment !== null;

                      return (
                        <tr key={m.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50">
                          <td className="p-3 font-medium text-gray-900 dark:text-white">
                            <div>{m.Subject?.name}</div>
                            <div className="text-xs text-gray-400 font-normal">{m.Subject?.code} ({m.Subject?.type})</div>
                          </td>
                          <td className="p-3 text-center font-medium">
                            {isLab ? (
                              <span className="text-gray-400 text-xs">N/A</span>
                            ) : (
                              m.midSem !== null ? `${m.midSem}/${midMax}` : `-${midMax}`
                            )}
                          </td>
                          <td className="p-3 text-center font-medium">
                            {m.quiz !== null ? `${m.quiz}/${quizMax}` : `-${quizMax}`}
                          </td>
                          <td className="p-3 text-center font-medium">
                            {m.assignment !== null ? `${m.assignment}/${assignmentMax}` : `-${assignmentMax}`}
                          </td>
                          <td className="p-3 text-center font-bold text-primary-600">
                            {isEntered ? `${totalMark}/50` : '-/50'}
                          </td>
                        </tr>
                      );
                    })}
                    {(stats.marks || []).length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-4 text-center text-gray-400">No continuous marks recorded.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
          </div>
        </div>

        {/* My Teachers Section */}
          {stats.myTeachers && stats.myTeachers.length > 0 && (
            <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border mt-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">My Faculty & Instructors</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Teachers and class mentor assigned for this semester:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {stats.myTeachers.map((t, idx) => {
                  const isMentor = t.role === 'mentor';
                  return (
                  <div key={idx} className={`p-4 rounded-xl border flex items-start gap-3 hover:shadow-md transition-shadow ${isMentor ? 'bg-purple-50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-800/30' : 'bg-gray-50 dark:bg-dark-bg border-gray-100 dark:border-dark-border'}`}>
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm ${isMentor ? 'bg-gradient-to-br from-purple-500 to-violet-600' : 'bg-gradient-to-br from-primary-500 to-indigo-600'}`}>
                      {isMentor ? '🧑‍🏫' : t.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 dark:text-white truncate">{t.name}</h4>
                      <p className="text-xs text-gray-400 dark:text-gray-500 truncate mb-1">{t.email}</p>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border ${isMentor ? 'text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/30 border-purple-200 dark:border-purple-800/30' : 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-950/40 border-primary-100 dark:border-primary-900/30'}`}>
                        {isMentor ? '🎓 Class Mentor' : `${t.subjectName} (${t.subjectCode})`}
                      </span>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* SGPA Estimator Console */}
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border mt-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">SGPA Estimator Console</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Enter your expected End-Sem exam scores to estimate your Semester Grade Point Average (SGPA). Internal marks shown are synced from the database.
            </p>

            {/* Legend */}
            <div className="flex gap-3 mb-4 text-xs flex-wrap">
              <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg font-semibold">📖 Theory: Mid-Sem(20) + Quiz(10) + Assignment(20) + End-Sem(50) = 100</span>
              <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg font-semibold">🔬 Lab: Practical Work(40) + Quiz(10) = 50 (no end-sem)</span>
            </div>
            
            <div className="space-y-3">
              {(stats.marks || []).map((m) => {
                const subId = m.subjectId;
                const isLab = m.Subject?.type === 'lab';
                const dbMid = m.midSem;
                const dbQuiz = m.quiz;
                const dbAss = m.assignment;

                return (
                  <div key={m.id} className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-xl border ${
                    isLab 
                      ? 'bg-purple-50/50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/20' 
                      : 'bg-gray-50 dark:bg-dark-bg border-gray-100 dark:border-dark-border'
                  }`}>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs">{isLab ? '🔬' : '📖'}</span>
                        <h4 className="font-bold text-gray-900 dark:text-white truncate">{m.Subject?.name}</h4>
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {m.Subject?.code} • Credits: {m.Subject?.credits || (isLab ? 1 : 3)} • <span className={isLab ? 'text-purple-500' : 'text-blue-500'}>{isLab ? 'Lab/Practical' : 'Theory'}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Mid-Sem — Theory only */}
                      {!isLab && (
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-gray-500 font-bold uppercase mb-1 flex items-center gap-1">
                            Mid-Sem (20) {dbMid !== null && <span className="w-1.5 h-1.5 rounded-full bg-green-500" title="Synced from DB" />}
                          </span>
                          <input
                            type="number"
                            min="0" max="20"
                            placeholder={dbMid !== null ? String(dbMid) : 'Not entered'}
                            className={`w-16 px-2 py-1 border rounded-lg text-center text-xs font-semibold bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 cursor-not-allowed`}
                            value={dbMid !== null ? dbMid : ''}
                            readOnly
                          />
                        </div>
                      )}

                      {/* Quiz */}
                      <div className="flex flex-col items-center">
                        <span className="text-[10px] text-gray-500 font-bold uppercase mb-1 flex items-center gap-1">
                          Quiz (10) {dbQuiz !== null && <span className="w-1.5 h-1.5 rounded-full bg-green-500" title="Synced from DB" />}
                        </span>
                        <input
                          type="number"
                          min="0" max="10"
                          placeholder={dbQuiz !== null ? String(dbQuiz) : 'Not entered'}
                          className={`w-16 px-2 py-1 border rounded-lg text-center text-xs font-semibold bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 cursor-not-allowed`}
                          value={dbQuiz !== null ? dbQuiz : ''}
                          readOnly
                        />
                      </div>

                      {/* Assignment / Practical Work */}
                      <div className="flex flex-col items-center">
                        <span className={`text-[10px] font-bold uppercase mb-1 flex items-center gap-1 ${
                          isLab ? 'text-purple-500' : 'text-gray-500'
                        }`}>
                          {isLab ? 'Practical (40)' : 'Assgn (20)'} {dbAss !== null && <span className="w-1.5 h-1.5 rounded-full bg-green-500" title="Synced from DB" />}
                        </span>
                        <input
                          type="number"
                          min="0" max={isLab ? 40 : 20}
                          placeholder={dbAss !== null ? String(dbAss) : 'Not entered'}
                          className={`w-16 px-2 py-1 border rounded-lg text-center text-xs font-semibold bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 cursor-not-allowed`}
                          value={dbAss !== null ? dbAss : ''}
                          readOnly
                        />
                      </div>

                      {/* End-Sem — Theory only; labs have no separate end-sem */}
                      {!isLab && (
                        <div className="flex flex-col items-center">
                          <span className="text-[10px] text-primary-500 font-bold uppercase mb-1">
                            End-Sem (50)
                          </span>
                          <input
                            type="number"
                            min="0" max="50"
                            placeholder="e.g. 40"
                            className="w-20 px-2 py-1 border border-primary-300 dark:border-primary-900 rounded-lg dark:bg-dark-bg text-center text-xs font-bold text-primary-600 dark:text-primary-400 focus:ring-1 focus:ring-primary-500"
                            value={expectedMarks[subId]?.expectedEndSem ?? ''}
                            onChange={(e) => setExpectedMarks(prev => ({
                              ...prev,
                              [subId]: { ...(prev[subId] || {}), expectedEndSem: e.target.value === '' ? '' : Math.min(50, Math.max(0, Number(e.target.value))) }
                            }))}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {(stats.marks || []).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-4">No subjects registered for this class. SGPA estimation will be available once subjects are assigned.</p>
              )}

              {(stats.marks || []).length > 0 && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handlePredictSGPA}
                    disabled={predicting}
                    className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-sm font-bold shadow-md transition-colors disabled:opacity-50"
                  >
                    {predicting ? 'Calculating...' : '🎯 Calculate Predicted SGPA'}
                  </button>
                </div>
              )}
            </div>

            {predictedResult && (
              <div className="mt-6 p-6 bg-primary-50/50 dark:bg-primary-900/10 border border-primary-100 dark:border-primary-900/20 rounded-2xl animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-md font-bold text-primary-900 dark:text-primary-300">SGPA Estimation Summary</h4>
                  <span className="text-2xl font-black text-primary-700 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/40 px-4 py-1.5 rounded-xl">
                    SGPA: {predictedResult.predictedSGPA}
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-primary-100 dark:border-primary-900/20 text-primary-800 dark:text-primary-300">
                        <th className="pb-2 font-bold">Subject</th>
                        <th className="pb-2 text-center font-bold">Credits</th>
                        <th className="pb-2 text-center font-bold">Internals (50)</th>
                        <th className="pb-2 text-center font-bold">End-Sem (50)</th>
                        <th className="pb-2 text-center font-bold">Total (100)</th>
                        <th className="pb-2 text-right font-bold">Grade (Points)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {predictedResult.predictions.map((p) => (
                        <tr key={p.subjectId} className="border-b border-primary-50/50 dark:border-primary-900/5 last:border-0 text-gray-700 dark:text-gray-300">
                          <td className="py-2.5 font-semibold">{p.name} ({p.code})</td>
                          <td className="py-2.5 text-center font-semibold">{p.credits}</td>
                          <td className="py-2.5 text-center">{p.internalsTotal}</td>
                          <td className="py-2.5 text-center">{p.expectedEndSem}</td>
                          <td className="py-2.5 text-center font-bold">{p.totalScore}</td>
                          <td className="py-2.5 text-right font-bold text-primary-600 dark:text-primary-400">
                            {p.grade} ({p.gradePoint})
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                      <AdvancedAnalytics stats={stats} />
                      <PredictiveAnalytics />
                    </div>
          
          <KanbanBoard />
        </div>
      )}
      {/* Student Detailed Attendance Modal (Admin/Teacher view) */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl w-full max-w-2xl border border-gray-100 dark:border-dark-border shadow-xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Detailed Attendance Report</h2>
                <p className="text-sm text-gray-400 mt-1">
                  Student: <strong className="text-gray-700 dark:text-gray-200">{selectedStudent.student?.name}</strong> • {selectedStudent.student?.email}
                </p>
              </div>
              <button 
                onClick={() => setSelectedStudent(null)} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-bold bg-gray-100 dark:bg-gray-800 px-3 py-1.5 rounded-lg transition-colors"
              >
                ✕ Close
              </button>
            </div>

            {/* Attendance overview stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-100 dark:border-dark-border text-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Theory Attendance</span>
                <span className={`text-xl font-bold ${selectedStudent.theoryPercentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedStudent.theoryPercentage}%
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  ({selectedStudent.theoryAttended}/{selectedStudent.theoryTotal} classes)
                </span>
              </div>
              
              <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-100 dark:border-dark-border text-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Lab Attendance</span>
                <span className={`text-xl font-bold ${selectedStudent.labPercentage >= 60 ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedStudent.labPercentage}%
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  ({selectedStudent.labAttended}/{selectedStudent.labTotal} classes)
                </span>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl border border-gray-100 dark:border-dark-border text-center">
                <span className="text-[10px] text-gray-400 font-bold uppercase block mb-1">Overall Attendance</span>
                <span className="text-xl font-bold text-gray-800 dark:text-gray-200">
                  {selectedStudent.attendancePercentage}%
                </span>
                <span className="text-[10px] text-gray-400 block mt-0.5">
                  ({selectedStudent.theoryAttended + selectedStudent.labAttended}/{selectedStudent.theoryTotal + selectedStudent.labTotal} classes)
                </span>
              </div>
            </div>

            {/* Subject wise detailed table */}
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
      
      <SmartCheckinModal 
        isOpen={showCheckinModal} 
        onClose={() => setShowCheckinModal(false)} 
        activeClass={stats.activeClass}
        onCheckinSuccess={fetchStats}
      />

      {/* ── Custom Professional Email Warning Modal ── */}
      {defaulterToEmail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-dark-card w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-gray-100 dark:border-dark-border flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-dark-border bg-red-50/50 dark:bg-red-950/10">
              <h3 className="font-bold text-red-600 dark:text-red-400 flex items-center gap-2 text-sm">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Dispatch Academic Warning
              </h3>
              <button 
                onClick={() => setDefaulterToEmail(null)} 
                className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                Are you sure you want to dispatch an official academic warning notice to the parent of <strong className="text-gray-900 dark:text-white">"{defaulterToEmail.name}"</strong>?
              </p>
              <div className="bg-gray-50 dark:bg-dark-bg p-3.5 rounded-2xl border border-gray-100 dark:border-dark-border text-xs text-gray-500 dark:text-gray-400 space-y-1">
                <p>📧 This email will detail their current attendance deficit and alert them to the risk of semester exam debarment.</p>
                {defaulterToEmail.gracePeriodEnds && new Date(defaulterToEmail.gracePeriodEnds) > new Date() && (
                  <p className="text-amber-600 dark:text-amber-400 font-bold mt-2 flex items-center gap-1">
                    ⚠️ Active grace status until {new Date(defaulterToEmail.gracePeriodEnds).toLocaleDateString()}.
                  </p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-dark-border flex gap-2 justify-end bg-gray-50/30 dark:bg-dark-card">
              <button
                type="button"
                onClick={() => setDefaulterToEmail(null)}
                className="px-4 py-2 border border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-bg rounded-xl text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={executeSendWarningEmail}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-red-500/10"
              >
                Confirm & Dispatch
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
