import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import Wallet from './import-wallet/wallet';

import registerServiceWorker from './registerServiceWorker';

//ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<Wallet />, document.getElementById('dropzone'));
registerServiceWorker();
