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

const HomePage = () => {
  const context = useWalletContext();
  const [wallets] = React.useState(() => context.profile().wallets().filter(wallet => wallet.data.COIN === 'ARK' && wallet.data.NETWORK === 'ark.mainnet'));
  const [selectedWallet, setSelectedWallet] = React.useState(() => {
    if (wallets.length) {
      return wallets[0];
    }
  });
  return /*#__PURE__*/React__default['default'].createElement("div", null, selectedWallet.data.ADDRESS);
};

const entry = api => {
  api.launch().render( /*#__PURE__*/React__default['default'].createElement(WalletProvider, {
    api: api
  }, /*#__PURE__*/React__default['default'].createElement(HomePage, null)));
};

exports['default'] = entry;
