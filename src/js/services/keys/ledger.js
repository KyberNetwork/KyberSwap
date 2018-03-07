import * as keyService from "./baseKey"
import EthereumTx from "ethereumjs-tx"
import { signLedgerTransaction, connectLedger, getLedgerPublicKey } from "../../services/device/device"
import * as ethUtil from 'ethereumjs-util'

import { store } from "../../store"
import { CONFIG_ENV_LEDGER_LINK, LEDGER_SUPPORT_LINK } from "../constants"
import { getTranslate } from 'react-localize-redux'

const defaultDPath = "m/44'/60'/0'";

export default class Ledger {

  getPublicKey = (path = defaultDPath, isOpenModal) => {
    var translate = getTranslate(store.getState().locale)
    return new Promise((resolve, reject) => {
      connectLedger().then((eth) => {
        getLedgerPublicKey(eth, path)
          //  eth.getAddress_async(path, false, true)
          .then((result) => {
            result.dPath = path;
            resolve(result);
          })
          .catch((err) => {
            console.log(err)
            let errorMsg
            switch (err.statusCode) {
              case 26625:
                if (isOpenModal) {
                  errorMsg = translate("error.invalid_path_or_session_expired") || 'Cannot get address from this path. Please check your path is valid or Ledger is connected.'
                } else {
                  errorMsg = translate("error.ledger_time_out") || 'Your session on Ledger is expired. Please log in  again to continue.'
                }
                break
              // case 'Invalid status 6a80':
              // case 'Invalid status 6804':
              //   errorMsg = translate("error.path_is_invalid") || 'Invalid path. Please choose another one.'
              //   break
              default:
                if (err.errorCode == 1) {
                  errorMsg = translate("error.need_to_config_env_ledger", { link: CONFIG_ENV_LEDGER_LINK })
                } else {
                  errorMsg = translate("error.ledger_global_err", { link: LEDGER_SUPPORT_LINK })
                }
            }
            reject(errorMsg)
          });
      }).catch(e => {
        reject(translate("error.ledger_global_err", { link: LEDGER_SUPPORT_LINK }))
      })
    });
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
      })
    })
    // const { txParams, keystring, } = keyService[funcName](...args)
    // txParams.address_n = keystring
    // return this.sealTx(txParams)
  }

  getLedgerError(error) {
    let translate = getTranslate(store.getState().locale)
    switch (error.statusCode) {
      case 27264: {
        let link = 'https://support.ledgerwallet.com/hc/en-us/articles/115005200709'
        return translate('error.ledger_not_enable_contract', { link: link })
      }
      case 27013: {
        //user denied
        return ""
      }
      default: {
        let link = LEDGER_SUPPORT_LINK
        return translate("error.ledger_global_err", { link: link })
      }
    }
  }

  sealTx = (params) => {
    const eTx = new EthereumTx(params)
    eTx.raw[6] = Buffer.from([params.chainId])
    let txToSign = ethUtil.rlp.encode(eTx.raw)
    return new Promise((resolve, reject) => {
      //let timeout = 60
      connectLedger().then((eth) => {
        signLedgerTransaction(eth, params.address_n, txToSign.toString('hex')).then((response) => {
          params.v = "0x" + response['v']
          params.r = "0x" + response['r']
          params.s = "0x" + response['s']
          var tx = new EthereumTx(params)
          resolve(tx)
        }).catch(err => {
          console.log(err)
          reject(err)
        })
      }).catch((err) => {
        console.log(err)
        reject(err)
      })
    })
  }
}
