import { timeout } from "../../utils/common"
import BLOCKCHAIN_INFO from "../../../../env"

const MAX_REQUEST_TIMEOUT = 3000

const data = [
  {
    id: 2,
    source: "KNC",
    dest: "WETH",
    address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
    nonce: 1290,
    src_amount: 0.123,
    min_rate: 0.002604,
    fee: 0.1,
    status: "active",
    created_time: 1557544645,
    cancel_time: 1557307228
  },
  {
    id: 3,
    source: "USDC",
    dest: "TUSD",
    address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
    nonce: 1290,
    src_amount: 50,
    min_rate: 0.123,
    fee: 0.1,
    status: "active",
    created_time: 1555298245,
    cancel_time: 1556785883
  },
  {
    id: 5,
    source: "BNB",
    dest: "TUSD",
    address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
    nonce: 1290,
    src_amount: 1000,
    min_rate: 0.123,
    fee: 0.1,
    status: "active",
    created_time: 1551496645,
    cancel_time: 1538299225
  },
  {
    id: 6,
    source: "ETH",
    dest: "TUSD",
    address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
    nonce: 1290,
    src_amount: 0.02,
    min_rate: 0.123,
    fee: 0.1,
    status: "active",
    created_time: 1569835224,
    cancel_time: 1556785883
  },
  {
    id: 7,
    source: "MKR",
    dest: "TUSD",
    address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
    nonce: 1290,
    src_amount: 1.234,
    min_rate: 0.123,
    fee: 0.1,
    status: "active",
    created_time: 1569835224,
    cancel_time: 1556785883
  },
  {
    id: 8,
    source: "MKR",
    dest: "TUSD",
    address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
    nonce: 1290,
    src_amount: 0.001,
    min_rate: 0.123,
    fee: 0.1,
    status: "active",
    created_time: 1569835224,
    cancel_time: 1556785883
  },
  {
    id: 1,
    source: "ETH",
    dest: "DAI",
    address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
    nonce: 1290,
    src_amount: 0.05,
    min_rate: 0.123,
    fee: 0.1,
    status: "cancel",
    created_time: 1556784881,
    cancel_time: 1557371845
  }, {
    id: 4,
    source: "KNC",
    dest: "TUSD",
    address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
    nonce: 1290,
    src_amount: 5000,
    min_rate: 0.123,
    fee: 0.1,
    status: "filled",
    created_time: 1546334424,
    cancel_time: 1556767045
  }, {
    id: 9,
    source: "MKR",
    dest: "TUSD",
    address: "0x3Cf628d49Ae46b49b210F0521Fbd9F82B461A9E1",
    nonce: 1290,
    src_amount: 0.02,
    min_rate: 0.123,
    fee: 0.1,
    status: "cancel",
    created_time: 1569835224,
    cancel_time: 1556785883
  }
];


export function getOrders() {
  return new Promise((resolve, rejected) => {
    resolve(data);
    return;

    timeout(MAX_REQUEST_TIMEOUT, fetch('/user/orders'))
      .then((response) => {
        return response.json()
      }).then((result) => {
      if (!result.error) {
        resolve(result.data)
      } else {
        rejected(new Error("Cannot get user orders"))
      }
    })
      .catch((err) => {
        rejected(new Error("Cannot get user orders"))
      })
  })
}


export function submitOrder(order) {
  return new Promise((resolve, rejected) => {
    const newOrder = { ...order };
    newOrder.cancel_time = 0;
    newOrder.created_time = new Date().getTime() / 1000;
    newOrder.status = "active"
    resolve(newOrder);
    return;
    timeout(MAX_REQUEST_TIMEOUT, fetch('/user/submit_order', {
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
      if (!result.error) {
        resolve(result.data)
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
    const newOrder = { ...order };
    newOrder.cancel_time = new Date().getTime() / 1000;
    newOrder.status = "cancel";
    resolve(newOrder);
    return;

    timeout(MAX_REQUEST_TIMEOUT, fetch('/user/cancel_order', {
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
      if (!result.error) {
        resolve("Cancel order successfully")
      } else {
        rejected(new Error("Cannot cancel order"))
      }
    })
      .catch((err) => {
        rejected(new Error("Cannot cancel order"))
      })
  })
}


export function getNonce(userAddr, source, dest) {
  return new Promise((resolve, rejected) => {
    resolve(1)
  })
}


export function getFee(userAddr, source, dest) {
  return new Promise((resolve, rejected) => {
    resolve(0.4)
  })
}
