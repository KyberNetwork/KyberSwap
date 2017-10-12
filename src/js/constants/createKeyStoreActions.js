let target = {
  CREATE_ACCOUNT_NAME_SPECIFIED: 'CREATE_ACC_ACTION.CREATE_ACCOUNT_NAME_SPECIFIED',
  CREATE_ACCOUNT_DESC_SPECIFIED: 'CREATE_ACC_ACTION.CREATE_ACCOUNT_DESC_SPECIFIED',
  CREATE_ACCOUNT_ERROR_THREW: 'CREATE_ACC_ACTION.CREATE_ACCOUNT_ERROR_THREW',
  CREATE_ACCOUNT_FORM_EMPTIED: 'CREATE_ACC_ACTION.CREATE_ACCOUNT_FORM_EMPTIED'
}
let handler = {
  get: (target, key) => {
    if (target.hasOwnProperty(key)) return target[key];
    else throw new Error(`Fired a wrong actionname: ${key}. Available Actions: ${Object.keys(target)}`);
  }
}
const proxy = new Proxy(target, handler)
export default proxy