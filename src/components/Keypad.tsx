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
    <div className="w-full space-y-2 pt-1">
      {/* Keyboard / Keypad Toggle Pill */}
      {onToggleKeypad && (
        <div className="flex items-center justify-between px-1 text-xs text-slate-400">
          <span className="font-semibold text-slate-300">
            {showKeypad ? t.posKeypad : t.phoneKeyboard}
          </span>
          <button
            type="button"
            onClick={onToggleKeypad}
            className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 py-1 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            {showKeypad ? (
              <>
                <Smartphone size={14} />
                <span>{t.phoneKeyboard}</span>
              </>
            ) : (
              <>
                <Keyboard size={14} />
                <span>{t.posKeypad}</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* Compact 4x3 Grid (Displayed only when showKeypad is true) */}
      {showKeypad && (
        <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
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
                    className="h-11 sm:h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 active:scale-95 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700/80 shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                  >
                    <Delete size={20} />
                  </button>
                );
              }

              return (
                <button
                  key={`key-${k}`}
                  type="button"
                  id={`keypad-digit-${k}`}
                  onClick={() => onKeyPress(k)}
                  className="h-11 sm:h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 active:scale-95 text-slate-100 font-bold text-lg sm:text-xl flex items-center justify-center border border-slate-700/80 shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-emerald-500/40"
                >
                  {k}
                </button>
              );
            })
          )}
        </div>
      )}

      {/* Reset and Save buttons side-by-side */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        {/* Reset button */}
        <button
          id="reset-calculator-button"
          type="button"
          onClick={onReset}
          className="h-11 sm:h-12 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-slate-200 hover:text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border border-slate-700 transition-all focus:outline-none focus:ring-2 focus:ring-rose-500/40 shadow-sm"
        >
          <RotateCcw size={16} />
          <span>{t.reset}</span>
        </button>

        {/* Save button */}
        <button
          id="save-calculation-button"
          type="button"
          onClick={onSave}
          className={`h-11 sm:h-12 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border transition-all active:scale-95 shadow-md focus:outline-none focus:ring-2 ${
            isSaved
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/30 ring-2 ring-emerald-400'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500/80 shadow-emerald-700/20 hover:shadow-emerald-600/30 focus:ring-emerald-400/50'
          }`}
        >
          {isSaved ? (
            <>
              <Check size={16} className="stroke-[2.5]" />
              <span>{t.saved}</span>
            </>
          ) : (
            <>
              <BookmarkPlus size={16} />
              <span>{t.save}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};


