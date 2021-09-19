import {Price, Transaction, Vote, Wallet} from '../Types';
import {ARK_API_URL, PRICE_API_EP_URL} from '../Constants';
import {getDaysSince} from '../utils';

/**
 * This class is our data source. It is the interface to each used REST Api.
 */
export default class RemoteDataStore {
    private walletApi: any;

    /**
     * @param {any} walletApi the wallet api instance from the payvo wallet.
     */
    constructor(walletApi: any) {
        this.walletApi = walletApi;
    }

    /**
     * Loads all received transactions for the given wallet.
     * @param {Wallet} wallet the wallet for which all transactions should be loaded.
     */
    async getReceivedTransactions(wallet: Wallet): Promise<Transaction[]> {
        const address = wallet.address;
        const requestPath = `/wallets/${address}/transactions/received?limit=100`;
        const resultList = await this.getAllPagesOf(requestPath);

        const result: Transaction[] = [];
        try {
            resultList.forEach((transaction) => {
                const type = parseInt(transaction.type);
                const date = transaction.timestamp.unix;
                const senderPublicKey = transaction.senderPublicKey;
                const transactionId = transaction.id;

                let amount = 0.0;
                switch (type) {
                case 0:
                    amount = parseFloat(transaction.amount);
                    break;
                case 6:
                    const payments = transaction.asset.payments;
                    payments.forEach((payment) => {
                        if (payment.recipientId === address) {
                            amount = parseFloat(payment.amount);
                        }
                    });
                    break;
                }

                result.push({
                    transactionId: transactionId,
                    senderPublicKey: senderPublicKey,
                    amount: amount,
                    date: date,
                    closePriceOfDay: 0,
                    senderName: '',
                });
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
        return result;
    }

    /**
     * Loads all votes which have been made from the given wallet.
     * @param {Wallet} wallet the wallet for which all votes should be loaded.
     */
    async getVotes(wallet: Wallet) {
        const address = wallet.address;
        const path = `/wallets/${address}/votes?limit=100`;
        const resultList = await this.getAllPagesOf(path);

        const result: Vote[] = [];
        try {
            const delegateIds = new Set<string>();
            resultList.forEach((transaction) => {
                const vote = transaction.asset.votes[0];
                const delegatePublicKey = vote.substr(1, vote.length);
                delegateIds.add(delegatePublicKey);
            });

            const delegates = await this.getDelegates(Array.from(delegateIds));

            resultList.forEach((transaction) => {
                const date = transaction.timestamp.unix;
                const vote = transaction.asset.votes[0];
                const isDownVote = vote[0] === '-';
                const delegatePublicKey = vote.substr(1, vote.length);
                const delegateName = delegates.get(delegatePublicKey);

                result.push({
                    delegateName: delegateName,
                    delegatePublicKey: delegatePublicKey,
                    date: date,
                    isDownVote: isDownVote,
                });
            });
        } catch (error) {
            console.log(error);
            throw error;
        }

        return result;
    }

    /**
     * Load delegate information for each delegate id in the given list.
     * @param {string[]} delegateIds a list of ids from delegates.
     */
    async getDelegates(delegateIds: string[]): Promise<Map<string, string>> {
        const result = new Map();
        try {
            for (const delegateId of delegateIds) {
                const url = ARK_API_URL + '/delegates?publicKey=' + delegateId;
                const requestResult = await this.walletApi.http().get(url);
                const response = requestResult.json();

                result.set(delegateId, response.data[0].username);
            }
        } catch (error) {
            console.log(error);
            throw error;
        }

        return result;
    }

    /**
     * Load historical prices for the given transactions.
     * @param {Wallet }wallet the wallet where the transactions are received.
     * @param {Transaction[]} transactions the transactions which historical prices are requested.
     */
    async loadPrices(wallet: Wallet, transactions: Transaction[]): Promise<Price[]> {
        const prices: Price[] = [];

        try {
            if (transactions.length > 0) {
                const currency = 'EUR'; // TODO get current currency of payvo api
                const lastTransactionTime = transactions[transactions.length - 1].date;
                const fromTime = Math.round(transactions[0].date);
                const query = {
                    fsym: wallet.coin,
                    tsym: currency,
                    toTs: lastTransactionTime,
                    limit: getDaysSince(fromTime),
                };

                const requestResult = await this.walletApi.http().get(PRICE_API_EP_URL, query);
                const data = requestResult.json().Data;
                data.forEach((price) => prices.push({
                    time: price.time,
                    close: price.close,
                    currency: currency,
                }));
            }
        } catch (error) {
            console.log(error);
            throw error;
        }

        return prices;
    }

    /**
     * Will call the ARK REST api for the given path and loads all pages until the first page where data is empty.
     * In case of "to many requests" error, this methode will do a timeout of 10 seconds before it will proceed.
     * @param {string} requestPath the path of the requested endpoint.
     */
    private async getAllPagesOf(requestPath): Promise<any> {
        const result: any[] = [];
        let page: number = 1;
        let isEmpty: boolean = true;

        do {
            // TODO handle TO MANY REQUESTS with a timeout of 10s
            // TODO right now there is no info about a selected peer in the payvo api. if this changes we can use the peer instead of domain
            const url = ARK_API_URL + requestPath + `&page=${page}`;
            const requestResult = await this.walletApi.http().get(url);
            const response = requestResult.json();

            Array.prototype.push.apply(result, response.data);
            page++;

            isEmpty = !response || !response.data || response.data.length == 0;
        } while (!isEmpty);

        return result;
    }
}
