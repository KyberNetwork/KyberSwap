import { timeout, calcInterval, getFormattedDate } from "../../utils/common"
import BLOCKCHAIN_INFO from "../../../../env"
// import { converters.toT } from "../../utils/converter";
import * as converters from "../../utils/converter";
import { LIMIT_ORDER_CONFIG } from "../../services/constants";
import { sortBy } from "underscore";

const MAX_REQUEST_TIMEOUT = 3000

const keyMapping = {
    "id": "id",
    "src": "source",
    "dst": "dest",
    "src_amount": "src_amount",
    "min_rate": "min_rate",
    "addr": "user_address",
    "nonce": "nonce",
    "fee": "fee",
    "receive": "receive",
    "status": "status",
    "created_at": "created_at",
    "updated_at": "updated_at",
    "msg": "msg",
}

const jsonString = `{"fields":["id","addr","nonce","src","dst","src_amount","min_rate","fee","receive","status","msg","tx_hash","created_at","updated_at","side_trade"],"orders":[[15629,"0x09B64e3d589AE90ACCE69C75C346722D8EbFB65D","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d107f7e","SNT",null,15,0.0644,0.0046,0,"cancelled",[],null,1561362335,1561362369,"buy"],[15624,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d1070fc","WETH","TUSD",0.5,368.9053,0.0045,0,"open",[],null,1561358597,1561358597,"buy"],[6787,"0x8fa07f46353a2b17e92645592a94a0fc1ceb783f","0x88e7e3b54147f57da5c8aa80b362ef720000000000000000000000005d0ca5b6","OMG","KNC",1.6835,7.4,0.004,0,"open","hello",null,1561109958,1561112985,"buy"]]}`

const data = filterOrder(JSON.parse(jsonString));

function filterOrder(result) {
    var orderList = []
    var fields = result.fields
    var orders = result.orders
    for (var i = 0; i < orders.length; i++) {
        var order = {}
        for (var j = 0; j < fields.length; j++) {
            var field = keyMapping[fields[j]] ? keyMapping[fields[j]] : fields[j]
            order[field] = orders[i][j]
        }
        orderList.push(order)
    }
    const results = orderList.map(item => {
        return {
            ...item,
            user_address: item.user_address.toLowerCase()
        }
    });
    return results;
}

export function getOrders() {
    return new Promise((resolve, rejected) => {
        const results = data.map((item, index) => {
            return {
                ...item,
                user_address: item.user_address.toLowerCase()
            }
        });
        resolve(results);
        return;
    })
}

function sortOrders(orders, dateSort) {
    let results = sortBy(orders, item => {
        return item.updated_at;
    });

    if (dateSort === "desc") {
        results.reverse();
    }

    return results;
}

export function getOrdersByFilter(address = null, pair = null, type = null, status = null, time = null, dateSort = "desc", pageIndex = 1, pageSize = LIMIT_ORDER_CONFIG.pageSize) {
    return new Promise((resolve, reject) => {
        let results = data

        // Address filter
        if (address && address.length > 0) {
            results = results.filter(item => {
                return address.indexOf(item.user_address) !== -1;
            });
        }

        // Pair filter
        if (pair && pair.length > 0) {
            results = results.filter(item => {
                const key = `${item.source}-${item.dest}`;
                const index = pair.indexOf(key);
                return index !== -1;
            });
        }

        // Status filter
        if (status && status.length > 0) {
            results = results.filter(item => {
                const index = status.indexOf(item.status);
                return index !== -1;
            });
        }

        // Type filter
        if (type && type.length > 0) {
            results = results.filter(item => {
                const index = type.indexOf(item.side_trade);
                return index !== -1;
            });
        }

        // Time filter
        if (time) {
            const interval = calcInterval(time);
            const currentTime = new Date().getTime() / 1000;

            results = results.filter(item => {
                return item.updated_at >= currentTime - interval;
            });
        }

        results = sortOrders(results, dateSort);

        const orderIndexStart = pageSize * (pageIndex - 1);

        const itemsCount = results.length;

        if (results.length < pageSize) {
            resolve({
                orders: results,
                itemsCount
            });
            return;
        } else {
            const orders = results.slice(orderIndexStart, pageIndex * pageSize);

            resolve({
                orders,
                itemsCount
            })
            return;
        }
    });
}


export function submitOrder(order) {
    return new Promise((resolve, rejected) => {
        const newOrder = { ...order };

        let sourceTokenSymbol, destTokenSymbol, sourceTokenDecimals;
        Object.keys(BLOCKCHAIN_INFO.tokens).forEach(key => {
            const token = BLOCKCHAIN_INFO.tokens[key];
            if (token.address === order.src_token) {
                sourceTokenSymbol = token.symbol;
                sourceTokenDecimals = token.decimals;
            }
            if (token.address === order.dest_token) {
                destTokenSymbol = token.symbol;
            }
        });

        newOrder.updated_at = new Date().getTime() / 1000;
        newOrder.created_at = new Date().getTime() / 1000;
        newOrder.status = "open"
        newOrder.id = Math.floor(Date.now() / 1000)
        const sourceAmount = converters.toT(order.src_amount, sourceTokenDecimals);
        newOrder.src_amount = sourceAmount === "Infinity" || sourceAmount === "NaN" ? sourceAmount : parseFloat(sourceAmount);
        newOrder.fee = converters.toT(order.fee, 4) / 100;
        newOrder.min_rate = converters.toT(order.min_rate, 18);
        newOrder.source = sourceTokenSymbol;
        newOrder.dest = destTokenSymbol;
        newOrder.receive = 100;
        newOrder.side_trade = order.side_trade
        data.push(newOrder);
        resolve(newOrder);
        return;
    })
}


export function cancelOrder(order) {
    return new Promise((resolve, reject) => {
        const target = data.filter(item => item.id === order.id);

        if (target.length > 0) {
            const newOrder = { ...target[0] };
            const index = data.indexOf(target[0]);
            newOrder.updated_at = new Date().getTime() / 1000;
            newOrder.status = "cancelled";
            data.splice(index, 1, newOrder);
            resolve(newOrder);
        } else {
            reject("No order matches");
        }

        return;
    })
}


export function getNonce(userAddr, source, dest) {
    return new Promise((resolve, rejected) => {
        resolve(1)
    })
}


export function getFee(userAddr, src, dest, src_amount, dst_amount) {
    return new Promise((resolve, rejected) => {
        resolve({
          success: true,
          fee: 0.0036,
          discount_percent: 10,
          non_discounted_fee: 0.004
        })
    })
}


export function getOrdersByIdArr(idArr) {
    return new Promise((resolve, rejected) => {
        var returnData = []
        for (var i = 0; i < idArr.length; i++) {
            for (var j = 0; j < data.length; j++) {
                if (data[j].id === idArr[i]) {
                    returnData.push(data[j])
                    break
                }
            }
        }
        const results = returnData.map(item => {
            return {
                ...item,
                user_address: item.user_address.toLowerCase()
            }
        });
        resolve(results)
    })
}

export function getEligibleAccount(addr) {
    return new Promise((resolve, reject) => {
        resolve(null);
    });
}

export function getUserStats() {
    return new Promise((resolve, reject) => {
        const orders = data;
        const pairs = Array.from(new Set(orders.map(item => `${item.source}-${item.dest}`)));
        const addresses = Array.from(new Set(orders.map(item => item.user_address)));

        const orderStats = {
            "open": data.filter(item => {
                return item.status === LIMIT_ORDER_CONFIG.status.OPEN
            }).length,
            "in_progress": data.filter(item => {
                return item.status === LIMIT_ORDER_CONFIG.status.IN_PROGRESS
            }).length
        }

        resolve({
            pairs, addresses, orderStats
        });
    });
}

export function getPendingBalances(address) {
    return new Promise((resolve, reject) => {
        /*const balances = {};
        data.forEach(item => {
            if ((item.status === LIMIT_ORDER_CONFIG.status.OPEN || item.status === LIMIT_ORDER_CONFIG.status.IN_PROGRESS) && (item.user_address.toLowerCase() === address.toLowerCase())) {
                if (balances.hasOwnProperty(item.source)) {
                    balances[item.source] += item.src_amount;
                } else {
                    balances[item.source] = 0;
                }
            }
        });
        resolve(balances);*/

      const pendingBalanceResponse = {
        success: true,
        data: {
          "DAI": 3
        },
        pending_txs: [
          {
            "tx_hash": "0xcbeb1dace640a1bf857a8fce4e211806b686436e44f1d2331c7ccf3bbe6138e7",
            "src_token": "DAI",
            "src_amount": 2
          }
        ]
      };

      resolve(pendingBalanceResponse);
    });
}

export function getRelatedOrders(sourceToken, destToken, minRate, address) {
    return new Promise((resolve, reject) => {
        const result = {
            "fields": [
                "id",
                "addr",
                "nonce",
                "src",
                "dst",
                "src_amount",
                "min_rate",
                "fee",
                "receive",
                "status",
                "msg",
                "tx_hash",
                "created_at",
                "updated_at"
            ],
            "orders": [
                [
                    123456,
                    "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
                    57818117002753298411002922520048253037538608343117297513952908572797262671854,
                    "KNC",
                    "WETH",
                    "300",
                    "0.0028",
                    0.1,
                    1,
                    "open",
                    "",
                    "tx_hash",
                    1556784881,
                    1556784882
                ]
            ]
        }
        const orders = filterOrder(result);
        resolve(orders);

        return;
    });
}

export function getModeLimitOrder() {
    // const totalOrders = getCookie("order_count");
    return "client"
}

changeState();

function changeState() {
    const filters = data.filter(item => item.id === 6787);

    if (filters.length > 0) {
        const order = filters[0];
        setTimeout(() => {
            order.status = "in_progress";
            order.updated_at = new Date().getTime() / 1000;
        }, 10 * 1000);

        setTimeout(() => {
            order.status = "filled";
            order.updated_at = new Date().getTime() / 1000;
        }, 20 * 1000);
    }

}

export function getFavoritePairs(){
  return new Promise((resolve, rejected) => {
    resolve([{base: "knc", quote: "weth"}])
  })
}


export function updateFavoritePairs(base, quote, to_fav){
  return new Promise((resolve, rejected) => {
    resolve("")
  })
}