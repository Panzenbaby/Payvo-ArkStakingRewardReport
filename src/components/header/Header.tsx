import React, {useState, useEffect} from 'react';
import {DropDownOption, Summary} from '../../Types';

import WalletItem from './WalletItem';
import type {Wallet} from '../../Types';
import {formatCurrency} from '../../utils';

const {Components} = globalThis.payvo;
const {Card, Button, Tooltip} = Components;

interface HeaderProps {
    selectedLanguage: string,
    selectedWallet: Wallet;
    wallets: Wallet[];
    onWalletSelected: (Wallet) => any;
    isLoading: boolean;
    summary?: Summary;
    onYearSelected: (number) => void;
    selectedYear?: number;
    yearOptions?: number[];
    onRetryClicked: () => any;
    onExportClicked: () => any;
    onInfoClicked: () => any;
}

export const Header = (props: HeaderProps) => {
    const [selectedYear, setSelectedYear] = useState(props.selectedYear);

    const [walletActions, setWalletActions] = useState();
    const [yearOptions, setYearOptions] = useState();

    useEffect(() => {
        const options = props.wallets.map((wallet: Wallet) => {
            return {label: wallet.alias, secondaryLabel: wallet.address, value: wallet};
        });
        setWalletActions(options);
    }, [props.wallets]);

    useEffect(() => {
        if (props.yearOptions && !props.isLoading) {
            const options = props.yearOptions.map((year) => {
                return {label: year, value: year};
            });
            setYearOptions(options);
        } else {
            setYearOptions(undefined);
        }
    }, [props.yearOptions, props.isLoading]);

    const onYearSelected = (selection: DropDownOption) => {
        const year = selection.value;
        setSelectedYear(year);
        props.onYearSelected(year);
    };

    const onWalletSelected = (selection: DropDownOption) => {
        const wallet = selection.value;
        props.onWalletSelected(wallet);
    };

    const renderSummary = () => {
        if (props.isLoading || !props.summary) {
            return undefined;
        }

        let summary = 'NaN';
        if (props.summary && props.summary.value && props.summary.currency) {
            summary = formatCurrency(props.summary.value, props.summary.currency);
        }

        return (
            <Card className="flex ml-4 mr-4">
                <div className="flex flex-col">
                    <span className="font-semibold text-theme-secondary-text text-sm">
                            Received Staking Rewards
                    </span>
                    <span className="font-bold text-theme-primary-600">
                        {summary}
                    </span>
                </div>
            </Card>
        );
    };

    const renderButtons = () => {
        if (props.isLoading) {
            return undefined;
        }

        return (
            <Card className="flex flex-end mr-4">
                <div className="flex flex-row">
                    <Tooltip content="Retry" className="mb-1">
                        <Button
                            className="flex flex-1 ml-4 mr-2"
                            icon="ArrowRotateLeft"
                            onClick={props.onRetryClicked}/>
                    </Tooltip>

                    <Tooltip content="Export" className="mb-1">
                        <Button
                            className="flex flex-1 ml-2 mr-2"
                            icon="ArrowUpTurnBracket"
                            onClick={props.onExportClicked}/>
                    </Tooltip>

                    <Tooltip content="Info" className="mb-1">
                        <Button
                            className="flex flex-1 ml-2 mr-4"
                            icon="CircleInfo"
                            onClick={props.onInfoClicked}/>
                    </Tooltip>
                </div>
            </Card>
        );
    };

    return (
        <div className="flex flex-col">
            <div className="flex flex-row">
                <Card
                    className="flex ml-4"
                    actions={walletActions}
                    onSelect={onWalletSelected}>

                    <WalletItem wallet={props.selectedWallet} language={props.selectedLanguage}/>
                </Card>

                <Card
                    className="flex ml-4"
                    actions={yearOptions}
                    onSelect={onYearSelected}>

                    <div className="flex flex-col">
                        <span className="flex flex-row justify-center font-semibold text-theme-secondary-text text-sm">Period</span>
                        <span className="align-center ml-4 mr-4 text-theme-secondary-700 font-bold">
                            {selectedYear}
                        </span>
                    </div>
                </Card>

                <div className="flex flex-row flex-1 justify-end">
                    {renderSummary()}
                    {renderButtons()}
                </div>
            </div>

            <div className="flex full-w mt-4 mb-4 pt-0.5 bg-theme-secondary-800"/>
        </div>
    );
};

export default Header;
