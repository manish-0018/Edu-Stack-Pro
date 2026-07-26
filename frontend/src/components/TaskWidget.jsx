import { useState, useEffect } from 'react';
import axios from 'axios';
import { CheckSquare, Circle, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const TaskWidget = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/api/tasks');
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (id, currentStatus) => {
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      await axios.put(`/api/tasks/${id}`, { status: newStatus });
      setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  if (loading) return <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-64 rounded-2xl"></div>;

  const pendingTasks = tasks.filter(t => t.status === 'pending');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border mt-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CheckSquare className="text-indigo-600 w-5 h-5" />
          My To-Do List
        </h3>
        <span className="text-sm font-semibold text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          {pendingTasks.length} Pending
        </span>
      </div>

      <div className="space-y-4">
        {pendingTasks.length === 0 && completedTasks.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No tasks found. You're all caught up!</p>
        ) : null}

        {pendingTasks.map(task => {
          const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();
          return (
            <div key={task.id} className={`flex items-start gap-3 p-3 rounded-xl border transition-colors ${
              isOverdue ? 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800/30' : 'bg-gray-50 dark:bg-dark-bg border-gray-100 dark:border-dark-border hover:border-indigo-200'
            }`}>
              <button onClick={() => toggleTask(task.id, task.status)} className={`mt-0.5 transition-colors ${isOverdue ? 'text-red-400 hover:text-red-600' : 'text-gray-400 hover:text-indigo-600'}`}>
                <Circle className="w-5 h-5" />
              </button>
              <div className="flex-1">
                <p className={`font-medium text-sm ${isOverdue ? 'text-red-900 dark:text-red-200' : 'text-gray-900 dark:text-white'}`}>{task.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    isOverdue ? 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30' : 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                  }`}>
                    {task.type}
                  </span>
                  {task.dueDate && (
                    <span className={`text-[10px] flex items-center gap-1 ${isOverdue ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
                      {isOverdue ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      Due: {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {completedTasks.length > 0 && (
          <div className="pt-4 border-t border-gray-100 dark:border-dark-border">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Completed ({completedTasks.length})</p>
            <div className="space-y-2">
              {completedTasks.map(task => (
                <div key={task.id} className="flex items-start gap-3 p-3 opacity-60">
                  <button onClick={() => toggleTask(task.id, task.status)} className="mt-0.5 text-green-500 hover:text-gray-400 transition-colors">
                    <CheckCircle2 className="w-5 h-5" />
                  </button>
                  <div className="flex-1">
                    <p className="font-medium text-gray-500 line-through text-sm">{task.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskWidget;
