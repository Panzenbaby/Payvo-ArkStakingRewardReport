import { Price, Transaction, Vote, Wallet } from '../Types';
/**
 * This class is our data source. It is the interface to each used REST Api.
 */
export default class RemoteDataStore {
    private walletApi;
    /**
     * @param {any} walletApi the wallet api instance from the payvo wallet.
     */
    constructor(walletApi: any);
    /**
     * Loads all received transactions for the given wallet.
     * @param {Wallet} wallet the wallet for which all transactions should be loaded.
     */
    getReceivedTransactions(wallet: Wallet): Promise<Transaction[]>;
    /**
     * Loads all votes which have been made from the given wallet.
     * @param {Wallet} wallet the wallet for which all votes should be loaded.
     */
    getVotes(wallet: Wallet): Promise<Vote[]>;
    /**
     * Load delegate information for each delegate id in the given list.
     * @param {string[]} delegateIds a list of ids from delegates.
     */
    getDelegates(delegateIds: string[]): Promise<Map<string, string>>;
    /**
     * Load historical prices for the given transactions.
     * @param {string} currency the currency which the price if requested of.
     * @param {Wallet} wallet the wallet where the transactions are received.
     * @param {Transaction[]} transactions the transactions which historical prices are requested.
     */
    loadPrices(currency: string, wallet: Wallet, transactions: Transaction[]): Promise<Price[]>;
    /**
     * Will call the ARK REST api for the given path and loads all pages until the first page where data is empty.
     * In case of "to many requests" error, this methode will do a timeout of 10 seconds before it will proceed.
     * @param {string} requestPath the path of the requested endpoint.
     */
    private getAllPagesOf;
}
