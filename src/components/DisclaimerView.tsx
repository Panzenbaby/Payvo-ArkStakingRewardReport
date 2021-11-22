import React from "react";
import {TranslatedText} from "./TranslatedText";
import {ACCEPT, DISCLAIMER_NOTE, DISCLAIMER_TITLE} from "../Strings";

const {Components} = globalThis.payvo;
const {Button} = Components;

interface DisclaimerViewProps {
    onAccept: () => void,
}

export const DisclaimerView = (props: DisclaimerViewProps) => {

    return (
        <div className="flex m-auto max-w-lg flex-col justify-center">
            <span className="text-2xl font-bold">
                <TranslatedText stringKey={DISCLAIMER_TITLE}/>
            </span>
            <span className="mt-4">
                <TranslatedText stringKey={DISCLAIMER_NOTE}/>
            </span>
            <div className="flex flex-row mt-6 justify-end">
                <Button
                    variant="primary"
                    className="ContactAll__CreateButton justify-end"
                    onClick={props.onAccept}>
                    <TranslatedText stringKey={ACCEPT}/>
                </Button>
            </div>
        </div>
    );
};
