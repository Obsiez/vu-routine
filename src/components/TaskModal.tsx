import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, Plus, Trash2, X } from 'lucide-react';
import { COURSES } from '../data/defaultRoutine';
import { SubTask, TaskCategory, TaskItem, TaskPriority } from '../types';
import { useBodyScrollLock } from '../utils/useBodyScrollLock';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (task: Omit<TaskItem, 'id' | 'createdAt'>) => void;
  initialCourseCode?: string;
  editingTask?: TaskItem | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  initialCourseCode,
  editingTask
}) => {
  const [title, setTitle] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');
  const [courseCode, setCourseCode] = React.useState<string>('ECO 1101');
  const [dueDate, setDueDate] = React.useState<string>('');
  const [dueTime, setDueTime] = React.useState<string>('23:59');
  const [priority, setPriority] = React.useState<TaskPriority>('high');
  const [category, setCategory] = React.useState<TaskCategory>('assignment');
  const [reminderEnabled, setReminderEnabled] = React.useState<boolean>(true);
  const [subtasks, setSubtasks] = React.useState<SubTask[]>([]);
  const [newSubtaskText, setNewSubtaskText] = React.useState<string>('');

  useBodyScrollLock(isOpen);

  React.useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setCourseCode(editingTask.courseCode || 'ECO 1101');
      setDueDate(editingTask.dueDate || '');
      setDueTime(editingTask.dueTime || '23:59');
      setPriority(editingTask.priority || 'medium');
      setCategory(editingTask.category || 'assignment');
      setReminderEnabled(editingTask.reminderEnabled ?? true);
      setSubtasks(editingTask.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setCourseCode(initialCourseCode || 'ECO 1101');
      // Default due date to tomorrow
      const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
      setDueDate(tomorrow);
      setDueTime('23:59');
      setPriority('high');
      setCategory('assignment');
      setReminderEnabled(true);
      setSubtasks([]);
    }
  }, [isOpen, editingTask, initialCourseCode]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskText.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: 'sub-' + Date.now() + Math.random(), text: newSubtaskText.trim(), done: false }
    ]);
    setNewSubtaskText('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;

    onSaveTask({
      title: title.trim(),
      description: description.trim(),
      courseCode,
      dueDate,
      dueTime,
      priority,
      category,
      completed: editingTask ? editingTask.completed : false,
      subtasks,
      reminderEnabled
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
      <div className="bg-white dark:bg-[#141416] border border-slate-200 dark:border-white/10 p-5 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
          <h3 className="font-syne font-extrabold text-base uppercase text-slate-900 dark:text-white tracking-tight">
            {editingTask ? 'Edit Task / Assignment' : 'New Academic Task'}
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {/* Title */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Microeconomics Ch 3 Problem Set"
              className="w-full h-10 px-3 bg-slate-50 dark:bg-[#0a0a0b] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-200 focus:border-[#ff3e00] focus:outline-none"
            />
          </div>

          {/* Course & Category */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Course Subject
              </label>
              <select
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full h-10 px-3 bg-slate-50 dark:bg-[#0a0a0b] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-200 font-bold cursor-pointer focus:border-[#ff3e00] focus:outline-none"
              >
                {Object.keys(COURSES).map((code) => (
                  <option key={code} value={code}>
                    {code} - {COURSES[code].title}
                  </option>
                ))}
                <option value="General">General / Other</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full h-10 px-3 bg-slate-50 dark:bg-[#0a0a0b] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-200 cursor-pointer focus:border-[#ff3e00] focus:outline-none"
              >
                <option value="assignment">Assignment</option>
                <option value="quiz">Quiz / Class Test</option>
                <option value="exam">Midterm / Final Exam</option>
                <option value="presentation">Presentation</option>
                <option value="lab">Lab / Computer Practical</option>
                <option value="reading">Reading / Literature</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Due Date & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Due Date & Time *
              </label>
              <div className="flex gap-1.5">
                <input
                  type="date"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full h-10 px-3 bg-slate-50 dark:bg-[#0a0a0b] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-200 focus:border-[#ff3e00] focus:outline-none"
                />
                <input
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="w-28 h-10 px-3 bg-slate-50 dark:bg-[#0a0a0b] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-200 focus:border-[#ff3e00] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Priority
              </label>
              <div className="flex h-10 border border-slate-300 dark:border-white/10 p-0.5 bg-slate-50 dark:bg-[#0a0a0b]">
                <button
                  type="button"
                  onClick={() => setPriority('high')}
                  className={`flex-1 flex items-center justify-center gap-1 font-bold text-[10px] transition-all cursor-pointer ${
                    priority === 'high'
                      ? 'bg-rose-500 text-white font-extrabold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="High Priority"
                >
                  <AlertTriangle className="w-3 h-3" /> High
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('medium')}
                  className={`flex-1 flex items-center justify-center gap-1 font-bold text-[10px] transition-all cursor-pointer ${
                    priority === 'medium'
                      ? 'bg-amber-500 text-black font-extrabold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Medium Priority"
                >
                  <Clock className="w-3 h-3" /> Med
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('low')}
                  className={`flex-1 flex items-center justify-center gap-1 font-bold text-[10px] transition-all cursor-pointer ${
                    priority === 'low'
                      ? 'bg-emerald-600 text-white font-extrabold shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title="Low Priority"
                >
                  <CheckCircle2 className="w-3 h-3" /> Low
                </button>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Description / Instructions
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="Add details, room instructions, chapter numbers..."
              className="w-full p-2.5 bg-slate-50 dark:bg-[#0a0a0b] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-200 focus:border-[#ff3e00] focus:outline-none"
            />
          </div>

          {/* Subtasks Section */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
              Subtasks / Checkable Steps
            </label>
            <div className="flex gap-1.5 mb-2">
              <input
                type="text"
                value={newSubtaskText}
                onChange={(e) => setNewSubtaskText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSubtask();
                  }
                }}
                placeholder="Add subtask step (press enter)..."
                className="w-full h-10 px-3 bg-slate-50 dark:bg-[#0a0a0b] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-200 focus:border-[#ff3e00] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 bg-[#ff3e00] text-black font-bold border border-[#ff3e00] hover:bg-[#ff3e00]/90 cursor-pointer h-10"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {subtasks.length > 0 && (
              <div className="space-y-1 max-h-32 overflow-y-auto p-1.5 bg-slate-50 dark:bg-[#0a0a0b] border border-slate-200 dark:border-white/10">
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center justify-between gap-2 p-1.5 bg-white dark:bg-[#141416] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-200"
                  >
                    <span>{st.text}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(st.id)}
                      className="text-rose-500 hover:text-rose-600 dark:text-rose-400 cursor-pointer p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reminder Toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="reminderCheck"
              checked={reminderEnabled}
              onChange={(e) => setReminderEnabled(e.target.checked)}
              className="w-4 h-4 border border-slate-300 dark:border-white/10 cursor-pointer accent-[#ff3e00]"
            />
            <label
              htmlFor="reminderCheck"
              className="font-bold text-slate-700 dark:text-slate-300 cursor-pointer"
            >
              Enable sound chime reminder before due date
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 font-bold bg-slate-100 dark:bg-[#0a0a0b] text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-white/10 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 font-bold bg-[#ff3e00] text-black border border-[#ff3e00] hover:bg-[#e03700] cursor-pointer"
            >
              {editingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
