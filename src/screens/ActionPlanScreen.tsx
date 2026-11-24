import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Lock,
  Sparkles,
} from 'lucide-react';
import { PrimaryButton } from '../components/PrimaryButton';
import { useApp } from '../context/AppContext';

export const ActionPlanScreen: React.FC = () => {
  const {
    state,
    activeIdea,
    toggleTaskCompletion,
    openUnlockModal,
    showToast,
  } = useApp();

  const [selectedPhase, setSelectedPhase] = useState<1 | 2>(1);
  const [expandedTips, setExpandedTips] = useState<Record<string, boolean>>({});

  const completedIds = state.completedTasks[activeIdea.id] ?? [];
  const totalTasks = activeIdea.actionPlan.length;
  const completedCount = activeIdea.actionPlan.filter((t) =>
    completedIds.includes(t.id)
  ).length;
  const progressPct =
    totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

  const phaseTasks = activeIdea.actionPlan.filter(
    (t) => t.phase === selectedPhase
  );
  const phase2Tasks = activeIdea.actionPlan.filter((t) => t.phase === 2);

  const toggleTip = (id: string) => {
    setExpandedTips((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleDownloadBackup = () => {
    if (!state.isPro) {
      openUnlockModal('30-Day Checklist Backup download Pro Pack mein hai.');
      return;
    }

    const lines = [
      `SHURUKARO — 30-DAY BUSINESS ACTION PLAN`,
      `Business: ${activeIdea.title}`,
      `Budget Range: Rs ${activeIdea.budgetMin} - Rs ${activeIdea.budgetMax}`,
      `Progress: ${completedCount}/${totalTasks} steps completed (${progressPct}%)`,
      ``,
      `--- ACTION STEPS ---`,
      ...activeIdea.actionPlan.map((step) => {
        const done = completedIds.includes(step.id) ? '[DONE]' : '[ ]';
        const mistakeLine = step.avoidMistake
          ? `\n    Galti na karein: ${step.avoidMistake}`
          : '';
        return `${done} ${step.day} (Phase ${step.phase}): ${step.title}\n    Kya karein: ${step.whatToDo}\n    Kaise karein: ${step.tip}${mistakeLine}`;
      }),
      ``,
      `--- GALTI SE BACHEIN ---`,
      ...activeIdea.commonMistakes.map((m, i) => `${i + 1}. ${m}`),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeIdea.id}-30-day-plan.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('30-Day Checklist file download ho gayi!');
  };

  return (
    <section className="space-y-6">
      {/* Top Progress Summary Card */}
      <div className="android-card rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] flex items-center justify-center text-2xl shrink-0">
              {activeIdea.emoji}
            </div>
            <div className="min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-[#0F766E]">
                30-Day Execution Roadmap
              </p>
              <h1 className="text-xl sm:text-2xl font-bold text-[#111827] leading-snug">
                {activeIdea.title}
              </h1>
              <p className="text-sm text-[#4B5563] mt-0.5 tabular-nums">
                Aapne {completedCount}/{totalTasks} steps pure kar liye ({progressPct}%)
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadBackup}
            className="min-h-[44px] px-4 py-2 rounded-xl bg-white border border-gray-300 text-sm font-semibold text-[#111827] hover:bg-gray-50 inline-flex items-center justify-center gap-2 self-start sm:self-auto whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#0F766E]" />
            <span>Checklist Save Karein</span>
            {!state.isPro && <Lock className="w-3.5 h-3.5 text-[#EA580C]" />}
          </button>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden mt-4">
          <div
            className="h-full bg-[#0F766E] rounded-full transition-all duration-200"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* Two Separate Phase Card Tabs with Clear Gap (Zero Overlap) */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5"
          role="tablist"
          aria-label="Roadmap Phases"
        >
          <button
            type="button"
            role="tab"
            aria-selected={selectedPhase === 1}
            onClick={() => setSelectedPhase(1)}
            className={`min-h-[58px] w-full px-4 py-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
              selectedPhase === 1
                ? 'bg-[#F0FDFA] border-[#0F766E] ring-2 ring-[#0F766E]/20'
                : 'bg-[#F9FAFB] border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="min-w-0">
              <div
                className={`text-base font-bold leading-snug ${
                  selectedPhase === 1 ? 'text-[#0F766E]' : 'text-[#111827]'
                }`}
              >
                Phase 1: Day 1–7
              </div>
              <div className="text-sm text-[#4B5563] mt-0.5 leading-snug">
                Setup · Neev aur Taiyari
              </div>
            </div>
            <span
              className={`text-xs font-bold px-2.5 py-1 rounded-lg shrink-0 ${
                selectedPhase === 1
                  ? 'bg-[#0F766E] text-white'
                  : 'bg-white border border-gray-200 text-[#4B5563]'
              }`}
            >
              Open
            </span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={selectedPhase === 2}
            onClick={() => setSelectedPhase(2)}
            className={`min-h-[58px] w-full px-4 py-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-3 ${
              selectedPhase === 2
                ? 'bg-[#F0FDFA] border-[#0F766E] ring-2 ring-[#0F766E]/20'
                : 'bg-[#F9FAFB] border-gray-200 hover:bg-gray-100'
            }`}
          >
            <div className="min-w-0">
              <div
                className={`text-base font-bold leading-snug ${
                  selectedPhase === 2 ? 'text-[#0F766E]' : 'text-[#111827]'
                }`}
              >
                Phase 2: Day 8–30
              </div>
              <div className="text-sm text-[#4B5563] mt-0.5 leading-snug">
                Growth · Customer aur Kamai
              </div>
            </div>
            <span
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                !state.isPro
                  ? 'bg-[#FFF7ED] border border-[#FED7AA] text-[#EA580C]'
                  : 'bg-[#DCFCE7] border border-[#86EFAC] text-[#16A34A]'
              }`}
            >
              {!state.isPro ? (
                <Lock className="w-4 h-4" />
              ) : (
                <Check className="w-4 h-4" />
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Main Grid: Tasks + Mistakes Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Task Checklist Column */}
        <div className="lg:col-span-8 space-y-4">
          {selectedPhase === 2 && !state.isPro && (
            <div className="android-card rounded-2xl p-5 sm:p-6 bg-[#FFF7ED] border-[#FED7AA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-[#111827]">
                  Day 8–30 Growth Plan Locked Hai
                </h2>
                <p className="text-[15px] sm:text-base text-[#4B5563] mt-1 leading-relaxed">
                  Pehle 7 din ke baad regular customers, upsells aur monthly profit double karne ke poore steps Pro Starter Pack (₹199) mein milte hain.
                </p>
              </div>
              <PrimaryButton
                variant="accent"
                onClick={() =>
                  openUnlockModal('Day 8-30 Growth Roadmap unlock karein.')
                }
              >
                <Lock className="w-4 h-4" />
                <span>₹199 Me Full Plan Unlock Karein</span>
              </PrimaryButton>
            </div>
          )}

          {phaseTasks.map((task) => {
            const isChecked = completedIds.includes(task.id);
            const isLocked = task.phase === 2 && !state.isPro;
            const tipOpen = expandedTips[task.id] ?? true;

            return (
              <div
                key={task.id}
                className={`android-card rounded-2xl p-4 sm:p-6 transition-colors ${
                  isChecked ? 'bg-[#F0FDFA]/60 border-[#99F6E4]' : ''
                }`}
              >
                <div className="flex items-start gap-3.5">
                  {/* Clean 44x44 Touch Hitbox Checkbox */}
                  <button
                    type="button"
                    onClick={() =>
                      toggleTaskCompletion(activeIdea.id, task.id, task.phase)
                    }
                    aria-label={
                      isLocked
                        ? `${task.title} unlock karein`
                        : `${task.title} complete mark karein`
                    }
                    className="min-h-[44px] min-w-[44px] rounded-xl flex items-center justify-center shrink-0 hover:bg-gray-100/70 cursor-pointer"
                  >
                    <span
                      className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-colors ${
                        isLocked
                          ? 'bg-orange-50 border-[#FDBA74] text-[#EA580C]'
                          : isChecked
                          ? 'bg-[#0F766E] border-[#0F766E] text-white'
                          : 'bg-white border-gray-300'
                      }`}
                    >
                      {isLocked ? (
                        <Lock className="w-3.5 h-3.5" />
                      ) : isChecked ? (
                        <Check className="w-4 h-4" />
                      ) : null}
                    </span>
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-bold text-[#0F766E] tabular-nums">
                        {task.day}
                      </span>
                      {!isLocked && (
                        <button
                          type="button"
                          onClick={() => toggleTip(task.id)}
                          className="min-h-[36px] px-2.5 rounded-lg text-xs sm:text-sm font-semibold text-[#4B5563] hover:text-[#111827] hover:bg-gray-100 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>{tipOpen ? 'Details Chhupayein' : 'Kaise karein?'}</span>
                          {tipOpen ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>

                    <h3
                      onClick={() =>
                        toggleTaskCompletion(activeIdea.id, task.id, task.phase)
                      }
                      className={`text-base sm:text-lg font-bold mt-1 leading-snug cursor-pointer ${
                        isChecked
                          ? 'line-through text-[#4B5563]'
                          : 'text-[#111827]'
                      }`}
                    >
                      {task.title}
                    </h3>

                    {isLocked ? (
                      <div className="mt-3 rounded-xl bg-[#F9FAFB] border border-gray-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-start gap-2.5 text-[15px] text-[#4B5563] leading-relaxed">
                          <Lock className="w-4 h-4 text-[#EA580C] shrink-0 mt-1" />
                          <span>
                            Is milestone ka poora execution plan, kaise karein aur galti se bachne ka tareeka Pro Pack unlock karne par khulega.
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            openUnlockModal(`${task.day}: ${task.title} unlock karein.`)
                          }
                          className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#FFF7ED] border border-[#FED7AA] text-xs sm:text-sm font-bold text-[#EA580C] hover:bg-[#FFEDD5] whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          Unlock Karein
                        </button>
                      </div>
                    ) : (
                      <>
                        {/* Always-visible Kya karein */}
                        <p className="text-[15px] sm:text-base text-[#1F2937] mt-2 leading-relaxed">
                          <span className="font-bold text-[#111827]">Kya karein: </span>
                          {task.whatToDo}
                        </p>

                        {tipOpen && (
                          <div className="mt-3 space-y-2.5">
                            <div className="text-[15px] sm:text-base text-[#111827] leading-relaxed bg-[#F9FAFB] rounded-xl p-3.5 border border-gray-200">
                              <span className="font-bold text-[#0F766E]">Kaise karein: </span>
                              {task.tip}
                            </div>
                            {task.avoidMistake && (
                              <div className="text-[15px] sm:text-base text-[#7F1D1D] leading-relaxed bg-[#FEF2F2] rounded-xl p-3.5 border border-[#FECACA]">
                                <span className="font-bold text-[#DC2626]">Kya galti na karein: </span>
                                {task.avoidMistake}
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {/* Day 7 End Suspense / Teaser Card shown at bottom of Phase 1 */}
          {selectedPhase === 1 && (
            <div className="android-card rounded-2xl p-5 sm:p-6 bg-[#FFFBEB] border-[#FDE68A] space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F59E0B] text-white flex items-center justify-center shrink-0">
                  {state.isPro ? (
                    <Sparkles className="w-5 h-5" />
                  ) : (
                    <Lock className="w-5 h-5" />
                  )}
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-[#B45309]">
                    Day 7 Complete! Aage Kya Hone Wala Hai?
                  </p>
                  <h2 className="text-lg sm:text-xl font-bold text-[#111827] mt-0.5 leading-snug">
                    Phase 2 (Day 8–30): Asli Customers, Kamai aur Growth
                  </h2>
                </div>
              </div>

              <p className="text-[15px] sm:text-base text-[#1F2937] leading-relaxed">
                {activeIdea.phase2Teaser ??
                  'Day 7 par aapki neev taiyar ho chuki hai—ab Day 8 se 30 mein pehle paying customers lock karne, extra upsell add-ons jodne aur monthly profit double karne ka poora roadmap aage hai.'}
              </p>

              {/* Teaser Roadmap Milestones Preview */}
              <div className="rounded-xl bg-white/90 border border-[#FDE68A] p-4 space-y-2">
                <div className="text-xs sm:text-sm font-bold text-[#92400E] mb-1">
                  Day 8–30 Mein Yeh {phase2Tasks.length} Bade Milestones Khulenge:
                </div>
                <ul className="space-y-1.5">
                  {phase2Tasks.map((m) => (
                    <li
                      key={m.id}
                      className="flex items-start gap-2 text-sm sm:text-[15px] text-[#111827] leading-snug"
                    >
                      {state.isPro ? (
                        <Check className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                      ) : (
                        <Lock className="w-3.5 h-3.5 text-[#D97706] shrink-0 mt-1" />
                      )}
                      <div>
                        <span className="font-semibold tabular-nums text-[#0F766E] mr-1.5">
                          {m.day}:
                        </span>
                        <span>{m.title}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {state.isPro ? (
                <PrimaryButton
                  variant="primary"
                  fullWidth
                  onClick={() => {
                    setSelectedPhase(2);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <span>Day 8–30 Growth Plan Kholen</span>
                  <ArrowRight className="w-4 h-4" />
                </PrimaryButton>
              ) : (
                <PrimaryButton
                  variant="accent"
                  fullWidth
                  onClick={() =>
                    openUnlockModal(
                      'Day 8 se Day 30 tak ka poora customer growth aur profit roadmap unlock karein.'
                    )
                  }
                >
                  <Lock className="w-4 h-4" />
                  <span>₹199 Me Full Plan Unlock Karein</span>
                </PrimaryButton>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Galti Se Bachein */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="android-card rounded-2xl p-5 bg-[#FEF2F2] border-[#FECACA]">
            <div className="flex items-center gap-2 text-base font-bold text-[#DC2626] mb-3">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Shuruwat Mein Yeh Galtiyan Na Karein</span>
            </div>
            <ul className="space-y-3">
              {activeIdea.commonMistakes.map((mistake, index) => (
                <li
                  key={index}
                  className="text-[15px] text-[#7F1D1D] leading-relaxed pb-3 border-b border-[#FECACA]/70 last:border-b-0 last:pb-0"
                >
                  <span className="font-bold mr-1.5 tabular-nums">
                    {index + 1}.
                  </span>
                  {mistake}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </section>
  );
};
