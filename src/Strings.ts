export const NO_WALLET_MESSAGE = "NO_WALLET_MESSAGE";
export const WALLET_IMPORT = "WALLET_IMPORT";
export const WALLET_CREATE = "WALLET_CREATE";
export const PERIOD = "PERIOD";
export const RECEIVED_STAKING_REWARDS = "RECEIVED_STAKING_REWARDS";

export const EXPORT_SUCCESS = "EXPORT_SUCCESS";
export const EXPORT_ERROR = "EXPORT_ERROR";
export const EXPORT_ERROR_EMPTY_REPORT = "EXPORT_ERROR_EMPTY_REPORT";

export const TOOLTIP_EXPORT = "TOOLTIP_EXPORT";
export const TOOLTIP_RELOAD = "TOOLTIP_RELOAD";

export const DISCLAIMER_TITLE = "DISCLAIMER_TITLE";
export const DISCLAIMER_NOTE = "DISCLAIMER_NOTE";

export const INFO = "INFO";
export const INFO_MODAL_PRICES_ONE = "INFO_MODAL_PRICES_ONE";
export const INFO_MODAL_PRICES_TWO = "INFO_MODAL_PRICES_TWO";

export const TABLE_HEADER_AMOUNT = "TABLE_HEADER_AMOUNT";
export const TABLE_HEADER_VALUE = "TABLE_HEADER_VALUE";
export const TABLE_HEADER_DATE = "TABLE_HEADER_DATE";
export const TABLE_HEADER_FROM = "TABLE_HEADER_FROM";
export const TABLE_HEADER_TRANSACTION = "TABLE_HEADER_TRANSACTION";
export const EXPORT_HEADER_PRICE = "EXPORT_HEADER_PRICE";

export const TABLE_EMPTY_MESSAGE = "TABLE_EMPTY_MESSAGE";

export const ACCEPT = "ACCEPT";
export const RETRY = "RETRY";
export const ERROR_TITLE = "ERROR_TITLE";

const en = {
    NO_WALLET_MESSAGE: "Your profile has no ARK wallet so far. Please import a wallet or create a new one.",
    WALLET_IMPORT: "Import",
    WALLET_CREATE: "Create",
    PERIOD: "Period",
    RECEIVED_STAKING_REWARDS: "Received Staking Rewards",
    EXPORT_SUCCESS: "Your report was saved.",
    EXPORT_ERROR: "Your report was not saved.",
    EXPORT_ERROR_EMPTY_REPORT: "You can not export an empty report.",
    TOOLTIP_EXPORT: "Export",
    TOOLTIP_RELOAD: "Reload",
    DISCLAIMER_TITLE: "Disclaimer",
    // eslint-disable-next-line max-len
    DISCLAIMER_NOTE: "The information presented by this plugin has been prepared for informational purposes only, and is not intended to provide, and should not be relied on for tax, legal or accounting advice.",
    INFO: "Info",
    INFO_MODAL_PRICES_ONE: "This plugin uses the public REST Api from",
    INFO_MODAL_PRICES_TWO: "to get the price of each transaction. The displayed price is the close price of the day the transaction has been proceeded.",
    TABLE_HEADER_AMOUNT: "Amount",
    TABLE_HEADER_VALUE: "Value",
    TABLE_HEADER_DATE: "Date",
    TABLE_HEADER_FROM: "From",
    TABLE_HEADER_TRANSACTION: "Transaction ID",
    TABLE_EMPTY_MESSAGE: "The transactions found for the selected period.",
    EXPORT_HEADER_PRICE: "Close Price",
    ACCEPT: "Accept",
    RETRY: "Retry",
    ERROR_TITLE: "An error occurred",
};

const de = {
    NO_WALLET_MESSAGE: "In deinem Profil ist noch keine ARK Wallet hinterlegt. Bitte füge eine Wallet hinzu oder erstelle eine neue.",
    WALLET_IMPORT: "Importieren",
    WALLET_CREATE: "Neu erstellen",
    PERIOD: "Zeitraum",
    RECEIVED_STAKING_REWARDS: "Erhaltene Staking Rewards",
    TOOLTIP_EXPORT: "Exportieren",
    TOOLTIP_RELOAD: "Neu laden",
    EXPORT_SUCCESS: "Dein Bericht wurde gespeichert.",
    EXPORT_ERROR: "Dein Bericht wurde nicht gespeichert.",
    EXPORT_ERROR_EMPTY_REPORT: "Du kannst keinen leeren Bericht exportieren.",
    DISCLAIMER_TITLE: "Haftungsausschluss",
    // eslint-disable-next-line max-len
    DISCLAIMER_NOTE: "Die von diesem Plugin präsentierten Informationen wurden nur zu Informationszwecken erstellt und dienen nicht der Bereitstellung von Steuer-, Rechts- oder Buchhaltungsberatung und sollten daher nicht als Grundlage dienen.",
    INFO: "Info",
    INFO_MODAL_PRICES_ONE: "Dieses Plugin nutzt die REST API von",
    // eslint-disable-next-line max-len
    INFO_MODAL_PRICES_TWO: "um den Preis einer jeden Transaktion zu laden. Bei den angezeigten Preisen handelt es sich um den Schlusskurs des Tages an dem die Transaktion durchgeführt wurde.",
    TABLE_HEADER_AMOUNT: "Anzahl",
    TABLE_HEADER_VALUE: "Wert",
    TABLE_HEADER_DATE: "Datum",
    TABLE_HEADER_FROM: "Von",
    TABLE_HEADER_TRANSACTION: "Transaktions ID",
    TABLE_EMPTY_MESSAGE: "Keine Transaktionen für den ausgewählten Zeitraum gefunden.",
    EXPORT_HEADER_PRICE: "Schlusspreis",
    ACCEPT: "Akzeptieren",
    RETRY: "Erneut versuchen",
    ERROR_TITLE: "Es ist ein Fehler aufgetreten",
};

export const getString = (locale: string, key: string): string => {
    let strings;
    switch (locale) {
    case "de-DE":
        strings = de;
        break;
    default:
        strings = en;
        break;
    }

    const string = strings[key];
    if (string) {
        return string;
    }

    return en[key];
};
