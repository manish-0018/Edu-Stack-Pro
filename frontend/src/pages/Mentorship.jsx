import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Users2, Plus, Calendar, Clock, Video } from 'lucide-react';
import { toast } from 'react-toastify';

const Mentorship = () => {
  const { user } = useAuth();
  const [availableSlots, setAvailableSlots] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [offeredSlots, setOfferedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  
  const [newSlot, setNewSlot] = useState({
    startTime: '',
    endTime: '',
    topic: '',
    meetingLink: ''
  });

  const fetchSlots = async () => {
    try {
      const [availRes, myRes, offeredRes] = await Promise.all([
        axios.get('/api/mentorship/available'),
        axios.get('/api/mentorship/me'),
        axios.get('/api/mentorship/offered')
      ]);
      const now = new Date();
      setAvailableSlots(availRes.data.filter(s => new Date(s.endTime) > now));
      setMySlots(myRes.data.filter(s => new Date(s.endTime) > now));
      setOfferedSlots(offeredRes.data.filter(s => new Date(s.endTime) > now));
    } catch (err) {
      toast.error('Failed to fetch mentorship slots');
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleBook = async (id) => {
    try {
      await axios.post(`/api/mentorship/book/${id}`);
      toast.success('Session booked!');
      fetchSlots();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book slot');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/mentorship/slot', newSlot);
      toast.success('Slot opened successfully');
      setShowAddForm(false);
      fetchSlots();
    } catch (err) {
      toast.error('Failed to create slot');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users2 className="w-6 h-6 text-primary-500" />
            Alumni & Senior Mentorship
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Book a 1-on-1 session with placed seniors.</p>
        </div>
        {user && user.role !== 'student' && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Open a Slot
          </button>
        )}
      </div>

      {showAddForm && (
        <form onSubmit={handleCreate} className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Topic / Expertise</label>
            <input required type="text" placeholder="e.g. Resume Review, React Interview Prep" className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-dark-border" value={newSlot.topic} onChange={e => setNewSlot({...newSlot, topic: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meeting Link</label>
            <input type="url" placeholder="Google Meet link" className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-dark-border" value={newSlot.meetingLink} onChange={e => setNewSlot({...newSlot, meetingLink: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Time</label>
            <input required type="datetime-local" className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-dark-border" value={newSlot.startTime} onChange={e => setNewSlot({...newSlot, startTime: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Time</label>
            <input required type="datetime-local" className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-dark-border" value={newSlot.endTime} onChange={e => setNewSlot({...newSlot, endTime: e.target.value})} />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="bg-primary-600 text-white px-4 py-2 rounded-lg">Create Slot</button>
          </div>
        </form>
      )}

      <div className={`grid grid-cols-1 ${user.role === 'student' ? 'lg:grid-cols-2' : ''} gap-6`}>
        {user && user.role === 'student' && (
          <>
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Available Slots</h2>
                
              </div>

              

              <div className="space-y-4">
                {availableSlots.length === 0 && <p className="text-gray-500">No slots available right now.</p>}
                {availableSlots.map(slot => (
                  <div key={slot.id} className="bg-white dark:bg-dark-card p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{slot.topic}</h3>
                        <p className="text-sm text-gray-500">Mentor: {slot.Mentor?.name} ({slot.Mentor?.course})</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Available</span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {new Date(slot.startTime).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {new Date(slot.startTime).toLocaleTimeString()}</span>
                    </div>
                    <button onClick={() => handleBook(slot.id)} className="w-full bg-primary-50 hover:bg-primary-100 text-primary-700 py-2 rounded-lg font-medium transition-colors">
                      Book Session
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-4">My Booked Sessions</h2>
              <div className="space-y-4">
                {mySlots.length === 0 && <p className="text-gray-500">You haven't booked any sessions yet.</p>}
                {mySlots.map(slot => (
                  <div key={slot.id} className="bg-white dark:bg-dark-card p-5 rounded-2xl shadow-sm border border-primary-100 dark:border-primary-900/30">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-lg">{slot.topic}</h3>
                        <p className="text-sm text-gray-500">Mentor: {slot.Mentor?.name}</p>
                      </div>
                      <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-xs font-bold">Booked</span>
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {new Date(slot.startTime).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {new Date(slot.startTime).toLocaleTimeString()}</span>
                    </div>
                    {slot.meetingLink && (
                      <a href={slot.meetingLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors">
                        <Video className="w-4 h-4" /> Join Meeting
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {user && user.role !== 'student' && (
          <div>
            <h2 className="text-xl font-bold mb-4">Slots I'm Mentoring</h2>
            <div className="space-y-4">
              {offeredSlots.length === 0 && <p className="text-gray-500">You haven't opened any slots yet.</p>}
              {offeredSlots.map(slot => (
                <div key={slot.id} className="bg-white dark:bg-dark-card p-5 rounded-2xl shadow-sm border border-purple-100 dark:border-purple-900/30">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{slot.topic}</h3>
                      <p className="text-sm text-gray-500">
                        {slot.status === 'booked' ? `Mentee: ${slot.Mentee?.name}` : 'Waiting for mentee...'}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      slot.status === 'booked' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {slot.status === 'booked' ? 'Booked' : 'Open'}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1"><Calendar className="w-4 h-4"/> {new Date(slot.startTime).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4"/> {new Date(slot.startTime).toLocaleTimeString()}</span>
                  </div>
                  {slot.meetingLink && slot.status === 'booked' && (
                    <a href={slot.meetingLink} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg font-medium transition-colors">
                      <Video className="w-4 h-4" /> Start Meeting
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Mentorship;
