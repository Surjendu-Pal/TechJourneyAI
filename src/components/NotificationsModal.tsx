import React from 'react';
import { X, Bell, Sun, Sunset, Moon, Trophy, CheckCircle2, Clock } from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAsRead: (id?: string) => void;
  onTriggerScheduleDemo: (type: 'morning' | 'evening' | 'night') => void;
}

export const NotificationsModal: React.FC<NotificationsModalProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onTriggerScheduleDemo,
}) => {
  if (!isOpen) return null;

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'morning':
        return <Sun className="w-4 h-4 text-amber-400" />;
      case 'evening':
        return <Sunset className="w-4 h-4 text-orange-400" />;
      case 'night':
        return <Moon className="w-4 h-4 text-purple-400" />;
      case 'achievement':
        return <Trophy className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-0 sm:p-4">
      <div className="w-full max-w-md max-h-[85vh] flex flex-col rounded-t-3xl sm:rounded-3xl bg-slate-900 border border-slate-800 p-5 shadow-2xl relative text-left">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">Daily Mission Reminders</h2>
              <p className="text-[10px] text-slate-400">Scheduled Notifications Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scheduled trigger simulations */}
        <div className="mt-3 p-3 rounded-2xl bg-slate-950 border border-slate-800/80">
          <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1.5">
            Test Scheduled Cron Triggers
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              onClick={() => onTriggerScheduleDemo('morning')}
              className="px-2 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-300 text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer transition"
            >
              <Sun className="w-3 h-3" />
              <span>Morning</span>
            </button>
            <button
              onClick={() => onTriggerScheduleDemo('evening')}
              className="px-2 py-1.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 text-orange-300 text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer transition"
            >
              <Sunset className="w-3 h-3" />
              <span>Evening</span>
            </button>
            <button
              onClick={() => onTriggerScheduleDemo('night')}
              className="px-2 py-1.5 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-300 text-[11px] font-medium flex items-center justify-center gap-1 cursor-pointer transition"
            >
              <Moon className="w-3 h-3" />
              <span>Night</span>
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto mt-3 space-y-2.5">
          {notifications.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No notifications yet. Tap a button above to test morning or evening reminders!
            </div>
          ) : (
            notifications.map((n, idx) => (
              <div
                key={n.id || idx}
                onClick={() => onMarkAsRead(n.id)}
                className={`p-3 rounded-2xl border transition cursor-pointer text-left ${
                  n.isRead
                    ? 'bg-slate-950/60 border-slate-800/60 opacity-70'
                    : 'bg-slate-950 border-blue-500/40 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  <div className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 shrink-0 mt-0.5">
                    {getIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="text-xs font-bold text-white truncate">{n.title}</h4>
                      {!n.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{n.message}</p>
                    <span className="text-[9px] text-slate-500 block mt-1">
                      {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
