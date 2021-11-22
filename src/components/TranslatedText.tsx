import React from "react";
import {useWalletContext} from "../provider/WalletProvider";
import {getString} from "../Strings";

interface TranslatedTextProps {
    stringKey: string;
}

export const TranslatedText = (props: TranslatedTextProps) => {
    const context = useWalletContext();

    const locale = context.api.profile().locale();
    const text = getString(locale, props.stringKey);

    return (<div>{text}</div>);
};
