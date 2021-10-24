import { Summary } from '../../Types';
import type { Wallet } from '../../Types';
interface HeaderProps {
    selectedLanguage: string;
    selectedWallet: Wallet;
    wallets: Wallet[];
    onWalletSelected: (Wallet: any) => any;
    isLoading: boolean;
    summary?: Summary;
    onYearSelected: (number: any) => void;
    selectedYear?: number;
    yearOptions?: number[];
    onRetryClicked: () => any;
    onExportClicked: () => any;
    onInfoClicked: () => any;
}
export declare const Header: (props: HeaderProps) => any;
export default Header;
