import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { CalculationResult, AppLanguage } from '../types';
import { translations, formatBDT } from '../config/mfsData';

interface ResultCardProps {
  calculation: CalculationResult;
  language: AppLanguage;
  onCopySuccess?: () => void;
}

export const ResultCard: React.FC<ResultCardProps> = ({
  calculation,
  language,
  onCopySuccess
}) => {
  const [copied, setCopied] = useState(false);
  const t = translations[language];

  const handleCopyTotal = async () => {
    const formattedTotal = formatBDT(calculation.total);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(formattedTotal);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = formattedTotal;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopied(true);
      if (onCopySuccess) {
        onCopySuccess();
      }
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  const mfsDisplayName = language === 'bn' ? calculation.mfs.bnName : calculation.mfs.name;

  return (
    <section
      id="result-card"
      aria-label="Calculation Result"
      className="relative w-full rounded-2xl bg-gradient-to-b from-slate-800/95 to-slate-900 border border-slate-700/80 shadow-md p-2.5 sm:p-3 transition-all"
    >
      {/* Top micro-line: MFS badge & Cashout Charge */}
      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-slate-700/50 text-[11px] sm:text-xs">
        <div className="flex items-center gap-1.5 min-w-0">
          <span
            className={`inline-flex items-center px-1.5 py-0.5 rounded-md font-semibold text-[10px] sm:text-[11px] border ${calculation.mfs.badgeBg} ${calculation.mfs.badgeText} ${calculation.mfs.borderAccent}`}
          >
            {mfsDisplayName}
          </span>
          <span className="text-slate-300 text-[11px] truncate">
            {t.cashoutCharge}: <strong className="text-slate-100 font-bold">{formatBDT(calculation.baseCharge)}</strong>
          </span>
        </div>
        {calculation.sendMoneyFee > 0 && (
          <span className="text-[10px] text-amber-400 font-medium whitespace-nowrap">
            (Fee: -{formatBDT(calculation.sendMoneyFee)})
          </span>
        )}
      </div>

      {/* Main hero line: TOTAL CUSTOMER PAYS (Large & Eye-Catching) + Copy button */}
      <div className="pt-1.5 flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <span className="block text-[10px] font-bold text-emerald-400 uppercase tracking-wider leading-none">
            {t.totalCustomerPays}
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight mt-0.5 truncate">
            {formatBDT(calculation.total)}
          </div>
        </div>

        {/* Copy Total Button */}
        <button
          id="copy-total-button"
          type="button"
          onClick={handleCopyTotal}
          className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all active:scale-95 shadow-sm ${
            copied
              ? 'bg-emerald-500 text-white shadow-emerald-500/20'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
          }`}
          aria-label={copied ? t.copied : t.copyTotal}
        >
          {copied ? (
            <>
              <Check size={14} className="stroke-[2.5]" />
              <span>{t.copied}</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>{t.copyTotal}</span>
            </>
          )}
        </button>
      </div>
    </section>
  );
};

