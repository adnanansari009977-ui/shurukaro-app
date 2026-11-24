import React, { useState } from 'react';
import {
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
  Lock,
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
        return `${done} ${step.day} (Phase ${step.phase}): ${step.title}\n    Tip: ${step.tip}`;
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
            <div>
              <p className="text-xs font-semibold text-[#0F766E]">
                30-Day Execution Roadmap
              </p>
              <h1 className="text-xl sm:text-2xl font-bold text-[#111827] leading-snug">
                {activeIdea.title}
              </h1>
              <p className="text-xs sm:text-sm text-[#4B5563] mt-0.5 tabular-nums">
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

        {/* Phase Filter Segmented Buttons */}
        <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#F3F4F6] rounded-xl mt-5">
          <button
            type="button"
            onClick={() => setSelectedPhase(1)}
            className={`min-h-[44px] px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
              selectedPhase === 1
                ? 'bg-white text-[#111827] shadow-sm'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            <span>Phase 1: Day 1-7 Setup</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedPhase(2)}
            className={`min-h-[44px] px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap ${
              selectedPhase === 2
                ? 'bg-white text-[#111827] shadow-sm'
                : 'text-[#4B5563] hover:text-[#111827]'
            }`}
          >
            <span>Phase 2: Day 8-30 Growth</span>
            {!state.isPro ? (
              <Lock className="w-3.5 h-3.5 text-[#EA580C] shrink-0" />
            ) : (
              <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
            )}
          </button>
        </div>
      </div>

      {/* Main Grid: Tasks + Mistakes Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Task Checklist Column */}
        <div className="lg:col-span-8 space-y-3">
          {selectedPhase === 2 && !state.isPro && (
            <div className="android-card rounded-2xl p-5 bg-[#FFF7ED] border-[#FED7AA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-[#111827]">
                  Day 8-30 Growth Plan Locked Hai
                </h2>
                <p className="text-sm text-[#4B5563] mt-0.5">
                  Pehle 7 din ke baad regular customers aur profit double karne ke steps Pro Starter Pack (₹199) mein milte hain.
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
            const tipOpen = expandedTips[task.id] ?? task.phase === 1;

            return (
              <div
                key={task.id}
                className={`android-card rounded-2xl p-4 sm:p-5 transition-colors ${
                  isChecked ? 'bg-[#F0FDFA]/60 border-[#99F6E4]' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* 44x44 Touch Hitbox Checkbox */}
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
                    className="min-h-[44px] min-w-[44px] -m-1.5 flex items-center justify-center shrink-0 cursor-pointer"
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
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[#0F766E] tabular-nums">
                        {task.day}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          isLocked
                            ? openUnlockModal('Kaise karein tip dekhne ke liye Pro unlock karein.')
                            : toggleTip(task.id)
                        }
                        className="min-h-[36px] px-2 rounded-lg text-xs font-semibold text-[#4B5563] hover:text-[#111827] hover:bg-gray-100 inline-flex items-center gap-1 cursor-pointer"
                      >
                        <span>Kaise karein?</span>
                        {tipOpen && !isLocked ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>

                    <h3
                      onClick={() =>
                        toggleTaskCompletion(activeIdea.id, task.id, task.phase)
                      }
                      className={`text-base font-bold mt-0.5 cursor-pointer ${
                        isChecked
                          ? 'line-through text-[#4B5563]'
                          : 'text-[#111827]'
                      }`}
                    >
                      {task.title}
                    </h3>

                    {tipOpen && (
                      <div className="mt-2.5 text-sm text-[#4B5563] leading-relaxed bg-[#F9FAFB] rounded-xl p-3 border border-gray-100">
                        {isLocked
                          ? '🔒 Yeh step-by-step tareeka Pro Pack unlock karne par dikhega.'
                          : task.tip}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Galti Se Bachein */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="android-card rounded-2xl p-5 bg-[#FEF2F2] border-[#FECACA]">
            <div className="flex items-center gap-2 text-sm font-bold text-[#DC2626] mb-3">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Shuruwat Mein Yeh Galtiyan Na Karein</span>
            </div>
            <ul className="space-y-3">
              {activeIdea.commonMistakes.map((mistake, index) => (
                <li
                  key={index}
                  className="text-sm text-[#7F1D1D] leading-relaxed pb-3 border-b border-[#FECACA]/70 last:border-b-0 last:pb-0"
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
