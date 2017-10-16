let target = {
  SAVE_KEYSTORE: 'IMPORT.SAVE_KEYSTORE',
  THROW_ERROR: 'IMPORT.THROW_ERROR',
  END_SESSION: 'IMPORT.END_SESSION'
}
let handler = {
  get: (target, key) => {
    if (target.hasOwnProperty(key)) return target[key];
    else throw new Error(`Fired a wrong actionname: ${key}. Available Actions: ${Object.keys(target)}`);
  }
}
const proxy = new Proxy(target, handler)
export default proxy