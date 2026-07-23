import React from 'react';
import { BookOpen, Calendar, Clock, Edit3, Filter, MapPin, Phone, Plus, Printer, RefreshCw, User, X } from 'lucide-react';
import { COURSES } from '../data/defaultRoutine';
import { FACULTY_MEMBERS, getTeacherShortName, ROOM_GUIDE } from '../data/teachers';
import { ClassSession, DayOfWeek, TimeSlot } from '../types';
import { useBodyScrollLock } from '../utils/useBodyScrollLock';

interface WeekViewProps {
  sessions: ClassSession[];
  slots: TimeSlot[];
  onOpenEditor: () => void;
  onResetRoutine: () => void;
  onSelectDay: (day: DayOfWeek) => void;
  onOpenRoomModal?: (roomNumber: string) => void;
  onAddTaskForCourse?: (courseCode: string) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  sessions,
  slots,
  onOpenEditor,
  onResetRoutine,
  onSelectDay,
  onOpenRoomModal,
  onAddTaskForCourse
}) => {
  const [selectedCourseFilter, setSelectedCourseFilter] = React.useState<string>('ALL');
  const [selectedSessionModal, setSelectedSessionModal] = React.useState<{
    session: ClassSession;
    slot: TimeSlot;
    day: DayOfWeek;
  } | null>(null);

  useBodyScrollLock(!!selectedSessionModal);

  // Filter sessions if user picked a specific course
  const filteredSessions =
    selectedCourseFilter === 'ALL'
      ? sessions
      : sessions.filter((s) => s.courseCode === selectedCourseFilter);

  const activeDays: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday'];

  return (
    <div className="space-y-4 pb-20">
      {/* Header Controls */}
      <div className="bg-white dark:bg-[#141416] p-4 border border-slate-200 dark:border-white/10 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-syne font-extrabold text-base uppercase text-slate-900 dark:text-white tracking-tight">
              Full Week Routine Schedule
            </h2>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
              Department of Economics — 1st Semester Section C
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="text-xs font-mono font-extrabold bg-slate-900 text-white dark:bg-[#ff3e00] dark:text-black p-2 border border-slate-900 dark:border-[#ff3e00] hover:opacity-90 cursor-pointer flex items-center justify-center shadow-sm"
              title="Print or Save Schedule as PDF"
              aria-label="Print schedule"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenEditor}
              className="text-xs font-mono font-extrabold bg-[#ff3e00] text-black px-3 py-1.5 border border-[#ff3e00] hover:bg-[#ff3e00]/90 cursor-pointer flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" /> Edit Routine
            </button>
            <button
              onClick={onResetRoutine}
              className="text-xs font-mono font-bold bg-slate-100 dark:bg-[#232326] text-slate-700 dark:text-slate-300 px-3 py-1.5 border border-slate-300 dark:border-white/10 hover:text-slate-900 dark:hover:text-white cursor-pointer flex items-center gap-1.5"
              title="Reset to official department schedule"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 no-scrollbar">
          <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter:
          </span>
          <button
            onClick={() => setSelectedCourseFilter('ALL')}
            className={`text-xs font-mono font-bold px-2.5 py-1 border transition-all cursor-pointer ${
              selectedCourseFilter === 'ALL'
                ? 'bg-[#ff3e00] text-black border-[#ff3e00] font-extrabold'
                : 'bg-slate-100 dark:bg-[#232326] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            All Courses
          </button>
          {Object.keys(COURSES).map((code) => (
            <button
              key={code}
              onClick={() => setSelectedCourseFilter(code)}
              className={`text-xs font-mono font-bold px-2.5 py-1 border transition-all cursor-pointer ${
                selectedCourseFilter === code
                  ? 'bg-[#ff3e00]/20 text-[#ff3e00] border-[#ff3e00]/40 font-extrabold'
                  : 'bg-slate-100 dark:bg-[#232326] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Routine Matrix Table */}
      <div className="bg-white dark:bg-[#141416] border border-slate-200 dark:border-white/10 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[750px] table-fixed">
          <thead>
            <tr className="bg-slate-100 dark:bg-[#0a0a0b] text-slate-800 dark:text-slate-200 font-mono text-xs font-bold border-b border-slate-200 dark:border-white/10">
              <th className="p-2.5 border-r border-slate-200 dark:border-white/10 w-24 shrink-0">Day</th>
              {slots.map((s) => (
                <th
                  key={s.id}
                  className="p-2 border-r border-slate-200 dark:border-white/10 text-center text-[11px] w-36 shrink-0"
                >
                  <div className="font-bold text-[#ff3e00]">{s.label}</div>
                  <div className="text-[9px] font-normal text-slate-500">{s.startTime}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="font-mono text-xs">
            {activeDays.map((day) => {
              const daySessions = filteredSessions.filter((s) => s.day === day);

              return (
                <tr
                  key={day}
                  className="border-b border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/[0.02]"
                >
                  {/* Day Label */}
                  <td className="p-2.5 font-bold border-r border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0a0a0b]/60 text-slate-900 dark:text-white w-24 shrink-0">
                    <button
                      onClick={() => onSelectDay(day)}
                      className="hover:underline hover:text-[#ff3e00] cursor-pointer text-left block"
                    >
                      {day}
                      <span className="block text-[9px] font-normal text-slate-500">
                        {daySessions.length} classes
                      </span>
                    </button>
                  </td>

                  {/* Slots for this day */}
                  {slots.map((slot) => {
                    const session = daySessions.find((s) => s.slotId === slot.id);

                    return (
                      <td
                        key={slot.id}
                        className="p-1.5 border-r border-slate-200 dark:border-white/10 align-top h-20 w-36 shrink-0 overflow-hidden"
                      >
                        {session ? (
                          <div
                            onClick={() => setSelectedSessionModal({ session, slot, day })}
                            title="Click for class & room details"
                            className="h-full w-full p-2 border border-[#ff3e00]/30 bg-[#ff3e00]/10 text-slate-900 dark:text-slate-200 flex flex-col justify-between hover:border-[#ff3e00] hover:bg-[#ff3e00]/20 transition-all cursor-pointer overflow-hidden group shadow-sm"
                          >
                            <div className="min-w-0">
                              <span className="font-bold text-[#ff3e00] text-[11px] block truncate group-hover:underline">
                                {session.courseCode}
                              </span>
                              <span className="text-[10px] text-slate-700 dark:text-slate-300 block truncate leading-tight mt-0.5 font-bold" title={session.teacher}>
                                {getTeacherShortName(session.teacher) || session.teacher}
                              </span>
                            </div>
                            <div className="mt-1 flex items-center justify-between text-[9px] font-bold text-slate-500 dark:text-slate-400 border-t border-slate-200 dark:border-white/10 pt-0.5 min-w-0">
                              <span className="truncate">Rm {session.room}</span>
                              <span className="bg-slate-200 dark:bg-[#0a0a0b] text-slate-800 dark:text-slate-300 px-1 border border-slate-300 dark:border-white/10 shrink-0">{slot.label}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="h-full border border-dashed border-slate-200 dark:border-white/10 flex items-center justify-center text-[10px] text-slate-400 dark:text-slate-600">
                            —
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Course Color Legend Box */}
      <div className="bg-white dark:bg-[#141416] p-4 border border-slate-200 dark:border-white/10">
        <h4 className="font-mono font-bold text-xs uppercase text-slate-700 dark:text-slate-300 mb-2.5">
          Course Reference & Teachers:
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {Object.values(COURSES).map((c) => (
            <div
              key={c.code}
              className="p-2.5 border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#0a0a0b] text-xs font-mono"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#ff3e00]">{c.code}</span>
                <span className="text-[10px] text-slate-500">Room {c.defaultRoom}</span>
              </div>
              <div className="text-[11px] font-medium text-slate-900 dark:text-white truncate mt-0.5">{c.title}</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                {c.teacher} ({getTeacherShortName(c.teacher)})
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Session Details Popup Modal */}
      {selectedSessionModal && (() => {
        const { session, slot, day } = selectedSessionModal;
        const courseInfo = COURSES[session.courseCode];
        const teacherShort = getTeacherShortName(session.teacher);
        const faculty = FACULTY_MEMBERS.find((f) => f.name === session.teacher || f.codeName === teacherShort);
        const roomGuide = ROOM_GUIDE[session.room];

        return (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
            <div className="bg-white dark:bg-[#141416] border border-slate-200 dark:border-white/10 p-5 max-w-md w-full space-y-4 shadow-2xl">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-[#ff3e00]/20 border border-[#ff3e00]/40 text-[#ff3e00] font-bold flex items-center justify-center font-syne">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-syne font-extrabold text-base uppercase text-slate-900 dark:text-white leading-tight">
                      {session.courseCode}
                    </h3>
                    <p className="text-[11px] text-[#ff3e00] font-bold">
                      {courseInfo?.title || session.courseTitle}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedSessionModal(null)}
                  className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Time & Room Pill Header */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-[#0a0a0b] p-3 border border-slate-200 dark:border-white/10 text-xs">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#ff3e00]" /> Schedule
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white">
                    {day}
                  </p>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400">
                    {slot.label} ({slot.startTime} - {slot.endTime})
                  </p>
                </div>

                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#ff3e00]" /> Room Location
                  </span>
                  <p className="font-bold text-slate-900 dark:text-white">
                    Room {session.room}
                  </p>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400">
                    {roomGuide ? `${roomGuide.floor}, ${roomGuide.building}` : 'Academic Building 1'}
                  </p>
                </div>
              </div>

              {/* Faculty / Instructor Card */}
              <div className="bg-slate-50 dark:bg-[#0a0a0b] p-3 border border-slate-200 dark:border-white/10 space-y-1.5 text-xs">
                <span className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                  <User className="w-3 h-3 text-[#ff3e00]" /> Course Faculty
                </span>
                <div className="flex items-center justify-between flex-wrap gap-1">
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">
                      {session.teacher} <span className="text-[#ff3e00]">({teacherShort})</span>
                    </p>
                    <p className="text-[10px] text-slate-600 dark:text-slate-400">
                      {faculty?.designation || 'Lecturer'}, {faculty?.department || 'Department of Economics'}
                    </p>
                  </div>
                  {faculty?.phone && (
                    <a
                      href={`tel:${faculty.phone}`}
                      className="px-2.5 py-1 bg-emerald-600 text-white font-bold text-[10px] flex items-center gap-1 hover:bg-emerald-500 cursor-pointer"
                    >
                      <Phone className="w-3 h-3" /> Call
                    </a>
                  )}
                </div>
              </div>

              {/* Course Description */}
              {courseInfo?.description && (
                <div className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#0a0a0b] p-3 border border-slate-200 dark:border-white/10">
                  <span className="font-bold text-slate-900 dark:text-white block mb-0.5 uppercase text-[10px]">
                    Overview:
                  </span>
                  {courseInfo.description}
                </div>
              )}

              {/* Quick Actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200 dark:border-white/10 text-xs">
                <div className="flex items-center gap-2">
                  {onOpenRoomModal && (
                    <button
                      onClick={() => {
                        setSelectedSessionModal(null);
                        onOpenRoomModal(session.room);
                      }}
                      className="px-2.5 py-1.5 bg-slate-100 dark:bg-[#232326] text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-white/10 font-bold hover:border-[#ff3e00] cursor-pointer flex items-center gap-1"
                    >
                      <MapPin className="w-3 h-3 text-[#ff3e00]" /> Room Guide
                    </button>
                  )}
                  {onAddTaskForCourse && (
                    <button
                      onClick={() => {
                        setSelectedSessionModal(null);
                        onAddTaskForCourse(session.courseCode);
                      }}
                      className="px-2.5 py-1.5 bg-[#ff3e00] text-black font-extrabold border border-[#ff3e00] hover:bg-[#e03700] cursor-pointer flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" /> Add Task
                    </button>
                  )}
                </div>

                <button
                  onClick={() => {
                    setSelectedSessionModal(null);
                    onSelectDay(day);
                  }}
                  className="px-3 py-1.5 bg-slate-100 dark:bg-[#232326] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-white/10 font-bold hover:text-slate-900 dark:hover:text-white cursor-pointer ml-auto"
                >
                  View Day Routine
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
