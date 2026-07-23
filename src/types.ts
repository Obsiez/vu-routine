export type DayOfWeek = 'Saturday' | 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';

export interface TimeSlot {
  id: number;
  label: string;
  startTime: string; // e.g. "09:00 AM"
  endTime: string;   // e.g. "10:00 AM"
  startMinutes: number; // minutes from midnight, e.g. 9*60 = 540
  endMinutes: number;   // minutes from midnight
}

export interface ClassSession {
  id: string;
  day: DayOfWeek;
  slotId: number;
  teacher: string;
  courseCode: string;
  courseTitle: string;
  section: string;
  room: string;
  notes?: string;
}

export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskCategory = 'assignment' | 'quiz' | 'exam' | 'presentation' | 'lab' | 'reading' | 'other';

export interface SubTask {
  id: string;
  text: string;
  done: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  courseCode: string;
  dueDate: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: TaskPriority;
  category: TaskCategory;
  completed: boolean;
  subtasks: SubTask[];
  reminderEnabled: boolean;
  createdAt: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'cancelled';

export interface AttendanceLog {
  id: string;
  date: string; // YYYY-MM-DD
  courseCode: string;
  slotId: number;
  status: AttendanceStatus;
  timestamp: number;
}

export interface ReminderSetting {
  leadMinutes: number; // 5, 10, 15, 30
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  vibrateEnabled: boolean;
}

export interface CourseInfo {
  code: string;
  title: string;
  teacher: string;
  defaultRoom: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  description?: string;
}

export interface FacultyMember {
  codeName: string;
  name: string;
  designation: string;
  department: string;
  courses: string[];
  primaryRoom: string;
  email?: string;
  phone?: string;
}
