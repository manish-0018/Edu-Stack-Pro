import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Save, Loader2 } from 'lucide-react';

const ManageMarks = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [students, setStudents] = useState([]);
  const [marksState, setMarksState] = useState({});
  const [loading, setLoading] = useState(true);
  const [studentsLoading, setStudentsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Derive isLab from current subjects list and selected id
  const selectedSubject = useMemo(
    () => subjects.find(s => s.id === selectedSubjectId),
    [subjects, selectedSubjectId]
  );
  const isLab = selectedSubject?.type === 'lab';

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get('/api/subjects');
        setSubjects(res.data);
      } catch (err) {
        toast.error('Failed to load assigned subjects');
      } finally {
        setLoading(false);
      }
    };
    fetchSubjects();
  }, []);

  const handleSubjectChange = async (subjectId) => {
    setSelectedSubjectId(subjectId);
    setStudents([]);
    setMarksState({});
    if (!subjectId) return;

    setStudentsLoading(true);
    try {
      const subject = subjects.find(s => s.id === subjectId);
      const classId = subject?.classId;

      const [studentRes, marksRes] = await Promise.all([
        axios.get(`/api/users?role=student&classId=${classId}`),
        axios.get('/api/marks')
      ]);

      const existingMarks = marksRes.data.filter(m => m.subjectId === subjectId);
      const marksMap = {};
      existingMarks.forEach(m => {
        marksMap[m.studentId] = {
          midSem: m.midSem !== null ? m.midSem : '',
          assignment: m.assignment !== null ? m.assignment : '',
          quiz: m.quiz !== null ? m.quiz : ''
        };
      });

      const initialMarksState = {};
      studentRes.data.forEach(s => {
        initialMarksState[s.id] = marksMap[s.id] || { midSem: '', assignment: '', quiz: '' };
      });

      setStudents(studentRes.data);
      setMarksState(initialMarksState);
    } catch (err) {
      toast.error('Failed to load students or marks');
    } finally {
      setStudentsLoading(false);
    }
  };

  const handleInputChange = (studentId, field, value, currentIsLab) => {
    const num = value === '' ? '' : parseInt(value, 10);
    if (num !== '' && !isNaN(num)) {
      if (currentIsLab) {
        if (field === 'midSem') return; // No midSem for labs
        if (field === 'assignment' && (num < 0 || num > 40)) return;
        if (field === 'quiz' && (num < 0 || num > 10)) return;
      } else {
        if (field === 'midSem' && (num < 0 || num > 20)) return;
        if (field === 'assignment' && (num < 0 || num > 20)) return;
        if (field === 'quiz' && (num < 0 || num > 10)) return;
      }
    }

    setMarksState(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value === '' ? '' : num
      }
    }));
  };

  const handleSave = async () => {
    if (!selectedSubjectId) return;
    setSaving(true);

    const payload = {
      subjectId: selectedSubjectId,
      marks: Object.keys(marksState).map(studentId => {
        const item = marksState[studentId];
        return {
          studentId,
          midSem: isLab ? null : (item.midSem === '' ? null : Number(item.midSem)),
          assignment: item.assignment === '' ? null : Number(item.assignment),
          quiz: item.quiz === '' ? null : Number(item.quiz)
        };
      })
    };

    try {
      await axios.post('/api/marks', payload);
      toast.success('Marks saved successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save marks');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px] gap-3 text-gray-500">
      <Loader2 className="w-6 h-6 animate-spin" />
      Loading assigned subjects...
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Continuous Assessment Entry</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Record and update student internal marks for all subjects</p>
      </div>

      {/* Subject Selector */}
      <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
        <div className="max-w-lg flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Subject</label>
            <select
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-dark-bg dark:text-white"
              value={selectedSubjectId}
              onChange={(e) => handleSubjectChange(e.target.value)}
            >
              <option value="">Choose a subject...</option>
              {subjects.map(sub => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.code}) — {sub.Class?.name} [{sub.type === 'lab' ? '🔬 Lab' : '📖 Theory'}]
                </option>
              ))}
            </select>
          </div>
          {selectedSubject && (
            <div className={`px-3 py-2 rounded-lg text-xs font-bold ${isLab ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
              {isLab ? '🔬 Lab/Practical' : '📖 Theory'}
            </div>
          )}
        </div>

        {/* Marks structure hint */}
        {selectedSubject && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-dark-bg rounded-lg border border-gray-100 dark:border-dark-border text-xs text-gray-500 dark:text-gray-400 flex gap-4 flex-wrap">
            {isLab ? (
              <>
                <span>🔬 <strong>Lab Marks Structure:</strong></span>
                <span>Quiz: <strong>Max 10</strong></span>
                <span>Practical Work / Assignment: <strong>Max 40</strong></span>
                <span>Total Internals: <strong>Max 50</strong></span>
              </>
            ) : (
              <>
                <span>📖 <strong>Theory Marks Structure:</strong></span>
                <span>Mid-Sem: <strong>Max 20</strong></span>
                <span>Quiz: <strong>Max 10</strong></span>
                <span>Assignment: <strong>Max 20</strong></span>
                <span>Total Internals: <strong>Max 50</strong></span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Marks Table */}
      {selectedSubjectId && (
        <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
          {studentsLoading ? (
            <div className="flex flex-col h-48 items-center justify-center gap-2 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span>Loading student list...</span>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-dark-border">
                      <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Student Name</th>
                      <th className="p-4 font-semibold text-gray-600 dark:text-gray-400">Email</th>
                      {!isLab && (
                        <th className="p-4 font-semibold text-gray-600 dark:text-gray-400 text-center w-36">Mid-Sem <span className="text-gray-400 font-normal">(Max 20)</span></th>
                      )}
                      <th className="p-4 font-semibold text-gray-600 dark:text-gray-400 text-center w-36">Quiz <span className="text-gray-400 font-normal">(Max 10)</span></th>
                      <th className="p-4 font-semibold text-gray-600 dark:text-gray-400 text-center w-36">
                        {isLab ? 'Practical Work' : 'Assignment'} <span className="text-gray-400 font-normal">(Max {isLab ? 40 : 20})</span>
                      </th>
                      <th className="p-4 font-semibold text-gray-600 dark:text-gray-400 text-center w-32">Total <span className="text-gray-400 font-normal">/50</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => {
                      const m = marksState[student.id] || { midSem: '', assignment: '', quiz: '' };
                      const midVal = isLab ? 0 : (Number(m.midSem) || 0);
                      const quizVal = Number(m.quiz) || 0;
                      const assVal = Number(m.assignment) || 0;
                      const totalScore = midVal + quizVal + assVal;
                      const hasAny = m.quiz !== '' || m.assignment !== '' || (!isLab && m.midSem !== '');

                      return (
                        <tr key={student.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50/50 transition-colors">
                          <td className="p-4 font-medium text-gray-900 dark:text-white">{student.name}</td>
                          <td className="p-4 text-gray-500 text-xs">{student.email}</td>
                          {!isLab && (
                            <td className="p-4 text-center">
                              <input
                                type="number"
                                min="0"
                                max="20"
                                placeholder="—"
                                className="w-20 px-2 py-1.5 text-center border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-bg font-medium"
                                value={m.midSem}
                                onChange={(e) => handleInputChange(student.id, 'midSem', e.target.value, isLab)}
                              />
                            </td>
                          )}
                          <td className="p-4 text-center">
                            <input
                              type="number"
                              min="0"
                              max="10"
                              placeholder="—"
                              className="w-20 px-2 py-1.5 text-center border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-bg font-medium"
                              value={m.quiz}
                              onChange={(e) => handleInputChange(student.id, 'quiz', e.target.value, isLab)}
                            />
                          </td>
                          <td className="p-4 text-center">
                            <input
                              type="number"
                              min="0"
                              max={isLab ? 40 : 20}
                              placeholder="—"
                              className="w-20 px-2 py-1.5 text-center border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-primary-500 dark:bg-dark-bg font-medium"
                              value={m.assignment}
                              onChange={(e) => handleInputChange(student.id, 'assignment', e.target.value, isLab)}
                            />
                          </td>
                          <td className="p-4 text-center">
                            <span className={`font-bold text-base ${hasAny ? (totalScore >= 25 ? 'text-green-600' : 'text-amber-600') : 'text-gray-400'}`}>
                              {hasAny ? totalScore : '—'}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {students.length === 0 && (
                      <tr>
                        <td colSpan="6" className="p-8 text-center text-gray-400">
                          No students enrolled in this class.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {students.length > 0 && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800 flex justify-end">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm disabled:opacity-50"
                  >
                    {saving ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
                    ) : (
                      <><Save className="w-5 h-5" /> Save All Marks</>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageMarks;
