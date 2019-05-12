import React from 'react';

import * as keyService from "./baseKey"
import TrezorConnect from 'trezor-connect';

import EthereumTx from "ethereumjs-tx"
import { numberToHex } from "../../utils/converter"
import { getTranslate } from 'react-localize-redux'
import EthereumService from "../ethereum/ethereum"
import { store } from "../../store"

const defaultDPath = "m/44'/60'/0'/0";

export default class Trezor  extends React.Component {

    constructor(props) {
    super(props);

    TrezorConnect.manifest({
      email: 'andrew@kyber.network',
      appUrl: 'http://kyberswap.com'
    });
  }

  getPublicKey = (path = defaultDPath) => {
    var translate = getTranslate(store.getState().locale)
    return new Promise((resolve, reject) => {
      TrezorConnect.getPublicKey({ path }).then(function (result) {
        if (result.success) {
          result = { ...result.payload };
          // result.dPath = path;
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


  async signSignature(data, account) {
    try {
      var signature = await TrezorConnect.signMessage( {
        path: account.keystring,
        message: data
      });
      return signature
    }catch(err){
      console.log(err)
      throw err
    }    
  }

  async broadCastTx(funcName, ...args) {
    try{
      var txRaw = await this.callSignTransaction(funcName, ...args)
      try{
        var ethereum = new EthereumService()
        var txHash = await ethereum.callMultiNode("sendRawTransaction", txRaw)
        return txHash
      }catch(err){
        console.log(err)
        throw err
      }
      
    }catch(err){
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
}
