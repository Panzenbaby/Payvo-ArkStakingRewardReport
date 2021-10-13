import {Transaction} from './Types';

export const tokenValueFactor: number = 1e8;

export const secondsOfDay: number = 24 * 60 * 60;

export const isCrypto = (currency: string) => {
    return ['ARK', 'BTC', 'ETH', 'LTC'].includes(currency);
};

export const formatCurrency = (amount: number, currency: string, language: string = 'en') => {
    const asCrypto = isCrypto(currency);

    if (asCrypto) {
        amount = amount / tokenValueFactor;
    }

    return amount.toLocaleString(language, {
        style: 'currency',
        currencyDisplay: 'code',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: asCrypto ? 8 : 2,
    });
};

export const getDaysSince = (fromTime: number) => {
    const endDate = Date.now() / 1000;
    return Math.round(Math.abs(((fromTime) - endDate) / secondsOfDay));
};

export const buildExportRow = (transaction: Transaction, token: string, language: string) => {
    const amount = getAmountValue(transaction, token, language);
    const value = getPriceValue(transaction, language);

    const transactionDate = new Date(transaction.date * 1000);
    const dateTime = transactionDate.toLocaleDateString() + ' ' + transactionDate.toLocaleTimeString();
    const transactionId = transaction.transactionId;

    return `${amount} | ${value} | ${dateTime} | ${transactionId}`;
};

const getPriceValue = (transaction: Transaction, language: string) => {
    let closePrice = undefined;
    if (transaction.price && transaction.price.close) {
        closePrice = transaction.price.close;
    }

    if (!closePrice) {
        return 'NaN';
    }

    let tokens = transaction.amount;
    const currency = transaction.price.currency;

    if (!isCrypto(currency)) {
        tokens = tokens / tokenValueFactor;
    }

    const value = tokens * closePrice;
    return formatCurrency(value, currency, language);
};

const getAmountValue = (transaction: Transaction, token: string, language: string) => {
    if (!transaction.amount) {
        return 'NaN';
    }

    const value = transaction.amount;
    return formatCurrency(value, token, language);
};
