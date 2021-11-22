import React from "react";
import {Transaction, Wallet} from "../../Types";
import {TransactionListItem} from "./TransactionListItem";
import {getString, TABLE_EMPTY_MESSAGE, TABLE_HEADER_AMOUNT, TABLE_HEADER_DATE, TABLE_HEADER_FROM, TABLE_HEADER_TRANSACTION, TABLE_HEADER_VALUE} from "../../Strings";
import {TranslatedText} from "../TranslatedText";

const {Components} = globalThis.payvo;
const {Table} = Components;

const columns = (locale: string) => {
    return [
        {
            Header: getString(locale, TABLE_HEADER_AMOUNT),
            accessor: "amount",
            className: "ml-6 mr-2 justify-center",
        },
        {
            Header: getString(locale, TABLE_HEADER_VALUE),
            accessor: (transaction: Transaction) => transaction.amount * transaction.price.close,
            className: "ml-6 mr-2 justify-center",
        },
        {
            Header: getString(locale, TABLE_HEADER_DATE),
            accessor: "date",
            className: "ml-6 mr-2 justify-center",
        },
        {
            Header: getString(locale, TABLE_HEADER_FROM),
            className: "ml-2 mr-2 justify-center",
        },
        {
            Header: getString(locale, TABLE_HEADER_TRANSACTION),
            className: "ml-2 mr-2 justify-center",
        },
    ];
};

interface RewardTableProps {
    locale: string,
    selectedYear: number,
    wallet: Wallet,
    rewardData: Map<number, Transaction[]>
}

export const RewardTable = (props: RewardTableProps) => {
    const currentData = props.rewardData.get(props.selectedYear) ? props.rewardData.get(props.selectedYear) : [];

    if (currentData.length == 0) {
        return (
            <div className="mt-4 relative">
                <TranslatedText stringKey={TABLE_EMPTY_MESSAGE}/>
            </div>
        );
    } else {
        return (
            <div className="flex-1 mt-4 relative">
                <Table columns={columns(props.locale)} data={currentData}>
                    {(transaction: Transaction) => <TransactionListItem locale={props.locale} wallet={props.wallet} transaction={transaction}/>}
                </Table>
            </div>
        );
    }
};

export default RewardTable;
