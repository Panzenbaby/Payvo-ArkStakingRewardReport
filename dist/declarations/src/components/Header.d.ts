import type { Wallet } from '../types/Types';
interface HeaderProps {
    selectedWallet: Wallet;
    wallets: Wallet[];
    onWalletSelected: (Wallet: any) => any;
}
export declare const Header: (props: HeaderProps) => any;
export {};
