import * as keyService from "./baseKey"
import TrezorConnect from "../../services/device/trezor/trezor-connect";
import EthereumTx from "ethereumjs-tx"
import { numberToHex } from "../../utils/converter"

const defaultDPath = "m/44'/60'/0'/0";

export default class Trezor {

  getPublicKey = (path = defaultDPath) => {
    return new Promise((resolve, reject) => {
      TrezorConnect.getXPubKey(path, (result) => {
          if (result.success) {
            result.dPath = path;
            resolve(result);
          } else {
            var err = 'Cannot connect to trezor'
            if (result.toString() == 'Error: Not a valid path.') {
              err = 'This path not supported by Trezor'
            }
            reject(err)
          }
      })
    });
  }

  callSignTransaction = (funcName, ...args) => {
    const { txParams, keystring, } = keyService[funcName](...args)
    txParams.address_n = keystring
    return this.sealTx(txParams)
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
