import React, { useState } from 'react';
import {
  User,
  Save,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Layers,
  Shield,
  LogOut,
  LogIn,
  CheckCircle2,
  RefreshCw,
  Smartphone,
  ChevronRight,
  Share2,
  Github,
  Globe,
  Briefcase,
  Trophy,
  ExternalLink,
  Code2,
  Flame,
  Award,
  Zap,
} from 'lucide-react';
import { UserProfile, Roadmap, ProjectItem, DeveloperLevelInfo } from '../types';
import { PWAInstallButton } from '../components/PWAInstallButton';
import { PROJECT_TEMPLATES, OPPORTUNITIES_DATA } from '../data/socialFeedData';
import { AdBanner } from '../components/AdBanner';
import { TechJourneyLogo } from '../components/TechJourneyLogo';

interface ProfileViewProps {
  profile: UserProfile | null;
  roadmap: Roadmap | null;
  levelInfo: DeveloperLevelInfo;
  onSaveProfile: (profile: Partial<UserProfile>) => Promise<void>;
  onRegenerateRoadmap: () => Promise<void>;
  onOpenAdmin: () => void;
  onSignInGoogle: () => Promise<void>;
  onSignInGuest: () => Promise<void>;
  onSignOut: () => Promise<void>;
  isAdmin: boolean;
  onEarnXP?: (amount: number, reason: string) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  roadmap,
  levelInfo,
  onSaveProfile,
  onRegenerateRoadmap,
  onOpenAdmin,
  onSignInGoogle,
  onSignInGuest,
  onSignOut,
  isAdmin,
  onEarnXP,
}) => {
  const [profileTab, setProfileTab] = useState<'passport' | 'projects' | 'opportunities' | 'settings'>('passport');

  // Profile Form State
  const [name, setName] = useState(profile?.name || 'Surjendu Pal');
  const [college, setCollege] = useState(profile?.college || 'Asansol Engineering College');
  const [country, setCountry] = useState(profile?.country || 'India');
  const [careerGoal, setCareerGoal] = useState(profile?.careerGoal || 'Full-Stack Software Engineer');
  const [preferredLanguage, setPreferredLanguage] = useState(profile?.preferredLanguage || 'JavaScript');
  const [educationLevel, setEducationLevel] = useState(profile?.educationLevel || 'B.Tech Computer Science');
  const [programmingExperience, setProgrammingExperience] = useState(profile?.programmingExperience || 'Beginner');
  const [dailyAvailableTime, setDailyAvailableTime] = useState(profile?.dailyAvailableTime || '1 hour');
  const [dailyPreferredStudyTime, setDailyPreferredStudyTime] = useState(profile?.dailyPreferredStudyTime || 'Morning');
  const [githubUsername, setGithubUsername] = useState(profile?.githubUsername || 'surjendu-pal');
  const [portfolioUrl, setPortfolioUrl] = useState(profile?.portfolioUrl || 'https://techjourney.dev/u/surjendu');

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Projects State
  const [projects, setProjects] = useState<ProjectItem[]>(PROJECT_TEMPLATES);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);
    try {
      await onSaveProfile({
        name,
        college,
        country,
        careerGoal,
        preferredLanguage,
        educationLevel,
        programmingExperience,
        dailyAvailableTime,
        dailyPreferredStudyTime,
        githubUsername,
        portfolioUrl,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleSharePassport = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleToggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id !== projectId) return p;
        const updatedMilestones = p.milestones.map((m) =>
          m.id === milestoneId ? { ...m, completed: !m.completed } : m
        );
        const milestone = p.milestones.find((m) => m.id === milestoneId);
        if (milestone && !milestone.completed && onEarnXP) {
          onEarnXP(milestone.xp, `Completed Project Milestone: ${milestone.title}`);
        }
        return { ...p, milestones: updatedMilestones };
      })
    );
  };

  const verifiedSkills = profile?.skills?.length
    ? profile.skills
    : ['JavaScript', 'React', 'TypeScript', 'Node.js', 'SQL', 'Git', 'DSA'];

  return (
    <div className="space-y-4 pb-20 pt-2 px-3.5 max-w-md mx-auto text-left">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
            Verified Developer Identity
          </span>
          <h1 className="text-xl font-black text-white">Developer Passport</h1>
        </div>

        {profile?.uid && (
          <button
            onClick={onSignOut}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white text-xs transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto no-scrollbar pb-1 border-b border-slate-800 text-xs font-bold">
        {[
          { id: 'passport' as const, label: 'Passport', icon: User },
          { id: 'projects' as const, label: 'Projects Mode', icon: Code2 },
          { id: 'opportunities' as const, label: 'Opportunities', icon: Briefcase },
          { id: 'settings' as const, label: 'Settings', icon: Shield },
        ].map((t) => {
          const Icon = t.icon;
          const active = profileTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setProfileTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl whitespace-nowrap transition cursor-pointer ${
                active
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: TECHJOURNEY PASSPORT (Section 22) */}
      {profileTab === 'passport' && (
        <div className="space-y-3.5">
          {/* Main Passport Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-blue-950/40 to-slate-900 border border-blue-500/40 p-5 shadow-2xl space-y-4">
            {/* Top hallmark with Official Logo */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <TechJourneyLogo size="xs" showText variant="icon" />
              <span className="text-[9px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                VERIFIED DEVELOPER PASSPORT
              </span>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xl font-black shadow-lg shadow-blue-600/30">
                  {name.charAt(0) || 'S'}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h2 className="text-base font-black text-white">{name}</h2>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs text-blue-400 font-semibold">{careerGoal}</p>
                  <p className="text-[10px] text-slate-400">{college} • {country}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold font-mono">
                  {levelInfo.badge} Level {levelInfo.level}
                </span>
                <span className="text-[10px] font-mono text-blue-300 block mt-1 font-bold">
                  {profile?.xp || 180} XP
                </span>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Streak</span>
                <span className="font-bold text-white text-xs font-mono flex items-center justify-center gap-0.5">
                  <Flame className="w-3 h-3 text-orange-500 fill-orange-500" />
                  {profile?.streak || 1}d
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Rating</span>
                <span className="font-bold text-indigo-400 text-xs font-mono">
                  {profile?.battleRating || 1200} ELO
                </span>
              </div>
              <div>
                <span className="text-[9px] text-slate-400 uppercase font-bold block">Solved</span>
                <span className="font-bold text-emerald-400 text-xs font-mono">18 / 22</span>
              </div>
            </div>

            {/* Verified Skills */}
            <div className="space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Verified Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {verifiedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-semibold flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{skill}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Social Links & Share Passport CTA */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-400 text-xs">
                <a
                  href={`https://github.com/${githubUsername}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 hover:text-white"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span className="text-[10px]">github/{githubUsername}</span>
                </a>
              </div>

              <button
                onClick={handleSharePassport}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-blue-600/20 cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copiedLink ? 'Link Copied! ✓' : 'Share Passport'}</span>
              </button>
            </div>
          </div>

          {/* PWA Phone Installation Card */}
          <div className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold text-white">Android Mobile PWA</h3>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono">
                Standalone
              </span>
            </div>
            <p className="text-[11px] text-slate-300 leading-normal">
              Manage your daily software missions directly from your Android phone without browser tabs or distractions.
            </p>
            <PWAInstallButton variant="full" />
          </div>
        </div>
      )}

      {/* TAB 2: PROJECT MODE (Section 23) */}
      {profileTab === 'projects' && (
        <div className="space-y-3.5">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-950/50 to-slate-900 border border-blue-500/30 text-xs text-slate-300 space-y-1">
            <span className="text-[10px] text-blue-400 font-bold uppercase block">
              Learn $\rightarrow$ Build Philosophy
            </span>
            <p className="leading-relaxed">
              Employers ignore passive certificate collectors. TechJourney breaks production capstones into structured milestones with automated code review.
            </p>
          </div>

          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white">{proj.title}</h3>
                  <span className="text-[9px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-bold">
                    {proj.difficulty}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-1">
                  {proj.techStack.map((tech) => (
                    <span key={tech} className="px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 text-[10px] font-mono">
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Milestones */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Milestones (+100 XP Each)
                  </span>
                  {proj.milestones.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleToggleMilestone(proj.id, m.id)}
                      className={`p-2.5 rounded-xl border flex items-center justify-between text-xs cursor-pointer transition ${
                        m.completed
                          ? 'bg-emerald-950/40 border-emerald-500/40 opacity-80'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                            m.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-600'
                          }`}
                        >
                          {m.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <div>
                          <h5 className={`font-semibold ${m.completed ? 'line-through text-slate-400' : 'text-white'}`}>
                            {m.title}
                          </h5>
                          <span className="text-[10px] text-slate-400">{m.description}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold">+{m.xp} XP</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: OPPORTUNITY CENTER (Section 25 & 26) */}
      {profileTab === 'opportunities' && (
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-200 space-y-1">
            <span className="text-[10px] text-emerald-400 font-bold uppercase block">
              Skill-Matched Opportunities
            </span>
            <p className="leading-relaxed">
              Matched to your verified GitHub projects and DSA track. No fake guarantees—just real student internships, hackathons, and open source bounties.
            </p>
          </div>

          <div className="space-y-2.5">
            {OPPORTUNITIES_DATA.map((opp) => (
              <div key={opp.id} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-2.5 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">
                    {opp.type}
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {opp.matchScore}% Skill Match
                  </span>
                </div>

                <div>
                  <h3 className="text-xs font-bold text-white">{opp.title}</h3>
                  <p className="text-[11px] text-slate-400">{opp.companyOrOrg} • {opp.location}</p>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">{opp.description}</p>

                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-[11px]">
                  <span className="text-emerald-400 font-bold font-mono">
                    {opp.stipendOrPrize}
                  </span>
                  <a
                    href={opp.applyUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span>Apply / Details</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SETTINGS & ADSENSE CONTROLS (Section 34, 35) */}
      {profileTab === 'settings' && (
        <div className="space-y-3.5">
          {/* Admin / Dev Controls */}
          {isAdmin && (
            <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-950/50 to-slate-900 border border-purple-500/40 flex items-center justify-between gap-3 shadow-lg">
              <div className="flex items-center gap-3">
                <TechJourneyLogo size="sm" variant="app-icon" />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white block">TechJourney Admin Control</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold bg-purple-500/20 text-purple-300">
                      SECURE
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400">Manage learners, CMS curriculum, problems, & flags</span>
                </div>
              </div>
              <button
                onClick={onOpenAdmin}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 cursor-pointer active:scale-95 transition shrink-0"
              >
                Launch Admin Portal →
              </button>
            </div>
          )}

          {/* Profile Details Edit Form */}
          <form onSubmit={handleSave} className="p-4 rounded-3xl bg-slate-900 border border-slate-800 space-y-3 text-left">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Profile Information
              </span>
              {savedSuccess && (
                <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Saved!
                </span>
              )}
            </div>

            <div>
              <label className="block text-[11px] text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">College / University</label>
                <input
                  type="text"
                  value={college}
                  onChange={(e) => setCollege(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">GitHub Username</label>
                <input
                  type="text"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Primary Language</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="JavaScript">JavaScript</option>
                  <option value="Python">Python</option>
                  <option value="Java">Java</option>
                  <option value="C++">C++</option>
                  <option value="TypeScript">TypeScript</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs cursor-pointer shadow-md"
            >
              {saving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>
      )}

      <AdBanner />
    </div>
  );
};
