const tokenValueFactor: number = 1e8;

export const secondsOfDay: number = 24 * 60 * 60;
export const millisecondsOfDay: number = secondsOfDay * 1000;

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

export const getDaysSince = (fromTime) => {
    const endDate = Date.now() / 1000;
    return Math.round(Math.abs(((fromTime) - endDate) / secondsOfDay));
};
