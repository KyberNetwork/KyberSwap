import './config';
import { combineReducers, createStore } from "redux";
import BigNumber from "bignumber.js"

function tokens() {
    return {
        tokens: {
            "ETH": {
                name: "Ethereum",
                symbol: "ETH",
                icon: "/assets/img/tokens/eth.svg",
                address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                decimal: 18,
                balance: new BigNumber(Math.pow(10, 17))
            },
            "OMG": {
                name: "OmiseGO",
                symbol: "OMG",
                icon: "/assets/img/tokens/omg.svg",
                address: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
                decimal: 18,
                balance: new BigNumber(Math.pow(10, 18))
            }
        }
    }
}

function utils() {
    return {}
}

function txs() {
    return {}
}

function connection() {
    return {}
}

function account() {
    return {
        account: {
            address: "0x37522832d0fe94f8e873e908d36ed1633a66116e"
        }
    }
}

function exchange() {
    return {
        offeredRate: 0,
        sourceAmount: '',
        errors: {}
    }
}

function transfer() {
    return {
        offeredRate: 0,
        tokenSymbol: 'ETH',
        amount: '',
        destAddress: '',
        errors: {}
    }
}

const reducer = combineReducers({
    tokens, utils, account, txs, connection, exchange, transfer
})

const store = createStore(reducer);
export default store;