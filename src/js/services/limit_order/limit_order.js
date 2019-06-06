import { timeout } from "../../utils/common"
import BLOCKCHAIN_INFO from "../../../../env"

const MAX_REQUEST_TIMEOUT = 3000

const keyMapping = {
    "id": "id",
    "src": "source",
    "dst": "dest",
    "src_amount": "src_amount",
    "min_rate": "min_rate",
    "addr": "address",
    "nonce": "nonce",
    "fee": "fee",
    "status": "status",
    "created_at": "created_at",
    "updated_at": "updated_at",
    "msg": "msg"
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
        orderList.push(order)
    }
    return orderList
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
                rejected(new Error("Cannot get user orders"))
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
                rejected(new Error("Cannot submit order"))
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
                rejected(new Error("Cannot cancel order"))
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
                rejected(new Error("Cannot get user nonce"))
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
                    resolve(result.fee * 100)
                } else {
                    rejected(result.message)
                }

            })
            .catch((err) => {
                rejected(new Error("Cannot get user fee"))
            })
    })
}


export function getOrdersByIdArr(idArr) {
    return new Promise((resolve, rejected) => {
        if (idArr.length === 0) {
            resolve([])
            return
        }
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
                rejected(new Error("Cannot get user orders"))
            })
    })
}