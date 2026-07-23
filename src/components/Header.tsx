import React from 'react';
import { Bell, Calendar, Clock, Moon, Sun, Sparkles, AlertCircle } from 'lucide-react';
import { DayOfWeek, TimeSlot, ClassSession } from '../types';
import { DAYS_LIST, formatMinutesUntil, getNextUpcomingClass, getOrderedDaysFromToday } from '../utils/timeUtils';
import { getTeacherShortName } from '../data/teachers';

interface HeaderProps {
  currentDay: DayOfWeek;
  selectedDay: DayOfWeek;
  setSelectedDay: (day: DayOfWeek) => void;
  isTodaySimulated: boolean;
  resetToRealToday: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean | ((prev: boolean) => boolean)) => void;
  sessions: ClassSession[];
  slots: TimeSlot[];
  onOpenReminders: () => void;
  onOpenEditor: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDay,
  selectedDay,
  setSelectedDay,
  isTodaySimulated,
  resetToRealToday,
  darkMode,
  setDarkMode,
  sessions,
  slots,
  onOpenReminders,
  onOpenEditor,
}) => {
  const [timeString, setTimeString] = React.useState<string>('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const nextClass = getNextUpcomingClass(sessions, slots);

  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-[#0a0a0b]/95 backdrop-blur-md border-b border-slate-200 dark:border-white/10 transition-colors max-w-full overflow-hidden">
      {/* Top Banner Alert if next class exists */}
      {nextClass && (
        <div className="bg-[#ff3e00]/10 text-[#ff3e00] font-mono text-[12px] sm:text-xs py-1.5 px-2.5 sm:px-4 border-b border-[#ff3e00]/20 font-medium flex items-center justify-between gap-2 max-w-full overflow-hidden">
          <div className="flex items-center gap-1.5 min-w-0 overflow-hidden">
            <Clock className="w-4 h-4 text-[#ff3e00] shrink-0" />
            <span className="font-bold tracking-wider text-[10px] sm:text-[11px] uppercase shrink-0">NEXT CLASS:</span>
            <span className="text-slate-900 dark:text-white font-bold truncate text-[12px] sm:text-sm" title={`${nextClass.session.courseTitle} - ${nextClass.session.teacher}`}>
              {nextClass.session.courseCode} <span className="text-[#ff3e00] font-extrabold">({getTeacherShortName(nextClass.session.teacher)})</span>
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px] sm:text-xs hidden md:inline shrink-0">• Rm {nextClass.session.room}</span>
            <span className="bg-[#ff3e00] text-black px-1.5 py-0.2 text-[10px] sm:text-[11px] font-mono font-bold uppercase shrink-0">
              {formatMinutesUntil(nextClass.minutesUntil)}
            </span>
          </div>
          <button
            onClick={onOpenReminders}
            className="text-[9px] sm:text-[10px] uppercase tracking-widest text-[#ff3e00] hover:underline cursor-pointer shrink-0 font-bold ml-1"
          >
            Alerts
          </button>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-2.5 sm:px-4 py-2.5 flex items-center justify-between gap-1.5 sm:gap-3">
        {/* Brand & Section Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-slate-100 dark:bg-[#141416] border border-slate-300 dark:border-white/10 text-[#ff3e00] font-syne font-extrabold flex items-center justify-center text-sm sm:text-base tracking-wider shrink-0">
            U.
          </div>
          <div className="min-w-0">
            <div className="text-[8px] sm:text-[10px] font-mono tracking-wider sm:tracking-[0.2em] uppercase text-[#ff3e00] font-bold mb-0.5 truncate hidden xs:block">
              STUDENT TERMINAL
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <h1 className="font-syne font-extrabold tracking-tight text-slate-900 dark:text-white text-sm sm:text-lg leading-none uppercase shrink-0">
                ECON<span className="text-[#ff3e00]">OMICS</span>
              </h1>
              <span className="text-[8px] sm:text-[9px] font-mono font-bold uppercase bg-slate-100 dark:bg-[#141416] text-slate-700 dark:text-slate-300 px-1.5 py-0.5 border border-slate-300 dark:border-white/10 hidden sm:inline-block">
                1st Sem C
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Live Clock Display */}
          <div className="hidden md:block text-right mr-1 font-mono">
            <div className="text-xs text-slate-900 dark:text-white font-bold">{timeString || '08:06 AM'}</div>
            <div className="text-[9px] uppercase tracking-widest text-[#ff3e00] font-semibold">SYSTEM: OPTIMAL</div>
          </div>

          {/* Icon-Only Date Picker */}
          <div className="relative" title={`Select Day (${selectedDay})`}>
            <div className={`p-2 sm:p-2.5 bg-slate-100 dark:bg-[#141416] text-slate-700 dark:text-slate-300 border cursor-pointer shrink-0 flex items-center justify-center transition-all ${
              selectedDay === currentDay
                ? 'border-2 border-[#ff3e00] text-[#ff3e00]'
                : 'border-slate-300 dark:border-white/10 hover:border-[#ff3e00]'
            }`}>
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff3e00]" />
            </div>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value as DayOfWeek)}
              aria-label="Select Day"
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer font-mono text-xs"
            >
              {getOrderedDaysFromToday(currentDay).map((day) => (
                <option key={day} value={day} className="bg-white dark:bg-[#141416] text-slate-900 dark:text-slate-200 font-bold p-2">
                  {day} {day === currentDay ? '(Today)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Reminders Button */}
          <button
            onClick={onOpenReminders}
            title="Class Reminders & Chime"
            className="p-2 sm:p-2.5 bg-slate-100 dark:bg-[#141416] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10 hover:text-slate-900 dark:hover:text-white hover:border-[#ff3e00] cursor-pointer shrink-0"
          >
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            title="Toggle Light / Dark Mode"
            className="p-2 sm:p-2.5 bg-slate-100 dark:bg-[#141416] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10 hover:text-slate-900 dark:hover:text-white hover:border-[#ff3e00] cursor-pointer shrink-0"
          >
            {darkMode ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-[#ff3e00]" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
