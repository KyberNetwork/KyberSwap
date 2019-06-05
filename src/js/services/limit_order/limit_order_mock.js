import { timeout } from "../../utils/common"
import BLOCKCHAIN_INFO from "../../../../env"
import BigNumber from "bignumber.js";

const MAX_REQUEST_TIMEOUT = 3000

const data = [
    {
        id: 2,
        source: "KNC",
        dest: "WETH",
        user_address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
        nonce: 1290,
        src_amount: 0.1,
        min_rate: 0.002604,
        fee: 0.1,
        status: "open",
        created_time: 1557544645,
        cancel_time: 1557307228
    },
    {
        id: 1,
        source: "WETH",
        dest: "DAI",
        user_address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
        nonce: 1290,
        src_amount: 0.123,
        min_rate: 0.123,
        fee: 0.1,
        status: "open",
        msg: ["Your balance is smaller than order amount", "Your allowance is smaller than source amount"],
        created_time: 1556784881,
        cancel_time: 1557371845
    }, {
        id: 3,
        source: "USDC",
        dest: "TUSD",
        user_address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
        nonce: 1290,
        src_amount: 50,
        min_rate: 0.123,
        fee: 0.1,
        status: "cancelled",
        created_time: 1555298245,
        cancel_time: 1556785883
    }, {
        id: 4,
        source: "KNC",
        dest: "TUSD",
        user_address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
        nonce: 1290,
        src_amount: 5000,
        min_rate: 0.123,
        fee: 0.1,
        status: "filled",
        created_time: 1546334424,
        cancel_time: 1556767045
    }, {
        id: 5,
        source: "WETH",
        dest: "TUSD",
        user_address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
        nonce: 1290,
        src_amount: 0.027,
        min_rate: 0.123,
        fee: 0.1,
        status: "in_progress",
        created_time: 1551496645,
        cancel_time: 1538299225
    }, {
        id: 6,
        source: "WETH",
        dest: "TUSD",
        user_address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
        nonce: 1290,
        src_amount: 2.5678,
        min_rate: 0.123,
        fee: 0.1,
        status: "invalidated",
        msg: ["Order nonce is smaller than your order in smartcontract"],
        created_time: 1569835224,
        cancel_time: 1556785883
    }, {
        id: 7,
        source: "MKR",
        dest: "TUSD",
        user_address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
        nonce: 1290,
        src_amount: 1.234,
        min_rate: 0.123,
        fee: 0.1,
        status: "open",
        created_time: 1569835224,
        cancel_time: 1556785883
    }, {
        id: 8,
        source: "MKR",
        dest: "TUSD",
        user_address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
        nonce: 1290,
        src_amount: 0.001,
        min_rate: 0.123,
        fee: 0.1,
        status: "open",
        created_time: 1569835224,
        cancel_time: 1556785883
    }, {
        id: 9,
        source: "MKR",
        dest: "TUSD",
        user_address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
        nonce: 1290,
        src_amount: 0.02,
        min_rate: 0.123,
        fee: 0.1,
        status: "in_progress",
        created_time: 1569835224,
        cancel_time: 1556785883
    }, {
        id: 10,
        source: "WETH",
        dest: "DAI",
        user_address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
        nonce: 1290,
        src_amount: 0.01,
        min_rate: 605.5266,
        fee: 0.1,
        status: "filled",
        created_time: 1569835224,
        cancel_time: 1556785883
    }, {
        id: 11,
        source: "WETH",
        dest: "KNC",
        user_address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
        nonce: 1290,
        src_amount: 0.02,
        min_rate: 380.9035,
        fee: 0.1,
        status: "cancelled",
        created_time: 1569835224,
        cancel_time: 1556785883
    }, {
        id: 12,
        source: "KNC",
        dest: "DAI",
        user_address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
        nonce: 1290,
        src_amount: 10,
        min_rate: 1.745748,
        fee: 0.1,
        status: "invalidated",
        created_time: 1569835224,
        cancel_time: 1556785883
    }, {
        id: 13,
        source: "KNC",
        dest: "WETH",
        user_address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
        nonce: 1290,
        src_amount: 10,
        min_rate: 0.0029,
        fee: 0.1,
        status: "in_progress",
        created_time: 1569835224,
        cancel_time: 1556785883
    }
];


export function getOrders() {
    return new Promise((resolve, rejected) => {
        resolve(data);
        return;
    })
}


export function submitOrder(order) {
    return new Promise((resolve, rejected) => {
        const newOrder = { ...order };
        newOrder.cancel_time = 0;
        newOrder.created_time = new Date().getTime() / 1000;
        newOrder.status = "open"
        newOrder.id = Math.floor(Date.now() / 1000)
        newOrder.src_amount = new BigNumber(order.src_amount).div(Math.pow(10, 18)).toString();
        newOrder.fee = new BigNumber(order.fee).div(Math.pow(10, 4)).toString();
        newOrder.min_rate = new BigNumber(order.min_rate).div(Math.pow(10, 18)).toString();
        // data.push(newOrder);
        resolve(newOrder);
        return;
    })
}


export function cancelOrder(order) {
    return new Promise((resolve, rejected) => {
        const target = data.filter(item => item.id === order.id);

        if (target.length > 0) {
            const newOrder = {...target[0]};
            const index = data.indexOf(target[0]);
            newOrder.cancel_time = new Date().getTime() / 1000;
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
        resolve(0.4)
    })
}


export function getOrdersByIdArr(idArr){
    return new Promise((resolve, rejected) => {
        var returnData = []
        for (var i = 0; i < idArr.length; i++){
            for (var j = 0; j <data.length; j++){
                if (data[j].id === idArr[i]){
                    returnData.push(data[j])
                    break
                }
            }
        }
        resolve(returnData)
    })
}