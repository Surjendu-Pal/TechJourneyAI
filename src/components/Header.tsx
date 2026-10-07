import React from 'react';
import { useAuth } from '../firebase/authContext';
import { Flame, Bot, Bell, Shield, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { DeveloperLevelInfo } from '../types';
import { TechJourneyLogo } from './TechJourneyLogo';

interface HeaderProps {
  streak: number;
  xp: number;
  levelInfo: DeveloperLevelInfo;
  onOpenMentorChat: () => void;
  onOpenNotifications: () => void;
  onOpenFocusMode?: () => void;
  unreadCount?: number;
  onOpenAdmin?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  streak,
  xp,
  levelInfo,
  onOpenMentorChat,
  onOpenNotifications,
  onOpenFocusMode,
  unreadCount = 0,
  onOpenAdmin,
}) => {
  const { user, isAdmin, isSuperAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-800/80 px-3.5 py-2">
      <div className="max-w-md mx-auto flex items-center justify-between gap-1.5">
        {/* Official Brand Logo */}
        <TechJourneyLogo size="sm" showText variant="icon" />

        {/* Right Badges & Triggers */}
        <div className="flex items-center gap-1.5">
          {/* XP Badge */}
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[11px] font-bold font-mono"
            title={`${xp} Total XP`}
          >
            <Zap className="w-3 h-3 text-blue-400 fill-blue-400" />
            <span>{xp}</span>
          </div>

          {/* Streak Badge */}
          <div
            className="flex items-center gap-0.5 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-[11px] font-bold"
            title={`${streak} Day Streak`}
          >
            <Flame className="w-3 h-3 fill-orange-500 text-orange-500 animate-pulse" />
            <span>{streak}d</span>
          </div>

          {/* Focus Mode Trigger */}
          {onOpenFocusMode && (
            <button
              onClick={onOpenFocusMode}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-indigo-400 hover:text-indigo-300 transition cursor-pointer"
              title="Focus Mode (Distraction-Free)"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Admin Icon if user is Admin */}
          {isAdmin && onOpenAdmin && (
            <button
              onClick={onOpenAdmin}
              className="p-1.5 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-400 hover:text-purple-300 transition cursor-pointer"
              title="Admin & AdSense Controls"
            >
              <Shield className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Notifications */}
          <button
            onClick={onOpenNotifications}
            className="relative p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-blue-600 text-white text-[8px] font-bold flex items-center justify-center border border-slate-950">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Mentor Socratic Chat */}
          <button
            onClick={onOpenMentorChat}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold shadow-sm shadow-blue-600/20 active:scale-95 transition cursor-pointer"
          >
            <Bot className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">AI Mentor</span>
          </button>
        </div>
      </div>
    </header>
  );
};
