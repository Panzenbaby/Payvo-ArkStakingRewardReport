import React from "react";
import Repository from "../repository/Repository";
interface WalletProviderProps {
    api: any;
    repository: Repository;
    children: React.ReactNode;
}
export declare const WalletProvider: (props: WalletProviderProps) => any;
export declare const useWalletContext: () => any;
export {};
