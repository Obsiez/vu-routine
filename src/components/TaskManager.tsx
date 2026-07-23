import React from 'react';
import {
  AlertTriangle,
  Calendar,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Clock,
  Edit2,
  Filter,
  Plus,
  Search,
  Square,
  Trash2,
  Sparkles,
  X
} from 'lucide-react';
import { COURSES } from '../data/defaultRoutine';
import { SubTask, TaskItem } from '../types';

interface TaskManagerProps {
  tasks: TaskItem[];
  onToggleTaskComplete: (taskId: string) => void;
  onToggleSubtaskComplete: (taskId: string, subtaskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenNewTaskModal: (courseCode?: string) => void;
  onEditTask: (task: TaskItem) => void;
}

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  onToggleTaskComplete,
  onToggleSubtaskComplete,
  onDeleteTask,
  onOpenNewTaskModal,
  onEditTask
}) => {
  const [filterStatus, setFilterStatus] = React.useState<
    'all' | 'pending' | 'completed' | 'high' | 'today'
  >('pending');
  const [subjectFilter, setSubjectFilter] = React.useState<string>('ALL');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [expandedSubtasks, setExpandedSubtasks] = React.useState<Record<string, boolean>>({});

  const todayStr = new Date().toISOString().split('T')[0];

  // Stats
  const totalTasks = tasks.length;
  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const highPriorityCount = tasks.filter((t) => t.priority === 'high' && !t.completed).length;

  // Filtering
  const filteredTasks = tasks.filter((t) => {
    // Search
    if (
      searchQuery &&
      !t.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !t.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Subject Filter
    if (subjectFilter !== 'ALL' && t.courseCode !== subjectFilter) {
      return false;
    }

    // Status Filter
    if (filterStatus === 'pending') return !t.completed;
    if (filterStatus === 'completed') return t.completed;
    if (filterStatus === 'high') return t.priority === 'high' && !t.completed;
    if (filterStatus === 'today') return t.dueDate === todayStr;

    return true;
  });

  const toggleExpandSubtasks = (taskId: string) => {
    setExpandedSubtasks((prev) => ({ ...prev, [taskId]: !prev[taskId] }));
  };

  const getPriorityBadge = (p: string) => {
    switch (p) {
      case 'high':
        return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
      case 'medium':
        return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      default:
        return 'bg-[#ff3e00]/20 text-[#ff3e00] border-[#ff3e00]/40';
    }
  };

  const getDueBadge = (dueDate: string) => {
    if (!dueDate) return null;
    const isOverdue = dueDate < todayStr;
    const isToday = dueDate === todayStr;

    if (isOverdue) {
      return (
        <span className="bg-rose-500/20 text-rose-400 font-mono text-[10px] px-2 py-0.5 border border-rose-500/40 flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" /> Overdue ({dueDate})
        </span>
      );
    }
    if (isToday) {
      return (
        <span className="bg-amber-500/20 text-amber-400 font-mono text-[10px] px-2 py-0.5 border border-amber-500/40 flex items-center gap-1">
          <Clock className="w-3 h-3" /> Due Today
        </span>
      );
    }
    return (
      <span className="bg-[#0a0a0b] font-mono text-[10px] text-slate-400 px-2 py-0.5 border border-white/10">
        Due {dueDate}
      </span>
    );
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Overview Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono">
        <div className="bg-white dark:bg-[#141416] border border-slate-200 dark:border-white/10 p-3">
          <span className="text-[10px] font-bold uppercase text-slate-500">Total Tasks</span>
          <div className="text-2xl font-syne font-black text-slate-900 dark:text-white">{totalTasks}</div>
        </div>
        <div className="bg-white dark:bg-[#141416] border border-slate-200 dark:border-white/10 p-3">
          <span className="text-[10px] font-bold uppercase text-amber-500 dark:text-amber-400">Pending</span>
          <div className="text-2xl font-syne font-black text-amber-500 dark:text-amber-400">{pendingCount}</div>
        </div>
        <div className="bg-white dark:bg-[#141416] border border-slate-200 dark:border-white/10 p-3">
          <span className="text-[10px] font-bold uppercase text-[#ff3e00]">Completed</span>
          <div className="text-2xl font-syne font-black text-[#ff3e00]">{completedCount}</div>
        </div>
        <div className="bg-white dark:bg-[#141416] border border-slate-200 dark:border-white/10 p-3">
          <span className="text-[10px] font-bold uppercase text-rose-500 dark:text-rose-400">High Priority</span>
          <div className="text-2xl font-syne font-black text-rose-500 dark:text-rose-400">{highPriorityCount}</div>
        </div>
      </div>

      {/* Control Bar: Search, Filters, New Button */}
      <div className="bg-white dark:bg-[#141416] border border-slate-200 dark:border-white/10 p-3.5 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search assignments, quizzes..."
              className="w-full pl-9 pr-8 py-1.5 bg-slate-50 dark:bg-[#0a0a0b] text-xs font-mono border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-200 focus:border-[#ff3e00] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Add Task Button */}
          <button
            onClick={() => onOpenNewTaskModal()}
            className="text-xs font-mono font-extrabold bg-[#ff3e00] text-black px-3.5 py-2 border border-[#ff3e00] hover:bg-[#ff3e00]/90 cursor-pointer flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Task
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar">
          {[
            { id: 'pending', label: 'Pending' },
            { id: 'all', label: 'All Tasks' },
            { id: 'high', label: 'High Priority' },
            { id: 'today', label: 'Due Today' },
            { id: 'completed', label: 'Completed' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id as any)}
              className={`text-xs font-mono font-bold px-3 py-1 border transition-all cursor-pointer whitespace-nowrap ${
                filterStatus === f.id
                  ? 'bg-[#ff3e00] text-black border-[#ff3e00] font-extrabold'
                  : 'bg-slate-100 dark:bg-[#232326] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Subject Filter Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 no-scrollbar text-xs font-mono">
          <span className="font-bold text-slate-500">Subject:</span>
          <button
            onClick={() => setSubjectFilter('ALL')}
            className={`px-2.5 py-0.5 border ${
              subjectFilter === 'ALL'
                ? 'bg-[#ff3e00]/20 text-[#ff3e00] border-[#ff3e00]/40 font-bold'
                : 'bg-slate-100 dark:bg-[#232326] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            All
          </button>
          {Object.keys(COURSES).map((code) => (
            <button
              key={code}
              onClick={() => setSubjectFilter(code)}
              className={`px-2.5 py-0.5 border ${
                subjectFilter === code
                  ? 'bg-[#ff3e00]/20 text-[#ff3e00] border-[#ff3e00]/40 font-bold'
                  : 'bg-slate-100 dark:bg-[#232326] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Task Cards List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="bg-white dark:bg-[#141416] border border-slate-200 dark:border-white/10 p-8 text-center space-y-2">
            <CheckSquare className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto" />
            <h3 className="font-syne font-bold text-sm uppercase text-slate-800 dark:text-slate-300">
              No Tasks Found
            </h3>
            <p className="text-xs font-mono text-slate-500">
              {searchQuery
                ? 'No matching tasks found for your search term.'
                : 'Great job! No pending tasks in this filter view.'}
            </p>
            <button
              onClick={() => onOpenNewTaskModal()}
              className="mt-2 text-xs font-mono font-bold bg-[#ff3e00]/20 text-[#ff3e00] px-3 py-1.5 border border-[#ff3e00]/40 hover:bg-[#ff3e00]/30 cursor-pointer"
            >
              Create New Task
            </button>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isSubtasksExpanded = !!expandedSubtasks[task.id];
            const completedSubtasksCount = task.subtasks.filter((s) => s.done).length;

            return (
              <div
                key={task.id}
                className={`p-3.5 border transition-all ${
                  task.completed
                    ? 'bg-slate-100 dark:bg-[#0a0a0b] border-slate-200 dark:border-white/10 opacity-60 dark:opacity-50'
                    : 'bg-white dark:bg-[#141416] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left: Checkbox & Info */}
                  <div className="flex items-start gap-2.5 flex-1 min-w-0">
                    <button
                      onClick={() => onToggleTaskComplete(task.id)}
                      className="mt-0.5 cursor-pointer text-slate-400 hover:text-[#ff3e00] transition-colors"
                    >
                      {task.completed ? (
                        <CheckSquare className="w-5 h-5 text-[#ff3e00]" />
                      ) : (
                        <Square className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                      )}
                    </button>

                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Course Code */}
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-[#ff3e00]/10 text-[#ff3e00] border border-[#ff3e00]/20">
                          {task.courseCode}
                        </span>

                        {/* Category */}
                        <span className="text-[10px] font-mono uppercase font-bold text-slate-500">
                          [{task.category}]
                        </span>

                        {/* Priority Badge */}
                        <span
                          className={`text-[9px] font-mono uppercase font-bold px-1.5 py-0.2 border ${getPriorityBadge(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>

                        {/* Due Badge */}
                        {getDueBadge(task.dueDate)}
                      </div>

                      {/* Title */}
                      <h4
                        className={`font-syne font-bold text-sm text-slate-900 dark:text-white leading-tight ${
                          task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                        }`}
                      >
                        {task.title}
                      </h4>

                      {/* Description */}
                      {task.description && (
                        <p className="text-xs font-mono text-slate-600 dark:text-slate-400 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* Subtasks Progress */}
                      {task.subtasks.length > 0 && (
                        <div className="pt-1">
                          <button
                            onClick={() => toggleExpandSubtasks(task.id)}
                            className="text-[11px] font-mono font-bold text-[#ff3e00] flex items-center gap-1 hover:underline cursor-pointer"
                          >
                            <span>
                              Subtasks ({completedSubtasksCount}/{task.subtasks.length})
                            </span>
                            {isSubtasksExpanded ? (
                              <ChevronUp className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {isSubtasksExpanded && (
                            <div className="mt-1.5 space-y-1 pl-2 border-l border-[#ff3e00]/40">
                              {task.subtasks.map((st) => (
                                <div
                                  key={st.id}
                                  onClick={() => onToggleSubtaskComplete(task.id, st.id)}
                                  className="flex items-center gap-2 text-xs font-mono text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-[#232326] p-1"
                                >
                                  {st.done ? (
                                    <CheckSquare className="w-3.5 h-3.5 text-[#ff3e00]" />
                                  ) : (
                                    <Square className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                                  )}
                                  <span className={st.done ? 'line-through text-slate-400 dark:text-slate-500' : ''}>
                                    {st.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onEditTask(task)}
                      className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#232326] border border-slate-200 dark:border-white/10 cursor-pointer"
                      title="Edit task"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 border border-slate-200 dark:border-white/10 cursor-pointer"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
