import { MFSConfig, MFSKey, CalculationResult } from '../types';

export const mfsRates: Record<MFSKey, MFSConfig> = {
  bkash: {
    id: 'bkash',
    name: 'bKash',
    bnName: 'বিকাশ',
    rate: 18.5,
    sendMoneyFee: 5,
    accentColor: '#E2136E',
    badgeBg: 'bg-pink-500/10 dark:bg-pink-950/40',
    badgeText: 'text-pink-600 dark:text-pink-400',
    borderAccent: 'border-pink-500/30'
  },
  nagad: {
    id: 'nagad',
    name: 'Nagad',
    bnName: 'নগদ',
    rate: 13,
    sendMoneyFee: 5,
    accentColor: '#F7931E',
    badgeBg: 'bg-amber-500/10 dark:bg-amber-950/40',
    badgeText: 'text-amber-600 dark:text-amber-400',
    borderAccent: 'border-amber-500/30'
  },
  rocket: {
    id: 'rocket',
    name: 'Rocket',
    bnName: 'রকেট',
    rate: 16.70,
    sendMoneyFee: 0,
    accentColor: '#8C3494',
    badgeBg: 'bg-purple-500/10 dark:bg-purple-950/40',
    badgeText: 'text-purple-600 dark:text-purple-400',
    borderAccent: 'border-purple-500/30'
  },
  upay: {
    id: 'upay',
    name: 'Upay',
    bnName: 'উপায়',
    rate: 14,
    sendMoneyFee: 0,
    accentColor: '#0072BC',
    badgeBg: 'bg-sky-500/10 dark:bg-sky-950/40',
    badgeText: 'text-sky-600 dark:text-sky-400',
    borderAccent: 'border-sky-500/30'
  }
};

/**
 * Core calculation logic as specified:
 * baseCharge = amount * rate / 1000;
 * netCharge = baseCharge - sendMoneyFee;
 * netCharge = Math.max(0, netCharge);
 * total = amount + netCharge;
 */
export function calculateMFS(amount: number, mfsKey: MFSKey): CalculationResult {
  const mfs = mfsRates[mfsKey] || mfsRates.bkash;
  const validAmount = isNaN(amount) || amount < 0 ? 0 : amount;

  // Base cashout charge
  const baseCharge = (validAmount * mfs.rate) / 1000;

  // Deduct send money fee for bKash & Nagad; 0 for Rocket & Upay
  const netCharge = Math.max(0, baseCharge - mfs.sendMoneyFee);

  // Total customer pays
  const total = validAmount + netCharge;

  return {
    amount: validAmount,
    mfs,
    baseCharge,
    sendMoneyFee: mfs.sendMoneyFee,
    netCharge,
    total
  };
}

/**
 * Currency formatter using Bengali Taka symbol ৳ with two decimal places and commas
 */
export function formatBDT(num: number, withSymbol = true): string {
  if (isNaN(num) || num === null || num === undefined) {
    return withSymbol ? '৳0.00' : '0.00';
  }
  const formatted = num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return withSymbol ? `৳${formatted}` : formatted;
}

export const translations = {
  en: {
    title: 'MFS Business Charge Calculator',
    subtitle: 'Personal Account Business Charging System',
    menuCashoutCharge: 'Cashout Charge',
    menuAboutDeveloper: 'About Developer',
    menuLanguage: 'Language / ভাষা',
    english: 'English',
    bangla: 'বাংলা',
    yourAmount: 'Your Amount',
    mfs: 'MFS',
    selectMfs: 'Select MFS',
    cashoutCharge: 'Cashout Charge',
    sendMoneyFee: 'Send Money Fee',
    totalCustomerPays: 'Total Customer Pays',
    copyTotal: 'Copy Total',
    copied: 'Copied ✓',
    reset: 'Reset',
    save: 'Save',
    saved: 'Saved ✓',
    clear: 'Clear',
    quickAdd: 'Quick Add',
    calculationHistory: 'Calculation History',
    clearHistory: 'Clear History',
    noHistory: 'No calculations saved yet',
    confirmClearHistory: 'Are you sure you want to clear all calculation history?',
    yesClear: 'Yes, Clear',
    cancel: 'Cancel',
    chargeRate: 'Rate: ৳{rate}/1,000',
    aboutTitle: 'About Developer',
    developedBy: 'Developed by Musabber Himel',
    returnToCalc: '← Cashout Charge',
    tagline: 'Simple, fast, and precise MFS cashout charge deduction for Bangladeshi merchants.',
    loadToCalc: 'Load into calculator',
    savedToHistory: 'Saved to history',
    enterAmountFirst: 'Please enter an amount to save',
    posKeypad: 'Keypad',
    phoneKeyboard: 'Phone Keyboard'
  },
  bn: {
    title: 'এমএফএস বিজনেস চার্জ ক্যালকুলেটর',
    subtitle: 'পার্সোনাল অ্যাকাউন্ট বিজনেস চার্জিং সিস্টেম',
    menuCashoutCharge: 'ক্যাশআউট চার্জ',
    menuAboutDeveloper: 'ডেভেলপার সম্পর্কে',
    menuLanguage: 'ভাষা / Language',
    english: 'English',
    bangla: 'বাংলা',
    yourAmount: 'আপনার পরিমাণ',
    mfs: 'MFS',
    selectMfs: 'MFS নির্বাচন করুন',
    cashoutCharge: 'ক্যাশআউট চার্জ',
    sendMoneyFee: 'সেন্ড মানি ফি',
    totalCustomerPays: 'গ্রাহক মোট প্রদান করবে',
    copyTotal: 'মোট কপি করুন',
    copied: 'কপি হয়েছে ✓',
    reset: 'রিসেট',
    save: 'সংরক্ষণ',
    saved: 'সংরক্ষিত ✓',
    clear: 'মুছুন',
    quickAdd: 'কুইক অ্যাড',
    calculationHistory: 'হিসাবের ইতিহাস',
    clearHistory: 'ইতিহাস মুছুন',
    noHistory: 'এখনো কোনো হিসাব সংরক্ষিত নেই',
    confirmClearHistory: 'আপনি কি নিশ্চিত যে সমস্ত হিসাবের ইতিহাস মুছে ফেলতে চান?',
    yesClear: 'হ্যাঁ, মুছুন',
    cancel: 'বাতিল',
    chargeRate: 'রেট: ৳{rate}/১,০০০',
    aboutTitle: 'ডেভেলপার সম্পর্কে',
    developedBy: 'Developed by Musabber Himel',
    returnToCalc: '← ক্যাশআউট চার্জ',
    tagline: 'ব্যবসায়িক লেনদেনের জন্য গ্রাহকের কার্যকর চার্জ নির্ণয়ের সহজ ক্যালকুলেটর।',
    loadToCalc: 'ক্যালকুলেটরে আনুন',
    savedToHistory: 'ইতিহাসে সংরক্ষিত',
    enterAmountFirst: 'সংরক্ষণ করতে প্রথমে পরিমাণ লিখুন',
    posKeypad: 'কিপ্যাড',
    phoneKeyboard: 'ফোন কিবোর্ড'
  }
};
