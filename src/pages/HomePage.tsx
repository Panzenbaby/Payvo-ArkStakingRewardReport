import React, {useState} from 'react';
import {useWalletContext} from '../provider/WalletProvider';
import {createWallet, Wallet} from '../types/Types';
import {Header} from '../components/Header';
import {Keys} from '../types/Keys';

export const HomePage = () => {
    const context = useWalletContext();

    const [wallets] = useState(() =>
        context.profile().wallets()
            .filter((wallet: any) => wallet.data.COIN === 'ARK' && wallet.data.NETWORK === 'ark.mainnet')
            .map((wallet) => createWallet(wallet)),
    );

    const [selectedWallet, setSelectedWallet] = useState(() => {
        if (wallets.length) {
            let result = wallets[0];
            const selectedAddress = context.store().data().get(Keys.STORE_ADDRESS);
            if (selectedAddress) {
                const wallet = wallets.find((wallet) => wallet.address == selectedAddress);
                if (wallet) {
                    result = wallet;
                }
            }

            return result;
        }
    });

    const onWalletSelected = (wallet: Wallet) => {
        context.store().data().set(Keys.STORE_ADDRESS, wallet.address);
        setSelectedWallet(wallet);
    };

    return (
        <div className="flex ml-6 mr-6 flex-row w-full">
            <div className="flext w-full">
                <Header
                    selectedWallet={selectedWallet}
                    wallets={wallets}
                    onWalletSelected={onWalletSelected}/>
                <div>TODO</div>
            </div>
        </div>
    );
};
