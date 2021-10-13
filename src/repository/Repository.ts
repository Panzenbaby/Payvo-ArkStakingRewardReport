import RemoteDataStore from './RemoteDataStore';
import {Price, Transaction, Vote, Wallet} from '../Types';
import {secondsOfDay} from '../utils';

/**
 * This class handles all of the business logic. It is the interface from the plugin to the data.
 */
export default class Repository {
    private walletApi: any;
    private remoteDataStore: RemoteDataStore;

    // eslint-disable-next-line valid-jsdoc
    private dateComparator = (lhs, rhs) => lhs.date - rhs.date
    // eslint-disable-next-line valid-jsdoc
    private dateComparatorDesc = (lhs, rhs) => rhs.date - lhs.date

    /**
     * @param {any} walletApi the api of the payvo wallet
     */
    constructor(walletApi: any) {
        this.walletApi = walletApi;
        this.remoteDataStore = new RemoteDataStore(walletApi);
    }

    /**
     * Generates a all time staking reward report for the given wallet.
     * @param {Wallet} wallet the current selected wallet which the report will be generated for.
     */
    async generateStakingRewardReport(wallet: Wallet): Promise<Map<number, Transaction[]>> {
        const myTransactions = await this.remoteDataStore.getReceivedTransactions(wallet);
        const myVotes = await this.remoteDataStore.getVotes(wallet);

        myTransactions.sort(this.dateComparator);
        myVotes.sort(this.dateComparator);

        const transactionsMap = new Map<number, Transaction[]>();
        myTransactions.forEach((transaction) => {
            const year = new Date(transaction.date * 1000).getFullYear();
            if (!transactionsMap.get(year)) {
                transactionsMap.set(year, []);
            }
            transactionsMap.get(year).push(transaction);
        });

        const stakingRewardsMap = new Map<number, Transaction[]>();
        for (const entry of transactionsMap.entries()) {
            const year: number = entry[0];
            const currentTransactions: Transaction[] = entry[1];

            const prices = await this.remoteDataStore.loadPrices(wallet, currentTransactions);
            await this.applyPrices(currentTransactions, prices);

            const rewards = this.findStakingRewards(currentTransactions, myVotes);
            rewards.sort(this.dateComparatorDesc);

            stakingRewardsMap.set(year, rewards);
        }

        return stakingRewardsMap;
    }

    /**
     * Apply the close price of prices to the the transactions.
     * @param {Transaction[]} transactions
     * @param {Price[]} prices
     */
    private async applyPrices(transactions: Transaction[], prices: Price[]): Promise<any> {
        transactions.map((transaction) => {
            const time = transaction.date;
            const price = prices.find((price) => {
                return time >= price.time && time < (price.time + secondsOfDay);
            });

            Object.assign(transaction, {price: price});
        });
    }

    /**
     * Filter those transactions witch are from a delegate the wallet voted for.
     * @param {Transaction[]} transactions a set of transactions which should be filtered.
     * @param {Vote[]} votes the votes which are filtered for.
     * @return {Transaction[]} the filtered list of transaction. Each transaction was received from a senderId
     * of an entity of votes.
     */
    private findStakingRewards(transactions: Transaction[], votes: Vote[]): Transaction[] {
        const result: Transaction[] = [];
        if (votes.length == 0) {
            return result;
        }

        const lastVoteTime = votes[votes.length - 1].date;
        let since = 0;
        while (since < lastVoteTime) {
            const res = this.findStakingRewardsSince(transactions, votes, since);
            Array.prototype.push.apply(result, res.result);
            since = res.downVoteTime;
        }

        return result;
    }

    /**
     * Filter those transactions witch are from a vote period.
     * @param {Transaction[]} transactions a set of transactions which should be filtered.
     * @param {Vote[]} votes the votes which are filtered for.
     * @param {number} since The start time of the requested period. The up-vote-time of the used vote period is greater or equal this start time.
     * @return {{result: Transaction[], downVoteTime: number}} the filtered transactions and the downVoteTime of the used vote period (or now if the period isn't over).
     */
    private findStakingRewardsSince(transactions: Transaction[], votes: Vote[], since: number): {result: Transaction[], downVoteTime: number} {
        const upVote = votes.find((vote) => !vote.isDownVote && since < vote.date);
        const downVote = votes.find((vote) => vote.isDownVote && vote.delegatePublicKey === upVote.delegatePublicKey);

        let downVoteTime = Date.now();
        if (downVote) {
            downVoteTime = downVote.date;
        }

        const result = transactions.filter((transaction) => {
            return upVote.date <= transaction.date && transaction.date < downVoteTime &&
                transaction.senderPublicKey === upVote.delegatePublicKey;
        });
        result.forEach((transaction) => {
            Object.assign(transaction, {senderName: upVote.delegateName});
        });

        return {result: result, downVoteTime: downVoteTime};
    }
}
