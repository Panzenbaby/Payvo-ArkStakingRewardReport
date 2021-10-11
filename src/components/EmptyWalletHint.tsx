import React from 'react';
import {useWalletContext} from '../provider/WalletProvider';

const {Components} = globalThis.payvo;
const {Button, Link} = Components;

interface EmptyWalletHintProps {

}

export const EmptyWalletHint = (props: EmptyWalletHintProps) => {
    const context = useWalletContext();

    return (
        <div className="flex flex-1 items-center">
            <div className="flex flex-1 flex-col items-center">
                <span>Your profile has no ARK wallet so far. Please import a wallet or create a new one.</span>

                <div className="mt-4 flex-row justify-center items-stretch">
                    <Link className="mr-3" to={`/profiles/${context.api.profile().id()}/wallets/import`}>
                        <Button>Import</Button>
                    </Link>

                    <Link className="ml-3" to={`/profiles/${context.api.profile().id()}/wallets/create`}>
                        <Button variant="secondary">
                            Create
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};
