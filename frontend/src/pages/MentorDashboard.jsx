import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Users, AlertTriangle, Calendar, Check, X, FileText, Plus, Mail, Loader2, 
  CheckCircle, MessageSquare, BookOpen, Video, Megaphone, Link2, Clock
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";
import AiIntelligenceWatchlist from "../components/AiIntelligenceWatchlist";

const MentorDashboard = () => {
  const { user } = useAuth();
  const [mentees, setMentees] = useState([]);
  const [attendanceShortages, setAttendanceShortages] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("mentees");

  const [selectedStudent, setSelectedStudent] = useState("");
  const [notes, setNotes] = useState("");
  const [actionItems, setActionItems] = useState("");
  const [sessionStatus, setSessionStatus] = useState("completed");
  const [submittingSession, setSubmittingSession] = useState(false);

  const [showAnnForm, setShowAnnForm] = useState(false);
  const [annForm, setAnnForm] = useState({ title: "", content: "", category: "General", targetRole: "student" });
  const [submittingAnn, setSubmittingAnn] = useState(false);

  const [showMeetForm, setShowMeetForm] = useState(false);
  const [meetForm, setMeetForm] = useState({ studentId: "", title: "", agenda: "", meetingLink: "", meetingDate: "", meetingTime: "" });
  const [submittingMeet, setSubmittingMeet] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [menteesRes, shortageRes, leavesRes, sessionsRes, annRes] = await Promise.all([
        axios.get("/api/mentor/students"),
        axios.get("/api/mentor/shortage"),
        axios.get("/api/mentor/leaves"),
        axios.get("/api/mentor/sessions"),
        axios.get("/api/announcements")
      ]);
      setMentees(menteesRes.data);
      setAttendanceShortages(shortageRes.data);
      setLeaves(leavesRes.data);
      setSessions(sessionsRes.data);
      setAnnouncements(annRes.data);
    } catch (err) {
      toast.error("Failed to load mentor dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboardData(); }, []);

  const handleUpdateLeave = async (id, status) => {
    const toastId = toast.loading(`Updating leave status to ${status}...`);
    try {
      await axios.put(`/api/mentor/leaves/${id}`, { status });
      toast.update(toastId, { render: `Leave ${status} successfully!`, type: "success", isLoading: false, autoClose: 3000 });
      const [leavesRes, menteesRes, shortageRes] = await Promise.all([
        axios.get("/api/mentor/leaves"), axios.get("/api/mentor/students"), axios.get("/api/mentor/shortage")
      ]);
      setLeaves(leavesRes.data); setMentees(menteesRes.data); setAttendanceShortages(shortageRes.data);
    } catch { toast.update(toastId, { render: "Failed to update.", type: "error", isLoading: false, autoClose: 3000 }); }
  };

  const handleSendWarning = async (studentId, email) => {
    const toastId = toast.loading(`Sending warning to ${email}...`);
    try {
      await axios.post("/api/notifications", { userId: studentId, title: "Attendance Shortage Alert", message: "Your attendance is below 75%. Please meet your mentor immediately.", type: "alert" });
      toast.update(toastId, { render: "Warning sent!", type: "success", isLoading: false, autoClose: 3000 });
    } catch { toast.update(toastId, { render: "Failed to send.", type: "error", isLoading: false, autoClose: 3000 }); }
  };

  const handleAddSession = async (e) => {
    e.preventDefault();
    if (!selectedStudent || !notes) { toast.error("Select student and provide notes."); return; }
    setSubmittingSession(true);
    try {
      await axios.post("/api/mentor/sessions", { studentId: selectedStudent, notes, actionItems, status: sessionStatus });
      toast.success("Session logged!");
      setSelectedStudent(""); setNotes(""); setActionItems(""); setSessionStatus("completed");
      const res = await axios.get("/api/mentor/sessions"); setSessions(res.data);
    } catch (err) { toast.error(err.response?.data?.message || "Failed to log session"); }
    finally { setSubmittingSession(false); }
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!annForm.title || !annForm.content) { toast.error("Fill in title and content."); return; }
    setSubmittingAnn(true);
    try {
      await axios.post("/api/announcements", annForm);
      toast.success("Announcement posted!");
      setShowAnnForm(false); setAnnForm({ title: "", content: "", category: "General", targetRole: "student" });
      const res = await axios.get("/api/announcements"); setAnnouncements(res.data);
    } catch (err) { toast.error(err.response?.data?.message || "Failed to post"); }
    finally { setSubmittingAnn(false); }
  };

  const handleDeleteAnnouncement = async (id) => {
    try {
      await axios.delete(`/api/announcements/${id}`); toast.success("Deleted.");
      const res = await axios.get("/api/announcements"); setAnnouncements(res.data);
    } catch { toast.error("Failed to delete."); }
  };

  const handleScheduleMeeting = async (e) => {
    e.preventDefault();
    if (!meetForm.studentId || !meetForm.title || !meetForm.meetingDate || !meetForm.meetingTime) {
      toast.error("Fill in student, title, date and time."); return;
    }
    setSubmittingMeet(true);
    try {
      const meetingDateTime = new Date(`${meetForm.meetingDate}T${meetForm.meetingTime}`);
      await axios.post("/api/mentor/sessions", {
        studentId: meetForm.studentId, notes: meetForm.title, actionItems: meetForm.agenda,
        status: "scheduled", meetingLink: meetForm.meetingLink || null, meetingDate: meetingDateTime.toISOString()
      });
      toast.success("Meeting scheduled!");
      setShowMeetForm(false); setMeetForm({ studentId: "", title: "", agenda: "", meetingLink: "", meetingDate: "", meetingTime: "" });
      const res = await axios.get("/api/mentor/sessions"); setSessions(res.data);
    } catch (err) { toast.error(err.response?.data?.message || "Failed to schedule"); }
    finally { setSubmittingMeet(false); }
  };

  const scheduledMeetings = sessions.filter(s => s.status === "scheduled");
  const pastSessions = sessions.filter(s => s.status !== "scheduled");

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Loading Mentor Portal...</p>
      </div>
    );
  }

  const tabs = [
    { id: "mentees", label: `My Mentees (${mentees.length})` },
    { id: "shortage", label: `Attendance Alerts (${attendanceShortages.length})` },
    { id: "defaulters", label: `Defaulters (${attendanceShortages.length})` },
    { id: "watchlist", label: `AI Watchlist` },
    { id: "leaves", label: `Leave Desk (${leaves.length})` },
    { id: "meetings", label: `Meetings (${scheduledMeetings.length})` },
    { id: "announcements", label: `Announcements` },
    { id: "sessions", label: `Advising Sessions (${pastSessions.length})` },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 rounded-3xl text-white shadow-xl border border-indigo-950/40">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3.5 bg-indigo-500/20 rounded-2xl border border-indigo-500/30">
              <Users className="w-8 h-8 text-indigo-300" />
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">Mentor Advising Portal</h2>
              <p className="text-sm text-indigo-200 mt-1">Manage attendance alerts, meetings, announcements and advising logs.</p>
            </div>
          </div>
          <div className="flex gap-3 text-xs shrink-0">
            <span className="px-3.5 py-1.5 bg-white/10 rounded-xl border border-white/10 font-bold">Students: {mentees.length}</span>
            <span className="px-3.5 py-1.5 bg-rose-500/20 text-rose-300 rounded-xl border border-rose-500/30 font-bold">Shortages: {attendanceShortages.length}</span>
          </div>
        </div>
      </div>

      <div className="flex border-b border-gray-200 dark:border-dark-border gap-1 overflow-x-auto">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              activeTab === tab.id ? "border-indigo-600 text-indigo-600 dark:text-indigo-400" : "border-transparent text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6 shadow-sm">

        {activeTab === "mentees" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Registered Course Students</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-dark-border text-gray-400 text-xs font-bold uppercase">
                    <th className="py-3 px-4">Roll No</th><th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Email</th><th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Attendance</th><th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-dark-border/40">
                  {mentees.map(mentee => (
                    <tr key={mentee.id} className="hover:bg-gray-50/50 dark:hover:bg-dark-bg/20">
                      <td className="py-3.5 px-4 font-mono font-bold text-xs text-indigo-600 dark:text-indigo-400">{mentee.rollNo || "N/A"}</td>
                      <td className="py-3.5 px-4 font-bold text-gray-900 dark:text-white">{mentee.name}</td>
                      <td className="py-3.5 px-4 text-gray-500 dark:text-gray-400">{mentee.email}</td>
                      <td className="py-3.5 px-4 font-semibold text-gray-500">{mentee.course}</td>
                      <td className="py-3.5 px-4 font-black text-sm">
                        <span className={mentee.attendancePercentage >= 75 ? "text-green-500" : "text-rose-500"}>{mentee.attendancePercentage}%</span>
                      </td>
                      <td className="py-3.5 px-4">
                        {mentee.attendancePercentage >= 75
                          ? <span className="px-2 py-0.5 bg-green-500/10 text-green-500 text-[10px] font-bold rounded-full uppercase">Eligible</span>
                          : <span className="px-2 py-0.5 bg-rose-500/10 text-rose-500 text-[10px] font-bold rounded-full uppercase">Shortage</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "shortage" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <AlertTriangle className="text-rose-500 w-5 h-5 animate-pulse" /> Students Below 75% Attendance
            </h3>
            {attendanceShortages.length === 0 ? (
              <div className="py-12 text-center text-gray-400"><CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" /><p className="text-sm font-semibold">No attendance shortages!</p></div>
            ) : (
              <div className="space-y-3">
                {attendanceShortages.map(student => (
                  <div key={student.id} className="border border-rose-100 dark:border-rose-950/20 bg-rose-50/10 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-gray-900 dark:text-white">{student.name}</h4>
                        <span className="text-[10px] font-mono bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded font-bold">Roll: {student.rollNo || "N/A"}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Email: {student.email} | Attendance: <strong className="text-rose-500">{student.attendancePercentage}%</strong></p>
                    </div>
                    <button onClick={() => handleSendWarning(student.id, student.email)}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5" /> Send Alert
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "defaulters" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/20">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl"><AlertTriangle className="text-red-600 w-5 h-5" /></div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">Defaulter Warning Console</h3>
                <p className="text-xs text-gray-400">Students below required 75% — requires immediate action</p>
              </div>
              <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-bold rounded-full">{attendanceShortages.length} At Risk</span>
            </div>
            {attendanceShortages.length === 0 ? (
              <div className="py-12 text-center text-gray-400"><CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" /><p className="text-sm font-semibold">No defaulters. All students meet attendance requirement.</p></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-dark-border">
                      <th className="p-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
                      <th className="p-3 text-xs font-semibold text-gray-500 uppercase">Roll No</th>
                      <th className="p-3 text-xs font-semibold text-gray-500 uppercase text-center">Attendance</th>
                      <th className="p-3 text-xs font-semibold text-gray-500 uppercase text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {attendanceShortages.map(d => (
                      <tr key={d.id} className="hover:bg-gray-50/70 transition-colors">
                        <td className="p-3">
                          <div className="font-semibold text-sm text-gray-900 dark:text-white">{d.name}</div>
                          <div className="text-[11px] text-gray-400">{d.email}</div>
                        </td>
                        <td className="p-3"><span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400">{d.rollNo || "N/A"}</span></td>
                        <td className="p-3 text-center">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-sm font-black text-rose-600">{d.attendancePercentage}%</span>
                            <div className="w-20 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div className="h-full rounded-full bg-rose-500" style={{ width: `${Math.min(100, d.attendancePercentage)}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex justify-end">
                            <button onClick={() => handleSendWarning(d.id, d.email)}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center gap-1.5 text-xs font-semibold">
                              <Mail className="w-3.5 h-3.5" /> Send Warning
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === "watchlist" && <AiIntelligenceWatchlist user={user} />}

        {activeTab === "leaves" && (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Leave Requests Awaiting Review</h3>
            {leaves.length === 0 ? (
              <div className="py-12 text-center text-gray-400"><CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-2" /><p className="text-sm font-semibold">No pending leave requests.</p></div>
            ) : (
              <div className="space-y-4">
                {leaves.map(leave => (
                  <div key={leave.id} className="border border-gray-100 dark:border-dark-border/40 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-900 dark:text-white">{leave.Student?.name}</h4>
                          <span className="text-[10px] bg-indigo-500/10 text-indigo-500 px-2 py-0.5 rounded uppercase font-bold">{leave.type} Leave</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Roll: {leave.Student?.rollNo} | Program: {leave.Student?.course}</p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => handleUpdateLeave(leave.id, "approved")} className="p-1.5 bg-green-500/10 hover:bg-green-500 text-green-600 hover:text-white rounded-lg transition-all" title="Approve"><Check className="w-4 h-4" /></button>
                        <button onClick={() => handleUpdateLeave(leave.id, "rejected")} className="p-1.5 bg-red-500/10 hover:bg-red-500 text-red-600 hover:text-white rounded-lg transition-all" title="Reject"><X className="w-4 h-4" /></button>
                      </div>
                    </div>
                    <div className="bg-gray-50 dark:bg-dark-bg/25 p-3.5 rounded-xl border border-gray-100 text-xs text-gray-600 dark:text-gray-300">
                      <div className="font-bold text-gray-400 uppercase tracking-wider mb-1">Reason:</div>{leave.reason}
                    </div>
                    <div className="flex flex-wrap items-center justify-between text-xs text-gray-400 gap-2">
                      <div className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /><span>{new Date(leave.startDate).toLocaleDateString()} to {new Date(leave.endDate).toLocaleDateString()}</span></div>
                      {leave.certificateUrl && <a href={leave.certificateUrl} target="_blank" rel="noreferrer" className="text-indigo-500 font-bold hover:underline flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> View Certificate</a>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "meetings" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><Video className="w-5 h-5 text-indigo-500" /> Mentee Meetings</h3>
                <p className="text-xs text-gray-500 mt-1">Schedule and manage meetings with your mentees.</p>
              </div>
              <button onClick={() => setShowMeetForm(!showMeetForm)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md">
                <Plus className="w-4 h-4" /> Schedule Meeting
              </button>
            </div>

            {showMeetForm && (
              <form onSubmit={handleScheduleMeeting} className="bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">New Meeting</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Select Mentee *</label>
                    <select value={meetForm.studentId} onChange={e => setMeetForm({ ...meetForm, studentId: e.target.value })} required
                      className="w-full px-4 py-2.5 bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-indigo-500">
                      <option value="">-- Choose mentee --</option>
                      {mentees.map(m => <option key={m.id} value={m.id}>{m.name} ({m.rollNo || "N/A"})</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Meeting Title *</label>
                    <input type="text" value={meetForm.title} onChange={e => setMeetForm({ ...meetForm, title: e.target.value })} placeholder="e.g. Academic Review Q3" required
                      className="w-full px-4 py-2.5 bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Date *</label>
                    <input type="date" value={meetForm.meetingDate} onChange={e => setMeetForm({ ...meetForm, meetingDate: e.target.value })} required
                      className="w-full px-4 py-2.5 bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Time *</label>
                    <input type="time" value={meetForm.meetingTime} onChange={e => setMeetForm({ ...meetForm, meetingTime: e.target.value })} required
                      className="w-full px-4 py-2.5 bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-indigo-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Meeting Link (Google Meet / Zoom)</label>
                    <input type="url" value={meetForm.meetingLink} onChange={e => setMeetForm({ ...meetForm, meetingLink: e.target.value })} placeholder="https://meet.google.com/xxx-xxxx-xxx"
                      className="w-full px-4 py-2.5 bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-indigo-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Agenda / Notes</label>
                    <textarea rows={2} value={meetForm.agenda} onChange={e => setMeetForm({ ...meetForm, agenda: e.target.value })} placeholder="Topics to discuss..."
                      className="w-full px-4 py-2.5 bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-indigo-500 resize-none" />
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowMeetForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-semibold">Cancel</button>
                  <button type="submit" disabled={submittingMeet} className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-xl text-sm font-bold shadow-md">
                    {submittingMeet ? "Scheduling..." : "Schedule Meeting"}
                  </button>
                </div>
              </form>
            )}

            <div>
              <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-500" /> Upcoming Meetings</h4>
              {scheduledMeetings.length === 0 ? (
                <div className="py-8 text-center text-gray-400 border border-dashed border-gray-200 dark:border-dark-border rounded-xl">
                  <Video className="w-8 h-8 text-gray-300 mx-auto mb-2" /><p className="text-xs">No meetings scheduled. Click "Schedule Meeting" above.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {scheduledMeetings.map(m => (
                    <div key={m.id} className="border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/30 dark:bg-indigo-900/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h5 className="font-bold text-gray-900 dark:text-white text-sm">{m.notes}</h5>
                        <p className="text-xs text-gray-500 mt-0.5">Mentee: <strong>{m.Student?.name}</strong> ({m.Student?.rollNo})</p>
                        {m.meetingDate && <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-0.5 flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(m.meetingDate).toLocaleString()}</p>}
                        {m.actionItems && <p className="text-xs text-gray-400 mt-0.5">Agenda: {m.actionItems}</p>}
                      </div>
                      {m.meetingLink && (
                        <a href={m.meetingLink} target="_blank" rel="noreferrer"
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap">
                          <Link2 className="w-3.5 h-3.5" /> Join Meeting
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "announcements" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2"><Megaphone className="w-5 h-5 text-amber-500" /> Post Announcements</h3>
                <p className="text-xs text-gray-500 mt-1">Send notices to your mentees or the college.</p>
              </div>
              <button onClick={() => setShowAnnForm(!showAnnForm)} className="px-4 py-2 bg-amber-50 hover:bg-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md">
                <Plus className="w-4 h-4" /> Post Notice
              </button>
            </div>

            {showAnnForm && (
              <form onSubmit={handlePostAnnouncement} className="bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-2xl p-5 space-y-4">
                <h4 className="font-bold text-gray-900 dark:text-white text-sm">New Announcement</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Title *</label>
                    <input type="text" value={annForm.title} onChange={e => setAnnForm({ ...annForm, title: e.target.value })} placeholder="Announcement title..." required
                      className="w-full px-4 py-2.5 bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-amber-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Content *</label>
                    <textarea rows={3} value={annForm.content} onChange={e => setAnnForm({ ...annForm, content: e.target.value })} placeholder="Write your announcement..." required
                      className="w-full px-4 py-2.5 bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-amber-500 resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Category</label>
                    <select value={annForm.category} onChange={e => setAnnForm({ ...annForm, category: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-amber-500">
                      {["General","Exam","Event","Holiday","Fee","Result"].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Target Audience</label>
                    <select value={annForm.targetRole} onChange={e => setAnnForm({ ...annForm, targetRole: e.target.value })}
                      className="w-full px-4 py-2.5 bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-amber-500">
                      <option value="all">Everyone</option>
                      <option value="student">Students Only</option>
                      <option value="teacher">Teachers Only</option>
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowAnnForm(false)} className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 font-semibold">Cancel</button>
                  <button type="submit" disabled={submittingAnn} className="px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400 text-white rounded-xl text-sm font-bold shadow-md">
                    {submittingAnn ? "Posting..." : "Post Announcement"}
                  </button>
                </div>
              </form>
            )}

            {announcements.length === 0 ? (
              <div className="py-8 text-center text-gray-400 border border-dashed border-gray-200 dark:border-dark-border rounded-xl">
                <Megaphone className="w-8 h-8 text-gray-300 mx-auto mb-2" /><p className="text-xs">No announcements yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {announcements.map(ann => (
                  <div key={ann.id} className="border border-gray-100 dark:border-dark-border/40 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm">{ann.title}</h4>
                          <span className="text-[10px] font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full">{ann.category}</span>
                          {ann.isPinned && <span className="text-[10px] font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">Pinned</span>}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300">{ann.content}</p>
                        <p className="text-[10px] text-gray-400 mt-1.5">By {ann.PostedBy?.name} · {new Date(ann.createdAt).toLocaleDateString()}</p>
                      </div>
                      {(ann.postedById === user?.id || user?.role === "admin") && (
                        <button onClick={() => handleDeleteAnnouncement(ann.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "sessions" && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5"><Plus className="w-5 h-5 text-indigo-500" /> Log Counseling Session</h3>
              <form onSubmit={handleAddSession} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Select Student</label>
                  <select value={selectedStudent} onChange={e => setSelectedStudent(e.target.value)} required
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-indigo-500">
                    <option value="">-- Choose student --</option>
                    {mentees.map(m => <option key={m.id} value={m.id}>{m.name} ({m.rollNo || "N/A"})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Discussion Notes</label>
                  <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Discussed academic performance..." required
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-indigo-500 resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Action Items</label>
                  <textarea rows={2} value={actionItems} onChange={e => setActionItems(e.target.value)} placeholder="E.g., Attend make-up classes..."
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-indigo-500 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Status</label>
                    <select value={sessionStatus} onChange={e => setSessionStatus(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-dark-border rounded-xl text-sm outline-none focus:border-indigo-500">
                      <option value="completed">Completed</option>
                      <option value="follow-up">Follow-Up Required</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button type="submit" disabled={submittingSession}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-xl text-xs font-bold tracking-wide shadow-md">
                      {submittingSession ? "Saving..." : "Save Advising Log"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
            <div className="lg:col-span-3 space-y-4 border-t lg:border-t-0 lg:border-l border-gray-150 dark:border-dark-border lg:pl-8 pt-6 lg:pt-0">
              <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-1.5"><FileText className="w-5 h-5 text-indigo-500" /> Past Counseling Logs</h3>
              {pastSessions.length === 0 ? (
                <div className="py-12 text-center text-gray-400"><MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" /><p className="text-xs">No counseling logs yet.</p></div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {pastSessions.map(sess => (
                    <div key={sess.id} className="border border-gray-100 dark:border-dark-border/40 rounded-xl p-4 bg-gray-50/30 space-y-3 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white">Student: {sess.Student?.name}</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">Roll: {sess.Student?.rollNo} | Date: {new Date(sess.sessionDate).toLocaleDateString()}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded font-extrabold uppercase text-[9px] ${sess.status === "completed" ? "bg-green-500/10 text-green-500" : "bg-amber-500/10 text-amber-500"}`}>{sess.status}</span>
                      </div>
                      <div className="text-gray-600 dark:text-gray-300 bg-white dark:bg-dark-bg p-2.5 rounded border border-gray-100 dark:border-dark-border/10 leading-relaxed">{sess.notes}</div>
                      {sess.actionItems && <div className="text-gray-500 pl-2 border-l-2 border-amber-400"><strong className="text-slate-800 dark:text-slate-200">Advice:</strong> {sess.actionItems}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default MentorDashboard;
