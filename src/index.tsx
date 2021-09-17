import React from 'react';

import {HomePage} from './pages/HomePage';
import {WalletProvider} from './provider/WalletProvider';

const entry = (api) => {
    api.launch().render(
        <WalletProvider api={api}>
            <HomePage/>
        </WalletProvider>,
    );
};

export default entry;
