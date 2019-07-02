import { timeout, calcInterval, getFormattedDate } from "../../utils/common"
import BLOCKCHAIN_INFO from "../../../../env"
import { floatMultiply } from "../../utils/converter"
import { LIMIT_ORDER_CONFIG } from "../../services/constants";
import _ from "lodash";

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
    "status": "status",
    "created_at": "created_at",
    "updated_at": "updated_at",
    "msg": "msg"
}

function validateOrder(order) {
    if (typeof order.fee !== "number" || typeof order.src_amount !== "number" || typeof order.min_rate !== "number"
    || typeof order.created_at !== "number" || typeof order.updated_at !== "number") return false;
    if (order.fee < 0 || order.fee > 0.5) return false;

    return true;
}

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
        if (validateOrder(order)) {
            orderList.push(order)
        }
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
        timeout(MAX_REQUEST_TIMEOUT, fetch('/api/orders'))
            .then((response) => {
                return response.json()
            }).then((result) => {
                var orderList = filterOrder(result)
                resolve(orderList)
            })
            .catch((err) => {
                rejected(new Error(`Cannot get user orders: ${err.toString}`))
            })
    })
}


export function submitOrder(order) {
    return new Promise((resolve, rejected) => {
        timeout(MAX_REQUEST_TIMEOUT, fetch('/api/orders', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order)
        }))
            .then((response) => {
                return response.json()
            }).then((result) => {
                if (result.success) {
                    var fields = result.fields
                    var order = result.order
                    var orderObj = {}
                    for (var j = 0; j < fields.length; j++) {
                        var field = keyMapping[fields[j]] ? keyMapping[fields[j]] : fields[j]
                        orderObj[field] = order[j]
                    }
                    resolve(orderObj)
                } else {
                    rejected(new Error("Cannot submit order"))
                }
            })
            .catch((err) => {
                rejected(new Error(`Cannot submit order: ${err.toString()}`))
            })
    })
}


export function cancelOrder(order) {
    return new Promise((resolve, rejected) => {
        timeout(MAX_REQUEST_TIMEOUT, fetch(`/api/orders/${order.id}/cancel`, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        }))
            .then((response) => {
                return response.json()
            }).then((result) => {
                resolve(result.cancelled)
            })
            .catch((err) => {
                rejected(new Error(`Cannot cancel order: ${err.toString()}`))
            })
    })
}


export function getNonce(userAddr, source, dest) {
    return new Promise((resolve, rejected) => {
        timeout(MAX_REQUEST_TIMEOUT, fetch(`/api/orders/nonce?addr=${userAddr}&src=${source}&dst=${dest}`))
            .then((response) => {
                return response.json()
            }).then((result) => {
                resolve(result.nonce)
            })
            .catch((err) => {
                rejected(new Error(`Cannot get user nonce: ${err.toString()}`))
            })
    })
}


export function getFee(userAddr, src, dest, src_amount, dst_amount) {
    return new Promise((resolve, rejected) => {
        timeout(MAX_REQUEST_TIMEOUT, fetch(`/api/orders/fee?user_addr=${userAddr}&src=${src}&dst=${dest}&src_amount=${src_amount}&dst_amount=${dst_amount}`))
            .then((response) => {
                return response.json()
            }).then((result) => {
                if (result.success) {
                    const fee = floatMultiply(result.fee, 100);
                    resolve(fee);
                } else {
                    rejected(result.message)
                }

            })
            .catch((err) => {
                rejected(new Error(`Cannot get user fee: ${err.toString()}`))
            })
    })
}


export function getOrdersByIdArr(idArr) {
    return new Promise((resolve, rejected) => {
        if (idArr.length === 0) {
            resolve([])
            return
        }

        if (idArr.length > 50) {
            getOrders()
            .then(response => {
                const filterArr = response.filter(item => {
                    return idArr.indexOf(item) !== -1;
                });
                resolve(filterArr)
            })
            .catch(err => {
                rejected(new Error(`Cannot get user orders: ${err.toString()}`));
            })
        } else {
            // get path
            var path = "/api/orders?"
            for (var i = 0; i < idArr.length; i++) {
                if (i === 0) {
                    path += "ids[]=" + idArr[i]
                } else {
                    path += "&ids[]=" + idArr[i]
                }

            }
            timeout(MAX_REQUEST_TIMEOUT, fetch(path))
                .then((response) => {
                    return response.json()
                }).then((result) => {
                    var orderList = filterOrder(result)
                    resolve(orderList)

                })
                .catch((err) => {
                    rejected(new Error(`Cannot get user orders: ${err.toString()}`))
                })
        }
    })
}

export function isEligibleAddress(addr) {
    return new Promise((resolve, reject) => {
        var path = `/api/orders/eligible_address?user_addr=${addr}`;
        timeout(MAX_REQUEST_TIMEOUT, fetch(path))
            .then((response) => {
                return response.json();
            })
            .then((result) => {
                const { eligible_address } = result;
                resolve(eligible_address);
            }).catch((err) => {
                reject(new Error(`Cannot check eligible address: ${err.toString()}`));
            });
    });
}

export function getUserStats() {
    return new Promise((resolve, reject) => {
        const path = "/api/orders/user_stats";
        timeout(MAX_REQUEST_TIMEOUT, fetch(path))
            .then(response => {
                return response.json();
            }).then(result => {
                if (result.success) {
                    const pairs = result.pairs.map(item => item.replace("/", "-"));  // pair array
                    
                    resolve({
                        pairs,
                        addresses: result.addresses,
                        orderStats: result.order_stats
                    });
                } else {
                    reject(new Error("Not authenticated"));
                }
            }).catch(err => {
                reject(new Error(`Cannot get user stats: ${err.toString()}`));
            });
    })
}

export function getPendingBalances(address) {
    return new Promise((resolve, reject) => {
        const path = `/api/orders/pending_balances?user_addr=${address}`;
        timeout(MAX_REQUEST_TIMEOUT, fetch(path))
            .then(response => {
                return response.json();
            }).then(result => {
                if (result.success) {
                    resolve(result.data);
                } else {
                    reject(new Error("Cannot get pending balance"));
                }
            }).catch(err => {
                reject(new Error(`Cannot get pending balance: ${err.toString()}`));
            });
    });
}

export function getRelatedOrders(sourceToken, destToken, minRate, address) {
    return new Promise((resolve, reject) => {
        const path = `/api/orders/related_orders?src=${sourceToken}&dst=${destToken}&min_rate=${minRate}&user_addr=${address}`;
        timeout(MAX_REQUEST_TIMEOUT, fetch(path)).then(response => {
            return response.json();
        }).then(result => {
            const orders = filterOrder(result);
            resolve(orders);
        }).catch(err => {
            reject(new Error(`Cannot get related orders: ${err.toString()}`));
        })
    })
}

function sortOrders(orders) {
    let results = _.orderBy(orders, item => {
        return getFormattedDate(item.updated_at, true);
    }, ["desc"]);

    results = _.sortBy(results, item => {
        if (item.status === LIMIT_ORDER_CONFIG.status.IN_PROGRESS) {
            return 0;
        } else if (item.status === LIMIT_ORDER_CONFIG.status.OPEN) {
            return 1;
        } else {
            return 2;
        }
    }, ["asc"]);

    return results;
}

export function getOrdersByFilter(address = null, pair = null, status = null, time = null, dateSort = "desc", pageIndex = 1, pageSize = LIMIT_ORDER_CONFIG.pageSize) {
    let path = `/api/orders?page_index=${pageIndex}&page_size=${pageSize}`;

    if (address) {
        const params = address.reduce((sum, item) => {
            return sum + `&user_address[]=${item}`;
        }, "");
        path += params;
    }

    if (pair) {
        const params = pair.reduce((sum, item) => {
            const pairParam = item.replace("-", "_");
            return sum + `&pairs[]=${pairParam}`;
        }, "");
        path += params;
    }

    if (status) {
        const params = status.reduce((sum, item) => {
            return sum + `&status[]=${item}`;
        }, "");
        path += params;
    }

    if (time) {
        const second = calcInterval(time);
        path += `&from=${second}`;
    }

    if (dateSort) {
        path += `&sort=${dateSort}`;
    }

    return new Promise((resolve, rejected) => {
        timeout(MAX_REQUEST_TIMEOUT, fetch(path))
            .then((response) => {
                return response.json()
            }).then((result) => {
                const orderList = filterOrder(result);
                resolve({
                    orders: sortOrders(orderList),
                    itemsCount: result.paging_info.items_count,
                    pageCount: result.paging_info.page_count,
                    pageIndex: result.paging_info.page_index,
                    pageSize: result.paging_info.page_size
                });
            })
            .catch((err) => {
                rejected(new Error(`Cannot get user orders: ${err.toString()}`))
            })
    })
}
