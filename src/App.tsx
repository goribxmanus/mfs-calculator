import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { ResultCard } from './components/ResultCard';
import { InputControls } from './components/InputControls';
import { Keypad } from './components/Keypad';
import { HistorySection } from './components/HistorySection';
import { AboutDeveloper } from './components/AboutDeveloper';
import { MFSKey, AppLanguage, ActiveScreen, HistoryItem } from './types';
import { calculateMFS, mfsRates } from './config/mfsData';

// Local storage keys
const STORAGE_KEY_LANG = 'mfs_calc_lang';
const STORAGE_KEY_MFS = 'mfs_calc_mfs';
const STORAGE_KEY_HISTORY = 'mfs_calc_history';
const STORAGE_KEY_AMOUNT = 'mfs_calc_amount';

export default function App() {
  // 1. Language state (defaults to English or saved)
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LANG);
      if (saved === 'en' || saved === 'bn') return saved;
    } catch (e) {
      console.warn('localStorage error', e);
    }
    return 'en';
  });

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY_LANG, lang);
    } catch (e) {
      console.warn('localStorage save error', e);
    }
  };

  // 2. Navigation state: 'calculator' | 'about'
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('calculator');

  // 3. Selected MFS state (defaults to 'bkash' or saved)
  const [selectedMfs, setSelectedMfsState] = useState<MFSKey>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MFS) as MFSKey;
      if (saved && mfsRates[saved]) return saved;
    } catch (e) {
      console.warn('localStorage error', e);
    }
    return 'bkash';
  });

  const setSelectedMfs = (mfs: MFSKey) => {
    setSelectedMfsState(mfs);
    try {
      localStorage.setItem(STORAGE_KEY_MFS, mfs);
    } catch (e) {
      console.warn('localStorage save error', e);
    }
  };

  // 4. Amount state (defaults to '1000' or saved)
  const [rawAmount, setRawAmountState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AMOUNT);
      if (saved && !isNaN(Number(saved)) && Number(saved) >= 0) return saved;
    } catch (e) {
      console.warn('localStorage error', e);
    }
    return '1000';
  });

  const setRawAmount = (amt: string) => {
    setRawAmountState(amt);
    try {
      localStorage.setItem(STORAGE_KEY_AMOUNT, amt);
    } catch (e) {
      console.warn('localStorage save error', e);
    }
  };

  // 5. Calculation History (persisted in localStorage)
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HISTORY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse history from localStorage', e);
    }
    return [];
  });

  const [isSaved, setIsSaved] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Keypad Mode preference: on-screen POS Keypad or Native Phone Keyboard
  const [showKeypad, setShowKeypad] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('mfs_show_keypad');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const handleToggleKeypad = () => {
    setShowKeypad((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('mfs_show_keypad', JSON.stringify(next));
      } catch (e) {
        console.warn('Failed to save keypad preference', e);
      }
      return next;
    });
  };

  const saveHistoryList = (newList: HistoryItem[]) => {
    setHistory(newList);
    try {
      localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(newList));
    } catch (e) {
      console.warn('Failed to persist history', e);
    }
  };

  // 6. Current Calculation (instant, memoized)
  const numericAmount = useMemo(() => {
    const val = parseFloat(rawAmount);
    return isNaN(val) || val < 0 ? 0 : val;
  }, [rawAmount]);

  const calculation = useMemo(() => {
    return calculateMFS(numericAmount, selectedMfs);
  }, [numericAmount, selectedMfs]);

  // Record item to calculation history
  const recordToHistory = useCallback(() => {
    if (numericAmount <= 0) return;

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const newItem: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      mfsKey: selectedMfs,
      mfsName: mfsRates[selectedMfs].name,
      amount: calculation.amount,
      baseCharge: calculation.baseCharge,
      sendMoneyFee: calculation.sendMoneyFee,
      netCharge: calculation.netCharge,
      total: calculation.total,
      timestamp: Date.now(),
      formattedDate
    };

    setHistory((prev) => {
      // Avoid duplicate entry if immediately identical to the top entry
      if (
        prev.length > 0 &&
        prev[0].mfsKey === newItem.mfsKey &&
        Math.abs(prev[0].amount - newItem.amount) < 0.01
      ) {
        return prev;
      }
      const updated = [newItem, ...prev.slice(0, 49)];
      try {
        localStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Storage save failed', e);
      }
      return updated;
    });
  }, [numericAmount, selectedMfs, calculation]);

  // Explicit Save button action
  const handleExplicitSave = () => {
    if (numericAmount <= 0) {
      setToastMessage(
        language === 'bn'
          ? 'সংরক্ষণ করতে প্রথমে পরিমাণ লিখুন'
          : 'Please enter an amount to save'
      );
      setTimeout(() => setToastMessage(null), 2500);
      return;
    }

    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    const newItem: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      mfsKey: selectedMfs,
      mfsName: mfsRates[selectedMfs].name,
      amount: calculation.amount,
      baseCharge: calculation.baseCharge,
      sendMoneyFee: calculation.sendMoneyFee,
      netCharge: calculation.netCharge,
      total: calculation.total,
      timestamp: Date.now(),
      formattedDate
    };

    const updated = [newItem, ...history.slice(0, 49)];
    saveHistoryList(updated);

    setIsSaved(true);
    setToastMessage(
      language === 'bn'
        ? 'হিসাবটি সফলভাবে ইতিহাসে সংরক্ষিত হয়েছে ✓'
        : 'Calculation saved to history ✓'
    );
    setTimeout(() => setIsSaved(false), 2000);
    setTimeout(() => setToastMessage(null), 2500);
  };

  // Clear all history
  const handleClearHistory = () => {
    saveHistoryList([]);
  };

  // Delete single history item
  const handleDeleteHistoryItem = (id: string) => {
    const updated = history.filter((item) => item.id !== id);
    saveHistoryList(updated);
  };

  // Select history item to load into calculator
  const handleSelectHistoryItem = (item: HistoryItem) => {
    setSelectedMfs(item.mfsKey);
    setRawAmount(String(item.amount));
    // Scroll smoothly to top if needed
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Keypad inputs
  const handleKeypadPress = (key: string) => {
    if (key === '00') {
      if (!rawAmount || rawAmount === '0') {
        setRawAmount('0');
        return;
      }
      if (rawAmount.length > 7) return;
      setRawAmount(rawAmount + '00');
      return;
    }

    if (key === '0') {
      if (!rawAmount || rawAmount === '0') {
        setRawAmount('0');
        return;
      }
      if (rawAmount.length > 7) return;
      setRawAmount(rawAmount + '0');
      return;
    }

    // Numbers 1-9
    if (rawAmount === '0' || !rawAmount) {
      setRawAmount(key);
    } else {
      if (rawAmount.length > 7) return;
      setRawAmount(rawAmount + key);
    }
  };

  const handleBackspace = () => {
    if (!rawAmount || rawAmount.length <= 1) {
      setRawAmount('');
    } else {
      setRawAmount(rawAmount.slice(0, -1));
    }
  };

  // Reset according to Section 17:
  // - Clear amount
  // - Reset calculation & result
  // - Reset keypad state
  // - Return to default MFS (bKash)
  // - Preserve calculation history
  const handleReset = () => {
    setRawAmount('');
    setSelectedMfs('bkash');
  };

  // Quick adds: +500, +1000, +2000, +5000
  const handleQuickAdd = (value: number) => {
    const current = parseFloat(rawAmount) || 0;
    const nextVal = Math.round(current + value);
    setRawAmount(String(nextVal));
  };

  const handleClearAmount = () => {
    setRawAmount('');
  };

  // Physical keyboard support
  useEffect(() => {
    const handlePhysicalKeyDown = (e: KeyboardEvent) => {
      // If user is focused on an input element, let natural typing happen
      if (
        document.activeElement &&
        (document.activeElement.tagName === 'INPUT' ||
          document.activeElement.tagName === 'TEXTAREA' ||
          document.activeElement.tagName === 'SELECT')
      ) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        handleKeypadPress(e.key);
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        handleBackspace();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        handleReset();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        recordToHistory();
      }
    };

    window.addEventListener('keydown', handlePhysicalKeyDown);
    return () => window.removeEventListener('keydown', handlePhysicalKeyDown);
  });

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 flex flex-col items-center selection:bg-emerald-500 selection:text-white pb-10">
      {/* 1. Header with Compact Corner Menu (Requirement 9, 10, 11) */}
      <Header
        language={language}
        setLanguage={setLanguage}
        activeScreen={activeScreen}
        setActiveScreen={setActiveScreen}
      />

      {/* Main Container: Mobile-first, max-w-md, centered, zero-scroll on mobile */}
      <main className="w-full max-w-md px-2 sm:px-4 pt-1 sm:pt-2 pb-3 flex-1 flex flex-col">
        {activeScreen === 'about' ? (
          /* Developer Screen (Requirement 20) */
          <AboutDeveloper
            onBack={() => setActiveScreen('calculator')}
            language={language}
          />
        ) : (
          /* Calculator Screen: Result at the top! Zero-scroll mobile layout */
          <div className="w-full space-y-1.5 sm:space-y-2">
            {/* RESULT CARD (Top Priority, prominent Total Customer Pays & Cashout Charge) */}
            <ResultCard
              calculation={calculation}
              language={language}
              onCopySuccess={recordToHistory}
            />

            {/* MFS Selector, Amount Input & Quick Add Buttons & Compact Keypad */}
            <div className="rounded-2xl bg-slate-900/90 border border-slate-800/80 p-2 sm:p-2.5 shadow-sm space-y-1.5 sm:space-y-2">
              <InputControls
                selectedMfs={selectedMfs}
                onSelectMfs={setSelectedMfs}
                rawAmount={rawAmount}
                onAmountChange={setRawAmount}
                onQuickAdd={handleQuickAdd}
                onClearAmount={handleClearAmount}
                language={language}
              />

              {/* Compact Numeric Keypad, Reset, Save & Toggle */}
              <Keypad
                onKeyPress={handleKeypadPress}
                onBackspace={handleBackspace}
                onReset={handleReset}
                onSave={handleExplicitSave}
                isSaved={isSaved}
                showKeypad={showKeypad}
                onToggleKeypad={handleToggleKeypad}
                language={language}
              />
            </div>

            {/* Calculation History (Scrollable below without pushing calculator) */}
            <HistorySection
              history={history}
              onClearHistory={handleClearHistory}
              onDeleteHistoryItem={handleDeleteHistoryItem}
              onSelectHistoryItem={handleSelectHistoryItem}
              language={language}
            />
          </div>
        )}

        {/* Toast feedback banner */}
        {toastMessage && (
          <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-xl bg-slate-800 text-emerald-400 border border-emerald-500/40 shadow-2xl text-xs sm:text-sm font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>{toastMessage}</span>
          </div>
        )}
      </main>
    </div>
  );
}
