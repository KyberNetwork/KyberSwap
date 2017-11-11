import './config';
import { combineReducers, createStore } from "redux";

// import account from '../reducers/accountReducer'
// import tokens from '../reducers/tokensReducer'
// import exchange from '../reducers/exchangeReducer'
// import transfer from '../reducers/transferReducer'
// import global from '../reducers/globalReducer'
// // import connection from '../reducers/connection'
// import utils from '../reducers/utilsReducer'
// import txs from '../reducers/txsReducer'
// import { persistReducer } from 'redux-persist'
// import localForage from 'localforage'

function tokens() {
    return {
        tokens: {
            "ETH": {
                name: "Ethereum",
                symbol: "ETH",
                icon: "/assets/img/tokens/eth.svg",
                address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                decimal: 18,
                balance: 0
            }
        }
    }
}
function utils() {
    return {}
}

function accounts() {
    return {}
}

const reducer = combineReducers({
    tokens, utils, accounts
})
// const reducer = combineReducers({
//     account, exchange, transfer, txs, global, utils,
//     tokens: persistReducer({
//         key: 'tokens',
//         storage: localForage
//     }, tokens),
// })

const store = createStore(reducer);
export default store;