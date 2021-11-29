import { Transaction } from "./Types";
export declare const tokenValueFactor: number;
export declare const secondsOfDay: number;
export declare const isCrypto: (currency: string) => boolean;
export declare const formatCurrency: (amount: number, currency: string, locale?: string) => string;
export declare const getDaysSince: (fromTime: number) => number;
export declare const getPriceValue: (transaction: Transaction, locale: string) => string;
export declare const getAmountValue: (transaction: Transaction, token: string, locale: string) => string;
