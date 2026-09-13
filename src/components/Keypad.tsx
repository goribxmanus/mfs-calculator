import React from 'react';
import { Delete, RotateCcw, BookmarkPlus, Check, Keyboard, Smartphone } from 'lucide-react';
import { AppLanguage } from '../types';
import { translations } from '../config/mfsData';

interface KeypadProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onReset: () => void;
  onSave: () => void;
  isSaved?: boolean;
  showKeypad?: boolean;
  onToggleKeypad?: () => void;
  language: AppLanguage;
}

export const Keypad: React.FC<KeypadProps> = ({
  onKeyPress,
  onBackspace,
  onReset,
  onSave,
  isSaved = false,
  showKeypad = true,
  onToggleKeypad,
  language
}) => {
  const t = translations[language];

  const keys = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['00', '0', 'backspace']
  ];

  return (
    <div className="w-full space-y-1.5 pt-0.5">
      {/* Keyboard / Keypad Toggle Pill */}
      {onToggleKeypad && (
        <div className="flex items-center justify-between px-0.5 text-[11px] text-slate-400">
          <span className="font-medium">
            {showKeypad ? t.posKeypad : t.phoneKeyboard}
          </span>
          <button
            type="button"
            onClick={onToggleKeypad}
            className="flex items-center gap-1 text-[10px] font-medium text-emerald-400 hover:text-emerald-300 py-0.5 px-2 rounded-md bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 transition-colors"
          >
            {showKeypad ? (
              <>
                <Smartphone size={11} />
                <span>{t.phoneKeyboard}</span>
              </>
            ) : (
              <>
                <Keyboard size={11} />
                <span>{t.posKeypad}</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Compact 4x3 Grid (Displayed only when showKeypad is true) */}
      {showKeypad && (
        <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
          {keys.map((row) =>
            row.map((k) => {
              if (k === 'backspace') {
                return (
                  <button
                    key={`key-${k}`}
                    type="button"
                    id="keypad-backspace"
                    onClick={onBackspace}
                    aria-label="Backspace"
                    className="h-8 sm:h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 active:bg-slate-600 active:scale-95 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700/70 shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                  >
                    <Delete size={16} />
                  </button>
                );
              }

              return (
                <button
                  key={`key-${k}`}
                  type="button"
                  id={`keypad-digit-${k}`}
                  onClick={() => onKeyPress(k)}
                  className="h-8 sm:h-9 rounded-xl bg-slate-800 hover:bg-slate-700/90 active:bg-slate-600 active:scale-95 text-slate-100 font-bold text-sm sm:text-base flex items-center justify-center border border-slate-700/70 shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                >
                  {k}
                </button>
              );
            })
          )}
        </div>
      )}

      {/* Reset and Save buttons side-by-side */}
      <div className="grid grid-cols-2 gap-1.5 sm:gap-2 pt-0.5">
        {/* Reset button */}
        <button
          id="reset-calculator-button"
          type="button"
          onClick={onReset}
          className="h-8 sm:h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 active:scale-95 text-slate-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 border border-slate-700/70 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/40"
        >
          <RotateCcw size={13} />
          <span>{t.reset}</span>
        </button>

        {/* Save button */}
        <button
          id="save-calculation-button"
          type="button"
          onClick={onSave}
          className={`h-8 sm:h-9 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 border transition-all active:scale-95 shadow-sm focus:outline-none focus:ring-2 ${
            isSaved
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/30 ring-2 ring-emerald-400'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500/80 shadow-emerald-700/20 hover:shadow-emerald-600/30 focus:ring-emerald-400/50'
          }`}
        >
          {isSaved ? (
            <>
              <Check size={14} className="stroke-[2.5]" />
              <span>{t.saved}</span>
            </>
          ) : (
            <>
              <BookmarkPlus size={14} />
              <span>{t.save}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};


