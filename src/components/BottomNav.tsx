import React from 'react';
import { Home, BookOpen, Code2, Users2, TrendingUp, User } from 'lucide-react';

export type NavTab = 'home' | 'learn' | 'practice' | 'community' | 'progress' | 'profile';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  badgePractice?: number;
  badgeCommunity?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  badgePractice = 0,
  badgeCommunity = 0,
}) => {
  const tabs = [
    { id: 'home' as NavTab, label: 'Home', icon: Home },
    { id: 'learn' as NavTab, label: 'Learn', icon: BookOpen },
    { id: 'practice' as NavTab, label: 'Practice', icon: Code2, badge: badgePractice },
    { id: 'community' as NavTab, label: 'Social', icon: Users2, badge: badgeCommunity },
    { id: 'progress' as NavTab, label: 'Progress', icon: TrendingUp },
    { id: 'profile' as NavTab, label: 'Profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-xl border-t border-slate-800/80 px-1.5 py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
      <div className="max-w-md mx-auto grid grid-cols-6 gap-0.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'text-blue-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 active:scale-95'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {!!tab.badge && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-2 px-1 min-w-[14px] h-3.5 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-0.5 tracking-tight ${isActive ? 'text-blue-400' : 'text-slate-400'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-0.5 shadow-sm shadow-blue-500/50" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
