import React from 'react';

const {Components} = globalThis.payvo;
const {Button} = Components;

interface DisclaimerViewProps {
    onAccept: () => void,
}

export const DisclaimerView = (props: DisclaimerViewProps) => {
    const title = 'Disclaimer';
    const message = 'The information presented by this plugin has been prepared for informational purposes only, and is not intended to provide, and should not be relied on for ' +
        'tax, legal or accounting advice.';

    return (
        <div className="flex m-auto max-w-lg flex-col justify-center">
            <span className="text-2xl font-bold">{title}</span>
            <span className="mt-4">{message}</span>
            <div className="flex flex-row mt-6 justify-end">
                <Button
                    variant="primary"
                    className="ContactAll__CreateButton justify-end"
                    onClick={props.onAccept}>
                    Accept
                </Button>
            </div>
        </div>
    );
};
