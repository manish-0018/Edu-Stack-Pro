import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Trash2, Plus, Layers, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const COURSES = [
  'BTech CSE',
  'BCA',
  'BBA',
  'BTech Mechanical',
  'BSc Computer Science',
  'MBA'
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const SECTIONS = ['Section A', 'Section B', 'Section C', 'Section D', 'Section E', 'Section F'];

const ManageClasses = () => {
  const { user } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBranchFilter, setSelectedBranchFilter] = useState('ALL');

  const [formData, setFormData] = useState({
    course: user?.course || 'BTech CSE',
    year: '1st Year',
    section: 'Section A',
    customSection: '',
    name: '',
    description: ''
  });

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

  const activeCourse = user?.course || formData.course;
  const activeSection = formData.section === 'CUSTOM' ? formData.customSection : formData.section;
  const computedName = `${formData.year} - ${activeSection || 'Section'}`;

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!activeSection || !activeSection.trim()) {
      toast.error('Please specify a section name');
      return;
    }
    try {
      const payload = {
        course: activeCourse,
        year: formData.year,
        section: activeSection.trim(),
        name: formData.name.trim() || computedName,
        description: formData.description.trim()
      };
      const res = await axios.post('/api/classes', payload);
      setClasses([...classes, res.data]);
      setFormData(prev => ({
        ...prev,
        section: 'Section A',
        customSection: '',
        name: '',
        description: ''
      }));
      toast.success(`Section "${res.data.name}" created successfully!`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create class section');
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to permanently delete "${name}"? This will remove all associated subjects, students, and attendance records.`)) {
      try {
        await axios.delete(`/api/classes/${id}`);
        setClasses(classes.filter((c) => c.id !== id));
        toast.success(`Class "${name}" has been deleted.`);
      } catch (err) {
        toast.error('Failed to delete class');
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500">Loading class directory...</div>;

  const filteredClasses = classes.filter(c => {
    if (selectedBranchFilter === 'ALL') return true;
    return (c.course || '').toLowerCase() === selectedBranchFilter.toLowerCase();
  });

  // Unique branches from current classes
  const availableBranches = Array.from(new Set(classes.map(c => c.course).filter(Boolean)));

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-primary-600" />
            {user.role === 'teacher' ? 'Class & Section Directory' : 'Manage Classes & Sections'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Organize branches into multiple academic years with parallel sections (Section A, B, C...).
          </p>
        </div>
      </div>

      {user.role === 'admin' && (
        <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-100 dark:border-dark-border text-sm font-bold text-gray-700 dark:text-gray-300">
            <Plus className="w-4 h-4 text-primary-500" />
            Add New Section to Branch
          </div>

          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            {/* Branch / Course */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">
                Branch / Course
              </label>
              {user.course ? (
                <input
                  type="text"
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg bg-gray-50 dark:bg-dark-bg font-semibold cursor-not-allowed uppercase text-sm"
                  value={user.course}
                />
              ) : (
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-sm"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                >
                  {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              )}
            </div>

            {/* Academic Year */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">
                Academic Year
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-sm"
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              >
                {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            {/* Section */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">
                Section
              </label>
              <div className="flex gap-2">
                <select
                  required
                  className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-sm"
                  value={formData.section}
                  onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                >
                  {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  <option value="CUSTOM">Custom Section...</option>
                </select>
              </div>
              {formData.section === 'CUSTOM' && (
                <input
                  type="text"
                  required
                  placeholder="e.g. Section G or CSE-1"
                  className="w-full mt-2 px-3 py-1.5 border border-primary-400 rounded-lg dark:bg-dark-bg text-xs"
                  value={formData.customSection}
                  onChange={(e) => setFormData({ ...formData, customSection: e.target.value })}
                />
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold mb-1 text-gray-600 dark:text-gray-400">
                Description (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Room 304, Batch A"
                className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border rounded-lg dark:bg-dark-bg text-sm"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            {/* Submit */}
            <div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 flex items-center justify-center gap-2 h-10 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Add Section
              </button>
            </div>
          </form>

          {/* Quick Preview Badge */}
          <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex items-center gap-2">
            <span>Preview:</span>
            <span className="font-mono font-bold bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 px-2.5 py-0.5 rounded">
              {activeCourse} • {computedName}
            </span>
          </div>
        </div>
      )}

      {/* Branch Filter Tabs */}
      {!user.course && availableBranches.length > 1 && (
        <div className="flex gap-2 flex-wrap items-center">
          <span className="text-xs font-semibold text-gray-400">Filter Branch:</span>
          <button
            onClick={() => setSelectedBranchFilter('ALL')}
            className={`px-3 py-1 text-xs rounded-full font-semibold transition-colors ${
              selectedBranchFilter === 'ALL'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-300 hover:bg-gray-200'
            }`}
          >
            All Branches ({classes.length})
          </button>
          {availableBranches.map(b => (
            <button
              key={b}
              onClick={() => setSelectedBranchFilter(b)}
              className={`px-3 py-1 text-xs rounded-full font-semibold transition-colors ${
                selectedBranchFilter === b
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-dark-card text-gray-600 dark:text-gray-300 hover:bg-gray-200'
              }`}
            >
              {b} ({classes.filter(c => c.course === b).length})
            </button>
          ))}
        </div>
      )}

      {/* Classes / Sections Table */}
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 dark:bg-gray-800 border-b border-gray-100 dark:border-dark-border text-xs uppercase text-gray-500">
              <th className="p-4 font-semibold">Class / Section</th>
              <th className="p-4 font-semibold">Branch</th>
              <th className="p-4 font-semibold">Year</th>
              <th className="p-4 font-semibold">Section</th>
              <th className="p-4 font-semibold">Description</th>
              {user.role === 'admin' && <th className="p-4 font-semibold text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {filteredClasses.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="p-4 font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                  {c.name}
                </td>
                <td className="p-4">
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300">
                    {c.course || 'General'}
                  </span>
                </td>
                <td className="p-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                  {c.year || '-'}
                </td>
                <td className="p-4">
                  {c.section ? (
                    <span className="px-2 py-0.5 rounded-md text-xs font-mono font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      {c.section}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">-</span>
                  )}
                </td>
                <td className="p-4 text-sm text-gray-500">{c.description || '-'}</td>
                {user.role === 'admin' && (
                  <td className="p-4 text-right">
                    <button
                      onClick={() => handleDelete(c.id, c.name)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Delete Section"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredClasses.length === 0 && (
          <div className="p-12 text-center text-gray-400">
            <Layers className="w-12 h-12 mx-auto text-gray-300 mb-3" />
            <p className="font-semibold">No class sections found</p>
            <p className="text-xs text-gray-400 mt-1">Use the form above to add sections (e.g. Section A, Section B) to your branch.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageClasses;
