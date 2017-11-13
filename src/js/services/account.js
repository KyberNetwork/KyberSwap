import Token from "./token"

export default class Account {
  constructor(address, type, keystring, balance = 0, nonce = 0, manualNonce = 0, avatar) {
    this.address = address
    this.type = type
    this.keystring = keystring
    this.balance = balance
    this.nonce = nonce
    this.manualNonce = manualNonce
    this.avatar = avatar
  }

  shallowClone() {
    return new Account(
      this.address, this.type, this.keystring,
      this.balance, this.nonce, this.manualNonce, this.avatar)
  }

  getUsableNonce() {
    var nonceFromNode = this.nonce
    var nonceManual = this.manualNonce
    return nonceFromNode < nonceManual ? nonceManual : nonceFromNode
  }

  sync(ethereum, account) {
    console.log("run to sync -----------------")
    var promise
    const _this = account ? account : this
    promise = new Promise((resolve, reject) => {
      const acc = _this.shallowClone()
      ethereum.call("getBalance")(acc.address).then((balance) => {
        acc.balance = balance
        console.log("111111111111111111111")
        resolve(acc)
      })
    })

    promise = promise.then((acc) => {
      return new Promise((resolve, reject) => {
        ethereum.call("getNonce")(acc.address).then((nonce) => {
          acc.nonce = nonce
          if (acc.nonce > acc.manualNonce) {
            acc.manualNonce = acc.nonce
          }
          console.log("22222222222222222222")
          resolve(acc)
        })
      })
    })
    return promise
  }

  incManualNonce() {
    const acc = this.shallowClone()
    acc.manualNonce = acc.manualNonce + 1
    return acc
  }
}
