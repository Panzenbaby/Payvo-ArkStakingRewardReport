import {Transaction, Wallet} from "./Types";
import {formatCurrency, getAmountValue, getPriceValue, isCrypto, tokenValueFactor} from "./utils";
import {EXPORT_HEADER_PRICE, getString, TABLE_HEADER_AMOUNT, TABLE_HEADER_DATE, TABLE_HEADER_TRANSACTION, TABLE_HEADER_VALUE} from "./Strings";


export const exportTransactions = (api: any, wallet: Wallet, year: number, transactions: Transaction[], locale: string) => {
    if (!transactions || transactions.length == 0) {
        return;
    }

    const rows = [];
    const currency = transactions[0].price.currency;

    const amount = getString(locale, TABLE_HEADER_AMOUNT);
    const value = getString(locale, TABLE_HEADER_VALUE);
    const price = getString(locale, EXPORT_HEADER_PRICE);
    const date = getString(locale, TABLE_HEADER_DATE);
    const transactionId = getString(locale, TABLE_HEADER_TRANSACTION);

    const header = `${wallet.coin} ${amount} | ${currency} ${value} | ${price} | ${date} | ${transactionId}`;
    rows.push(header);

    transactions.forEach((transaction) => {
        rows.push(buildExportRow(transaction, wallet.coin, locale));
    });

    const asString = rows.join("\n");
    const fileNameSuggestion = `stakingRewardReport_${year}_${wallet.address}`;
    return api.filesystem().askUserToSaveFile(asString, fileNameSuggestion);
};

const buildExportRow = (transaction: Transaction, token: string, locale: string) => {
    const amount = getAmountValue(transaction, token, locale);
    const value = getPriceValue(transaction, locale);

    let price = "NaN";
    if (transaction.price && transaction.price.close && transaction.price.currency) {
        const currency = transaction.price.currency;
        let closePrice = transaction.price.close;

        if (isCrypto(currency)) {
            closePrice = closePrice * tokenValueFactor;
        }
        price = formatCurrency(closePrice, currency, locale);
    }

    const transactionDate = new Date(transaction.date * 1000);
    const dateTime = transactionDate.toLocaleDateString() + " " + transactionDate.toLocaleTimeString();
    const transactionId = transaction.transactionId;

    return `${amount} | ${value} | ${price} | ${dateTime} | ${transactionId}`;
};
