let target = {
  TX_ADDED: 'TX.TX_ADDED',
  UPDATE_TX_PENDING: 'TX.UPDATE_TX_PENDING',
  UPDATE_TX_FULFILLED: 'TX.UPDATE_TX_FULFILLED',
  UPDATE_TX_REJECTED: 'TX.UPDATE_TX_REJECTED',
}
let handler = {
  get: (target, key) => {
    if (target.hasOwnProperty(key)) return target[key];
    else throw new Error(`Fired a wrong actionname: ${key}. Available Actions: ${Object.keys(target)}`);
  }
}
const proxy = new Proxy(target, handler)
export default proxy