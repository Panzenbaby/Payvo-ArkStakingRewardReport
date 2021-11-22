import {Transaction, Wallet} from "./Types";
import {buildExportRow} from "./utils";
import {getString, TABLE_HEADER_AMOUNT, TABLE_HEADER_DATE, TABLE_HEADER_TRANSACTION, TABLE_HEADER_VALUE} from "./Strings";


export const exportTransactions = (api: any, wallet: Wallet, year: number, transactions: Transaction[], locale: string) => {
    if (!transactions || transactions.length == 0) {
        return;
    }

    const rows = [];
    const currency = transactions[0].price.currency;

    const amount = getString(locale, TABLE_HEADER_AMOUNT);
    const value = getString(locale, TABLE_HEADER_VALUE);
    const date = getString(locale, TABLE_HEADER_DATE);
    const transactionId = getString(locale, TABLE_HEADER_TRANSACTION);

    const header = `${wallet.coin} ${amount} | ${currency} ${value} | ${date} | ${transactionId}`;
    rows.push(header);

    transactions.forEach((transaction) => {
        rows.push(buildExportRow(transaction, wallet.coin, locale));
    });

    const asString = rows.join("\n");
    const fileNameSuggestion = `stakingRewardReport_${year}_${wallet.address}`;
    return api.filesystem().askUserToSaveFile(asString, fileNameSuggestion);
};
