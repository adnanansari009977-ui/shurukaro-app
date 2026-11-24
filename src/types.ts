export type BudgetBandId = 'zero_low' | 'low_mid' | 'mid' | 'high';
export type TimeCommitmentId = 'part_1_2' | 'part_3_4' | 'full_time';
export type SkillId = 'food' | 'repair_craft' | 'trade_sell' | 'digital' | 'field_service';
export type ModeId = 'home_online' | 'local_area' | 'market_shop';
export type FearId = 'money_loss' | 'no_customers' | 'confidence';

export interface MatcherAnswers {
  budget: BudgetBandId | null;
  time: TimeCommitmentId | null;
  skill: SkillId | null;
  mode: ModeId | null;
  fear: FearId | null;
}

export interface MatcherOption {
  id: string;
  label: string;
  hint?: string;
  icon: string;
}

export interface MatcherStepSingle {
  id: 'budget' | 'time' | 'skill';
  stepNumber: number;
  title: string;
  subtitle: string;
  type: 'single';
  options: MatcherOption[];
}

export interface MatcherDualGroup {
  key: 'mode' | 'fear';
  label: string;
  options: MatcherOption[];
}

export interface MatcherStepDual {
  id: 'context';
  stepNumber: number;
  title: string;
  subtitle: string;
  type: 'dual';
  groups: MatcherDualGroup[];
}

export type MatcherStep = MatcherStepSingle | MatcherStepDual;

export interface ActionPlanStep {
  id: string;
  day: string;
  phase: 1 | 2;
  title: string;
  tip: string;
}

export interface StartupCostItem {
  item: string;
  cost: number;
}

export interface PitchTemplate {
  title: string;
  isPro: boolean;
  text: string;
}

export interface EstimatorConfig {
  unitName: string;
  defaultUnitsPerDay: number;
  isMonthlyClientModel?: boolean;
  pricePerUnit: number;
  workingDays: number;
  costPercentage: number;
  minUnits: number;
  maxUnits: number;
  minPrice: number;
  maxPrice: number;
  priceStep: number;
}

export interface BusinessIdea {
  id: string;
  title: string;
  category: string;
  emoji: string;
  tagline: string;
  budgetMin: number;
  budgetMax: number;
  budgetBand: BudgetBandId[];
  timeFit: TimeCommitmentId[];
  skillFit: SkillId[];
  modeFit: ModeId[];
  earningRange: string;
  defaultEstimator: EstimatorConfig;
  startupCosts: StartupCostItem[];
  whyItFitsMap: Record<FearId, string>;
  commonMistakes: string[];
  actionPlan: ActionPlanStep[];
  customerWays: string[];
  pitches: PitchTemplate[];
}

export interface ScoredIdea {
  idea: BusinessIdea;
  score: number;
  matchPercent: number;
  whyItFits: string;
  keyMistake: string;
}

export type DoubtCategory = 'Pricing' | 'Pehla Order' | 'Udhaar/Trust' | 'Confidence';

export interface DoubtQAItem {
  id: string;
  category: DoubtCategory;
  question: string;
  answer: string;
  practicalRule: string;
  isPro: boolean;
}

export interface EstimatorOverride {
  units: number;
  price: number;
  costPct: number;
  workingDays: number;
}

export type MainTab = 'ideas' | 'plan' | 'estimator' | 'grow';
export type GrowSubTab = 'customers' | 'doubts';

export interface AppPersistedState {
  onboardingDone: boolean;
  answers: MatcherAnswers;
  activeIdeaId: string;
  completedTasks: Record<string, string[]>;
  estimatorOverrides: Record<string, EstimatorOverride>;
  isPro: boolean;
  proUtr?: string;
  proUnlockedAt?: string;
}
