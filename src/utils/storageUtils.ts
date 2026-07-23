import { DEFAULT_CLASS_SESSIONS, DEFAULT_TIME_SLOTS } from '../data/defaultRoutine';
import { AttendanceLog, ClassSession, ReminderSetting, TaskItem, TimeSlot } from '../types';

const STORAGE_KEYS = {
  SESSIONS: 'class_routine_sessions_v2',
  SLOTS: 'class_routine_slots_v1',
  TASKS: 'class_routine_tasks_v2',
  ATTENDANCE: 'class_routine_attendance_v1',
  REMINDERS: 'class_routine_reminders_v1',
  NOTES: 'class_routine_notes_v1'
};

const DEFAULT_REMINDER_SETTINGS: ReminderSetting = {
  leadMinutes: 10,
  soundEnabled: true,
  notificationsEnabled: true,
  vibrateEnabled: true
};

const INITIAL_SAMPLE_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Microeconomics I Problem Set 3',
    description: 'Solve problems on Consumer Choice & Market Equilibrium.',
    courseCode: 'ECO 1101',
    dueDate: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
    dueTime: '23:59',
    priority: 'high',
    category: 'assignment',
    completed: false,
    subtasks: [
      { id: 'sub-1', text: 'Plot demand & supply curves', done: true },
      { id: 'sub-2', text: 'Calculate price elasticity of demand', done: false }
    ],
    reminderEnabled: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-2',
    title: 'Macroeconomics I National Income Quiz Prep',
    description: 'Review GDP accounting formulas and multiplier effects.',
    courseCode: 'ECO 1102',
    dueDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0],
    dueTime: '10:00',
    priority: 'high',
    category: 'quiz',
    completed: false,
    subtasks: [
      { id: 'sub-3', text: 'Review lecture slides for Room 811', done: false }
    ],
    reminderEnabled: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-3',
    title: 'Agricultural Economics Essay Draft',
    description: 'Submit 1000-word essay on farming productivity and food security.',
    courseCode: 'ECO 1103',
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    dueTime: '18:00',
    priority: 'medium',
    category: 'assignment',
    completed: false,
    subtasks: [],
    reminderEnabled: true,
    createdAt: new Date().toISOString()
  },
  {
    id: 'task-4',
    title: 'Capitalism & Market Dynamics Report',
    description: 'Complete analysis on capital accumulation and global trade.',
    courseCode: 'ECO 1104',
    dueDate: new Date(Date.now() + 1 * 86400000).toISOString().split('T')[0],
    dueTime: '11:00',
    priority: 'medium',
    category: 'assignment',
    completed: true,
    subtasks: [],
    reminderEnabled: false,
    createdAt: new Date().toISOString()
  }
];

export function getStoredSessions(): ClassSession[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SESSIONS);
    return data ? JSON.parse(data) : DEFAULT_CLASS_SESSIONS;
  } catch {
    return DEFAULT_CLASS_SESSIONS;
  }
}

export function saveStoredSessions(sessions: ClassSession[]): void {
  localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sessions));
}

export function getStoredSlots(): TimeSlot[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SLOTS);
    return data ? JSON.parse(data) : DEFAULT_TIME_SLOTS;
  } catch {
    return DEFAULT_TIME_SLOTS;
  }
}

export function saveStoredSlots(slots: TimeSlot[]): void {
  localStorage.setItem(STORAGE_KEYS.SLOTS, JSON.stringify(slots));
}

export function getStoredTasks(): TaskItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : INITIAL_SAMPLE_TASKS;
  } catch {
    return INITIAL_SAMPLE_TASKS;
  }
}

export function saveStoredTasks(tasks: TaskItem[]): void {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

export function getStoredAttendance(): AttendanceLog[] {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveStoredAttendance(logs: AttendanceLog[]): void {
  localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(logs));
}

export function getStoredRemindersSetting(): ReminderSetting {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.REMINDERS);
    return data ? JSON.parse(data) : DEFAULT_REMINDER_SETTINGS;
  } catch {
    return DEFAULT_REMINDER_SETTINGS;
  }
}

export function saveStoredRemindersSetting(setting: ReminderSetting): void {
  localStorage.setItem(STORAGE_KEYS.REMINDERS, JSON.stringify(setting));
}

export function getStoredNotes(): Record<string, string> {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.NOTES);
    return data ? JSON.parse(data) : {};
  } catch {
    return {};
  }
}

export function saveStoredNotes(notes: Record<string, string>): void {
  localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
}
