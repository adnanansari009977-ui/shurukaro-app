import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Lock } from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';
import { DOUBT_SOLVER_QA } from '../data/doubtSolverQA';
import { DoubtCategory } from '../types';

type FilterType = 'Sabhi' | DoubtCategory;

const FILTERS: FilterType[] = [
  'Sabhi',
  'Pricing',
  'Pehla Order',
  'Udhaar/Trust',
  'Confidence',
];

export const DoubtSolverScreen: React.FC = () => {
  const { state, openUnlockModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<FilterType>('Sabhi');
  const [openId, setOpenId] = useState<string | null>(DOUBT_SOLVER_QA[0].id);

  const filtered =
    selectedCategory === 'Sabhi'
      ? DOUBT_SOLVER_QA
      : DOUBT_SOLVER_QA.filter((q) => q.category === selectedCategory);

  const toggleItem = (id: string, isProItem: boolean) => {
    if (isProItem && !state.isPro) {
      openUnlockModal('Yeh practical Doubt Solver secret Pro Starter Pack mein hai.');
      return;
    }
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-5">
      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Doubt Categories">
        {FILTERS.map((cat) => {
          const active = selectedCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setSelectedCategory(cat)}
              className={`min-h-[44px] px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                active
                  ? 'bg-[#0F766E] text-white shadow-sm'
                  : 'bg-white border border-gray-200 text-[#4B5563] hover:text-[#111827] hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Accordion Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {filtered.map((item) => {
          const isLocked = item.isPro && !state.isPro;
          const isOpen = openId === item.id && !isLocked;

          return (
            <div key={item.id} className="android-card rounded-2xl overflow-hidden">
              <button
                type="button"
                onClick={() => toggleItem(item.id, item.isPro)}
                aria-expanded={isOpen}
                className="w-full min-h-[64px] p-4 sm:p-5 text-left flex items-start justify-between gap-3 hover:bg-gray-50/70 transition-colors cursor-pointer"
              >
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-[#0F766E] mb-1">
                    {item.category}
                    {item.isPro && !state.isPro ? ' · Pro Secret' : ''}
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-[#111827] leading-snug">
                    {item.question}
                  </h3>
                </div>

                <span className="min-h-[36px] min-w-[36px] rounded-lg bg-gray-100 flex items-center justify-center shrink-0 text-[#4B5563]">
                  {isLocked ? (
                    <Lock className="w-4 h-4 text-[#EA580C]" />
                  ) : isOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </span>
              </button>

              {isOpen && (
                <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-gray-100 space-y-3">
                  <p className="text-sm text-[#111827] leading-relaxed">
                    {item.answer}
                  </p>
                  <div className="rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] p-3 text-xs sm:text-sm font-semibold text-[#0F766E]">
                    {item.practicalRule}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!state.isPro && (
        <div className="android-card rounded-2xl p-5 bg-[#FFF7ED] border-[#FED7AA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-[#111827]">
              Bina Udhaar aur Pricing Secrets Unlock Karein
            </h3>
            <p className="text-sm text-[#4B5563] mt-0.5">
              Sirf ₹199 one-time mein saare Pro Doubt Answers aur Growth Steps milenge.
            </p>
          </div>
          <PrimaryButton
            variant="accent"
            onClick={() => openUnlockModal('Saare Doubt Solver Secrets unlock karein.')}
          >
            <Lock className="w-4 h-4" />
            <span>₹199 Me Full Plan Unlock Karein</span>
          </PrimaryButton>
        </div>
      )}
    </div>
  );
};
