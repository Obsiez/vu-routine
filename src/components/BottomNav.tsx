import React from 'react';
import { Calendar, CalendarRange, CheckSquare, PieChart, Users } from 'lucide-react';

export type NavTab = 'today' | 'week' | 'tasks' | 'attendance' | 'faculty';

interface BottomNavProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  pendingTaskCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  pendingTaskCount,
}) => {
  const tabs: { id: NavTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'today', label: 'Today', icon: <Calendar className="w-4 h-4" /> },
    { id: 'week', label: 'Week', icon: <CalendarRange className="w-4 h-4" /> },
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare className="w-4 h-4" />, badge: pendingTaskCount },
    { id: 'attendance', label: 'Stats', icon: <PieChart className="w-4 h-4" /> },
    { id: 'faculty', label: 'Faculty', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 dark:bg-[#0a0a0b]/95 backdrop-blur-md border-t border-slate-200 dark:border-white/10 py-2 px-3 shadow-2xl">
      <div className="max-w-md mx-auto grid grid-cols-5 gap-1.5">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-2.5 px-1 border font-mono text-[9px] font-bold uppercase transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#ff3e00] text-black border-[#ff3e00] font-extrabold shadow-[0_0_12px_rgba(255,62,0,0.35)]'
                  : 'bg-slate-100 dark:bg-[#141416] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              <div className="relative">
                {tab.icon}
                {tab.badge && tab.badge > 0 ? (
                  <span className="absolute -top-1.5 -right-2 bg-[#ff3e00] text-black text-[8px] font-mono font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center border border-black">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                ) : null}
              </div>
              <span className="mt-0.5 tracking-wider text-[9px]">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
