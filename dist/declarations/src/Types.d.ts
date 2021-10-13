export interface Wallet {
    address: string;
    alias: string;
    avatar: string;
    balance: number;
    coin: string;
}
export interface Transaction {
    transactionId: string;
    senderPublicKey: string;
    senderName: string;
    amount: number;
    date: number;
    price: Price | undefined;
}
export interface Vote {
    delegateName: string;
    delegatePublicKey: string;
    date: number;
    isDownVote: boolean;
}
export interface Price {
    time: number;
    close: number;
    currency: string;
}
export interface DropDownOption {
    label: string;
    secondaryLabel?: string;
    value: string | number;
    disabled?: boolean;
}
export interface Summary {
    value: number;
    currency: string;
}
export declare const createWallet: (apiWallet: any) => {
    address: any;
    alias: any;
    avatar: any;
    balance: any;
    coin: any;
};
