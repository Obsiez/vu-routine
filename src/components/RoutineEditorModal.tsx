import React from 'react';
import { Edit, RefreshCw, Save, Trash2, X } from 'lucide-react';
import { COURSES } from '../data/defaultRoutine';
import { ClassSession, DayOfWeek, TimeSlot } from '../types';
import { DAYS_LIST } from '../utils/timeUtils';

interface RoutineEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ClassSession[];
  slots: TimeSlot[];
  onSaveSession: (updatedSession: ClassSession) => void;
  onDeleteSession: (sessionId: string) => void;
  onResetRoutine: () => void;
}

export const RoutineEditorModal: React.FC<RoutineEditorModalProps> = ({
  isOpen,
  onClose,
  sessions,
  slots,
  onSaveSession,
  onDeleteSession,
  onResetRoutine
}) => {
  const [selectedDay, setSelectedDay] = React.useState<DayOfWeek>('Sunday');
  const [selectedSlotId, setSelectedSlotId] = React.useState<number>(1);
  const [courseCode, setCourseCode] = React.useState<string>('ECO 1101');
  const [teacher, setTeacher] = React.useState<string>('Md. Rakibul Islam');
  const [room, setRoom] = React.useState<string>('504');
  const [section, setSection] = React.useState<string>('1st Sem. C Sec');

  if (!isOpen) return null;

  // Find existing session for selected day + slot
  const existingSession = sessions.find((s) => s.day === selectedDay && s.slotId === selectedSlotId);

  const handleSelectSlotOrDay = (day: DayOfWeek, slotId: number) => {
    setSelectedDay(day);
    setSelectedSlotId(slotId);
    const found = sessions.find((s) => s.day === day && s.slotId === slotId);
    if (found) {
      setCourseCode(found.courseCode);
      setTeacher(found.teacher);
      setRoom(found.room);
      setSection(found.section);
    } else {
      setCourseCode('ECO 1101');
      setTeacher(COURSES['ECO 1101'].teacher);
      setRoom(COURSES['ECO 1101'].defaultRoom);
      setSection('1st Sem. C Sec');
    }
  };

  const handleCourseChange = (code: string) => {
    setCourseCode(code);
    if (COURSES[code]) {
      setTeacher(COURSES[code].teacher);
      setRoom(COURSES[code].defaultRoom);
    }
  };

  const handleSave = () => {
    const courseTitle = COURSES[courseCode]?.title || 'Economics Lecture';
    const id = existingSession
      ? existingSession.id
      : `session-${selectedDay.toLowerCase()}-${selectedSlotId}-${Date.now()}`;

    onSaveSession({
      id,
      day: selectedDay,
      slotId: selectedSlotId,
      courseCode,
      courseTitle,
      teacher,
      room,
      section
    });
  };

  const handleDelete = () => {
    if (existingSession) {
      onDeleteSession(existingSession.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono text-xs">
      <div className="bg-white dark:bg-[#141416] border border-slate-200 dark:border-white/10 p-5 max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
          <h3 className="font-syne font-extrabold text-base uppercase text-slate-900 dark:text-white flex items-center gap-2">
            <Edit className="w-5 h-5 text-[#ff3e00]" /> Customize Routine Slots
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Day & Slot Selection */}
        <div className="space-y-2.5">
          <label className="block font-bold text-slate-700 dark:text-slate-300">
            Select Day & Time Slot:
          </label>

          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {DAYS_LIST.filter((d) => d !== 'Friday' && d !== 'Saturday').map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => handleSelectSlotOrDay(d, selectedSlotId)}
                className={`px-3 py-1 font-bold border transition-all cursor-pointer ${
                  selectedDay === d
                    ? 'bg-[#ff3e00] text-black border-[#ff3e00] font-extrabold'
                    : 'bg-slate-100 dark:bg-[#0a0a0b] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {d.substring(0, 3)}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
            {slots.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelectSlotOrDay(selectedDay, s.id)}
                className={`py-1.5 px-1 text-center font-bold border cursor-pointer ${
                  selectedSlotId === s.id
                    ? 'bg-[#ff3e00] text-black border-[#ff3e00] font-extrabold'
                    : 'bg-slate-100 dark:bg-[#0a0a0b] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form Inputs */}
        <div className="bg-slate-50 dark:bg-[#0a0a0b] p-4 border border-slate-200 dark:border-white/10 space-y-3">
          <div className="flex items-center justify-between font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-white/10 pb-2">
            <span>Editing {selectedDay} — Slot {selectedSlotId}</span>
            {existingSession ? (
              <span className="text-[10px] text-[#ff3e00] font-bold uppercase">[Class Active]</span>
            ) : (
              <span className="text-[10px] text-slate-500 uppercase">[Empty Slot]</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-400 mb-1">Course Code</label>
              <select
                value={courseCode}
                onChange={(e) => handleCourseChange(e.target.value)}
                className="w-full h-10 px-3 bg-white dark:bg-[#141416] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-200 font-bold cursor-pointer focus:border-[#ff3e00] focus:outline-none"
              >
                {Object.keys(COURSES).map((code) => (
                  <option key={code} value={code} className="bg-white dark:bg-[#141416] text-slate-900 dark:text-slate-200">
                    {code} ({COURSES[code].title})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-400 mb-1">Room Number</label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. 504, 908, 909"
                className="w-full h-10 px-3 bg-white dark:bg-[#141416] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-200 font-bold focus:border-[#ff3e00] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-400 mb-1">Faculty Teacher Name</label>
            <input
              type="text"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              placeholder="e.g. Md. Rakibul Islam"
              className="w-full h-10 px-3 bg-white dark:bg-[#141416] border border-slate-300 dark:border-white/10 text-slate-900 dark:text-slate-200 font-bold focus:border-[#ff3e00] focus:outline-none"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={onResetRoutine}
            className="text-[11px] font-bold text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Official Routine
          </button>

          <div className="flex gap-2">
            {existingSession && (
              <button
                type="button"
                onClick={handleDelete}
                className="px-3 py-1.5 font-bold bg-rose-100 dark:bg-rose-500/20 text-rose-700 dark:text-rose-400 border border-rose-300 dark:border-rose-500/40 hover:bg-rose-200 dark:hover:bg-rose-500/30 cursor-pointer"
              >
                Clear Slot
              </button>
            )}
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 font-bold bg-[#ff3e00] text-black border border-[#ff3e00] hover:bg-[#e03700] cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" /> Save Slot
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
