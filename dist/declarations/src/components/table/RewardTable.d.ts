import { Transaction } from '../../Types';
interface RewardTableProps {
    selectedYear: number;
    rewardData: Map<number, Transaction[]>;
}
export declare const RewardTable: (props: RewardTableProps) => any;
export default RewardTable;
