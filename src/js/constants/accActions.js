let target = {
  NEW_ACCOUNT_CREATED_PENDING: 'ACC_ACTION.NEW_ACCOUNT_CREATED_PENDING',
  NEW_ACCOUNT_CREATED_FULFILLED: 'ACC_ACTION.NEW_ACCOUNT_CREATED_FULFILLED',  
}
let handler = {
  get: (target, key) => {
    if (target.hasOwnProperty(key)) return target[key];
    else throw new Error(`Fired a wrong actionname: ${key}. Available Actions: ${Object.keys(target)}`);
  }
}
const proxy = new Proxy(target, handler)
export default proxy