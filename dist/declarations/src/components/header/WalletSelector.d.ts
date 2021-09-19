import type { Wallet } from '../../Types';
interface WalletSelectorProps {
    selectedWallet: Wallet;
    wallets: Wallet[];
    onWalletSelected: (Wallet: any) => any;
}
export declare const WalletSelector: (props: WalletSelectorProps) => any;
export default WalletSelector;
