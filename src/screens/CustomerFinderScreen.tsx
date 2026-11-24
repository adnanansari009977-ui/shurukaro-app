import React, { useState } from 'react';
import { Check, Copy, Lock, MessageCircle, Users } from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';

export const CustomerFinderScreen: React.FC = () => {
  const { state, activeIdea, openUnlockModal, showToast } = useApp();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleCopy = async (text: string, idx: number, isProPitch: boolean) => {
    if (isProPitch && !state.isPro) {
      openUnlockModal('Saare High-Converting WhatsApp Pitches Pro Pack mein hain.');
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(idx);
      showToast('WhatsApp Pitch copy ho gaya!');
      window.setTimeout(() => {
        setCopiedIndex((prev) => (prev === idx ? null : prev));
      }, 2000);
    } catch {
      showToast('Copy karne ke liye text select karein.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: 4 Actionable Channels */}
      <div className="lg:col-span-5 android-card rounded-2xl p-5 sm:p-6">
        <div className="flex items-center gap-2.5 mb-1">
          <Users className="w-5 h-5 text-[#0F766E] shrink-0" />
          <h2 className="text-lg font-bold text-[#111827]">
            Pehle 10 Customers Kahan Se Laayein?
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-[#4B5563] mb-4">
          {activeIdea.title} ke liye sabse tez 4 local tareeke
        </p>

        <ol className="space-y-3">
          {activeIdea.customerWays.map((way, idx) => (
            <li
              key={idx}
              className="rounded-xl bg-[#F9FAFB] border border-gray-200 p-3.5 text-sm text-[#111827] leading-relaxed flex items-start gap-3"
            >
              <span className="w-6 h-6 rounded-full bg-[#0F766E] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 tabular-nums">
                {idx + 1}
              </span>
              <span>{way}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Right: Copyable WhatsApp Pitch Cards */}
      <div className="lg:col-span-7 space-y-4">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-[#111827]">
              Ready-to-Send WhatsApp Pitches
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              Bas [Naam] badlein aur seedha WhatsApp pe bhejein
            </p>
          </div>
        </div>

        {activeIdea.pitches.map((pitch, idx) => {
          const isLocked = pitch.isPro && !state.isPro;
          const isCopied = copiedIndex === idx;

          return (
            <div
              key={idx}
              className="android-card rounded-2xl p-5 space-y-3.5"
            >
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm sm:text-base font-bold text-[#111827]">
                  {pitch.title}
                </h3>
                <span
                  className={`text-xs font-semibold shrink-0 ${
                    pitch.isPro ? 'text-[#EA580C]' : 'text-[#0F766E]'
                  }`}
                >
                  {pitch.isPro ? (state.isPro ? 'Pro Unlocked' : 'Pro Pitch') : 'Free Sample'}
                </span>
              </div>

              {isLocked ? (
                <div className="rounded-xl bg-[#FFF7ED] border border-[#FED7AA] p-4 space-y-3">
                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    {pitch.text.slice(0, 72)}...
                  </p>
                  <PrimaryButton
                    variant="accent"
                    onClick={() =>
                      openUnlockModal(
                        'Follow-up aur Bulk WhatsApp Pitches Pro Pack mein milte hain.'
                      )
                    }
                  >
                    <Lock className="w-4 h-4" />
                    <span>₹199 Me Full Plan Unlock Karein</span>
                  </PrimaryButton>
                </div>
              ) : (
                <>
                  <div className="rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] p-4 text-sm text-[#111827] leading-relaxed whitespace-pre-line">
                    {pitch.text}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleCopy(pitch.text, idx, pitch.isPro)}
                      className="min-h-[44px] flex-1 px-4 py-2.5 rounded-xl border border-gray-300 bg-white hover:bg-gray-50 text-sm font-semibold text-[#111827] inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-4 h-4 text-[#16A34A]" />
                          <span className="text-[#16A34A]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 text-[#4B5563]" />
                          <span>Copy Pitch</span>
                        </>
                      )}
                    </button>

                    <a
                      href={`https://wa.me/?text=${encodeURIComponent(pitch.text)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] flex-1 px-4 py-2.5 rounded-xl bg-[#0F766E] hover:bg-[#0D5E58] text-white text-sm font-semibold inline-flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>WhatsApp pe Bhejein</span>
                    </a>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
