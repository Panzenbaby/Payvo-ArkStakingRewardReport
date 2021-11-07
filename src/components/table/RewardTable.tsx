import React from 'react';
import {Transaction, Wallet} from '../../Types';
import {TransactionListItem} from './TransactionListItem';

const {Components} = globalThis.payvo;
const {Table} = Components;

const columns = [
    {
        Header: 'Amount',
        accessor: 'amount',
        className: 'ml-6 mr-2 justify-center',
    },
    {
        Header: 'Value',
        accessor: (transaction: Transaction) => transaction.amount * transaction.price.close,
        className: 'ml-6 mr-2 justify-center',
    },
    {
        Header: 'Date',
        accessor: 'date',
        className: 'ml-6 mr-2 justify-center',
    },
    {
        Header: 'From',
        className: 'ml-2 mr-2 justify-center',
    },
    {
        Header: 'Transaction',
        className: 'ml-2 mr-2 justify-center',
    },
];

interface RewardTableProps {
    language: string,
    selectedYear: number,
    wallet: Wallet,
    rewardData: Map<number, Transaction[]>
}

export const RewardTable = (props: RewardTableProps) => {
    const currentData = props.rewardData.get(props.selectedYear) ? props.rewardData.get(props.selectedYear) : [];

    if (currentData.length == 0) {
        return (
            <div className="mt-4 relative">
                <span>The report of the selected period is empty.</span>
            </div>
        );
    } else {
        return (
            <div className="flex-1 mt-4 relative">
                <Table columns={columns} data={currentData}>
                    {(transaction: Transaction) => <TransactionListItem language={props.language} wallet={props.wallet} transaction={transaction}/>}
                </Table>
            </div>
        );
    }
};

export default RewardTable;
