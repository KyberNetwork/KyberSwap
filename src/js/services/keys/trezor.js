import * as keyService from "./baseKey"
import TrezorConnect from 'trezor-connect';
import EthereumTx from "ethereumjs-tx"
import { getTranslate } from 'react-localize-redux'
import EthereumService from "../ethereum/ethereum"
import { store } from "../../store"
import * as converter from "../../utils/converter"

export default class Trezor {
  constructor() {
    TrezorConnect.manifest({
      email: 'andrew@kyber.network',
      appUrl: 'http://kyberswap.com'
    });
  }

  getPublicKey = (path) => {
    var translate = getTranslate(store.getState().locale)
    return new Promise((resolve, reject) => {
      TrezorConnect.getPublicKey({ path }).then(function (result) {
        if (result.success) {
          result = { ...result.payload };
          result.dPath = path;
          resolve(result);
        } else {
          var err = translate("error.cannot_connect_trezor") || 'Cannot connect to trezor'
          if (result.toString() == 'Error: Not a valid path.') {
            err = translate("error.path_not_support_by_trezor") || 'This path not supported by Trezor'
          }
          reject(err)
        }
      });
    });
  }


  async signSignature(message, account) {
    try {
      var signature = await TrezorConnect.ethereumSignMessage({
        path: account.keystring,
        message: message,
        hex: true
      });
      if(signature.payload.error){
        throw new Error(signature.payload.error)
        return
      }
      signature = "0x" + signature.payload.signature                  

      return signature
    } catch (err) {
      console.log(err)
      throw err
    }
  }

  async broadCastTx(funcName, ...args) {
    try {
      var txRaw = await this.callSignTransaction(funcName, ...args)
      try {
        var ethereum = new EthereumService()
        var txHash = await ethereum.callMultiNode("sendRawTransaction", txRaw)
        return txHash
      } catch (err) {
        console.log(err)
        throw err
      }

    } catch (err) {
      console.log(err)
      throw err
    }
  }

  callSignTransaction = (funcName, ...args) => {
    return new Promise((resolve, reject) => {
      keyService[funcName](...args).then(result => {
        const { txParams, keystring, } = result
        txParams.address_n = keystring
        this.sealTx(txParams).then(result => {
          resolve(result)
        }).catch(e => {
          reject(e)
        })
      }).catch(e => {
        reject(e)
      })
    })
  }

  convertTrezorFormat = (param) => {
    var outputWithFormat = param
    if (isNaN) {
      outputWithFormat = converter.toHex(outputWithFormat)
    }
    outputWithFormat = outputWithFormat.slice(2)
    if (outputWithFormat.length % 2) {
      outputWithFormat = '0' + outputWithFormat
    }
    return outputWithFormat
  }

  sealTx = (params) => {
    console.log(params)
    var address_n = params.address_n
    var nonce = this.convertTrezorFormat(params.nonce)

    var gasPrice = this.convertTrezorFormat(params.gasPrice);

    var gasLimit = this.convertTrezorFormat(params.gasLimit)

    var to = params.to.slice(2);

    var value = this.convertTrezorFormat(params.value);

    var data = ""
    if (params.data) {
      data = this.convertTrezorFormat(params.data);
    }

    var chain_id = params.chainId; // 1 for ETH, 61 for ETC
    return new Promise((resolve, reject) => {
      TrezorConnect.ethereumSignTransaction(
        {
          path: address_n,
          transaction: {
            to,
            value,
            data,
            chainId: chain_id,
            nonce,
            gasLimit,
            gasPrice
          }
        })
        .then(response => {
          console.log("trezor_response")
          console.log(response)
          if (response.success) {
            var tx = new EthereumTx({
              from: params.from,
              nonce: params.nonce,
              gasPrice: params.gasPrice,
              gasLimit: params.gasLimit,
              to: params.to,
              value: params.value,
              data: params.data,
              v: response.payload.v,
              r: response.payload.r,
              s: response.payload.s
            })
            resolve(tx)
          } else {
            reject(response.payload.error)
          }
        })
    })
  }
  
  getWalletName = () => {
    return 'Trezor';
  }
}
