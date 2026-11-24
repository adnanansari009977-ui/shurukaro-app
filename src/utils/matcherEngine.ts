import { BUSINESS_IDEAS } from '../data/businessIdeas';
import { BudgetBandId, FearId, MatcherAnswers, ScoredIdea } from '../types';

const BUDGET_ORDER: BudgetBandId[] = ['zero_low', 'low_mid', 'mid', 'high'];

export function scoreIdeas(answers: MatcherAnswers): ScoredIdea[] {
  const userBudgetIdx = answers.budget ? BUDGET_ORDER.indexOf(answers.budget) : 1;
  const fear: FearId = answers.fear ?? 'money_loss';

  const scored = BUSINESS_IDEAS.map((idea) => {
    let score = 40; // Base relevance

    // 1. Primary Skill Match (Highest Weight: +32)
    if (answers.skill && idea.skillFit.includes(answers.skill)) {
      score += 32;
    } else if (
      answers.skill === 'trade_sell' &&
      (idea.id === 'local_digital_helper' || idea.id === 'chai_nashta_cart')
    ) {
      score += 14;
    }

    // 2. Budget Fit (+18 exact, +8 affordable below budget, -12 too expensive)
    if (answers.budget && idea.budgetBand.includes(answers.budget)) {
      score += 18;
    } else {
      const ideaMinBudgetIdx = Math.min(
        ...idea.budgetBand.map((b) => BUDGET_ORDER.indexOf(b))
      );
      if (userBudgetIdx >= ideaMinBudgetIdx) {
        score += 10; // User can afford it safely
      } else {
        score -= 14; // Slightly above comfort budget
      }
    }

    // 3. Time Commitment Fit (+8)
    if (answers.time && idea.timeFit.includes(answers.time)) {
      score += 8;
    }

    // 4. Mode / Location Fit (+8)
    if (answers.mode && idea.modeFit.includes(answers.mode)) {
      score += 8;
    }

    // Clamp matchPercent between 64% and 97% for clear, realistic ranking
    const matchPercent = Math.max(64, Math.min(97, Math.round(score)));

    const whyBase = idea.whyItFitsMap[fear];
    const extraHint =
      answers.budget === 'zero_low' && idea.budgetMin <= 2000
        ? ' Kam lagat ke karan yeh aapke budget mein bilkul fit hai.'
        : answers.time === 'part_1_2' && idea.timeFit.includes('part_1_2')
        ? ' Roz 1-2 ghante mein aaram se chalaya ja sakta hai.'
        : '';

    return {
      idea,
      score,
      matchPercent,
      whyItFits: `${whyBase}${extraHint}`,
      keyMistake: idea.commonMistakes[0],
    };
  });

  return scored.sort((a, b) => b.score - a.score);
}
