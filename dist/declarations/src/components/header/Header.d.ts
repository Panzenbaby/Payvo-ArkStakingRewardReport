import type { Wallet } from '../../Types';
interface HeaderProps {
    selectedWallet: Wallet;
    wallets: Wallet[];
    onWalletSelected: (Wallet: any) => any;
}
export declare const Header: (props: HeaderProps) => any;
export default Header;
