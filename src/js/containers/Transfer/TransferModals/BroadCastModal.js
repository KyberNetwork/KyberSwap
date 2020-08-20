import React from "react"
import { Modal } from "../../../components/CommonElement"

import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as exchangeActions from "../../../actions/exchangeActions"
import * as accountActions from "../../../actions/accountActions"
import * as transferActions from "../../../actions/transferActions"
import {goToRoute} from "../../../actions/globalActions"

import constants from "../../../services/constants"

import * as converter from "../../../utils/converter"
import {sleep} from "../../../utils/common"

import { getWallet } from "../../../services/keys"
import { FeeDetail } from "../../../components/CommonElement"
import { TransactionLoadingView } from "../../../components/Transaction"






import BLOCKCHAIN_INFO from "../../../../../env"

@connect((store) => { 
  return {
    exchange: store.exchange,
    transfer: store.transfer,
    account: store.account,
    translate: getTranslate(store.locale),
    global: store.global,
    tokens: store.tokens.tokens,
    ethereum: store.connection.ethereum
  }
})

export default class BroadCastModal extends React.Component {


  constructor() {
    super();
    this.state = {
      isCopied: false,      
      txStatus: "pending",
      intervalNotify: false     
    }
  }


  componentDidMount = () => {
    //update tx
    if (this.props.transfer.tx)  {
      var ethereum = this.props.ethereum
      var tx = this.props.transfer.tx
      this.checkTxStatus(ethereum, tx)      
    }
  }

  async checkTxStatus(ethereum, tx){    
    try{
      var newTx = await tx.sync(ethereum, tx)      
      this.setState({txStatus: newTx.status})

      switch(newTx.status){
        case "success":
          try{
            var notiService = this.props.global.notiService
            notiService.callFunc("changeStatusTx",newTx)

            if(this.props.account.account){
              this.props.global.analytics.callTrack("txMinedStatus", newTx.hash, "kyber", "transfer", "success", this.props.account.account.address, this.props.account.account.type);
            }
            
          }catch(e){
            console.log(e)
          }
          break
        case "failed":
          try{
            var notiService = this.props.global.notiService
            notiService.callFunc("changeStatusTx",newTx)

            if(this.props.account.account){
              this.props.global.analytics.callTrack("txMinedStatus", newTx.hash, "kyber", "transfer", "failed", this.props.account.account.address, this.props.account.account.type);
            }
          }catch(e){
            console.log(e)
          }
          break
        default:
          await sleep(5000)
          this.checkTxStatus(ethereum, tx)
          break
      }      
     
    }catch(err){
      console.log(err)
      await sleep(2000)
      this.checkTxStatus(ethereum, tx)
    }
    
  }
  
  handleCopy() {
    this.setState({
      isCopied: true
    })
    this.props.global.analytics.callTrack("trackClickCopyTx");
  }

  resetCopy() {
    this.setState({
      isCopied: false
    })
  }

  makeNewTransaction = (changeTransactionType = false) => {
    this.props.dispatch(transferActions.resetTransferPath())


    if (changeTransactionType) {
      var swapLink = constants.BASE_HOST + "/swap/" + this.props.exchange.sourceTokenSymbol.toLowerCase() + "_" + this.props.exchange.destTokenSymbol.toLowerCase();
      this.props.global.analytics.callTrack("trackClickNewTransaction", "Swap");
      this.props.dispatch(goToRoute(swapLink))
      if (window.kyberBus){ window.kyberBus.broadcast('go.to.swap') }
    } else {
      this.props.global.analytics.callTrack("trackClickNewTransaction", "Transfer");
    }
  }


  render() {
    var balanceInfo = {
      amount: this.props.transfer.amount,
      tokenSymbol: this.props.transfer.tokenSymbol,
      address: this.props.transfer.destAddress,
      destEthName: this.props.transfer.destEthName
    }

    var loadingView =
      <TransactionLoadingView
        broadcasting={this.props.transfer.broadcasting}
        error=""
        type="transfer"
        status={this.state.txStatus}
        txHash={this.props.transfer.tx.hash}
        balanceInfo={balanceInfo}
        makeNewTransaction={this.makeNewTransaction}
        translate={this.props.translate}
        analyze={this.props.global.analyze}
        address={this.props.account.address}
        isCopied={this.state.isCopied}
        handleCopy={this.handleCopy.bind(this)}
        resetCopy={this.resetCopy.bind(this)}
        analytics={this.props.global.analytics}
      />
    return (
      <Modal
        className={{
          base: 'reveal medium transaction-loading',
          afterOpen: 'reveal medium transaction-loading'
        }}
        isOpen={true}
        onRequestClose={(e) => this.makeNewTransaction(false)}
        contentLabel="confirm modal"
        content={loadingView}
        size="medium"
      />
    )
  }
}
