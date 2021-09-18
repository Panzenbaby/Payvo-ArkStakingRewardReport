
export interface Wallet {
    address: string;
    alias: string;
    avatar: string;
    balance: number;
    coin: string;
}

export const createWallet = (apiWallet) => {
    return {
        address: apiWallet.data.ADDRESS,
        alias: apiWallet.settings.ALIAS,
        avatar: apiWallet.settings.AVATAR,
        balance: apiWallet.data.BALANCE.available,
        coin: apiWallet.data.COIN,
    };
};
