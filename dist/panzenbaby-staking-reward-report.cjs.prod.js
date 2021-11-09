'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

const WalletContext = /*#__PURE__*/React__default["default"].createContext({
  api: undefined,
  repository: undefined
});
const WalletProvider = props => /*#__PURE__*/React__default["default"].createElement(WalletContext.Provider, {
  value: {
    api: props.api,
    repository: props.repository
  }
}, props.children);
const useWalletContext = () => React__default["default"].useContext(WalletContext);

const createWallet = apiWallet => {
  return {
    address: apiWallet.data.ADDRESS,
    alias: apiWallet.settings.ALIAS,
    avatar: apiWallet.settings.AVATAR,
    balance: apiWallet.data.BALANCE.available,
    coin: apiWallet.data.COIN
  };
};

const Avatar = ({
  imageData
}) => /*#__PURE__*/React__default["default"].createElement("div", {
  className: "h-11 w-11 flex-shrink-0 overflow-hidden rounded-full"
}, /*#__PURE__*/React__default["default"].createElement("img", {
  src: `data:image/svg+xml;utf8,${imageData}`
}));

const tokenValueFactor = 1e8;
const secondsOfDay = 24 * 60 * 60;
const isCrypto = currency => {
  return ['ARK', 'BTC', 'ETH', 'LTC'].includes(currency);
};
const formatCurrency = (amount, currency, language = 'en') => {
  const asCrypto = isCrypto(currency);

  if (asCrypto) {
    amount = amount / tokenValueFactor;
  }

  return amount.toLocaleString(language, {
    style: 'currency',
    currencyDisplay: 'code',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: asCrypto ? 8 : 2
  });
};
const getDaysSince = fromTime => {
  const endDate = Date.now() / 1000;
  return Math.round(Math.abs((fromTime - endDate) / secondsOfDay));
};
const buildExportRow = (transaction, token, language) => {
  const amount = getAmountValue(transaction, token, language);
  const value = getPriceValue(transaction, language);
  const transactionDate = new Date(transaction.date * 1000);
  const dateTime = transactionDate.toLocaleDateString() + ' ' + transactionDate.toLocaleTimeString();
  const transactionId = transaction.transactionId;
  return `${amount} | ${value} | ${dateTime} | ${transactionId}`;
};

const getPriceValue = (transaction, language) => {
  let closePrice = undefined;

  if (transaction.price && transaction.price.close) {
    closePrice = transaction.price.close;
  }

  if (!closePrice) {
    return 'NaN';
  }

  let tokens = transaction.amount;
  const currency = transaction.price.currency;

  if (!isCrypto(currency)) {
    tokens = tokens / tokenValueFactor;
  }

  const value = tokens * closePrice;
  return formatCurrency(value, currency, language);
};

const getAmountValue = (transaction, token, language) => {
  if (!transaction.amount) {
    return 'NaN';
  }

  const value = transaction.amount;
  return formatCurrency(value, token, language);
};

const WalletItem = props => {
  const address = props.wallet.address;
  const alias = props.wallet.alias;
  const avatar = props.wallet.avatar;
  const balance = props.wallet.balance;
  const coin = props.wallet.coin;
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "flex items-center space-x-4 py-4"
  }, /*#__PURE__*/React__default["default"].createElement(Avatar, {
    imageData: avatar
  }), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "flex flex-col flex-1 overflow-hidden whitespace-nowrap no-ligatures"
  }, /*#__PURE__*/React__default["default"].createElement("span", {
    className: "font-semibold text-theme-secondary-text text-sm"
  }, alias), /*#__PURE__*/React__default["default"].createElement("span", {
    className: "truncate text-theme-secondary-500 dark:text-theme-secondary-700 font-semibold"
  }, address), /*#__PURE__*/React__default["default"].createElement("span", {
    className: "truncate text-theme-secondary-500 dark:text-theme-secondary-700 font-semibold"
  }, formatCurrency(balance, coin, props.language))));
};

const {
  Components: Components$8
} = globalThis.payvo;
const {
  Card,
  Button: Button$3,
  Tooltip: Tooltip$1
} = Components$8;
const Header = props => {
  const [selectedYear, setSelectedYear] = React.useState(props.selectedYear);
  const [walletActions, setWalletActions] = React.useState();
  const [yearOptions, setYearOptions] = React.useState();
  React.useEffect(() => {
    const options = props.wallets.map(wallet => {
      return {
        label: wallet.alias,
        secondaryLabel: wallet.address,
        value: wallet
      };
    });
    setWalletActions(options);
  }, [props.wallets]);
  React.useEffect(() => {
    if (props.yearOptions && !props.isLoading) {
      const options = props.yearOptions.map(year => {
        return {
          label: year,
          value: year
        };
      });
      setYearOptions(options);
    } else {
      setYearOptions(undefined);
    }
  }, [props.yearOptions, props.isLoading]);

  const onYearSelected = selection => {
    const year = selection.value;
    setSelectedYear(year);
    props.onYearSelected(year);
  };

  const onWalletSelected = selection => {
    const wallet = selection.value;
    props.onWalletSelected(wallet);
  };

  const renderSummary = () => {
    if (props.isLoading || !props.summary) {
      return undefined;
    }

    let summary = 'NaN';

    if (props.summary && props.summary.value && props.summary.currency) {
      summary = formatCurrency(props.summary.value, props.summary.currency);
    }

    return /*#__PURE__*/React__default["default"].createElement(Card, {
      className: "flex ml-4 mr-4"
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "flex flex-col"
    }, /*#__PURE__*/React__default["default"].createElement("span", {
      className: "font-semibold text-theme-secondary-text text-sm"
    }, "Received Staking Rewards"), /*#__PURE__*/React__default["default"].createElement("span", {
      className: "font-bold text-theme-primary-600"
    }, summary)));
  };

  const renderButtons = () => {
    if (props.isLoading) {
      return undefined;
    }

    return /*#__PURE__*/React__default["default"].createElement(Card, {
      className: "flex flex-end mr-4"
    }, /*#__PURE__*/React__default["default"].createElement("div", {
      className: "flex flex-row"
    }, /*#__PURE__*/React__default["default"].createElement(Tooltip$1, {
      content: "Retry",
      className: "mb-1"
    }, /*#__PURE__*/React__default["default"].createElement(Button$3, {
      className: "flex flex-1 ml-4 mr-2",
      icon: "ArrowRotateLeft",
      onClick: props.onRetryClicked
    })), /*#__PURE__*/React__default["default"].createElement(Tooltip$1, {
      content: "Export",
      className: "mb-1"
    }, /*#__PURE__*/React__default["default"].createElement(Button$3, {
      className: "flex flex-1 ml-2 mr-2",
      icon: "ArrowUpTurnBracket",
      onClick: props.onExportClicked
    })), /*#__PURE__*/React__default["default"].createElement(Tooltip$1, {
      content: "Info",
      className: "mb-1"
    }, /*#__PURE__*/React__default["default"].createElement(Button$3, {
      className: "flex flex-1 ml-2 mr-4",
      icon: "CircleInfo",
      onClick: props.onInfoClicked
    }))));
  };

  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "flex flex-col"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "flex flex-row"
  }, /*#__PURE__*/React__default["default"].createElement(Card, {
    className: "flex ml-4",
    actions: walletActions,
    onSelect: onWalletSelected
  }, /*#__PURE__*/React__default["default"].createElement(WalletItem, {
    wallet: props.selectedWallet,
    language: props.selectedLanguage
  })), /*#__PURE__*/React__default["default"].createElement(Card, {
    className: "flex ml-4",
    actions: yearOptions,
    onSelect: onYearSelected
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "flex flex-col"
  }, /*#__PURE__*/React__default["default"].createElement("span", {
    className: "flex flex-row justify-center font-semibold text-theme-secondary-text text-sm"
  }, "Period"), /*#__PURE__*/React__default["default"].createElement("span", {
    className: "align-center ml-4 mr-4 text-theme-secondary-700 font-bold"
  }, selectedYear))), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "flex flex-row flex-1 justify-end"
  }, renderSummary(), renderButtons())), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "flex full-w mt-4 mb-4 pt-0.5 bg-theme-secondary-800"
  }));
};

const Keys = {
  STORE_ADDRESS: 'store_address',
  DISCLAIMER_ACCEPTED: 'disclaimer_accepted'
};

const ARK_API_URL = 'https://api.ark.io/api';
const PRICE_API_EP_URL = 'https://min-api.cryptocompare.com/data/histoday';
const ARK_EXPLORER_URL = 'https://explorer.ark.io';
const ARK_EXPLORER_TRANSACTIONS_PATH = '/transaction/';
const ARK_EXPLORER_SENDER_PATH = '/wallets/';

const {
  Components: Components$7
} = globalThis.payvo;
const {
  TableCell,
  TableRow,
  Link: Link$2,
  Icon,
  Tooltip
} = Components$7;
const TransactionListItem = props => {
  const value = props.transaction.amount * props.transaction.price.close / tokenValueFactor;
  const transactionExplorerUrl = ARK_EXPLORER_URL + ARK_EXPLORER_TRANSACTIONS_PATH + props.transaction.transactionId;
  const senderExplorerUrl = ARK_EXPLORER_URL + ARK_EXPLORER_SENDER_PATH + props.transaction.senderPublicKey;
  const idSnapShot = props.transaction.transactionId.substring(0, 9) + '...';
  const date = new Date(props.transaction.date * 1000);
  const closePriceTip = formatCurrency(props.transaction.price.close, props.transaction.price.currency, props.language) + ' / ' + props.wallet.coin;
  return /*#__PURE__*/React__default["default"].createElement(TableRow, null, /*#__PURE__*/React__default["default"].createElement(TableCell, {
    innerClassName: "justify-center text-theme-secondary-text",
    isCompact: true
  }, /*#__PURE__*/React__default["default"].createElement("span", {
    className: "justify-center whitespace-nowrap"
  }, formatCurrency(props.transaction.amount, props.wallet.coin, props.language))), /*#__PURE__*/React__default["default"].createElement(TableCell, {
    innerClassName: "justify-center text-theme-secondary-text",
    isCompact: true
  }, /*#__PURE__*/React__default["default"].createElement(Tooltip, {
    content: closePriceTip,
    className: "mb-1"
  }, /*#__PURE__*/React__default["default"].createElement("span", {
    className: "justify-center whitespace-nowrap"
  }, formatCurrency(value, props.transaction.price.currency, props.language)))), /*#__PURE__*/React__default["default"].createElement(TableCell, {
    innerClassName: "justify-center text-theme-secondary-text",
    isCompact: true
  }, /*#__PURE__*/React__default["default"].createElement("span", {
    className: "flex items-center  whitespace-nowrap"
  }, date.toLocaleDateString(props.language), " ", date.toLocaleTimeString(props.language))), /*#__PURE__*/React__default["default"].createElement(TableCell, {
    innerClassName: "justify-center",
    isCompact: true
  }, /*#__PURE__*/React__default["default"].createElement(Link$2, {
    to: senderExplorerUrl,
    showExternalIcon: false,
    isExternal: true
  }, props.transaction.senderName)), /*#__PURE__*/React__default["default"].createElement(TableCell, {
    innerClassName: "justify-center",
    isCompact: true
  }, /*#__PURE__*/React__default["default"].createElement(Link$2, {
    to: transactionExplorerUrl,
    showExternalIcon: false,
    isExternal: true
  }, /*#__PURE__*/React__default["default"].createElement("span", {
    className: "flex flex-row"
  }, /*#__PURE__*/React__default["default"].createElement("span", {
    className: "active:text-theme-primary-400"
  }, idSnapShot), /*#__PURE__*/React__default["default"].createElement(Icon, {
    className: "ml-2 mt-2",
    name: "MagnifyingGlassId"
  })))));
};

const {
  Components: Components$6
} = globalThis.payvo;
const {
  Table
} = Components$6;
const columns = [{
  Header: 'Amount',
  accessor: 'amount',
  className: 'ml-6 mr-2 justify-center'
}, {
  Header: 'Value',
  accessor: transaction => transaction.amount * transaction.price.close,
  className: 'ml-6 mr-2 justify-center'
}, {
  Header: 'Date',
  accessor: 'date',
  className: 'ml-6 mr-2 justify-center'
}, {
  Header: 'From',
  className: 'ml-2 mr-2 justify-center'
}, {
  Header: 'Transaction',
  className: 'ml-2 mr-2 justify-center'
}];
const RewardTable = props => {
  const currentData = props.rewardData.get(props.selectedYear) ? props.rewardData.get(props.selectedYear) : [];

  if (currentData.length == 0) {
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: "mt-4 relative"
    }, /*#__PURE__*/React__default["default"].createElement("span", null, "The report of the selected period is empty."));
  } else {
    return /*#__PURE__*/React__default["default"].createElement("div", {
      className: "flex-1 mt-4 relative"
    }, /*#__PURE__*/React__default["default"].createElement(Table, {
      columns: columns,
      data: currentData
    }, transaction => /*#__PURE__*/React__default["default"].createElement(TransactionListItem, {
      language: props.language,
      wallet: props.wallet,
      transaction: transaction
    })));
  }
};

const {
  Components: Components$5
} = globalThis.payvo;
const {
  Button: Button$2
} = Components$5;
const ErrorView = props => {
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "relative flex flex-col flex-1 justify-center items-center rounded-lg bg-theme-feature"
  }, /*#__PURE__*/React__default["default"].createElement("span", {
    className: "text-2xl font-bold"
  }, "Error"), /*#__PURE__*/React__default["default"].createElement("span", {
    className: "font-bold text-red mt-6 mb-6"
  }, props.error.message), /*#__PURE__*/React__default["default"].createElement(Button$2, {
    variant: "danger",
    className: "ContactAll__CreateButton justify-end",
    onClick: props.onClick
  }, "Retry"));
};

const {
  Components: Components$4
} = globalThis.payvo;
const {
  Button: Button$1,
  Link: Link$1
} = Components$4;
const EmptyWalletHint = props => {
  const context = useWalletContext();
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "flex flex-1 items-center"
  }, /*#__PURE__*/React__default["default"].createElement("div", {
    className: "flex flex-1 flex-col items-center"
  }, /*#__PURE__*/React__default["default"].createElement("span", null, "Your profile has no ARK wallet so far. Please import a wallet or create a new one."), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "mt-4 flex-row justify-center items-stretch"
  }, /*#__PURE__*/React__default["default"].createElement(Link$1, {
    className: "mr-3",
    to: `/profiles/${context.api.profile().id()}/wallets/import`
  }, /*#__PURE__*/React__default["default"].createElement(Button$1, null, "Import")), /*#__PURE__*/React__default["default"].createElement(Link$1, {
    className: "ml-3",
    to: `/profiles/${context.api.profile().id()}/wallets/create`
  }, /*#__PURE__*/React__default["default"].createElement(Button$1, {
    variant: "secondary"
  }, "Create")))));
};

const exportTransactions = (api, wallet, year, transactions) => {
  if (!transactions || transactions.length == 0) {
    return;
  }

  const rows = [];
  const currency = transactions[0].price.currency;
  const amount = 'amount';
  const value = 'value';
  const date = 'date';
  const transactionId = 'transactionId';
  const header = `${wallet.coin} ${amount} | ${currency} ${value} | ${date} | ${transactionId}`;
  rows.push(header);
  transactions.forEach(transaction => {
    const language = 'en'; // TODO how to get language?

    rows.push(buildExportRow(transaction, wallet.coin, language));
  });
  const asString = rows.join('\n');
  const fileNameSuggestion = `stakingRewardReport_${year}_${wallet.address}`;
  return api.filesystem().askUserToSaveFile(asString, fileNameSuggestion);
};

const {
  Components: Components$3
} = globalThis.payvo;
const {
  Modal,
  Link
} = Components$3;
const InfoModal = props => {
  const apiUrl = 'https://min-api.cryptocompare.com';
  return /*#__PURE__*/React__default["default"].createElement(Modal, {
    isOpen: props.isOpen,
    title: 'Info',
    onClose: props.onClose
  }, /*#__PURE__*/React__default["default"].createElement("span", null, "This plugin uses the public REST Api from "), /*#__PURE__*/React__default["default"].createElement(Link, {
    to: apiUrl,
    showExternalIcon: false,
    isExternal: true
  }, apiUrl), /*#__PURE__*/React__default["default"].createElement("span", null, " to get the price of each transaction. The displayed price is the close price of the day the transaction has been proceeded."));
};

const {
  Components: Components$2
} = globalThis.payvo;
const {
  Button
} = Components$2;
const DisclaimerView = props => {
  const title = 'Disclaimer';
  const message = 'The information presented by this plugin has been prepared for informational purposes only, and is not intended to provide, and should not be relied on for ' + 'tax, legal or accounting advice.';
  return /*#__PURE__*/React__default["default"].createElement("div", {
    className: "flex m-auto max-w-lg flex-col justify-center"
  }, /*#__PURE__*/React__default["default"].createElement("span", {
    className: "text-2xl font-bold"
  }, title), /*#__PURE__*/React__default["default"].createElement("span", {
    className: "mt-4"
  }, message), /*#__PURE__*/React__default["default"].createElement("div", {
    className: "flex flex-row mt-6 justify-end"
  }, /*#__PURE__*/React__default["default"].createElement(Button, {
    variant: "primary",
    className: "ContactAll__CreateButton justify-end",
    onClick: props.onAccept
  }, "Accept")));
};

let State;

(function (State) {
  State[State["NONE"] = 0] = "NONE";
  State[State["SUCCESS"] = 1] = "SUCCESS";
  State[State["ERROR"] = 2] = "ERROR";
})(State || (State = {}));

const {
  Components: Components$1
} = globalThis.payvo;
const {
  Alert
} = Components$1;
const TIMEOUT = 5000;
const Toast = props => {
  const context = useWalletContext();
  React.useEffect(() => {
    if (props.state) {
      context.api.timers().setTimeout(() => {
        props.onDismiss();
      }, TIMEOUT);
    }
  }, [props.state]);

  if (props.state !== State.NONE) {
    let variant = 'success';

    if (props.state == State.ERROR) {
      variant = 'danger';
    }

    return /*#__PURE__*/React__default["default"].createElement(Alert, {
      className: "absolute bg-theme-secondary-800",
      variant: variant,
      title: props.message
    });
  }

  return null;
};

const {
  Components
} = globalThis.payvo;
const {
  Spinner
} = Components;
const HomePage = () => {
  let executePermission = {
    canceled: false
  };
  const context = useWalletContext(); // TODO read those from the api or create a own settings fort ist

  const [selectedLanguage] = React.useState('en');
  const [selectedCurrency] = React.useState('EUR');
  const [isLoading, setIsLoading] = React.useState(false);
  const [currentError, setError] = React.useState();
  const [exportState, setExportState] = React.useState({
    state: State.NONE
  });
  const [selectedYear, setSelectedYear] = React.useState(() => new Date().getFullYear());
  const [availableYears, setAvailableYears] = React.useState();
  const [summary, setSummary] = React.useState();
  const [myStakingRewards, setMyStakingRewards] = React.useState(new Map());
  const [isInfoShown, setInfoShown] = React.useState(false);
  const [disclaimerAccepted, setDisclaimerAccepted] = React.useState(() => {
    return context.api.store().data().get(Keys.DISCLAIMER_ACCEPTED) === true;
  });
  const [wallets] = React.useState(() => context.api.profile().wallets().filter(wallet => wallet.data.COIN === 'ARK' && wallet.data.NETWORK === 'ark.mainnet').map(wallet => {
    return createWallet(wallet);
  }));
  const [selectedWallet, setSelectedWallet] = React.useState(() => {
    if (wallets.length) {
      let result = wallets[0];
      const selectedAddress = context.api.store().data().get(Keys.STORE_ADDRESS);

      if (selectedAddress) {
        const wallet = wallets.find(wallet => wallet.address == selectedAddress);

        if (wallet) {
          result = wallet;
        }
      }

      return result;
    }
  });
  React.useEffect(() => {
    const transactions = myStakingRewards.get(selectedYear);

    if (transactions) {
      let tmpSummary = 0;
      let currency = undefined;
      transactions.forEach(transaction => {
        const value = transaction.amount * transaction.price.close / tokenValueFactor;
        tmpSummary += value;

        if (!currency) {
          currency = transaction.price.currency;
        }
      });
      setSummary({
        value: tmpSummary,
        currency: currency
      });
    }
  }, [myStakingRewards, selectedYear]);
  React.useEffect(() => {
    loadTransactions();
  }, [selectedWallet]);

  const onWalletSelected = wallet => {
    context.api.store().data().set(Keys.STORE_ADDRESS, wallet.address);
    context.api.store().persist();
    setSelectedWallet(wallet);
  };

  const onDisclaimerAccepted = () => {
    setDisclaimerAccepted(true);
    context.api.store().data().set(Keys.DISCLAIMER_ACCEPTED, true);
  };

  const loadTransactions = () => {
    setIsLoading(true);
    executePermission.canceled = true;
    executePermission = {
      canceled: false
    };
    context.repository.generateStakingRewardReport(executePermission, selectedCurrency, selectedWallet).then(reportMap => {
      setMyStakingRewards(reportMap);
      setAvailableYears(Array.from(reportMap.keys()));
      setIsLoading(false);
    }).catch(error => {
      console.log(error.message);
      setError(error);
    });
  };

  const onRetryClicked = () => {
    if (!isLoading) {
      setError(undefined);
      loadTransactions();
    }
  };

  const onExportClicked = () => {
    exportTransactions(context.api, selectedWallet, selectedYear, myStakingRewards.get(selectedYear)).then(() => setExportState({
      state: State.SUCCESS,
      message: 'Report was saved.'
    })).catch(error => setExportState({
      state: State.ERROR,
      message: error.message
    }));
  };

  const onInfoClicked = () => {
    setInfoShown(true);
  };

  const renderTable = () => {
    if (isLoading) {
      return /*#__PURE__*/React__default["default"].createElement("div", {
        className: "flex h-full justify-center items-center"
      }, /*#__PURE__*/React__default["default"].createElement(Spinner, null));
    } else {
      return /*#__PURE__*/React__default["default"].createElement("div", {
        className: "flex"
      }, /*#__PURE__*/React__default["default"].createElement(RewardTable, {
        language: selectedLanguage,
        wallet: selectedWallet,
        selectedYear: selectedYear,
        rewardData: myStakingRewards
      }), /*#__PURE__*/React__default["default"].createElement(Toast, {
        state: exportState.state,
        message: exportState.message,
        onDismiss: () => setExportState({
          state: State.NONE
        })
      }));
    }
  };

  const renderContent = () => {
    if (!disclaimerAccepted) {
      return /*#__PURE__*/React__default["default"].createElement(DisclaimerView, {
        onAccept: onDisclaimerAccepted
      });
    } else if (!wallets || wallets.length == 0) {
      return /*#__PURE__*/React__default["default"].createElement(EmptyWalletHint, null);
    } else if (currentError) {
      return /*#__PURE__*/React__default["default"].createElement(ErrorView, {
        error: currentError,
        onClick: onRetryClicked
      });
    } else {
      return /*#__PURE__*/React__default["default"].createElement("div", {
        className: "flex ml-6 mr-6 flex-row w-full"
      }, /*#__PURE__*/React__default["default"].createElement("div", {
        className: "flext flex-1 w-full"
      }, /*#__PURE__*/React__default["default"].createElement(Header, {
        selectedLanguage: selectedLanguage,
        selectedWallet: selectedWallet,
        wallets: wallets,
        onWalletSelected: onWalletSelected,
        isLoading: isLoading,
        summary: summary,
        selectedYear: selectedYear,
        yearOptions: availableYears,
        onYearSelected: year => setSelectedYear(year),
        onRetryClicked: onRetryClicked,
        onExportClicked: onExportClicked,
        onInfoClicked: onInfoClicked
      }), renderTable(), /*#__PURE__*/React__default["default"].createElement(InfoModal, {
        isOpen: isInfoShown,
        onClose: () => setInfoShown(false)
      })));
    }
  };

  return renderContent();
};

/**
 * This class is our data source. It is the interface to each used REST Api.
 */

class RemoteDataStore {
  /**
   * @param {any} walletApi the wallet api instance from the payvo wallet.
   */
  constructor(walletApi) {
    this.walletApi = walletApi;
  }
  /**
   * Loads all received transactions for the given wallet.
   * @param {ExecutePermission} executePermission can be canceled to stop the execution of this request.
   * @param {Wallet} wallet the wallet for which all transactions should be loaded.
   */


  async getReceivedTransactions(executePermission, wallet) {
    const address = wallet.address;
    const requestPath = `/wallets/${address}/transactions/received?limit=100`;
    const resultList = await this.getAllPagesOf(executePermission, requestPath);
    const result = [];

    try {
      resultList.forEach(transaction => {
        const type = parseInt(transaction.type);
        const date = transaction.timestamp.unix;
        const senderPublicKey = transaction.senderPublicKey;
        const transactionId = transaction.id;
        let amount = 0.0;

        switch (type) {
          case 0:
            amount = parseFloat(transaction.amount);
            break;

          case 6:
            const payments = transaction.asset.payments;
            payments.forEach(payment => {
              if (payment.recipientId === address) {
                amount = parseFloat(payment.amount);
              }
            });
            break;
        }

        result.push({
          transactionId: transactionId,
          senderPublicKey: senderPublicKey,
          amount: amount,
          date: date,
          price: undefined,
          senderName: ''
        });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }

    return result;
  }
  /**
   * Loads all votes which have been made from the given wallet.
   * @param {ExecutePermission} executePermission can be canceled to stop the execution of this request.
   * @param {Wallet} wallet the wallet for which all votes should be loaded.
   */


  async getVotes(executePermission, wallet) {
    const address = wallet.address;
    const path = `/wallets/${address}/votes?limit=100`;
    const resultList = await this.getAllPagesOf(executePermission, path);
    const result = [];

    try {
      const delegateIds = new Set();
      resultList.forEach(transaction => {
        const vote = transaction.asset.votes[0];
        const delegatePublicKey = vote.substr(1, vote.length);
        delegateIds.add(delegatePublicKey);
      });
      const delegates = await this.getDelegates(Array.from(delegateIds));
      resultList.forEach(transaction => {
        const date = transaction.timestamp.unix;
        const vote = transaction.asset.votes[0];
        const isDownVote = vote[0] === '-';
        const delegatePublicKey = vote.substr(1, vote.length);
        const delegateName = delegates.get(delegatePublicKey);
        result.push({
          delegateName: delegateName,
          delegatePublicKey: delegatePublicKey,
          date: date,
          isDownVote: isDownVote
        });
      });
    } catch (error) {
      console.log(error);
      throw error;
    }

    return result;
  }
  /**
   * Load delegate information for each delegate id in the given list.
   * @param {string[]} delegateIds a list of ids from delegates.
   */


  async getDelegates(delegateIds) {
    const result = new Map();

    try {
      for (const delegateId of delegateIds) {
        const url = ARK_API_URL + '/delegates?publicKey=' + delegateId;
        const requestResult = await this.walletApi.http().get(url);
        const response = requestResult.json();
        result.set(delegateId, response.data[0].username);
      }
    } catch (error) {
      console.log(error);
      throw error;
    }

    return result;
  }
  /**
   * Load historical prices for the given transactions.
   * @param {string} currency the currency which the price if requested of.
   * @param {Wallet} wallet the wallet where the transactions are received.
   * @param {Transaction[]} transactions the transactions which historical prices are requested.
   */


  async loadPrices(currency, wallet, transactions) {
    const prices = [];

    try {
      if (transactions.length > 0) {
        const lastTransactionTime = transactions[transactions.length - 1].date;
        const fromTime = Math.round(transactions[0].date);
        const query = {
          fsym: wallet.coin,
          tsym: currency,
          toTs: lastTransactionTime,
          limit: getDaysSince(fromTime)
        };
        const requestResult = await this.walletApi.http().get(PRICE_API_EP_URL, query);
        const data = requestResult.json().Data;
        data.forEach(price => prices.push({
          time: price.time,
          close: price.close,
          currency: currency
        }));
      }
    } catch (error) {
      console.log(error);
      throw error;
    }

    return prices;
  }
  /**
   * Will call the ARK REST api for the given path and loads all pages until the first page where data is empty.
   * In case of "to many requests" error, this methode will do a timeout of 10 seconds before it will proceed.
   * @param {ExecutePermission} executePermission can be canceled to stop the execution of this request.
   * @param {string} requestPath the path of the requested endpoint.
   */


  async getAllPagesOf(executePermission, requestPath) {
    const result = [];
    let page = 1;
    let isEmpty = true;

    do {
      const url = ARK_API_URL + requestPath + `&page=${page}`;
      const requestResult = await this.walletApi.http().get(url);
      const response = requestResult.json();
      Array.prototype.push.apply(result, response.data);
      page++;
      isEmpty = !response || !response.data || response.data.length == 0;
    } while (!executePermission.canceled && !isEmpty);

    return result;
  }

}

/**
 * This class handles all of the business logic. It is the interface from the plugin to the data.
 */

class Repository {
  // eslint-disable-next-line valid-jsdoc
  dateComparator = (lhs, rhs) => lhs.date - rhs.date; // eslint-disable-next-line valid-jsdoc

  dateComparatorDesc = (lhs, rhs) => rhs.date - lhs.date;
  /**
   * @param {any} walletApi the api of the payvo wallet
   */

  constructor(walletApi) {
    this.walletApi = walletApi;
    this.remoteDataStore = new RemoteDataStore(walletApi);
  }
  /**
   * Generates a all time staking reward report for the given wallet.
   * @param {ExecutePermission} executePermission can be canceled to stop the execution of this request.
   * @param {string} currency the currency which will be used to determine the price.
   * @param {Wallet} wallet the current selected wallet which the report will be generated for.
   */


  async generateStakingRewardReport(executePermission, currency, wallet) {
    try {
      const result = await this.internalGenerateStakingRewardReport(executePermission, currency, wallet);

      if (!executePermission.canceled) {
        return result;
      }
    } catch (error) {
      if (!executePermission.canceled) {
        throw error;
      }
    }
  }
  /**
   * Generates a all time staking reward report for the given wallet.
   * @param {ExecutePermission} executePermission can be canceled to stop the execution of this request.
   * @param {string} currency the currency which will be used to determine the price.
   * @param {Wallet} wallet the current selected wallet which the report will be generated for.
   */


  async internalGenerateStakingRewardReport(executePermission, currency, wallet) {
    const myTransactions = await this.remoteDataStore.getReceivedTransactions(executePermission, wallet);
    const myVotes = await this.remoteDataStore.getVotes(executePermission, wallet);
    myTransactions.sort(this.dateComparator);
    myVotes.sort(this.dateComparator);
    const transactionsMap = new Map();
    myTransactions.forEach(transaction => {
      const year = new Date(transaction.date * 1000).getFullYear();

      if (!transactionsMap.get(year)) {
        transactionsMap.set(year, []);
      }

      transactionsMap.get(year).push(transaction);
    });
    const stakingRewardsMap = new Map();

    for (const entry of transactionsMap.entries()) {
      const year = entry[0];
      const currentTransactions = entry[1];
      const prices = await this.remoteDataStore.loadPrices(currency, wallet, currentTransactions);
      await this.applyPrices(currentTransactions, prices);
      const rewards = this.findStakingRewards(currentTransactions, myVotes);
      rewards.sort(this.dateComparatorDesc);
      stakingRewardsMap.set(year, rewards);
    }

    return stakingRewardsMap;
  }
  /**
   * Apply the close price of prices to the the transactions.
   * @param {Transaction[]} transactions
   * @param {Price[]} prices
   */


  async applyPrices(transactions, prices) {
    transactions.map(transaction => {
      const time = transaction.date;
      const price = prices.find(price => {
        return time >= price.time && time < price.time + secondsOfDay;
      });
      Object.assign(transaction, {
        price: price
      });
    });
  }
  /**
   * Filter those transactions witch are from a delegate the wallet voted for.
   * @param {Transaction[]} transactions a set of transactions which should be filtered.
   * @param {Vote[]} votes the votes which are filtered for.
   * @return {Transaction[]} the filtered list of transaction. Each transaction was received from a senderId
   * of an entity of votes.
   */


  findStakingRewards(transactions, votes) {
    const result = [];

    if (votes.length == 0) {
      return result;
    }

    const lastVoteTime = votes[votes.length - 1].date;
    let since = 0;

    while (since < lastVoteTime) {
      const res = this.findStakingRewardsSince(transactions, votes, since);
      Array.prototype.push.apply(result, res.result);
      since = res.downVoteTime;
    }

    return result;
  }
  /**
   * Filter those transactions witch are from a vote period.
   * @param {Transaction[]} transactions a set of transactions which should be filtered.
   * @param {Vote[]} votes the votes which are filtered for.
   * @param {number} since The start time of the requested period. The up-vote-time of the used vote period is greater or equal this start time.
   * @return {{result: Transaction[], downVoteTime: number}} the filtered transactions and the downVoteTime of the used vote period (or now if the period isn't over).
   */


  findStakingRewardsSince(transactions, votes, since) {
    const upVote = votes.find(vote => !vote.isDownVote && since < vote.date);
    const downVote = votes.find(vote => vote.isDownVote && vote.delegatePublicKey === upVote.delegatePublicKey);
    let downVoteTime = Date.now();

    if (downVote) {
      downVoteTime = downVote.date;
    }

    const result = transactions.filter(transaction => {
      return upVote.date <= transaction.date && transaction.date < downVoteTime && transaction.senderPublicKey === upVote.delegatePublicKey;
    });
    result.forEach(transaction => {
      Object.assign(transaction, {
        senderName: upVote.delegateName
      });
    });
    return {
      result: result,
      downVoteTime: downVoteTime
    };
  }

}

const entry = api => {
  api.launch().render( /*#__PURE__*/React__default["default"].createElement(WalletProvider, {
    api: api,
    repository: new Repository(api)
  }, /*#__PURE__*/React__default["default"].createElement(HomePage, null)));
};

exports["default"] = entry;
