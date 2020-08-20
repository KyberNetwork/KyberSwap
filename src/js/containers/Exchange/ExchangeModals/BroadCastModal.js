import React from "react"
import { Modal } from "../../../components/CommonElement"
import { connect } from "react-redux"
import { getTranslate } from 'react-localize-redux'
import * as exchangeActions from "../../../actions/exchangeActions"
import { goToRoute } from "../../../actions/globalActions"
import constants from "../../../services/constants"
import * as converter from "../../../utils/converter"
import { sleep } from "../../../utils/common"
import { TransactionLoadingView } from "../../../components/Transaction"

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
      sourceAmount: 0,
      destAmount: 0,
      txStatus: "pending",
      isDebuging: false,
      isDebugComplete: false,
      errorTx: {}
    }
  }

  componentDidMount = () => {
    //update tx
    if (this.props.exchange.tx) {
      var ethereum = this.props.ethereum
      var tx = this.props.exchange.tx
      this.checkTxStatus(ethereum, tx)
    }
  }

  async checkTxStatus(ethereum, tx) {
    try {
      var newTx = await tx.sync(ethereum, tx)
      this.setState({ txStatus: newTx.status })
      switch(newTx.status){
        case "success": 
          const { srcAmount, destAmount } = await ethereum.call("extractExchangeEventData", newTx.eventTrade)

          const tokens = this.props.tokens
          const sourceDecimal = tokens[this.props.exchange.sourceTokenSymbol].decimals
          const destDecimal = tokens[this.props.exchange.destTokenSymbol].decimals 
          this.setState({
            sourceAmount: converter.toT(srcAmount, sourceDecimal),
            destAmount: converter.toT(destAmount, destDecimal)
          })
          if(this.props.account.account){
            this.props.global.analytics.callTrack("txMinedStatus", newTx.hash, "kyber", "swap", "success", this.props.account.account.address, this.props.account.account.type);
          }
          
          try{
            var notiService = this.props.global.notiService
            notiService.callFunc("changeStatusTx",newTx)
          }catch(e){
            console.log(e)
          }
          break
        case "failed":          
          try{
            var notiService = this.props.global.notiService
            notiService.callFunc("changeStatusTx",newTx)

            if(this.props.account.account){
              this.props.global.analytics.callTrack("txMinedStatus", newTx.hash, "kyber", "swap", "failed", this.props.account.account.address, this.props.account.account.type);
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
    } catch (err) {
      console.log(err)
      await sleep(5000)
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
    this.props.dispatch(exchangeActions.resetExchangePath())

    if (changeTransactionType) {
      const transferLink = constants.BASE_HOST + "/transfer/" + this.props.transfer.tokenSymbol.toLowerCase();
      this.props.global.analytics.callTrack("trackClickNewTransaction", "Transfer");
      this.props.dispatch(goToRoute(transferLink))
      if (window.kyberBus){ window.kyberBus.broadcast('go.to.transfer') }
    } else {
      this.props.global.analytics.callTrack("trackClickNewTransaction", "Swap");
    }
  }


  async debugError() {
    this.setState({isDebuging: true})
    try {
      var ethereum = this.props.ethereum
      var txHash = this.props.exchange.tx.hash
      var tx = await ethereum.call("getTx", txHash)

      var value = tx.value
      var owner = tx.from
      var gas_price = tx.gasPrice
      var blockNumber = tx.blockNumber

      var result = await ethereum.call("exactTradeData", tx.input)

      var source = result[0].value
      var srcAmount = result[1].value

      var dest = result[2].value
      var destAddress = result[3].value
      var maxDestAmount = result[4].value
      var minConversionRate = result[5].value
      var walletID = result[6].value
      var reserves = await ethereum.call("getListReserve")

      var receipt = await ethereum.call('txMined', txHash)

      var transaction = {
        gasUsed: receipt.gasUsed,
        status: receipt.status,
        gas: tx.gas
      }
      var input = {
        value, owner, gas_price, source, srcAmount, dest,
        destAddress, maxDestAmount, minConversionRate, walletID, reserves, txHash, transaction
      }
      
      var networkIssues = {}
      var gasCap = await ethereum.call("wrapperGetGasCap", blockNumber)

      if (!input.transaction.status || input.transaction.status == "0x0") {
        if (input.transaction.gas != 0 && (input.transaction.gasUsed / input.transaction.gas >= 0.95)) {
          networkIssues["gas_used"] = "Your transaction is run out of gas"
        }
      }

      if (converter.compareTwoNumber(input.gas_price, gasCap) === 1) {
        networkIssues["gas_price"] = this.props.translate('error.gas_price_exceeded_limit') || "Gas price exceeded max limit"
      }
      if (input.source !== constants.ETHER_ADDRESS) {
        if (converter.compareTwoNumber(input.value, 0) === 1) {
          networkIssues["token_ether"] = this.props.translate('error.issue_token_ether') || "Failed because of sending ether along the tx when it is trying to trade token to ether"
        }
        var remainStr = await ethereum.call("getAllowanceAtSpecificBlock", input.source, input.owner, blockNumber)
        if (converter.compareTwoNumber(remainStr, input.srcAmount) === -1) {
          networkIssues["allowance"] = this.props.translate('error.issue_allowance') || "Failed because allowance is lower than srcAmount"
        }
        var balance = await ethereum.call("getTokenBalanceAtSpecificBlock", input.source, input.owner, blockNumber)
        if (converter.compareTwoNumber(balance, input.srcAmount) === -1) {
          networkIssues["balance"] = this.props.translate('error.issue_balance') || "Failed because token balance is lower than srcAmount"
        }
      } else {
        if (converter.compareTwoNumber(input.value, input.srcAmount) !== 0) {
          networkIssues["ether_amount"] = this.props.translate('error.issue_ether_amount') || "Failed because the user didn't send the exact amount of ether along"
        }
      }

      if (input.source === constants.ETHER_ADDRESS) {
        var userCap = await ethereum.call("getMaxCapAtSpecificBlock", input.owner, blockNumber)
        if (converter.compareTwoNumber(input.srcAmount, userCap) === 1) {
          networkIssues["user_cap"] = translate('error.issue_user_cap') || "Failed because the source amount exceeded user cap"
        }
      }

      if (input.dest === constants.ETHER_ADDRESS) {
        var userCap = await ethereum.call("getMaxCapAtSpecificBlock", input.owner, blockNumber)
        if (input.destAmount > userCap) {
          networkIssues["user_cap"] = translate('error.issue_user_cap') || "Failed because the source amount exceeded user cap"
        }
      }

      //Reserve scops
      var rates = await ethereum.call("getRateAtLatestBlock", input.source, input.dest, input.srcAmount)
      if (converter.compareTwoNumber(rates.expectedPrice, 0) === 0) {
        var reasons = await ethereum.call("wrapperGetReasons", input.reserves[0], input, blockNumber)
        networkIssues["rateError"] = reasons
      } else {
        if (converter.compareTwoNumber(input.minConversionRate, rates.expectedPrice) === 1) {
          networkIssues["rateZero"] = translate('error.min_rate_too_high') || "Your min rate is too high!"
        }
      }

      this.setState({
        isDebuging: false,
        isDebugComplete: true,
        errorTx: networkIssues
      })
    } catch (err) {
      console.log(err)
      this.setState({
        isDebugComplete: true,
        isDebuging: false,
        errorTx: { "nohope": this.props.translate("transaction.error_no_reason") }
      })
    }

  }

  render() {
    var balanceInfo = {
      sourceAmount: this.state.sourceAmount,
      sourceTokenSymbol: this.props.exchange.sourceTokenSymbol,
      destAmount: this.state.destAmount,
      destTokenSymbol: this.props.exchange.destTokenSymbol,
    }

    var debug = {
      isDebuging : this.state.isDebuging,
      isDebugComplete: this.state.isDebugComplete,
      debugError: this.debugError.bind(this),
      errorTx: this.state.errorTx
    }

    var loadingView =
      <TransactionLoadingView
        broadcasting={this.props.exchange.broadcasting}
        error=""
        type="swap"
        status={this.state.txStatus}
        txHash={this.props.exchange.tx.hash}
        balanceInfo={balanceInfo}
        makeNewTransaction={this.makeNewTransaction}
        translate={this.props.translate}
        address={this.props.account.address}
        isCopied={this.state.isCopied}
        handleCopy={this.handleCopy.bind(this)}
        resetCopy={this.resetCopy.bind(this)}
        analytics={this.props.global.analytics}
        debug = {debug}
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
