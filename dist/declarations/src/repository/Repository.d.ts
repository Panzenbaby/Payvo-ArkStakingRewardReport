import { ExecutePermission, Transaction, Wallet } from '../Types';
/**
 * This class handles all of the business logic. It is the interface from the plugin to the data.
 */
export default class Repository {
    private walletApi;
    private remoteDataStore;
    private dateComparator;
    private dateComparatorDesc;
    /**
     * @param {any} walletApi the api of the payvo wallet
     */
    constructor(walletApi: any);
    /**
     * Generates a all time staking reward report for the given wallet.
     * @param {ExecutePermission} executePermission can be canceled to stop the execution of this request.
     * @param {string} currency the currency which will be used to determine the price.
     * @param {Wallet} wallet the current selected wallet which the report will be generated for.
     */
    generateStakingRewardReport(executePermission: ExecutePermission, currency: string, wallet: Wallet): Promise<Map<number, Transaction[]>>;
    /**
     * Generates a all time staking reward report for the given wallet.
     * @param {ExecutePermission} executePermission can be canceled to stop the execution of this request.
     * @param {string} currency the currency which will be used to determine the price.
     * @param {Wallet} wallet the current selected wallet which the report will be generated for.
     */
    private internalGenerateStakingRewardReport;
    /**
     * Apply the close price of prices to the the transactions.
     * @param {Transaction[]} transactions
     * @param {Price[]} prices
     */
    private applyPrices;
    /**
     * Filter those transactions witch are from a delegate the wallet voted for.
     * @param {Transaction[]} transactions a set of transactions which should be filtered.
     * @param {Vote[]} votes the votes which are filtered for.
     * @return {Transaction[]} the filtered list of transaction. Each transaction was received from a senderId
     * of an entity of votes.
     */
    private findStakingRewards;
    /**
     * Filter those transactions witch are from a vote period.
     * @param {Transaction[]} transactions a set of transactions which should be filtered.
     * @param {Vote[]} votes the votes which are filtered for.
     * @param {number} since The start time of the requested period. The up-vote-time of the used vote period is greater or equal this start time.
     * @return {{result: Transaction[], downVoteTime: number}} the filtered transactions and the downVoteTime of the used vote period (or now if the period isn't over).
     */
    private findStakingRewardsSince;
}
