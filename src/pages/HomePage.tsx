import React, {useState, useEffect} from 'react';
import {useWalletContext} from '../provider/WalletProvider';
import {createWallet, Transaction, Wallet} from '../Types';
import Header from '../components/header/Header';
import {Keys} from '../Keys';
import RewardTable from '../components/table/RewardTable';
import {ErrorView} from '../components/ErrorView';
import {EmptyWalletHint} from '../components/EmptyWalletHint';
import {tokenValueFactor} from '../utils';
import * as ExportUtils from '../ExportUtils';

const {Components} = globalThis.payvo;
const {Spinner} = Components;

export const HomePage = () => {
    const context = useWalletContext();

    const [isLoading, setIsLoading] = useState(false);
    const [currentError, setError] = useState();
    const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());
    const [availableYears, setAvailableYears] = useState();
    const [summary, setSummary] = useState();
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
        const transactions = myStakingRewards.get(selectedYear);
        if (transactions) {
            let tmpSummary = 0;

            let currency = undefined;
            transactions.forEach((transaction) => {
                const value = transaction.amount * transaction.price.close / tokenValueFactor;
                tmpSummary += value;

                if (!currency) {
                    currency = transaction.price.currency;
                }
            });

            setSummary({value: tmpSummary, currency: currency});
        }
    }, [myStakingRewards, selectedYear]);

    const loadTransactions = () => {
        setIsLoading(true);
        context.repository.generateStakingRewardReport(selectedWallet).then((reportMap: Map<number, Transaction[]>) => {
            setMyStakingRewards(reportMap);
            setAvailableYears(Array.from(reportMap.keys()));
            setIsLoading(false);
        }).catch((error) => {
            console.log(error.message);
            console.log(error.message);
            setError(error);
        });
    };

    const onRetryClicked = () => {
        if (!isLoading) {
            setError(undefined);
            loadTransactions();
        }
    };

    const onExportClicked = () => {
        // TODO maybe reduce number of arguments
        ExportUtils.exportTransactions(context.api, selectedWallet, selectedYear, myStakingRewards.get(selectedYear));
    };

    const onInfoClicked = () => {
        console.log('onInfoClicked');
        // TODO
    };

    useEffect(() => {
        loadTransactions();
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

    const renderContent = () => {
        if (!wallets || wallets.length == 0) {
            return <EmptyWalletHint/>;
        } else if (currentError) {
            return <ErrorView error={currentError} onClick={onRetryClicked}/>;
        } else {
            return (
                <div className="flex ml-6 mr-6 flex-row w-full">
                    <div className="flext flex-1 w-full">
                        <Header
                            selectedWallet={selectedWallet}
                            wallets={wallets}
                            onWalletSelected={onWalletSelected}
                            isLoading={isLoading}
                            summary={summary}
                            selectedYear={selectedYear}
                            yearOptions={availableYears}
                            onYearSelected={(year) => setSelectedYear(year)}
                            onRetryClicked={onRetryClicked}
                            onExportClicked={onExportClicked}
                            onInfoClicked={onInfoClicked}/>

                        {renderTable()}
                    </div>
                </div>
            );
        }
    };

    return renderContent();
};
