import {Transaction} from "./Types";

export const tokenValueFactor: number = 1e8;

export const secondsOfDay: number = 24 * 60 * 60;

export const isCrypto = (currency: string) => {
    return ["ARK", "BTC", "ETH", "LTC"].includes(currency);
};

export const formatCurrency = (amount: number, currency: string, locale: string = "en") => {
    const asCrypto = isCrypto(currency);

    if (asCrypto) {
        amount = amount / tokenValueFactor;
    }

    return amount.toLocaleString(locale, {
        style: "currency",
        currencyDisplay: "code",
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: asCrypto ? 8 : 2,
    });
};

export const getDaysSince = (fromTime: number) => {
    const endDate = Date.now() / 1000;
    return Math.round(Math.abs(((fromTime) - endDate) / secondsOfDay));
};

export const getPriceValue = (transaction: Transaction, locale: string) => {
    let closePrice = undefined;
    if (transaction.price && transaction.price.close) {
        closePrice = transaction.price.close;
    }

    if (!closePrice) {
        return "NaN";
    }

    let tokens = transaction.amount;
    const currency = transaction.price.currency;

    if (!isCrypto(currency)) {
        tokens = tokens / tokenValueFactor;
    }

    const value = tokens * closePrice;
    return formatCurrency(value, currency, locale);
};

export const getAmountValue = (transaction: Transaction, token: string, locale: string) => {
    if (!transaction.amount) {
        return "NaN";
    }

    const value = transaction.amount;
    return formatCurrency(value, token, locale);
};
