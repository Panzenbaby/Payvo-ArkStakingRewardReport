import { Transaction, Wallet } from '../../Types';
interface RewardTableProps {
    language: string;
    selectedYear: number;
    wallet: Wallet;
    rewardData: Map<number, Transaction[]>;
}
export declare const RewardTable: (props: RewardTableProps) => any;
export default RewardTable;
