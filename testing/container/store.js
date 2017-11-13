import './config';
import { combineReducers, createStore } from "redux";

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

function txs() {
    return {}
}

function account() {
    return {
        account: {
            address: "0x37522832d0fe94f8e873e908d36ed1633a66116e"
        }
    }
}

const reducer = combineReducers({
    tokens, utils, account, txs
})

const store = createStore(reducer);
export default store;