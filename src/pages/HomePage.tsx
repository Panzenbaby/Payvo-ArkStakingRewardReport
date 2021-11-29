import React, {useState, useEffect} from "react";
import {useWalletContext} from "../provider/WalletProvider";
import {createWallet, ExecutePermission, ExportState, Transaction, Wallet} from "../Types";
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
import {EXPORT_ERROR, EXPORT_ERROR_EMPTY_REPORT, EXPORT_SUCCESS, getString} from "../Strings";

const {Components} = globalThis.payvo;
const {Spinner} = Components;

export const HomePage = () => {
    const context = useWalletContext();

    const [selectedLocale] = useState<string>(context.api.profile().locale());
    const [selectedCurrency] = useState<string>(context.api.profile().exchangeCurrency());

    const [executePermission, setExecutePermission] = useState<ExecutePermission>({canceled: false});

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentError, setError] = useState<Error>();
    const [exportState, setExportState] = useState<ExportState>({state: State.NONE});
    const [selectedYear, setSelectedYear] = useState<number>(() => new Date().getFullYear());
    const [availableYears, setAvailableYears] = useState<number[]>();
    const [summary, setSummary] = useState<number>();
    const [myStakingRewards, setMyStakingRewards] = useState<Transaction[]>(new Map<number, Transaction[]>());
    const [isInfoShown, setInfoShown] = useState<boolean>(false);
    const [disclaimerAccepted, setDisclaimerAccepted] = useState<boolean>(() => {
        return context.api.store().data().get(Keys.DISCLAIMER_ACCEPTED) === true;
    });

    const [wallets] = useState<Wallet[]>(() =>
        context.api.profile().wallets()
            .filter((wallet: any) => wallet.data.COIN === "ARK" && wallet.data.NETWORK === "ark.mainnet")
            .map((wallet) => {
                return createWallet(wallet);
            }),
    );

    const [selectedWallet, setSelectedWallet] = useState<Wallet>(() => {
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
            let amount = 0;
            let tmpSummary = 0;

            let currency = undefined;
            transactions.forEach((transaction) => {
                if (!currency) {
                    currency = transaction.price.currency;
                }

                amount += transaction.amount;
                let value = transaction.amount * transaction.price.close;
                if (!isCrypto(currency)) {
                    value = value / tokenValueFactor;
                }

                tmpSummary += value;
            });

            setSummary({amount: amount, value: tmpSummary, currency: currency});
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

        const newPermission = {canceled: false};
        executePermission.canceled = true;
        setExecutePermission(newPermission);

        context.repository.generateStakingRewardReport(newPermission, selectedCurrency, selectedWallet).then((reportMap: Map<number, Transaction[]>) => {
            if (reportMap) {
                setMyStakingRewards(reportMap);
                setAvailableYears(Array.from(reportMap.keys()));
                setIsLoading(false);

                const keys = Array.from(reportMap.keys());
                if (keys.length > 0) {
                    const year = keys[keys.length - 1];
                    setSelectedYear(year);
                }
            }
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
        console.log("1");
        const report = myStakingRewards.get(selectedYear);

        if (report.length == 0) {
            setExportState({state: State.ERROR, message: getString(selectedLocale, EXPORT_ERROR_EMPTY_REPORT)});
        } else {
            ExportUtils.exportTransactions(context.api, selectedWallet, selectedYear, report, selectedLocale)
                .then((wasSaved) => {
                    if (wasSaved) {
                        setExportState({state: State.SUCCESS, message: getString(selectedLocale, EXPORT_SUCCESS)});
                    } else {
                        setExportState({state: State.ERROR, message: getString(selectedLocale, EXPORT_ERROR)});
                    }
                })
                .catch((error) => setExportState({state: State.ERROR, message: error.message}));
        }
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
                <div>
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
                <div className="flex flex-1 flex-row">
                    <div className="flex flex-1"/>

                    <div className="justify-center">
                        <Header
                            selectedLocale={selectedLocale}
                            selectedCurrency={selectedCurrency}
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
                    <div className="flex flex-1"/>
                </div>
            );
        }
    };

    return renderContent();
};
