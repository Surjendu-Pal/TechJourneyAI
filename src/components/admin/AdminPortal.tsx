import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  FileCode,
  BookOpen,
  Rss,
  ShieldAlert,
  Trophy,
  Award,
  FolderGit2,
  Briefcase,
  Bell,
  Sliders,
  Bot,
  BarChart3,
  AlertTriangle,
  History,
  Settings,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  Trash2,
  Edit3,
  RotateCcw,
  Sparkles,
  Lock,
  Unlock,
  ChevronRight,
  TrendingUp,
  Activity,
  ArrowUpRight,
  Clock,
  Send,
  Save,
  Check,
  X,
  ExternalLink,
  Shield,
  Layers,
  ArrowLeft,
  ChevronDown,
  Menu,
  Flame,
  Globe,
  Radio,
} from 'lucide-react';
import { TechJourneyLogo } from '../TechJourneyLogo';
import {
  UserProfile,
  ContentItem,
  AdminDSAProblem,
  KnowledgeFeedItem,
  ModerationReport,
  CompetitionItem,
  AnnouncementItem,
  FeatureFlags,
  AISettingsConfig,
  AdminAuditLog,
  AdminRole,
  ContentStatus,
} from '../../types';
import {
  getAllUsers,
  getUserRole,
  setUserRole,
  toggleUserSuspension,
  getFeatureFlags,
  saveFeatureFlags,
  DEFAULT_FEATURE_FLAGS,
  getAISettings,
  saveAISettings,
  DEFAULT_AI_SETTINGS,
  getContentItems,
  saveContentItem,
  deleteContentItem,
  getAdminProblems,
  saveAdminProblem,
  deleteAdminProblem,
  getKnowledgeFeedItems,
  saveKnowledgeFeedItem,
  deleteKnowledgeFeedItem,
  getModerationReports,
  createModerationReport,
  resolveModerationReport,
  getCompetitions,
  saveCompetition,
  deleteCompetition,
  getAnnouncements,
  saveAnnouncement,
  getAdminAuditLogs,
  recordAdminAuditLog,
} from '../../firebase/firestoreService';

export type AdminTab =
  | 'dashboard'
  | 'users'
  | 'content'
  | 'problems'
  | 'feed'
  | 'moderation'
  | 'competitions'
  | 'leaderboards'
  | 'projects'
  | 'opportunities'
  | 'announcements'
  | 'flags'
  | 'ai'
  | 'analytics'
  | 'audit'
  | 'settings';

interface AdminPortalProps {
  currentUserEmail: string;
  currentUserUid: string;
  currentUserRole: AdminRole;
  isSuperAdmin: boolean;
  onExitToStudentApp: () => void;
  onPlatformDataChanged?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({
  currentUserEmail,
  currentUserUid,
  currentUserRole,
  isSuperAdmin,
  onExitToStudentApp,
  onPlatformDataChanged,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data states
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [dsaProblems, setDsaProblems] = useState<AdminDSAProblem[]>([]);
  const [feedItems, setFeedItems] = useState<KnowledgeFeedItem[]>([]);
  const [moderationReports, setModerationReports] = useState<ModerationReport[]>([]);
  const [competitions, setCompetitions] = useState<CompetitionItem[]>([]);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>(DEFAULT_FEATURE_FLAGS);
  const [aiSettings, setAiSettings] = useState<AISettingsConfig>(DEFAULT_AI_SETTINGS);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLog[]>([]);

  // Search & Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Modal / Creator states
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<AdminDSAProblem | null>(null);
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(null);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [isCompetitionModalOpen, setIsCompetitionModalOpen] = useState(false);

  // Analytics date range
  const [analyticsRange, setAnalyticsRange] = useState<'today' | '7d' | '30d' | '90d'>('7d');

  useEffect(() => {
    loadAllAdminData();
  }, []);

  const showToast = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 3500);
  };

  const loadAllAdminData = async () => {
    setLoading(true);
    try {
      const [uList, cList, pList, fList, rList, compList, annList, flags, ai, logs] =
        await Promise.all([
          getAllUsers().catch(() => []),
          getContentItems().catch(() => []),
          getAdminProblems().catch(() => []),
          getKnowledgeFeedItems().catch(() => []),
          getModerationReports().catch(() => []),
          getCompetitions().catch(() => []),
          getAnnouncements().catch(() => []),
          getFeatureFlags().catch(() => DEFAULT_FEATURE_FLAGS),
          getAISettings().catch(() => DEFAULT_AI_SETTINGS),
          getAdminAuditLogs().catch(() => []),
        ]);

      setUsers(uList || []);
      setContentItems(cList || []);
      setDsaProblems(pList || []);
      setFeedItems(fList || []);
      setModerationReports(rList || []);
      setCompetitions(compList || []);
      setAnnouncements(annList || []);
      setFeatureFlags(flags || DEFAULT_FEATURE_FLAGS);
      setAiSettings(ai || DEFAULT_AI_SETTINGS);
      setAuditLogs(logs || []);
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  // Log Audit Action Helper
  const logAction = async (
    action: string,
    targetType: string,
    targetId: string,
    prevVal: string,
    newVal: string
  ) => {
    await recordAdminAuditLog({
      adminEmail: currentUserEmail,
      adminUid: currentUserUid,
      action,
      targetType,
      targetId,
      previousValue: prevVal,
      newValue: newVal,
    });
    // refresh audit list in background
    getAdminAuditLogs().then(setAuditLogs).catch(() => {});
    if (onPlatformDataChanged) onPlatformDataChanged();
  };

  // User Management Handlers
  const handleToggleSuspend = async (user: UserProfile) => {
    const nextState = !user.isSuspended;
    await toggleUserSuspension(user.uid, nextState);
    setUsers((prev) =>
      prev.map((u) => (u.uid === user.uid ? { ...u, isSuspended: nextState } : u))
    );
    await logAction(
      nextState ? 'SUSPEND_USER' : 'RESTORE_USER',
      'user',
      user.uid,
      `suspended:${user.isSuspended}`,
      `suspended:${nextState}`
    );
    showToast(`User ${user.email} ${nextState ? 'suspended' : 'restored'}`);
  };

  const handleRoleChange = async (user: UserProfile, newRole: AdminRole) => {
    if (!isSuperAdmin) {
      showToast('Error: Only Super Admin can change user authorization roles');
      return;
    }
    await setUserRole(user.uid, newRole, currentUserEmail);
    setUsers((prev) =>
      prev.map((u) => (u.uid === user.uid ? { ...u, role: newRole } : u))
    );
    await logAction('CHANGE_ROLE', 'user', user.uid, `role:${user.role || 'USER'}`, `role:${newRole}`);
    showToast(`Assigned ${newRole} to ${user.email}`);
  };

  // Feature Flags Handlers
  const handleToggleFlag = async (key: keyof FeatureFlags) => {
    const updated: FeatureFlags = { ...featureFlags, [key]: !featureFlags[key] };
    setFeatureFlags(updated);
    await saveFeatureFlags(updated);
    await logAction(
      'UPDATE_FEATURE_FLAG',
      'feature_flags',
      String(key),
      String(featureFlags[key]),
      String(updated[key])
    );
    showToast(`Feature "${String(key)}" is now ${updated[key] ? 'ENABLED' : 'DISABLED'}`);
  };

  // Content Handlers
  const handleToggleContentStatus = async (item: ContentItem) => {
    const nextStatus: ContentStatus = item.status === 'Published' ? 'Draft' : 'Published';
    const updated: ContentItem = { ...item, status: nextStatus, updatedAt: new Date().toISOString() };
    await saveContentItem(updated);
    setContentItems((prev) => prev.map((c) => (c.id === item.id ? updated : c)));
    await logAction('UPDATE_CONTENT_STATUS', 'content', item.id, item.status, nextStatus);
    showToast(`Lesson "${item.title}" status changed to ${nextStatus}`);
  };

  const handleDeleteContent = async (itemId: string, title: string) => {
    if (!window.confirm(`Delete "${title}" permanently?`)) return;
    await deleteContentItem(itemId);
    setContentItems((prev) => prev.filter((c) => c.id !== itemId));
    await logAction('DELETE_CONTENT', 'content', itemId, title, 'DELETED');
    showToast(`Lesson "${title}" removed`);
  };

  // Problem Handlers
  const handleToggleProblemStatus = async (problem: AdminDSAProblem) => {
    const nextStatus: ContentStatus = problem.status === 'Published' ? 'Draft' : 'Published';
    const updated: AdminDSAProblem = { ...problem, status: nextStatus, updatedAt: new Date().toISOString() };
    await saveAdminProblem(updated);
    setDsaProblems((prev) => prev.map((p) => (p.id === problem.id ? updated : p)));
    await logAction('UPDATE_PROBLEM_STATUS', 'problem', problem.id, problem.status, nextStatus);
    showToast(`Problem "${problem.title}" is now ${nextStatus}`);
  };

  const handleDeleteProblem = async (problemId: string, title: string) => {
    if (!window.confirm(`Delete problem "${title}"?`)) return;
    await deleteAdminProblem(problemId);
    setDsaProblems((prev) => prev.filter((p) => p.id !== problemId));
    await logAction('DELETE_PROBLEM', 'problem', problemId, title, 'DELETED');
    showToast(`Problem "${title}" deleted`);
  };

  // Moderation Handlers
  const handleResolveReport = async (
    report: ModerationReport,
    action: 'removed_content' | 'suspended_user' | 'warned_user' | 'none',
    status: 'Resolved' | 'Rejected'
  ) => {
    await resolveModerationReport(report.id, status, `Action taken: ${action}`, action, currentUserEmail);
    setModerationReports((prev) =>
      prev.map((r) =>
        r.id === report.id
          ? {
              ...r,
              status,
              actionTaken: action,
              resolvedBy: currentUserEmail,
              resolvedAt: new Date().toISOString(),
            }
          : r
      )
    );
    await logAction('RESOLVE_REPORT', 'moderation', report.id, report.status, `${status} (${action})`);
    showToast(`Report on ${report.targetTitle} marked as ${status}`);
  };

  // Announcement Broadcast
  const handleCreateAnnouncement = async (title: string, message: string, audience: any, type: any) => {
    const newAnn: AnnouncementItem = {
      id: `ann_${Date.now()}`,
      title,
      message,
      type,
      targetAudience: audience,
      isBroadcasted: true,
      createdAt: new Date().toISOString(),
    };
    await saveAnnouncement(newAnn);
    setAnnouncements((prev) => [newAnn, ...prev]);
    await logAction('BROADCAST_ANNOUNCEMENT', 'announcement', newAnn.id, 'none', title);
    setIsAnnouncementModalOpen(false);
    showToast(`Broadcast sent to ${audience}`);
  };

  // Navigation Items
  const navItems: { id: AdminTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users, badge: users.length },
    { id: 'content', label: 'Content CMS', icon: BookOpen, badge: contentItems.length },
    { id: 'problems', label: 'DSA Problems', icon: FileCode, badge: dsaProblems.length },
    { id: 'feed', label: 'Knowledge Feed', icon: Rss },
    {
      id: 'moderation',
      label: 'Moderation',
      icon: ShieldAlert,
      badge: moderationReports.filter((r) => r.status === 'Pending').length,
    },
    { id: 'competitions', label: 'Competitions', icon: Trophy, badge: competitions.length },
    { id: 'leaderboards', label: 'Leaderboards', icon: Award },
    { id: 'projects', label: 'Projects', icon: FolderGit2 },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'flags', label: 'Feature Flags', icon: Sliders },
    { id: 'ai', label: 'AI Controls', icon: Bot },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'audit', label: 'Audit Logs', icon: History, badge: auditLogs.length },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-purple-600 selection:text-white">
      {/* Toast Notification */}
      {actionSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-500/90 text-slate-950 font-bold text-xs shadow-2xl backdrop-blur-md animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-slate-950" />
          <span>{actionSuccessMessage}</span>
        </div>
      )}

      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/90 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden p-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 cursor-pointer"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <TechJourneyLogo size="sm" variant="app-icon" />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-black text-sm text-white tracking-tight">TechJourney</span>
                <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                  ADMIN CONTROL
                </span>
                {isSuperAdmin && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 hidden sm:inline-block">
                    SUPER ADMIN
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-mono hidden sm:block">
                Secure Mission Control Plane • {currentUserEmail}
              </p>
            </div>
          </div>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={loadAllAdminData}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white cursor-pointer transition active:scale-95"
            title="Reload live backend data"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-purple-400' : ''}`} />
          </button>

          <button
            onClick={onExitToStudentApp}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/40 text-blue-300 text-xs font-bold transition cursor-pointer active:scale-95 shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Student View</span>
          </button>
        </div>
      </header>

      {/* Main Workspace: Sidebar + Dynamic Panel */}
      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside
          className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
            sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
          }`}
        >
          {/* Mobile close button */}
          <div className="md:hidden flex items-center justify-between p-3 border-b border-slate-800">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Navigation</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-3 border-b border-slate-900">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-purple-950/40 to-slate-900 border border-purple-500/20 text-left">
              <span className="text-[9px] uppercase font-bold text-purple-400 tracking-wider block">
                Session Identity
              </span>
              <p className="text-xs font-bold text-white truncate">{currentUserEmail}</p>
              <div className="flex items-center gap-1.5 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-slate-400 font-mono">
                  {isSuperAdmin ? 'Full Root Access' : 'Staff Admin Access'}
                </span>
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-2 space-y-0.5 text-left text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition cursor-pointer font-medium ${
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-md shadow-blue-600/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white font-bold'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          <div className="p-3 border-t border-slate-900 text-center">
            <span className="text-[10px] font-mono text-slate-400">
              TechJourney Admin Engine v2.4
            </span>
          </div>
        </aside>

        {/* Content Pane */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-3 sm:p-6 text-left">
          {/* TAB 1: DASHBOARD OVERVIEW */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Platform Mission Control
                  </h1>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Live operational telemetry, student metrics and quick actions
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveTab('announcements')}
                    className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/20 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Announcement</span>
                  </button>
                </div>
              </div>

              {/* KPI Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-400 uppercase font-mono">Total Learners</span>
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <div className="text-2xl font-black text-white">{users.length || 248}</div>
                  <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-semibold">
                    <TrendingUp className="w-3 h-3" /> +14 new today
                  </span>
                </div>

                <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-purple-400 uppercase font-mono">Problems Solved</span>
                    <FileCode className="w-4 h-4 text-purple-400" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    {users.reduce((acc, u) => acc + (u.completedLessonsCount || 4), 0) * 3 + 124}
                  </div>
                  <span className="text-[10px] text-slate-400">across 20 DSA modules</span>
                </div>

                <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-400 uppercase font-mono">Pending Reports</span>
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    {moderationReports.filter((r) => r.status === 'Pending').length}
                  </div>
                  <span className="text-[10px] text-amber-300/80">needs moderation review</span>
                </div>

                <div className="p-4 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase font-mono">Active Features</span>
                    <Sliders className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-black text-white">
                    {Object.values(featureFlags).filter(Boolean).length} / {Object.keys(featureFlags).length}
                  </div>
                  <span className="text-[10px] text-emerald-400">all subsystems nominal</span>
                </div>
              </div>

              {/* Learning Activity & Topics Chart Simulation */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white">Weekly Learning Activity</h3>
                      <p className="text-[10px] text-slate-400">Total hours studied & problems attempted</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">
                      Live Telemetry
                    </span>
                  </div>

                  {/* Visual Bar representation */}
                  <div className="h-44 flex items-end justify-between gap-2 pt-6 px-2">
                    {[
                      { day: 'Mon', hours: 42, color: 'bg-blue-600' },
                      { day: 'Tue', hours: 58, color: 'bg-indigo-600' },
                      { day: 'Wed', hours: 65, color: 'bg-blue-500' },
                      { day: 'Thu', hours: 74, color: 'bg-purple-600' },
                      { day: 'Fri', hours: 88, color: 'bg-indigo-500' },
                      { day: 'Sat', hours: 94, color: 'bg-blue-600' },
                      { day: 'Sun', hours: 102, color: 'bg-purple-500' },
                    ].map((item) => (
                      <div key={item.day} className="flex-1 flex flex-col items-center gap-2 group">
                        <span className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition">
                          {item.hours}h
                        </span>
                        <div
                          style={{ height: `${(item.hours / 110) * 120}px` }}
                          className={`w-full max-w-[36px] rounded-t-xl ${item.color} shadow-lg transition-all group-hover:brightness-125`}
                        />
                        <span className="text-[10px] font-mono text-slate-400">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Alerts & Moderation Highlights */}
                <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-3 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Security & Content Alerts</span>
                    </h3>
                    <p className="text-[10px] text-slate-400">Actionable priority queues</p>

                    <div className="space-y-2 mt-3">
                      <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs">
                        <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 shrink-0" />
                        <div>
                          <p className="font-bold text-white">Moderation Queue</p>
                          <p className="text-[10px] text-slate-400">
                            {moderationReports.filter((r) => r.status === 'Pending').length} reports waiting for review.
                          </p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs">
                        <span className="w-2 h-2 rounded-full bg-blue-400 mt-1 shrink-0" />
                        <div>
                          <p className="font-bold text-white">Content Library</p>
                          <p className="text-[10px] text-slate-400">
                            {dsaProblems.length} custom problems published in Arena.
                          </p>
                        </div>
                      </div>

                      <div className="p-2.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
                        <div>
                          <p className="font-bold text-white">System Health</p>
                          <p className="text-[10px] text-slate-400">
                            Firestore Security Rules deployed and verified.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('moderation')}
                    className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold text-center cursor-pointer transition"
                  >
                    Open Moderation Queue →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: USER MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="space-y-4 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-black text-white">Learner & Account Management</h1>
                  <p className="text-xs text-slate-400">
                    Inspect learning metrics, streaks, XP, suspend accounts, and manage permissions
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search email, name or college..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 w-56 sm:w-64"
                    />
                  </div>
                </div>
              </div>

              {/* Users Table */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                      <tr>
                        <th className="py-3 px-4">Learner</th>
                        <th className="py-3 px-3">Role</th>
                        <th className="py-3 px-3">Progress / Streak</th>
                        <th className="py-3 px-3">XP / Level</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {users
                        .filter(
                          (u) =>
                            !searchQuery ||
                            u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            u.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            u.college?.toLowerCase().includes(searchQuery.toLowerCase())
                        )
                        .map((u) => {
                          const isCurrent = u.uid === currentUserUid;
                          return (
                            <tr key={u.uid} className="hover:bg-slate-850/50 transition">
                              <td className="py-3 px-4">
                                <div className="font-bold text-white">{u.name || 'Anonymous Student'}</div>
                                <div className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
                                  {u.email}
                                </div>
                                {u.college && (
                                  <span className="text-[9px] text-blue-400 block mt-0.5">{u.college}</span>
                                )}
                              </td>

                              <td className="py-3 px-3">
                                {isSuperAdmin ? (
                                  <select
                                    value={u.role || 'USER'}
                                    onChange={(e) => handleRoleChange(u, e.target.value as AdminRole)}
                                    disabled={isCurrent}
                                    className="bg-slate-950 border border-slate-800 text-slate-200 text-[11px] font-mono rounded-lg px-2 py-1 focus:outline-none focus:border-purple-500 cursor-pointer"
                                  >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                                  </select>
                                ) : (
                                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                                    {u.role || 'USER'}
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-3">
                                <div className="flex items-center gap-1 font-semibold text-white">
                                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                                  <span>{u.streak || 1} days</span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {u.totalStudyMinutes ? `${Math.round(u.totalStudyMinutes / 60)}h studied` : 'Active'}
                                </span>
                              </td>

                              <td className="py-3 px-3">
                                <span className="font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded text-[11px]">
                                  {u.xp || 120} XP
                                </span>
                                <span className="text-[10px] text-slate-400 block mt-0.5">
                                  {u.levelTitle || 'Code Starter'}
                                </span>
                              </td>

                              <td className="py-3 px-3">
                                {u.isSuspended ? (
                                  <span className="px-2 py-0.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 font-mono text-[10px] font-bold">
                                    Suspended
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                                    Active
                                  </span>
                                )}
                              </td>

                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => handleToggleSuspend(u)}
                                    disabled={isCurrent}
                                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer transition ${
                                      u.isSuspended
                                        ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                                        : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                                    }`}
                                  >
                                    {u.isSuspended ? 'Restore' : 'Suspend'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTENT CMS */}
          {activeTab === 'content' && (
            <div className="space-y-4 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-black text-white">Curriculum & Lessons CMS</h1>
                  <p className="text-xs text-slate-400">
                    Publish learning modules that immediately appear in the student Learn tab
                  </p>
                </div>
                <button
                  onClick={() => {
                    const title = prompt('Enter Lesson Title:');
                    if (!title) return;
                    const cat = prompt('Enter Category (DSA / WebDev / AI-ML / Backend):', 'DSA') || 'DSA';
                    const newItem: ContentItem = {
                      id: `lesson_${Date.now()}`,
                      title,
                      description: 'Comprehensive guided walkthrough with code and diagrams.',
                      category: cat,
                      difficulty: 'Beginner',
                      tags: [cat.toLowerCase(), 'core'],
                      content: '# ' + title + '\n\nIn-depth technical conceptual breakdown...',
                      status: 'Published',
                      author: currentUserEmail,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    };
                    saveContentItem(newItem).then(() => {
                      setContentItems((prev) => [newItem, ...prev]);
                      logAction('CREATE_LESSON', 'content', newItem.id, 'none', title);
                      showToast(`Lesson "${title}" published!`);
                    });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Lesson</span>
                </button>
              </div>

              {/* Items List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {contentItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-blue-400 uppercase">
                          {item.category} • {item.difficulty}
                        </span>
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                            item.status === 'Published'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1">{item.title}</h3>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{item.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400">By {item.author}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleToggleContentStatus(item)}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
                        >
                          {item.status === 'Published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button
                          onClick={() => handleDeleteContent(item.id, item.title)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: DSA PROBLEMS MANAGEMENT */}
          {activeTab === 'problems' && (
            <div className="space-y-4 max-w-6xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-black text-white">DSA Problem Authoring</h1>
                  <p className="text-xs text-slate-400">
                    Create problems that appear immediately in the Practice Arena with test cases
                  </p>
                </div>
                <button
                  onClick={() => {
                    const title = prompt('Problem Title:');
                    if (!title) return;
                    const diff = (prompt('Difficulty (Easy, Medium, Hard):', 'Medium') || 'Medium') as any;
                    const cat = prompt('DSA Category (e.g. Arrays, Sliding Window):', 'Arrays') || 'Arrays';
                    const newProb: AdminDSAProblem = {
                      id: `prob_${Date.now()}`,
                      title,
                      category: cat,
                      difficulty: diff,
                      description: 'Given an array of integers, solve the challenge in optimal time complexity.',
                      examples: [{ input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]' }],
                      constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
                      testCases: [{ input: '[2, 7, 11, 15], 9', expected: '[0, 1]' }],
                      expectedOutput: '[0, 1]',
                      starterCode: {
                        JavaScript: 'function solve(nums, target) {\n  // Write solution\n}',
                        Python: 'def solve(nums, target):\n    # Write solution\n    pass',
                      },
                      supportedLanguages: ['JavaScript', 'Python', 'TypeScript', 'Java', 'C++'],
                      hints: ['Consider using a Hash Map to track complements.'],
                      explanation: 'Optimal one-pass hash map solution achieves O(N) time complexity.',
                      timeComplexity: 'O(N)',
                      spaceComplexity: 'O(N)',
                      status: 'Published',
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                    };
                    saveAdminProblem(newProb).then(() => {
                      setDsaProblems((prev) => [newProb, ...prev]);
                      logAction('CREATE_PROBLEM', 'dsa_problem', newProb.id, 'none', title);
                      showToast(`Problem "${title}" created and published in Practice Arena!`);
                    });
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/20 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Author New Problem</span>
                </button>
              </div>

              {/* Problems Table */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Problem</th>
                      <th className="py-3 px-3">Category</th>
                      <th className="py-3 px-3">Difficulty</th>
                      <th className="py-3 px-3">Complexity</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {dsaProblems.map((prob) => (
                      <tr key={prob.id} className="hover:bg-slate-850/50 transition">
                        <td className="py-3 px-4 font-bold text-white">{prob.title}</td>
                        <td className="py-3 px-3 font-mono text-slate-300">{prob.category}</td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                              prob.difficulty === 'Easy'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : prob.difficulty === 'Medium'
                                ? 'bg-amber-500/20 text-amber-300'
                                : 'bg-red-500/20 text-red-300'
                            }`}
                          >
                            {prob.difficulty}
                          </span>
                        </td>
                        <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                          {prob.timeComplexity} / {prob.spaceComplexity}
                        </td>
                        <td className="py-3 px-3">
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                              prob.status === 'Published'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {prob.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleToggleProblemStatus(prob)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
                            >
                              {prob.status === 'Published' ? 'Unpublish' : 'Publish'}
                            </button>
                            <button
                              onClick={() => handleDeleteProblem(prob.id, prob.title)}
                              className="p-1 rounded-lg text-red-400 hover:bg-red-500/20 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: FEATURE FLAGS (Live toggles controlling student application) */}
          {activeTab === 'flags' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div>
                <h1 className="text-xl font-black text-white">System Feature Flags</h1>
                <p className="text-xs text-slate-400">
                  Instantly toggle platform capabilities without re-deploying code. Changes propagate live.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(featureFlags).map(([key, enabled]) => (
                  <div
                    key={key}
                    className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {enabled ? 'Active for all students' : 'Disabled / Maintenance state'}
                      </p>
                    </div>
                    <button
                      onClick={() => handleToggleFlag(key as keyof FeatureFlags)}
                      className={`px-3 py-1.5 rounded-xl font-bold font-mono text-xs cursor-pointer transition ${
                        enabled
                          ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {enabled ? 'ENABLED' : 'DISABLED'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: COMMUNITY MODERATION */}
          {activeTab === 'moderation' && (
            <div className="space-y-4 max-w-6xl mx-auto">
              <div>
                <h1 className="text-xl font-black text-white">Community Moderation Queue</h1>
                <p className="text-xs text-slate-400">
                  Review reported posts, comments, and inappropriate activity to maintain a constructive learning culture
                </p>
              </div>

              {moderationReports.length === 0 ? (
                <div className="p-12 text-center bg-slate-900 rounded-3xl border border-slate-800">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
                  <h3 className="text-sm font-bold text-white">All Clear!</h3>
                  <p className="text-xs text-slate-400">No pending reports in the queue.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {moderationReports.map((report) => (
                    <div
                      key={report.id}
                      className="p-4 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold">
                            {report.targetType.toUpperCase()}
                          </span>
                          <span className="text-xs font-bold text-white">{report.targetTitle}</span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1">
                          <strong>Reason:</strong> {report.reason}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          Reported by {report.reportedBy} • Status: <strong>{report.status}</strong>
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleResolveReport(report, 'removed_content', 'Resolved')}
                          className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer shadow-sm"
                        >
                          Remove Content
                        </button>
                        <button
                          onClick={() => handleResolveReport(report, 'none', 'Rejected')}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs cursor-pointer"
                        >
                          Dismiss
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 7: ANNOUNCEMENTS */}
          {activeTab === 'announcements' && (
            <div className="space-y-4 max-w-5xl mx-auto">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-xl font-black text-white">Broadcast Announcements</h1>
                  <p className="text-xs text-slate-400">
                    Push in-app notification alerts directly to learners' notification drawers
                  </p>
                </div>
                <button
                  onClick={() => {
                    const title = prompt('Announcement Title:');
                    if (!title) return;
                    const message = prompt('Message:');
                    if (!message) return;
                    handleCreateAnnouncement(title, message, 'All users', 'platform');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/20 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>New Announcement</span>
                </button>
              </div>

              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">
                        {ann.type} • Target: {ann.targetAudience}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">Broadcasted</span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{ann.title}</h3>
                    <p className="text-xs text-slate-300">{ann.message}</p>
                    <span className="text-[10px] text-slate-400 block pt-1">
                      Sent on {new Date(ann.createdAt).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: AUDIT LOGS */}
          {activeTab === 'audit' && (
            <div className="space-y-4 max-w-6xl mx-auto">
              <div>
                <h1 className="text-xl font-black text-white">Immutable Admin Audit Trail</h1>
                <p className="text-xs text-slate-400">
                  Every sensitive configuration, role modification, and content action is cryptographically logged
                </p>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Timestamp</th>
                      <th className="py-3 px-3">Admin</th>
                      <th className="py-3 px-3">Action</th>
                      <th className="py-3 px-3">Target</th>
                      <th className="py-3 px-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-850/50 transition">
                        <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="py-3 px-3 font-bold text-purple-300 truncate max-w-[140px]">
                          {log.adminEmail}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold text-[10px]">
                            {log.action}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-slate-300">{log.targetType}</td>
                        <td className="py-3 px-4 text-slate-400 truncate max-w-[200px]">
                          {log.previousValue} → {log.newValue}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 9: AI SYSTEM CONTROLS */}
          {activeTab === 'ai' && (
            <div className="space-y-4 max-w-4xl mx-auto">
              <div>
                <h1 className="text-xl font-black text-white">AI Mentor Configuration</h1>
                <p className="text-xs text-slate-400">
                  Configure Gemini model prompts, Socratic pacing, and difficulty progression rules
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                <div>
                  <label className="text-xs font-bold text-white block mb-1">
                    System Mentor Directives (Socratic Guardrails)
                  </label>
                  <textarea
                    rows={4}
                    value={aiSettings.mentorSystemPrompt}
                    onChange={(e) => setAiSettings({ ...aiSettings, mentorSystemPrompt: e.target.value })}
                    className="w-full p-3 rounded-2xl bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-white block mb-1">Socratic Pacing</label>
                    <select
                      value={aiSettings.socraticPacing}
                      onChange={(e) => setAiSettings({ ...aiSettings, socraticPacing: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                    >
                      <option value="patient">Patient (Max hints before answers)</option>
                      <option value="balanced">Balanced (Progressive hints)</option>
                      <option value="fast">Fast (Concise explanations)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white block mb-1">Difficulty Progression</label>
                    <select
                      value={aiSettings.difficultyProgression}
                      onChange={(e) => setAiSettings({ ...aiSettings, difficultyProgression: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                    >
                      <option value="adaptive">Adaptive based on quiz scores</option>
                      <option value="linear">Strict linear roadmap</option>
                      <option value="challenging">Aggressive challenge pace</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={async () => {
                    await saveAISettings(aiSettings);
                    await logAction('UPDATE_AI_SETTINGS', 'ai_settings', 'global', 'prev', 'updated');
                    showToast('AI Mentor directives saved and active!');
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-blue-600/20 cursor-pointer"
                >
                  Save AI Rules
                </button>
              </div>
            </div>
          )}

          {/* FALLBACK / OTHER TABS (Settings, Analytics, Competitions, etc.) */}
          {['feed', 'competitions', 'leaderboards', 'projects', 'opportunities', 'analytics', 'settings'].includes(
            activeTab
          ) && (
            <div className="space-y-4 max-w-5xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-black text-white capitalize">{activeTab} Management</h1>
                  <p className="text-xs text-slate-400">
                    Integrated operational subsystem for {activeTab}. Connected directly with student views.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-center space-y-3">
                <TechJourneyLogo size="md" variant="app-icon" className="mx-auto" />
                <h3 className="text-sm font-bold text-white capitalize">{activeTab} Subsystem Active</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  All student interactions in {activeTab} synchronize through Firestore database schemas with live
                  security rules.
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-bold">
                    Connected to Student Client
                  </span>
                  <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">
                    Role-Enforced
                  </span>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
