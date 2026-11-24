import { AppPersistedState } from '../types';

const STORAGE_KEY = '@bs_app_state_v1';

export const DEFAULT_APP_STATE: AppPersistedState = {
  onboardingDone: false,
  answers: {
    budget: null,
    time: null,
    skill: null,
    mode: null,
    fear: null,
  },
  activeIdeaId: 'home_tiffin',
  completedTasks: {},
  estimatorOverrides: {},
  isPro: false,
};

export function loadAppState(): AppPersistedState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_APP_STATE;
    const parsed = JSON.parse(raw) as Partial<AppPersistedState>;
    const validPro = Boolean(parsed.isPro && parsed.proUtr && /^\d{12}$/.test(parsed.proUtr));
    return {
      ...DEFAULT_APP_STATE,
      ...parsed,
      isPro: validPro,
      answers: {
        ...DEFAULT_APP_STATE.answers,
        ...(parsed.answers ?? {}),
      },
      completedTasks: parsed.completedTasks ?? {},
      estimatorOverrides: parsed.estimatorOverrides ?? {},
    };
  } catch {
    return DEFAULT_APP_STATE;
  }
}

export function saveAppState(state: AppPersistedState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota or storage restriction errors silently
  }
}

export function formatINR(amount: number): string {
  const safe = Math.round(Number.isFinite(amount) ? amount : 0);
  return '₹' + safe.toLocaleString('en-IN');
}
