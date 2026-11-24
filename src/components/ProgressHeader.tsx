import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { BrandLogo } from './BrandLogo';

interface ProgressHeaderProps {
  currentStep: number;
  totalSteps: number;
  onBack?: () => void;
  canGoBack?: boolean;
  rightSlot?: React.ReactNode;
}

export const ProgressHeader: React.FC<ProgressHeaderProps> = ({
  currentStep,
  totalSteps,
  onBack,
  canGoBack = true,
  rightSlot,
}) => {
  const pct = Math.min(100, Math.max(0, Math.round((currentStep / totalSteps) * 100)));

  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-4 min-h-[48px]">
        <div className="flex items-center gap-2">
          {canGoBack && onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="min-h-[44px] min-w-[44px] -ml-2 px-2 rounded-xl inline-flex items-center justify-center gap-1.5 text-sm font-medium text-[#4B5563] hover:text-[#111827] hover:bg-gray-100 transition-colors cursor-pointer"
              aria-label="Peeche Jayein"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <div className="min-h-[44px] inline-flex items-center gap-2 text-base font-extrabold text-[#0F766E] whitespace-nowrap">
              <BrandLogo size={28} />
              <span>ShuruKaro</span>
            </div>
          )}
        </div>

        <div className="text-xs sm:text-sm font-semibold text-[#4B5563] tabular-nums">
          Step {currentStep} of {totalSteps}
        </div>

        <div className="flex items-center justify-end min-w-[44px]">
          {rightSlot}
        </div>
      </div>

      <div
        className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mt-1"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className="h-full bg-[#0F766E] rounded-full transition-all duration-200 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
