import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { DndContext, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CheckSquare, Clock, AlertCircle } from 'lucide-react';

const SortableTaskItem = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`bg-white dark:bg-dark-bg p-3 rounded-xl shadow-sm border border-gray-100 dark:border-dark-border cursor-grab active:cursor-grabbing hover:border-indigo-300 dark:hover:border-indigo-700 transition-colors ${
        isOverdue ? 'border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10' : ''
      }`}
    >
      <p className={`font-medium text-sm ${isOverdue ? 'text-red-900 dark:text-red-200' : 'text-gray-900 dark:text-white'}`}>{task.title}</p>
      <div className="flex justify-between items-center mt-2">
        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
          isOverdue ? 'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-400' : 'text-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
        }`}>
          {task.type}
        </span>
        {task.dueDate && (
          <span className={`text-[10px] flex items-center gap-1 ${isOverdue ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>
            {isOverdue ? <AlertCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
            {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
};

const KanbanColumn = ({ id, title, tasks }) => {
  return (
    <div className="flex flex-col bg-gray-50 dark:bg-slate-800/50 rounded-2xl p-4 w-full min-h-[300px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-700 dark:text-gray-300">{title}</h3>
        <span className="text-xs font-bold bg-gray-200 dark:bg-slate-700 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-full">{tasks.length}</span>
      </div>
      <SortableContext id={id} items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-3 flex-1">
          {tasks.map(task => (
            <SortableTaskItem key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

const KanbanBoard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor)
  );

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

  const updateTaskStatus = async (id, newStatus) => {
    try {
      await axios.put(`/api/tasks/${id}`, { status: newStatus });
    } catch (err) {
      toast.error('Failed to update task');
      // Revert if API fails
      fetchTasks();
    }
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id; // could be a column id or a task id
    
    // Find active task
    const activeTask = tasks.find(t => t.id === activeId);
    
    // Determine target column
    let targetStatus = overId;
    if (overId !== 'todo' && overId !== 'in_progress' && overId !== 'done') {
      const overTask = tasks.find(t => t.id === overId);
      if (overTask) {
        targetStatus = overTask.status;
      }
    }

    if (activeTask && activeTask.status !== targetStatus) {
      // Optimistic update
      setTasks(tasks.map(t => t.id === activeId ? { ...t, status: targetStatus } : t));
      updateTaskStatus(activeId, targetStatus);
    }
  };

  if (loading) return <div className="animate-pulse bg-gray-100 dark:bg-gray-800 h-64 rounded-2xl w-full"></div>;

  const columns = {
    todo: tasks.filter(t => t.status === 'todo' || t.status === 'pending' || !t.status), // fallback for old records
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    done: tasks.filter(t => t.status === 'done' || t.status === 'completed')
  };

  return (
    <div className="bg-white dark:bg-dark-card p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-dark-border mt-6 w-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CheckSquare className="text-indigo-600 w-5 h-5" />
          My Tasks Board
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <KanbanColumn id="todo" title="To Do" tasks={columns.todo} />
          <KanbanColumn id="in_progress" title="In Progress" tasks={columns.in_progress} />
          <KanbanColumn id="done" title="Done" tasks={columns.done} />
        </DndContext>
      </div>
    </div>
  );
};

export default KanbanBoard;
