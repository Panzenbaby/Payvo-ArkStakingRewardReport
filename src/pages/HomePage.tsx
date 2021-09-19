import React, {useState, useEffect} from 'react';
import {useWalletContext} from '../provider/WalletProvider';
import {createWallet, Transaction, Wallet} from '../Types';
import Header from '../components/header/Header';
import {Keys} from '../Keys';
import RewardTable from '../components/table/RewardTable';

const {Components} = globalThis.payvo;
const {Spinner} = Components;

export const HomePage = () => {
    const context = useWalletContext();

    const [isLoading, setIsLoading] = useState(false);
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
        context.api.store().persist();
        setSelectedWallet(wallet);
    };

    useEffect(() => {
        setIsLoading(true);
        context.repository.generateStakingRewardReport(selectedWallet).then((reportMap: Map<number, Transaction[]>) => {
            setMyStakingRewards(reportMap);
            setIsLoading(false);
        }).catch((error) => {
            // TODO handle error
            console.log(error.message);
        });
    }, [selectedWallet]);

    const renderTable = () => {
        if (isLoading) {
            return (
                <div className="flex h-full justify-center items-center">
                    <Spinner/>
                </div>
            );
        } else {
            return (
                <RewardTable wallet={selectedWallet} selectedYear={selectedYear} rewardData={myStakingRewards}/>
            );
        }
    };

    return (
        <div className="flex ml-6 mr-6 flex-row w-full">
            <div className="flext flex-1 w-full">
                <Header
                    selectedWallet={selectedWallet}
                    wallets={wallets}
                    onWalletSelected={onWalletSelected}/>

                {renderTable()}
            </div>
        </div>
    );
};
