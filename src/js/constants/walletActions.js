let target = {
  NEW_WALLET_ADDED_PENDING: 'WALLET_ACTION.NEW_WALLET_ADDED_PENDING',
  NEW_WALLET_ADDED_FULFILLED: 'WALLET_ACTION.NEW_WALLET_ADDED_FULFILLED',
  ADD_DELETE_WALLET: 'WALLET_ACTION.ADD_DELETE_WALLET',
  DELETE_WALLET: 'WALLET_ACTION.DELETE_WALLET',
  UPDATE_WALLET_PENDING: 'WALLET_ACTION.UPDATE_WALLET_PENDING',
  UPDATE_WALLET_FULFILLED: 'WALLET_ACTION.UPDATE_WALLET_FULFILLED',
  MODIFY_WALLET: 'WALLET_ACTION.MODIFY_WALLET',
  SORT_WALLET_BY_FIELD: 'WALLET_ACTION.SORT_WALLET_BY_FIELD'
}
let handler = {
  get: (target, key) => {
    if (target.hasOwnProperty(key)) return target[key];
    else throw new Error(`Fired a wrong actionname: ${key}. Available Actions: ${Object.keys(target)}`);
  }
}
const proxy = new Proxy(target, handler)
export default proxy