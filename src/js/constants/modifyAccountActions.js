let target = {
  MODIFY_ACCOUNT_NAME_SPECIFIED: 'MODIFY_ACCOUNT.MODIFY_ACCOUNT_NAME_SPECIFIED',
  MODIFY_ACCOUNT: 'MODIFY_ACCOUNT.MODIFY_ACCOUNT',
  MODIFY_ACCOUNT_ERROR_THREW: 'MODIFY_ACCOUNT.MODIFY_ACCOUNT_ERROR_THREW',
  MODIFY_ACCOUNT_FORM_EMPTIED: 'MODIFY_ACCOUNT.MODIFY_ACCOUNT_FORM_EMPTIED'
}
let handler = {
  get: (target, key) => {
    if (target.hasOwnProperty(key)) return target[key];
    else throw new Error(`Fired a wrong actionname: ${key}. Available Actions: ${Object.keys(target)}`);
  }
}
const proxy = new Proxy(target, handler)
export default proxy