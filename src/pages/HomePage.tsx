import React, {useState, useEffect} from 'react';
import {useWalletContext} from '../provider/WalletProvider';
import {createWallet, Transaction, Wallet} from '../Types';
import Header from '../components/header/Header';
import {Keys} from '../Keys';
import RewardTable from '../components/table/RewardTable';

export const HomePage = () => {
    const context = useWalletContext();

    const [selectedYear] = useState(() => new Date().getFullYear());
    const [myStakingRewards, setMyStakingRewards] = useState(new Map<number, Transaction[]>());

    const [wallets] = useState(() =>
        context.api.profile().wallets()
            .filter((wallet: any) => wallet.data.COIN === 'ARK' && wallet.data.NETWORK === 'ark.mainnet')
            .map((wallet) => {
                return createWallet(wallet);
            }),
    );

    const [selectedWallet, setSelectedWallet] = useState(() => {
        if (wallets.length) {
            let result = wallets[0];
            const selectedAddress = context.api.store().data().get(Keys.STORE_ADDRESS);
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
        context.api.store().data().set(Keys.STORE_ADDRESS, wallet.address);
        setSelectedWallet(wallet);
    };

    useEffect(() => {
        context.repository.generateStakingRewardReport(selectedWallet).then((reportMap: Map<number, Transaction[]>) => {
            setMyStakingRewards(reportMap);
        }).catch((error) => {
            // TODO handle error
            console.log(error.message);
        });
    }, [selectedWallet]);

    return (
        <div className="flex ml-6 mr-6 flex-row w-full">
            <div className="flext w-full">
                <Header
                    selectedWallet={selectedWallet}
                    wallets={wallets}
                    onWalletSelected={onWalletSelected}/>
                <RewardTable selectedYear={selectedYear} rewardData={myStakingRewards}/>
            </div>
        </div>
    );
};
