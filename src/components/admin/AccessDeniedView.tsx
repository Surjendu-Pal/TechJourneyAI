import React, { useEffect, useState } from 'react';
import { ShieldAlert, ArrowLeft, Lock, AlertTriangle } from 'lucide-react';
import { TechJourneyLogo } from '../TechJourneyLogo';

interface AccessDeniedViewProps {
  onReturn: () => void;
  userEmail?: string;
  userRole?: string;
}

export const AccessDeniedView: React.FC<AccessDeniedViewProps> = ({
  onReturn,
  userEmail,
  userRole = 'USER',
}) => {
  const [countdown, setCountdown] = useState(6);

  useEffect(() => {
    if (countdown <= 0) {
      onReturn();
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, onReturn]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      {/* Brand Logo */}
      <div className="mb-6">
        <TechJourneyLogo size="lg" showText variant="app-icon" />
      </div>

      <div className="max-w-md w-full bg-slate-900/90 border border-red-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden backdrop-blur-xl">
        {/* Glowing warning aura */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert className="w-8 h-8 animate-pulse" />
        </div>

        <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/20">
          Security Barrier • 403 Forbidden
        </span>

        <h1 className="text-xl sm:text-2xl font-black text-white mt-3 tracking-tight">
          Access Denied
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
          The administrative control plane is restricted to verified platform administrators. 
          Your account does not possess <span className="font-mono text-amber-300 font-semibold">ADMIN</span> or <span className="font-mono text-purple-300 font-semibold">SUPER_ADMIN</span> authorization.
        </p>

        {userEmail && (
          <div className="mt-4 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
            <span>Identity: <strong className="text-slate-200">{userEmail}</strong></span>
            <span className="text-amber-400 font-semibold">Role: {userRole}</span>
          </div>
        )}

        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col gap-2.5">
          <button
            onClick={onReturn}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 cursor-pointer active:scale-98 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Student Application ({countdown}s)</span>
          </button>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 mt-6 font-mono">
        TechJourney AI Security Subsystem • Unauthorized access attempts are monitored
      </p>
    </div>
  );
};
