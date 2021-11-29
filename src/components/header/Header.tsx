import React, {useState, useEffect} from "react";
import {DropDownOption, Summary} from "../../Types";

import WalletItem from "./WalletItem";
import type {Wallet} from "../../Types";
import {formatCurrency} from "../../utils";
import {TranslatedText} from "../TranslatedText";
import {getString, INFO, PERIOD, RECEIVED_STAKING_REWARDS, TOOLTIP_EXPORT, TOOLTIP_RELOAD} from "../../Strings";

const {Components} = globalThis.payvo;
const {Card, Button, Tooltip} = Components;

interface HeaderProps {
    selectedLocale: string,
    selectedCurrency: string,
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
        props.onYearSelected(year);
    };

    const onWalletSelected = (selection: DropDownOption) => {
        const wallet = selection.value;
        props.onWalletSelected(wallet);
    };

    const renderSummary = () => {
        let value = 0;
        if (props.summary && props.summary.value) {
            value = props.summary.value;
        }
        const summary = formatCurrency(value, props.selectedCurrency);

        let amountTip = "";
        if (props.summary && props.summary.amount) {
            amountTip = formatCurrency(props.summary.amount, props.selectedWallet.coin);
        }

        return (
            <Card className="flex ml-4 mr-4">
                <div className="flex flex-col">
                    <span className="font-semibold text-theme-secondary-text text-sm">
                        <TranslatedText stringKey={RECEIVED_STAKING_REWARDS}/>
                    </span>
                    <Tooltip content={amountTip}>
                        <span className="font-bold text-theme-primary-600">
                            {summary}
                        </span>
                    </Tooltip>
                </div>
            </Card>
        );
    };

    const renderButtons = () => {
        return (
            <Card className="flex flex-end">
                <div className="flex flex-row">
                    <Tooltip content={getString(props.selectedLocale, TOOLTIP_RELOAD)} className="mb-1">
                        <Button
                            className="flex flex-1 ml-4 mr-2"
                            icon="ArrowRotateLeft"
                            onClick={props.onRetryClicked}
                            disabled={props.isLoading}/>
                    </Tooltip>

                    <Tooltip content={getString(props.selectedLocale, TOOLTIP_EXPORT)} className="mb-1">
                        <Button
                            className="flex flex-1 ml-2 mr-2"
                            icon="ArrowUpTurnBracket"
                            onClick={props.onExportClicked}
                            disabled={props.isLoading}/>
                    </Tooltip>

                    <Tooltip content={getString(props.selectedLocale, INFO)} className="mb-1">
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
                    actions={walletActions}
                    onSelect={onWalletSelected}>

                    <WalletItem wallet={props.selectedWallet} locale={props.selectedLocale}/>
                </Card>

                <Card
                    className="flex ml-4"
                    actions={yearOptions}
                    onSelect={onYearSelected}>

                    <div className="flex flex-col">
                        <span className="flex flex-row justify-center font-semibold text-theme-secondary-text text-sm">
                            <TranslatedText stringKey={PERIOD}/>
                        </span>
                        <span className="align-center ml-4 mr-4 text-theme-secondary-700 font-bold">
                            {props.selectedYear}
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
