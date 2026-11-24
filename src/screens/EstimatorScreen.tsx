import React from 'react';
import { Lock, Minus, Plus, RotateCcw } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatINR } from '../utils/storage';

export const EstimatorScreen: React.FC = () => {
  const {
    state,
    activeIdea,
    getEstimatorValues,
    updateEstimatorValues,
    resetEstimatorValues,
    openUnlockModal,
    showToast,
  } = useApp();

  const cfg = activeIdea.defaultEstimator;
  const vals = getEstimatorValues(activeIdea);

  const totalStartupCost = activeIdea.startupCosts.reduce(
    (sum, item) => sum + item.cost,
    0
  );

  const isMonthly = Boolean(cfg.isMonthlyClientModel);
  const monthlyUnits = isMonthly ? vals.units : vals.units * vals.workingDays;
  const monthlySales = monthlyUnits * vals.price;
  const monthlyExpense = Math.round((monthlySales * vals.costPct) / 100);
  const monthlyNetProfit = monthlySales - monthlyExpense;

  const dailyProfit = monthlyNetProfit / 30;
  const breakEvenDays =
    dailyProfit > 0 ? Math.max(1, Math.ceil(totalStartupCost / dailyProfit)) : null;

  const stepUnits = (delta: number) => {
    const next = Math.min(cfg.maxUnits, Math.max(cfg.minUnits, vals.units + delta));
    updateEstimatorValues(activeIdea.id, { units: next });
  };

  const stepPrice = (delta: number) => {
    const next = Math.min(cfg.maxPrice, Math.max(cfg.minPrice, vals.price + delta));
    updateEstimatorValues(activeIdea.id, { price: next });
  };

  const stepCostPct = (delta: number) => {
    const next = Math.min(85, Math.max(5, vals.costPct + delta));
    updateEstimatorValues(activeIdea.id, { costPct: next });
  };

  const applyScenario = (
    name: string,
    unitMultiplier: number,
    priceMultiplier: number
  ) => {
    if (!state.isPro) {
      openUnlockModal(
        'Slow Start, Steady aur Full Rush profit scenarios Pro Pack mein hain.'
      );
      return;
    }
    const nextUnits = Math.min(
      cfg.maxUnits,
      Math.max(cfg.minUnits, Math.round(cfg.defaultUnitsPerDay * unitMultiplier))
    );
    const rawPrice = cfg.pricePerUnit * priceMultiplier;
    const roundedPrice =
      Math.round(rawPrice / cfg.priceStep) * cfg.priceStep;
    const nextPrice = Math.min(
      cfg.maxPrice,
      Math.max(cfg.minPrice, roundedPrice)
    );
    updateEstimatorValues(activeIdea.id, {
      units: nextUnits,
      price: nextPrice,
    });
    showToast(`${name} scenario apply ho gaya!`);
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-[#0F766E] mb-1">
            Paisa Aur Kamai Ka Hisaab
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111827]">
            {activeIdea.emoji} {activeIdea.title}
          </h1>
        </div>
        <button
          type="button"
          onClick={() => resetEstimatorValues(activeIdea.id)}
          className="min-h-[44px] px-3.5 py-2 rounded-xl bg-white border border-gray-300 text-sm font-semibold text-[#4B5563] hover:text-[#111827] hover:bg-gray-50 inline-flex items-center gap-1.5 self-start sm:self-auto whitespace-nowrap shrink-0 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Default Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Section A: Startup Breakdown */}
        <div className="lg:col-span-5 space-y-5">
          <div className="android-card rounded-2xl p-5 sm:p-6">
            <h2 className="text-lg font-bold text-[#111827]">
              Section A: Shuruwati Kharch (One-Time Setup)
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563] mt-0.5">
              Sirf zaroori samaan jo pehle hafte chahiye
            </p>

            <div className="mt-4 divide-y divide-gray-100">
              {activeIdea.startupCosts.map((row, idx) => (
                <div
                  key={idx}
                  className="py-3 flex items-center justify-between gap-4 text-sm"
                >
                  <span className="text-[#111827] font-medium">{row.item}</span>
                  <span className="font-mono-num font-semibold text-[#111827] shrink-0">
                    {formatINR(row.cost)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <span className="text-sm font-bold text-[#111827]">
                Total Shuruwati Lagat
              </span>
              <span className="text-xl font-bold font-mono-num text-[#0F766E]">
                {formatINR(totalStartupCost)}
              </span>
            </div>
          </div>

          {/* Pro Scenarios Card */}
          <div className="android-card rounded-2xl p-5">
            <div className="flex items-center justify-between gap-2 mb-3">
              <h3 className="text-sm font-bold text-[#111827]">
                1-Tap Earning Scenarios
              </h3>
              {!state.isPro && (
                <span className="text-xs font-semibold text-[#EA580C] inline-flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Pro</span>
                </span>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => applyScenario('Slow Start', 0.6, 0.9)}
                className="min-h-[48px] px-2 py-2 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 text-xs font-semibold text-[#111827] cursor-pointer"
              >
                Slow Start
              </button>
              <button
                type="button"
                onClick={() => applyScenario('Steady', 1.0, 1.0)}
                className="min-h-[48px] px-2 py-2 rounded-xl border border-[#CCFBF1] bg-[#F0FDFA] hover:bg-[#CCFBF1] text-xs font-semibold text-[#0F766E] cursor-pointer"
              >
                Steady
              </button>
              <button
                type="button"
                onClick={() => applyScenario('Full Rush', 1.75, 1.1)}
                className="min-h-[48px] px-2 py-2 rounded-xl border border-[#FED7AA] bg-[#FFF7ED] hover:bg-[#FFEDD5] text-xs font-semibold text-[#EA580C] cursor-pointer"
              >
                Full Rush
              </button>
            </div>
          </div>
        </div>

        {/* Section B: Interactive Kamai Calculator + Live Output */}
        <div className="lg:col-span-7 space-y-5">
          <div className="android-card rounded-2xl p-5 sm:p-6 space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#111827]">
                Section B: Kamai Calculator (Apna Andaaza Lagayein)
              </h2>
              <p className="text-xs sm:text-sm text-[#4B5563] mt-0.5">
                Numbers badal kar dekhein mahine mein kitni shuddh bachat hogi
              </p>
            </div>

            {/* Control 1: Units */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="units-slider"
                  className="text-sm font-semibold text-[#111827]"
                >
                  {isMonthly
                    ? `Mahine ke total ${cfg.unitName}?`
                    : `Roz ke kitne ${cfg.unitName}?`}
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => stepUnits(-1)}
                    aria-label="Kam karein"
                    className="min-h-[44px] min-w-[44px] rounded-xl border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="min-w-[56px] text-center font-mono-num font-bold text-base text-[#111827]">
                    {vals.units}
                  </span>
                  <button
                    type="button"
                    onClick={() => stepUnits(1)}
                    aria-label="Badhayein"
                    className="min-h-[44px] min-w-[44px] rounded-xl border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <input
                id="units-slider"
                type="range"
                min={cfg.minUnits}
                max={cfg.maxUnits}
                value={vals.units}
                onChange={(e) =>
                  updateEstimatorValues(activeIdea.id, {
                    units: Number(e.target.value),
                  })
                }
                className="w-full accent-[#0F766E] cursor-pointer h-2"
              />
            </div>

            {/* Control 2: Price per Unit */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="price-slider"
                  className="text-sm font-semibold text-[#111827]"
                >
                  {isMonthly
                    ? 'Ek client / order ki keemat (₹)?'
                    : 'Ek order ki keemat (₹)?'}
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => stepPrice(-cfg.priceStep)}
                    aria-label="Keemat kam karein"
                    className="min-h-[44px] min-w-[44px] rounded-xl border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="min-w-[72px] text-center font-mono-num font-bold text-base text-[#111827]">
                    {formatINR(vals.price)}
                  </span>
                  <button
                    type="button"
                    onClick={() => stepPrice(cfg.priceStep)}
                    aria-label="Keemat badhayein"
                    className="min-h-[44px] min-w-[44px] rounded-xl border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <input
                id="price-slider"
                type="range"
                min={cfg.minPrice}
                max={cfg.maxPrice}
                step={cfg.priceStep}
                value={vals.price}
                onChange={(e) =>
                  updateEstimatorValues(activeIdea.id, {
                    price: Number(e.target.value),
                  })
                }
                className="w-full accent-[#0F766E] cursor-pointer h-2"
              />
            </div>

            {/* Control 3: Cost % */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-3">
                <label
                  htmlFor="cost-slider"
                  className="text-sm font-semibold text-[#111827]"
                >
                  Maheene ka kharch / raw material (%)
                </label>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => stepCostPct(-5)}
                    aria-label="Kharch kam karein"
                    className="min-h-[44px] min-w-[44px] rounded-xl border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="min-w-[56px] text-center font-mono-num font-bold text-base text-[#111827]">
                    {vals.costPct}%
                  </span>
                  <button
                    type="button"
                    onClick={() => stepCostPct(5)}
                    aria-label="Kharch badhayein"
                    className="min-h-[44px] min-w-[44px] rounded-xl border border-gray-300 bg-white hover:bg-gray-50 flex items-center justify-center cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <input
                id="cost-slider"
                type="range"
                min={5}
                max={85}
                step={5}
                value={vals.costPct}
                onChange={(e) =>
                  updateEstimatorValues(activeIdea.id, {
                    costPct: Number(e.target.value),
                  })
                }
                className="w-full accent-[#EA580C] cursor-pointer h-2"
              />
            </div>

            {/* Working Days selector for daily businesses */}
            {!isMonthly && (
              <div className="pt-2 border-t border-gray-100 flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs sm:text-sm font-semibold text-[#4B5563]">
                  Mahine mein kitne din kaam?
                </span>
                <div className="flex items-center gap-1.5 p-1 bg-[#F3F4F6] rounded-xl">
                  {[22, 26, 30].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() =>
                        updateEstimatorValues(activeIdea.id, { workingDays: d })
                      }
                      className={`min-h-[38px] px-3 rounded-lg text-xs font-semibold tabular-nums cursor-pointer transition-colors ${
                        vals.workingDays === d
                          ? 'bg-white text-[#111827] shadow-sm'
                          : 'text-[#4B5563] hover:text-[#111827]'
                      }`}
                    >
                      {d} din
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Live Output Card */}
          <div className="rounded-2xl bg-[#0F766E] text-white p-5 sm:p-6 shadow-md">
            <div className="grid grid-cols-2 gap-4 pb-4 border-b border-white/20">
              <div>
                <div className="text-xs text-teal-100">Monthly Bikri (Sales)</div>
                <div className="text-lg sm:text-xl font-bold font-mono-num mt-0.5">
                  {formatINR(monthlySales)}
                </div>
              </div>
              <div>
                <div className="text-xs text-teal-100">
                  Monthly Samaan Kharch ({vals.costPct}%)
                </div>
                <div className="text-lg sm:text-xl font-bold font-mono-num mt-0.5 text-orange-200">
                  - {formatINR(monthlyExpense)}
                </div>
              </div>
            </div>

            <div className="pt-4">
              <div className="text-xs font-semibold text-teal-100">
                Aapki Shuddh Kamai (Net Profit)
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold font-mono-num mt-1">
                {formatINR(monthlyNetProfit)}
                <span className="text-sm sm:text-base font-medium text-teal-100 ml-1.5">
                  / month
                </span>
              </div>

              <p className="text-xs sm:text-sm text-teal-50 mt-3 bg-white/10 rounded-xl p-3">
                {breakEvenDays !== null
                  ? `Break-even: Lagbhag ${breakEvenDays} din mein aapka lagaya paisa (${formatINR(
                      totalStartupCost
                    )}) wapas aa jayega.`
                  : 'Profit badhane ke liye price badhayein ya kharch % kam karein.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
