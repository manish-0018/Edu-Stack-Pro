import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Download, Eye, X, Calendar, BookOpen, GraduationCap, CheckCircle, XCircle, AlertCircle, CalendarDays, List, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ViewAttendance = () => {
  const { user } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecord, setSelectedRecord] = useState(null); // For modal
  const [viewMode, setViewMode] = useState('table'); // 'table' or 'calendar'
  
  // Calendar states
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const [attRes, matRes] = await Promise.all([
          axios.get('/api/attendance'),
          axios.get('/api/materials')
        ]);
        setAttendance(attRes.data);
        setMaterials(matRes.data);
      } catch (err) {
        toast.error('Failed to fetch attendance records or materials');
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, []);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Edu Stack Pro Attendance Report', 14, 15);
    
    const tableColumn = ["Date", "Class", "Subject", "Total", "Present", "Absent"];
    const tableRows = [];

    attendance.forEach(record => {
      const presentCount = record.records?.filter(r => r.status === 'present' || r.status === 'late' || r.status === 'duty' || r.status === 'excused').length || 0;
      const absentCount = record.records?.filter(r => r.status === 'absent').length || 0;
      const recordData = [
        new Date(record.date).toLocaleDateString(),
        record.Class?.name || '-',
        record.Subject?.name || '-',
        record.records?.length || 0,
        presentCount,
        absentCount
      ];
      tableRows.push(recordData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    
    doc.save(`KIIT_Attendance_Report_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  if (loading) return <div className="flex h-64 items-center justify-center">Loading...</div>;

  // Calendar calculations (Student View)
  const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDayIndex = getFirstDayOfMonth(currentMonth, currentYear);

  // Group attendance records by date for easy calendar lookup
  const attendanceByDate = {};
  attendance.forEach(att => {
    // Format date string as YYYY-MM-DD
    const dateStr = new Date(att.date).toISOString().split('T')[0];
    if (!attendanceByDate[dateStr]) {
      attendanceByDate[dateStr] = [];
    }
    attendanceByDate[dateStr].push(att);
  });

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance Logs</h1>
          <p className="text-gray-500 dark:text-gray-400">View and analyze previous lecture history</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Switcher */}
          <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg flex border border-gray-200 dark:border-dark-border">
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1 text-xs font-semibold transition-colors ${
                viewMode === 'table' 
                  ? 'bg-white dark:bg-dark-card text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800'
              }`}
            >
              <List className="w-4 h-4" /> Table
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1 text-xs font-semibold transition-colors ${
                viewMode === 'calendar' 
                  ? 'bg-white dark:bg-dark-card text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-800'
              }`}
            >
              <CalendarDays className="w-4 h-4" /> Calendar Grid
            </button>
          </div>

          {attendance.length > 0 && user.role !== 'student' && (
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex items-center gap-2 transition-colors shadow-sm text-xs font-semibold"
            >
              <Download className="w-4 h-4" /> Export PDF
            </button>
          )}
        </div>
      </div>

      {viewMode === 'table' ? (
        // TABLE VIEW
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-dark-border text-sm">
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Date</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Class</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Subject</th>
                <th className="p-4 font-medium text-gray-600 dark:text-gray-300">Stats Summary</th>
                {user.role !== 'student' && <th className="p-4 font-medium text-gray-600 dark:text-gray-300 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {attendance.map((att, idx) => {
                const presentCount = att.records?.filter(r => r.status === 'present' || r.status === 'late' || r.status === 'duty' || r.status === 'excused').length || 0;
                const absentCount = att.records?.filter(r => r.status === 'absent').length || 0;
                const totalCount = att.records?.length || 0;

                return (
                  <tr key={att.id || idx} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="p-4 font-medium text-gray-900 dark:text-white">
                      {new Date(att.date).toLocaleDateString()}
                    </td>
                    <td className="p-4 text-gray-500">{att.Class?.name || '-'}</td>
                    <td className="p-4 text-gray-500">
                      {att.Subject?.name || '-'} {att.Subject?.type ? `(${att.Subject.type === 'lab' ? 'Lab' : 'Theory'})` : ''}
                    </td>
                    <td className="p-4">
                      {user.role === 'student' ? (
                        <div className="flex items-center gap-3">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                            att.records?.[0]?.status === 'present' ? 'bg-green-100 text-green-700' :
                            att.records?.[0]?.status === 'duty' ? 'bg-indigo-100 text-indigo-700' :
                            att.records?.[0]?.status === 'absent' ? 'bg-red-100 text-red-700' :
                            att.records?.[0]?.status === 'late' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-blue-100 text-blue-700' // Excused leave
                          }`}>
                            {att.records?.[0]?.status === 'duty' ? 'Duty Leave (DL)' : att.records?.[0]?.status}
                          </span>
                          {(() => {
                            const dateStr = new Date(att.date).toISOString().split('T')[0];
                            const matchedMat = materials.find(m => m.subjectId === att.subjectId && m.date === dateStr);
                            return matchedMat ? (
                              <a
                                href={matchedMat.contentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline bg-primary-50 dark:bg-primary-900/20 px-2.5 py-1 rounded-lg"
                                title={matchedMat.title}
                              >
                                <BookOpen className="w-3.5 h-3.5" /> Catch-Up Notes
                              </a>
                            ) : null;
                          })()}
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-xs">
                          <span className="font-semibold text-gray-700 dark:text-gray-300">Total: {totalCount}</span>
                          <span className="text-green-600 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded">P: {presentCount}</span>
                          <span className="text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded">A: {absentCount}</span>
                        </div>
                      )}
                    </td>
                    {user.role !== 'student' && (
                      <td className="p-4 text-right">
                        <button
                          onClick={() => setSelectedRecord(att)}
                          className="px-3 py-1 bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/40 rounded-lg flex items-center gap-1 text-xs font-medium ml-auto transition-colors"
                        >
                          <Eye className="w-4 h-4" /> View Details
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
          {attendance.length === 0 && (
            <div className="p-8 text-center text-gray-500">No attendance logs found.</div>
          )}
        </div>
      ) : (
        // VISUAL CALENDAR HEATMAP (Feature F)
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 dark:text-white">
              {months[currentMonth]} {currentYear}
            </h3>
            <div className="flex items-center gap-2">
              <button onClick={handlePrevMonth} className="p-1.5 border rounded-lg dark:border-dark-border hover:bg-gray-50 dark:hover:bg-gray-800">
                <ChevronLeft className="w-5 h-5 text-gray-500" />
              </button>
              <button onClick={handleNextMonth} className="p-1.5 border rounded-lg dark:border-dark-border hover:bg-gray-50 dark:hover:bg-gray-800">
                <ChevronRight className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2 text-center text-xs font-semibold text-gray-500 uppercase pb-2 border-b dark:border-dark-border">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Blank cells for previous month padding */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <div key={`empty-${i}`} className="h-24 bg-gray-50/50 dark:bg-dark-bg/20 rounded-xl border border-dashed border-gray-100 dark:border-dark-border/20"></div>
            ))}

            {/* Calendar active day cells */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const dayRecords = attendanceByDate[dateString] || [];

              return (
                <div key={day} className="h-24 p-2 border border-gray-100 dark:border-dark-border rounded-xl flex flex-col justify-between hover:shadow-sm transition-shadow dark:bg-dark-bg/10">
                  <span className="font-semibold text-gray-700 dark:text-gray-400 text-xs">{day}</span>
                  <div className="flex-1 overflow-y-auto space-y-1 mt-1">
                    {dayRecords.map(att => {
                      const studentRecord = att.records?.[0]; // Single student view
                      
                      // Status color mappings
                      let colorClass = "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300";
                      let shortStatus = "P";
                      
                      if (user.role === 'student' && studentRecord) {
                        const s = studentRecord.status;
                        if (s === 'present') { colorClass = "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"; shortStatus = "P"; }
                        else if (s === 'duty') { colorClass = "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400"; shortStatus = "DL"; }
                        else if (s === 'absent') { colorClass = "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"; shortStatus = "A"; }
                        else if (s === 'late') { colorClass = "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400"; shortStatus = "L"; }
                        else if (s === 'excused') { colorClass = "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"; shortStatus = "E"; }
                      } else {
                        // Admin/Teacher aggregate view on calendar
                        const pCount = att.records?.filter(r => r.status === 'present' || r.status === 'late' || r.status === 'duty' || r.status === 'excused').length || 0;
                        colorClass = "bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400";
                        shortStatus = `${pCount} marked`;
                      }

                      return (
                        <div 
                          key={att.id} 
                          className={`text-[10px] px-1.5 py-0.5 rounded truncate font-medium flex items-center justify-between ${colorClass}`}
                          title={`${att.Subject?.name || 'Class'} (${shortStatus})`}
                        >
                          <span className="truncate">{att.Subject?.code || 'Class'}</span>
                          <span className="font-bold ml-1">{shortStatus}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Calendar Color Badges Guide */}
          {user.role === 'student' && (
            <div className="flex flex-wrap gap-4 text-xs font-semibold pt-4 border-t border-gray-100 dark:border-dark-border">
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-green-500 inline-block"></span> Present (P)</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-indigo-500 inline-block"></span> Duty Leave (DL)</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-red-500 inline-block"></span> Absent (A)</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-yellow-500 inline-block"></span> Late (L)</div>
              <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-blue-500 inline-block"></span> Excused Leave (E)</div>
            </div>
          )}
        </div>
      )}

      {/* Details Modal */}
      {selectedRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-hidden flex flex-col shadow-2xl border border-gray-100 dark:border-dark-border">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-gray-100 dark:border-dark-border flex justify-between items-start bg-gray-50 dark:bg-gray-800">
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lecture Roster Log</h2>
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-gray-500">
                  <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-primary-500" /> {new Date(selectedRecord.date).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-4 h-4 text-purple-500" /> {selectedRecord.Subject?.name} {selectedRecord.Subject?.type ? `(${selectedRecord.Subject.type === 'lab' ? 'Lab' : 'Theory'})` : ''}</span>
                  <span className="flex items-center gap-1"><GraduationCap className="w-4 h-4 text-green-500" /> {selectedRecord.Class?.name}</span>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1.5 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-5 overflow-y-auto flex-1 space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-100 dark:border-blue-900/30">
                  <div className="text-sm text-blue-600 font-medium">Total Roster</div>
                  <div className="text-xl font-bold mt-1">{selectedRecord.records?.length || 0}</div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-900/30">
                  <div className="text-sm text-green-600 font-medium">Present</div>
                  <div className="text-xl font-bold mt-1">
                    {selectedRecord.records?.filter(r => r.status === 'present' || r.status === 'late' || r.status === 'duty').length || 0}
                  </div>
                </div>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-900/30">
                  <div className="text-sm text-red-600 font-medium">Absent / Leave</div>
                  <div className="text-xl font-bold mt-1">
                    {selectedRecord.records?.filter(r => r.status === 'absent' || r.status === 'excused').length || 0}
                  </div>
                </div>
              </div>

              <div className="border border-gray-100 dark:border-dark-border rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-dark-border text-xs">
                      <th className="p-3 font-semibold text-gray-500">Student Name</th>
                      <th className="p-3 font-semibold text-gray-500">Email</th>
                      <th className="p-3 font-semibold text-gray-500 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRecord.records?.map((rec) => (
                      <tr key={rec.id} className="border-b border-gray-50 dark:border-gray-800 text-sm hover:bg-gray-50/50">
                        <td className="p-3 font-medium text-gray-900 dark:text-white">{rec.Student?.name || 'Deleted Student'}</td>
                        <td className="p-3 text-gray-500">{rec.Student?.email || 'N/A'}</td>
                        <td className="p-3 text-center">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                            rec.status === 'present' ? 'bg-green-100 text-green-700' :
                            rec.status === 'absent' ? 'bg-red-100 text-red-700' :
                            rec.status === 'late' ? 'bg-yellow-100 text-yellow-700' :
                            rec.status === 'duty' ? 'bg-indigo-100 text-indigo-700' :
                            'bg-blue-100 text-blue-700' // Excused leave
                          }`}>
                            {rec.status === 'present' && <CheckCircle className="w-3.5 h-3.5" />}
                            {rec.status === 'absent' && <XCircle className="w-3.5 h-3.5" />}
                            {rec.status === 'late' && <AlertCircle className="w-3.5 h-3.5" />}
                            {rec.status === 'excused' && <Calendar className="w-3.5 h-3.5" />}
                            {rec.status === 'duty' && <Calendar className="w-3.5 h-3.5" />}
                            {rec.status === 'duty' ? 'Duty Leave (DL)' : rec.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 dark:border-dark-border bg-gray-50 dark:bg-gray-800 flex justify-between items-center text-xs text-gray-400">
              <span>Marked by: {selectedRecord.Marker?.name || 'Unknown'}</span>
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg transition-colors font-medium text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewAttendance;
