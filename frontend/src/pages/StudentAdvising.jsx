import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { User, Mail, Calendar, Clock, Video, MessageSquare, CheckSquare, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';

const StudentAdvising = () => {
  const [mentor, setMentor] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdvisingData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/mentor/student-view');
      setMentor(res.data.mentor);
      setSessions(res.data.sessions);
    } catch (err) {
      toast.error('Failed to load advising details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisingData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
        <p className="text-sm text-gray-500 font-medium">Loading Advising Details...</p>
      </div>
    );
  }

  const upcomingMeetings = sessions.filter(s => s.status === 'scheduled');
  const pastSessions = sessions.filter(s => s.status !== 'scheduled');

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
          <User className="w-8 h-8 text-indigo-500" /> Mentor & Advising Portal
        </h1>
        <p className="text-gray-500 mt-1.5">View your assigned mentor profile, join upcoming meetings, and view counseling feedback.</p>
      </div>

      {/* Mentor Profile Card */}
      <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        {mentor ? (
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-black text-2xl shrink-0">
              {mentor.name.charAt(0)}
            </div>
            <div>
              <span className="text-[10px] uppercase font-extrabold tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded">Your Academic Mentor</span>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-1">{mentor.name}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-gray-500 mt-1.5">
                <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {mentor.email}</span>
                <span>• Dept: <strong>{mentor.course}</strong></span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 text-amber-600 dark:text-amber-400 font-semibold text-sm">
            <User className="w-6 h-6" /> No academic mentor has been assigned to your department yet.
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Col / Span 2: Scheduled meetings & Past logs */}
        <div className="md:col-span-2 space-y-6">
          {/* Upcoming meetings */}
          <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b pb-3">
              <Calendar className="w-5 h-5 text-indigo-500" /> Upcoming Scheduled Meetings
            </h3>

            {upcomingMeetings.length === 0 ? (
              <div className="py-12 text-center text-gray-400 border border-dashed border-gray-100 dark:border-dark-border rounded-2xl">
                <Video className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs">No upcoming sessions scheduled by your mentor.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingMeetings.map(m => (
                  <div key={m.id} className="p-4 border border-indigo-50 dark:border-indigo-950/20 bg-indigo-50/20 dark:bg-indigo-950/5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm">{m.notes}</h4>
                      {m.meetingDate && (
                        <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-1 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5" /> {new Date(m.meetingDate).toLocaleString()}
                        </p>
                      )}
                      {m.actionItems && <p className="text-xs text-gray-500 mt-1.5">Agenda: {m.actionItems}</p>}
                    </div>
                    {m.meetingLink && (
                      <a
                        href={m.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <Video className="w-3.5 h-3.5" /> Join Meeting
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Past Counseling logs */}
          <div className="bg-white dark:bg-dark-card p-6 rounded-3xl border border-gray-100 dark:border-dark-border shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 border-b pb-3">
              <MessageSquare className="w-5 h-5 text-indigo-500" /> Advising & Counseling History
            </h3>

            {pastSessions.length === 0 ? (
              <div className="py-12 text-center text-gray-400 border border-dashed border-gray-100 dark:border-dark-border rounded-2xl">
                <MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-xs">No counseling logs posted yet.</p>
              </div>
            ) : (
              <div className="relative border-l-2 border-gray-100 dark:border-dark-border ml-3.5 pl-6 space-y-6 py-2">
                {pastSessions.map(s => (
                  <div key={s.id} className="relative">
                    <span className="absolute -left-[31px] top-1 w-4.5 h-4.5 rounded-full bg-indigo-500 border-4 border-white dark:border-dark-card" />
                    <div>
                      <span className="text-[10px] bg-gray-100 dark:bg-slate-800 text-gray-500 px-2 py-0.5 rounded font-bold">{new Date(s.sessionDate).toLocaleDateString()}</span>
                      <h4 className="font-extrabold text-gray-900 dark:text-white mt-1.5">{s.notes}</h4>
                      <p className="text-xs text-gray-400 mt-1 leading-relaxed">Mentor: {s.Mentor?.name}</p>
                      {s.actionItems && (
                        <div className="mt-3 p-3 bg-gray-50 dark:bg-dark-bg/30 border border-gray-100 dark:border-dark-border rounded-xl">
                          <strong className="text-[10px] uppercase tracking-wider text-gray-500 block mb-1">Feedback / Action Items:</strong>
                          <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{s.actionItems}</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Mentor instructions / checklists */}
        <div className="space-y-6">
          <div className="bg-indigo-50/50 dark:bg-indigo-950/10 p-6 rounded-3xl border border-indigo-50 dark:border-indigo-950/20 space-y-4">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
              <CheckSquare className="w-4 h-4 text-indigo-500" /> Student Guidelines
            </h4>
            <ul className="space-y-2.5 text-xs text-gray-600 dark:text-gray-400 leading-relaxed list-disc list-inside">
              <li>Attend meetings scheduled by your mentor to review attendance levels.</li>
              <li>Mentees with less than 75% attendance should request emergency advising.</li>
              <li>Read feedback logged by your mentor to review academic roadmaps.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAdvising;
