let target = {
  MODIFY_WALLET_NAME_SPECIFIED: 'MODIFY_WALLET.MODIFY_WALLET_NAME_SPECIFIED',
  MODIFY_WALLET: 'MODIFY_WALLET.MODIFY_WALLET',
  MODIFY_WALLET_ERROR_THREW: 'MODIFY_WALLET.MODIFY_WALLET_ERROR_THREW',
  MODIFY_WALLET_FORM_EMPTIED: 'MODIFY_WALLET.MODIFY_WALLET_FORM_EMPTIED'
}
let handler = {
  get: (target, key) => {
    if (target.hasOwnProperty(key)) return target[key];
    else throw new Error(`Fired a wrong actionname: ${key}. Available Actions: ${Object.keys(target)}`);
  }
}
const proxy = new Proxy(target, handler)
export default proxy