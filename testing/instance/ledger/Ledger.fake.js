export default class FakeLedger {
  constructor(type){
    this.type = type
  }

  callSignTransaction = (funcName, ...args) => {
    switch(this.type) {
      case "reject_sign":
        return Promise.reject({
          message: "Cannot sign transaction"
        })
        break;
      case 'n':
        return Promise.reject("caw")
          break;
      default:
        return Promise.reject("caw")
    }
  }
}
