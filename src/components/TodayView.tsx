import React from 'react';
import {
  AlertCircle,
  BookOpen,
  CheckCircle2,
  Clock,
  FileText,
  MapPin,
  Plus,
  User,
  XCircle,
  Sparkles,
  ChevronRight,
  Info,
  Undo2
} from 'lucide-react';
import { COURSES } from '../data/defaultRoutine';
import { ROOM_GUIDE, getTeacherShortName } from '../data/teachers';
import { AttendanceLog, AttendanceStatus, ClassSession, DayOfWeek, TimeSlot } from '../types';
import { DAYS_LIST, getISOFormattedDate, getOrderedDaysFromToday, getSlotStatus } from '../utils/timeUtils';

interface TodayViewProps {
  selectedDay: DayOfWeek;
  setSelectedDay: (day: DayOfWeek) => void;
  currentDay: DayOfWeek;
  isTodaySimulated?: boolean;
  resetToRealToday?: () => void;
  currentMinutes: number;
  sessions: ClassSession[];
  slots: TimeSlot[];
  attendanceLogs: AttendanceLog[];
  onMarkAttendance: (courseCode: string, slotId: number, status: AttendanceStatus) => void;
  onAddTaskForCourse: (courseCode: string) => void;
  notes: Record<string, string>;
  onSaveNote: (sessionId: string, note: string) => void;
  onOpenRoomModal: (roomNumber: string) => void;
}

export const TodayView: React.FC<TodayViewProps> = ({
  selectedDay,
  setSelectedDay,
  currentDay,
  isTodaySimulated,
  resetToRealToday,
  currentMinutes,
  sessions,
  slots,
  attendanceLogs,
  onMarkAttendance,
  onAddTaskForCourse,
  notes,
  onSaveNote,
  onOpenRoomModal
}) => {
  const [activeNoteSessionId, setActiveNoteSessionId] = React.useState<string | null>(null);
  const [noteText, setNoteText] = React.useState<string>('');

  const todaySessions = sessions.filter((s) => s.day === selectedDay);
  const todayDateStr = getISOFormattedDate();

  const handleOpenNote = (session: ClassSession) => {
    setActiveNoteSessionId(session.id);
    setNoteText(notes[session.id] || '');
  };

  const handleSaveNote = () => {
    if (activeNoteSessionId) {
      onSaveNote(activeNoteSessionId, noteText);
      setActiveNoteSessionId(null);
    }
  };

  return (
    <div className="space-y-4 pb-20">
      {/* Day Navigation Calendar Strip */}
      <div className="bg-white dark:bg-[#141416] p-3 border border-slate-200 dark:border-white/10 space-y-2.5">
        {(selectedDay !== currentDay || isTodaySimulated) && (
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-white/10">
            <div className="text-[10px] sm:text-[11px] font-mono font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>VIEWING:</span>
              <span className="text-[#ff3e00] font-extrabold">{selectedDay}</span>
            </div>
            <button
              onClick={() => (resetToRealToday ? resetToRealToday() : setSelectedDay(currentDay))}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] sm:text-xs font-mono font-bold uppercase bg-[#ff3e00] text-black hover:bg-[#ff3e00]/90 transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Return to today</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-7 gap-1.5 sm:gap-2 w-full">
          {getOrderedDaysFromToday(currentDay).map((day, idx) => {
            const isSelected = selectedDay === day;
            const isRealToday = currentDay === day;
            
            // Calculate upcoming date for each card
            const cardDate = new Date();
            cardDate.setDate(cardDate.getDate() + idx);
            const formattedDateStr = cardDate.getDate().toString();

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`relative w-full py-2.5 px-1 text-center font-mono uppercase border transition-all cursor-pointer flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-[#ff3e00] text-black border-[#ff3e00] font-extrabold shadow-[0_0_12px_rgba(255,62,0,0.3)]'
                    : isRealToday
                    ? 'bg-slate-100 dark:bg-[#141416] text-[#ff3e00] border-2 border-[#ff3e00] font-extrabold'
                    : 'bg-slate-50 dark:bg-[#0a0a0b] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-white/20'
                }`}
              >
                <div className="flex flex-col items-center justify-center w-full">
                  <span className="text-xs sm:text-sm font-bold opacity-90 leading-none">
                    {day.substring(0, 3)}
                    {isRealToday ? ' *' : ''}
                  </span>
                  <span className="text-[10px] sm:text-[11px] font-bold mt-1.5 leading-none opacity-85">
                    {formattedDateStr}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Ticker / Countdown Box from Design Variation */}
      <div className="bg-[#ff3e00] text-black p-4 font-mono flex items-center justify-between gap-3 shadow-lg">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-black/70 block">
            {selectedDay === currentDay ? 'Live Schedule Countdown' : `${selectedDay} Overview`}
          </span>
          <div className="font-syne text-xl sm:text-2xl font-black uppercase mt-0.5 tracking-tight text-black">
            {todaySessions.length === 0
              ? 'NO LECTURES SCHEDULED'
              : `${todaySessions.length} LECTURE${todaySessions.length > 1 ? 'S' : ''} TODAY`}
          </div>
          <p className="text-xs font-bold text-black/80 mt-1">
            {todaySessions.map((s) => s.courseCode).join(' • ') || 'Enjoy your free day!'}
          </p>
        </div>
        <div className="text-right shrink-0 bg-black/10 px-3 py-2 border border-black/20">
          <span className="text-2xl sm:text-3xl font-syne font-black text-black block leading-none">
            0{todaySessions.length}
          </span>
          <span className="text-[9px] font-bold uppercase text-black/70 tracking-wider">CLASSES</span>
        </div>
      </div>

      {/* Slots List */}
      <div className="space-y-3">
        {slots.map((slot) => {
          const session = todaySessions.find((s) => s.slotId === slot.id);
          const course = session ? COURSES[session.courseCode] : null;
          const status = getSlotStatus(slot, currentDay, selectedDay, currentMinutes, session);

          // Find attendance log for this session today
          const attLog = session
            ? attendanceLogs.find((a) => a.courseCode === session.courseCode && a.slotId === slot.id && a.date === todayDateStr)
            : null;

          return (
            <div
              key={slot.id}
              className={`border transition-all ${
                status === 'live'
                  ? 'bg-white dark:bg-[#141416] border-2 border-[#ff3e00] shadow-[0_0_15px_rgba(255,62,0,0.15)]'
                  : session
                  ? 'bg-white dark:bg-[#141416] border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
                  : 'bg-slate-50 dark:bg-[#0a0a0b] border-dashed border-slate-200 dark:border-white/10 opacity-60 dark:opacity-40'
              }`}
            >
              {/* Slot Header */}
              <div className="bg-slate-100 dark:bg-[#0a0a0b]/80 text-slate-700 dark:text-slate-300 px-4 py-2 text-xs font-mono font-bold flex items-center justify-between border-b border-slate-200 dark:border-white/10">
                <div className="flex items-center gap-3">
                  <span className="text-[#ff3e00] tracking-wider font-bold">
                    {slot.startTime} — {slot.endTime}
                  </span>
                  <span className="bg-slate-200 dark:bg-[#141416] text-slate-700 dark:text-slate-400 px-2 py-0.5 text-[10px] uppercase font-bold border border-slate-300 dark:border-white/10">
                    {slot.label}
                  </span>
                </div>

                {/* Status Badge */}
                <div>
                  {status === 'live' && (
                    <span className="bg-[#ff3e00] text-black text-[10px] font-extrabold px-2 py-0.5 tracking-wider uppercase flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping"></span> ONGOING
                    </span>
                  )}
                  {status === 'upcoming' && session && (
                    <span className="border border-[#ff3e00]/50 text-[#ff3e00] text-[10px] font-mono px-2 py-0.5 uppercase tracking-widest font-bold">
                      NEXT
                    </span>
                  )}
                  {status === 'completed' && session && (
                    <span className="text-slate-500 dark:text-slate-500 text-[10px] font-mono uppercase tracking-widest">
                      ENDED
                    </span>
                  )}
                  {status === 'free' && (
                    <span className="text-[10px] font-mono text-slate-500 dark:text-slate-600 uppercase tracking-widest">FREE SLOT</span>
                  )}
                </div>
              </div>

              {/* Slot Body */}
              {session ? (
                <div className="p-4 space-y-3">
                  {/* Class Info */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#ff3e00]/10 text-[#ff3e00] border border-[#ff3e00]/20">
                          {session.courseCode}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                          {session.section}
                        </span>
                      </div>
                      <h3 className="font-syne font-bold text-lg text-slate-900 dark:text-white mt-1.5 leading-tight">
                        {session.courseTitle}
                      </h3>
                    </div>

                    {/* Room Badge */}
                    <button
                      onClick={() => onOpenRoomModal(session.room)}
                      className="bg-slate-100 dark:bg-[#0a0a0b] hover:bg-slate-200 dark:hover:bg-[#232326] border border-slate-200 dark:border-white/10 px-3 py-1.5 text-center cursor-pointer transition-colors shrink-0"
                      title="View Room Location Info"
                    >
                      <div className="flex items-center gap-1.5 text-[#ff3e00] font-mono font-bold text-xs">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Room {session.room}</span>
                      </div>
                      <span className="text-[9px] font-mono block text-slate-500 uppercase mt-0.5">
                        {ROOM_GUIDE[session.room]?.floor || 'Building 1'}
                      </span>
                    </button>
                  </div>

                  {/* Faculty */}
                  <div className="flex items-center justify-between gap-2 text-xs font-mono text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-[#0a0a0b] p-2.5 border border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-2 min-w-0">
                      <User className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
                      <span className="truncate">
                        Faculty: <span className="text-slate-900 dark:text-white font-medium">{session.teacher}</span>
                      </span>
                    </div>
                    {getTeacherShortName(session.teacher) && (
                      <span className="bg-[#ff3e00]/20 text-[#ff3e00] text-[10px] px-1.5 py-0.5 border border-[#ff3e00]/40 font-bold shrink-0">
                        {getTeacherShortName(session.teacher)}
                      </span>
                    )}
                  </div>

                  {/* Attendance Controls */}
                  <div className="pt-2 flex items-center justify-between gap-2 flex-wrap border-t border-slate-200 dark:border-white/10">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mr-1">
                        Attendance:
                      </span>
                      <button
                        onClick={() => onMarkAttendance(session.courseCode, slot.id, 'present')}
                        className={`text-[11px] font-mono font-bold px-2.5 py-1 border transition-all cursor-pointer flex items-center gap-1 ${
                          attLog?.status === 'present'
                            ? 'bg-[#ff3e00]/20 text-[#ff3e00] border-[#ff3e00]/40 font-bold'
                            : 'bg-slate-100 dark:bg-[#232326] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" /> Present
                      </button>
                      <button
                        onClick={() => onMarkAttendance(session.courseCode, slot.id, 'absent')}
                        className={`text-[11px] font-mono font-bold px-2.5 py-1 border transition-all cursor-pointer flex items-center gap-1 ${
                          attLog?.status === 'absent'
                            ? 'bg-rose-500/20 text-rose-500 dark:text-rose-400 border-rose-500/40 font-bold'
                            : 'bg-slate-100 dark:bg-[#232326] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        <XCircle className="w-3 h-3" /> Absent
                      </button>
                      <button
                        onClick={() => onMarkAttendance(session.courseCode, slot.id, 'cancelled')}
                        className={`text-[11px] font-mono font-bold px-2 py-1 border text-slate-600 dark:text-slate-400 cursor-pointer ${
                          attLog?.status === 'cancelled'
                            ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/40'
                            : 'bg-slate-100 dark:bg-[#232326] border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-white'
                        }`}
                      >
                        Off
                      </button>
                    </div>

                    {/* Notes & Add Task Shortcuts */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenNote(session)}
                        className="text-[10px] font-mono font-bold px-2.5 py-1 bg-slate-100 dark:bg-[#232326] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 flex items-center gap-1 hover:text-slate-900 dark:hover:text-white cursor-pointer"
                      >
                        <FileText className="w-3 h-3" />
                        {notes[session.id] ? 'Edit Note' : 'Note'}
                      </button>
                      <button
                        onClick={() => onAddTaskForCourse(session.courseCode)}
                        className="text-[10px] font-mono font-extrabold px-2.5 py-1 bg-[#ff3e00] text-black border border-[#ff3e00] flex items-center gap-1 hover:bg-[#ff3e00]/90 cursor-pointer"
                      >
                        <Plus className="w-3 h-3" /> Task
                      </button>
                    </div>
                  </div>

                  {/* Note Preview if exists */}
                  {notes[session.id] && (
                    <div className="bg-slate-50 dark:bg-[#0a0a0b] p-2.5 text-xs font-mono border-l-2 border-[#ff3e00] text-slate-700 dark:text-slate-300">
                      <span className="font-bold text-[#ff3e00] block mb-0.5 uppercase text-[10px]">
                        Class Note:
                      </span>
                      {notes[session.id]}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center text-xs font-mono text-slate-400 dark:text-slate-600 font-medium tracking-widest uppercase">
                  — Free Slot — No lecture scheduled
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Note Editor Drawer Modal */}
      {activeNoteSessionId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#141416] border border-slate-300 dark:border-white/10 p-5 max-w-sm w-full shadow-2xl space-y-4">
            <h3 className="font-mono font-bold text-sm uppercase text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#ff3e00]" /> Class Note & Instructions
            </h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Write lecture topics, homework guidelines, exam announcements..."
              rows={4}
              className="w-full text-xs font-mono p-3 bg-slate-50 dark:bg-[#0a0a0b] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-100 focus:border-[#ff3e00] focus:outline-none"
            />
            <div className="flex justify-end gap-2 font-mono text-xs">
              <button
                onClick={() => setActiveNoteSessionId(null)}
                className="px-3 py-1.5 font-bold bg-slate-100 dark:bg-[#232326] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10 hover:text-slate-900 dark:hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNote}
                className="px-4 py-1.5 font-bold bg-[#ff3e00] text-black border border-[#ff3e00] hover:bg-[#ff3e00]/90 cursor-pointer"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
