import React from 'react';

const {Components} = globalThis.payvo;
const {Modal, Link} = Components;

interface InfoModalProps {
    isOpen: boolean,
    onClose: () => void,
}

export const InfoModal = (props: InfoModalProps) => {
    const apiUrl = 'https://min-api.cryptocompare.com';

    return (
        <Modal
            isOpen={props.isOpen}
            title={'Info'}
            onClose={props.onClose}
        >
            <span>This plugin uses the public REST Api from </span>
            <Link to={apiUrl} showExternalIcon={false} isExternal>{apiUrl}</Link>
            <span> to get the price of each transaction. The displayed price is the close price of the day the transaction has been proceeded.</span>
        </Modal>
    );
};
