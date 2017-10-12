let target = {
  SET_DATA_MODAL: 'UTIL.SET_DATA_MODAL',
  MODAL_OPEN: 'UTIL.MODAL_OPEN',
  MODAL_CLOSE: 'UTIL.MODAL_CLOSE',
  SHOW_RATE: 'UTIL.SHOW_RATE',
  HIDE_RATE: 'UTIL.HIDE_RATE',
  SHOW_CONTROL: 'UTIL.SHOW_CONTROL',
  HIDE_CONTROL: 'UTIL.HIDE_CONTROL'  
}
let handler = {
  get: (target, key) => {
    if (target.hasOwnProperty(key)) return target[key];
    else throw new Error(`Fired a wrong actionname: ${key}. Available Actions: ${Object.keys(target)}`);
  }
}
const proxy = new Proxy(target, handler)
export default proxy