import React from 'react';
import { ArrowLeft, Calculator, Code2, Sparkles } from 'lucide-react';
import { AppLanguage } from '../types';
import { translations } from '../config/mfsData';

interface AboutDeveloperProps {
  onBack: () => void;
  language: AppLanguage;
}

export const AboutDeveloper: React.FC<AboutDeveloperProps> = ({
  onBack,
  language
}) => {
  const t = translations[language];

  return (
    <div
      id="about-developer-screen"
      className="w-full max-w-md mx-auto min-h-[70vh] flex flex-col justify-between py-8 px-4 sm:px-6 animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Top Back Action */}
      <div className="w-full flex justify-start">
        <button
          type="button"
          onClick={onBack}
          id="back-to-calculator-button"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700/90 active:scale-95 text-slate-200 hover:text-white text-xs sm:text-sm font-semibold border border-slate-700/80 transition-all shadow-sm"
        >
          <ArrowLeft size={16} className="text-emerald-400" />
          <span>{t.menuCashoutCharge}</span>
        </button>
      </div>

      {/* Main Developer Announcement with generous whitespace and elegant typography */}
      <div className="my-auto text-center space-y-5 py-12">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-2 shadow-inner">
          <Code2 size={28} />
        </div>

        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700/60 uppercase tracking-widest">
            <Sparkles size={11} className="text-emerald-400" />
            <span>MFS POS System</span>
          </span>

          {/* Core requirement: Developed by Musabber Himel in large centered text */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
            Developed by <span className="text-emerald-400">Musabber Himel</span>
          </h2>

          <p className="text-xs sm:text-sm text-slate-400 max-w-xs mx-auto leading-relaxed pt-1">
            {t.tagline}
          </p>
        </div>

        {/* Primary Return Button */}
        <div className="pt-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-sm font-bold shadow-lg shadow-emerald-600/30 transition-all"
          >
            <Calculator size={17} />
            <span>{t.returnToCalc}</span>
          </button>
        </div>
      </div>

      {/* Bottom Footer Note */}
      <div className="text-center text-[11px] text-slate-500 pt-8 border-t border-slate-800/80">
        MFS Personal Account Business Charging System
      </div>
    </div>
  );
};
