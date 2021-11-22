import {State} from "../enums/State";
import React, {useEffect} from "react";
import {useWalletContext} from "../provider/WalletProvider";

const {Components} = globalThis.payvo;
const {Alert} = Components;

const TIMEOUT = 5000;

interface ToastProps {
    state: State,
    message: string,
    onDismiss: () => any
}

export const Toast = (props: ToastProps) => {
    const context = useWalletContext();

    useEffect(() => {
        if (props.state) {
            context.api.timers().setTimeout(() => {
                props.onDismiss();
            }, TIMEOUT);
        }
    }, [props.state]);

    if (props.state !== State.NONE) {
        let variant = "success";
        if (props.state == State.ERROR) {
            variant = "danger";
        }
        return (
            <Alert
                className="absolute bg-theme-secondary-800"
                variant={variant}
                title={props.message}/>
        );
    }

    return null;
};
