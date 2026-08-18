import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { ClipboardList, Upload, CheckCircle, Clock, AlertCircle, Plus, X, Star } from 'lucide-react';

const statusColor = {
  pending: 'bg-gray-100 text-gray-600',
  submitted: 'bg-blue-100 text-blue-700',
  graded: 'bg-green-100 text-green-700',
  late: 'bg-orange-100 text-orange-700',
};

const Assignments = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';
  const [assignments, setAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showSubmissions, setShowSubmissions] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [grading, setGrading] = useState({});
  const [form, setForm] = useState({ title: '', description: '', subjectId: '', dueDate: '', maxMarks: 100 });
  const [uploadMap, setUploadMap] = useState({});
  const [assignmentFile, setAssignmentFile] = useState(null);

  useEffect(() => { fetchAssignments(); fetchSubjects(); }, []);

  const fetchAssignments = async () => {
    try { const r = await axios.get('/api/assignments'); setAssignments(r.data); } catch {}
  };
  const fetchSubjects = async () => {
    try { const r = await axios.get('/api/subjects'); setSubjects(r.data); } catch {}
  };
  const fetchSubmissions = async (id) => {
    try { const r = await axios.get(`/api/assignments/${id}/submissions`); setSubmissions(r.data); } catch {}
  };

  const createAssignment = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', form.title);
    fd.append('description', form.description);
    fd.append('subjectId', form.subjectId);
    fd.append('dueDate', form.dueDate);
    fd.append('maxMarks', form.maxMarks);
    if (assignmentFile) {
      fd.append('file', assignmentFile);
    }

    try {
      await axios.post('/api/assignments', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Assignment created!');
      setShowCreate(false);
      setForm({ title: '', description: '', subjectId: '', dueDate: '', maxMarks: 100 });
      setAssignmentFile(null);
      fetchAssignments();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to create assignment'); }
  };

  const submitFile = async (assignmentId) => {
    const file = uploadMap[assignmentId];
    if (!file) return toast.error('Please select a file first');
    const fd = new FormData();
    fd.append('file', file);
    try {
      await axios.post(`/api/assignments/${assignmentId}/submit`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Submitted successfully!');
      fetchAssignments();
    } catch (err) { toast.error(err.response?.data?.message || 'Submit failed'); }
  };

  const gradeSubmission = async (subId) => {
    try {
      await axios.put(`/api/assignments/submissions/${subId}/grade`, grading[subId]);
      toast.success('Graded!');
      fetchSubmissions(showSubmissions);
    } catch (err) { toast.error('Grading failed'); }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="bg-white dark:bg-dark-card p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1 flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-violet-500" /> Assignments
          </h1>
          <p className="text-gray-500">Submit and manage course assignments.</p>
        </div>
        {(isTeacher || isAdmin) && (
          <button onClick={() => setShowCreate(true)} className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-violet-200 dark:shadow-none">
            <Plus className="w-5 h-5" /> Create Assignment
          </button>
        )}
      </div>

      {/* Assignment Cards */}
      <div className="grid gap-4">
        {assignments.length === 0 && (
          <div className="py-20 text-center text-gray-400 bg-white dark:bg-dark-card rounded-3xl border border-dashed border-gray-200">
            <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg">No assignments yet.</p>
          </div>
        )}
        {assignments.map(a => {
          const mySubmission = a.AssignmentSubmissions?.find(s => s.studentId === user?.id);
          const isOverdue = a.dueDate && new Date() > new Date(a.dueDate);
          return (
            <div key={a.id} className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border p-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-violet-50 text-violet-600 flex items-center justify-center shrink-0">
                      <ClipboardList className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">{a.title}</h3>
                      <p className="text-sm text-gray-500">{a.Subject?.name} • {a.Teacher?.name}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 ml-13">{a.description}</p>
                  {a.fileUrl && (
                    <div className="mb-3 ml-13">
                      <a href={a.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs text-violet-600 dark:text-violet-400 font-black hover:underline bg-violet-50 dark:bg-violet-950/20 px-3 py-1.5 rounded-lg border border-violet-100 dark:border-violet-900/30">
                        <Upload className="w-3.5 h-3.5 rotate-180" /> View Assignment PDF
                      </a>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-2 ml-13">
                    <span className="text-xs bg-violet-50 text-violet-700 px-3 py-1 rounded-full font-medium">Max: {a.maxMarks} marks</span>
                    {a.dueDate && (
                      <span className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 ${isOverdue ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                        <Clock className="w-3 h-3" /> Due: {format(new Date(a.dueDate), 'dd MMM, hh:mm a')}
                      </span>
                    )}
                    {mySubmission && (
                      <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColor[mySubmission.status]}`}>
                        {mySubmission.status.charAt(0).toUpperCase() + mySubmission.status.slice(1)}
                        {mySubmission.status === 'graded' && ` • ${mySubmission.grade}/${a.maxMarks}`}
                      </span>
                    )}
                  </div>
                  {mySubmission?.feedback && (
                    <div className="mt-3 ml-13 p-3 bg-green-50 rounded-xl border border-green-100 text-sm text-green-800">
                      <strong>Feedback:</strong> {mySubmission.feedback}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 min-w-[200px]">
                  {!isTeacher && !isAdmin && (
                    <>
                      <input type="file" id={`file-${a.id}`} accept=".pdf" className="hidden"
                        onChange={e => setUploadMap(p => ({ ...p, [a.id]: e.target.files[0] }))} />
                      <label htmlFor={`file-${a.id}`} className="cursor-pointer flex items-center gap-2 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-medium border border-gray-200 dark:border-slate-700 transition-all">
                        <Upload className="w-4 h-4" />
                        {uploadMap[a.id] ? uploadMap[a.id].name.substring(0, 15) + '...' : 'Choose Solution PDF'}
                      </label>
                      <button onClick={() => submitFile(a.id)} disabled={!uploadMap[a.id]}
                        className="px-4 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:opacity-40 text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Submit Solution
                      </button>
                    </>
                  )}
                  {(isTeacher || isAdmin) && (
                    <button onClick={() => { setShowSubmissions(a.id); fetchSubmissions(a.id); }}
                      className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-sm font-bold transition-all flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      View Submissions ({a.AssignmentSubmissions?.length || 0})
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl w-full max-w-lg shadow-2xl border dark:border-slate-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black">New Assignment</h2>
              <button onClick={() => setShowCreate(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <form onSubmit={createAssignment} className="space-y-4">
              <input required placeholder="Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-violet-500" />
              <textarea placeholder="Description (optional)" rows={3} value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-violet-500" />
              <select required value={form.subjectId} onChange={e => setForm({...form, subjectId: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700">
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Due Date</label>
                  <input type="datetime-local" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})}
                    className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">Max Marks</label>
                  <input type="number" value={form.maxMarks} onChange={e => setForm({...form, maxMarks: e.target.value})}
                    className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-violet-500" />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 mb-1 block">Attach Assignment PDF (Optional)</label>
                <input type="file" accept=".pdf" onChange={e => setAssignmentFile(e.target.files[0])}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100" />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-800">
                <button type="button" onClick={() => setShowCreate(false)} className="px-5 py-2 font-bold text-gray-500">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submissions Modal */}
      {showSubmissions && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl w-full max-w-2xl shadow-2xl border dark:border-slate-800 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black">Student Submissions</h2>
              <button onClick={() => { setShowSubmissions(null); setSubmissions([]); }}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            {submissions.length === 0 && <p className="text-gray-400 text-center py-8">No submissions yet.</p>}
            {submissions.map(sub => (
              <div key={sub.id} className="mb-4 p-4 border dark:border-slate-700 rounded-2xl">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{sub.Student?.name}</p>
                    <p className="text-xs text-gray-500">{sub.Student?.email}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-bold ${statusColor[sub.status]}`}>{sub.status}</span>
                </div>
                {sub.fileUrl && (
                  <a href={sub.fileUrl} target="_blank" rel="noreferrer"
                    className="text-sm text-violet-600 hover:underline flex items-center gap-1 mb-3">
                    <Upload className="w-4 h-4" /> View Submitted File
                  </a>
                )}
                <div className="grid grid-cols-2 gap-2">
                  <input type="number" placeholder="Grade" value={grading[sub.id]?.grade || ''}
                    onChange={e => setGrading(p => ({ ...p, [sub.id]: { ...p[sub.id], grade: e.target.value } }))}
                    className="px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm" />
                  <input type="text" placeholder="Feedback" value={grading[sub.id]?.feedback || ''}
                    onChange={e => setGrading(p => ({ ...p, [sub.id]: { ...p[sub.id], feedback: e.target.value } }))}
                    className="px-3 py-2 border rounded-xl dark:bg-slate-800 dark:border-slate-700 text-sm" />
                </div>
                <button onClick={() => gradeSubmission(sub.id)}
                  className="mt-2 w-full py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-xl flex items-center justify-center gap-2">
                  <Star className="w-4 h-4" /> Save Grade
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Assignments;
