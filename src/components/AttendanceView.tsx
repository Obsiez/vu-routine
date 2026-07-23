import React from 'react';
import { AlertCircle, CheckCircle2, PieChart, Trash2, XCircle, Award } from 'lucide-react';
import { COURSES } from '../data/defaultRoutine';
import { AttendanceLog } from '../types';

interface AttendanceViewProps {
  logs: AttendanceLog[];
  onClearLogs: () => void;
  onDeleteLog: (id: string) => void;
}

export const AttendanceView: React.FC<AttendanceViewProps> = ({
  logs,
  onClearLogs,
  onDeleteLog
}) => {
  // Calculate per subject statistics
  const subjectStats = Object.keys(COURSES).map((code) => {
    const subjectLogs = logs.filter((l) => l.courseCode === code);
    const presentCount = subjectLogs.filter((l) => l.status === 'present').length;
    const absentCount = subjectLogs.filter((l) => l.status === 'absent').length;
    const totalHeld = presentCount + absentCount; // Cancelled doesn't count against total held
    const percentage = totalHeld > 0 ? Math.round((presentCount / totalHeld) * 100) : 100;

    return {
      code,
      title: COURSES[code].title,
      teacher: COURSES[code].teacher,
      presentCount,
      absentCount,
      totalHeld,
      percentage
    };
  });

  // Overall statistics
  const totalPresent = logs.filter((l) => l.status === 'present').length;
  const totalAbsent = logs.filter((l) => l.status === 'absent').length;
  const totalClassesHeld = totalPresent + totalAbsent;
  const overallPercentage =
    totalClassesHeld > 0 ? Math.round((totalPresent / totalClassesHeld) * 100) : 100;

  // 75% target calculation
  // Target: Present / (Total + X) >= 0.75
  const neededPresentTo75 =
    overallPercentage < 75 ? Math.ceil((0.75 * totalClassesHeld - totalPresent) / 0.25) : 0;

  // Maximum classes can miss: (TotalPresent - 0.75 * TotalClasses) / 0.75
  const canMissTo75 =
    overallPercentage >= 75
      ? Math.floor((totalPresent - 0.75 * totalClassesHeld) / 0.75)
      : 0;

  return (
    <div className="space-y-4 pb-20">
      {/* Overall Attendance Meter Box */}
      <div className="bg-white dark:bg-[#141416] p-5 border border-slate-200 dark:border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-syne font-extrabold text-base uppercase text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
              <PieChart className="w-5 h-5 text-[#ff3e00]" /> Attendance Tracker
            </h2>
            <p className="text-xs font-mono text-slate-500 dark:text-slate-400 mt-0.5">
              Department minimum requirement: 75% attendance
            </p>
          </div>

          <div
            className={`px-3 py-1 font-mono font-bold text-lg border ${
              overallPercentage >= 75
                ? 'bg-[#ff3e00]/20 text-[#ff3e00] border-[#ff3e00]/40'
                : 'bg-rose-500/20 text-rose-500 dark:text-rose-400 border-rose-500/40'
            }`}
          >
            {overallPercentage}%
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-4 bg-slate-100 dark:bg-[#0a0a0b] border border-slate-300 dark:border-white/10 overflow-hidden relative">
            <div
              className={`h-full transition-all ${
                overallPercentage >= 75 ? 'bg-[#ff3e00]' : 'bg-rose-500'
              }`}
              style={{ width: `${overallPercentage}%` }}
            ></div>
            {/* 75% Threshold Line */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-10"
              style={{ left: '75%' }}
              title="75% Minimum Limit"
            ></div>
          </div>
          <div className="flex justify-between text-[10px] font-mono font-bold text-slate-500">
            <span>0%</span>
            <span className="text-amber-500 font-bold">75% Target</span>
            <span>100%</span>
          </div>
        </div>

        {/* Attendance Advice Box */}
        <div className="bg-slate-50 dark:bg-[#0a0a0b] p-3.5 border border-slate-200 dark:border-white/10 font-mono text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5">
          <AlertCircle className="w-4 h-4 text-[#ff3e00] mt-0.5 shrink-0" />
          <div>
            <span className="font-bold text-[#ff3e00] block uppercase text-[10px]">Attendance Health Check:</span>
            {totalClassesHeld === 0 ? (
              <p className="mt-0.5 text-slate-500 dark:text-slate-400">No classes marked yet. Mark your daily class status on the Today view!</p>
            ) : overallPercentage >= 75 ? (
              <p className="mt-0.5 text-slate-700 dark:text-slate-300">
                Status OK! You currently have <span className="font-bold text-[#ff3e00]">{overallPercentage}%</span>. You can safely miss up to{' '}
                <span className="font-bold text-slate-900 dark:text-white underline">{canMissTo75}</span> more classes while staying above 75%.
              </p>
            ) : (
              <p className="mt-0.5 text-rose-500 dark:text-rose-400 font-medium">
                Warning! Below 75% threshold! You need to attend the next{' '}
                <span className="underline font-bold text-slate-900 dark:text-white">{neededPresentTo75}</span> consecutive classes to restore your 75% standing.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Subject Wise Cards */}
      <div className="space-y-2.5">
        <h3 className="font-mono font-bold text-xs uppercase text-slate-500 dark:text-slate-400 px-1 tracking-wider">
          Subject Attendance Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono">
          {subjectStats.map((sub) => {
            return (
              <div
                key={sub.code}
                className="bg-white dark:bg-[#141416] p-4 border border-slate-200 dark:border-white/10 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-[#ff3e00]/10 text-[#ff3e00] border border-[#ff3e00]/20">
                      {sub.code}
                    </span>
                    <h4 className="font-syne font-bold text-sm text-slate-900 dark:text-white mt-1.5">
                      {sub.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{sub.teacher}</p>
                  </div>

                  <div
                    className={`text-base font-bold px-2.5 py-0.5 border ${
                      sub.percentage >= 75
                        ? 'bg-[#ff3e00]/20 text-[#ff3e00] border-[#ff3e00]/40'
                        : 'bg-rose-500/20 text-rose-500 dark:text-rose-400 border-rose-500/40'
                    }`}
                  >
                    {sub.percentage}%
                  </div>
                </div>

                {/* Sub Stats */}
                <div className="grid grid-cols-3 gap-1.5 text-center text-xs pt-2 border-t border-slate-200 dark:border-white/10">
                  <div className="bg-slate-50 dark:bg-[#0a0a0b] p-1.5 border border-slate-200 dark:border-white/10">
                    <span className="text-[9px] text-slate-500 block uppercase">Attended</span>
                    <span className="font-bold text-[#ff3e00]">{sub.presentCount}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-[#0a0a0b] p-1.5 border border-slate-200 dark:border-white/10">
                    <span className="text-[9px] text-slate-500 block uppercase">Absent</span>
                    <span className="font-bold text-rose-500 dark:text-rose-400">{sub.absentCount}</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-[#0a0a0b] p-1.5 border border-slate-200 dark:border-white/10">
                    <span className="text-[9px] text-slate-500 block uppercase">Total Held</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{sub.totalHeld}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History Logs */}
      <div className="bg-white dark:bg-[#141416] p-4 border border-slate-200 dark:border-white/10 space-y-3 font-mono">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xs uppercase text-slate-700 dark:text-slate-300">
            Attendance Log History ({logs.length})
          </h3>
          {logs.length > 0 && (
            <button
              onClick={onClearLogs}
              className="text-[10px] font-bold text-rose-500 dark:text-rose-400 hover:underline cursor-pointer"
            >
              Clear History
            </button>
          )}
        </div>

        {logs.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-3">
            No attendance history recorded yet. Use the Present/Absent buttons on the Today schedule tab.
          </p>
        ) : (
          <div className="space-y-1.5 max-h-56 overflow-y-auto">
            {logs.slice().reverse().map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between text-xs p-2.5 bg-slate-50 dark:bg-[#0a0a0b] border border-slate-200 dark:border-white/10"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`font-bold text-[10px] px-1.5 py-0.2 border uppercase ${
                      log.status === 'present'
                        ? 'bg-[#ff3e00]/20 text-[#ff3e00] border-[#ff3e00]/40'
                        : log.status === 'absent'
                        ? 'bg-rose-500/20 text-rose-500 dark:text-rose-400 border-rose-500/40'
                        : 'bg-amber-500/20 text-amber-500 dark:text-amber-400 border-amber-500/40'
                    }`}
                  >
                    {log.status}
                  </span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{log.courseCode}</span>
                  <span className="text-slate-500 text-[10px]">({log.date})</span>
                </div>

                <button
                  onClick={() => onDeleteLog(log.id)}
                  className="text-slate-400 hover:text-rose-500 cursor-pointer p-0.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
