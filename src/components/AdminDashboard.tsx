import React, { useState, useEffect } from 'react';
import { X, Shield, Users, Activity, Database, AlertCircle, RefreshCw, FileText, CheckCircle, DollarSign, ToggleLeft, ToggleRight, Check } from 'lucide-react';
import { getAllUsers, getAllSystemActivities } from '../firebase/firestoreService';
import { UserProfile, SystemActivity } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<'users' | 'activity' | 'database' | 'adsense'>('users');
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [activities, setActivities] = useState<SystemActivity[]>([]);
  const [loading, setLoading] = useState(false);

  // AdSense Safe Config State (Section 34)
  const initialPublisherId =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADSENSE_PUBLISHER_ID) ||
    localStorage.getItem('adsense_pub_id') ||
    'ca-pub-XXXXXXXXXXXXXXXX';

  const [adsensePublisherId, setAdsensePublisherId] = useState(initialPublisherId);
  const [autoAdsEnabled, setAutoAdsEnabled] = useState(
    localStorage.getItem('adsense_auto_ads') !== 'false'
  );
  const [adsVisible, setAdsVisible] = useState(
    localStorage.getItem('adsense_visible') !== 'false'
  );
  const [adConfigSaved, setAdConfigSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [uList, aList] = await Promise.all([
        getAllUsers().catch(() => []),
        getAllSystemActivities().catch(() => []),
      ]);
      setUsers(uList);
      setActivities(aList);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAdConfig = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('adsense_pub_id', adsensePublisherId);
    localStorage.setItem('adsense_auto_ads', String(autoAdsEnabled));
    localStorage.setItem('adsense_visible', String(adsVisible));
    setAdConfigSaved(true);
    setTimeout(() => setAdConfigSaved(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-2 sm:p-4">
      <div className="w-full max-w-lg h-[90vh] flex flex-col rounded-3xl bg-slate-900 border border-purple-500/40 shadow-2xl overflow-hidden text-left">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white">Developer / Admin Control</h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">
                  Super Admin
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Database, AI Logs & AdSense Config</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={loadData}
              disabled={loading}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Admin Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 pt-2 gap-2 overflow-x-auto no-scrollbar">
          {[
            { id: 'users' as const, label: `Users (${users.length})`, icon: Users },
            { id: 'activity' as const, label: `AI Activity (${activities.length})`, icon: Activity },
            { id: 'adsense' as const, label: 'Google AdSense', icon: DollarSign },
            { id: 'database' as const, label: 'DB Architecture', icon: Database },
          ].map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-semibold border-b-2 whitespace-nowrap transition cursor-pointer ${
                  active
                    ? 'border-purple-500 text-purple-400 font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {tab === 'users' && (
            <div className="space-y-3">
              {users.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No active users found in Firestore yet.
                </div>
              ) : (
                users.map((u) => (
                  <div key={u.uid} className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white">{u.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                        🔥 {u.streak}d streak • {u.xp || 0} XP
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-mono truncate">{u.email}</p>
                    <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-300 pt-1 border-t border-slate-800/80">
                      <div>Goal: <strong className="text-purple-300">{u.careerGoal}</strong></div>
                      <div>Lang: <strong className="text-blue-300">{u.preferredLanguage}</strong></div>
                      <div>College: <strong className="text-emerald-300">{u.college || 'N/A'}</strong></div>
                      <div>Rating: <strong className="text-amber-300">{u.battleRating || 1200} ELO</strong></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'activity' && (
            <div className="space-y-2">
              {activities.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No system logs recorded yet.
                </div>
              ) : (
                activities.map((a, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-white">{a.action}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          a.status === 'success'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : a.status === 'warning'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {a.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 font-mono whitespace-pre-wrap">{a.details}</p>
                    <span className="text-[9px] text-slate-500 block mt-1">{a.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ADSENSE CONFIGURATION (Section 34, 35, 36) */}
          {tab === 'adsense' && (
            <div className="space-y-3.5">
              <div className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                <span className="font-bold text-amber-400 block text-xs">
                  Google AdSense Monetization Hub
                </span>
                <p className="leading-relaxed">
                  TechJourney AI supports your existing Google AdSense account. We never request your Google password or create duplicate accounts.
                </p>
              </div>

              <form onSubmit={handleSaveAdConfig} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 font-bold mb-1">
                    AdSense Publisher ID
                  </label>
                  <input
                    type="text"
                    value={adsensePublisherId}
                    onChange={(e) => setAdsensePublisherId(e.target.value)}
                    placeholder="ca-pub-XXXXXXXXXXXXXXXX"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                  />
                  <span className="text-[10px] text-slate-500 block mt-0.5">
                    Configured via VITE_ADSENSE_PUBLISHER_ID or saved locally.
                  </span>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div>
                    <span className="font-bold text-white block">Auto Ads</span>
                    <span className="text-[10px] text-slate-400">Let Google optimize ad placements automatically</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAutoAdsEnabled(!autoAdsEnabled)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      autoAdsEnabled ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {autoAdsEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div>
                    <span className="font-bold text-white block">Sponsored Learning Banners</span>
                    <span className="text-[10px] text-slate-400">Display verified resource banners in learning feeds</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAdsVisible(!adsVisible)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition cursor-pointer ${
                      adsVisible ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {adsVisible ? 'Active' : 'Muted'}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  {adConfigSaved ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>AdSense Configuration Saved!</span>
                    </>
                  ) : (
                    <span>Save AdSense Settings</span>
                  )}
                </button>
              </form>

              {/* Ad Placement Safety Audit (Section 36) */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5 text-xs">
                <span className="font-bold text-white text-xs block">
                  Ad Placement Non-Intrusive Safety Audit
                </span>
                <ul className="space-y-1 text-[11px] text-slate-300">
                  <li className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Coding editors and compilers are 100% ad-free.</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>Focus Mode strictly mutes all banners.</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>1v1 Competitive coding battles are uninterrupted.</span>
                  </li>
                  <li className="flex items-center gap-1.5 text-emerald-400">
                    <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>AI Mentor conversation drawer has zero interstitial interruptions.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {tab === 'database' && (
            <div className="space-y-3 text-xs text-slate-300">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h3 className="font-bold text-white text-xs flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-blue-400" />
                  <span>Firestore Collections Architecture</span>
                </h3>
                <div className="space-y-1 font-mono text-[11px] text-slate-400">
                  <p className="text-purple-300">/users/{'{userId}'} <span className="text-slate-500">(UserProfile, Passport)</span></p>
                  <p className="pl-3">├── /roadmaps/{'{roadmapId}'} <span className="text-slate-500">(Adaptive plans)</span></p>
                  <p className="pl-3">├── /dailyPlans/{'{planId}'} <span className="text-slate-500">(Day missions)</span></p>
                  <p className="pl-3">├── /problemAttempts/{'{attemptId}'} <span className="text-slate-500">(Multi-lang tests)</span></p>
                  <p className="pl-3">├── /quizAttempts/{'{quizId}'} <span className="text-slate-500">(Comprehension)</span></p>
                  <p className="pl-3">├── /studySessions/{'{sessionId}'} <span className="text-slate-500">(Time logs)</span></p>
                  <p className="pl-3">├── /progress/summary <span className="text-slate-500">(10-tier metrics)</span></p>
                  <p className="pl-3">├── /achievements/{'{badgeId}'} <span className="text-slate-500">(Unlocked badges)</span></p>
                  <p className="pl-3">├── /notifications/{'{notifId}'} <span className="text-slate-500">(Intelligent feeds)</span></p>
                  <p className="pl-3">└── /aiMemory/{'{memoryId}'} <span className="text-slate-500">(Mistake memory)</span></p>
                  <p className="text-purple-300 mt-2">/systemActivities/{'{id}'} <span className="text-slate-500">(Audit logs)</span></p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                <span className="font-bold text-white text-xs block">Zero-Trust Rules Status</span>
                <p className="text-emerald-400 font-mono text-[11px] flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Deployed with default catch-all denial & author integrity guards.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
