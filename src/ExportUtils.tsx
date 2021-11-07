import {Transaction, Wallet} from './Types';
import {buildExportRow} from './utils';


export const exportTransactions = (api: any, wallet: Wallet, year: number, transactions: Transaction[]) => {
    if (!transactions || transactions.length == 0) {
        return;
    }

    const rows = [];
    const currency = transactions[0].price.currency;

    const amount = 'amount';
    const value = 'value';
    const date = 'date';
    const transactionId = 'transactionId';

    const header = `${wallet.coin} ${amount} | ${currency} ${value} | ${date} | ${transactionId}`;
    rows.push(header);

    transactions.forEach((transaction) => {
        const language = 'en'; // TODO how to get language?
        rows.push(buildExportRow(transaction, wallet.coin, language));
    });

    const asString = rows.join('\n');
    return api.filesystem().askUserToSaveFile(asString);
};
