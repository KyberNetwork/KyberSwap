import * as keyService from "./baseKey"
import EthereumTx from "ethereumjs-tx"
import * as ethUtil from 'ethereumjs-util'
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import Eth from "@ledgerhq/hw-app-eth";
import { store } from "../../store"
import { CONFIG_ENV_LEDGER_LINK, LEDGER_SUPPORT_LINK } from "../constants"
import { getTranslate } from 'react-localize-redux'
import EthereumService from "../ethereum/ethereum"

export default class Ledger {
  connectLedger = () => {
    return new Promise((resolve, reject) => {
      TransportU2F.create(20000).then(transport => {
        var eth = new Eth(transport)
        resolve(eth)
      }).catch(e => {
        console.log(e)
        reject(e)
      })
    });
  }

  signLedgerTransaction = (eth, path, raxTxHex) => {
    return new Promise((resolve, reject) => {
      eth.signTransaction(path, raxTxHex)
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          console.log(err)
          reject(err)
        });

    });
  }

  getLedgerPublicKey = (eth, path) => {
    return new Promise((resolve, reject) => {
      eth.getAddress(path, false, true)
        .then((result) => {
          resolve(result)
        })
        .catch((err) => {
          reject(err)
        });
    });
  }

  getPublicKey = (path, isOpenModal) => {
    var translate = getTranslate(store.getState().locale)
    return new Promise((resolve, reject) => {
      this.connectLedger().then((eth) => {
        this.getLedgerPublicKey(eth, path)
          .then((result) => {
            result.dPath = path;
            resolve(result);
          })
          .catch((err) => {
            let errorMsg
            switch (err.statusCode) {
              case 26625:
                if (isOpenModal) {
                  errorMsg = translate("error.invalid_path_or_session_expired") || 'Cannot get address from this path. Please check your path is valid or Ledger is connected.'
                } else {
                  errorMsg = translate("error.ledger_time_out") || 'Your session on Ledger is expired. Please log in  again to continue.'
                }
                break
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

  async signSignature(message, account) {
    try {
      var eth = await this.connectLedger()
      var signature = await eth.signPersonalMessage(account.keystring, message.substring(2))

      var v = signature['v'];
      v = v.toString(16);
      if (v.length < 2) {
        v = "0" + v;
      }

      return "0x" + signature.r + signature.s + v;
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
      })
    })
  }

  getLedgerError(error) {
    let translate = getTranslate(store.getState().locale)
    switch (error.statusCode) {
      case 27264: {
        let link = 'https://support.ledgerwallet.com/hc/en-us/articles/115005200709'
        return translate('error.ledger_not_enable_contract', { link: link })
      }
      case 27013: {
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
      this.connectLedger().then((eth) => {
        this.signLedgerTransaction(eth, params.address_n, txToSign.toString('hex')).then((response) => {
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
  
  getWalletName = () => {
    return 'Ledger';
  }
}
