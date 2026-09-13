import React, { useState } from 'react';
import { History, Trash2, ArrowUpRight, AlertTriangle, Copy, Check, X } from 'lucide-react';
import { HistoryItem, AppLanguage, MFSKey } from '../types';
import { translations, formatBDT, mfsRates } from '../config/mfsData';

interface HistorySectionProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onDeleteHistoryItem?: (id: string) => void;
  onSelectHistoryItem: (item: HistoryItem) => void;
  language: AppLanguage;
}

export const HistorySection: React.FC<HistorySectionProps> = ({
  history,
  onClearHistory,
  onDeleteHistoryItem,
  onSelectHistoryItem,
  language
}) => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const t = translations[language];

  const handleConfirmClear = () => {
    onClearHistory();
    setShowConfirmModal(false);
  };

  const handleCopyHistoryTotal = async (e: React.MouseEvent, item: HistoryItem) => {
    e.stopPropagation();
    const formatted = formatBDT(item.total);
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(formatted);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = formatted;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 1500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleDeleteItem = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (onDeleteHistoryItem) {
      onDeleteHistoryItem(id);
    }
  };

  return (
    <section
      id="calculation-history-section"
      aria-label="Calculation History"
      className="w-full mt-4 pt-3 border-t border-slate-800/80"
    >
      {/* Header with Title and Clear Button */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5 text-slate-300 font-semibold text-xs sm:text-sm">
          <History size={15} className="text-emerald-400" />
          <span>{t.calculationHistory}</span>
          {history.length > 0 && (
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-400 font-mono">
              {history.length}
            </span>
          )}
        </div>

        {history.length > 0 && (
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="text-[11px] font-medium text-rose-400 hover:text-rose-300 flex items-center gap-1 py-1 px-2 rounded-lg hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 size={12} />
            <span>{t.clearHistory}</span>
          </button>
        )}
      </div>

      {/* History Items List */}
      {history.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-800 p-4 text-center text-xs text-slate-500">
          {t.noHistory}
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((item) => {
            const mfs = mfsRates[item.mfsKey as MFSKey] || mfsRates.bkash;
            const displayName = language === 'bn' ? mfs.bnName : mfs.name;
            const isCopied = copiedId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => onSelectHistoryItem(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectHistoryItem(item);
                  }
                }}
                className="group relative rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700/80 p-3 transition-all cursor-pointer shadow-sm text-xs"
              >
                {/* Row 1: MFS Name & Date & Action Buttons */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md font-semibold text-[11px] border ${mfs.badgeBg} ${mfs.badgeText} ${mfs.borderAccent}`}
                    >
                      {displayName}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {item.formattedDate}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    {/* Copy Total button */}
                    <button
                      type="button"
                      onClick={(e) => handleCopyHistoryTotal(e, item)}
                      title={isCopied ? t.copied : t.copyTotal}
                      className="p-1 rounded-md text-slate-400 hover:text-emerald-400 hover:bg-slate-800 transition-colors"
                    >
                      {isCopied ? (
                        <Check size={13} className="text-emerald-400 stroke-[2.5]" />
                      ) : (
                        <Copy size={13} />
                      )}
                    </button>

                    {/* Delete single item button */}
                    {onDeleteHistoryItem && (
                      <button
                        type="button"
                        onClick={(e) => handleDeleteItem(e, item.id)}
                        title="Delete item"
                        className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                      >
                        <X size={13} />
                      </button>
                    )}

                    {/* Load into calculator indicator */}
                    <span className="p-1 text-slate-500 group-hover:text-emerald-400 transition-colors" title={t.loadToCalc}>
                      <ArrowUpRight size={13} />
                    </span>
                  </div>
                </div>

                {/* Row 2: Comprehensive Details Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                  <div>
                    <span className="text-slate-400 block text-[10px]">{t.yourAmount}</span>
                    <span className="font-semibold text-slate-200">
                      {formatBDT(item.amount)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">{t.cashoutCharge}</span>
                    <span className="font-medium text-slate-300">
                      {formatBDT(item.baseCharge)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">{t.sendMoneyFee}</span>
                    <span className="font-medium text-amber-400/90">
                      {item.sendMoneyFee > 0 ? `-${formatBDT(item.sendMoneyFee)}` : '৳0.00'}
                    </span>
                  </div>
                  <div className="text-left sm:text-right">
                    <span className="text-emerald-400/90 block text-[10px] font-semibold">{t.totalCustomerPays}</span>
                    <span className="font-bold text-emerald-400 text-xs">
                      {formatBDT(item.total)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Clear Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-xs rounded-2xl bg-slate-900 border border-slate-700 p-4 shadow-2xl space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-semibold text-sm">
              <AlertTriangle size={18} />
              <span>{t.clearHistory}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {t.confirmClearHistory}
            </p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-all"
              >
                {t.cancel}
              </button>
              <button
                type="button"
                id="confirm-clear-history-button"
                onClick={handleConfirmClear}
                className="py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition-all shadow-sm shadow-rose-600/30"
              >
                {t.yesClear}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

