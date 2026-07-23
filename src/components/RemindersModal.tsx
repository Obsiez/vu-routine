import React from 'react';
import { Bell, Volume2, X } from 'lucide-react';
import { ReminderSetting } from '../types';
import { playReminderChime } from '../utils/audioUtils';

interface RemindersModalProps {
  isOpen: boolean;
  onClose: () => void;
  setting: ReminderSetting;
  onSaveSetting: (s: ReminderSetting) => void;
}

export const RemindersModal: React.FC<RemindersModalProps> = ({
  isOpen,
  onClose,
  setting,
  onSaveSetting
}) => {
  const [leadMinutes, setLeadMinutes] = React.useState<number>(setting.leadMinutes);
  const [soundEnabled, setSoundEnabled] = React.useState<boolean>(setting.soundEnabled);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState<boolean>(
    setting.notificationsEnabled
  );
  const [notifPermission, setNotifPermission] = React.useState<string>(
    'Notification' in window ? Notification.permission : 'unsupported'
  );

  React.useEffect(() => {
    setLeadMinutes(setting.leadMinutes);
    setSoundEnabled(setting.soundEnabled);
    setNotificationsEnabled(setting.notificationsEnabled);
  }, [isOpen, setting]);

  if (!isOpen) return null;

  const handleRequestNotification = async () => {
    if ('Notification' in window) {
      const res = await Notification.requestPermission();
      setNotifPermission(res);
      if (res === 'granted') {
        setNotificationsEnabled(true);
        new Notification('Class Routine Reminders Active', {
          body: 'You will receive reminders before your economics classes!'
        });
      }
    }
  };

  const handleSave = () => {
    onSaveSetting({
      leadMinutes,
      soundEnabled,
      notificationsEnabled,
      vibrateEnabled: true
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-mono">
      <div className="bg-white dark:bg-[#141416] border border-slate-200 dark:border-white/10 p-5 max-w-md w-full space-y-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-white/10 pb-3">
          <h3 className="font-syne font-extrabold text-base uppercase text-slate-900 dark:text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#ff3e00]" /> Class & Task Reminders
          </h3>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lead Minutes */}
        <div className="space-y-2 text-xs">
          <label className="block font-bold text-slate-700 dark:text-slate-300">
            Reminder Lead Time (Before Class Starts):
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[5, 10, 15, 30].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setLeadMinutes(mins)}
                className={`py-1.5 text-center font-bold border cursor-pointer transition-all text-xs ${
                  leadMinutes === mins
                    ? 'bg-[#ff3e00] text-black border-[#ff3e00] font-extrabold'
                    : 'bg-slate-100 dark:bg-[#0a0a0b] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {mins} mins
              </button>
            ))}
          </div>
        </div>

        {/* Sound Toggle & Test */}
        <div className="space-y-2.5 pt-3 border-t border-slate-200 dark:border-white/10 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 dark:text-slate-300">Audio Chime Sound:</span>
            <button
              type="button"
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`px-3 py-1 font-bold border cursor-pointer text-xs ${
                soundEnabled
                  ? 'bg-[#ff3e00]/20 text-[#ff3e00] border-[#ff3e00]/40'
                  : 'bg-slate-100 dark:bg-[#0a0a0b] text-slate-500 border-slate-200 dark:border-white/10'
              }`}
            >
              {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => playReminderChime('class')}
            className="w-full py-2 bg-slate-100 dark:bg-[#0a0a0b] text-[#ff3e00] font-bold border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-[#232326] cursor-pointer flex items-center justify-center gap-2 text-xs"
          >
            <Volume2 className="w-4 h-4" /> Test Bell Chime Sound
          </button>
        </div>

        {/* Browser Notifications Permission */}
        <div className="space-y-2.5 pt-3 border-t border-slate-200 dark:border-white/10 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700 dark:text-slate-300">System Notifications:</span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 border uppercase ${
                notifPermission === 'granted'
                  ? 'bg-[#ff3e00]/20 text-[#ff3e00] border-[#ff3e00]/40'
                  : 'bg-amber-500/20 text-amber-500 dark:text-amber-400 border-amber-500/40'
              }`}
            >
              {notifPermission}
            </span>
          </div>

          {notifPermission !== 'granted' && (
            <button
              type="button"
              onClick={handleRequestNotification}
              className="w-full py-2 bg-[#ff3e00]/20 text-[#ff3e00] font-bold border border-[#ff3e00]/40 hover:bg-[#ff3e00]/30 cursor-pointer text-center text-xs"
            >
              Request Browser Notification Permission
            </button>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-bold font-mono bg-slate-100 dark:bg-[#0a0a0b] text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-white/10 hover:text-slate-900 dark:hover:text-white cursor-pointer transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-bold font-mono bg-[#ff3e00] text-black border border-[#ff3e00] hover:bg-[#e03700] cursor-pointer transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
