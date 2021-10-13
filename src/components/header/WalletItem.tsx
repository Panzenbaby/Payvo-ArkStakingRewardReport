import React, {useState} from 'react';
import {Avatar} from './Avatar';
import type {Wallet} from '../../Types';
import {formatCurrency} from '../../utils';
import {useWalletContext} from '../../provider/WalletProvider';

interface WalletItemProps {
    wallet: Wallet,
}

export const WalletItem = (props: WalletItemProps) => {
    const address = props.wallet.address;
    const alias = props.wallet.alias;
    const avatar = props.wallet.avatar;
    const balance = props.wallet.balance;
    const coin = props.wallet.coin;

    const context = useWalletContext();

    // TODO this is not the right way to get language of the payvo wallet. I need to check this
    const [language] = useState(() => context.api.profile().language);

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
                    {formatCurrency(balance, coin, language)}
                </span>
            </div>
        </div>
    );
};

export default WalletItem;
