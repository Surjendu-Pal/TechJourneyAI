import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, Code2, Target, Calendar } from 'lucide-react';
import { UserProfile } from '../types';
import { TechJourneyLogo } from '../components/TechJourneyLogo';

interface OnboardingViewProps {
  onComplete: (profile: Partial<UserProfile>) => Promise<void>;
}

export const OnboardingView: React.FC<OnboardingViewProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [educationLevel, setEducationLevel] = useState('Undergraduate / Self-taught');
  const [programmingExperience, setProgrammingExperience] = useState('Beginner');
  const [preferredLanguage, setPreferredLanguage] = useState('JavaScript');
  const [careerGoal, setCareerGoal] = useState('Full-Stack Software Engineer');
  const [dailyAvailableTime, setDailyAvailableTime] = useState('1 hour');
  const [dailyPreferredStudyTime, setDailyPreferredStudyTime] = useState('Morning');
  const [dsaLevel, setDsaLevel] = useState('Absolute Beginner');
  const [devLevel, setDevLevel] = useState('Beginner');
  const [targetDate, setTargetDate] = useState('2026-12-31');
  const [submitting, setSubmitting] = useState(false);

  const handleFinish = async () => {
    setSubmitting(true);
    try {
      await onComplete({
        name: name || 'Engineer',
        educationLevel,
        programmingExperience,
        preferredLanguage,
        careerGoal,
        dailyAvailableTime,
        dailyPreferredStudyTime,
        dsaLevel,
        devLevel,
        targetDate,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-4 max-w-md mx-auto text-left">
      {/* Top indicator */}
      <div>
        <div className="flex items-center justify-between py-2 mb-4">
          <div className="flex items-center gap-2">
            <TechJourneyLogo size="sm" variant="app-icon" />
            <span className="font-bold text-sm text-white">TechJourney AI Setup</span>
          </div>
          <span className="text-xs font-mono font-bold text-blue-400">Step {step} of 3</span>
        </div>

        {/* Step 1: Basics & Goal */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Step 1</span>
              <h2 className="text-xl font-black text-white mt-0.5">Welcome! Who are you?</h2>
              <p className="text-xs text-slate-400 mt-1">Let's configure your personal AI mentor.</p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Career Goal</label>
                <input
                  type="text"
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  placeholder="e.g. Full-Stack Web Developer, FAANG Software Engineer"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Language</label>
                <div className="grid grid-cols-3 gap-2">
                  {['JavaScript', 'Python', 'TypeScript', 'Java', 'C++'].map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setPreferredLanguage(lang)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition cursor-pointer ${
                        preferredLanguage === lang
                          ? 'bg-blue-600 border-blue-500 text-white shadow-sm'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Experience & Skill Levels */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Step 2</span>
              <h2 className="text-xl font-black text-white mt-0.5">Your Current Levels</h2>
              <p className="text-xs text-slate-400 mt-1">Be honest—the AI adapts difficulty to you.</p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">DSA Experience</label>
                <div className="space-y-1.5">
                  {['Absolute Beginner (Never solved LeetCode)', 'Solved <50 basic problems', 'Intermediate (Can solve medium problems)'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDsaLevel(lvl)}
                      className={`w-full p-2.5 text-left rounded-xl text-xs border transition cursor-pointer ${
                        dsaLevel === lvl
                          ? 'bg-blue-600/20 border-blue-500 text-blue-300 font-semibold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Development Level</label>
                <div className="space-y-1.5">
                  {['Beginner (Know basic syntax)', 'Built 1-2 small projects', 'Full-stack experience with APIs and DBs'].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setDevLevel(lvl)}
                      className={`w-full p-2.5 text-left rounded-xl text-xs border transition cursor-pointer ${
                        devLevel === lvl
                          ? 'bg-purple-600/20 border-purple-500 text-purple-300 font-semibold'
                          : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Commitment & Target Date */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Step 3</span>
              <h2 className="text-xl font-black text-white mt-0.5">Study Commitment</h2>
              <p className="text-xs text-slate-400 mt-1">Consistency beats cramming every single time.</p>
            </div>

            <div className="space-y-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Daily Available Study Time</label>
                <div className="grid grid-cols-4 gap-2">
                  {['30 mins', '1 hour', '2 hours', '3+ hours'].map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setDailyAvailableTime(time)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition cursor-pointer ${
                        dailyAvailableTime === time
                          ? 'bg-blue-600 border-blue-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Preferred Time of Day</label>
                <div className="grid grid-cols-4 gap-2">
                  {['Morning', 'Afternoon', 'Evening', 'Night'].map((tod) => (
                    <button
                      key={tod}
                      type="button"
                      onClick={() => setDailyPreferredStudyTime(tod)}
                      className={`py-2 px-1 text-center rounded-xl text-xs font-bold border transition cursor-pointer ${
                        dailyPreferredStudyTime === tod
                          ? 'bg-indigo-600 border-indigo-500 text-white'
                          : 'bg-slate-900 border-slate-800 text-slate-400'
                      }`}
                    >
                      {tod}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Job-Ready Target Date</label>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Buttons */}
      <div className="pt-6 space-y-2">
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer"
          >
            <span>Next Step</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={submitting}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 active:scale-98 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xl shadow-blue-600/30 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{submitting ? 'Generating AI Roadmap & Day 1 Plan...' : 'Generate My Personal Learning Plan'}</span>
          </button>
        )}

        {step > 1 && (
          <button
            onClick={() => setStep(step - 1)}
            className="w-full py-2 text-center text-xs text-slate-400 hover:text-white"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
};
