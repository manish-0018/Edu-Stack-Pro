import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { Check, X, Plus } from 'lucide-react';

const LeaveRequests = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newRequest, setNewRequest] = useState({ startDate: '', endDate: '', reason: '', type: 'personal', certificateUrl: '' });

  const fetchRequests = async () => {
    try {
      const res = await axios.get('/api/leave');
      setRequests(res.data);
    } catch (err) {
      toast.error('Failed to fetch leave requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/leave', newRequest);
      setRequests([...requests, res.data]);
      setShowModal(false);
      setNewRequest({ startDate: '', endDate: '', reason: '', type: 'personal', certificateUrl: '' });
      toast.success('Leave request submitted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit request');
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/api/leave/${id}`, { status });
      setRequests(requests.map(r => r.id === id ? { ...r, status, approvedBy: { name: user.name } } : r));
      toast.success(`Request ${status}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leave Requests</h1>
        {user.role === 'student' && (
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2">
            <Plus className="w-5 h-5" /> New Request
          </button>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-dark-card p-6 rounded-2xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Apply for Leave</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Leave Type</label>
                <select
                  className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-dark-border"
                  value={newRequest.type}
                  onChange={(e) => setNewRequest({ ...newRequest, type: e.target.value })}
                >
                  <option value="personal">Personal Leave</option>
                  <option value="medical">Medical Leave</option>
                  <option value="duty">Duty Leave (DL)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Start Date</label>
                <input type="date" required className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-dark-border" value={newRequest.startDate} onChange={(e) => setNewRequest({ ...newRequest, startDate: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">End Date</label>
                <input type="date" required className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-dark-border" value={newRequest.endDate} onChange={(e) => setNewRequest({ ...newRequest, endDate: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Reason</label>
                <textarea required className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-dark-border" value={newRequest.reason} onChange={(e) => setNewRequest({ ...newRequest, reason: e.target.value })} />
              </div>
              {(newRequest.type === 'duty' || newRequest.type === 'medical') && (
                <div>
                  <label className="block text-sm font-medium mb-1">Certificate / Proof Drive URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg"
                    value={newRequest.certificateUrl}
                    onChange={(e) => setNewRequest({ ...newRequest, certificateUrl: e.target.value })}
                  />
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary-600 text-white rounded-lg">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-dark-border">
              {user.role !== 'student' && <th className="p-4 font-medium">Student</th>}
              <th className="p-4 font-medium">Type</th>
              <th className="p-4 font-medium">Dates</th>
              <th className="p-4 font-medium">Reason & Certificate</th>
              <th className="p-4 font-medium">Status</th>
              {user.role === 'mentor' && <th className="p-4 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                {user.role !== 'student' && <td className="p-4 font-medium">{r.Student?.name || '-'}</td>}
                <td className="p-4">
                  <span className={`px-2.5 py-0.5 rounded text-xs font-semibold capitalize ${
                    r.type === 'duty' ? 'bg-indigo-100 text-indigo-700' :
                    r.type === 'medical' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {r.type === 'duty' ? 'Duty Leave (DL)' : r.type}
                  </span>
                </td>
                <td className="p-4 text-sm text-gray-500 whitespace-nowrap">
                  {new Date(r.startDate).toLocaleDateString()} - {new Date(r.endDate).toLocaleDateString()}
                </td>
                <td className="p-4 text-sm">
                  <div>{r.reason}</div>
                  {r.certificateUrl && (
                    <a
                      href={r.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mt-1.5 bg-indigo-50 dark:bg-indigo-900/20 px-2 py-0.5 rounded"
                    >
                      📄 View Proof Certificate
                    </a>
                  )}
                </td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold capitalize ${
                    r.status === 'approved' ? 'bg-green-100 text-green-700' :
                    r.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {r.status}
                  </span>
                  {r.Approver && <div className="text-xs text-gray-400 mt-1">by {r.Approver.name}</div>}
                </td>
                {user.role === 'mentor' && (
                  <td className="p-4 text-right space-x-2">
                    {r.status === 'pending' && (
                      <>
                        <button onClick={() => handleUpdateStatus(r.id, 'approved')} className="text-green-500 hover:bg-green-50 p-2 rounded-lg" title="Approve">
                          <Check className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleUpdateStatus(r.id, 'rejected')} className="text-red-500 hover:bg-red-50 p-2 rounded-lg" title="Reject">
                          <X className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {requests.length === 0 && (
          <div className="p-8 text-center text-gray-500">No leave requests found.</div>
        )}
      </div>
    </div>
  );
};

export default LeaveRequests;
