import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { BrandLogo } from './BrandLogo';

export const PWAInstallBanner: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [dismissed, setDismissed] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled || dismissed || (!isInstallable && !isIOS)) {
    return null;
  }

  return (
    <>
      <div className="mb-5 android-card rounded-2xl p-3.5 sm:p-4 bg-[#F0FDF4] border-[#BBF7D0] flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <BrandLogo size={38} />
          <div className="min-w-0">
            <div className="text-sm font-bold text-[#111827] truncate">
              ShuruKaro Phone mein Install Karein
            </div>
            <div className="text-xs text-[#4B5563] truncate">
              Offline 30-Day Plan aur Hisaab turant kholein
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (isInstallable) {
                void install();
              } else if (isIOS) {
                setShowIOSGuide(true);
              }
            }}
            className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install App</span>
          </button>

          <button
            type="button"
            onClick={() => setDismissed(true)}
            aria-label="Install banner band karein"
            className="min-h-[40px] min-w-[40px] rounded-xl flex items-center justify-center text-[#4B5563] hover:bg-white/70 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {showIOSGuide && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl border border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <BrandLogo size={36} />
              <h3 className="text-base font-bold text-[#111827]">
                iPhone / iPad par Install Karein
              </h3>
            </div>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              1. Safari ke niche <strong>Share</strong> button par tap karein.
              <br />
              2. Scroll karke <strong>Add to Home Screen</strong> chunein.
            </p>
            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="mt-4 w-full min-h-[44px] rounded-xl bg-[#059669] text-white text-sm font-semibold hover:bg-[#047857] cursor-pointer"
            >
              Samajh Gaya
            </button>
          </div>
        </div>
      )}
    </>
  );
};
