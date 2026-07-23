import React from 'react';
import { AttendanceView } from './components/AttendanceView';
import { BottomNav, NavTab } from './components/BottomNav';
import { FacultyView } from './components/FacultyView';
import { Header } from './components/Header';
import { RemindersModal } from './components/RemindersModal';
import { RoomModal } from './components/RoomModal';
import { RoutineEditorModal } from './components/RoutineEditorModal';
import { TaskManager } from './components/TaskManager';
import { TaskModal } from './components/TaskModal';
import { TodayView } from './components/TodayView';
import { WeekView } from './components/WeekView';
import { DEFAULT_CLASS_SESSIONS, DEFAULT_TIME_SLOTS } from './data/defaultRoutine';
import { AttendanceLog, AttendanceStatus, ClassSession, DayOfWeek, ReminderSetting, TaskItem, TimeSlot } from './types';
import { playReminderChime, triggerVibration } from './utils/audioUtils';
import {
  getStoredAttendance,
  getStoredNotes,
  getStoredRemindersSetting,
  getStoredSessions,
  getStoredSlots,
  getStoredTasks,
  saveStoredAttendance,
  saveStoredNotes,
  saveStoredRemindersSetting,
  saveStoredSessions,
  saveStoredSlots,
  saveStoredTasks
} from './utils/storageUtils';
import { getCurrentMinutes, getDayNameFromDate, getISOFormattedDate } from './utils/timeUtils';

export default function App() {
  // Real Date Context
  const [realToday, setRealToday] = React.useState<DayOfWeek>(() => getDayNameFromDate(new Date()));
  const [currentMinutes, setCurrentMinutes] = React.useState<number>(() => getCurrentMinutes(new Date()));
  const [selectedDay, setSelectedDay] = React.useState<DayOfWeek>(() => getDayNameFromDate(new Date()));

  // Theme & Navigation
  const [activeTab, setActiveTab] = React.useState<NavTab>('today');
  const [darkMode, setDarkMode] = React.useState<boolean>(true);

  // Core Data
  const [sessions, setSessions] = React.useState<ClassSession[]>(() => getStoredSessions());
  const [slots, setSlots] = React.useState<TimeSlot[]>(() => getStoredSlots());
  const [tasks, setTasks] = React.useState<TaskItem[]>(() => getStoredTasks());
  const [attendanceLogs, setAttendanceLogs] = React.useState<AttendanceLog[]>(() => getStoredAttendance());
  const [reminderSetting, setReminderSetting] = React.useState<ReminderSetting>(() => getStoredRemindersSetting());
  const [notes, setNotes] = React.useState<Record<string, string>>(() => getStoredNotes());

  // Modal Controls
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState<boolean>(false);
  const [editingTask, setEditingTask] = React.useState<TaskItem | null>(null);
  const [taskInitialCourseCode, setTaskInitialCourseCode] = React.useState<string>('ECO 1101');
  const [isRemindersModalOpen, setIsRemindersModalOpen] = React.useState<boolean>(false);
  const [isRoutineEditorOpen, setIsRoutineEditorOpen] = React.useState<boolean>(false);
  const [activeRoomNumber, setActiveRoomNumber] = React.useState<string | null>(null);

  // Sync Dark Mode class on HTML document root
  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Live Timer & Reminders Check Interval
  React.useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const currDay = getDayNameFromDate(now);
      const currMins = getCurrentMinutes(now);
      setRealToday(currDay);
      setCurrentMinutes(currMins);

      // Check upcoming class slots for lead time audio chime
      if (reminderSetting.soundEnabled) {
        const todaySessions = sessions.filter((s) => s.day === currDay);
        for (const s of todaySessions) {
          const slot = slots.find((ts) => ts.id === s.slotId);
          if (slot) {
            const timeDiff = slot.startMinutes - currMins;
            if (timeDiff === reminderSetting.leadMinutes) {
              playReminderChime('class');
              triggerVibration();
            }
          }
        }
      }
    }, 15000);

    return () => clearInterval(timer);
  }, [sessions, slots, reminderSetting]);

  // Save changes to localStorage
  React.useEffect(() => {
    saveStoredSessions(sessions);
  }, [sessions]);

  React.useEffect(() => {
    saveStoredSlots(slots);
  }, [slots]);

  React.useEffect(() => {
    saveStoredTasks(tasks);
  }, [tasks]);

  React.useEffect(() => {
    saveStoredAttendance(attendanceLogs);
  }, [attendanceLogs]);

  React.useEffect(() => {
    saveStoredRemindersSetting(reminderSetting);
  }, [reminderSetting]);

  React.useEffect(() => {
    saveStoredNotes(notes);
  }, [notes]);

  // Handlers for Tasks
  const handleSaveTask = (taskData: Omit<TaskItem, 'id' | 'createdAt'>) => {
    if (editingTask) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === editingTask.id
            ? { ...t, ...taskData }
            : t
        )
      );
      setEditingTask(null);
    } else {
      const newTask: TaskItem = {
        ...taskData,
        id: 'task-' + Date.now(),
        createdAt: new Date().toISOString()
      };
      setTasks((prev) => [newTask, ...prev]);
    }
  };

  const handleToggleTaskComplete = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextCompleted = !t.completed;
          if (nextCompleted && reminderSetting.soundEnabled) {
            playReminderChime('task');
          }
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
  };

  const handleToggleSubtaskComplete = (taskId: string, subtaskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updatedSub = t.subtasks.map((st) =>
            st.id === subtaskId ? { ...st, done: !st.done } : st
          );
          return { ...t, subtasks: updatedSub };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const handleOpenNewTaskModal = (courseCode?: string) => {
    setEditingTask(null);
    setTaskInitialCourseCode(courseCode || 'ECO 1101');
    setIsTaskModalOpen(true);
  };

  const handleEditTask = (task: TaskItem) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  // Handlers for Attendance
  const handleMarkAttendance = (
    courseCode: string,
    slotId: number,
    status: AttendanceStatus
  ) => {
    const todayDateStr = getISOFormattedDate();
    setAttendanceLogs((prev) => {
      const filtered = prev.filter(
        (a) => !(a.courseCode === courseCode && a.slotId === slotId && a.date === todayDateStr)
      );
      const newLog: AttendanceLog = {
        id: 'att-' + Date.now(),
        date: todayDateStr,
        courseCode,
        slotId,
        status,
        timestamp: Date.now()
      };
      return [...filtered, newLog];
    });
  };

  const handleDeleteAttendanceLog = (logId: string) => {
    setAttendanceLogs((prev) => prev.filter((l) => l.id !== logId));
  };

  const handleClearAttendanceLogs = () => {
    if (window.confirm('Are you sure you want to clear all attendance history?')) {
      setAttendanceLogs([]);
    }
  };

  // Handlers for Routine Editor
  const handleSaveSession = (updatedSession: ClassSession) => {
    setSessions((prev) => {
      const filtered = prev.filter((s) => s.id !== updatedSession.id);
      return [...filtered, updatedSession];
    });
    setIsRoutineEditorOpen(false);
  };

  const handleDeleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== sessionId));
    setIsRoutineEditorOpen(false);
  };

  const handleResetRoutine = () => {
    if (window.confirm('Reset schedule back to official Economics department routine?')) {
      setSessions(DEFAULT_CLASS_SESSIONS);
      setSlots(DEFAULT_TIME_SLOTS);
      setIsRoutineEditorOpen(false);
    }
  };

  const handleSaveNote = (sessionId: string, note: string) => {
    setNotes((prev) => ({ ...prev, [sessionId]: note }));
  };

  const isTodaySimulated = selectedDay !== realToday;

  return (
    <div className="select-none min-h-screen bg-slate-100 dark:bg-[#0a0a0b] text-slate-900 dark:text-slate-200 font-sans transition-colors">
      {/* Top Bar Header */}
      <Header
        currentDay={realToday}
        selectedDay={selectedDay}
        setSelectedDay={setSelectedDay}
        isTodaySimulated={isTodaySimulated}
        resetToRealToday={() => setSelectedDay(realToday)}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        sessions={sessions}
        slots={slots}
        onOpenReminders={() => setIsRemindersModalOpen(true)}
        onOpenEditor={() => setIsRoutineEditorOpen(true)}
      />

      {/* Main Responsive Body Container */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 pt-4">
        {activeTab === 'today' && (
          <TodayView
            selectedDay={selectedDay}
            setSelectedDay={setSelectedDay}
            currentDay={realToday}
            isTodaySimulated={isTodaySimulated}
            resetToRealToday={() => setSelectedDay(realToday)}
            currentMinutes={currentMinutes}
            sessions={sessions}
            slots={slots}
            attendanceLogs={attendanceLogs}
            onMarkAttendance={handleMarkAttendance}
            onAddTaskForCourse={handleOpenNewTaskModal}
            notes={notes}
            onSaveNote={handleSaveNote}
            onOpenRoomModal={(room) => setActiveRoomNumber(room)}
          />
        )}

        {activeTab === 'week' && (
          <WeekView
            sessions={sessions}
            slots={slots}
            onOpenEditor={() => setIsRoutineEditorOpen(true)}
            onResetRoutine={handleResetRoutine}
            onSelectDay={(day) => {
              setSelectedDay(day);
              setActiveTab('today');
            }}
            onOpenRoomModal={(room) => setActiveRoomNumber(room)}
            onAddTaskForCourse={(code) => handleOpenNewTaskModal(code)}
          />
        )}

        {activeTab === 'tasks' && (
          <TaskManager
            tasks={tasks}
            onToggleTaskComplete={handleToggleTaskComplete}
            onToggleSubtaskComplete={handleToggleSubtaskComplete}
            onDeleteTask={handleDeleteTask}
            onOpenNewTaskModal={handleOpenNewTaskModal}
            onEditTask={handleEditTask}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceView
            logs={attendanceLogs}
            onClearLogs={handleClearAttendanceLogs}
            onDeleteLog={handleDeleteAttendanceLog}
          />
        )}

        {activeTab === 'faculty' && (
          <FacultyView onOpenRoomModal={(room) => setActiveRoomNumber(room)} />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingTaskCount={tasks.filter((t) => !t.completed).length}
      />

      {/* Task Creation & Editing Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        onSaveTask={handleSaveTask}
        initialCourseCode={taskInitialCourseCode}
        editingTask={editingTask}
      />

      {/* Reminders & Audio Chime Settings Modal */}
      <RemindersModal
        isOpen={isRemindersModalOpen}
        onClose={() => setIsRemindersModalOpen(false)}
        setting={reminderSetting}
        onSaveSetting={(newSetting) => setReminderSetting(newSetting)}
      />

      {/* Classroom Room Details Modal */}
      <RoomModal
        roomNumber={activeRoomNumber}
        onClose={() => setActiveRoomNumber(null)}
        sessions={sessions}
      />

      {/* Routine Customization Modal */}
      <RoutineEditorModal
        isOpen={isRoutineEditorOpen}
        onClose={() => setIsRoutineEditorOpen(false)}
        sessions={sessions}
        slots={slots}
        onSaveSession={handleSaveSession}
        onDeleteSession={handleDeleteSession}
        onResetRoutine={handleResetRoutine}
      />
    </div>
  );
}
