'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

function _interopDefault (e) { return e && e.__esModule ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

const WalletContext = /*#__PURE__*/React__default['default'].createContext();
const WalletProvider = ({
  api,
  children
}) => /*#__PURE__*/React__default['default'].createElement(WalletContext.Provider, {
  value: api
}, children);
const useWalletContext = () => React__default['default'].useContext(WalletContext);

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
}) => /*#__PURE__*/React__default['default'].createElement("div", {
  className: "h-11 w-11 flex-shrink-0 overflow-hidden rounded-full"
}, /*#__PURE__*/React__default['default'].createElement("img", {
  src: `data:image/svg+xml;utf8,${imageData}`
}));

const tokenValueFactor = 1e8;
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

const {
  Components: Components$1
} = globalThis.payvo;
const {
  Modal
} = Components$1;
const WalletSelector = props => {
  const [isOpen, setIsOpen] = React.useState(false);

  const onItemSelected = wallet => {
    props.onWalletSelected(wallet);
    setIsOpen(false);
  };

  const onOpenClicked = () => {
    setIsOpen(true);
  };

  const onCloseClicked = () => {
    setIsOpen(false);
  };

  return /*#__PURE__*/React__default['default'].createElement("div", null, /*#__PURE__*/React__default['default'].createElement(WalletItem, {
    wallet: props.selectedWallet,
    onClick: onOpenClicked
  }), /*#__PURE__*/React__default['default'].createElement(Modal, {
    isOpen: isOpen,
    title: "Select Wallet",
    onClose: onCloseClicked
  }, props.wallets.map(wallet => /*#__PURE__*/React__default['default'].createElement(WalletItem, {
    key: wallet.address,
    wallet: wallet,
    onClick: () => onItemSelected(wallet)
  }))));
};

const WalletItem = props => {
  const address = props.wallet.address;
  const alias = props.wallet.alias;
  const avatar = props.wallet.avatar;
  const balance = props.wallet.balance;
  const coin = props.wallet.coin;
  const context = useWalletContext();
  const [language] = React.useState(() => context.profile().language);
  return /*#__PURE__*/React__default['default'].createElement("div", {
    className: "flex items-center cursor-pointer border-b border-dashed border-theme-secondary-300 dark:border-theme-secondary-800 space-x-4 py-4 last:border-0",
    onClick: () => props.onClick()
  }, /*#__PURE__*/React__default['default'].createElement(Avatar, {
    imageData: avatar
  }), /*#__PURE__*/React__default['default'].createElement("div", {
    className: "flex flex-col flex-1 overflow-hidden whitespace-nowrap no-ligatures"
  }, /*#__PURE__*/React__default['default'].createElement("span", {
    className: "font-semibold text-theme-secondary-text text-sm"
  }, alias), /*#__PURE__*/React__default['default'].createElement("span", {
    className: "truncate text-theme-secondary-500 dark:text-theme-secondary-700 font-semibold"
  }, address), /*#__PURE__*/React__default['default'].createElement("span", {
    className: "truncate text-theme-secondary-500 dark:text-theme-secondary-700 font-semibold"
  }, formatCurrency(balance, coin, language))));
};

const {
  Components
} = globalThis.payvo;
const {
  Card
} = Components;
const Header = props => {
  return /*#__PURE__*/React__default['default'].createElement(Card, null, /*#__PURE__*/React__default['default'].createElement(WalletSelector, {
    selectedWallet: props.selectedWallet,
    wallets: props.wallets,
    onWalletSelected: props.onWalletSelected
  }));
};

const Keys = {
  STORE_ADDRESS: 'store_address'
};

const HomePage = () => {
  const context = useWalletContext();
  const [wallets] = React.useState(() => context.profile().wallets().filter(wallet => wallet.data.COIN === 'ARK' && wallet.data.NETWORK === 'ark.mainnet').map(wallet => createWallet(wallet)));
  const [selectedWallet, setSelectedWallet] = React.useState(() => {
    if (wallets.length) {
      let result = wallets[0];
      const selectedAddress = context.store().data().get(Keys.STORE_ADDRESS);

      if (selectedAddress) {
        const wallet = wallets.find(wallet => wallet.address == selectedAddress);

        if (wallet) {
          result = wallet;
        }
      }

      return result;
    }
  });

  const onWalletSelected = wallet => {
    context.store().data().set(Keys.STORE_ADDRESS, wallet.address);
    setSelectedWallet(wallet);
  };

  return /*#__PURE__*/React__default['default'].createElement("div", {
    className: "flex ml-6 mr-6 flex-row w-full"
  }, /*#__PURE__*/React__default['default'].createElement("div", {
    className: "flext w-full"
  }, /*#__PURE__*/React__default['default'].createElement(Header, {
    selectedWallet: selectedWallet,
    wallets: wallets,
    onWalletSelected: onWalletSelected
  }), /*#__PURE__*/React__default['default'].createElement("div", null, "TODO")));
};

const entry = api => {
  api.launch().render( /*#__PURE__*/React__default['default'].createElement(WalletProvider, {
    api: api
  }, /*#__PURE__*/React__default['default'].createElement(HomePage, null)));
};

exports['default'] = entry;
