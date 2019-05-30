import { timeout } from "../../utils/common"
import BLOCKCHAIN_INFO from "../../../../env"

const MAX_REQUEST_TIMEOUT = 3000

const keyMapping = {
    "id": "id",
    "src": "sourceAddr",
    "dst": "destAddr",
    "src_amount": "src_amount",
    "min_rate": "min_rate",
    "addr": "address",
    "nonce": "nonce",
    "fee": "fee",
    "status": "status",
    "created_at": "created_time",
    "updated_at": "cancel_time",
    "msg": "msg"    
}



export function getOrders() {
    return new Promise((resolve, rejected) => {
        timeout(MAX_REQUEST_TIMEOUT, fetch('/api/orders'))
            .then((response) => {
                return response.json()
            }).then((result) => {
                var orderList = []
                var fields = result.fields
                result.orders.map(value => {
                    var order = {}
                    for (var i = 0; i < order.length; i++) {
                        var field = keyMapping[fields[i]] ? keyMapping[fields[i]] : fields[i]
                        order[field] = value[index]
                    }
                    orderList.push(order)
                })
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
                resolve(result)
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
        timeout(MAX_REQUEST_TIMEOUT, fetch(`/api/orders/fee?addr=${userAddr}src=${src}&dst=${dest}&src_amount=${src_amount}&dst_amount=${dst_amount}`))
            .then((response) => {
                return response.json()
            }).then((result) => {
                resolve(result.fee)
            })
            .catch((err) => {
                rejected(new Error("Cannot get user fee"))
            })
    })
}


export function getOrdersByIdArr(idArr){
    return new Promise((resolve, rejected) => {
        getOrders().then(orders => {
            var returnData = []
            for (var i = 0; i < idArr.length; i++){
                for (var j = 0; j <orders.length; j++){
                    if (orders[j].id === idArr[i]){
                        returnData.push(orders[j])
                        break
                    }
                }
            }
            resolve(returnData)
        }).catch(err => {
            console.log(err)
            rejected(err)
        })
    })
}