import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Check, Calculator, User, Globe } from 'lucide-react';
import { AppLanguage, ActiveScreen } from '../types';
import { translations } from '../config/mfsData';

interface HeaderProps {
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  setLanguage,
  activeScreen,
  setActiveScreen
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = translations[language];

  // Close menu on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [menuOpen]);

  const handleNav = (screen: ActiveScreen) => {
    setActiveScreen(screen);
    setMenuOpen(false);
  };

  return (
    <header className="relative w-full border-b border-slate-800/80 bg-slate-900/95 backdrop-blur-md px-3 py-1.5 sm:px-5 sm:py-2.5 z-30">
      <div className="max-w-md mx-auto flex items-center justify-between gap-2">
        {/* Title & Subtitle */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <h1 className="text-sm sm:text-base font-bold text-slate-100 tracking-tight truncate">
              {t.title}
            </h1>
          </div>
          <p className="text-[10px] sm:text-xs text-slate-400 font-medium tracking-normal truncate">
            {t.subtitle}
          </p>
        </div>

        {/* Corner Menu Button */}
        <div className="relative flex-shrink-0" ref={menuRef}>
          <button
            id="corner-menu-button"
            type="button"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Application Menu"
            aria-expanded={menuOpen}
            className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg bg-slate-800/90 hover:bg-slate-700/80 active:scale-95 text-slate-200 border border-slate-700/70 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
          >
            {menuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>

          {/* Corner Dropdown Menu */}
          {menuOpen && (
            <div
              id="corner-dropdown-menu"
              className="absolute right-0 top-11 w-64 rounded-xl bg-slate-800/95 border border-slate-700 shadow-2xl py-1.5 backdrop-blur-xl z-50 text-sm animate-in fade-in zoom-in-95 duration-100"
            >
              {/* Item 1: Cashout Charge */}
              <button
                type="button"
                onClick={() => handleNav('calculator')}
                className={`w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 transition-colors ${
                  activeScreen === 'calculator'
                    ? 'bg-emerald-500/15 text-emerald-400 font-semibold'
                    : 'text-slate-200 hover:bg-slate-700/60'
                }`}
              >
                <Calculator size={16} className="text-emerald-400" />
                <span>{t.menuCashoutCharge}</span>
                {activeScreen === 'calculator' && (
                  <Check size={14} className="ml-auto text-emerald-400" />
                )}
              </button>

              {/* Item 2: About Developer */}
              <button
                type="button"
                onClick={() => handleNav('about')}
                className={`w-full text-left px-3.5 py-2.5 flex items-center gap-2.5 transition-colors ${
                  activeScreen === 'about'
                    ? 'bg-emerald-500/15 text-emerald-400 font-semibold'
                    : 'text-slate-200 hover:bg-slate-700/60'
                }`}
              >
                <User size={16} className="text-sky-400" />
                <span>{t.menuAboutDeveloper}</span>
                {activeScreen === 'about' && (
                  <Check size={14} className="ml-auto text-sky-400" />
                )}
              </button>

              <div className="h-px bg-slate-700/80 my-1 mx-2" />

              {/* Item 3: Language / ভাষা */}
              <div className="px-3.5 py-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  <Globe size={13} />
                  <span>{t.menuLanguage}</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('en');
                      setMenuOpen(false);
                    }}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-lg text-center transition-all flex items-center justify-center gap-1.5 border ${
                      language === 'en'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-slate-900/60 text-slate-300 border-slate-700/80 hover:bg-slate-700/70'
                    }`}
                  >
                    <span>English</span>
                    {language === 'en' && <Check size={12} />}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setLanguage('bn');
                      setMenuOpen(false);
                    }}
                    className={`px-2.5 py-1.5 text-xs font-medium rounded-lg text-center transition-all flex items-center justify-center gap-1.5 border ${
                      language === 'bn'
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-slate-900/60 text-slate-300 border-slate-700/80 hover:bg-slate-700/70'
                    }`}
                  >
                    <span>বাংলা</span>
                    {language === 'bn' && <Check size={12} />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
