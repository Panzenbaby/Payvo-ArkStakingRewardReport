import React from "react";
import {Avatar} from "./Avatar";
import type {Wallet} from "../../Types";
import {formatCurrency} from "../../utils";

interface WalletItemProps {
    locale: string,
    wallet: Wallet,
}

export const WalletItem = (props: WalletItemProps) => {
    const address = props.wallet.address;
    const alias = props.wallet.alias;
    const avatar = props.wallet.avatar;
    const balance = props.wallet.balance;
    const coin = props.wallet.coin;

    return (
        <div
            className="flex items-center space-x-4 py-4"
        >
            <Avatar imageData={avatar}/>

            <div className="flex flex-col flex-1 overflow-hidden whitespace-nowrap no-ligatures">
                <span className="font-semibold text-theme-secondary-text text-sm">{alias}</span>
                <span className="truncate text-theme-secondary-500 dark:text-theme-secondary-700 font-semibold">
                    {address}
                </span>
                <span className="truncate text-theme-secondary-500 dark:text-theme-secondary-700 font-semibold">
                    {formatCurrency(balance, coin, props.locale)}
                </span>
            </div>
        </div>
    );
};

export default WalletItem;
