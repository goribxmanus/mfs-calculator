import React, { useRef } from 'react';
import { ChevronDown, XCircle } from 'lucide-react';
import { MFSKey, AppLanguage } from '../types';
import { mfsRates, translations } from '../config/mfsData';

interface InputControlsProps {
  selectedMfs: MFSKey;
  onSelectMfs: (mfs: MFSKey) => void;
  rawAmount: string;
  onAmountChange: (newAmount: string) => void;
  onQuickAdd: (addValue: number) => void;
  onClearAmount: () => void;
  language: AppLanguage;
}

export const InputControls: React.FC<InputControlsProps> = ({
  selectedMfs,
  onSelectMfs,
  rawAmount,
  onAmountChange,
  onQuickAdd,
  onClearAmount,
  language
}) => {
  const t = translations[language];
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Sanitize input: allow only digits and at most one dot
    let value = e.target.value.replace(/[^0-9.]/g, '');
    const parts = value.split('.');
    if (parts.length > 2) {
      value = parts[0] + '.' + parts.slice(1).join('');
    }
    // Limit to 2 decimal places if dot present
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + '.' + parts[1].slice(0, 2);
    }
    // Prevent more than 7 digits before decimal (up to 9,999,999)
    if (parts[0].length > 7) {
      parts[0] = parts[0].slice(0, 7);
      value = parts.join('.');
    }
    onAmountChange(value);
  };

  const quickAdds = [
    { value: 500, label: '+500' },
    { value: 1000, label: '+1,000' },
    { value: 2000, label: '+2,000' },
    { value: 5000, label: '+5,000' }
  ];

  return (
    <div className="w-full space-y-1.5">
      {/* Side-by-Side: MFS Selector & Amount Input */}
      <div className="grid grid-cols-12 gap-1.5 sm:gap-2">
        {/* MFS Selector (5 cols) */}
        <div className="col-span-5">
          <label
            htmlFor="mfs-select"
            className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-0.5 truncate"
          >
            {t.selectMfs}
          </label>
          <div className="relative">
            <select
              id="mfs-select"
              value={selectedMfs}
              onChange={(e) => onSelectMfs(e.target.value as MFSKey)}
              className="w-full h-8 sm:h-9 appearance-none rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs font-semibold pl-2 pr-5 py-1 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 cursor-pointer shadow-sm truncate"
            >
              <option value="bkash">
                {language === 'bn' ? mfsRates.bkash.bnName : mfsRates.bkash.name} (৳{mfsRates.bkash.rate}/k)
              </option>
              <option value="nagad">
                {language === 'bn' ? mfsRates.nagad.bnName : mfsRates.nagad.name} (৳{mfsRates.nagad.rate}/k)
              </option>
              <option value="rocket">
                {language === 'bn' ? mfsRates.rocket.bnName : mfsRates.rocket.name} (৳{mfsRates.rocket.rate}/k)
              </option>
              <option value="upay">
                {language === 'bn' ? mfsRates.upay.bnName : mfsRates.upay.name} (৳{mfsRates.upay.rate}/k)
              </option>
            </select>
            <ChevronDown
              size={13}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
          </div>
        </div>

        {/* Amount Input (7 cols) */}
        <div className="col-span-7">
          <div className="flex items-center justify-between mb-0.5">
            <label
              htmlFor="amount-input"
              className="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider truncate"
            >
              {t.yourAmount}
            </label>
            {rawAmount && (
              <button
                type="button"
                onClick={onClearAmount}
                className="text-[10px] text-slate-400 hover:text-slate-200 flex items-center gap-0.5 transition-colors"
              >
                <XCircle size={10} />
                <span>{t.clear}</span>
              </button>
            )}
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-2 text-emerald-400 font-bold text-xs sm:text-sm pointer-events-none select-none">
              ৳
            </span>
            <input
              ref={inputRef}
              id="amount-input"
              type="text"
              inputMode="decimal"
              autoComplete="off"
              placeholder="0.00"
              value={rawAmount}
              onChange={handleInputChange}
              className="w-full h-8 sm:h-9 rounded-xl bg-slate-800 border border-slate-700 text-slate-100 text-xs sm:text-sm font-bold pl-5 pr-2 py-1 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all shadow-sm tracking-wide"
            />
          </div>
        </div>
      </div>

      {/* Quick Add Buttons & Clear */}
      <div className="grid grid-cols-5 gap-1 pt-0.5">
        {quickAdds.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onQuickAdd(item.value)}
            className="h-7 py-0.5 px-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 active:scale-95 text-slate-300 hover:text-white text-[11px] font-semibold border border-slate-700/80 transition-all text-center focus:outline-none focus:ring-1 focus:ring-emerald-500"
          >
            {item.label}
          </button>
        ))}
        <button
          type="button"
          onClick={onClearAmount}
          className="h-7 py-0.5 px-1 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 active:scale-95 text-rose-400 hover:text-rose-300 text-[11px] font-semibold border border-rose-500/30 transition-all text-center focus:outline-none"
        >
          {t.clear}
        </button>
      </div>
    </div>
  );
};

