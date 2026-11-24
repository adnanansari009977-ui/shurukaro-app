import React, { useState } from 'react';
import { ArrowRight, Check, X } from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';
import { ProgressHeader } from '../components/ProgressHeader';
import { useApp } from '../context/AppContext';
import { MATCHER_STEPS } from '../data/matcherQuestions';
import { BudgetBandId, FearId, MatcherAnswers, ModeId, SkillId, TimeCommitmentId } from '../types';

export const OnboardingScreen: React.FC = () => {
  const {
    state,
    isQuizEditing,
    closeQuiz,
    submitOnboarding,
    skipOnboardingWithDefaults,
  } = useApp();

  const [stepIdx, setStepIdx] = useState(0);
  const [draft, setDraft] = useState<MatcherAnswers>(state.answers);

  const currentStep = MATCHER_STEPS[stepIdx];
  const totalSteps = MATCHER_STEPS.length;

  const isStepValid = (): boolean => {
    if (currentStep.id === 'budget') return Boolean(draft.budget);
    if (currentStep.id === 'time') return Boolean(draft.time);
    if (currentStep.id === 'skill') return Boolean(draft.skill);
    if (currentStep.id === 'context') return Boolean(draft.mode && draft.fear);
    return false;
  };

  const handleBack = () => {
    if (stepIdx > 0) {
      setStepIdx((prev) => prev - 1);
    } else if (isQuizEditing) {
      closeQuiz();
    }
  };

  const handleNext = () => {
    if (!isStepValid()) return;
    if (stepIdx < totalSteps - 1) {
      setStepIdx((prev) => prev + 1);
    } else {
      submitOnboarding(draft);
    }
  };

  const handleSingleSelect = (stepId: 'budget' | 'time' | 'skill', optionId: string) => {
    setDraft((prev) => {
      if (stepId === 'budget') return { ...prev, budget: optionId as BudgetBandId };
      if (stepId === 'time') return { ...prev, time: optionId as TimeCommitmentId };
      return { ...prev, skill: optionId as SkillId };
    });
  };

  const handleDualSelect = (key: 'mode' | 'fear', optionId: string) => {
    setDraft((prev) => {
      if (key === 'mode') return { ...prev, mode: optionId as ModeId };
      return { ...prev, fear: optionId as FearId };
    });
  };

  const getSelectedSingle = (stepId: 'budget' | 'time' | 'skill') => {
    if (stepId === 'budget') return draft.budget;
    if (stepId === 'time') return draft.time;
    return draft.skill;
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-2.5">
          <ProgressHeader
            currentStep={currentStep.stepNumber}
            totalSteps={totalSteps}
            onBack={handleBack}
            canGoBack={stepIdx > 0 || isQuizEditing}
            rightSlot={
              isQuizEditing ? (
                <button
                  type="button"
                  onClick={closeQuiz}
                  className="min-h-[44px] min-w-[44px] px-2 rounded-xl inline-flex items-center justify-center text-sm font-medium text-[#4B5563] hover:text-[#111827] hover:bg-gray-100 cursor-pointer"
                  aria-label="Band karein"
                >
                  <X className="w-5 h-5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={skipOnboardingWithDefaults}
                  className="min-h-[44px] px-2.5 rounded-xl text-xs font-semibold text-[#0F766E] hover:bg-[#F0FDFA] whitespace-nowrap cursor-pointer"
                >
                  Skip Quiz
                </button>
              )
            }
          />
        </div>
      </header>

      {/* Main Matcher Body */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10 pb-28">
        <div className="android-card rounded-2xl p-5 sm:p-8">
          <div className="mb-6">
            <p className="text-xs font-semibold text-[#0F766E] mb-1.5">
              Smart Business Matcher
            </p>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#111827] leading-tight text-balance">
              {currentStep.title}
            </h1>
            <p className="text-sm sm:text-base text-[#4B5563] mt-1.5">
              {currentStep.subtitle}
            </p>
          </div>

          {currentStep.type === 'single' ? (
            <div className="space-y-3" role="radiogroup" aria-label={currentStep.title}>
              {currentStep.options.map((opt) => {
                const selected = getSelectedSingle(currentStep.id) === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => handleSingleSelect(currentStep.id, opt.id)}
                    className={`w-full min-h-[56px] text-left rounded-xl p-4 border transition-all duration-150 flex items-center justify-between gap-3 cursor-pointer ${
                      selected
                        ? 'bg-[#F0FDFA] border-[#0F766E] ring-2 ring-[#0F766E]/25'
                        : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/70'
                    }`}
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="text-2xl shrink-0" aria-hidden="true">
                        {opt.icon}
                      </span>
                      <div className="min-w-0">
                        <div className="text-base font-semibold text-[#111827]">
                          {opt.label}
                        </div>
                        {opt.hint && (
                          <div className="text-xs sm:text-sm text-[#4B5563] mt-0.5">
                            {opt.hint}
                          </div>
                        )}
                      </div>
                    </div>

                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
                        selected
                          ? 'bg-[#0F766E] border-[#0F766E] text-white'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      {selected && <Check className="w-3.5 h-3.5" />}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-6">
              {currentStep.groups.map((group) => {
                const selectedVal =
                  group.key === 'mode' ? draft.mode : draft.fear;
                return (
                  <div key={group.key}>
                    <h2 className="text-sm font-bold text-[#111827] mb-2.5">
                      {group.label}
                    </h2>
                    <div
                      className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
                      role="radiogroup"
                      aria-label={group.label}
                    >
                      {group.options.map((opt) => {
                        const selected = selectedVal === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            role="radio"
                            aria-checked={selected}
                            onClick={() => handleDualSelect(group.key, opt.id)}
                            className={`min-h-[52px] text-left rounded-xl p-3.5 border transition-all duration-150 flex items-center gap-2.5 cursor-pointer ${
                              selected
                                ? 'bg-[#F0FDFA] border-[#0F766E] ring-2 ring-[#0F766E]/25'
                                : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/70'
                            }`}
                          >
                            <span className="text-xl shrink-0" aria-hidden="true">
                              {opt.icon}
                            </span>
                            <span className="text-sm font-semibold text-[#111827] leading-snug">
                              {opt.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Desktop inline action */}
          <div className="hidden sm:flex items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100">
            <div className="text-xs text-[#4B5563]">
              Aapke jawab sirf aapke phone mein save hote hain (100% private).
            </div>
            <PrimaryButton
              variant="accent"
              disabled={!isStepValid()}
              onClick={handleNext}
            >
              <span>
                {stepIdx === totalSteps - 1 ? 'Mere Best Ideas Dekho' : 'Aage Badhein'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </PrimaryButton>
          </div>
        </div>
      </main>

      {/* Mobile Sticky Bottom CTA (Thumb Zone) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-30 p-4 pb-safe bg-white/95 backdrop-blur-md border-t border-gray-200">
        <PrimaryButton
          variant="accent"
          fullWidth
          disabled={!isStepValid()}
          onClick={handleNext}
        >
          <span>
            {stepIdx === totalSteps - 1 ? 'Mere Best Ideas Dekho' : 'Aage Badhein'}
          </span>
          <ArrowRight className="w-4 h-4" />
        </PrimaryButton>
      </div>
    </div>
  );
};
