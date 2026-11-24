import React from 'react';
import {
  Calculator,
  CheckSquare,
  HelpCircle,
  Lightbulb,
  Lock,
  Sparkles,
} from 'lucide-react';
import { BrandLogo } from '../components/BrandLogo';
import { PWAInstallBanner } from '../components/PWAInstallButton';
import { Toast } from '../components/Toast';
import { useApp } from '../context/AppContext';
import { ActionPlanScreen } from '../screens/ActionPlanScreen';
import { CustomerFinderScreen } from '../screens/CustomerFinderScreen';
import { DoubtSolverScreen } from '../screens/DoubtSolverScreen';
import { EstimatorScreen } from '../screens/EstimatorScreen';
import { IdeasScreen } from '../screens/IdeasScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { UnlockModal } from '../screens/UnlockModal';
import { MainTab } from '../types';

const NAV_ITEMS: { id: MainTab; label: string; shortLabel: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'ideas', label: 'Ideas', shortLabel: 'Ideas', icon: Lightbulb },
  { id: 'plan', label: '30-Day Plan', shortLabel: '30-Day Plan', icon: CheckSquare },
  { id: 'estimator', label: 'Hisaab', shortLabel: 'Hisaab', icon: Calculator },
  { id: 'grow', label: 'Customers & Help', shortLabel: 'Help', icon: HelpCircle },
];

export const AppNavigator: React.FC = () => {
  const {
    state,
    activeTab,
    setActiveTab,
    growSubTab,
    setGrowSubTab,
    isQuizEditing,
    activeIdea,
    openUnlockModal,
    showToast,
  } = useApp();

  if (!state.onboardingDone || isQuizEditing) {
    return (
      <>
        <OnboardingScreen />
        <Toast />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] flex flex-col">
      {/* Desktop & Mobile Top App Bar (3-zone contract on desktop, compact 52px on mobile) */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-4 sm:gap-8">
          {/* Zone 1: Brand icon + single-line wordmark */}
          <button
            type="button"
            onClick={() => setActiveTab('ideas')}
            className="inline-flex items-center gap-2.5 text-lg sm:text-xl font-extrabold tracking-tight text-[#0F766E] whitespace-nowrap shrink-0 cursor-pointer"
          >
            <BrandLogo size={32} />
            <span>ShuruKaro</span>
          </button>

          {/* Zone 2: Clean single-line nav links on desktop */}
          <nav
            className="hidden md:flex items-center gap-6 text-sm font-semibold"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`py-1.5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    active
                      ? 'border-[#0F766E] text-[#0F766E]'
                      : 'border-transparent text-[#4B5563] hover:text-[#111827]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Single Primary Action */}
          <div className="flex items-center gap-2 shrink-0">
            {state.isPro ? (
              <button
                type="button"
                onClick={() =>
                  showToast(
                    state.proUtr
                      ? `Pro Active hai (UTR: ${state.proUtr})`
                      : 'Pro Plan Active hai!'
                  )
                }
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#DCFCE7] border border-[#86EFAC] text-xs font-bold text-[#166534] inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#16A34A]" />
                <span>Pro Active</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => openUnlockModal()}
                className="min-h-[40px] px-3.5 py-2 rounded-xl bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-sm cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span className="sm:hidden">₹199 Unlock</span>
                <span className="hidden sm:inline">₹199 Me Full Plan Unlock Karein</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-5 sm:py-8 pb-24 md:pb-12">
        <PWAInstallBanner />
        {activeTab === 'ideas' && <IdeasScreen />}
        {activeTab === 'plan' && <ActionPlanScreen />}
        {activeTab === 'estimator' && <EstimatorScreen />}
        {activeTab === 'grow' && (
          <section className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold text-[#0F766E] mb-1">
                  {activeIdea.emoji} {activeIdea.title}
                </p>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">
                  First Customers & Doubt Solver
                </h1>
              </div>

              {/* Segmented sub-tab toggle */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-white border border-gray-200 rounded-xl self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setGrowSubTab('customers')}
                  className={`min-h-[40px] px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    growSubTab === 'customers'
                      ? 'bg-[#0F766E] text-white'
                      : 'text-[#4B5563] hover:text-[#111827]'
                  }`}
                >
                  Pehle 10 Customers
                </button>
                <button
                  type="button"
                  onClick={() => setGrowSubTab('doubts')}
                  className={`min-h-[40px] px-4 py-1.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap cursor-pointer transition-colors ${
                    growSubTab === 'doubts'
                      ? 'bg-[#0F766E] text-white'
                      : 'text-[#4B5563] hover:text-[#111827]'
                  }`}
                >
                  Doubt Solver
                </button>
              </div>
            </div>

            {growSubTab === 'customers' ? (
              <CustomerFinderScreen />
            ) : (
              <DoubtSolverScreen />
            )}
          </section>
        )}
      </main>

      {/* Mobile Bottom Tab Bar (Thumb-Zone Ergonomics) */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 pb-safe"
        aria-label="Mobile bottom navigation"
      >
        <div className="grid grid-cols-4 h-16 items-center">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`min-h-[48px] flex flex-col items-center justify-center gap-0.5 px-1 cursor-pointer transition-colors ${
                  active ? 'text-[#0F766E]' : 'text-[#4B5563]'
                }`}
              >
                <Icon className={`w-5 h-5 ${active ? 'stroke-[2.4]' : 'stroke-[1.8]'}`} />
                <span className="text-[11px] font-semibold tracking-tight whitespace-nowrap">
                  {item.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      <UnlockModal />
      <Toast />
    </div>
  );
};
