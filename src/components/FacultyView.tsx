import React from 'react';
import { Building, Mail, MapPin, Search, User, Users, Info, Phone, X } from 'lucide-react';
import { COURSES } from '../data/defaultRoutine';
import { FACULTY_MEMBERS, ROOM_GUIDE } from '../data/teachers';

interface FacultyViewProps {
  onOpenRoomModal: (room: string) => void;
}

export const FacultyView: React.FC<FacultyViewProps> = ({ onOpenRoomModal }) => {
  const [activeTab, setActiveTab] = React.useState<'faculty' | 'rooms'>('faculty');
  const [searchTerm, setSearchTerm] = React.useState<string>('');

  const filteredFaculty = FACULTY_MEMBERS.filter(
    (f) =>
      f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.codeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.phone && f.phone.includes(searchTerm)) ||
      f.courses.some((c) => c.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4 pb-20">
      {/* Tab Switcher */}
      <div className="bg-white dark:bg-[#141416] p-2 border border-slate-200 dark:border-white/10 flex gap-2 font-mono text-xs">
        <button
          onClick={() => setActiveTab('faculty')}
          className={`flex-1 py-2 font-bold uppercase border flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeTab === 'faculty'
              ? 'bg-[#ff3e00] text-black border-[#ff3e00] font-extrabold'
              : 'bg-slate-100 dark:bg-[#232326] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" /> Faculty Directory
        </button>
        <button
          onClick={() => setActiveTab('rooms')}
          className={`flex-1 py-2 font-bold uppercase border flex items-center justify-center gap-2 cursor-pointer transition-all ${
            activeTab === 'rooms'
              ? 'bg-[#ff3e00] text-black border-[#ff3e00] font-extrabold'
              : 'bg-slate-100 dark:bg-[#232326] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Building className="w-4 h-4" /> Classroom Map
        </button>
      </div>

      {activeTab === 'faculty' ? (
        <div className="space-y-3 font-mono">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search teacher name or course code..."
              className="w-full pl-9 pr-9 py-2 bg-slate-50 dark:bg-[#0a0a0b] text-xs border border-slate-200 dark:border-white/10 text-slate-900 dark:text-slate-200 focus:border-[#ff3e00] focus:outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Teachers Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredFaculty.map((fac) => (
              <div
                key={fac.name}
                className="bg-white dark:bg-[#141416] p-4 border border-slate-200 dark:border-white/10 space-y-3 hover:border-slate-300 dark:hover:border-white/20 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-slate-100 dark:bg-[#0a0a0b] text-[#ff3e00] border border-slate-200 dark:border-white/10 font-bold text-base flex items-center justify-center shrink-0">
                      {fac.codeName || fac.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h3 className="font-syne font-bold text-sm text-slate-900 dark:text-white leading-tight">
                          {fac.name}
                        </h3>
                        <span className="bg-[#ff3e00]/20 text-[#ff3e00] text-[10px] px-1.5 py-0.2 border border-[#ff3e00]/40 font-mono font-bold">
                          {fac.codeName}
                        </span>
                      </div>
                      <p className="text-xs text-[#ff3e00] font-bold mt-0.5">
                        {fac.designation}
                      </p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{fac.department}</p>
                    </div>
                  </div>

                  {fac.phone && (
                    <a
                      href={`tel:${fac.phone}`}
                      className="bg-[#ff3e00] hover:bg-[#e03700] text-black font-mono font-extrabold px-2.5 py-1.5 text-xs flex items-center gap-1.5 shadow transition-all shrink-0 cursor-pointer"
                      title={`Direct Call ${fac.name} (${fac.phone})`}
                    >
                      <Phone className="w-3.5 h-3.5 fill-black" />
                      <span className="hidden sm:inline">Call</span>
                    </a>
                  )}
                </div>

                {/* Direct Phone Number Bar */}
                {fac.phone && (
                  <div className="bg-slate-50 dark:bg-[#0a0a0b] p-2 border border-slate-200 dark:border-white/10 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-500 text-[10px] uppercase font-bold">Contact Phone:</span>
                    <a href={`tel:${fac.phone}`} className="font-bold text-slate-900 dark:text-slate-200 hover:text-[#ff3e00]">
                      {fac.phone}
                    </a>
                  </div>
                )}

                {/* Courses Taught */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-bold text-slate-500">
                    Courses Taught:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {fac.courses.map((code) => {
                      const course = COURSES[code];
                      return (
                        <span
                          key={code}
                          className="text-xs font-bold px-2 py-0.5 bg-[#ff3e00]/10 text-[#ff3e00] border border-[#ff3e00]/20"
                        >
                          {code}: {course ? course.title : ''}
                        </span>
                      );
                    })}
                  </div>
                </div>

                {/* Contact & Location */}
                <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between text-xs font-bold gap-2">
                  <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-[#ff3e00]" />
                    <span>{fac.primaryRoom}</span>
                  </div>

                  {fac.email && (
                    <a
                      href={`mailto:${fac.email}`}
                      className="text-[#ff3e00] hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Mail className="w-3.5 h-3.5" /> Email Faculty
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Room Locator Section */
        <div className="space-y-3 font-mono">
          <div className="bg-white dark:bg-[#141416] text-[#ff3e00] border border-[#ff3e00]/30 p-3 text-xs font-bold flex items-center gap-2">
            <Info className="w-4 h-4 shrink-0 text-[#ff3e00]" />
            <span>Click any room card below to view details and full room schedule!</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Object.values(ROOM_GUIDE).map((room) => (
              <div
                key={room.roomNumber}
                onClick={() => onOpenRoomModal(room.roomNumber)}
                className="bg-white dark:bg-[#141416] p-4 border border-slate-200 dark:border-white/10 space-y-2.5 cursor-pointer hover:border-slate-300 dark:hover:border-white/20 transition-colors"
              >
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-slate-100 dark:bg-[#0a0a0b] text-[#ff3e00] border border-slate-200 dark:border-white/10 font-bold text-sm flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-syne font-bold text-base text-slate-900 dark:text-white">
                        Room {room.roomNumber}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-bold">{room.floor}</span>
                    </div>
                  </div>

                  <span className="text-[10px] font-bold bg-slate-100 dark:bg-[#0a0a0b] text-slate-700 dark:text-slate-300 px-2 py-0.5 border border-slate-200 dark:border-white/10">
                    {room.capacity}
                  </span>
                </div>

                <div className="text-xs space-y-1.5 text-slate-700 dark:text-slate-300">
                  <p>
                    <span className="font-bold text-slate-500 dark:text-slate-400">Building:</span> {room.building} ({room.wing})
                  </p>
                  <p className="text-[11px] bg-slate-50 dark:bg-[#0a0a0b] p-2 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400">
                    {room.notes}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
