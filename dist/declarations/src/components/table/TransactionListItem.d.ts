import { Transaction, Wallet } from "../../Types";
interface TransactionListItemProps {
    locale: string;
    wallet: Wallet;
    transaction: Transaction;
}
export declare const TransactionListItem: (props: TransactionListItemProps) => any;
export {};
