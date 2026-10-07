import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { TechJourneyLogo } from './TechJourneyLogo';

interface Props {
  className?: string;
  variant?: 'compact' | 'full';
}

export const PWAInstallButton: React.FC<Props> = ({ className = '', variant = 'compact' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [installing, setInstalling] = useState(false);

  if (isInstalled) {
    return (
      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-medium ${className}`}>
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>Installed on Phone</span>
      </div>
    );
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      setInstalling(true);
      await install();
      setInstalling(false);
    } else {
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        disabled={installing}
        className={`flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white font-medium shadow-md shadow-blue-500/20 transition-all cursor-pointer ${
          variant === 'full' ? 'w-full py-3 px-4 text-sm' : 'px-3 py-1.5 text-xs'
        } ${className}`}
      >
        <Smartphone className={variant === 'full' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
        <span>{installing ? 'Installing...' : 'Install App on Phone'}</span>
        <Download className={variant === 'full' ? 'w-4 h-4' : 'w-3.5 h-3.5'} />
      </button>

      {showGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-900 border border-slate-800 p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800/80 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <TechJourneyLogo size="md" variant="app-icon" />
              <div>
                <h3 className="text-base font-semibold text-white">Install TechJourney AI</h3>
                <p className="text-xs text-slate-400">Launch from your phone home screen</p>
              </div>
            </div>

            {isIOS ? (
              <div className="space-y-3 text-sm text-slate-300">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <p className="font-semibold text-white text-xs mb-1">On iOS (Safari):</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300">
                    <li>Tap the <strong>Share</strong> button at bottom of Safari.</li>
                    <li>Scroll down and tap <strong>Add to Home Screen</strong>.</li>
                    <li>Tap <strong>Add</strong> to launch in standalone mode!</li>
                  </ol>
                </div>
              </div>
            ) : (
              <div className="space-y-3 text-sm text-slate-300">
                <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50">
                  <p className="font-semibold text-white text-xs mb-1">On Android (Chrome / Brave / Edge):</p>
                  <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300">
                    <li>Tap the <strong>⋮ (three dots)</strong> menu in browser top right.</li>
                    <li>Tap <strong>Install app</strong> or <strong>Add to Home Screen</strong>.</li>
                    <li>Open TechJourney AI directly from your app drawer!</li>
                  </ol>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full rounded-xl bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-semibold text-slate-200 transition"
            >
              Got it, thanks!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
