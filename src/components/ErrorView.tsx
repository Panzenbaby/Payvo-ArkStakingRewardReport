import React from 'react';

const {Components} = globalThis.payvo;
const {Button} = Components;

interface ErrorViewProps {
    error: Error,
    onClick: () => void
}

export const ErrorView = (props: ErrorViewProps) => {
    return (
        <div className="relative flex flex-col flex-1 justify-center items-center rounded-lg bg-theme-feature">
            <span className="font-bold">
                    Error
            </span>

            <span className="font-bold text-red mt-6 mb-6">
                {props.error.message}
            </span>

            <Button
                variant="danger"
                className="ContactAll__CreateButton justify-end"
                onClick={props.onClick}>
                    Retry
            </Button>
        </div>
    );
};
