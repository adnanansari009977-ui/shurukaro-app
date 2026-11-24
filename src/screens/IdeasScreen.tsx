import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Pencil, Sparkles } from 'lucide-react';
import { IdeaCard } from '../components/IdeaCard';
import { useApp } from '../context/AppContext';
import { MATCHER_STEPS } from '../data/matcherQuestions';

function lookupLabel(stepId: string, optionId: string | null): string | null {
  if (!optionId) return null;
  for (const step of MATCHER_STEPS) {
    if (step.type === 'single' && step.id === stepId) {
      return step.options.find((o) => o.id === optionId)?.label ?? null;
    }
    if (step.type === 'dual') {
      for (const g of step.groups) {
        if (g.key === stepId) {
          return g.options.find((o) => o.id === optionId)?.label ?? null;
        }
      }
    }
  }
  return null;
}

export const IdeasScreen: React.FC = () => {
  const { state, scoredIdeas, activeIdea, selectActiveIdea, openQuiz } = useApp();
  const [showAll, setShowAll] = useState(false);

  const topThree = scoredIdeas.slice(0, 3);
  const remaining = scoredIdeas.slice(3);

  const budgetLabel = lookupLabel('budget', state.answers.budget) ?? 'Flexible Budget';
  const timeLabel = lookupLabel('time', state.answers.time) ?? 'Part-time';
  const skillLabel = lookupLabel('skill', state.answers.skill) ?? 'Practical Skill';

  return (
    <section className="space-y-6">
      {/* Header Summary Strip */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold text-[#0F766E] mb-1">
            Aapki Profile Ke Hisaab Se
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] text-balance">
            Aapke Liye Top 3 Business Ideas
          </h1>
          {/* Zero-pill unboxed metadata with typographic separator */}
          <p className="text-xs sm:text-sm text-[#4B5563] mt-1.5">
            {budgetLabel} <span aria-hidden="true">·</span> {timeLabel}{' '}
            <span aria-hidden="true">·</span> {skillLabel}
          </p>
        </div>

        <button
          type="button"
          onClick={openQuiz}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-white border border-gray-300 text-sm font-semibold text-[#111827] hover:bg-gray-50 inline-flex items-center justify-center gap-2 self-start sm:self-auto whitespace-nowrap shrink-0 cursor-pointer"
        >
          <Pencil className="w-4 h-4 text-[#0F766E]" />
          <span>Quiz Edit Karein</span>
        </button>
      </div>

      {/* Top 3 Ideas Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        {topThree.map((scored, idx) => (
          <IdeaCard
            key={scored.idea.id}
            scored={scored}
            rank={idx + 1}
            isActive={activeIdea.id === scored.idea.id}
            onSelect={() => selectActiveIdea(scored.idea.id, true)}
            onOpenPlan={() => selectActiveIdea(scored.idea.id, true)}
          />
        ))}
      </div>

      {/* Explore Other 3 Ideas */}
      {remaining.length > 0 && (
        <div className="pt-2">
          <div className="flex items-center justify-between border-t border-gray-200 pt-5">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-[#111827]">
                Doosre Practical Business Options ({remaining.length})
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563]">
                Agar aap naya skill try karna chahein toh inhe bhi dekh sakte hain
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="min-h-[44px] px-4 py-2 rounded-xl bg-white border border-gray-300 text-sm font-semibold text-[#0F766E] hover:bg-[#F0FDFA] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <span>{showAll ? 'Chhupayein' : 'Baaki Ideas Dekhein'}</span>
              {showAll ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>

          {showAll && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mt-5 items-stretch">
              {remaining.map((scored, idx) => (
                <IdeaCard
                  key={scored.idea.id}
                  scored={scored}
                  rank={idx + 4}
                  isActive={activeIdea.id === scored.idea.id}
                  onSelect={() => selectActiveIdea(scored.idea.id, true)}
                  onOpenPlan={() => selectActiveIdea(scored.idea.id, true)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Quick Guidance Strip */}
      <div className="android-card rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F0FDFA] border-[#CCFBF1]">
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0F766E] text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#111827]">
              Abhi Chuna Hua Idea: {activeIdea.emoji} {activeIdea.title}
            </h3>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              Aage badhne ke liye iska Day 1-30 Action Plan aur Kamai Hisaab dekhein.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => selectActiveIdea(activeIdea.id, true)}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-[#0F766E] text-white text-sm font-semibold hover:bg-[#0D5E58] whitespace-nowrap shrink-0 cursor-pointer"
        >
          30-Day Plan Kholen
        </button>
      </div>
    </section>
  );
};
