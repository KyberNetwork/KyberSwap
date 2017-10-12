let target = {
  NEW_BLOCK_INCLUDED_PENDING: 'GLOBAL.NEW_BLOCK_INCLUDED_PENDING',
  NEW_BLOCK_INCLUDED_FULFILLED: 'GLOBAL.NEW_BLOCK_INCLUDED_FULFILLED',
  GET_NEW_BLOCK_FAILED: 'GLOBAL.GET_NEW_BLOCK_FAILED',
  RATE_UPDATED_PENDING: 'GLOBAL.RATE_UPDATED_PENDING',
  RATE_UPDATED_FULFILLED: 'GLOBAL.RATE_UPDATED_FULFILLED',
  TERM_OF_SERVICE_ACCEPTED: 'GLOBAL.TERM_OF_SERVICE_ACCEPTED'
}
let handler = {
  get: (target, key) => {
    if (target.hasOwnProperty(key)) return target[key];
    else throw new Error(`Fired a wrong actionname: ${key}. Available Actions: ${Object.keys(target)}`);
  }
}
const proxy = new Proxy(target, handler)
export default proxy