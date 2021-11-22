import React, {useState, useEffect} from "react";
import {useWalletContext} from "../provider/WalletProvider";
import {createWallet, ExecutePermission, Transaction, Wallet} from "../Types";
import Header from "../components/header/Header";
import {Keys} from "../Keys";
import RewardTable from "../components/table/RewardTable";
import {ErrorView} from "../components/ErrorView";
import {EmptyWalletHint} from "../components/EmptyWalletHint";
import {isCrypto, tokenValueFactor} from "../utils";
import * as ExportUtils from "../ExportUtils";
import {InfoModal} from "../components/modals/InfoModal";
import {DisclaimerView} from "../components/DisclaimerView";
import {State} from "../enums/State";
import {Toast} from "../components/Toast";
import {EXPORT_ERROR, EXPORT_SUCCESS, getString} from "../Strings";

const {Components} = globalThis.payvo;
const {Spinner} = Components;

export const HomePage = () => {
    let executePermission: ExecutePermission = {canceled: false};
    const context = useWalletContext();

    const [selectedLocale] = useState(context.api.profile().locale());
    const [selectedCurrency] = useState(context.api.profile().exchangeCurrency());

    const [isLoading, setIsLoading] = useState(false);
    const [currentError, setError] = useState();
    const [exportState, setExportState] = useState({state: State.NONE});
    const [selectedYear, setSelectedYear] = useState(() => new Date().getFullYear());
    const [availableYears, setAvailableYears] = useState();
    const [summary, setSummary] = useState();
    const [myStakingRewards, setMyStakingRewards] = useState(new Map<number, Transaction[]>());
    const [isInfoShown, setInfoShown] = useState(false);
    const [disclaimerAccepted, setDisclaimerAccepted] = useState(() => {
        return context.api.store().data().get(Keys.DISCLAIMER_ACCEPTED) === true;
    });

    const [wallets] = useState(() =>
        context.api.profile().wallets()
            .filter((wallet: any) => wallet.data.COIN === "ARK" && wallet.data.NETWORK === "ark.mainnet")
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

    useEffect(() => {
        const transactions = myStakingRewards.get(selectedYear);
        if (transactions) {
            let tmpSummary = 0;

            let currency = undefined;
            transactions.forEach((transaction) => {
                if (!currency) {
                    currency = transaction.price.currency;
                }
                let value = transaction.amount * transaction.price.close;
                if (!isCrypto(currency)) {
                    value = value / tokenValueFactor;
                }

                tmpSummary += value;
            });

            setSummary({value: tmpSummary, currency: currency});
        }
    }, [myStakingRewards, selectedYear]);

    useEffect(() => {
        loadTransactions();
    }, [selectedWallet]);

    const onWalletSelected = (wallet: Wallet) => {
        context.api.store().data().set(Keys.STORE_ADDRESS, wallet.address);
        context.api.store().persist();
        setSelectedWallet(wallet);
    };

    const onDisclaimerAccepted = () => {
        setDisclaimerAccepted(true);
        context.api.store().data().set(Keys.DISCLAIMER_ACCEPTED, true);
    };

    const loadTransactions = () => {
        setIsLoading(true);

        executePermission.canceled = true;
        executePermission = {canceled: false};
        context.repository.generateStakingRewardReport(executePermission, selectedCurrency, selectedWallet).then((reportMap: Map<number, Transaction[]>) => {
            setMyStakingRewards(reportMap);
            setAvailableYears(Array.from(reportMap.keys()));
            setIsLoading(false);
        }).catch((error) => {
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
        ExportUtils.exportTransactions(context.api, selectedWallet, selectedYear, myStakingRewards.get(selectedYear), selectedLocale)
            .then((wasSaved) => {
                if (wasSaved) {
                    setExportState({state: State.SUCCESS, message: getString(selectedLocale, EXPORT_SUCCESS)});
                } else {
                    setExportState({state: State.ERROR, message: getString(selectedLocale, EXPORT_ERROR)});
                }
            })
            .catch((error) => setExportState({state: State.ERROR, message: error.message}));
    };

    const onInfoClicked = () => {
        setInfoShown(true);
    };

    const renderTable = () => {
        if (isLoading) {
            return (
                <div className="flex h-full justify-center items-center">
                    <Spinner/>
                </div>
            );
        } else {
            return (
                <div className="flex">
                    <RewardTable
                        locale={selectedLocale}
                        wallet={selectedWallet}
                        selectedYear={selectedYear}
                        rewardData={myStakingRewards}/>

                    <Toast
                        state={exportState.state}
                        message={exportState.message}
                        onDismiss={() => setExportState({state: State.NONE})}/>
                </div>
            );
        }
    };

    const renderContent = () => {
        if (!disclaimerAccepted) {
            return (
                <DisclaimerView
                    onAccept={onDisclaimerAccepted}/>
            );
        } else if (!wallets || wallets.length == 0) {
            return <EmptyWalletHint/>;
        } else if (currentError) {
            return <ErrorView error={currentError} onClick={onRetryClicked}/>;
        } else {
            return (
                <div className="flex ml-6 mr-6 flex-row w-full">
                    <div className="flext flex-1 w-full">
                        <Header
                            selectedLocale={selectedLocale}
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

                        <InfoModal
                            isOpen={isInfoShown}
                            onClose={() => setInfoShown(false)}
                            locale={selectedLocale}
                        />
                    </div>
                </div>
            );
        }
    };

    return renderContent();
};
