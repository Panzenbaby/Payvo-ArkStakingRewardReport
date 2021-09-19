import React from 'react';

import WalletSelector from './WalletSelector';
import type {Wallet} from '../../Types';

const {Components} = globalThis.payvo;
const {Card} = Components;

interface HeaderProps {
    selectedWallet: Wallet,
    wallets: Wallet[],
    onWalletSelected: (Wallet) => any
}

export const Header = (props: HeaderProps) => {
    return (
        <Card>
            <WalletSelector
                selectedWallet={props.selectedWallet}
                wallets={props.wallets}
                onWalletSelected={props.onWalletSelected}/>
        </Card>
    );
};

export default Header;
