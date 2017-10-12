import SupportedTokens from "./supported_tokens"
import Token from "./token"

export default class Account {
  constructor(address, keystring, name, desc, balance = 0, nonce = 0, tokens = {}, manualNonce = 0, joined = false, wallet, walletCreationTx, createdTime = Date.now()) {
    this.address = address
    this.key = keystring
    this.name = name
    this.description = desc
    this.balance = balance
    this.nonce = nonce
    this.tokens = tokens
    this.manualNonce = manualNonce
    this.joined = joined
    this.wallet = wallet
    this.walletCreationTx = walletCreationTx
    this.createdTime = createdTime
  }

  shallowClone() {
    return new Account(
      this.address, this.key, this.name, this.description,
      this.balance, this.nonce, this.tokens, this.manualNonce,
      this.joined, this.wallet, this.walletCreationTx, this.createdTime )
  }

  getUsableNonce() {
    var nonceFromNode = this.nonce
    var nonceManual = this.manualNonce
    return nonceFromNode < nonceManual ? nonceManual : nonceFromNode
  }

  setPrivKey(key) {
    const acc = this.shallowClone()
    acc.privKey = key;
    return acc
  }

  updateKey(keystring) {
    const acc = this.shallowClone()
    acc.key = keystring
    return acc
  }

  sync(ethereum, account){
      var promise
      const _this = account ? account: this
      _this.tokens = {}
      for (var i = 0; i < SupportedTokens.length; i++ ) {
        var tok = SupportedTokens[i];
        _this.addToken(
          new Token(tok.name, tok.icon, tok.symbol, tok.address, _this.address)
        )
      }
      
      promise = new Promise((resolve, reject) => {
        const acc = _this.shallowClone()
        ethereum.getBalance(acc.address, (balance) => {
          acc.balance = balance
          resolve(acc)
        })
      })

      promise = promise.then((acc) => {
        return new Promise((resolve, reject) => {
          ethereum.getNonce(acc.address, (nonce) => {
            acc.nonce = nonce
            if (acc.nonce > acc.manualNonce) {
              acc.manualNonce = acc.nonce
            }
            resolve(acc)
          })
        })
      })

      Object.keys(_this.tokens).forEach((key) => {
        promise = promise.then((acc) => {
          return new Promise((resolve, reject) => {
            acc.tokens[key].sync(ethereum, (token) => {
              acc.tokens[key] = token
              resolve(acc)
            })
          })
        })
      })

      return promise
  }

  // sync(ethereum, callback) {
  //   var promise
  //   promise = new Promise((resolve, reject) => {
  //     const acc = this.shallowClone()
  //     ethereum.getBalance(acc.address, (balance) => {
  //       acc.balance = balance
  //       resolve(acc)
  //     })
  //   })

  //   promise = promise.then((acc) => {
  //     return new Promise((resolve, reject) => {
  //       ethereum.getNonce(acc.address, (nonce) => {
  //         acc.nonce = nonce
  //         if (acc.nonce > acc.manualNonce) {
  //           acc.manualNonce = acc.nonce
  //         }
  //         resolve(acc)
  //       })
  //     })
  //   })

  //   Object.keys(this.tokens).forEach((key) => {
  //     promise = promise.then((acc) => {
  //       return new Promise((resolve, reject) => {
  //         acc.tokens[key].sync(ethereum, (token) => {
  //           acc.tokens[key] = token
  //           resolve(acc)
  //         })
  //       })
  //     })
  //   })

  //   promise.then((acc) => {
  //     callback(acc)
  //   })
  // }

  incManualNonce() {
    const acc = this.shallowClone()
    acc.manualNonce = acc.manualNonce + 1
    return acc
  }

  addToken(token) {
    const acc = this.shallowClone()
    acc.tokens[token.address] = token;
    return acc
  }
}
