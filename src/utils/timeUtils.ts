import { ClassSession, DayOfWeek, TimeSlot } from '../types';

export const DAYS_LIST: DayOfWeek[] = [
  'Saturday',
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday'
];

export function getOrderedDaysFromToday(currentDay: DayOfWeek): DayOfWeek[] {
  const index = DAYS_LIST.indexOf(currentDay);
  if (index === -1) return DAYS_LIST;
  return [...DAYS_LIST.slice(index), ...DAYS_LIST.slice(0, index)];
}

export function getDayNameFromDate(date: Date): DayOfWeek {
  const dayIndex = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const map: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return map[dayIndex];
}

export function getCurrentMinutes(date: Date = new Date()): number {
  return date.getHours() * 60 + date.getMinutes();
}

export function formatTime24To12(time24: string): string {
  if (!time24) return '';
  const [h, m] = time24.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hours12 = h % 12 || 12;
  return `${hours12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} ${period}`;
}

export function parseTimeStringToMinutes(timeStr: string): number {
  // Parses "09:00 AM" or "01:50 PM"
  const clean = timeStr.trim().toUpperCase();
  const match = clean.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/);
  if (!match) return 0;
  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3];

  if (period === 'PM' && hours < 12) hours += 12;
  if (period === 'AM' && hours === 12) hours = 0;

  return hours * 60 + minutes;
}

export type SlotStatusType = 'live' | 'upcoming' | 'completed' | 'free';

export function getSlotStatus(
  slot: TimeSlot,
  currentDay: DayOfWeek,
  selectedDay: DayOfWeek,
  currentMinutes: number,
  session?: ClassSession
): SlotStatusType {
  if (!session) return 'free';

  // If viewing a different day than today
  if (selectedDay !== currentDay) {
    return 'upcoming';
  }

  if (currentMinutes >= slot.startMinutes && currentMinutes <= slot.endMinutes) {
    return 'live';
  } else if (currentMinutes < slot.startMinutes) {
    return 'upcoming';
  } else {
    return 'completed';
  }
}

export interface NextClassInfo {
  session: ClassSession;
  slot: TimeSlot;
  day: DayOfWeek;
  minutesUntil: number;
  isToday: boolean;
  timeString: string;
}

export function getNextUpcomingClass(
  sessions: ClassSession[],
  slots: TimeSlot[],
  currentDate: Date = new Date()
): NextClassInfo | null {
  const currentDay = getDayNameFromDate(currentDate);
  const currentMins = getCurrentMinutes(currentDate);

  // 1. Check remaining slots today
  const todaySessions = sessions.filter((s) => s.day === currentDay);
  const upcomingToday: { session: ClassSession; slot: TimeSlot; minutes: number }[] = [];

  for (const s of todaySessions) {
    const slot = slots.find((ts) => ts.id === s.slotId);
    if (slot && slot.startMinutes > currentMins) {
      upcomingToday.push({
        session: s,
        slot,
        minutes: slot.startMinutes - currentMins
      });
    }
  }

  if (upcomingToday.length > 0) {
    upcomingToday.sort((a, b) => a.minutes - b.minutes);
    const first = upcomingToday[0];
    return {
      session: first.session,
      slot: first.slot,
      day: currentDay,
      minutesUntil: first.minutes,
      isToday: true,
      timeString: first.slot.startTime
    };
  }

  // 2. Check upcoming days in the week
  const dayIndices: Record<DayOfWeek, number> = {
    Sunday: 0,
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
    Saturday: 6
  };

  const currDayIndex = dayIndices[currentDay];

  for (let offset = 1; offset <= 7; offset++) {
    const targetDayIndex = (currDayIndex + offset) % 7;
    const targetDay = DAYS_LIST.find((d) => dayIndices[d] === targetDayIndex);
    if (!targetDay) continue;

    const targetSessions = sessions.filter((s) => s.day === targetDay);
    if (targetSessions.length > 0) {
      // Find earliest slot on this target day
      const sessionsWithSlot = targetSessions
        .map((s) => ({ session: s, slot: slots.find((ts) => ts.id === s.slotId)! }))
        .filter((item) => !!item.slot)
        .sort((a, b) => a.slot.startMinutes - b.slot.startMinutes);

      if (sessionsWithSlot.length > 0) {
        const first = sessionsWithSlot[0];
        const minutesUntil = (offset * 24 * 60) - currentMins + first.slot.startMinutes;
        return {
          session: first.session,
          slot: first.slot,
          day: targetDay,
          minutesUntil,
          isToday: false,
          timeString: `${targetDay} ${first.slot.startTime}`
        };
      }
    }
  }

  return null;
}

export function formatMinutesUntil(mins: number): string {
  if (mins <= 0) return 'Starting now';
  if (mins < 60) return `in ${mins}m`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  if (hours < 24) {
    return remainingMins > 0 ? `in ${hours}h ${remainingMins}m` : `in ${hours}h`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;
  return `in ${days}d ${remainingHours}h`;
}

export function getTodayFormattedDate(): string {
  const d = new Date();
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function getISOFormattedDate(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
