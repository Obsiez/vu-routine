import { ClassSession, CourseInfo, TimeSlot } from '../types';

export const DEFAULT_TIME_SLOTS: TimeSlot[] = [
  { id: 1, label: 'Slot 1', startTime: '09:00 AM', endTime: '10:00 AM', startMinutes: 540, endMinutes: 600 },
  { id: 2, label: 'Slot 2', startTime: '10:05 AM', endTime: '11:05 AM', startMinutes: 605, endMinutes: 665 },
  { id: 3, label: 'Slot 3', startTime: '11:10 AM', endTime: '12:10 PM', startMinutes: 670, endMinutes: 730 },
  { id: 4, label: 'Slot 4', startTime: '12:15 PM', endTime: '01:15 PM', startMinutes: 735, endMinutes: 795 },
  { id: 5, label: 'Slot 5', startTime: '01:50 PM', endTime: '02:50 PM', startMinutes: 830, endMinutes: 890 },
  { id: 6, label: 'Slot 6', startTime: '02:55 PM', endTime: '03:55 PM', startMinutes: 895, endMinutes: 955 },
];

export const COURSES: Record<string, CourseInfo> = {
  'ECO 1101': {
    code: 'ECO 1101',
    title: 'Microeconomics I',
    teacher: 'Md. Rakibul Islam',
    defaultRoom: '504',
    accentColor: 'bg-emerald-500 text-white border-emerald-700',
    badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-400 dark:bg-emerald-950 dark:text-emerald-200 dark:border-emerald-700',
    badgeText: 'text-emerald-700 dark:text-emerald-300',
    description: 'Fundamental supply & demand, market structures, consumer theory, and microeconomic principles.'
  },
  'ECO 1102': {
    code: 'ECO 1102',
    title: 'Macroeconomics I',
    teacher: 'Md. Ataul Gani Osmani',
    defaultRoom: '811',
    accentColor: 'bg-indigo-500 text-white border-indigo-700',
    badgeBg: 'bg-indigo-100 text-indigo-900 border-indigo-400 dark:bg-indigo-950 dark:text-indigo-200 dark:border-indigo-700',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
    description: 'National income accounting, inflation, unemployment, aggregate demand, and monetary policy.'
  },
  'ECO 1103': {
    code: 'ECO 1103',
    title: 'Agricultural Economics',
    teacher: 'Mst. Nur Hasna Banu',
    defaultRoom: '504',
    accentColor: 'bg-rose-500 text-white border-rose-700',
    badgeBg: 'bg-rose-100 text-rose-900 border-rose-400 dark:bg-rose-950 dark:text-rose-200 dark:border-rose-700',
    badgeText: 'text-rose-700 dark:text-rose-300',
    description: 'Farming systems, agricultural markets, food security, land reform, and rural development.'
  },
  'ECO 1104': {
    code: 'ECO 1104',
    title: 'Economic System: Capitalism',
    teacher: 'Md. Asduzzaman Kiron',
    defaultRoom: '909',
    accentColor: 'bg-amber-500 text-white border-amber-800',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-400 dark:bg-amber-950 dark:text-amber-200 dark:border-amber-700',
    badgeText: 'text-amber-700 dark:text-amber-300',
    description: 'Capitalist production, market dynamics, free enterprise, capital accumulation, and global trade.'
  },
  'ECO 1105': {
    code: 'ECO 1105',
    title: 'Bangladesh Economy: Structure',
    teacher: 'Md. Shamsul Alam',
    defaultRoom: '909',
    accentColor: 'bg-cyan-600 text-white border-cyan-800',
    badgeBg: 'bg-cyan-100 text-cyan-900 border-cyan-400 dark:bg-cyan-950 dark:text-cyan-200 dark:border-cyan-700',
    badgeText: 'text-cyan-700 dark:text-cyan-300',
    description: 'Structural changes, GDP growth drivers, agriculture, RMG industry, and development policies in Bangladesh.'
  }
};

export const DEFAULT_CLASS_SESSIONS: ClassSession[] = [
  // Sunday
  {
    id: 'sun-slot5',
    day: 'Sunday',
    slotId: 5,
    teacher: 'Mst. Nur Hasna Banu',
    courseCode: 'ECO 1103',
    courseTitle: 'Agricultural Economics',
    section: '1st Sem. C Sec',
    room: '504'
  },
  {
    id: 'sun-slot6',
    day: 'Sunday',
    slotId: 6,
    teacher: 'Md. Rakibul Islam',
    courseCode: 'ECO 1101',
    courseTitle: 'Microeconomics I',
    section: '1st Sem. C Sec',
    room: '504'
  },

  // Monday
  {
    id: 'mon-slot1',
    day: 'Monday',
    slotId: 1,
    teacher: 'Md. Asduzzaman Kiron',
    courseCode: 'ECO 1104',
    courseTitle: 'Economic System: Capitalism',
    section: '1st Sem. C Sec',
    room: '909'
  },
  {
    id: 'mon-slot2',
    day: 'Monday',
    slotId: 2,
    teacher: 'Mst. Nur Hasna Banu',
    courseCode: 'ECO 1103',
    courseTitle: 'Agricultural Economics',
    section: '1st Sem. C Sec',
    room: '908'
  },

  // Tuesday
  {
    id: 'tue-slot5',
    day: 'Tuesday',
    slotId: 5,
    teacher: 'Md. Shamsul Alam',
    courseCode: 'ECO 1105',
    courseTitle: 'Bangladesh Economy: Structure',
    section: '1st Sem. C Sec',
    room: '909'
  },
  {
    id: 'tue-slot6',
    day: 'Tuesday',
    slotId: 6,
    teacher: 'Md. Rakibul Islam',
    courseCode: 'ECO 1101',
    courseTitle: 'Microeconomics I',
    section: '1st Sem. C Sec',
    room: '908'
  },

  // Wednesday
  {
    id: 'wed-slot5',
    day: 'Wednesday',
    slotId: 5,
    teacher: 'Md. Ataul Gani Osmani',
    courseCode: 'ECO 1102',
    courseTitle: 'Macroeconomics I',
    section: '1st Sem. C Sec',
    room: '811'
  },
  {
    id: 'wed-slot6',
    day: 'Wednesday',
    slotId: 6,
    teacher: 'Md. Shamsul Alam',
    courseCode: 'ECO 1105',
    courseTitle: 'Bangladesh Economy: Structure',
    section: '1st Sem. C Sec',
    room: '909'
  },

  // Thursday
  {
    id: 'thu-slot2',
    day: 'Thursday',
    slotId: 2,
    teacher: 'Md. Asduzzaman Kiron',
    courseCode: 'ECO 1104',
    courseTitle: 'Economic System: Capitalism',
    section: '1st Sem. C Sec',
    room: '908'
  },
  {
    id: 'thu-slot4',
    day: 'Thursday',
    slotId: 4,
    teacher: 'Md. Ataul Gani Osmani',
    courseCode: 'ECO 1102',
    courseTitle: 'Macroeconomics I',
    section: '1st Sem. C Sec',
    room: '810'
  }
];
