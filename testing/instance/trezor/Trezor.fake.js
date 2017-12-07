import EthereumTx from "ethereumjs-tx"
import { unlock } from "../../../src/js/utils/keys"

export default class FakeTrezor {
  constructor(type) {
    this.type = type
  }

  callSignTransaction = (funcName, ...args) => {
    switch (this.type) {
      case "reject_sign":
        return Promise.reject({
          message: "Cannot sign transaction"
        })
        break;
      case 'success':
        const tx = new EthereumTx({
          chainId: 42,
          data: "0x93766a57000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee000000000000000000000000000000000000000000000000002386f26fc100000000000000000000000000008ac48aa26a7e25be12a9ddc83f6bbde1594414bb00000000000000000000000052249ee04a2860c42704c0bbc74bd82cb9b56e988000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000016288d4b6686258a3d0000000000000000000000000000000000000000000000000000000000000000",
          from: "0x52249ee04a2860c42704c0bbc74bd82cb9b56e98",
          gasLimit: "0xf4240",
          gasPrice: "0x4a817c800",
          nonce: 232,
          to: "0x2b7f9ae5a29ff7c387c8b794ed1f3cc45bbc57d0",
          value: "0x2386f26fc10000"
        })
        const keystring = '{"version":3,"id":"34ae5306-f3bf-42d3-bb0e-ce2e0fe1821b","address":"52249ee04a2860c42704c0bbc74bd82cb9b56e98","crypto":{"ciphertext":"aa638616d99f6f7a11ba205cd8b6dc09f064511d92361736718ba86c61b50c9d","cipherparams":{"iv":"d6fc865281ac8ed91af38cf933e8b916"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"d5358f4e1403c7c47f86b48f134b9e0fce57b3dd6eac726f0eed9e54d12735fe","c":10240,"prf":"hmac-sha256"},"mac":"086cab9258c953081d0d6f3ed077beca7ae6342229526a3fc8e3614d91e71636"}}'
        const password = '123qwe'
        const privKey = unlock(keystring, password, true)
        tx.sign(privKey)
        return Promise.resolve(tx)
        break;
      default:
        return Promise.reject("caw")
    }
  }

  sealTx = (params) => {
    var address_n = params.address_n
    var nonce = numberToHex(params.nonce).slice(2);
    if (nonce.length % 2) {
      nonce = '0' + nonce
    }
    var gasPrice = params.gasPrice.slice(2);
    if (gasPrice.length % 2) {
      gasPrice = '0' + gasPrice
    }
    var gasLimit = params.gasLimit.slice(2);
    if (gasLimit.length % 2) {
      gasLimit = '0' + gasLimit
    }
    var to = params.to.slice(2);
    var value = params.value.slice(2);
    if (value.length % 2) {
      value = '0' + value
    }
    var data = ""
    if (params.data) {
      data = params.data.slice(2)
      if (data.length % 2) {
        data = '0' + data
      }
    }

    var chain_id = params.chainId; // 1 for ETH, 61 for ETC
    return new Promise((resolve, reject) => {
      TrezorConnect.signEthereumTx(
        address_n,
        nonce,
        gasPrice,
        gasLimit,
        to,
        value,
        data,
        chain_id,
        function (response) {
          if (response.success) {
            var v = new Buffer([response.v]);
            var r = new Buffer(response.r, 'hex');
            var s = new Buffer(response.s, 'hex');
            var tx = new EthereumTx({
              nonce: params.nonce,
              gasPrice: params.gasPrice,
              gasLimit: params.gasLimit,
              to: params.to,
              value: params.value,
              data: params.data,
              v: v,
              r: r,
              s: s
            })
            resolve(tx)
          } else {
            reject(response.error)
          }
        })
    })
  }

}


