import React from "react";
import {getString, INFO, INFO_MODAL_PRICES_ONE, INFO_MODAL_PRICES_TWO} from "../../Strings";
import {TranslatedText} from "../TranslatedText";

const {Components} = globalThis.payvo;
const {Modal, Link} = Components;

interface InfoModalProps {
    isOpen: boolean,
    onClose: () => void,
    locale: string,
}

export const InfoModal = (props: InfoModalProps) => {
    const apiUrl = "https://min-api.cryptocompare.com";

    return (
        <Modal
            isOpen={props.isOpen}
            title={getString(props.locale, INFO)}
            onClose={props.onClose}
        >
            <TranslatedText stringKey={INFO_MODAL_PRICES_ONE}/>
            <Link to={apiUrl} showExternalIcon={false} isExternal>{apiUrl}</Link>
            <TranslatedText stringKey={INFO_MODAL_PRICES_TWO}/>
        </Modal>
    );
};
