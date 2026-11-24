import React from 'react';
import { AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { ScoredIdea } from '../types';
import { formatINR } from '../utils/storage';
import { PrimaryButton } from './PrimaryButton';

interface IdeaCardProps {
  scored: ScoredIdea;
  rank: number;
  isActive: boolean;
  onSelect: () => void;
  onOpenPlan: () => void;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({
  scored,
  rank,
  isActive,
  onSelect,
  onOpenPlan,
}) => {
  const { idea, matchPercent, whyItFits, keyMistake } = scored;

  return (
    <article
      className={`android-card rounded-2xl p-5 sm:p-6 flex flex-col justify-between transition-all duration-150 ${
        isActive
          ? 'ring-2 ring-[#0F766E] border-[#0F766E]'
          : 'hover:border-gray-300'
      }`}
    >
      <div>
        {/* Unboxed metadata line per zero-pill discipline */}
        <div className="flex items-center justify-between gap-2 text-xs font-semibold mb-2.5">
          <span className={rank === 1 ? 'text-[#EA580C]' : 'text-[#0F766E]'}>
            #{rank} {rank === 1 ? 'Best Match' : 'Strong Fit'} · {matchPercent}% Fit
          </span>
          <span className="text-[#4B5563] font-medium truncate">{idea.category}</span>
        </div>

        {/* Title & Tagline */}
        <div className="flex items-start gap-3">
          <div
            className="w-12 h-12 rounded-xl bg-[#F3F4F6] flex items-center justify-center text-2xl shrink-0"
            aria-hidden="true"
          >
            {idea.emoji}
          </div>
          <div className="min-w-0">
            <h3 className="text-lg sm:text-xl font-bold text-[#111827] leading-snug">
              {idea.title}
            </h3>
            <p className="text-sm text-[#4B5563] mt-0.5 leading-relaxed">
              {idea.tagline}
            </p>
          </div>
        </div>

        {/* Financial Metrics Row */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
          <div>
            <div className="text-xs font-medium text-[#4B5563]">Shuruwati Budget</div>
            <div className="text-sm sm:text-base font-bold text-[#111827] font-mono-num mt-0.5">
              {formatINR(idea.budgetMin)} - {formatINR(idea.budgetMax)}
            </div>
          </div>
          <div>
            <div className="text-xs font-medium text-[#4B5563]">Andazan Kamai</div>
            <div className="text-sm sm:text-base font-bold text-[#0F766E] font-mono-num mt-0.5">
              {idea.earningRange}
            </div>
          </div>
        </div>

        {/* Why It Fits */}
        <div className="mt-4 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#0F766E] mb-1">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Aapke liye kyun fit hai</span>
          </div>
          <p className="text-sm text-[#111827] leading-relaxed">{whyItFits}</p>
        </div>

        {/* Common Mistake Warning (hairline border, no thick left bar) */}
        <div className="mt-3 rounded-xl bg-[#FEF2F2] border border-[#FECACA] p-3.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#DC2626] mb-1">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Galti se bachein</span>
          </div>
          <p className="text-sm text-[#7F1D1D] leading-relaxed">{keyMistake}</p>
        </div>
      </div>

      {/* Action CTA */}
      <div className="mt-5 pt-4 border-t border-gray-100 flex items-center gap-2.5">
        {isActive ? (
          <PrimaryButton variant="primary" fullWidth onClick={onOpenPlan}>
            <span>30-Day Plan Kholen</span>
            <ChevronRight className="w-4 h-4" />
          </PrimaryButton>
        ) : (
          <PrimaryButton variant="accent" fullWidth onClick={onSelect}>
            <span>Is Idea Se Shuru Karein</span>
            <ChevronRight className="w-4 h-4" />
          </PrimaryButton>
        )}
      </div>
    </article>
  );
};
