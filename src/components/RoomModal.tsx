import React from 'react';
import { Building, MapPin, Users, X } from 'lucide-react';
import { COURSES } from '../data/defaultRoutine';
import { ROOM_GUIDE } from '../data/teachers';
import { ClassSession } from '../types';

interface RoomModalProps {
  roomNumber: string | null;
  onClose: () => void;
  sessions: ClassSession[];
}

export const RoomModal: React.FC<RoomModalProps> = ({ roomNumber, onClose, sessions }) => {
  if (!roomNumber) return null;

  const roomInfo = ROOM_GUIDE[roomNumber] || {
    roomNumber,
    floor: 'Academic Building',
    building: 'Academic Building 1',
    wing: 'Central Wing',
    capacity: '60 seats',
    notes: 'Standard lecture hall.'
  };

  const roomSessions = sessions.filter((s) => s.room === roomNumber);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
      <div className="bg-white dark:bg-[#141416] border border-slate-200 dark:border-white/10 p-5 max-w-md w-full space-y-3.5 shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-slate-100 dark:bg-[#0a0a0b] text-[#ff3e00] border border-slate-300 dark:border-white/10 font-bold flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-syne font-extrabold text-base uppercase text-slate-900 dark:text-white">
                Room {roomInfo.roomNumber} Details
              </h3>
              <p className="text-[10px] text-slate-500 font-bold">{roomInfo.floor}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Room Attributes */}
        <div className="bg-slate-50 dark:bg-[#0a0a0b] p-3.5 border border-slate-200 dark:border-white/10 text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
          <p>
            <span className="font-bold text-slate-900 dark:text-slate-400">Building:</span> {roomInfo.building} ({roomInfo.wing})
          </p>
          <p>
            <span className="font-bold text-slate-900 dark:text-slate-400">Capacity:</span> {roomInfo.capacity}
          </p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 italic pt-0.5">{roomInfo.notes}</p>
        </div>

        {/* Classes Scheduled in this Room */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold uppercase text-slate-700 dark:text-slate-300">
            Classes Scheduled in Room {roomInfo.roomNumber}:
          </h4>
          {roomSessions.length === 0 ? (
            <p className="text-slate-500 text-xs">No classes currently assigned to this room.</p>
          ) : (
            <div className="space-y-1.5 max-h-40 overflow-y-auto">
              {roomSessions.map((s) => {
                return (
                  <div
                    key={s.id}
                    className="p-2.5 bg-slate-50 dark:bg-[#0a0a0b] border border-slate-200 dark:border-white/10 flex items-center justify-between"
                  >
                    <div>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 bg-[#ff3e00]/10 text-[#ff3e00] border border-[#ff3e00]/20">
                        {s.courseCode}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white ml-2">
                        {s.day} (Slot {s.slotId})
                      </span>
                      <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-0.5">{s.teacher}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-white/10">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold bg-[#ff3e00] text-black border border-[#ff3e00] hover:bg-[#e03700] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
