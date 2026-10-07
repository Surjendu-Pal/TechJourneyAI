import React, { useEffect } from 'react';

interface AdBannerProps {
  slot?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
  publisherId?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slot = '1234567890',
  format = 'auto',
  className = '',
  publisherId,
}) => {
  // Read publisher ID from props or Vite client env variable
  const activePublisherId =
    publisherId ||
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_ADSENSE_PUBLISHER_ID) ||
    'ca-pub-XXXXXXXXXXXXXXXX';

  const isRealPublisherConfigured =
    activePublisherId &&
    activePublisherId !== 'ca-pub-XXXXXXXXXXXXXXXX' &&
    activePublisherId.startsWith('ca-pub-');

  useEffect(() => {
    // If real publisher ID is configured, load adsbygoogle script dynamically
    if (isRealPublisherConfigured && typeof window !== 'undefined') {
      try {
        const existingScript = document.getElementById('adsense-script');
        if (!existingScript) {
          const script = document.createElement('script');
          script.id = 'adsense-script';
          script.async = true;
          script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${activePublisherId}`;
          script.crossOrigin = 'anonymous';
          document.head.appendChild(script);
        }

        // Push ad slot
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        // Silently fail without interrupting user workflow
        console.warn('AdSense load notice:', err);
      }
    }
  }, [isRealPublisherConfigured, activePublisherId]);

  return (
    <div
      className={`w-full overflow-hidden rounded-2xl bg-slate-900/40 border border-slate-800/60 p-3 text-center my-3 transition ${className}`}
    >
      <div className="flex items-center justify-between pb-1 text-[9px] uppercase font-bold text-slate-500 tracking-wider">
        <span>Sponsored Learning Resource</span>
        <span className="font-mono text-[8px] bg-slate-800/80 px-1.5 py-0.5 rounded">AdSense Ready</span>
      </div>

      {isRealPublisherConfigured ? (
        <ins
          className="adsbygoogle block"
          style={{ display: 'block' }}
          data-ad-client={activePublisherId}
          data-ad-slot={slot}
          data-ad-format={format}
          data-full-width-responsive="true"
        />
      ) : (
        <div className="py-2.5 px-3 rounded-xl bg-slate-950/60 border border-slate-800/50 flex flex-col items-center justify-center text-left">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-semibold text-slate-300">
              ⚡ Level Up with Cloud & Developer Tools
            </span>
            <span className="text-[10px] text-blue-400 font-semibold cursor-pointer">Explore</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5 w-full">
            Certified partner tracks for Full-Stack, Docker, and PostgreSQL developers.
          </p>
        </div>
      )}
    </div>
  );
};
