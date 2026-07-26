import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { Calendar as CalendarIcon, Clock, MapPin, Plus, Trash2, User as UserIcon, Users } from 'lucide-react';

const Timetable = () => {
  const { user } = useAuth();
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const res = await axios.get('/api/timetable');
        setSlots(res.data);
      } catch (err) {
        console.error('Timetable fetch error:', err.response?.data || err.message);
        toast.error(`Failed to fetch timetable: ${err.response?.data?.message || err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, []);

  const getSlotsForDay = (day) => {
    return slots.filter(slot => slot.dayOfWeek === day).sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedH = h % 12 || 12;
    return `${formattedH}:${minutes} ${ampm}`;
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CalendarIcon className="w-6 h-6 text-primary-500" /> My Timetable
        </h1>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-6 gap-4">
        {daysOfWeek.map((day) => {
          const daySlots = getSlotsForDay(day);
          return (
            <div key={day} className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden flex flex-col h-full">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-3 text-center border-b border-gray-100 dark:border-dark-border">
                <h3 className="font-bold text-gray-900 dark:text-white uppercase tracking-wider text-xs">{day}</h3>
              </div>
              
              <div className="p-3 space-y-3 flex-1">
                {daySlots.length === 0 ? (
                  <div className="text-center text-xs text-gray-400 py-6">Free Day</div>
                ) : (
                  daySlots.map(slot => (
                    <div key={slot.id} className={`p-3 rounded-xl border relative group ${
                      slot.Subject?.type === 'lab' 
                        ? 'bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-800/30' 
                        : 'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/30'
                    }`}>
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold text-gray-500 bg-white/50 dark:bg-black/20 px-1.5 py-0.5 rounded">
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </span>
                      </div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">
                        {slot.Subject?.name || 'Unknown'}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">{slot.Subject?.code}</p>
                      
                      <div className="mt-3 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                        {user.role === 'student' ? (
                          <div className="flex items-center gap-1"><UserIcon className="w-3 h-3" /> {slot.Teacher?.name}</div>
                        ) : (
                          <div className="flex items-center gap-1"><Users className="w-3 h-3" /> {slot.Class?.name}</div>
                        )}
                      </div>
                      {slot.roomNumber && (
                        <div className="mt-1 flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                          <MapPin className="w-3 h-3" /> Room: {slot.roomNumber}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Timetable;
