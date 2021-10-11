import React, {useState, useEffect} from 'react';
import {DropDownOption, Transaction} from '../../Types';

import WalletSelector from './WalletSelector';
import type {Wallet} from '../../Types';

const {Components} = globalThis.payvo;
const {Card} = Components;

interface HeaderProps {
    selectedWallet: Wallet,
    wallets: Wallet[],
    onWalletSelected: (Wallet) => any
    onYearSelected: (number) => void
    selectedYear?: number
    yearOptions?: number[]
}

export const Header = (props: HeaderProps) => {
    const [selectedYear, setSelectedYear] = useState(props.selectedYear);
    const [yearOptions, setYearOptions] = useState();

    useEffect(() => {
        if (props.yearOptions) {
            const options = props.yearOptions.map((year) => {
                return {label: year, value: year};
            });
            setYearOptions(options);
        }
    }, [props.yearOptions]);

    const onYearSelected = (selection: DropDownOption) => {
        const year = selection.value;
        setSelectedYear(year);
        props.onYearSelected(year);
    };

    const renderYearSelector = () => {
        return (
            <Card
                className="ml-4"
                actions={yearOptions}
                onSelect={onYearSelected}>
                <span className="ml-4 mr-4 mt-2 mb-2">
                    {selectedYear}
                </span>
            </Card>
        );
    };

    return (
        <Card>
            <div className="flex flex-1 flex-row">
                <Card>
                    <WalletSelector
                        selectedWallet={props.selectedWallet}
                        wallets={props.wallets}
                        onWalletSelected={props.onWalletSelected}/>
                </Card>

                {renderYearSelector()}
            </div>
        </Card>
    );
};

export default Header;
