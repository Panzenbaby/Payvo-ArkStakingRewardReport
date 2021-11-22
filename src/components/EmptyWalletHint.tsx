import React from "react";
import {useWalletContext} from "../provider/WalletProvider";
import {TranslatedText} from "./TranslatedText";
import {NO_WALLET_MESSAGE, WALLET_CREATE, WALLET_IMPORT} from "../Strings";

const {Components} = globalThis.payvo;
const {Button, Link} = Components;

interface EmptyWalletHintProps {

}

export const EmptyWalletHint = (props: EmptyWalletHintProps) => {
    const context = useWalletContext();

    return (
        <div className="flex flex-1 items-center">
            <div className="flex flex-1 flex-col items-center">
                <TranslatedText stringKey={NO_WALLET_MESSAGE}/>

                <div className="mt-4 flex-row justify-center items-stretch">
                    <Link className="mr-3" to={`/profiles/${context.api.profile().id()}/wallets/import`}>
                        <Button>
                            <TranslatedText stringKey={WALLET_IMPORT}/>
                        </Button>
                    </Link>

                    <Link className="ml-3" to={`/profiles/${context.api.profile().id()}/wallets/create`}>
                        <Button variant="secondary">
                            <TranslatedText stringKey={WALLET_CREATE}/>
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
