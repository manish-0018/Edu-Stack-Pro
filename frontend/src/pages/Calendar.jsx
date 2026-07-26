import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Calendar as CalendarIcon, Trash2, Plus, Tent } from 'lucide-react';

const Calendar = () => {
  const { user } = useAuth();
  const [holidays, setHolidays] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newType, setNewType] = useState('holiday');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const res = await axios.get('/api/calendar');
      setHolidays(res.data);
    } catch (err) {
      toast.error('Failed to load calendar');
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newTitle || !newDate) return;
    setLoading(true);
    try {
      await axios.post('/api/calendar', { title: newTitle, date: newDate, type: newType });
      toast.success('Event added successfully');
      setNewTitle('');
      setNewDate('');
      fetchHolidays();
    } catch (err) {
      toast.error('Failed to add event');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/calendar/${id}`);
      toast.success('Event deleted');
      fetchHolidays();
    } catch (err) {
      toast.error('Failed to delete event');
    }
  };

  const getTypeStyle = (type) => {
    switch(type) {
      case 'holiday': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800';
      case 'exam': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800';
      case 'festival': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 border-purple-200 dark:border-purple-800';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
            <CalendarIcon className="w-8 h-8" />
            Academic Calendar
          </h1>
          <p className="text-indigo-100 text-lg">
            Track upcoming holidays, exams, and college festivals. Plan your schedule perfectly!
          </p>
        </div>
      </div>

      {user.role === 'admin' && (
        <form onSubmit={handleAdd} className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Event Title</label>
            <input 
              type="text" 
              required
              value={newTitle} 
              onChange={e => setNewTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg rounded-xl"
              placeholder="e.g. Diwali Break"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date</label>
            <input 
              type="date" 
              required
              value={newDate} 
              onChange={e => setNewDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
            <select 
              value={newType} 
              onChange={e => setNewType(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg rounded-xl"
            >
              <option value="holiday">Holiday</option>
              <option value="exam">Exam</option>
              <option value="festival">Festival</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button 
            disabled={loading}
            type="submit" 
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium flex items-center gap-2 h-10"
          >
            <Plus className="w-5 h-5" /> Add Event
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {holidays.length === 0 ? (
          <div className="col-span-full p-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-dark-card rounded-2xl border-2 border-dashed border-gray-200 dark:border-dark-border">
            No upcoming events found in the calendar.
          </div>
        ) : (
          holidays.map(holiday => (
            <div key={holiday.id} className={`p-6 rounded-2xl border ${getTypeStyle(holiday.type)} flex flex-col justify-between`}>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider mb-2 block opacity-80">
                  {holiday.type}
                </span>
                <h3 className="text-xl font-bold mb-2">{holiday.title}</h3>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 font-medium opacity-90">
                  <Tent className="w-5 h-5" />
                  {new Date(holiday.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
                {user.role === 'admin' && (
                  <button onClick={() => handleDelete(holiday.id)} className="p-2 hover:bg-black/10 rounded-lg transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Calendar;
