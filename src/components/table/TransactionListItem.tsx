import React from "react";
import {Transaction, Wallet} from "../../Types";
import {formatCurrency, getPriceValue, isCrypto, tokenValueFactor} from "../../utils";
import {ARK_EXPLORER_SENDER_PATH, ARK_EXPLORER_TRANSACTIONS_PATH, ARK_EXPLORER_URL} from "../../Constants";

const {Components} = globalThis.payvo;
const {TableCell, TableRow, Link, Icon, Tooltip} = Components;

interface TransactionListItemProps {
    locale: string,
    wallet: Wallet,
    transaction: Transaction
}

export const TransactionListItem = (props: TransactionListItemProps) => {
    const transactionExplorerUrl = ARK_EXPLORER_URL + ARK_EXPLORER_TRANSACTIONS_PATH + props.transaction.transactionId;
    const idSnapShot = props.transaction.transactionId.substring(0, 9) + "...";
    const date = new Date(props.transaction.date * 1000);

    let price = props.transaction.price.close;
    const currency = props.transaction.price.currency;
    if (isCrypto(currency)) {
        price = price * tokenValueFactor;
    }
    const closePriceTip = formatCurrency(price, currency, props.locale) + " / " + props.wallet.coin;

    return (
        <TableRow>
            <TableCell innerClassName="justify-center text-theme-secondary-text" isCompact={true}>
                <span className="justify-center whitespace-nowrap">
                    {formatCurrency(props.transaction.amount, props.wallet.coin, props.locale)}
                </span>
            </TableCell>

            <TableCell innerClassName="justify-center text-theme-secondary-text" isCompact={true}>
                <Tooltip content={closePriceTip} className="mb-1">
                    <span className="justify-center whitespace-nowrap">
                        {getPriceValue(props.transaction, props.locale)}
                    </span>
                </Tooltip>
            </TableCell>

            <TableCell innerClassName="justify-center text-theme-secondary-text" isCompact={true}>
                <span className="flex items-center  whitespace-nowrap">
                    {date.toLocaleDateString(props.locale)} {date.toLocaleTimeString(props.locale)}
                </span>
            </TableCell>

            <TableCell innerClassName="justify-center text-theme-secondary-text" isCompact={true}>
                <span className="flex items-center  whitespace-nowrap">
                    {props.transaction.senderName}
                </span>
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
