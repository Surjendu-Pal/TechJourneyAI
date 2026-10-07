import React from 'react';

export interface TechJourneyLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero' | number;
  showText?: boolean;
  variant?: 'icon' | 'app-icon' | 'badge' | 'monochrome';
  className?: string;
  textClassName?: string;
}

export const TechJourneyLogo: React.FC<TechJourneyLogoProps> = ({
  size = 'md',
  showText = false,
  variant = 'icon',
  className = '',
  textClassName = '',
}) => {
  // Determine pixel size
  let pixelSize = 36;
  if (typeof size === 'number') {
    pixelSize = size;
  } else {
    switch (size) {
      case 'xs':
        pixelSize = 20;
        break;
      case 'sm':
        pixelSize = 28;
        break;
      case 'md':
        pixelSize = 36;
        break;
      case 'lg':
        pixelSize = 48;
        break;
      case 'xl':
        pixelSize = 64;
        break;
      case 'hero':
        pixelSize = 96;
        break;
    }
  }

  // Unique gradient IDs to prevent collisions in multiple renders
  const gradId = React.useId().replace(/:/g, '');
  const primaryGrad = `tj-pri-${gradId}`;
  const accentGrad = `tj-acc-${gradId}`;
  const glowGrad = `tj-glow-${gradId}`;

  const renderIconSvg = () => (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0 select-none overflow-visible"
    >
      <defs>
        {/* Core Electric Blue to Vivid Purple Brand Gradient */}
        <linearGradient id={primaryGrad} x1="12" y1="12" x2="88" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="35%" stopColor="#3B82F6" />
          <stop offset="70%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#C084FC" />
        </linearGradient>

        {/* Accent Journey Beam Gradient */}
        <linearGradient id={accentGrad} x1="20" y1="80" x2="85" y2="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#EC4899" />
        </linearGradient>

        {/* Soft Radial Ambient Glow */}
        <radialGradient id={glowGrad} cx="50" cy="50" r="50" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* App Icon Container Background (if variant is app-icon) */}
      {variant === 'app-icon' && (
        <>
          <rect
            x="2"
            y="2"
            width="96"
            height="96"
            rx="24"
            fill="#090D1A"
            stroke="url(#"
            strokeWidth="1.5"
            className="stroke-slate-800"
          />
          <circle cx="50" cy="50" r="44" fill={`url(#${glowGrad})`} />
          <rect
            x="3"
            y="3"
            width="94"
            height="94"
            rx="23"
            fill="none"
            stroke={`url(#${primaryGrad})`}
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />
        </>
      )}

      {/* Subtle Ambient Back-Glow behind the emblem */}
      <circle cx="50" cy="48" r="32" fill={`url(#${glowGrad})`} opacity="0.6" />

      {/* --- ICON GEOMETRY: Futuristic 'TJ' + Exponential Learning Path --- */}

      {/* 1. TOP "T" HORIZONTAL TECH BEAM */}
      {/* Sleek beveled horizontal beam with digital circuit notch */}
      <path
        d="M20 22 C20 20.34 21.34 19 23 19 L77 19 C78.66 19 80 20.34 80 22 L80 27 C80 28.66 78.66 30 77 30 L58 30 C56.9 30 56 30.9 56 32 L56 34 L44 34 L44 32 C44 30.9 43.1 30 42 30 L23 30 C21.34 30 20 28.66 20 27 Z"
        fill={`url(#${primaryGrad})`}
      />

      {/* 2. THE ASCENDING "J" & JOURNEY TRAJECTORY */}
      {/* Downward stem from center, sweeping smoothly through bottom-left and surging up exponentially to the top right */}
      <path
        d="M50 32 
           L50 56 
           C50 67 41 75 30 75 
           C21 75 16 69 16 63 
           C16 58.5 19.5 55 24 55 
           C27.5 55 30.5 57.5 31.5 61 
           C32 62.5 33.5 64 35.5 64 
           C39.5 64 42.5 60.5 42.5 55 
           L42.5 40 
           L57.5 40 
           L57.5 56 
           C57.5 73.5 45 83 29 83 
           C14 83 7 73 7 62 
           C7 52 14.5 45 24 45 
           C26.5 45 28.8 45.6 31 46.5
           L31 32 Z"
        fill={`url(#${primaryGrad})`}
        fillRule="evenodd"
      />

      {/* 3. THE EXPONENTIAL DIGITAL JOURNEY PATH (Right Wing of T into Future Orbit) */}
      {/* Dynamic vector trajectory sweeping upward toward achievement */}
      <path
        d="M48 68 
           C58 68 68 60 74 48 
           C77 42 80 32 85 24
           L91 32 
           C86 42 81 54 74 63 
           C66 73 54 80 44 81 
           Z"
        fill={`url(#${accentGrad})`}
        opacity="0.9"
      />

      {/* 4. PINNACLE AI DIAMOND SPARKLE (The Future Goal / AI Mastery Apex) */}
      <path
        d="M86 16 L88.5 22.5 L95 25 L88.5 27.5 L86 34 L83.5 27.5 L77 25 L83.5 22.5 Z"
        fill="#FFFFFF"
      />
      <circle cx="86" cy="25" r="2.5" fill="#38BDF8" />

      {/* 5. MILESTONE CONSTELLATION NODES (Beginner -> Builder -> Pro) */}
      {/* Node 1: Origin */}
      <circle cx="24" cy="62" r="2.2" fill="#FFFFFF" opacity="0.9" />
      {/* Node 2: Core Pivot */}
      <circle cx="50" cy="46" r="2" fill="#E0E7FF" opacity="0.8" />
      {/* Node 3: Acceleration Orbit */}
      <circle cx="68" cy="48" r="2.5" fill="#C084FC" />
      <circle cx="68" cy="48" r="1.2" fill="#FFFFFF" />

      {/* Subtle Energy Pulse Line */}
      <line
        x1="26"
        y1="24.5"
        x2="74"
        y2="24.5"
        stroke="#FFFFFF"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.75"
      />
    </svg>
  );

  if (!showText) {
    return <div className={`inline-flex items-center justify-center ${className}`}>{renderIconSvg()}</div>;
  }

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      {renderIconSvg()}
      <div className="flex flex-col text-left select-none leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-black tracking-tight text-white ${
              pixelSize >= 48 ? 'text-2xl' : pixelSize >= 36 ? 'text-lg' : 'text-sm'
            } ${textClassName}`}
          >
            TechJourney
          </span>
          <span
            className={`font-extrabold uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/40 text-blue-400 font-mono ${
              pixelSize >= 48 ? 'text-xs' : 'text-[9px]'
            }`}
          >
            AI
          </span>
        </div>
        <span
          className={`text-slate-400 font-medium tracking-tight mt-0.5 ${
            pixelSize >= 48 ? 'text-xs' : 'text-[9px]'
          }`}
        >
          Turn screen time into skill time
        </span>
      </div>
    </div>
  );
};
