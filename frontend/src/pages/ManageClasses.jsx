import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Trash2, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';


const ManageClasses = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newClass, setNewClass] = useState({ name: '', description: '' });

  const fetchClasses = async () => {
    try {
      const res = await axios.get('/api/classes');
      setClasses(res.data);
    } catch (err) {
      toast.error('Failed to fetch classes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/classes', newClass);
      setClasses([...classes, res.data]);
      setNewClass({ name: '', description: '' });
      toast.success('Class created');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create class');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete class "${name}"? This action is irreversible and will remove all associated subjects, students, and attendance logs.`)) {
      try {
        await axios.delete(`/api/classes/${id}`);
        setClasses(classes.filter((c) => c.id !== id));
        toast.success(`Class "${name}" has been successfully deleted.`);
      } catch (err) {
        toast.error('Failed to delete class');
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          {user.role === 'teacher' ? 'Class Directory' : 'Manage Classes'}
        </h1>
      </div>

      {user.role === 'admin' && (
        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
          <form onSubmit={handleCreate} className="flex gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Class Name</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-dark-border"
                value={newClass.name}
                onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium mb-1">Description (Optional)</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg dark:bg-dark-bg dark:border-dark-border"
                value={newClass.description}
                onChange={(e) => setNewClass({ ...newClass, description: e.target.value })}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 flex items-center gap-2"
            >
              <Plus className="w-5 h-5" /> Add Class
            </button>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-dark-border">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium">Description</th>
              {user.role === 'admin' && <th className="p-4 font-medium text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {classes.map((c) => (
              <tr key={c.id} className="border-b border-gray-50 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                <td className="p-4 font-medium">{c.name}</td>
                <td className="p-4 text-gray-500">{c.description || '-'}</td>
                {user.role === 'admin' && (
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(c.id, c.name)} className="text-red-500 hover:text-red-700 p-2">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageClasses;
