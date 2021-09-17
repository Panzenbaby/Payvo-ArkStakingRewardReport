import React, {useState} from 'react';
import {useWalletContext} from '../provider/WalletProvider';

export const HomePage = () => {
    const context = useWalletContext();

    const [wallets] = useState(() =>
        context.profile().wallets()
            .filter((wallet: any) => wallet.data.COIN === 'ARK' && wallet.data.NETWORK === 'ark.mainnet'),
    );

    const [selectedWallet, setSelectedWallet] = useState(() => {
        if (wallets.length) {
            return wallets[0];
        }
    });

    return <div>{selectedWallet.data.ADDRESS}</div>;
};
