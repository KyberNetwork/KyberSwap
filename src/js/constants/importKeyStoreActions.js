let target = {
  ACCOUNT_NAME_SPECIFIED: 'IMPORT_KEY.ACCOUNT_NAME_SPECIFIED',
  ACCOUNT_DESC_SPECIFIED: 'IMPORT_KEY.ACCOUNT_DESC_SPECIFIED',
  ACCOUNT_KEY_UPLOADED: 'IMPORT_KEY.ACCOUNT_KEY_UPLOADED',
  ACCOUNT_ERROR_THREW: 'IMPORT_KEY.ACCOUNT_ERROR_THREW',
  ACCOUNT_FORM_EMPTIED: 'IMPORT_KEY.ACCOUNT_FORM_EMPTIED'
}
let handler = {
  get: (target, key) => {
    if (target.hasOwnProperty(key)) return target[key];
    else throw new Error(`Fired a wrong actionname: ${key}. Available Actions: ${Object.keys(target)}`);
  }
}
const proxy = new Proxy(target, handler)
export default proxy