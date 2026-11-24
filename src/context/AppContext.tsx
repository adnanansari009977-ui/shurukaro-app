import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { BUSINESS_IDEAS } from '../data/businessIdeas';
import {
  AppPersistedState,
  BusinessIdea,
  EstimatorOverride,
  GrowSubTab,
  MainTab,
  MatcherAnswers,
  ScoredIdea,
} from '../types';
import { scoreIdeas } from '../utils/matcherEngine';
import { DEFAULT_APP_STATE, loadAppState, saveAppState } from '../utils/storage';

interface AppContextValue {
  state: AppPersistedState;
  activeTab: MainTab;
  setActiveTab: (tab: MainTab) => void;
  growSubTab: GrowSubTab;
  setGrowSubTab: (sub: GrowSubTab) => void;
  isQuizEditing: boolean;
  openQuiz: () => void;
  closeQuiz: () => void;
  unlockModalOpen: boolean;
  unlockReason: string | null;
  openUnlockModal: (reason?: string) => void;
  closeUnlockModal: () => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  scoredIdeas: ScoredIdea[];
  activeIdea: BusinessIdea;
  activeScoredIdea: ScoredIdea;
  submitOnboarding: (answers: MatcherAnswers) => void;
  skipOnboardingWithDefaults: () => void;
  selectActiveIdea: (ideaId: string, goToPlan?: boolean) => void;
  toggleTaskCompletion: (ideaId: string, taskId: string, phase: 1 | 2) => void;
  getEstimatorValues: (idea: BusinessIdea) => EstimatorOverride;
  updateEstimatorValues: (ideaId: string, patch: Partial<EstimatorOverride>) => void;
  resetEstimatorValues: (ideaId: string) => void;
  unlockPro: (utr: string) => boolean;
  resetAllProgress: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppPersistedState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<MainTab>('ideas');
  const [growSubTab, setGrowSubTab] = useState<GrowSubTab>('customers');
  const [isQuizEditing, setIsQuizEditing] = useState<boolean>(false);
  const [unlockModalOpen, setUnlockModalOpen] = useState<boolean>(false);
  const [unlockReason, setUnlockReason] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    saveAppState(state);
  }, [state]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
  };

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const scoredIdeas = useMemo(() => scoreIdeas(state.answers), [state.answers]);

  const activeIdea = useMemo(() => {
    return (
      BUSINESS_IDEAS.find((b) => b.id === state.activeIdeaId) ??
      scoredIdeas[0]?.idea ??
      BUSINESS_IDEAS[0]
    );
  }, [state.activeIdeaId, scoredIdeas]);

  const activeScoredIdea = useMemo(() => {
    return (
      scoredIdeas.find((s) => s.idea.id === activeIdea.id) ?? scoredIdeas[0]
    );
  }, [scoredIdeas, activeIdea]);

  const submitOnboarding = (answers: MatcherAnswers) => {
    const ranked = scoreIdeas(answers);
    const topId = ranked[0]?.idea.id ?? BUSINESS_IDEAS[0].id;
    setState((prev) => ({
      ...prev,
      onboardingDone: true,
      answers,
      activeIdeaId: topId,
    }));
    setIsQuizEditing(false);
    setActiveTab('ideas');
    showToast('Aapke liye Top 3 Business Ideas ready hain!');
  };

  const skipOnboardingWithDefaults = () => {
    const defaultAnswers: MatcherAnswers = {
      budget: 'low_mid',
      time: 'part_3_4',
      skill: 'food',
      mode: 'local_area',
      fear: 'money_loss',
    };
    const ranked = scoreIdeas(defaultAnswers);
    setState((prev) => ({
      ...prev,
      onboardingDone: true,
      answers: prev.answers.budget ? prev.answers : defaultAnswers,
      activeIdeaId: prev.activeIdeaId || ranked[0].idea.id,
    }));
    setIsQuizEditing(false);
    setActiveTab('ideas');
  };

  const openQuiz = () => setIsQuizEditing(true);
  const closeQuiz = () => setIsQuizEditing(false);

  const openUnlockModal = (reason?: string) => {
    setUnlockReason(reason ?? null);
    setUnlockModalOpen(true);
  };

  const closeUnlockModal = () => {
    setUnlockModalOpen(false);
    setUnlockReason(null);
  };

  const selectActiveIdea = (ideaId: string, goToPlan = false) => {
    setState((prev) => ({
      ...prev,
      activeIdeaId: ideaId,
    }));
    const idea = BUSINESS_IDEAS.find((b) => b.id === ideaId);
    if (idea) {
      showToast(`${idea.title} chuna gaya`);
    }
    if (goToPlan) {
      setActiveTab('plan');
    }
  };

  const toggleTaskCompletion = (ideaId: string, taskId: string, phase: 1 | 2) => {
    if (phase === 2 && !state.isPro) {
      openUnlockModal('Day 8-30 Growth Plan Pro Pack mein included hai.');
      return;
    }
    setState((prev) => {
      const existing = prev.completedTasks[ideaId] ?? [];
      const exists = existing.includes(taskId);
      const updated = exists
        ? existing.filter((id) => id !== taskId)
        : [...existing, taskId];
      return {
        ...prev,
        completedTasks: {
          ...prev.completedTasks,
          [ideaId]: updated,
        },
      };
    });
  };

  const getEstimatorValues = (idea: BusinessIdea): EstimatorOverride => {
    const saved = state.estimatorOverrides[idea.id];
    if (saved) return saved;
    return {
      units: idea.defaultEstimator.defaultUnitsPerDay,
      price: idea.defaultEstimator.pricePerUnit,
      costPct: idea.defaultEstimator.costPercentage,
      workingDays: idea.defaultEstimator.workingDays,
    };
  };

  const updateEstimatorValues = (ideaId: string, patch: Partial<EstimatorOverride>) => {
    const idea = BUSINESS_IDEAS.find((b) => b.id === ideaId);
    if (!idea) return;
    setState((prev) => {
      const current = prev.estimatorOverrides[ideaId] ?? {
        units: idea.defaultEstimator.defaultUnitsPerDay,
        price: idea.defaultEstimator.pricePerUnit,
        costPct: idea.defaultEstimator.costPercentage,
        workingDays: idea.defaultEstimator.workingDays,
      };
      return {
        ...prev,
        estimatorOverrides: {
          ...prev.estimatorOverrides,
          [ideaId]: {
            ...current,
            ...patch,
          },
        },
      };
    });
  };

  const resetEstimatorValues = (ideaId: string) => {
    setState((prev) => {
      const next = { ...prev.estimatorOverrides };
      delete next[ideaId];
      return {
        ...prev,
        estimatorOverrides: next,
      };
    });
    showToast('Calculator default values par reset ho gaya');
  };

  const unlockPro = (utr: string): boolean => {
    const cleaned = utr.trim();
    if (!/^\d{12}$/.test(cleaned)) {
      return false;
    }
    setState((prev) => ({
      ...prev,
      isPro: true,
      proUtr: cleaned,
      proUnlockedAt: new Date().toISOString(),
    }));
    closeUnlockModal();
    showToast('Pro Plan unlock ho gaya! Saare 30-Day Pro sections ab khul gaye hain.');
    return true;
  };

  const resetAllProgress = () => {
    setState(DEFAULT_APP_STATE);
    setActiveTab('ideas');
    setIsQuizEditing(false);
    showToast('Naya start! Saara data reset ho gaya.');
  };

  return (
    <AppContext.Provider
      value={{
        state,
        activeTab,
        setActiveTab,
        growSubTab,
        setGrowSubTab,
        isQuizEditing,
        openQuiz,
        closeQuiz,
        unlockModalOpen,
        unlockReason,
        openUnlockModal,
        closeUnlockModal,
        toastMessage,
        showToast,
        scoredIdeas,
        activeIdea,
        activeScoredIdea,
        submitOnboarding,
        skipOnboardingWithDefaults,
        selectActiveIdea,
        toggleTaskCompletion,
        getEstimatorValues,
        updateEstimatorValues,
        resetEstimatorValues,
        unlockPro,
        resetAllProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error('useApp must be used within AppProvider');
  }
  return ctx;
}
