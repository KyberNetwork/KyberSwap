export default class FakeKeyStore {
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
      case 'success':
        return Promise.resolve("0xe64892ae67b8df29092e2573c1062b9c0de21ebee1310ef2c126d68f2d63e4e6")
          break;
      default:
        return Promise.reject("caw")
    }
  }
}
