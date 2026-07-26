import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Compass, Link as LinkIcon, Users, Plus, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Opportunities = () => {
  const { user } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newOpp, setNewOpp] = useState({ title: '', description: '', type: 'hackathon', link: '', deadline: '' });
  const [teamMessage, setTeamMessage] = useState('');
  const [activeReqOpp, setActiveReqOpp] = useState(null);

  const fetchOpps = async () => {
    try {
      const res = await axios.get('/api/opportunities');
      setOpportunities(res.data);
    } catch (err) {
      toast.error('Failed to fetch opportunities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpps();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/opportunities', newOpp);
      toast.success('Opportunity posted!');
      setShowAdd(false);
      fetchOpps();
    } catch (err) {
      toast.error('Failed to post opportunity');
    }
  };

  const handleRequestTeam = async (e, oppId) => {
    e.preventDefault();
    try {
      await axios.post(`/api/opportunities/${oppId}/team-request`, { message: teamMessage });
      toast.success('Request posted to find teammates!');
      setTeamMessage('');
      setActiveReqOpp(null);
    } catch (err) {
      toast.error('Failed to post request');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Compass className="w-6 h-6 text-indigo-500" />
            Opportunities & Hackathons
          </h1>
          <p className="text-gray-500 dark:text-gray-400">Discover internships, hackathons and find teammates.</p>
        </div>
        {user.role !== 'student' && (
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Post Opportunity
          </button>
        )}
      </div>

      {showAdd && (
        <form onSubmit={handleCreate} className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Title</label>
            <input required type="text" className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg" value={newOpp.title} onChange={e => setNewOpp({...newOpp, title: e.target.value})} />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea required rows="3" className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg" value={newOpp.description} onChange={e => setNewOpp({...newOpp, description: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Type</label>
            <select className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg" value={newOpp.type} onChange={e => setNewOpp({...newOpp, type: e.target.value})}>
              <option value="hackathon">Hackathon</option>
              <option value="internship">Internship</option>
              <option value="full-time">Full-Time Job</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">External Link</label>
            <input type="url" className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg" value={newOpp.link} onChange={e => setNewOpp({...newOpp, link: e.target.value})} />
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Post</button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {opportunities.map(opp => (
          <div key={opp.id} className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden flex flex-col">
            <div className="p-5 flex-grow">
              <div className="flex justify-between items-start mb-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${
                  opp.type === 'hackathon' ? 'bg-purple-100 text-purple-700' : 
                  opp.type === 'internship' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {opp.type}
                </span>
                <span className="text-xs text-gray-400">{new Date(opp.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="font-bold text-lg mb-2">{opp.title}</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">{opp.description}</p>
              <div className="text-xs text-gray-500 mt-auto">
                Posted by {opp.PostedBy?.name} ({opp.PostedBy?.course})
              </div>
            </div>
            <div className="border-t border-gray-100 dark:border-dark-border p-4 bg-gray-50 dark:bg-gray-800/50 flex gap-2">
              {opp.link && (
                <a href={opp.link} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 bg-white dark:bg-dark-bg border border-gray-200 dark:border-dark-border py-2 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800">
                  <LinkIcon className="w-4 h-4" /> Apply
                </a>
              )}
              {opp.type === 'hackathon' && (
                <button 
                  onClick={() => setActiveReqOpp(activeReqOpp === opp.id ? null : opp.id)}
                  className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 py-2 rounded-lg text-sm font-medium"
                >
                  <Users className="w-4 h-4" /> Teammates
                </button>
              )}
            </div>
            
            {activeReqOpp === opp.id && (
              <div className="p-4 border-t border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/50 dark:bg-indigo-900/10">
                <form onSubmit={(e) => handleRequestTeam(e, opp.id)} className="flex gap-2 mb-4">
                  <input 
                    type="text" 
                    placeholder="e.g. Looking for a frontend dev!" 
                    className="flex-1 px-3 py-1.5 text-sm border rounded-lg dark:bg-dark-bg"
                    value={teamMessage}
                    onChange={e => setTeamMessage(e.target.value)}
                    required
                  />
                  <button type="submit" className="bg-indigo-600 text-white px-3 rounded-lg text-sm"><MessageCircle className="w-4 h-4"/></button>
                </form>
                <div className="text-sm text-gray-500 text-center">
                  (Other teammates requests will appear here)
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Opportunities;
