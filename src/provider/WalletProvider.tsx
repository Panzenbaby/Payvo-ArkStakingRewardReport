import React from "react";
import Repository from "../repository/Repository";

interface WalletProviderProps {
    api: any;
    repository: Repository;
    children: React.ReactNode;
}

const WalletContext = React.createContext({
    api: undefined,
    repository: undefined,
});

export const WalletProvider = (props: WalletProviderProps) => (
    <WalletContext.Provider
        value={{api: props.api, repository: props.repository}}>
        {props.children}
    </WalletContext.Provider>
);

export const useWalletContext = () => React.useContext(WalletContext);
