export default class Account {
  constructor(address, keystring, name, desc, balance, nonce, tokens, manualNonce) {
    this.address = address
    this.key = keystring
    this.name = name
    this.description = desc
    this.balance = balance || 0
    this.nonce = nonce || 0
    this.tokens = tokens || {}
    this.manualNonce = manualNonce || 0
  }

  shallowClone() {
    return new Account(
      this.address, this.key, this.name, this.description,
      this.balance, this.nonce, this.tokens, this.manualNonce)
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

  sync(ethereum) {
    const acc = this.shallowClone()
    acc.balance = ethereum.getBalance(acc.address)
    acc.nonce = ethereum.getNonce(acc.address)
    var BigNumber = ethereum.BigNumber
    var intNonce = acc.nonce
    var intManualNonce = acc.manualNonce
    if (intNonce > intManualNonce) {
      acc.manualNonce = intNonce
    }
    var newTokens = {};
    Object.keys(acc.tokens).forEach((key) => {
      newTokens[key] = acc.tokens[key].sync(ethereum);
    });
    acc.tokens = newTokens;
    return acc
  }

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
