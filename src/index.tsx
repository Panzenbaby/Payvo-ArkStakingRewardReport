import React from 'react';

import {HomePage} from './pages/HomePage';
import {WalletProvider} from './provider/WalletProvider';
import Repository from './repository/Repository';

const entry = (api) => {
    api.launch().render(
        <WalletProvider api={api} repository={new Repository(api)}>
            <HomePage/>
        </WalletProvider>,
    );
};

export default entry;
