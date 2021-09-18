const tokenValueFactor = 1e8;

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
