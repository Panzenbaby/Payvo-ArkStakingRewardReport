import { Transaction } from './Types';
export declare const tokenValueFactor: number;
export declare const secondsOfDay: number;
export declare const isCrypto: (currency: string) => boolean;
export declare const formatCurrency: (amount: number, currency: string, language?: string) => string;
export declare const getDaysSince: (fromTime: number) => number;
export declare const buildExportRow: (transaction: Transaction, token: string, language: string) => string;
