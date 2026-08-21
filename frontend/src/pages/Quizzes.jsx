import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { Brain, Plus, X, Clock, CheckCircle, Trophy, ChevronRight, BarChart2 } from 'lucide-react';

const Quizzes = () => {
  const { user } = useAuth();
  const isTeacher = user?.role === 'teacher';
  const isAdmin = user?.role === 'admin';
  const [quizzes, setQuizzes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [activeQuiz, setActiveQuiz] = useState(null); // quiz data for attempt
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [result, setResult] = useState(null);
  const [showResults, setShowResults] = useState(null);
  const [results, setResults] = useState([]);
  const timerRef = useRef(null);

  const [aiTopic, setAiTopic] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [activeAIQuiz, setActiveAIQuiz] = useState(null); // { topic, questions }
  const [aiAnswers, setAiAnswers] = useState({}); // { index: selectedIndex }
  const [aiResult, setAiResult] = useState(null); // { score, total }

  const handleGenerateAIQuiz = async (e) => {
    e.preventDefault();
    if (!aiTopic.trim()) return;
    setAiLoading(true);
    try {
      const res = await axios.post('/api/quizzes/generate-ai', { topic: aiTopic });
      setActiveAIQuiz(res.data);
      setAiAnswers({});
      setAiResult(null);
      toast.success('AI Practice Quiz Generated!');
    } catch (err) {
      toast.error('Failed to generate AI Quiz');
    } finally {
      setAiLoading(false);
    }
  };

  const submitAIQuiz = () => {
    if (!activeAIQuiz) return;
    let score = 0;
    activeAIQuiz.questions.forEach((q, qi) => {
      if (aiAnswers[qi] !== undefined && aiAnswers[qi] === q.correctAnswer) {
        score++;
      }
    });
    setAiResult({ score, total: activeAIQuiz.questions.length });
    setActiveAIQuiz(null);
  };

  const [form, setForm] = useState({ title: '', subjectId: '', timeLimitMinutes: 30, dueDate: '', questions: [{ question: '', options: ['', '', '', ''], correctAnswer: 0, marks: 1 }] });

  useEffect(() => { fetchQuizzes(); fetchSubjects(); }, []);

  const fetchQuizzes = async () => { try { const r = await axios.get('/api/quizzes'); setQuizzes(r.data); } catch {} };
  const fetchSubjects = async () => { try { const r = await axios.get('/api/subjects'); setSubjects(r.data); } catch {} };

  const addQuestion = () => setForm(p => ({ ...p, questions: [...p.questions, { question: '', options: ['', '', '', ''], correctAnswer: 0, marks: 1 }] }));
  const removeQuestion = (i) => setForm(p => ({ ...p, questions: p.questions.filter((_, idx) => idx !== i) }));
  const updateQ = (i, field, val) => setForm(p => { const qs = [...p.questions]; qs[i] = { ...qs[i], [field]: val }; return { ...p, questions: qs }; });
  const updateOption = (qi, oi, val) => setForm(p => { const qs = [...p.questions]; qs[qi].options[oi] = val; return { ...p, questions: qs }; });

  const createQuiz = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/quizzes', form);
      toast.success('Quiz created!');
      setShowCreate(false);
      fetchQuizzes();
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
  };

  const startAttempt = async (quizId) => {
    try {
      const r = await axios.get(`/api/quizzes/${quizId}/attempt`);
      setActiveQuiz(r.data);
      setAnswers({});
      setResult(null);
      setTimeLeft(r.data.timeLimitMinutes * 60);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) { clearInterval(timerRef.current); submitAttempt(quizId, {}, true); return 0; }
          return prev - 1;
        });
      }, 1000);
    } catch (err) { toast.error(err.response?.data?.message || 'Cannot start quiz'); }
  };

  const submitAttempt = async (quizId, currentAnswers, auto = false) => {
    clearInterval(timerRef.current);
    const ans = auto ? answers : currentAnswers;
    try {
      const r = await axios.post(`/api/quizzes/${quizId}/submit`, { answers: ans, timeTakenSeconds: activeQuiz ? activeQuiz.timeLimitMinutes * 60 - timeLeft : 0 });
      setResult(r.data);
      setActiveQuiz(null);
      fetchQuizzes();
      if (!auto) toast.success('Quiz submitted!');
    } catch (err) { toast.error(err.response?.data?.message || 'Submit failed'); }
  };

  const fetchResults = async (id) => {
    try { const r = await axios.get(`/api/quizzes/${id}/results`); setResults(r.data); setShowResults(id); } catch {}
  };

  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="bg-white dark:bg-dark-card p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-dark-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1 flex items-center gap-3">
            <Brain className="w-8 h-8 text-emerald-500" /> Quizzes & MCQ Tests
          </h1>
          <p className="text-gray-500">Timed auto-graded quizzes for every subject.</p>
        </div>
        {(isTeacher || isAdmin) && (
          <button onClick={() => setShowCreate(true)} className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-emerald-200 dark:shadow-none">
            <Plus className="w-5 h-5" /> Create Quiz
          </button>
        )}
      </div>

      {/* AI Quiz Generator Card */}
      {!isTeacher && !isAdmin && (
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 text-white p-6 rounded-3xl shadow-xl border border-indigo-700/50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="bg-indigo-700/50 border border-indigo-500/30 text-xs uppercase tracking-wider font-extrabold px-3 py-1.5 rounded-lg mb-2 inline-block">✨ Powered by AI</span>
              <h2 className="text-xl font-black mb-1">AI Practice Quiz Generator</h2>
              <p className="text-indigo-200 text-sm max-w-xl">Enter any subject or topic (e.g. "DBMS Normalization", "Python OOP") to generate a dynamic 5-question multiple choice practice test instantly.</p>
            </div>
            <form onSubmit={handleGenerateAIQuiz} className="flex gap-2 w-full md:w-auto shrink-0">
              <input
                required
                type="text"
                value={aiTopic}
                onChange={e => setAiTopic(e.target.value)}
                placeholder="Enter topic..."
                className="px-4 py-3 bg-white/10 hover:bg-white/15 border border-white/20 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-indigo-300 text-white min-w-[200px]"
              />
              <button
                type="submit"
                disabled={aiLoading}
                className="px-6 py-3 bg-white text-indigo-900 hover:bg-indigo-50 font-black rounded-xl text-sm shadow-md transition-all shrink-0 flex items-center gap-2 animate-pulse"
              >
                {aiLoading ? 'Generating...' : 'Generate Quiz'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* AI Result Banner */}
      {aiResult && (
        <div className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white p-8 rounded-3xl shadow-xl text-center">
          <Trophy className="w-12 h-12 mx-auto mb-3" />
          <h2 className="text-3xl font-black mb-1">AI Practice Quiz Complete!</h2>
          <p className="text-5xl font-black my-4">{aiResult.score} <span className="text-2xl font-normal opacity-75">/ {aiResult.total}</span></p>
          <p className="text-lg opacity-90">{Math.round((aiResult.score / aiResult.total) * 100)}% Score (Practice Mode)</p>
          <button onClick={() => setAiResult(null)} className="mt-5 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold">Close</button>
        </div>
      )}

      {/* Result Banner */}
      {result && (
        <div className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white p-8 rounded-3xl shadow-xl text-center">
          <Trophy className="w-12 h-12 mx-auto mb-3" />
          <h2 className="text-3xl font-black mb-1">Quiz Complete!</h2>
          <p className="text-5xl font-black my-4">{result.score} <span className="text-2xl font-normal opacity-75">/ {result.total}</span></p>
          <p className="text-lg opacity-90">{Math.round((result.score / result.total) * 100)}% Score</p>
          <button onClick={() => setResult(null)} className="mt-5 px-6 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-bold">Close</button>
        </div>
      )}

      {/* Quiz List */}
      <div className="grid gap-4">
        {quizzes.length === 0 && (
          <div className="py-20 text-center text-gray-400 bg-white dark:bg-dark-card rounded-3xl border border-dashed border-gray-200">
            <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p className="text-lg">No quizzes available yet.</p>
          </div>
        )}
        {quizzes.map(q => {
          const myAttempt = q.QuizAttempts?.find(a => a.studentId === user?.id);
          return (
            <div key={q.id} className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border p-6 flex flex-col md:flex-row justify-between gap-4 items-start">
              <div className="flex gap-4 items-start flex-1">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{q.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{q.Subject?.name} • By {q.Teacher?.name}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> {q.timeLimitMinutes} min</span>
                    <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">{q.totalMarks} marks</span>
                    {q.dueDate && <span className="text-xs bg-orange-50 text-orange-700 px-3 py-1 rounded-full font-medium">Due: {format(new Date(q.dueDate), 'dd MMM')}</span>}
                    {myAttempt && <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Score: {myAttempt.score}/{q.totalMarks}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                {!isTeacher && !isAdmin && !myAttempt && (
                  <button onClick={() => startAttempt(q.id)} className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center gap-2 text-sm">
                    Start <ChevronRight className="w-4 h-4" />
                  </button>
                )}
                {(isTeacher || isAdmin) && (
                  <button onClick={() => fetchResults(q.id)} className="px-5 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold flex items-center gap-2 text-sm">
                    <BarChart2 className="w-4 h-4" /> Results ({q.QuizAttempts?.length || 0})
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Quiz Attempt */}
      {activeQuiz && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border dark:border-slate-800">
            <div className="sticky top-0 bg-white dark:bg-slate-900 p-6 border-b dark:border-slate-800 flex justify-between items-center rounded-t-3xl">
              <h2 className="text-xl font-black">{activeQuiz.title}</h2>
              <div className={`text-xl font-black px-4 py-2 rounded-xl ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                ⏱ {mins}:{secs}
              </div>
            </div>
            <div className="p-6 space-y-6">
              {activeQuiz.QuizQuestions?.map((q, qi) => (
                <div key={q.id} className="p-5 bg-gray-50 dark:bg-slate-800 rounded-2xl">
                  <p className="font-bold text-gray-900 dark:text-white mb-4">Q{qi + 1}. {q.question} <span className="text-xs font-normal text-gray-400 ml-1">({q.marks} mark{q.marks !== 1 ? 's' : ''})</span></p>
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, oi) => (
                      <button key={oi} onClick={() => setAnswers(p => ({ ...p, [q.id]: oi }))}
                        className={`text-left px-4 py-3 rounded-xl border-2 transition-all font-medium text-sm ${answers[q.id] === oi ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400' : 'border-gray-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-700'}`}>
                        {String.fromCharCode(65 + oi)}. {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={() => submitAttempt(activeQuiz.id, answers)}
                className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-lg rounded-2xl flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" /> Submit Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Quiz Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl w-full max-w-2xl shadow-2xl border dark:border-slate-800 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black">Create Quiz</h2>
              <button onClick={() => setShowCreate(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            <form onSubmit={createQuiz} className="space-y-4">
              <input required placeholder="Quiz Title" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500" />
              <div className="grid grid-cols-2 gap-3">
                <select required value={form.subjectId} onChange={e => setForm({...form, subjectId: e.target.value})}
                  className="px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700">
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
                <input type="number" placeholder="Time Limit (minutes)" value={form.timeLimitMinutes} onChange={e => setForm({...form, timeLimitMinutes: e.target.value})}
                  className="px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500" />
              </div>
              <input type="datetime-local" value={form.dueDate} onChange={e => setForm({...form, dueDate: e.target.value})}
                className="w-full px-4 py-3 border rounded-xl dark:bg-slate-800 dark:border-slate-700 outline-none focus:ring-2 focus:ring-emerald-500" />

              <div className="border-t dark:border-slate-700 pt-4 space-y-4">
                <div className="flex justify-between items-center"><h3 className="font-black text-gray-900 dark:text-white">Questions</h3>
                  <button type="button" onClick={addQuestion} className="text-sm px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg font-bold hover:bg-emerald-100 flex items-center gap-1"><Plus className="w-4 h-4" />Add</button>
                </div>
                {form.questions.map((q, qi) => (
                  <div key={qi} className="p-4 bg-gray-50 dark:bg-slate-800 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-gray-600 dark:text-gray-400">Q{qi + 1}</span>
                      {form.questions.length > 1 && <button type="button" onClick={() => removeQuestion(qi)}><X className="w-4 h-4 text-red-400" /></button>}
                    </div>
                    <input placeholder="Question text" value={q.question} onChange={e => updateQ(qi, 'question', e.target.value)}
                      className="w-full px-3 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                    {q.options.map((opt, oi) => (
                      <div key={oi} className="flex gap-2 items-center">
                        <input type="radio" name={`correct-${qi}`} checked={q.correctAnswer === oi} onChange={() => updateQ(qi, 'correctAnswer', oi)} className="accent-emerald-500" />
                        <input placeholder={`Option ${String.fromCharCode(65 + oi)}`} value={opt} onChange={e => updateOption(qi, oi, e.target.value)}
                          className="flex-1 px-3 py-2 border rounded-xl dark:bg-slate-700 dark:border-slate-600 text-sm outline-none focus:ring-2 focus:ring-emerald-500" />
                      </div>
                    ))}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Marks:</span>
                      <input type="number" value={q.marks} min="1" onChange={e => updateQ(qi, 'marks', parseInt(e.target.value))}
                        className="w-16 px-2 py-1 border rounded-lg dark:bg-slate-700 dark:border-slate-600 text-sm text-center" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t dark:border-slate-800">
                <button type="button" onClick={() => setShowCreate(false)} className="px-5 py-2 font-bold text-gray-500">Cancel</button>
                <button type="submit" className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl">Create Quiz</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {showResults && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl w-full max-w-lg shadow-2xl border dark:border-slate-800 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black">Quiz Results</h2>
              <button onClick={() => setShowResults(null)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>
            {results.length === 0 && <p className="text-center text-gray-400 py-8">No attempts yet.</p>}
            {results.map((r, i) => (
              <div key={r.id} className="flex items-center justify-between p-4 mb-2 bg-gray-50 dark:bg-slate-800 rounded-2xl">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${i === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'}`}>#{i + 1}</div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{r.Student?.name}</p>
                    <p className="text-xs text-gray-500">{r.Student?.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-black text-lg text-emerald-600">{r.score}</p>
                  <p className="text-xs text-gray-400">{r.timeTakenSeconds ? `${Math.floor(r.timeTakenSeconds/60)}m ${r.timeTakenSeconds%60}s` : '-'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Active AI Quiz Attempt */}
      {activeAIQuiz && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border dark:border-slate-800">
            <div className="sticky top-0 bg-white dark:bg-slate-900 p-6 border-b dark:border-slate-800 flex justify-between items-center rounded-t-3xl">
              <div>
                <span className="text-xs uppercase bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 px-3.5 py-1.5 rounded-lg font-extrabold mb-1 inline-block">✨ AI Practice Mode</span>
                <h2 className="text-xl font-black text-gray-900 dark:text-white">{activeAIQuiz.topic}</h2>
              </div>
              <button onClick={() => setActiveAIQuiz(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-xl">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {activeAIQuiz.questions?.map((q, qi) => (
                <div key={qi} className="p-5 bg-gray-50 dark:bg-slate-800 rounded-2xl">
                  <p className="font-bold text-gray-900 dark:text-white mb-4">Q{qi + 1}. {q.question}</p>
                  <div className="grid grid-cols-1 gap-2">
                    {q.options.map((opt, oi) => (
                      <button key={oi} onClick={() => setAiAnswers(p => ({ ...p, [qi]: oi }))}
                        className={`text-left px-4 py-3 rounded-xl border-2 transition-all font-medium text-sm ${aiAnswers[qi] === oi ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-900/20 dark:text-indigo-400' : 'border-gray-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'}`}>
                        {String.fromCharCode(65 + oi)}. {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button onClick={submitAIQuiz}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-2xl flex items-center justify-center gap-2">
                <CheckCircle className="w-5 h-5" /> Submit Practice Quiz
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quizzes;
