import React from 'react';
import {Transaction, Wallet} from '../../Types';
import {formatCurrency, tokenValueFactor} from '../../utils';
import {ARK_EXPLORER_SENDER_PATH, ARK_EXPLORER_TRANSACTIONS_PATH, ARK_EXPLORER_URL} from '../../Constants';

const {Components} = globalThis.payvo;
const {TableCell, TableRow, Link, Icon} = Components;

interface TransactionListItemProps {
    wallet: Wallet,
    transaction: Transaction
}

// TODO format with right language
export const TransactionListItem = (props: TransactionListItemProps) => {
    const value = props.transaction.amount * props.transaction.price.close / tokenValueFactor;
    const transactionExplorerUrl = ARK_EXPLORER_URL + ARK_EXPLORER_TRANSACTIONS_PATH + props.transaction.transactionId;
    const senderExplorerUrl = ARK_EXPLORER_URL + ARK_EXPLORER_SENDER_PATH + props.transaction.senderPublicKey;
    const idSnapShot = props.transaction.transactionId.substring(0, 9) + '...';
    const date = new Date(props.transaction.date * 1000);

    return (
        <TableRow>
            <TableCell innerClassName="justify-center text-theme-secondary-text" isCompact={true}>
                <span className="justify-center whitespace-nowrap">
                    {formatCurrency(props.transaction.amount, props.wallet.coin)}
                </span>
            </TableCell>

            <TableCell innerClassName="justify-center text-theme-secondary-text" isCompact={true}>
                <span className="justify-center whitespace-nowrap">
                    {formatCurrency(value, props.transaction.price.currency)}
                </span>
            </TableCell>

            <TableCell innerClassName="justify-center text-theme-secondary-text" isCompact={true}>
                <span className="flex items-center  whitespace-nowrap">
                    {date.toLocaleDateString()} {date.toLocaleTimeString()}
                </span>
            </TableCell>

            <TableCell innerClassName="justify-center" isCompact={true}>
                <Link to={senderExplorerUrl} showExternalIcon={false} isExternal>
                    {props.transaction.senderName}
                </Link>
            </TableCell>

            <TableCell innerClassName="justify-center" isCompact={true}>
                <Link to={transactionExplorerUrl} showExternalIcon={false} isExternal>
                    <span className="flex flex-row">
                        <span className="active:text-theme-primary-400">{idSnapShot}</span>
                        <Icon className="ml-2 mt-2" name="MagnifyingGlassId"/>
                    </span>
                </Link>
            </TableCell>
        </TableRow>
    );
};
