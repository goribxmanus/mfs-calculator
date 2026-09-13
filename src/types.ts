export type MFSKey = 'bkash' | 'nagad' | 'rocket' | 'upay';

export interface MFSConfig {
  id: MFSKey;
  name: string;
  bnName: string;
  rate: number; // rate per 1000 BDT
  sendMoneyFee: number; // Send money fee (5 for bkash/nagad, 0 for rocket/upay)
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  borderAccent: string;
}

export interface CalculationResult {
  amount: number;
  mfs: MFSConfig;
  baseCharge: number;
  sendMoneyFee: number;
  netCharge: number;
  total: number;
}

export interface HistoryItem {
  id: string;
  mfsKey: MFSKey;
  mfsName: string;
  amount: number;
  baseCharge: number;
  sendMoneyFee: number;
  netCharge: number;
  total: number;
  timestamp: number;
  formattedDate: string;
}

export type AppLanguage = 'en' | 'bn';

export type ActiveScreen = 'calculator' | 'about';
